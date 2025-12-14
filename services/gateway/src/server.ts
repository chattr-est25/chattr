import { Elysia } from "elysia";
import { health } from "@/modules/health";
import { env } from "./lib/env";
import { openapiSpec } from "./modules/openapi";
import { plugins } from "./modules/plugins";
import { proxy } from "./modules/proxy";

export const app = new Elysia()
  .use(plugins)
  .use(openapiSpec)
  .use(health)
  .use(proxy)
  .listen(env.PORT);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
