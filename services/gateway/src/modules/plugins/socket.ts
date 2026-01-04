import Elysia from "elysia";
import type { ElysiaWS } from "elysia/ws";
import { env } from "@/lib/env";
import {
  isUserOnline,
  REDIS_KEYS,
  redisPub,
  redisSub,
  setUserOffline,
  setUserOnline,
  setUserStartTyping,
  setUserStopTyping,
} from "@/lib/redis";

interface messageType {
  content: string;
  type: string;
  userid: string;
}

type status = "pending" | "sent" | "delivered" | "read" | "failed";

interface DeliveryLog {
  messageId: string;
  recipientId: string;
  attempts: number;
  lastAttempt: number;
  deliveryStatus: status;
  error?: string;
}

const activeConnections = new Map<string, Set<ElysiaWS>>();
const deliveryLogs = new Map<string, DeliveryLog>();

redisSub.subscribe(
  [REDIS_KEYS.PRESENCE_CHANNEL, REDIS_KEYS.TYPING_CHANNEL],
  async (message, channel) => {
    const data = JSON.parse(message);
    if (channel === REDIS_KEYS.PRESENCE_CHANNEL) {
      await handlePresenceUpdate(data);
    }
    if (channel === REDIS_KEYS.TYPING_CHANNEL) {
      await handleTypingUpdate(data);
    }
  },
);

export const socket = new Elysia().ws("/ws", {
  async close(ws: any) {
    const userid = ws.data.user_id;

    if (userid) {
      const useConnections = activeConnections.get(userid);
      useConnections?.delete(ws);
      if (useConnections?.size === 0) {
        useConnections.delete(userid);
      }
      setUserOffline(userid, ws.id);
      const stillOnline = await isUserOnline(userid);
      if (!stillOnline) {
        // Publish offline status
        await redisPub.publish(
          REDIS_KEYS.PRESENCE_CHANNEL,
          JSON.stringify({
            lastSeen: Date.now(),
            status: "offline",
            userid,
          }),
        );
      }
      console.log(`User ${userid} disconnected (${ws.id})`);
    }
  },
  message(ws, message) {
    try {
      const data = typeof message === "string" ? JSON.parse(message) : message;
      switch (data.type) {
        case "authenticate":
          handleAuthenticate(ws, data);
          break;
        case "start_typing":
          setUserStartTyping(data);
          break;
        case "stop_typing":
          setUserStopTyping(data);
          break;
        case "send_message":
          handleSendMessage(ws, data);
          break;
        case "message_delivered":
          handleDeliveryConfirmation(ws, data);
          break;
        case "retry_message":
          handleRetryMessage(ws, data);
          break;
      }
    } catch (e) {
      console.log("e", e);
    }
  },
  open(ws: any) {
    console.log("Client connected:", ws.id);
  },
});

async function handlePresenceUpdate(data: any) {
  const { status, userId } = data;
  const userConnections = activeConnections.get(userId);
  if (userConnections) {
    userConnections.forEach((ws) => {
      ws.send(
        JSON.stringify({
          status,
          timestamp: Date.now(),
          type: "presence_update",
          userId,
        }),
      );
    });
  }
}

async function handleTypingUpdate(data: any) {
  const { receiver_id, user_id, typing } = data;
  const userConnections = activeConnections.get(receiver_id);
  if (userConnections) {
    userConnections.forEach((ws) => {
      ws.send(
        JSON.stringify({
          timestamp: Date.now(),
          typing,
          user_id,
        }),
      );
    });
  }
}

