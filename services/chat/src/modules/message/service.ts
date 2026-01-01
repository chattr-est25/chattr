import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { deliveryLogs, messages, users } from "@/db/schema";
import { ErrorValidation } from "@/lib/error";
import type { DeliveryLogBody, MessageBody, PatchMessageBody } from "./model";

export const findMember = async (user_id: string) => {
  return await db.query.users.findFirst({
    where: and(eq(users.id, user_id), eq(users.status, "active")),
  });
};

export const getMessageById = async (id: string) => {
  return await db.query.messages.findFirst({
    where: and(eq(messages.id, id), eq(messages.status, "active")),
  });
};

export const updateMessageById = async (id: string, body: PatchMessageBody) => {
  return await db
    .update(messages)
    .set({
      deliveryStatus: body.deliveryStatus,
      error: body?.error,
    })
    .where(and(eq(messages.id, id), eq(messages.status, "active")));
};

export const createMessage = async (payload: MessageBody) => {
  try {
    const { senderId, recipientId, content } = payload;

    if (senderId === recipientId) {
      throw new ErrorValidation(
        "Sender and receiver cannot be the same user.",
        400,
      );
    }

    if (!content.trim()) {
      throw new ErrorValidation("Message content cannot be empty.", 400);
    }

    const [fromUser, toUser] = await Promise.all([
      findMember(senderId),
      findMember(recipientId),
    ]);

    if (!fromUser) {
      throw new ErrorValidation("Sender not found or is not active.", 404);
    }

    if (!toUser) {
      throw new ErrorValidation("Receiver not found or is not active.", 404);
    }

    const message = await db
      .insert(messages)
      .values({ ...payload, messageType: "text" })
      .returning({ insertedId: messages.id });

    const logs: DeliveryLogBody = {
      attempts: 0,
      deliveryStatus: "pending",
      messageId: message[0]?.insertedId || "",
      recipientId: recipientId,
    };

    await db.insert(deliveryLogs).values(logs);

    return message;
  } catch (e) {
    console.log("e", e);
    throw new ErrorValidation("Internal server error", 500);
  }
};

export const deliveryLog = async (payload: DeliveryLogBody) => {
  return await db.insert(deliveryLogs).values(payload);
};
