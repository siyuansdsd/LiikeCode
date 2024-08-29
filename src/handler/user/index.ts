import { APIGatewayProxyEvent } from "../../common/common";
import {
  Response,
  NotImplementedError,
  UnexpectedError,
} from "../../common/common";

import {
  registerUser,
  loginUser,
  deleteUserById,
  getAllUsers,
  getUserGroups,
} from "./handlers";

const userHandler = async (event: APIGatewayProxyEvent) => {
  switch (event.httpMethod) {
    case "POST":
      if (event.path === "/users/register") {
        return await registerUser(event);
      }
      if (event.path === "/users/login") {
        return await loginUser(event);
      }
      break;
    case "GET":
      if (event.path === "/users") {
        return await getAllUsers(event);
      }
      if (event.path.startsWith("/users/") && event.path.endsWith("/groups")) {
        return await getUserGroups(event); // 处理 /users/{userId}/groups
      }
      break;
    case "DELETE":
      return await deleteUserById(event);
      break;
    case "OPTIONS":
      return Response(200, {});
      break;
    default:
      return new NotImplementedError("Not implemented").response();
  }
  return new UnexpectedError("Unexpected error").response();
};

export default userHandler;
