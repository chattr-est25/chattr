import Elysia from "elysia";
import { ErrorValidation } from "@/lib/error";
import { messageBody } from "./model";
import { createMessage } from "./service";

const tags = ["chat/message"];

export const messageRoutes = new Elysia({ prefix: "/message" })
  .get("/", () => ({ status: "List of messages" }), {
    detail: { summary: "List chat message", tags },
  })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        console.log("Received message payload:", body);
        const savedMessage = await createMessage(body);
        set.status = 201;
        return { data: savedMessage, status: "Message sent successfully." };
      } catch (error) {
        if (error instanceof ErrorValidation) {
          set.status = error.status;
          return { message: error.message, status: "error" };
        }
        console.error("Unexpected error:", error);
        set.status = 500;
        return { message: "An unexpected error occurred.", status: "error" };
      }
    },
    {
      body: messageBody,
      detail: {
        summary: "Send a new message",
        tags,
      },
    },
  );
