import {
  createThread,
  getThread,
  getThreadsByGroup,
  deleteThread,
  updateThread,
  getThreadsByGroupSorted,
} from "../thread.service";
import DynamoDB from "../../dynamoDB/dynamoDB";
import { Thread } from "../../interfaces/interfaces";

// Mock the DynamoDB class
jest.mock("../../dynamoDB/dynamoDB");

describe("Thread Service", () => {
  const dynamoDBMock = DynamoDB as jest.MockedClass<typeof DynamoDB>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // createThread tests
  it("should create a thread successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const response = await createThread("Test Thread", "group1", "blue");

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.thread?.threadName).toBe("Test Thread");
  });

  it("should return an error if DynamoDB put operation fails during thread creation", async () => {
    const mockPutErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutErrorResponse);

    const response = await createThread("Test Thread", "group1", "blue");

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getThread tests
  it("should get a thread successfully", async () => {
    const mockGetResponse = {
      statusCode: 200,
      id: "group1",
      Item: {
        pk: "GROUP#group1",
        sk: "THREAD#thread1",
        threadId: "thread1",
        threadName: "Test Thread",
        groupId: "group1",
        color: "blue",
        lastMessageAt: 1622121212121,
        createdAt: 1622121212121,
      },
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetResponse);

    const response = await getThread("group1", "thread1");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.thread?.threadName).toBe("Test Thread");
  });

  it("should return an error if DynamoDB get operation fails", async () => {
    const mockGetErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetErrorResponse);

    const response = await getThread("group1", "thread1");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getThreadsByGroup tests
  it("should get threads by group successfully", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "group1",
      Items: [
        {
          pk: "GROUP#group1",
          sk: "THREAD#thread1",
          threadId: "thread1",
          threadName: "Test Thread 1",
          groupId: "group1",
          color: "blue",
          lastMessageAt: 1622121212121,
          createdAt: 1622121212121,
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getThreadsByGroup("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.threads?.length).toBe(1);
  });

  it("should return an empty array if no threads are found", async () => {
    const mockQueryResponse = {
      id: "group1",
      statusCode: 200,
      Items: [],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getThreadsByGroup("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.threads?.length).toBe(0);
  });

  it("should return an error if DynamoDB query operation fails", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getThreadsByGroup("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // deleteThread tests
  it("should delete a thread successfully", async () => {
    const mockDeleteResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteResponse);

    const response = await deleteThread("group1", "thread1");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it("should return an error if DynamoDB delete operation fails", async () => {
    const mockDeleteErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteErrorResponse);

    const response = await deleteThread("group1", "thread1");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // updateThread tests
  it("should update a thread successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const thread: Thread = {
      PK: "GROUP#group1",
      SK: "THREAD#thread1",
      threadId: "thread1",
      threadName: "Updated Thread",
      groupId: "group1",
      color: "red",
      lastMessageAt: 1622121212121,
      createdAt: 1622121212121,
    };

    const response = await updateThread(thread);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.thread?.threadName).toBe("Updated Thread");
  });

  it("should return an error if DynamoDB put operation fails during thread update", async () => {
    const mockPutErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutErrorResponse);

    const thread: Thread = {
      PK: "GROUP#group1",
      SK: "THREAD#thread1",
      threadId: "thread1",
      threadName: "Updated Thread",
      groupId: "group1",
      color: "red",
      lastMessageAt: 1622121212121,
      createdAt: 1622121212121,
    };

    const response = await updateThread(thread);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getThreadsByGroupSorted tests
  it("should get sorted threads by group successfully", async () => {
    const mockQueryResponse = {
      id: "group1",
      statusCode: 200,
      Items: [
        {
          pk: "GROUP#group1",
          sk: "THREAD#thread1",
          threadId: "thread1",
          threadName: "Test Thread 1",
          groupId: "group1",
          color: "blue",
          lastMessageAt: 1622121212121,
          createdAt: 1622121212121,
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getThreadsByGroupSorted("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.threads?.length).toBe(1);
  });

  it("should return an empty array if no sorted threads are found", async () => {
    const mockQueryResponse = {
      id: "group1",
      statusCode: 200,
      Items: [],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getThreadsByGroupSorted("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.threads?.length).toBe(0);
  });

  it("should return an error if DynamoDB query operation fails during sorting", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getThreadsByGroupSorted("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });
});
