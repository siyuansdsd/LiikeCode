import {
  createUser,
  getUser,
  getUserByWssId,
  getUserByEmail,
  getUsers,
  deleteUser,
  updateUser,
} from "../user.service";
import DynamoDB from "../../dynamoDB/dynamoDB";
import { User } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from "uuid";

// Mock the DynamoDB class
jest.mock("../../dynamoDB/dynamoDB");
jest.mock("uuid");

describe("User Service", () => {
  const dynamoDBMock = DynamoDB as jest.MockedClass<typeof DynamoDB>;

  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue("mock-uuid");
  });

  // createUser tests
  it("should create a user successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const response = await createUser(
      "Test User",
      "test@example.com",
      "1990-01-01",
      "password123",
      "http://example.com/image.jpg"
    );

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.user?.userName).toBe("Test User");
    expect(response.user?.userId).toBe("mock-uuid");
  });

  it("should return an error if DynamoDB put operation fails during user creation", async () => {
    const mockPutErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutErrorResponse);

    const response = await createUser(
      "Test User",
      "test@example.com",
      "1990-01-01",
      "password123",
      "http://example.com/image.jpg"
    );

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getUser tests
  it("should get a user successfully", async () => {
    const mockGetResponse = {
      statusCode: 200,
      Item: {
        pk: "USER#mock-uuid",
        sk: "PROFILE",
        userId: "mock-uuid",
        userName: "Test User",
        email: "test@example.com",
        dateOfBirth: "1990-01-01",
        password: "password123",
        createdAt: 1622121212121,
        userImageUrl: "http://example.com/image.jpg",
      },
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetResponse);

    const response = await getUser("mock-uuid");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.user?.userName).toBe("Test User");
  });

  it("should return an error if DynamoDB get operation fails", async () => {
    const mockGetErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetErrorResponse);

    const response = await getUser("mock-uuid");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getUserByWssId tests
  it("should get a user by WssId successfully", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "mock-wss-id",
      Items: [
        {
          pk: "USER#mock-uuid",
          sk: "PROFILE",
          userId: "mock-uuid",
          wssId: "mock-wss-id",
          userName: "Test User",
          email: "test@example.com",
          dateOfBirth: "1990-01-01",
          password: "password123",
          createdAt: 1622121212121,
          userImageUrl: "http://example.com/image.jpg",
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getUserByWssId("mock-wss-id");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.user?.userName).toBe("Test User");
  });

  it("should return an error if DynamoDB query operation fails for getUserByWssId", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getUserByWssId("mock-wss-id");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getUserByEmail tests
  it("should get a user by email successfully", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "test-id",
      Items: [
        {
          pk: "USER#mock-uuid",
          sk: "PROFILE",
          userId: "mock-uuid",
          userName: "Test User",
          email: "test@example.com",
          dateOfBirth: "1990-01-01",
          password: "password123",
          createdAt: 1622121212121,
          userImageUrl: "http://example.com/image.jpg",
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getUserByEmail("test@example.com");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.user?.userName).toBe("Test User");
  });

  it("should return an error if DynamoDB query operation fails for getUserByEmail", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getUserByEmail("test@example.com");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getUsers tests
  it("should get all users successfully", async () => {
    const mockScanResponse = {
      statusCode: 200,
      Items: [
        {
          PK: "USER#mock-uuid",
          SK: "PROFILE",
          userId: "mock-uuid",
          userName: "Test User",
          email: "test@example.com",
          dateOfBirth: "1990-01-01",
          password: "password123",
          createdAt: 1622121212121,
          userImageUrl: "http://example.com/image.jpg",
        },
      ],
    };
    dynamoDBMock.prototype.dbScan.mockResolvedValue(mockScanResponse);

    const response = await getUsers();

    expect(dynamoDBMock.prototype.dbScan).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.users?.length).toBe(1);
  });

  it("should return an empty array if no users are found", async () => {
    const mockScanResponse = {
      statusCode: 200,
      Items: [],
    };
    dynamoDBMock.prototype.dbScan.mockResolvedValue(mockScanResponse);

    const response = await getUsers();

    expect(dynamoDBMock.prototype.dbScan).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.users?.length).toBe(0);
  });

  it("should return an error if DynamoDB scan operation fails", async () => {
    const mockScanErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbScan.mockResolvedValue(mockScanErrorResponse);

    const response = await getUsers();

    expect(dynamoDBMock.prototype.dbScan).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // deleteUser tests
  it("should delete a user successfully", async () => {
    const mockDeleteResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteResponse);

    const response = await deleteUser("mock-uuid");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it("should return an error if DynamoDB delete operation fails", async () => {
    const mockDeleteErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteErrorResponse);

    const response = await deleteUser("mock-uuid");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // updateUser tests
  it("should update a user successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const user: User = {
      PK: "USER#mock-uuid",
      SK: "PROFILE",
      userId: "mock-uuid",
      userName: "Updated User",
      email: "updated@example.com",
      dateOfBirth: "1990-01-01",
      password: "newpassword123",
      createdAt: 1622121212121,
      userImageUrl: "http://example.com/new-image.jpg",
    };

    const response = await updateUser(user);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.user?.userName).toBe("Updated User");
  });

  it("should return an error if DynamoDB put operation fails during user update", async () => {
    const mockPutErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutErrorResponse);

    const user: User = {
      PK: "USER#mock-uuid",
      SK: "PROFILE",
      userId: "mock-uuid",
      userName: "Updated User",
      email: "updated@example.com",
      dateOfBirth: "1990-01-01",
      password: "newpassword123",
      createdAt: 1622121212121,
      userImageUrl: "http://example.com/new-image.jpg",
    };

    const response = await updateUser(user);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });
});
