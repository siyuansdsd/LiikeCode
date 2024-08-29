import { Message } from "../interfaces/interfaces";

export const messageFromItem = (item: Record<string, any>): Message => {
  if (
    !item.PK ||
    !item.SK ||
    !item.messageId ||
    !item.content ||
    !item.senderUserId ||
    !item.createdAt ||
    !item.GSI1PK ||
    !item.GSI1SK
  ) {
    throw new Error("Invalid item format");
  }

  return {
    PK: item.PK as `THREAD#${string}`,
    SK: item.SK as `MESSAGE#${string}`,
    messageId: item.messageId as string,
    content: item.content as string,
    senderUserId: item.senderUserId as string,
    createdAt: Number(item.createdAt),
    GSI1PK: item.GSI1PK as `GROUP#${string}`,
    GSI1SK: item.GSI1SK as `THREAD#${string}#MESSAGE#${string}`,
  };
};

export const messageToItem = (message: Message): Record<string, unknown> => {
  return {
    pk: { S: message.PK },
    sk: { S: message.SK },
    messageId: { S: message.messageId },
    content: { S: message.content },
    senderUserId: { S: message.senderUserId },
    createdAt: { N: message.createdAt.toString() },
    GSI1PK: { S: message.GSI1PK },
    GSI1SK: { S: message.GSI1SK },
  };
};
