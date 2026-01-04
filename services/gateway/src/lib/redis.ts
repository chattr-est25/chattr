import { RedisClient } from "bun";
import { env } from "./env";

const client = new RedisClient(env.REDIS_URL);
export const redisPub = new RedisClient(env.REDIS_URL);
export const redisSub = new RedisClient(env.REDIS_URL);

export const REDIS_KEYS = {
  ONLINE_USERS: "online:users",
  PRESENCE_CHANNEL: `presence:status`,
  TYPING: (userId: string) => `typing:${userId}`,
  TYPING_CHANNEL: `typing:events`,
  USER_CONNECTIONS: (userId: string) => `connectins:user:${userId}`,
  USER_ONLINE: (userId: string) => `online:user:${userId}`,
};

export async function setUserOnline(userId: string, connectionId: string) {
  client.sadd(REDIS_KEYS.ONLINE_USERS, userId);
  client.sadd(REDIS_KEYS.USER_CONNECTIONS(userId), connectionId);
  client.expire(REDIS_KEYS.USER_CONNECTIONS(userId), 300);
  client.hset(REDIS_KEYS.USER_ONLINE(userId), {
    connectionId,
    lastSeen: Date.now(),
    status: "online",
  });
  client.expire(REDIS_KEYS.USER_ONLINE(userId), 300);
}

export async function setUserOffline(userId: string, connectionId: string) {
  console.log("setUserOffline");
  client.srem(REDIS_KEYS.USER_CONNECTIONS(userId), connectionId);

  const connections = await client.smembers(
    REDIS_KEYS.USER_CONNECTIONS(userId),
  );
  console.log("connections", connections.length);
  if (connections.length === 0) {
    client.hset(REDIS_KEYS.USER_ONLINE(userId), {
      lastSeen: Date.now(),
      status: "offline",
    });
    client.expire(REDIS_KEYS.USER_ONLINE(userId), 84600);
    client.srem(REDIS_KEYS.ONLINE_USERS, userId);
  }
}

export async function isUserOnline(userId: string) {
  return client.sismember(REDIS_KEYS.ONLINE_USERS, userId);
}

export async function setUserStartTyping(data: any) {
  client.setex(REDIS_KEYS.TYPING(data.user_id), 10, data.receiver_id);

  await redisPub.publish(
    REDIS_KEYS.TYPING_CHANNEL,
    JSON.stringify({
      receiver_id: data.receiver_id,
      timestamp: Date.now(),
      typing: true,
      user_id: data.user_id,
    }),
  );
}

export async function setUserStopTyping(data: any) {
  client.del(REDIS_KEYS.TYPING(data.user_id));

  await redisPub.publish(
    REDIS_KEYS.TYPING_CHANNEL,
    JSON.stringify({
      receiver_id: data.receiver_id,
      timestamp: Date.now(),
      typing: false,
      user_id: data.user_id,
    }),
  );
}
