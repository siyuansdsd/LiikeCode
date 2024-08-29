import { UserGroup } from "../interfaces/interfaces";

export const userGroupFromItem = (item: Record<string, any>): UserGroup => {
  if (!item.pk || !item.sk || !item.userId || !item.groupId || !item.joinedAt) {
    throw new Error("Invalid item format");
  }

  return {
    PK: item.pk as `USER#${string}`,
    SK: item.sk as `GROUP#${string}`,
    userId: item.userId as string,
    groupId: item.groupId as string,
    joinedAt: Number(item.joinedAt),
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
    joinedAt: { N: userGroup.joinedAt.toString() },
  };
};
