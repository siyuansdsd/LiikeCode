import {
  createGroup,
  getGroup,
  getGroups,
  deleteGroup,
  updateGroup,
} from "../group.service";
import DynamoDB from "../../dynamoDB/dynamoDB";
import { Group } from "../../interfaces/interfaces";

// Mock the DynamoDB class
jest.mock("../../dynamoDB/dynamoDB");

describe("Group Service", () => {
  const dynamoDBMock = DynamoDB as jest.MockedClass<typeof DynamoDB>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a group successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const groupName = "Test Group";
    const emoticon = "🙂";

    const response = await createGroup(groupName, emoticon);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.group?.groupName).toBe(groupName);
  });

  it("should return error when creating a group fails", async () => {
    const mockPutResponse = { statusCode: 500, errorMessage: "Internal Error" };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const response = await createGroup("Test Group", "🙂");

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  it("should get a group by ID successfully", async () => {
    const mockGetResponse = {
      statusCode: 200,
      Item: {
        pk: "GROUP#test-id",
        sk: "METADATA",
        groupId: "test-id",
        groupName: "Test Group",
        emoticon: "🙂",
        createdAt: 1622121212121,
      },
    };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetResponse);

    const response = await getGroup("test-id");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.group?.groupName).toBe("Test Group");
  });

  it("should return error when getting a group by ID fails", async () => {
    const mockGetResponse = { statusCode: 500, errorMessage: "Internal Error" };
    dynamoDBMock.prototype.dbGet.mockResolvedValue(mockGetResponse);

    const response = await getGroup("test-id");

    expect(dynamoDBMock.prototype.dbGet).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  it("should return an empty group list when no groups exist", async () => {
    const mockScanResponse = { statusCode: 200, Items: [] };
    dynamoDBMock.prototype.dbScan.mockResolvedValue(mockScanResponse);

    const response = await getGroups();

    expect(dynamoDBMock.prototype.dbScan).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.groups?.length).toBe(0);
  });

  it("should return groups successfully", async () => {
    const mockScanResponse = {
      statusCode: 200,
      Items: [
        {
          pk: "GROUP#test-id-1",
          sk: "METADATA",
          groupId: "test-id-1",
          groupName: "Test Group 1",
          emoticon: "🙂",
          createdAt: 1622121212121,
        },
      ],
    };
    dynamoDBMock.prototype.dbScan.mockResolvedValue(mockScanResponse);

    const response = await getGroups();

    expect(dynamoDBMock.prototype.dbScan).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.groups?.length).toBe(1);
  });

  it("should delete a group by ID successfully", async () => {
    const mockDeleteResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteResponse);

    const response = await deleteGroup("test-id");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it("should return error when deleting a group fails", async () => {
    const mockDeleteResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbDelete.mockResolvedValue(mockDeleteResponse);

    const response = await deleteGroup("test-id");

    expect(dynamoDBMock.prototype.dbDelete).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });

  it("should update a group successfully", async () => {
    const mockPutResponse = { statusCode: 200 };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const group: Group = {
      PK: "GROUP#test-id",
      SK: "METADATA",
      groupId: "test-id",
      groupName: "Updated Group",
      emoticon: "😎",
      createdAt: 1622121212121,
    };

    const response = await updateGroup(group);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.group?.groupName).toBe("Updated Group");
  });

  it("should return an error when dbScan fails", async () => {
    const mockScanErrorResponse = {
      statusCode: 500,
      errorMessage: "Internal Error",
    };
    dynamoDBMock.prototype.dbScan.mockResolvedValue(mockScanErrorResponse);

    const response = await getGroups();

    expect(dynamoDBMock.prototype.dbScan).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
    expect(response.groups).toEqual([]); // No groups should be returned
  });

  it("should return error when updating a group fails", async () => {
    const mockPutResponse = { statusCode: 500, errorMessage: "Internal Error" };
    dynamoDBMock.prototype.dbPut.mockResolvedValue(mockPutResponse);

    const group: Group = {
      PK: "GROUP#test-id",
      SK: "METADATA",
      groupId: "test-id",
      groupName: "Updated Group",
      emoticon: "😎",
      createdAt: 1622121212121,
    };

    const response = await updateGroup(group);

    expect(dynamoDBMock.prototype.dbPut).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.errorMessage).toBe("Internal Error");
  });
});
