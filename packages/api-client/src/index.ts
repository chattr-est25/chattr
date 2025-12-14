import { chatClient } from "./chat";
import { gatewayClient } from "./gateway";
import { userClient } from "./user";

/**
 * Create aggregated API clients for available services.
 *
 * @param url - Base server URL.
 * @returns Object with `chat`, `gateway`, and `user` clients.
 */
export const apiClient = (url: string) => {
  return {
    chat: chatClient(url),
    gateway: gatewayClient(url),
    user: userClient(url),
  };
};
