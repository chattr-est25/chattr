import { treaty } from "@elysiajs/eden";
import type { App } from "../../../services/user/src/server";

/**
 * Create a treaty client for the User service.
 *
 * @param url - Base service URL.
 * @returns Treaty client for the user service.
 */
export const userClient = (url: string) => treaty<App>(`${url}/user`);