async function handleAuthenticate(ws: any, data: messageType) {
  try {
    const response = await fetch(
      `${env.GATEWAY_SERVICE_URL}/chat/message/user/${data.userid}`,
      { method: "GET" },
    );
    if (!response.ok) {
      ws.send(
        JSON.stringify({
          message: "Authentication failed",
          type: "auth_error",
        }),
      );
      return;
    }

    const userData = await response.json();
    ws.data.user_id = userData.id;

    if (!activeConnections.has(userData.id)) {
      activeConnections.set(userData.id, new Set());
    }
    activeConnections.get(userData.id)?.add(ws);

    setUserOnline(userData.id, ws.id);

    await redisPub.publish(
      REDIS_KEYS.PRESENCE_CHANNEL,
      JSON.stringify({
        status: "online",
        timestamp: Date.now(),
        userId: userData.id,
      }),
    );

    ws.send(
      JSON.stringify({
        type: "authenticated",
        user_id: userData.id,
      }),
    );
    console.log(`User ${userData.id} authenticated`);
  } catch (error) {
    console.log("handleAuthenticate  error", error);
    ws.send(
      JSON.stringify({
        message: "Authentication failed",
        type: "error",
      }),
    );
  }
}

async function handleDeliveryConfirmation(ws: any, data: any) {
  try {
    const response = await getMessageById(data.id);

    if (!response.ok) {
      ws.send(
        JSON.stringify({
          error: "no message found",
          messageId: data.id,
          timestamp: Date.now(),
          type: "status",
        }),
      );
      return;
    }
    const message = await response.json();
    if (message) {
      const senderWs = activeConnections.get(message.senderId);
      senderWs?.forEach((sws) => {
        sws.send(
          JSON.stringify({
            messageId: data.id,
            timestamp: Date.now(),
            type: "message_delivered",
          }),
        );
      });
      await updateMessageStatus(data.id, "delivered");
    }
  } catch (e) {
    console.log("e", e);
  }
}

async function handleRetryMessage(ws: any, data: any) {
  const startTime = Date.now();

  const response = await getMessageById(data.id);
  const message = await response.json();

  if (!message) {
    ws.send(
      JSON.stringify({
        message: "Message not found",
        type: "error",
      }),
    );
    return;
  }

  const deliveryLog = deliveryLogs.get(message.id);

  if (deliveryLog && deliveryLog.attempts >= 3) {
    ws.send(
      JSON.stringify({
        message: "Attempts are reached.",
        messageId: message.id,
        type: "retry_failed",
      }),
    );
    return;
  }

  // first send a message to sender
  try {
    ws.send(
      JSON.stringify({
        messageId: message.id,
        timestamp: Date.now(),
        type: "message_sent",
      }),
    );
  } catch (senderError) {
    console.error(senderError);
    // failed to send a confirmation to sender
    await logDeliveryAttempt(
      message.id,
      ws.data.user_id,
      "failed",
      "Failed to confirm to sender",
    );
  }

  // now try to deliver it to recipient
  const recipientWs = activeConnections.get(message.recipientId);

  if (!recipientWs || recipientWs.size === 0) {
    // is offline ?
    await updateMessageStatus(message.id, "pending", "Recipient offline");
    ws.send(
      JSON.stringify({
        messageId: message.id,
        reason: "recipient is offline, will be delivered when it gets online",
        status: "pending",
        type: "delivery_status",
      }),
    );
    return;
  }

  let deliveredCount = 0;
  const errors: string[] = [];

  const payload = JSON.stringify({
    message: message,
    timestamp: Date.now(),
    type: "new_message",
  });

  try {
    for (const recipientSocket of recipientWs) {
      recipientSocket.send(payload);
      deliveredCount++;
    }
  } catch (error) {
    // handle failure case
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    errors.push(errorMsg);
  }

  const deliveryStatus = deliveredCount > 0 ? "sent" : "failed";
  const errorDetails = errors.length ? errors.join(",") : "";

  await updateMessageStatus(message.id, deliveryStatus, errorDetails);
  await logDeliveryAttempt(
    message.id,
    message.recipientId,
    deliveryStatus,
    errorDetails,
  );
}

