import { Elysia } from "elysia";
import { health } from "@/modules/health";
import { openapiSpec } from "./modules/openapi";
import { plugsins } from "./modules/plugins";
import { proxy } from "./modules/proxy";

export const app = new Elysia()
  .use(plugsins)
  .use(openapiSpec)
  .use(health)
  .use(proxy)
  .listen(3000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
