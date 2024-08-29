import { Group } from "../interfaces/interfaces";

export const groupFromItem = (item: Record<string, any>): Group => {
  if (
    !item.PK ||
    !item.SK ||
    !item.groupId ||
    !item.groupName ||
    !item.emoticon ||
    !item.createdAt
  ) {
    throw new Error("Invalid item format");
  }

  return {
    PK: item.PK as `GROUP#${string}`,
    SK: "METADATA",
    groupId: item.groupId as string,
    groupName: item.groupName as string,
    emoticon: item.emoticon as string,
    createdAt: Number(item.createdAt),
  };
};

export const groupToItem = (group: Group): Record<string, unknown> => {
  return {
    pk: { S: group.PK },
    sk: { S: group.SK },
    groupId: { S: group.groupId },
    groupName: { S: group.groupName },
    emoticon: { S: group.emoticon },
    createdAt: { N: group.createdAt.toString() },
  };
};
