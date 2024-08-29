import { APIGatewayProxyEvent, Response } from "../../common/common";
import {
  ConflictError,
  BadRequestError,
  UnexpectedError,
  JsonError,
} from "../../common/common";
import {
  getGroup,
  createGroup,
  deleteGroup,
  getGroups,
} from "../../data/service/group.service";
import {
  getUserGroupsByGroup,
  createUserGroup,
} from "../../data/service/userGroup.service";
import {
  getThreadsByGroup,
  getThreadsByGroupSorted,
} from "../../data/service/thread.service";
import { logger } from "../../../shared/utils/logger";

// GET /groups/{groupId}/users
export const getUsersInGroup = async (event: APIGatewayProxyEvent) => {
  const groupId = event.pathParameters?.groupId;
  if (!groupId) {
    return new BadRequestError("Invalid groupId").response();
  }
  const userGroupResponse = await getUserGroupsByGroup(groupId);
  if (userGroupResponse.statusCode === 500) {
    return new UnexpectedError(userGroupResponse.errorMessage).response();
  }
  if (!userGroupResponse.userGroups) {
    return Response(200, { users: [] });
  }
  return Response(200, { users: userGroupResponse.userGroups });
};

// GET /groups/{groupId}
export const getGroupById = async (event: APIGatewayProxyEvent) => {
  const groupId = event.pathParameters?.groupId;
  if (!groupId) {
    return new BadRequestError("Invalid groupId").response();
  }

  const response = await getGroup(groupId);
  if (response.statusCode === 500) {
    return new UnexpectedError(response.errorMessage).response();
  }
  if (!response.group) {
    return new BadRequestError("Group not found").response();
  }
  return Response(200, { group: response.group });
};

// GET /groups/{groupId}/threads
export const getThreadsInGroup = async (event: APIGatewayProxyEvent) => {
  const groupId = event.pathParameters?.groupId;
  if (!groupId) {
    return new BadRequestError("Invalid groupId").response();
  }

  const groupResponse = await getGroup(groupId);
  if (groupResponse.statusCode === 500) {
    return new UnexpectedError(groupResponse.errorMessage).response();
  }
  if (!groupResponse.group) {
    return new BadRequestError("Group not found").response();
  }

  const threadsResponse = await getThreadsByGroup(groupId);
  if (threadsResponse.statusCode === 500) {
    return new UnexpectedError(threadsResponse.errorMessage).response();
  }
  if (!threadsResponse.threads) {
    return Response(200, { threads: [] });
  }
  return Response(200, { threads: threadsResponse.threads });
};

// POST /groups create group
export const createGroupByUser = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body || "{}");
  if (!body.groupName || !body.emoticon || !body.userId) {
    return new JsonError("Invalid JSON schema").response();
  }

  const groupName = body.groupName;
  const emoticon = body.emoticon;

  const createResponse = await createGroup(groupName, emoticon);
  if (createResponse.statusCode === 500) {
    return new UnexpectedError(createResponse.errorMessage).response();
  }
  if (!createResponse.group) {
    return new UnexpectedError(
      "Group not created unexpected problem occurred"
    ).response();
  }

  const userGroupResponse = await createUserGroup(
    body.userId,
    createResponse.group.groupId
  );
  if (userGroupResponse.statusCode === 500) {
    await deleteGroup(createResponse.group.groupId);
    if (userGroupResponse.statusCode === 500) {
      logger.warn(
        `Failed to delete group ${createResponse.group.groupId} after failed user group creation, please delete manually`
      );
      return new UnexpectedError(userGroupResponse.errorMessage).response();
    }
    return new UnexpectedError(userGroupResponse.errorMessage).response();
  }
  return Response(201, { groupId: createResponse.group.groupId });
};

// POST /groups/{groupId}/users  add user to group
export const addUserToGroup = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body || "{}");
  if (!body.userId) {
    return new JsonError("Invalid JSON schema").response();
  }

  const groupId = event.pathParameters?.groupId;
  if (!groupId) {
    return new BadRequestError("Invalid groupId").response();
  }

  const userGroupResponse = await createUserGroup(body.userId, groupId);
  if (userGroupResponse.statusCode === 500) {
    return new UnexpectedError(userGroupResponse.errorMessage).response();
  }
  if (!userGroupResponse.userGroup) {
    return new ConflictError("User already in group").response();
  }
  return Response(201, { userGroup: userGroupResponse.userGroup });
};

// GET /groups/{groupId}/threads/latest  order by last message
export const getGroupsThreadByLastMessage = async (
  event: APIGatewayProxyEvent
) => {
  const groupId = event.pathParameters?.groupId;
  if (!groupId) {
    return new BadRequestError("Invalid groupId").response();
  }

  const groupResponse = await getGroup(groupId);
  if (groupResponse.statusCode === 500) {
    return new UnexpectedError(groupResponse.errorMessage).response();
  }
  if (!groupResponse.group) {
    return new BadRequestError("Group not found").response();
  }

  const threadsResponse = await getThreadsByGroupSorted(groupId);
  if (threadsResponse.statusCode === 500) {
    return new UnexpectedError(threadsResponse.errorMessage).response();
  }
  if (!threadsResponse.threads) {
    return Response(200, { threads: [] });
  }
  return Response(200, { threads: threadsResponse.threads });
};

// GET /groups for admin and dev
export const getAllGroups = async (event: APIGatewayProxyEvent) => {
  const response = await getGroups();
  if (response.statusCode === 500) {
    return new UnexpectedError(response.errorMessage).response();
  }
  if (response.groups instanceof Array && response.groups.length > 0) {
    return Response(200, { groups: response.groups });
  }
  return Response(200, { groups: [] });
};
