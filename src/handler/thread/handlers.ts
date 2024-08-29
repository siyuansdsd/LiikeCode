import { APIGatewayProxyEvent, Response } from "../../common/common";
import {
  ConflictError,
  BadRequestError,
  UnexpectedError,
  JsonError,
} from "../../common/common";
import { getThread, createThread } from "../../data/service/thread.service";
import { getGroup } from "../../data/service/group.service";
import { getMessagesByThreadOrdered } from "../../data/service/message.service";
import { logger } from "../../../shared/utils/logger";

// POST /threads
export const createThreadsInGroup = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body || "{}");
  if (!body.threadName || !body.groupId || !body.color) {
    return new JsonError("Invalid JSON schema").response();
  }

  const threadName = body.threadName;
  const groupId = body.groupId;
  const color = body.color;

  const groupResponse = await getGroup(groupId);
  if (groupResponse.statusCode === 500) {
    return new UnexpectedError(groupResponse.errorMessage).response();
  }
  if (!groupResponse.group) {
    return new BadRequestError("Group not found").response();
  }

  const createResponse = await createThread(threadName, groupId, color);
  if (createResponse.statusCode === 500) {
    return new UnexpectedError(createResponse.errorMessage).response();
  }
  return Response(201, { thread: createResponse.thread });
};

// GET /threads/{threadId}?limit=v1&groupId=v2
export const getMessagesInThread = async (event: APIGatewayProxyEvent) => {
  const threadId = event.pathParameters?.threadId;
  if (!threadId) {
    return new BadRequestError("Invalid threadId").response();
  }
  const limit = parseInt(event.queryStringParameters?.limit || "10", 10);
  
  const groupId = event.queryStringParameters?.groupId;
  if (groupId === undefined) {
    return new BadRequestError("Invalid groupId").response();
  }

  const threadResponse = await getThread(groupId, threadId);
  if (threadResponse.statusCode === 500) {
    return new UnexpectedError(threadResponse.errorMessage).response();
  }
  if (threadResponse.thread === undefined) {
    return new BadRequestError("Thread not found").response();
  }

  const messagesResponse = await getMessagesByThreadOrdered(threadId, limit);
  if (messagesResponse.statusCode === 500) {
    return new UnexpectedError(messagesResponse.errorMessage).response();
  }
  return Response(200, { messages: messagesResponse.messages });
};
