import { APIGatewayProxyEvent, Response } from "../../common/common";
import {
  BadRequestError,
  UnexpectedError,
  JsonError,
} from "../../common/common";
import { getThread, updateThread } from "../../data/service/thread.service";
import { getGroup, updateGroup } from "../../data/service/group.service";
import {
  getUser,
  updateUser,
  getUserByWssId,
} from "../../data/service/user.service";
import { ApiGatewayManagementApi } from "aws-sdk";
import { getUserGroupsByGroup } from "../../data/service/userGroup.service";
import { createMessage } from "../../data/service/message.service";
import { logger } from "../../../shared/utils/logger";

// connect to wws
export const connectToWss = async (event: APIGatewayProxyEvent) => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body || "{}");
  if (!body.userId || !body.token) {
    return new JsonError("Invalid JSON schema").response();
  }
  const userResponse = await getUser(body.userId);
  if (userResponse.statusCode === 500) {
    return new UnexpectedError(userResponse.errorMessage).response();
  }
  if (!userResponse.user) {
    return new BadRequestError("account is disable").response();
  }
  const user = userResponse.user;
  user.wssId = connectionId;
  const updateResponse = await updateUser(user);
  if (updateResponse.statusCode === 500) {
    return new UnexpectedError(updateResponse.errorMessage).response();
  }
  return Response(200, { message: "connect success" });
};

export const disconnectToWss = async (event: APIGatewayProxyEvent) => {
  const connectionId = event.requestContext.connectionId!;
  const userResponse = await getUserByWssId(connectionId);
  if (userResponse.statusCode === 500) {
    return new UnexpectedError(userResponse.errorMessage).response();
  }
  if (!userResponse.user) {
    return new BadRequestError("account is disable").response();
  }
  const user = userResponse.user;
  user.wssId = undefined;
  const updateResponse = await updateUser(user);
  if (updateResponse.statusCode === 500) {
    return new UnexpectedError(updateResponse.errorMessage).response();
  }
  return Response(200, { message: "disconnect success" });
};

export const sendMessage = async (event: APIGatewayProxyEvent) => {
  const apiGateway = new ApiGatewayManagementApi({
    endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`,
  });

  const body = JSON.parse(event.body || "{}");
  if (!body.threadId || !body.userId || !body.message || !body.groupId) {
    return new JsonError("Invalid JSON schema").response();
  }
  const threadId = body.threadId;
  const userId = body.userId;
  const message = body.message;
  const groupId = body.groupId;

  const threadResponse = await getThread(groupId, threadId);
  if (threadResponse.statusCode === 500) {
    return new UnexpectedError(threadResponse.errorMessage).response();
  }
  if (!threadResponse.thread) {
    return new BadRequestError("Thread not found").response();
  }

  const userResponse = await getUser(userId);
  if (userResponse.statusCode === 500) {
    return new UnexpectedError(userResponse.errorMessage).response();
  }
  if (!userResponse.user) {
    return new BadRequestError("User not found").response();
  }
  const user = userResponse.user;

  // create message
  const messageResponse = await createMessage(
    userId,
    groupId,
    threadId,
    message
  );
  if (messageResponse.statusCode === 500) {
    return new UnexpectedError(messageResponse.errorMessage).response();
  }

  const groupResponse = await getGroup(groupId);
  if (groupResponse.statusCode === 500) {
    return new UnexpectedError(groupResponse.errorMessage).response();
  }
  if (!groupResponse.group) {
    return new BadRequestError("Group not found").response();
  }
  const group = groupResponse.group;

  const timeStamp = new Date().getTime();

  const thread = threadResponse.thread;
  thread.lastMessageAt = timeStamp;
  const updateThreadResponse = await updateThread(thread);
  if (updateThreadResponse.statusCode === 500) {
    return new UnexpectedError(updateThreadResponse.errorMessage).response();
  }

  group.lastMessageAt = timeStamp;
  const updateGroupResponse = await updateGroup(group);
  if (updateGroupResponse.statusCode === 500) {
    return new UnexpectedError(updateGroupResponse.errorMessage).response();
  }

  const userGroupsResponse = await getUserGroupsByGroup(groupId);
  if (userGroupsResponse.statusCode === 500) {
    return new UnexpectedError(userGroupsResponse.errorMessage).response();
  }
  if (!userGroupsResponse.userGroups) {
    return new BadRequestError("UserGroups not found").response();
  }

  const userGroups = userGroupsResponse.userGroups;
  const userPromise = userGroups.map(async (userGroup) => {
    const userResponse = await getUser(userGroup.userId);
    if (userResponse.user) {
      return userResponse.user;
    }
    return null;
  });
  const userResults = userPromise ? await Promise.all(userPromise) : [];
  const users = userResults.filter((user) => user !== null);

  // multiple users' chat in specific Group
  users.forEach((user) => {
    if (user.wssId) {
      apiGateway
        .postToConnection({
          ConnectionId: user.wssId,
          Data: JSON.stringify({
            action: "message",
            message: messageResponse.message,
            user: { userName: user.userName },
            thread: {
              threadName: thread.threadName,
              threadColor: thread.color,
            },
            timeStamp,
          }),
        })
        .promise()
        .catch((err) => {
          logger.error(err);
        });
    }
  });
};
