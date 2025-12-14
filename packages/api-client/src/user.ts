import { treaty } from "@elysiajs/eden";
import type { App } from "../../../services/user/src/server";

export const userClient = (url: string) => treaty<App>(`${url}/user`);
