import { DynamoDB } from "aws-sdk";
import { Thread } from "../interfaces/interfaces";

export const threadFromItem = (item: DynamoDB.AttributeMap): Thread => {
  if (!item) {
    throw new Error("Item is undefined");
  }
  return {
    PK: item.pk.S! as Thread["PK"],
    SK: item.sk.S! as Thread["SK"],
    threadId: item.threadId.S!,
    threadName: item.threadName.S!,
    color: item.color.S!,
    createdAt: item.threadCreatedAt.S!,
  };
};

export const threadToItem = (thread: Thread): Record<string, unknown> => {
  return {
    pk: { S: thread.PK },
    sk: { S: thread.SK },
    threadId: { S: thread.threadId },
    threadName: { S: thread.threadName },
    color: { S: thread.color },
    threadCreatedAt: { S: thread.createdAt },
  };
};
