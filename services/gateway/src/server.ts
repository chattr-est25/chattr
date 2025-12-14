import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import serverTiming from "@elysiajs/server-timing";
import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { loggerPlugin } from "lib/plugins/logger";
import { serviceProxy } from "lib/plugins/proxy";
import { env } from "@/lib/env";
import { openApiMergeHandler } from "./lib/openapi-merge";
import { serviceProxyConfig } from "./lib/service-config";

export const app = new Elysia()
  .use(
    loggerPlugin({
      level: env.LOGGER_LEVEL,
      target: env.LOGGER_TARGET,
    }),
  )
  .use(helmet())
  .use(cors())
  .use(serverTiming())
  .use(openapi())
  .use(serviceProxy(serviceProxyConfig.user))
  .use(serviceProxy(serviceProxyConfig.chat))
  .get("/openapi/json", openApiMergeHandler)
  .listen(3000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
