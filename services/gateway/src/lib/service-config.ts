import type { ServiceProxyOptions } from "lib/plugins/proxy";
import { env } from "./env";

export const Services = {
  chat: "chat",
  user: "user",
} as const;

type Services = keyof typeof Services;

export const serviceProxyConfig: Record<Services, ServiceProxyOptions> = {
  chat: {
    name: "chat",
    pathRewrite: {
      prependPrefix: "/api",
      stripPrefix: "/api/chat",
    },
    route: "/chat/*",
    target: env.CHAT_SERVICE_URL,
    timeout: 5000,
  },
  user: {
    name: "user",
    pathRewrite: {
      prependPrefix: "/api",
      stripPrefix: "/api/user",
    },
    route: "/user/*",
    target: env.USER_SERVICE_URL,
    timeout: 5000,
  },
};
