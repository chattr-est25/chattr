import { Elysia } from "elysia";

export const health = new Elysia().get(
  "/ping",
  {
    status: "ok",
  },
  { detail: { summary: "ping user service", tags: ["user/health"] } },
);
