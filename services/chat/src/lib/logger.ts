import { logger } from "lib/plugins/logger";
import { env } from "./env";

export const log = logger({
  level: env.LOGGER_LEVEL,
  target: env.LOGGER_TARGET,
});
