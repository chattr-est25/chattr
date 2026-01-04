/** biome-ignore-all assist/source/useSortedKeys: custom order */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  runtimeEnv: Bun.env,
  server: {
    /* Service */
    SERVICE_NAME: z.string().default("chat"),
    NODE_ENV: z
      .enum(["development", "staging", "production"])
      .default("development"),
    HOST: z.string().default("localhost"),
    PORT: z.coerce.number().min(3000).max(9999),

    /* Logger */
    LOGGER_LEVEL: z
      .enum(["trace", "debug", "info", "warn", "error", "fatal"])
      .default("info"),
    LOGGER_TARGET: z.enum(["pino/file", "pino-pretty"]).default("pino-pretty"),

    /* Gateway */
    GATEWAY_SERVICE_URL: z.url(),
    USER_SERVICE_URL: z.url(),
    CHAT_SERVICE_URL: z.url(),

    /* Redis */
    REDIS_URL: z.url(),
  },
});
