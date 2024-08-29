import * as Cdk from "aws-cdk-lib";
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as Cloudwatch from "aws-cdk-lib/aws-cloudwatch";

export const createDynamoDB = (stack: Cdk.Stack) => {
  const table = new Dynamodb.Table(stack, "DouglasChatTable-1", {
    tableName: process.env.CHAT_TABLE as string,
    partitionKey: {
      name: "pk",
      type: Dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "sk",
      type: Dynamodb.AttributeType.STRING,
    },
    billingMode: Dynamodb.BillingMode.PAY_PER_REQUEST, // on-demand
    removalPolicy: Cdk.RemovalPolicy.DESTROY,
  });

  // create alarms
  new Cloudwatch.Alarm(stack, "PropertyTableReadCapacityUnitsLimit", {
    metric: table.metricConsumedReadCapacityUnits(),
    threshold: 25, // threshold * 4 KB/S
    evaluationPeriods: 1,
    datapointsToAlarm: 1,
    comparisonOperator:
      Cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    treatMissingData: Cloudwatch.TreatMissingData.NOT_BREACHING,
  });

  new Cloudwatch.Alarm(stack, "PropertyTableWriteCapacityUnitsLimit", {
    metric: table.metricConsumedWriteCapacityUnits(),
    threshold: 25, // threshold * 1 KB/S
    evaluationPeriods: 1,
    datapointsToAlarm: 1,
    comparisonOperator:
      Cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    treatMissingData: Cloudwatch.TreatMissingData.NOT_BREACHING,
  });

  // GSIs
  // used by createMessage
  table.addGlobalSecondaryIndex({
    indexName: "GSI1",
    partitionKey: {
      name: "GSI1PK",
      type: Dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "GSI1SK",
      type: Dynamodb.AttributeType.STRING,
    },
  });

  // used by getUserByWssId
  table.addGlobalSecondaryIndex({
    indexName: "GSI_PK_wwsId",
    partitionKey: {
      name: "wwsId",
      type: Dynamodb.AttributeType.STRING,
    },
  });

  // used by getUserByEmail
  table.addGlobalSecondaryIndex({
    indexName: "GSI_PK_email",
    partitionKey: {
      name: "email",
      type: Dynamodb.AttributeType.STRING,
    },
  });

  // used by getUserGroup
  table.addGlobalSecondaryIndex({
    indexName: "GSI_PK_SK_SK_PK",
    partitionKey: {
      name: "sk",
      type: Dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "pk",
      type: Dynamodb.AttributeType.STRING,
    },
  });

  // LSIs
  // used by getMessagesByThreadOrdered
  table.addLocalSecondaryIndex({
    indexName: "LSI_createdAt",
    sortKey: {
      name: "createdAt",
      type: Dynamodb.AttributeType.NUMBER,
    },
  });

  // used by getThreadsByGroupOrdered
  table.addLocalSecondaryIndex({
    indexName: "LSI_lastMessageAt",
    sortKey: {
      name: "lastMessageAt",
      type: Dynamodb.AttributeType.NUMBER,
    },
  });

  new Cdk.CfnOutput(stack, "ChatTableName", {
    value: table.tableName,
    description: "The name of the Chat Table",
  });

  new Cdk.CfnOutput(stack, "ChatTableArn", {
    value: table.tableArn,
    description: "The ARN of the Chat Table",
  });

  return table;
};
