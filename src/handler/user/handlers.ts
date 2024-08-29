import { APIGatewayProxyEvent, Response } from "../../common/common";
import {
  ConflictError,
  BadRequestError,
  UnexpectedError,
  JsonError,
} from "../../common/common";
import {
  getUserByEmail,
  createUser,
  deleteUser,
  getUsers,
} from "../../data/service/user.service";
import { getUserGroupsByUser } from "../../data/service/userGroup.service";
import { getGroup } from "../../data/service/group.service";
import { Group } from "../../data/interfaces/interfaces";
import { logger } from "../../../shared/utils/logger";

// POST /users/register
export const registerUser = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body || "{}");
  if (!body.email || !body.password || !body.userName || !body.dateOfBirth) {
    return new JsonError("Invalid JSON schema").response();
  }

  const email = body.email;
  const password = body.password;
  const userName = body.userName;
  const dateOfBirth = body.dateOfBirth;
  const userImageUrl = body.userImageUrl;

  const getResponse = await getUserByEmail(email);

  if (getResponse.user) {
    return new ConflictError("User already exists").response();
  }

  const createResponse = await createUser(
    userName,
    email,
    dateOfBirth,
    password,
    userImageUrl
  );
  if (createResponse.statusCode === 500) {
    return new UnexpectedError(createResponse.errorMessage).response();
  }
  return Response(201, { userId: createResponse.user?.userId });
};

// POST /users/login
export const loginUser = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body || "{}");
  if (!body.email || !body.password) {
    return new JsonError("Invalid JSON schema").response();
  }

  const email = body.email;
  const password = body.password;

  const getResponse = await getUserByEmail(email);

  if (!getResponse.user) {
    return new BadRequestError("User not found").response();
  }
  if (getResponse.user.password !== password) {
    return new BadRequestError("Invalid password").response();
  }
  return Response(200, { user: getResponse.user });
};

// GET /users/{userId}
export const getUserById = async (event: APIGatewayProxyEvent) => {
  const userId = event.pathParameters?.userId;
  if (!userId) {
    return new BadRequestError("Invalid path parameter").response();
  }

  const response = await getUserByEmail(userId);

  if (response.user === undefined) {
    return new BadRequestError("User not found").response();
  }

  return Response(200, { user: response.user });
};

// DELETE /users/{userId}
export const deleteUserById = async (event: APIGatewayProxyEvent) => {
  const userId = event.pathParameters?.userId;
  if (!userId) {
    return new BadRequestError("Invalid path parameter").response();
  }

  const response = await deleteUser(userId);
  if (response.statusCode === 500) {
    return new UnexpectedError(response.errorMessage).response();
  }
  return Response(204);
};

// GET /users/{userId}/groups
export const getUserGroups = async (event: APIGatewayProxyEvent) => {
  const userId = event.pathParameters?.userId;
  if (!userId) {
    return new BadRequestError("Invalid path parameter").response();
  }

  const response = await getUserGroupsByUser(userId);

  if (!response.userGroups) {
    return Response(200, { userGroups: [] });
  }

  const userPromise = response.userGroups?.map(async (userGroup) => {
    const groupResponse = await getGroup(userGroup.groupId);
    if (groupResponse.group) {
      return groupResponse.group;
    }
    return null;
  });

  const userGroupsResults = userPromise ? await Promise.all(userPromise) : [];
  const userGroups = userGroupsResults.filter((group) => group !== null);

  return Response(200, { userGroups });
};

//

// GET /users For Admin and Dev
export const getAllUsers = async (event: APIGatewayProxyEvent) => {
  const response = await getUsers();
  if (response.statusCode === 500) {
    return new UnexpectedError(response.errorMessage).response();
  }
  return Response(200, { users: response.users });
};
