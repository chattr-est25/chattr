import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { ErrorValidation } from "@/lib/error";
import type { MessageBody } from "./model";

export const findMembers = async (user_id: string) => {
  return await db.query.users.findMany({
    where: and(eq(users.id, user_id), eq(users.status, "active")),
  });
};

export const createMessage = async (payload: MessageBody) => {
  const { senderId, receiverId, content } = payload;

  if (senderId === receiverId) {
    throw new ErrorValidation(
      "Sender and receiver cannot be the same user.",
      400,
    );
  }

  if (!content.trim()) {
    throw new ErrorValidation("Message content cannot be empty.", 400);
  }

  const [fromUser, toUser] = await Promise.all([
    findMembers(senderId),
    findMembers(receiverId),
  ]);

  if (fromUser.length === 0) {
    throw new ErrorValidation("Sender not found or is not active.", 404);
  }

  if (toUser.length === 0) {
    throw new ErrorValidation("Receiver not found or is not active.", 404);
  }

  return await db
    .insert(messages)
    .values({ ...payload, id: crypto.randomUUID(), messageType: "TEXT" })
    .returning();
};
