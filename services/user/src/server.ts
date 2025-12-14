import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { openApiPluginOptions } from "lib/constants/openapi";
import { loggerPlugin } from "lib/plugins/logger";
import { env } from "@/lib/env";

export const app = new Elysia()
  .use(
    loggerPlugin({
      level: env.LOGGER_LEVEL,
      target: env.LOGGER_TARGET,
    }),
  )
  .use(
    openapi(
      openApiPluginOptions({
        enabled: env.NODE_ENV !== "production",
      }),
    ),
  )
  .get(
    "/ping",
    {
      status: "ok",
    },
    { detail: { summary: "ping user service", tags: ["user/health"] } },
  )

  .listen(3001);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
