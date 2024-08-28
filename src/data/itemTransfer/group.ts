import { DynamoDB } from "aws-sdk";
import { Group } from "../interfaces/interfaces";

export const groupFromItem = (item: DynamoDB.AttributeMap): Group => {
  if (!item) {
    throw new Error("Item is undefined");
  }
  return {
    PK: item.pk.S! as Group["PK"],
    SK: item.sk.S! as Group["SK"],
    groupId: item.groupId.S!,
    groupName: item.groupName.S!,
    emoticon: item.emoticon.S! as any,
    createdAt: item.groupCreatedAt.S!,
  };
};

export const groupToItem = (group: Group): Record<string, unknown> => {
  return {
    pk: { S: group.PK },
    sk: { S: group.SK },
    groupId: { S: group.groupId },
    groupName: { S: group.groupName },
    emoticon: { S: group.emoticon },
    createdAt: { S: group.createdAt },
  };
};
