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
    PK: item.PK as `GROUP#${string}`,
    SK: item.SK as `THREAD#${string}`,
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
    pk: { S: thread.PK },
    sk: { S: thread.SK },
    threadId: { S: thread.threadId },
    threadName: { S: thread.threadName },
    groupId: { S: thread.groupId },
    color: { S: thread.color },
    createdAt: { N: thread.createdAt.toString() },
    lastMessageAt: thread.lastMessageAt
      ? { N: thread.lastMessageAt.toString() }
      : undefined,
  };
};
