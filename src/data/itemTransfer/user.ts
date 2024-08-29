import { User } from "../interfaces/interfaces";

export const userFromItem = (item: Record<string, any>): User => {
  if (
    !item.PK ||
    !item.SK ||
    !item.userId ||
    !item.userName ||
    !item.email ||
    !item.password ||
    !item.dateOfBirth ||
    !item.createdAt
  ) {
    throw new Error("Invalid item format");
  }

  return {
    PK: item.PK as `USER#${string}`,
    SK: "PROFILE",
    userId: item.userId as string,
    userName: item.userName as string,
    email: item.email as string,
    password: item.password as string,
    dateOfBirth: item.dateOfBirth as string,
    createdAt: Number(item.createdAt),
    wssId: item.wssId as string | undefined,
    userImageUrl: item.userImageUrl as string | undefined,
  };
};

export const userToItem = (user: User): Record<string, unknown> => {
  return {
    pk: { S: user.PK },
    sk: { S: user.PK },
    userId: { S: user.userId },
    email: { S: user.email },
    password: { S: user.password },
    dateOfBirth: { S: user.dateOfBirth },
    createdAt: { N: user.createdAt.toString() },
    userName: { S: user.userName },
    wssId: user.wssId ? { S: user.wssId } : undefined,
    userImageUrl: user.userImageUrl ? { S: user.userImageUrl } : undefined,
  };
};
