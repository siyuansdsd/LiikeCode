import {
  createUserGroup,
  getUserGroup,
  getUserGroupsByUser,
  deleteUserGroup,
  getUserGroupsByGroup,
  updateUserGroup,
} from "../userGroup.service";
import DynamoDB from "../../dynamoDB/dynamoDB";
import { UserGroup } from "../../interfaces/interfaces";
import { ids } from "webpack";

// Mock the DynamoDB class
jest.mock("../../dynamoDB/dynamoDB");

describe("UserGroup Service", () => {
  const dynamoDBMock = DynamoDB as jest.MockedClass<typeof DynamoDB>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // createUserGroup tests
  it("should create a user group successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const response = await createUserGroup("user1", "group1");

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.userGroup?.userId).toBe("user1");
  });

  it("should return an error if DynamoDB put operation fails during user group creation", async () => {
    const mockPutErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutErrorResponse);

    const response = await createUserGroup("user1", "group1");

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getUserGroup tests
  it("should get a user group successfully", async () => {
    const mockGetResponse = {
      statusCode: 200,
      Item: {
        pk: "USER#user1",
        sk: "GROUP#group1",
        userId: "user1",
        groupId: "group1",
        joinedAt: 1622121212121,
      },
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetResponse);

    const response = await getUserGroup("user1", "group1");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.userGroup?.userId).toBe("user1");
  });

  it("should return an error if DynamoDB get operation fails", async () => {
    const mockGetErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetErrorResponse);

    const response = await getUserGroup("user1", "group1");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getUserGroupsByUser tests
  it("should get user groups by user successfully", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "user1",
      Items: [
        {
          pk: "USER#user1",
          sk: "GROUP#group1",
          userId: "user1",
          groupId: "group1",
          joinedAt: 1622121212121,
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getUserGroupsByUser("user1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.userGroups?.length).toBe(1);
  });

  it("should return an empty array if no user groups are found", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "user1",
      Items: [],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getUserGroupsByUser("user1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.userGroups?.length).toBe(0);
  });

  it("should return an error if DynamoDB query operation fails for getUserGroupsByUser", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getUserGroupsByUser("user1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // getUserGroupsByGroup tests
  it("should get user groups by group successfully", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "group1",
      Items: [
        {
          pk: "USER#user1",
          sk: "GROUP#group1",
          userId: "user1",
          groupId: "group1",
          joinedAt: 1622121212121,
        },
      ],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getUserGroupsByGroup("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.userGroups?.length).toBe(1);
  });

  it("should return an empty array if no user groups are found for a group", async () => {
    const mockQueryResponse = {
      statusCode: 200,
      id: "group1",
      Items: [],
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryResponse);

    const response = await getUserGroupsByGroup("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it("should return an error if DynamoDB query operation fails for getUserGroupsByGroup", async () => {
    const mockQueryErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbQuery.mockResolvedValue(mockQueryErrorResponse);

    const response = await getUserGroupsByGroup("group1");

    expect(dynamoDBMock.prototype.dbQuery).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // deleteUserGroup tests
  it("should delete a user group successfully", async () => {
    const mockDeleteResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteResponse);

    const response = await deleteUserGroup("user1", "group1");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it("should return an error if DynamoDB delete operation fails", async () => {
    const mockDeleteErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteErrorResponse);

    const response = await deleteUserGroup("user1", "group1");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  // updateUserGroup tests
  it("should update a user group successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const userGroup: UserGroup = {
      PK: "USER#user1",
      SK: "GROUP#group1",
      userId: "user1",
      groupId: "group1",
      joinedAt: 1622121212121,
    };

    const response = await updateUserGroup(userGroup);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.userGroup?.userId).toBe("user1");
  });

  it("should return an error if DynamoDB put operation fails during user group update", async () => {
    const mockPutErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutErrorResponse);

    const userGroup: UserGroup = {
      PK: "USER#user1",
      SK: "GROUP#group1",
      userId: "user1",
      groupId: "group1",
      joinedAt: 1622121212121,
    };

    const response = await updateUserGroup(userGroup);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });
});
