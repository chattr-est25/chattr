import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  runtimeEnv: Bun.env,
  server: {
    APP_ENV: z.enum(["local", "staging", "production"]).default("local"),
    HOST: z.string().default("localhost"),

    /* Logger */
    LOGGER_LEVEL: z
      .enum(["trace", "debug", "info", "warn", "error", "fatal"])
      .default("info"),
    LOGGER_TARGET: z.enum(["pino/file", "pino-pretty"]).default("pino-pretty"),
    PORT: z.coerce.number().min(3000).max(9999),
    /* Service */
    SERVICE_NAME: z.string().default("chat"),
  },
});
