import type { ElysiaOpenAPIConfig } from "@elysiajs/openapi";

export const openApiPluginOptions = (options: {
  enabled?: boolean;
  url?: string;
}): ElysiaOpenAPIConfig => ({
  documentation: {
    info: {
      description: "OpenAPI Docs for Chattr Microservices",
      title: "Chattr Microservices",
      version: "1.0.0",
    },
    openapi: "3.0.3",
  },
  enabled: options.enabled || true,
  scalar: {
    darkMode: true,
    favicon: "https://elysiajs.com/assets/elysia.svg",
    hideClientButton: true,
    metaData: {
      description: "Chattr API docs",
      ogImage: "https://elysiajs.com/assets/elysia.svg",
      ogTitle: "Chattr API docs",
      title: "Chattr API docs",
      twitterCard: "summary_large_image",
    },
    persistAuth: true,
    telemetry: false,
    theme: "saturn",
    url: options.url ?? "/openapi/json",
  },
});
