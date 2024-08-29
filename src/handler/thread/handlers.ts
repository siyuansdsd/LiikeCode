import { APIGatewayProxyEvent, Response } from "../../common/common";
import {
  ConflictError,
  BadRequestError,
  UnexpectedError,
  JsonError,
} from "../../common/common";
import { getThread, createThread } from "../../data/service/thread.service";
import { getGroup } from "../../data/service/group.service";
import { createMessage } from "../../data/service/message.service";
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
