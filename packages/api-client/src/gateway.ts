import { treaty } from "@elysiajs/eden";
import type { App } from "../../../services/gateway/src/server";

export const gatewayClient = (url: string) => treaty<App>(`${url}`);
