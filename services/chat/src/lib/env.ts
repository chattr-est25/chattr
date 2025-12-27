/** biome-ignore-all assist/source/useSortedKeys: env */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  runtimeEnv: Bun.env,
  server: {
    /* Service */
    SERVICE_NAME: z.string().default("chat"),
    HOST: z.string().default("localhost"),
    NODE_ENV: z
      .enum(["development", "staging", "production"])
      .default("development"),
    PORT: z.coerce.number().min(3000).max(9999),
    /* Logger */
    LOGGER_LEVEL: z
      .enum(["trace", "debug", "info", "warn", "error", "fatal"])
      .default("info"),
    LOGGER_TARGET: z.enum(["pino/file", "pino-pretty"]).default("pino-pretty"),

    /* DB  */
    DATABASE_URL: z.url(),
  },
});
