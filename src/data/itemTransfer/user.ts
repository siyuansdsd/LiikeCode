import { User } from "../interfaces/interfaces";

export const userFromItem = (item: Record<string, any>): User => {
  if (
    !item.pk ||
    !item.sk ||
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
    PK: item.pk as `USER#${string}`,
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
    pk: user.PK,
    sk: user.SK,
    userId: user.userId,
    email: user.email,
    password: user.password,
    dateOfBirth: user.dateOfBirth,
    createdAt: user.createdAt,
    userName: user.userName,
    wssId: user.wssId ? user.wssId : undefined,
    userImageUrl: user.userImageUrl ? user.userImageUrl : undefined,
  };
};
