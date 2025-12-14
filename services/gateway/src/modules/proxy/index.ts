import { Elysia } from "elysia";
import { serviceProxy } from "lib/plugins/proxy";
import { serviceProxyConfig } from "./constant";

export const proxy = new Elysia()
  .use(serviceProxy(serviceProxyConfig.user))
  .use(serviceProxy(serviceProxyConfig.chat));
