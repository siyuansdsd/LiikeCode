import userHandler from "./handler/user/index";
import { APIGatewayProxyEvent } from "./common/common";
import dotenv from "dotenv";
import { NotImplementedError } from "./common/common";
import groupHandler from "./handler/group";
import threadHandler from "./handler/thread";

import {
  connectToWss,
  disconnectToWss,
  sendMessage,
} from "./handler/message/handlers";

dotenv.config();

export const httpHandler = (event: APIGatewayProxyEvent) => {
  const path = event.path;
  const secondSlashIndex = path.indexOf("/", 1);
  const prefix =
    secondSlashIndex !== -1
      ? path.substring(0, secondSlashIndex) + "/*"
      : path + "/*";
  switch (prefix) {
    case "/users/*":
      return userHandler(event);
    case "/threads/*":
      return threadHandler(event);
    case "/groups/*":
      return groupHandler(event);
    default:
      return new NotImplementedError("Not implemented").response();
  }
};

export const disconnectHandler = async (event: any) => {
  return disconnectToWss(event);
};

export const defaultHandler = async (event: any) => {
  return sendMessage(event);
};

export const connectHandler = async (event: any) => {
  return connectToWss(event);
};
