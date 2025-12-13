import { treaty } from "@elysiajs/eden";
import type { App } from "@service/gateway/server";

export const gatewayClient = (url: string) => treaty<App>(`${url}/api`);
