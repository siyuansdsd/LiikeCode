import { Message } from "../interfaces/interfaces";

export const messageFromItem = (item: Record<string, any>): Message => {
  if (
    !item.pk ||
    !item.sk ||
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
    PK: item.pk as `THREAD#${string}`,
    SK: item.sk as `MESSAGE#${string}`,
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
    pk: message.PK,
    sk: message.SK,
    messageId: message.messageId,
    content: message.content,
    senderUserId: message.senderUserId,
    createdAt: message.createdAt,
    GSI1PK: message.GSI1PK,
    GSI1SK: message.GSI1SK,
  };
};
