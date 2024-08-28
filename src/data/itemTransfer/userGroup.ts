import { DynamoDB } from "aws-sdk";
import { UserGroup } from "../interfaces/interfaces";

export const userGroupFromItem = (item: DynamoDB.AttributeMap): UserGroup => {
  if (!item) {
    throw new Error("Item is undefined");
  }
  return {
    PK: item.pk.S! as UserGroup["PK"],
    SK: item.sk.S! as UserGroup["SK"],
    userId: item.userId.S!,
    groupId: item.groupId.S!,
    joinedAt: item.joinedAt.S!,
  };
};

export const userGroupToItem = (
  userGroup: UserGroup
): Record<string, unknown> => {
  return {
    pk: { S: userGroup.PK },
    sk: { S: userGroup.SK },
    userId: { S: userGroup.userId },
    groupId: { S: userGroup.groupId },
    joinedAt: { S: userGroup.joinedAt },
  };
};
