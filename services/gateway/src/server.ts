import { Elysia } from "elysia";
import { health } from "@/modules/health";
import { env } from "./lib/env";
import { openapiSpec } from "./modules/openapi";
import { plugins } from "./modules/plugins";
import { socket } from "./modules/plugins/socket";
import { proxy } from "./modules/proxy";

export const app = new Elysia()
  .use(socket)
  .use(plugins)
  .use(openapiSpec)
  .use(health)
  .use(proxy)
  .listen(env.PORT);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
