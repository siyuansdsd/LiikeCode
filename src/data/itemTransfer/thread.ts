import { Thread } from "../interfaces/interfaces";

export const threadFromItem = (item: Record<string, any>): Thread => {
  if (
    !item.PK ||
    !item.SK ||
    !item.threadId ||
    !item.threadName ||
    !item.groupId ||
    !item.color ||
    !item.createdAt
  ) {
    throw new Error("Invalid item format");
  }

  return {
    PK: item.pk as `GROUP#${string}`,
    SK: item.sk as `THREAD#${string}`,
    threadId: item.threadId as string,
    threadName: item.threadName as string,
    lastMessageAt: item.lastMessageAt as number | undefined,
    groupId: item.groupId as string,
    color: item.color as string,
    createdAt: Number(item.createdAt),
  };
};

export const threadToItem = (thread: Thread): Record<string, unknown> => {
  return {
    pk: thread.PK,
    sk: thread.SK,
    threadId: thread.threadId,
    threadName: thread.threadName,
    groupId: thread.groupId,
    color: thread.color,
    createdAt: thread.createdAt,
    lastMessageAt: thread.lastMessageAt ? thread.lastMessageAt : undefined,
  };
};
