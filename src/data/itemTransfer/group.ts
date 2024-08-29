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
    lastMessageAt: item.lastMessageAt as number | undefined,
    createdAt: Number(item.createdAt),
  };
};

export const groupToItem = (group: Group): Record<string, unknown> => {
  return {
    pk: group.PK,
    sk: group.SK,
    groupId: group.groupId,
    groupName: group.groupName,
    emoticon: group.emoticon,
    lastMessageAt: group.lastMessageAt ? group.lastMessageAt : undefined,
    createdAt: group.createdAt,
  };
};
