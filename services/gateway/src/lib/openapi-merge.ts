import { isErrorResult, merge } from "openapi-merge";
import { api } from "./client";
import { log } from "./logger";
import { serviceProxyConfig } from "./service-config";

export const openApiMergeHandler = async () => {
  const baseSpec = {
    oas: {
      info: {
        description: "OpenAPI Docs for Chattr Microservices",
        title: "Chattr Microservices",
        version: "1.0.0",
      },
      openapi: "3.0.3",
      paths: {},
    },
  };

  const results = await Promise.allSettled([
    // @ts-expect-error not typed
    api.user.openapi.json.get(),
    // @ts-expect-error not typed
    api.chat.openapi.json.get(),
  ]);

  const mergeInputs: Parameters<typeof merge>[0] = [baseSpec];

  // USER SERVICE
  if (results[0].status === "fulfilled") {
    const userOpenApi = results[0].value?.data;
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
      { error: results[0].reason },
      "User service OpenAPI not available",
    );
  }

  // CHAT SERVICE
  if (results[1].status === "fulfilled") {
    const chatOpenApi = results[1].value?.data;
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
      { error: results[1].reason },
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
