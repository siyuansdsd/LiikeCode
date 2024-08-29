import { Message } from "../interfaces/interfaces";
import { messageToItem, messageFromItem } from "../itemTransfer/message";
import {
  PutCommandInput,
  GetCommandInput,
  DeleteCommandInput,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import DynamoDB from "../dynamoDB/dynamoDB";

const dynamoDB = new DynamoDB();

interface MessageServicesOutput {
  statusCode: number;
  errorMessage?: string;
  message?: Message;
  messages?: Message[];
}

export const createMessage = async (
  userId: string,
  groupId: string,
  threadId: string,
  content: string
): Promise<MessageServicesOutput> => {
  const messageId = uuidv4();
  const message: Message = {
    PK: `THREAD#${threadId}`,
    SK: `MESSAGE#${messageId}`,
    messageId,
    content: content,
    createdAt: new Date().getTime(),
    senderUserId: userId,
    GSI1PK: `GROUP#${groupId}`,
    GSI1SK: `THREAD#${threadId}#MESSAGE#${messageId}`,
  };
  const item = messageToItem(message);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: MessageServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.message = message;
  }
  return result;
};

export const getMessage = async (
  threadId: string,
  messageId: string
): Promise<MessageServicesOutput> => {
  const params: GetCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: `THREAD#${threadId}`,
      sk: `MESSAGE#${messageId}`,
    },
  };
  const response = await dynamoDB.dbGet(params);
  const result: MessageServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Item) {
    result.message = messageFromItem(response.Item as Record<string, any>);
  }
  return result;
};

export const deleteMessage = async (
  threadId: string,
  messageId: string
): Promise<MessageServicesOutput> => {
  const params: DeleteCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: `THREAD#${threadId}`,
      sk: `MESSAGE#${messageId}`,
    },
  };
  const response = await dynamoDB.dbDelete(params);
  const result: MessageServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  return result;
};

export const getMessagesByThread = async (
  threadId: string
): Promise<MessageServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `THREAD#${threadId}`,
    },
  };
  const response = await dynamoDB.dbQuery(params);
  const result: MessageServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Items) {
    result.messages = response.Items.map((item) =>
      messageFromItem(item as Record<string, any>)
    );
  }
  return result;
};

export const getMessagesByGroup = async (
  groupId: string
): Promise<MessageServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `GROUP#${groupId}`,
    },
  };
  const response = await dynamoDB.dbQuery(params);
  const result: MessageServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Items) {
    result.messages = response.Items.map((item) =>
      messageFromItem(item as Record<string, any>)
    );
  }
  return result;
};

// complex query: get Message from specific Thread and order by createdAt
export const getMessagesByThreadOrdered = async (
  threadId: string,
  limit: number
): Promise<MessageServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    IndexName: "LSI_createdAt", // Local Secondary Index on createdAt
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `THREAD#${threadId}`,
    },
    ScanIndexForward: false,
    Limit: limit, // through this we can limit the number of messages we get
  };
  const response = await dynamoDB.dbQuery(params);
  const result: MessageServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  if (response.Items) {
    result.messages = response.Items.map((item) =>
      messageFromItem(item as Record<string, any>)
    );
  }
  return result;
};

// no updateMessage function because messages should be immutable after post to wss
