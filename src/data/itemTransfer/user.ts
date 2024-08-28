import { DynamoDB } from "aws-sdk";
import { User } from "../interfaces/interfaces";

export const userFromItem = (item: DynamoDB.AttributeMap): User => {
  if (!item) {
    throw new Error("Item is undefined");
  }
  return {
    PK: item.pk.S! as User["PK"],
    SK: item.sk.S! as User["SK"],
    userName: item.userName.S!,
    userId: item.userId.S!,
    email: item.email.S!,
    password: item.password.S!,
    dateOfBirth: item.dateOfBirth.S!,
    userCreatedAt: item.userCreatedAt.S!,
    userImageUrl: item.userImageUrl?.S,
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
    userCreatedAt: { S: user.userCreatedAt },
    userImageUrl: user.userImageUrl ? { S: user.userImageUrl } : undefined,
  };
};
