import { Elysia } from "elysia";

export const health = new Elysia().get("/ping", () => ({ status: "ok" }), {
  detail: { summary: "Ping gateway service" },
  tags: ["gateway/health"],
});
