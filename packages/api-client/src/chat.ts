import { treaty } from "@elysiajs/eden";
import type { App } from "@service/chat/server";

export const chatClient = (url: string) => treaty<App>(`${url}/api/chat`);
