import { Elysia } from "elysia";

export const healthRoutes = new Elysia().get(
  "/ping",
  {
    status: "ok",
  },
  { detail: { summary: "ping chat service", tags: ["chat/health"] } },
);
