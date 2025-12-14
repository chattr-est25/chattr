import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { openApiPluginOptions } from "lib/constants/openapi";
import { loggerPlugin } from "lib/plugins/logger";
import { env } from "@/lib/env";

export const plugins = new Elysia()
  .use(
    loggerPlugin({
      level: env.LOGGER_LEVEL,
      target: env.LOGGER_TARGET,
    }),
  )
  .use(
    openapi(
      openApiPluginOptions({
        enabled: env.NODE_ENV === "development",
      }),
    ),
  );
