import { treaty } from "@elysiajs/eden";
import type { App } from "@service/user/server";

export const userClient = (url: string) => treaty<App>(`${url}/api/user`);
