import { Thread } from "../interfaces/interfaces";
import { threadFromItem, threadToItem } from "../itemTransfer/thread";
import {
  PutCommandInput,
  GetCommandInput,
  QueryCommandInput,
  DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import DynamoDB from "../dynamoDB/dynamoDB";

const dynamoDB = new DynamoDB();

interface ThreadServicesOutput {
  statusCode: number;
  errorMessage?: string;
  thread?: Thread;
  threads?: Thread[];
}

export const createThread = async (
  threadName: string,
  groupId: string,
  color: string
): Promise<ThreadServicesOutput> => {
  const threadId = uuidv4();
  const thread: Thread = {
    PK: `GROUP#${groupId}`,
    SK: `THREAD#${threadId}`,
    threadId,
    threadName,
    groupId,
    color,
    lastMessageAt: new Date().getTime(),
    createdAt: new Date().getTime(),
  };
  const item = threadToItem(thread);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: ThreadServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.thread = thread;
  }
  return result;
};

export const getThread = async (
  groupId: string,
  threadId: string
): Promise<ThreadServicesOutput> => {
  const params: GetCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: { S: `GROUP#${groupId}` },
      sk: { S: `THREAD#${threadId}` },
    },
  };
  const response = await dynamoDB.dbGet(params);
  const result: ThreadServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }

  if (response.Item) {
    result.thread = threadFromItem(response.Item as Record<string, any>);
  }
  return result;
};

export const getThreadsByGroup = async (
  groupId: string
): Promise<ThreadServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": { S: `GROUP#${groupId}` },
    },
  };
  const response = await dynamoDB.dbQuery(params);
  const result: ThreadServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }

  if (response.Items) {
    result.threads = response.Items.map((item) =>
      threadFromItem(item as Record<string, any>)
    );
  }
  return result;
};

export const deleteThread = async (
  groupId: string,
  threadId: string
): Promise<ThreadServicesOutput> => {
  const params: DeleteCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Key: {
      pk: { S: `GROUP#${groupId}` },
      sk: { S: `THREAD#${threadId}` },
    },
  };
  const response = await dynamoDB.dbDelete(params);
  const result: ThreadServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }
  return result;
};

export const updateThread = async (
  thread: Thread
): Promise<ThreadServicesOutput> => {
  const item = threadToItem(thread);
  const params: PutCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    Item: item,
  };
  const response = await dynamoDB.dbPut(params);
  const result: ThreadServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  } else {
    result.thread = thread;
  }
  return result;
};

// complex query with order by last message at
export const getThreadsByGroupSorted = async (
  groupId: string
): Promise<ThreadServicesOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.CHAT_TABLE!,
    IndexName: "LSI_lastMessageAt", // a LSI for change sort key to help us sort
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": { S: `GROUP#${groupId}` },
    },
    ScanIndexForward: false,
  };
  const response = await dynamoDB.dbQuery(params);
  const result: ThreadServicesOutput = {
    statusCode: response.statusCode,
  };
  if (response.statusCode === 500) {
    result.errorMessage = response.errorMessage;
  }

  if (response.Items) {
    result.threads = response.Items.map((item) =>
      threadFromItem(item as Record<string, any>)
    );
  }
  return result;
};
