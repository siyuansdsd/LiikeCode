import { UserGroup } from "../interfaces/interfaces";
import { userGroupFromItem, userGroupToItem } from "../itemTransfer/userGroup";
import {
  PutCommandInput,
  GetCommandInput,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import DynamoDB from "../dynamoDB/dynamoDB";

const dynamoDB = new DynamoDB();

interface UserGroupServicesOutput {
  statusCode: number;
  errorMessage?: string;
  userGroup?: UserGroup;
  userGroups?: UserGroup[];
}

export const createUserGroup = async (
  userId: string,
  groupId: string
): Promise<UserGroupServicesOutput> => {
  const userGroup: UserGroup = {
    PK: `USER#${userId}`,
    SK: `GROUP#${groupId}`,
    userId,
    groupId,
    joinedAt: new Date().getTime(),
  };
  const item = userGroupToItem(userGroup);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: UserGroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.userGroup = userGroup;
  }
  return result;
};

export const getUserGroup = async (
  userId: string,
  groupId: string
): Promise<UserGroupServicesOutput> => {
  const params: GetCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: { S: `USER#${userId}` },
      sk: { S: `GROUP#${groupId}` },
    },
  };
  const response = await dynamoDB.dbGet(params);
  const result: UserGroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Item) {
    result.userGroup = userGroupFromItem(response.Item as Record<string, any>);
  }
  return result;
};

export const getUserGroupsByUser = async (
  userId: string
): Promise<UserGroupServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": { S: `USER#${userId}` },
    },
  };
  const response = await dynamoDB.dbQuery(params);
  const result: UserGroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Items) {
    result.userGroups = response.Items.map((item) =>
      userGroupFromItem(item as Record<string, any>)
    );
  }
  return result;
};

export const deleteUserGroup = async (
  userId: string,
  groupId: string
): Promise<UserGroupServicesOutput> => {
  const params: GetCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: { S: `USER#${userId}` },
      sk: { S: `GROUP#${groupId}` },
    },
  };
  const response = await dynamoDB.dbDelete(params);
  const result: UserGroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  return result;
};

export const getUserGroupsByGroup = async (
  groupId: string
): Promise<UserGroupServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    IndexName: "GSI_PK_SK_SK_PK",
    KeyConditionExpression: "pk = :sk AND begins_with(sk, :pk)",
    ExpressionAttributeValues: {
      ":sk": { S: `GROUP#${groupId}` },
      ":pk": { S: "USER#" },
    },
  };
  const response = await dynamoDB.dbQuery(params);
  const result: UserGroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }

  if (response.Items) {
    result.userGroups = response.Items.map((item) =>
      userGroupFromItem(item as Record<string, any>)
    );
  }
  return result;
};

export const updateUserGroup = async (
  userGroup: UserGroup
): Promise<UserGroupServicesOutput> => {
  const item = userGroupToItem(userGroup);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: UserGroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.userGroup = userGroup;
  }
  return result;
};
