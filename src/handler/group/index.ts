import { APIGatewayProxyEvent } from "../../common/common";
import {
  Response,
  NotImplementedError,
  UnexpectedError,
} from "../../common/common";

import {
  createGroupByUser,
  addUserToGroup,
  getAllGroups,
  getGroupById,
  getUsersInGroup,
  getThreadsInGroup,
  getGroupsThreadByLastMessage,
} from "./handlers";

const groupHandler = async (event: APIGatewayProxyEvent) => {
  switch (event.httpMethod) {
    case "POST":
      if (event.path === "/groups") {
        return await createGroupByUser(event);
      }
      if (event.path.startsWith("/groups/") && event.path.endsWith("/users")) {
        return await addUserToGroup(event); //  /groups/{groupId}/users
      }
      break;
    case "GET":
      if (event.path === "/groups") {
        return await getAllGroups(event);
      }
      if (event.path.startsWith("/groups/") && !event.path.endsWith("/users")) {
        return await getGroupById(event); // /groups/{groupId}
      }
      if (event.path.startsWith("/groups/") && event.path.endsWith("/users")) {
        return await getUsersInGroup(event); // /groups/{groupId}/users
      }
      if (
        event.path.startsWith("/groups/") &&
        event.path.endsWith("/threads")
      ) {
        return await getThreadsInGroup(event); // /groups/{groupId}/threads
      }
      if (
        event.path.startsWith("/groups/") &&
        event.path.endsWith("/threads/latest")
      ) {
        return await getGroupsThreadByLastMessage(event); // /groups/{groupId}/threads/latest
      }

      break;
    case "OPTIONS":
      return Response(200, {});
      break;
    default:
      return new NotImplementedError("Not implemented").response();
  }
  return new UnexpectedError("Unexpected error").response();
};

export default groupHandler;
