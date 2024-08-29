import { User } from "../interfaces/interfaces";
import { userToItem, userFromItem } from "../itemTransfer/user";
import {
  PutCommandInput,
  GetCommandInput,
  DeleteCommandInput,
  QueryCommandInput,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import DynamoDB from "../dynamoDB/dynamoDB";

interface UserServicesOutput {
  statusCode: number;
  errorMessage?: string;
  user?: User;
  users?: User[];
}

const dynamoDB = new DynamoDB();

export const createUser = async (
  userName: string,
  email: string,
  dateOfBirth: string,
  password: string,
  userImageUrl?: string
): Promise<UserServicesOutput> => {
  const userId = uuidv4();
  const user: User = {
    PK: `USER#${userId}`,
    SK: "PROFILE",
    userId: userId,
    userName,
    email,
    dateOfBirth,
    password,
    createdAt: new Date().getTime(),
    userImageUrl,
  };
  const item = userToItem(user);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: UserServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.user = user;
  }
  return result; // bubbling to next level to solve error (handler)
};

export const getUser = async (userId: string): Promise<UserServicesOutput> => {
  const params: GetCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: { S: `USER#${userId}` },
      sk: { S: "PROFILE" },
    },
  };
  const response = await dynamoDB.dbGet(params);
  const result: UserServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Item) {
    result.user = userFromItem(response.Item as Record<string, any>);
  }
  return result;
};

export const getUserByWssId = async (
  connectId: string
): Promise<UserServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    IndexName: "GSI-PK:wwsId",
    KeyConditionExpression: "pk = :wwsId",
    ExpressionAttributeValues: {
      ":wssId": { S: connectId },
    },
  };
  const response = await dynamoDB.dbQuery(params);
  const result: UserServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Items) {
    result.user = userFromItem(response.Items[0] as Record<string, any>);
  }
  return result;
};

export const getUserByEmail = async (
  email: string
): Promise<UserServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    IndexName: "GSI-PK:EMAIL",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": { S: email },
    },
  };
  const response = await dynamoDB.dbQuery(params);
  const result: UserServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Items) {
    result.user = userFromItem(response.Items[0] as Record<string, any>);
  }
  return result;
};

export const getUsers = async (): Promise<UserServicesOutput> => {
  const params: ScanCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    FilterExpression: "sk = :sk AND begins_with(pk, :pk)",
    ExpressionAttributeValues: {
      ":sk": { S: "PROFILE" },
      ":pk": { S: "USER#" },
    },
  };
  const response = await dynamoDB.dbScan(params);
  const result: UserServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Items) {
    result.users = response.Items.map((item) =>
      userFromItem(item as Record<string, any>)
    );
  }
  return result;
};

export const deleteUser = async (
  userId: string
): Promise<UserServicesOutput> => {
  const params: DeleteCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: { S: `USER#${userId}` },
      sk: { S: "PROFILE" },
    },
  };
  const response = await dynamoDB.dbDelete(params);
  const result: UserServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  return result;
};

export const updateUser = async (user: User): Promise<UserServicesOutput> => {
  const item = userToItem(user);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: UserServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.user = user;
  }
  return result;
};
