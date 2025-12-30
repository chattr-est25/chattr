import { type Static, t } from "elysia";
import { deliveryStatusEnum } from "@/db/schema";

const deliveryStatusEnums = Object.fromEntries(
  deliveryStatusEnum.enumValues.map((value) => [value, value]),
);

export const messageBody = t.Object({
  content: t.String(),
  deliveryStatus: t.Optional(t.Enum(deliveryStatusEnums)),
  error: t.Optional(t.String()),
  messageType: t.String({ default: "TEXT" }),
  recipientId: t.String({ format: "uuid" }),
  senderId: t.String({ format: "uuid" }),
});

export const patchMessagebody = t.Partial(
  t.Pick(messageBody, ["deliveryStatus", "error"]),
);

export const deliveryLogBody = t.Object({
  attempts: t.Integer({ default: 0 }),
  deliveryStatus: t.Enum(deliveryStatusEnums),
  messageId: t.String({ format: "uuid" }),
  recipientId: t.String({ format: "uuid" }),
});

export type MessageBody = Static<typeof messageBody>;
export type DeliveryLogBody = Static<typeof deliveryLogBody>;
export type PatchMessageBody = Static<typeof patchMessagebody>;
