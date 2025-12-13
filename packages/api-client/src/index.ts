import { chatClient } from "./chat";
import { gatewayClient } from "./gateway";
import { userClient } from "./user";

export const apiClient = (url: string) => {
  return {
    user: userClient(url),
    chat: chatClient(url),
    gateway: gatewayClient(url),
  };
};
