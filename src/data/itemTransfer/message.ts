import { DynamoDB } from "aws-sdk";
import { Message } from "../interfaces/interfaces";

export const messageFromItem = (item: DynamoDB.AttributeMap): Message => {
  if (!item) {
    throw new Error("Item is undefined");
  }
  return {
    PK: item.pk.S! as Message["PK"],
    SK: item.sk.S! as Message["SK"],
    messageId: item.messageId.S!,
    content: item.content.S!,
    createdAt: item.messageCreatedAt.S!,
    senderUserId: item.senderUserId.S!,
    GSI1PK: item.GSI1PK.S! as Message["GSI1PK"],
    GSI1SK: item.GSI1SK.S! as Message["GSI1SK"],
  };
};

export const messageToItem = (message: Message): Record<string, unknown> => {
  return {
    pk: { S: message.PK },
    sk: { S: message.SK },
    messageId: { S: message.messageId },
    content: { S: message.content },
    senderUserId: { S: message.senderUserId },
    messageCreatedAt: { S: message.createdAt },
    GSI1PK: { S: message.GSI1PK },
    GSI1SK: { S: message.GSI1SK },
  };
};
