import { Elysia } from "elysia";

export interface ServiceProxyOptions {
  /** Logical service name (used by Elysia, logs, metrics) */
  name: string;

  /** Incoming route pattern (Elysia path) */
  route: string;

  /** Base URL of the target service */
  target: string;

  /** Path handling rules */
  pathRewrite?: {
    /** Strip this prefix from incoming request path */
    stripPrefix?: string;

    /** Prepend this prefix when forwarding */
    prependPrefix?: string;
  };

  /** Request timeout (ms) */
  timeout?: number;

  /** Forward selected headers only */
  forwardHeaders?: string[] | "all";

  /** Hook to mutate outgoing request */
  onRequest?: (req: Request) => Request;
}

export const serviceProxy = (options: ServiceProxyOptions) =>
  new Elysia({ name: options.name }).all(
    options.route,
    async ({ request, path }) => {
      const {
        target,
        pathRewrite,
        forwardHeaders = "all",
        timeout,
        onRequest,
      } = options;

      // ---- Path rewrite ----
      let forwardPath = path;

      if (pathRewrite?.stripPrefix) {
        forwardPath = forwardPath.replace(pathRewrite.stripPrefix, "");
      }

      if (pathRewrite?.prependPrefix) {
        forwardPath = `${pathRewrite.prependPrefix}${forwardPath}`;
      }

      const url = new URL(forwardPath, target);

      // ---- Headers ----
      const headers =
        forwardHeaders === "all"
          ? request.headers
          : new Headers(
              [...request.headers].filter(([key]) =>
                forwardHeaders.includes(key),
              ),
            );

      // ---- Request ----
      let proxyRequest = new Request(url.href, {
        body: request.body,
        headers,
        method: request.method,
        signal: timeout ? AbortSignal.timeout(timeout) : null,
      });

      if (onRequest) {
        proxyRequest = onRequest(proxyRequest);
      }

      return fetch(proxyRequest);
    },
  );
