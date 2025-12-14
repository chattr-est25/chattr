import { isErrorResult, merge } from "openapi-merge";
import { api } from "@/lib/client";
import { log } from "@/lib/logger";
import { serviceProxyConfig } from "@/modules/proxy/constant";
import { tagGroups } from "./constant";

export const mergeOpenApiSpecs = async () => {
  const baseSpec = {
    oas: {
      info: {
        description: "OpenAPI Docs for Chattr Microservices",
        title: "Chattr Microservices",
        version: "1.0.0",
      },
      openapi: "3.0.3",
      paths: {},
      "x-tagGroups": tagGroups,
    },
  };

  const results = await Promise.allSettled([
    // @ts-expect-error not typed
    api.gateway.openapi.json.get(),
    // @ts-expect-error not typed
    api.user.openapi.json.get(),
    // @ts-expect-error not typed
    api.chat.openapi.json.get(),
  ]);

  const mergeInputs: Parameters<typeof merge>[0] = [baseSpec];

  // GATEWAY SERVICE
  if (results[0].status === "fulfilled") {
    const gatewayOpenApi = results[0].value?.data;
    if (gatewayOpenApi) {
      mergeInputs.push({
        oas: gatewayOpenApi,
      });
    }
  } else {
    log.warn(
      { error: results[0].reason },
      "Gateway service OpenAPI not available",
    );
  }

  // USER SERVICE
  if (results[1].status === "fulfilled") {
    const userOpenApi = results[1].value?.data;
    if (userOpenApi) {
      mergeInputs.push({
        oas: userOpenApi,
        pathModification: {
          prepend:
            serviceProxyConfig.user.pathRewrite?.prependPrefix ?? "/user",
        },
      });
    }
  } else {
    log.warn(
      { error: results[1].reason },
      "User service OpenAPI not available",
    );
  }

  // CHAT SERVICE
  if (results[2].status === "fulfilled") {
    const chatOpenApi = results[2].value?.data;
    if (chatOpenApi) {
      mergeInputs.push({
        oas: chatOpenApi,
        pathModification: {
          prepend:
            serviceProxyConfig.chat.pathRewrite?.prependPrefix ?? "/chat",
        },
      });
    }
  } else {
    log.warn(
      { error: results[2].reason },
      "Chat service OpenAPI not available",
    );
  }

  // Nothing to merge except base
  if (mergeInputs.length === 1) {
    log.warn("No downstream OpenAPI specs found, returning base spec");
    return baseSpec.oas;
  }

  const mergeResult = merge(mergeInputs);

  if (isErrorResult(mergeResult)) {
    log.error(
      { error: mergeResult },
      `${mergeResult.message} (${mergeResult.type})`,
    );
    return baseSpec.oas;
  }

  return mergeResult.output;
};
