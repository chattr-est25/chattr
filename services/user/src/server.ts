import { Elysia } from "elysia";
import { env } from "./lib/env";
import { health } from "./modules/health";
import { plugins } from "./modules/plugins";

export const app = new Elysia().use(plugins).use(health).listen(env.PORT);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
