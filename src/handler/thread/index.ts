import { APIGatewayProxyEvent } from "../../common/common";
import {
  Response,
  NotImplementedError,
  UnexpectedError,
} from "../../common/common";

import { createThreadsInGroup } from "./handlers";

const threadHandler = async (event: APIGatewayProxyEvent) => {
  switch (event.httpMethod) {
    case "POST":
      return await createThreadsInGroup(event);
      break;
    case "OPTIONS":
      return Response(200, {});
      break;
    default:
      return new NotImplementedError("Not implemented").response();
  }
};

export default threadHandler;
