import { treaty } from "@elysiajs/eden";
import type { App } from "../../../services/gateway/src/server";

/**
 * Create a treaty client for the Gateway service.
 *
 * @param url - Base service URL.
 * @returns Treaty client for the gateway service.
 */
export const gatewayClient = (url: string) => treaty<App>(`${url}`);
