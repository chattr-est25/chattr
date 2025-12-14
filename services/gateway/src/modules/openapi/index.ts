import { Elysia } from "elysia";
import { mergeOpenApiSpecs } from "./service";

export const openapiSpec = new Elysia().get(
  "/openapi/json/all",
  mergeOpenApiSpecs,
  {
    detail: { hide: true },
  },
);
