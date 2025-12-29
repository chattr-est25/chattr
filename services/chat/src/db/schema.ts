import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["active", "deleted"]);
export const chatTypeEnum = pgEnum("chat_type", ["individual", "group"]);
export const memberRoleEnum = pgEnum("member_role", ["admin", "member"]);
export const messageTypeEnum = pgEnum("message_type", [
  "text",
  "image",
  "video",
  "system",
]);
export const deliveryStatusEnum = pgEnum("message_status", [
  "pending",
  "sent",
  "delivered",
  "read",
  "failed",
]);

// temp added, not required in this service
export const users = pgTable("users", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 24 }).notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom(),
  status: statusEnum().notNull().default("active"),
  username: varchar("username", { length: 24 }).notNull().unique(),
});

export const threads = pgTable("threads", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id").notNull(), // parent message
  status: statusEnum().notNull().default("active"),
  updatedAt: timestamp("updated_at"),
});

export const messages = pgTable("messages", {
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  deliveryAttempt: timestamp("delivery_attempt"),
  deliveryStatus: deliveryStatusEnum().default("pending"),
  error: text("error"),
  id: uuid("id").primaryKey().defaultRandom(),
  lastAttempt: timestamp("last_attempt"),
  mediaId: uuid("media_id"),
  messageType: messageTypeEnum("message_type").notNull().default("text"),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("active"),
  threadId: uuid("thread_id").references(() => threads.id),
  updatedAt: timestamp("updated_at"),
});

export const deliveryLogs = pgTable("delivery_logs", {
  attempts: integer().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deliveryStatus: deliveryStatusEnum().default("pending"),
  description: text("description"),
  id: uuid("id").primaryKey().defaultRandom(),
  lastAttempt: timestamp("last_attempt"),
  messageId: uuid("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("active"),
});

export const usersRelations = relations(users, ({ many }) => ({
  logs: many(deliveryLogs),
  received: many(messages, {
    relationName: "recipient",
  }),
  sent: many(messages, {
    relationName: "sender",
  }),
}));

export const threadsRelations = relations(threads, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  logs: many(deliveryLogs),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: "recipient",
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.id],
  }),
}));

export const messageLogsRelations = relations(deliveryLogs, ({ one }) => ({
  message: one(messages, {
    fields: [deliveryLogs.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [deliveryLogs.recipientId],
    references: [users.id],
  }),
}));

export const table = {
  deliveryLogs,
  messages,
  threads,
  users,
} as const;

export const relationship = {
  messageLogsRelations,
  messagesRelations,
  threadsRelations,
  usersRelations,
} as const;

export type Table = typeof table;
