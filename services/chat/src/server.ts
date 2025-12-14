import { Elysia } from "elysia";
import { health } from "./modules/health";
import { plugins } from "./modules/plugins";

export const app = new Elysia().use(plugins).use(health).listen(3002);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
