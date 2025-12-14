import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
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
    openapi({
      documentation: {
        info: {
          title: "Chattr chat service",
          version: "1.0.0",
        },
      },
    }),
  )
  .get("/ping", {
    message: "Welcome to Chat service!",
  })
  .listen(3002);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
