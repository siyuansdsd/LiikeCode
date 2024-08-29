// Basic Interfaces
export interface DynamoDBItem {
  PK: string;
  SK: string;
}

// User entity interface
export interface User extends DynamoDBItem {
  PK: `USER#${string}`;
  SK: "PROFILE";
  userId: string;
  userName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  createdAt: number;
  userImageUrl?: string;
}

// Group entity interface
export interface Group extends DynamoDBItem {
  PK: `GROUP#${string}`;
  SK: "METADATA";
  groupId: string;
  groupName: string;
  createdAt: number;
  emoticon: string;
  lastMessageAt?: string;
}

// UserGroup relationship interface（ N to N User-Group relationship）
export interface UserGroup extends DynamoDBItem {
  PK: `USER#${string}`;
  SK: `GROUP#${string}`;
  userId: string;
  groupId: string;
  joinedAt: number;
}

// Thread entity interface
export interface Thread extends DynamoDBItem {
  PK: `GROUP#${string}`;
  SK: `THREAD#${string}`;
  threadId: string;
  groupId: string;
  threadName: string;
  createdAt: number;
  lastMessageAt?: number;
  color: string;
}

// Message entity interface
export interface Message extends DynamoDBItem {
  PK: `THREAD#${string}`;
  SK: `MESSAGE#${string}`;
  messageId: string;
  content: string;
  senderUserId: string;
  createdAt: number;
  GSI1PK: `GROUP#${string}`; // GSI1 PK（Based on group ID）
  GSI1SK: `THREAD#${string}#MESSAGE#${string}`; // GSI1 SK（Based on Thread ID and MessageID）
}
