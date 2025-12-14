import { logger } from "@bogeychan/elysia-logger";
import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";

const PROXY_TARGET = "http://localhost:3001";

export const app = new Elysia({ prefix: "/api" })
  .use(
    logger({
      level: "debug",
    }),
  )
  .use(openapi())
  .get("/ping", {
    message: "Welcome to gateway service!",
  })
  .all("/user/*", ({ request, path }) => {
    console.log("request", request);
    // Extract the path relative to the proxy route
    const relativePath = path.replace("/api/user", "/api");
    const targetUrl = new URL(relativePath, PROXY_TARGET);

    // Recreate the request to the target server
    // Note: Carefully manage headers (e.g., Host, X-Real-IP) as needed
    const proxyRequest = new Request(targetUrl.href, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // Fetch the response from the target and return it directly
    return fetch(proxyRequest);
  })
  .listen(3000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
