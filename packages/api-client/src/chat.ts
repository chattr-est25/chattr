import { treaty } from "@elysiajs/eden";
import type { App } from "../../../services/chat/src/server";

export const chatClient = (url: string) => treaty<App>(`${url}/chat`);
