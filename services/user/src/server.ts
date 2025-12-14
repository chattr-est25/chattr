import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { logger } from "lib/plugins/logger";
import { env } from "@/lib/env";

export const app = new Elysia({ prefix: "/api" })
  .use(
    logger({
      level: env.LOGGER_LEVEL,
      target: env.LOGGER_TARGET,
    }),
  )
  .use(openapi())
  .get("/ping", {
    message: "Welcome to User service!",
  })
  .listen(3001);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
