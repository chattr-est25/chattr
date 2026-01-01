import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["active", "deleted"]);
export const chatTypeEnum = pgEnum("chat_type", ["INDIVIDUAL", "GROUP"]);
export const memberRoleEnum = pgEnum("member_role", ["ADMIN", "MEMBER"]);
export const messageTypeEnum = pgEnum("message_type", [
  "TEXT",
  "IMAGE",
  "VIDEO",
  "SYSTEM",
]);
export const messageStatusEnum = pgEnum("message_status", [
  "SENT",
  "DELIVERED",
  "READ",
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
  id: uuid("id").primaryKey().defaultRandom(),
  mediaId: uuid("media_id"),
  messageType: messageTypeEnum("message_type").notNull().default("TEXT"),
  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("active"),
  threadId: uuid("thread_id").references(() => threads.id),
  updatedAt: timestamp("updated_at"),
});

export const messageLogs = pgTable("message_logs", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("active"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const usersRelations = relations(users, ({ many }) => ({
  logs: many(messageLogs),
  received: many(messages, {
    relationName: "receiver",
  }),
  sent: many(messages, {
    relationName: "sender",
  }),
}));

export const threadsRelations = relations(threads, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  logs: many(messageLogs),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
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

export const messageLogsRelations = relations(messageLogs, ({ one }) => ({
  message: one(messages, {
    fields: [messageLogs.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [messageLogs.userId],
    references: [users.id],
  }),
}));

export const table = {
  messageLogs,
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
