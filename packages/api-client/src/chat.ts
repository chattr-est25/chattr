import { treaty } from "@elysiajs/eden";
import type { App } from "../../../services/chat/src/server";

/**
 * Create a treaty client for the Chat service.
 *
 * @param url - Base service URL.
 * @returns Treaty client for the chat service.
 */
export const chatClient = (url: string) => treaty<App>(`${url}/chat`);
