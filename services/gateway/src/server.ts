import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { loggerPlugin } from "lib/plugins/logger";
import { serviceProxy } from "lib/plugins/proxy";
import { env } from "@/lib/env";
import { serviceProxyConfig } from "./lib/service-config";

export const app = new Elysia({ prefix: "/api" })
  .use(
    loggerPlugin({
      level: env.LOGGER_LEVEL,
      target: env.LOGGER_TARGET,
    }),
  )
  .use(cors())
  .use(openapi())
  .use(serviceProxy(serviceProxyConfig.user))
  .use(serviceProxy(serviceProxyConfig.chat))
  .listen(3000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
