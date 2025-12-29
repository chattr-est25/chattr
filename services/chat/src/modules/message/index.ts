import Elysia from "elysia";
import { ErrorValidation } from "@/lib/error";
import { deliveryLogBody, messageBody } from "./model";
import {
  createMessage,
  deliveryLog,
  findMember,
  getMessageById,
} from "./service";

const tags = ["chat/message"];

export const messageRoutes = new Elysia({ prefix: "/message" })
  .get(
    "/:id",
    ({ params }) => {
      return getMessageById(params.id);
    },
    {
      detail: { summary: "get chat message", tags },
    },
  )
  .get(
    "/user/:userid",
    ({ params }) => {
      const user = findMember(params.userid);
      return user;
    },
    {
      detail: { summary: "get user", tags },
    },
  )
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
  )
  .post(
    "/delivery-log",
    async ({ body, set }) => {
      try {
        const payload = {
          attempts: body.attempts,
          deliveryStatus: body.deliveryStatus, // from payload
          messageId: body.messageId,
          recipientId: body.recipientId,
        };
        console.log("Received message payload:", payload);
        const savedLogs = await deliveryLog(payload);
        set.status = 201;
        return {
          data: payload,
          status: `Log ${(body.deliveryStatus).toLowerCase()} successfully.`,
        };
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
      body: deliveryLogBody,
      detail: {
        summary: "Send a new log",
        tags,
      },
    },
  );
