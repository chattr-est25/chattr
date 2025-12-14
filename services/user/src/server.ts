import { logger } from "@bogeychan/elysia-logger";
import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";

export const app = new Elysia({ prefix: "/api" })
  .use(
    logger({
      level: "info",
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
