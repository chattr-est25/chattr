import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import serverTiming from "@elysiajs/server-timing";
import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { rateLimit } from "elysia-rate-limit";
import { openApiPluginOptions } from "lib/constants/openapi";
import { loggerPlugin } from "lib/plugins/logger";
import { env } from "@/lib/env";
import { helmetOptions } from "./constant";

export const plugsins = new Elysia()
  .use(
    loggerPlugin({
      level: env.LOGGER_LEVEL,
      target: env.LOGGER_TARGET,
    }),
  )
  .use(helmet(helmetOptions))
  .use(rateLimit())
  .use(cors())
  .use(serverTiming())
  .use(
    openapi(
      openApiPluginOptions({
        enabled: env.NODE_ENV === "development",
        url: "/openapi/json/all",
      }),
    ),
  );
