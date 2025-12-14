import {
  createPinoLogger,
  logger as elysiaLogger,
} from "@bogeychan/elysia-logger";
import { Elysia } from "elysia";
import z from "zod";

export const loggerLevelSchema = z
  .enum(["trace", "debug", "info", "warn", "error", "fatal"])
  .default("info");

export type LoggerLevel = z.infer<typeof loggerLevelSchema>;

export const loggerTargetSchema = z
  .enum(["pino/file", "pino-pretty"])
  .default("pino-pretty");

export type LoggerTarget = z.infer<typeof loggerTargetSchema>;

export interface CreateLoggerOptions {
  level: LoggerLevel;
  target: LoggerTarget;
}

const createLoggerOptions = (options: CreateLoggerOptions) => ({
  level: options.level,
  transport: {
    options: { colorize: true, translateTime: true },
    target: options.target,
  },
});

export const logger = (
  options: CreateLoggerOptions = {
    level: "info",
    target: Bun.env.APP_ENV === "local" ? "pino-pretty" : "pino/file",
  },
) => createPinoLogger(createLoggerOptions(options));

export const log = logger();

export const loggerPlugin = (options: CreateLoggerOptions) =>
  new Elysia().use(elysiaLogger(createLoggerOptions(options)));
