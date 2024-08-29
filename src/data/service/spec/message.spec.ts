import {
  createMessage,
  getMessage,
  deleteMessage,
  getMessagesByThread,
  getMessagesByGroup,
  getMessagesByThreadOrdered,
} from "../message.service";
import DynamoDB from "../../dynamoDB/dynamoDB";
import { Message } from "../../interfaces/interfaces";

// Mock the DynamoDB class
jest.mock("../../dynamoDB/dynamoDB");

describe("Message Service", () => {
  const dynamoDBMock = DynamoDB as jest.MockedClass<typeof DynamoDB>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // createMessage tests
  it("should create a message successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const response = await createMessage(
      "user1",
      "group1",
      "thread1",
      "Hello, World!"
    );

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.message?.content).toBe("Hello, World!");
  });

  it("should return an error if DynamoDB put operation fails", async () => {
    const mockPutErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutErrorResponse);

    const response = await createMessage(
      "user1",
      "group1",
      "thread1",
      "Hello, World!"
    );

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getMessage tests
  it("should get a message successfully", async () => {
    const mockGetResponse = {
      statusCode: 200,
      Item: {
        pk: "THREAD#thread1",
        sk: "MESSAGE#message1",
        messageId: "message1",
        content: "Hello, World!",
        senderUserId: "user1",
        createdAt: 1622121212121,
        GSI1PK: "GROUP#group1",
        GSI1SK: "THREAD#thread1#MESSAGE#message1",
      },
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetResponse);

    const response = await getMessage("thread1", "message1");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.message?.content).toBe("Hello, World!");
  });

  it("should return an error if DynamoDB get operation fails", async () => {
    const mockGetErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetErrorResponse);

    const response = await getMessage("thread1", "message1");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // deleteMessage tests
  it("should delete a message successfully", async () => {
    const mockDeleteResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteResponse);

    const response = await deleteMessage("thread1", "message1");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it("should return an error if DynamoDB delete operation fails", async () => {
    const mockDeleteErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteErrorResponse);

    const response = await deleteMessage("thread1", "message1");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getMessagesByThread tests
  it("should get messages by thread successfully", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "test-id",
      Items: [
        {
          pk: "THREAD#thread1",
          sk: "MESSAGE#message1",
          messageId: "message1",
          content: "Hello, World!",
          senderUserId: "user1",
          createdAt: 1622121212121,
          GSI1PK: "GROUP#group1",
          GSI1SK: "THREAD#thread1#MESSAGE#message1",
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getMessagesByThread("thread1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.messages?.length).toBe(1);
  });

  it("should return an error if DynamoDB query operation fails", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getMessagesByThread("thread1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getMessagesByGroup tests
  it("should get messages by group successfully", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "test-id",
      Items: [
        {
          pk: "THREAD#thread1",
          sk: "MESSAGE#message1",
          messageId: "message1",
          content: "Hello, World!",
          senderUserId: "user1",
          createdAt: 1622121212121,
          GSI1PK: "GROUP#group1",
          GSI1SK: "THREAD#thread1#MESSAGE#message1",
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getMessagesByGroup("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.messages?.length).toBe(1);
  });

  it("should return an error if DynamoDB query operation fails", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getMessagesByGroup("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getMessagesByThreadOrdered tests
  it("should get ordered messages by thread successfully", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "test-id",
      Items: [
        {
          pk: "THREAD#thread1",
          sk: "MESSAGE#message1",
          messageId: "message1",
          content: "Hello, World!",
          senderUserId: "user1",
          createdAt: 1622121212121,
          GSI1PK: "GROUP#group1",
          GSI1SK: "THREAD#thread1#MESSAGE#message1",
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getMessagesByThreadOrdered("thread1", 10);

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.messages?.length).toBe(1);
  });

  it("should return an error if DynamoDB query operation fails", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getMessagesByThreadOrdered("thread1", 10);

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });
});
