import { APIGatewayProxyEvent } from "../../common/common";
import {
  Response,
  NotImplementedError,
  UnexpectedError,
} from "../../common/common";

import { createThreadsInGroup, getMessagesInThread } from "./handlers";

const threadHandler = async (event: APIGatewayProxyEvent) => {
  switch (event.httpMethod) {
    case "POST":
      return await createThreadsInGroup(event);
    case "GET":
      return await getMessagesInThread(event);
    case "OPTIONS":
      return Response(200, {});
    default:
      return new NotImplementedError("Not implemented").response();
  }
};

export default threadHandler;
