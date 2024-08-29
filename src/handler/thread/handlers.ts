import { APIGatewayProxyEvent, Response } from "../../common/common";
import {
  ConflictError,
  BadRequestError,
  UnexpectedError,
  JsonError,
} from "../../common/common";
import { getThread } from "../../data/service/thread.service";
import { getGroup } from "../../data/service/group.service";
import { createMessage } from "../../data/service/message.service";
import { logger } from "../../../shared/utils/logger";

// GET /threads/messages
export const getMessagesInThread = async (event: APIGatewayProxyEvent) => {
  const { groupId, threadId } = JSON.parse(event.body || "{}");

  const threadResponse = await getThread(groupId, threadId);
  if (threadResponse.statusCode === 500) {
    return new UnexpectedError(threadResponse.errorMessage).response();
  }
  if (!threadResponse.thread) {
    return new BadRequestError("Thread not found").response();
  }
  return Response(200, { thread: threadResponse.thread });
};

// GET /threads/{threadId}/messages
