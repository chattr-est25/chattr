import { apiClient } from "api-client";
import { env } from "./env";

export const api = apiClient(env.GATEWAY_SERVICE_URL);
