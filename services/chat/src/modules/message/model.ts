import { type Static, t } from "elysia";

export const messageBody = t.Object({
  content: t.String(),
  messageType: t.String({ default: "TEXT" }),
  receiverId: t.String({ format: "uuid" }),
  senderId: t.String({ format: "uuid" }),
});

export type MessageBody = Static<typeof messageBody>;
