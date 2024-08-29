module.exports = {
  tables: [
    {
      TableName: "DouglasChatTableTest",
      KeySchema: [
        { AttributeName: "pk", KeyType: "HASH" }, // Partition key
        { AttributeName: "sk", KeyType: "RANGE" }, // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "sk", AttributeType: "S" },
        { AttributeName: "GSI1PK", AttributeType: "S" },
        { AttributeName: "GSI1SK", AttributeType: "S" },
        { AttributeName: "wwsId", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" },
        { AttributeName: "createdAt", AttributeType: "N" },
        { AttributeName: "lastMessageAt", AttributeType: "N" },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "GSI1",
          KeySchema: [
            { AttributeName: "GSI1PK", KeyType: "HASH" },
            { AttributeName: "GSI1SK", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
        {
          IndexName: "GSI_PK_wwsId",
          KeySchema: [{ AttributeName: "wwsId", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
        },
        {
          IndexName: "GSI_PK_email",
          KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
        },
        {
          IndexName: "GSI_PK_SK_SK_PK",
          KeySchema: [
            { AttributeName: "sk", KeyType: "HASH" },
            { AttributeName: "pk", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: "LSI_createdAt",
          KeySchema: [
            { AttributeName: "pk", KeyType: "HASH" },
            { AttributeName: "createdAt", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
        {
          IndexName: "LSI_lastMessageAt",
          KeySchema: [
            { AttributeName: "pk", KeyType: "HASH" },
            { AttributeName: "lastMessageAt", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  ],
};
