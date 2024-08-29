import { Group } from "../interfaces/interfaces";
import { groupToItem, groupFromItem } from "../itemTransfer/group";
import {
  PutCommandInput,
  GetCommandInput,
  DeleteCommandInput,
  QueryCommandInput,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import DynamoDB from "../dynamoDB/dynamoDB";

const dynamoDB = new DynamoDB();

interface GroupServicesOutput {
  statusCode: number;
  errorMessage?: string;
  group?: Group;
  groups?: Group[];
}

export const createGroup = async (
  groupName: string,
  emoticon: string
): Promise<GroupServicesOutput> => {
  const groupId = uuidv4();
  const group: Group = {
    PK: `GROUP#${groupId}`,
    SK: "METADATA",
    groupId,
    groupName,
    emoticon,
    createdAt: new Date().getTime(),
  };
  const item = groupToItem(group);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: GroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.group = group;
  }
  return result;
};

export const getGroup = async (
  groupId: string
): Promise<GroupServicesOutput> => {
  const params: GetCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: { S: `GROUP#${groupId}` },
      sk: { S: "METADATA" },
    },
  };
  const response = await dynamoDB.dbGet(params);
  const result: GroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Item) {
    result.group = groupFromItem(response.Item as Record<string, any>);
  }
  return result;
};

export const getGroups = async (): Promise<GroupServicesOutput> => {
  const params: ScanCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    FilterExpression: "sk = :sk AND begins_with(pk, :pk)",
    ExpressionAttributeValues: {
      ":pk": { S: "GROUP" },
      ":sk": { S: "METADATA" },
    },
  };

  const response = await dynamoDB.dbScan(params);
  const result: GroupServicesOutput = {
    statusCode: response.statusCode,
  };

  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }

  if (response.Items) {
    result.groups = response.Items.map((item) =>
      groupFromItem(item as Record<string, any>)
    );
  }

  return result;
};

export const deleteGroup = async (
  groupId: string
): Promise<GroupServicesOutput> => {
  const params: DeleteCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: { S: `GROUP#${groupId}` },
      sk: { S: "METADATA" },
    },
  };
  const response = await dynamoDB.dbDelete(params);
  const result: GroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  return result;
};

export const updateGroup = async (
  group: Group
): Promise<GroupServicesOutput> => {
  const item = groupToItem(group);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: GroupServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.group = group;
  }
  return result;
};