async function handleSendMessage(ws: any, data: any) {
  if (!ws.data.user_id) {
    ws.send(
      JSON.stringify({
        message: "Not authenticated",
        type: "error",
      }),
    );
    return;
  }

  let savedMessage: any = null;
  const startTime = Date.now();

  try {
    const response = await fetch(`${env.GATEWAY_SERVICE_URL}/chat/message`, {
      body: JSON.stringify({
        content: data.content,
        messageType: "TEXT",
        recipientId: data.receiver_id,
        senderId: ws.data.user_id,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to save message");
    }

    savedMessage = await response.json();

    const messageId = savedMessage.data[0].insertedId;
    // first send a message to sender
    try {
      ws.send(
        JSON.stringify({
          messageId: messageId,
          timestamp: Date.now(),
          type: "message_sent",
        }),
      );
    } catch (senderError) {
      // failed to send a confirmation to sender
      await logDeliveryAttempt(
        messageId,
        ws.data.user_id,
        "failed",
        "Failed to confirm to sender",
      );
    }

    // now try to deliver it to recipient
    const recipientWs = activeConnections.get(data.receiver_id);

    if (!recipientWs || recipientWs.size === 0) {
      // is offline ?
      await updateMessageStatus(messageId, "pending", "Recipient offline");
      ws.send(
        JSON.stringify({
          messageId: messageId,
          reason: "recipient is offline, will be delivered when it gets online",
          status: "pending",
          type: "delivery_status",
        }),
      );
      return;
    }

    let deliveredCount = 0;
    const errors: string[] = [];

    const payload = JSON.stringify({
      message: savedMessage,
      timestamp: Date.now(),
      type: "new_message", // receiver has to emit new event to sender, for
    });

    try {
      for (const recipientSocket of recipientWs) {
        recipientSocket.send(payload);
        deliveredCount++;
      }
    } catch (error) {
      // handle failure case
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      errors.push(errorMsg);
    }

    const deliveryStatus: status = deliveredCount > 0 ? "sent" : "failed";
    const errorDetails = errors.length ? errors.join(",") : "";

    await updateMessageStatus(messageId, deliveryStatus, errorDetails);
    await logDeliveryAttempt(
      messageId,
      data.receiver_id,
      deliveryStatus,
      errorDetails,
    );

    const duration = Date.now() - startTime;
    console.log("duration", duration);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown Error";

    if (savedMessage) {
      const messageId = savedMessage.data[0].insertedId;
      updateMessageStatus(messageId, "failed", errorMsg);
    }

    ws.send(
      JSON.stringify({
        canRetry: !!savedMessage,
        messageId: savedMessage?.data?.[0]?.insertedId,
        reason: "Failed to sent message.",
        status: "failed",
        type: "error",
      }),
    );
  }
}

async function updateMessageStatus(id: any, status: status, errorMsg?: string) {
  try {
    const response = await fetch(
      `${env.GATEWAY_SERVICE_URL}/chat/message/${id}`,
      {
        body: JSON.stringify({
          deliveryStatus: status,
          error: errorMsg,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      },
    );
    const mesages = await response.json();
    console.log("mesages", mesages);
    return mesages;
  } catch (e) {
    console.log("e", e);
  }
}

async function logDeliveryAttempt(
  messageId: string,
  recipientId: string,
  status: status,
  error?: string,
) {
  const log: DeliveryLog = deliveryLogs.get(messageId) || {
    attempts: 0,
    deliveryStatus: "pending",
    lastAttempt: 0,
    messageId,
    recipientId,
  };

  log.attempts++;
  log.lastAttempt = Date.now();
  if (status) log.deliveryStatus = status;
  if (error) log.error = "failed";

  deliveryLogs.set(messageId, log);

  try {
    await fetch(`${env.GATEWAY_SERVICE_URL}/chat/message/delivery-log`, {
      body: JSON.stringify(log),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  } catch (e) {
    console.log("error in delivery logs");
  }
}

async function getMessageById(id: string): Promise<any> {
  try {
    const response = await fetch(
      `${env.GATEWAY_SERVICE_URL}/chat/message/${id}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    return response;
  } catch (e) {
    console.log("e", e);
  }
}
