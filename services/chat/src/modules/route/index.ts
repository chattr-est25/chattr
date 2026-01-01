import Elysia from "elysia";
import { healthRoutes } from "../health";
import { messageRoutes } from "../message";

export const routes = new Elysia({ prefix: "" })
  .use(healthRoutes)
  .use(messageRoutes);
