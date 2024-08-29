import * as Cdk from "aws-cdk-lib";
import * as Apigateway from "aws-cdk-lib/aws-apigateway";
import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as Lambda from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { join } from "path";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import dotenv from "dotenv";

dotenv.config();

export const createApiGateWay = (stack: Cdk.Stack) => {
  // lambda for http
  const userLambda = new NodejsFunction(stack, "ChatUserLambda", {
    entry: join("./.build/chat.js"),
    handler: "httpHandler",
    runtime: Lambda.Runtime.NODEJS_18_X,
  });

  userLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      resources: [
        `${process.env.CHAT_TABLE_ARN as string}`,
        `${process.env.CHAT_TABLE_ARN as string}/index/*`, // for GISs
      ],
    })
  );

  const groupLambda = new NodejsFunction(stack, "ChatGroupLambda", {
    entry: join("./.build/chat.js"),
    handler: "httpHandler",
    runtime: Lambda.Runtime.NODEJS_18_X,
  });

  groupLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      resources: [
        `${process.env.CHAT_TABLE_ARN as string}`,
        `${process.env.CHAT_TABLE_ARN as string}/index/*`, // for GISs
      ],
    })
  );

  const threadLambda = new NodejsFunction(stack, "ChatThreadLambda", {
    entry: join("./.build/chat.js"),
    handler: "httpHandler",
    runtime: Lambda.Runtime.NODEJS_18_X,
  });

  threadLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      resources: [
        `${process.env.CHAT_TABLE_ARN as string}`,
        `${process.env.CHAT_TABLE_ARN as string}/index/*`, // for GISs
      ],
    })
  );

  const userApi = new Apigateway.RestApi(stack, "ChatUserApi", {
    restApiName: "Chat User Service",
  });
  const groupApi = new Apigateway.RestApi(stack, "ChatGroupApi", {
    restApiName: "Chat Group Service",
  });
  const threadApi = new Apigateway.RestApi(stack, "ChatThreadApi", {
    restApiName: "Chat Thread Service",
  });

  // lambda for websocket

  const connectionLambda = new NodejsFunction(stack, "ChatConnectionLambda", {
    entry: join("./.build/chat.js"),
    handler: "connectHandler",
    runtime: Lambda.Runtime.NODEJS_18_X,
  });

  connectionLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      resources: [
        `${process.env.CHAT_TABLE_ARN as string}/index/*`,
        `${process.env.CHAT_TABLE_ARN as string}`,
      ],
    })
  );

  const disconnectLambda = new NodejsFunction(stack, "ChatDisconnectLambda", {
    entry: join("./.build/chat.js"),
    handler: "disconnectHandler",
    runtime: Lambda.Runtime.NODEJS_18_X,
  });

  disconnectLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      resources: [
        `${process.env.CHAT_TABLE_ARN as string}`,
        `${process.env.CHAT_TABLE_ARN as string}/index/*`,
      ],
    })
  );

  const defaultLambda = new NodejsFunction(stack, "ChatDefaultLambda", {
    entry: join("./.build/chat.js"),
    handler: "defaultHandler",
    runtime: Lambda.Runtime.NODEJS_18_X,
  });

  defaultLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      resources: [
        `${process.env.CHAT_TABLE_ARN as string}`,
        `${process.env.CHAT_TABLE_ARN as string}/index/*`,
      ],
    })
  );

  defaultLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["execute-api:Invoke", "execute-api:ManageConnections"],
      resources: [`${process.env.API_ARN as string}`],
    })
  );

  const websocketApi = new apigatewayv2.WebSocketApi(stack, "WwsChatApi", {
    apiName: "WwsChatApi",
    connectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "connectionIntegration",
        connectionLambda
      ),
    },
    disconnectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "disconnectionIntegration",
        disconnectLambda
      ),
    },

    defaultRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "defaultIntegration",
        defaultLambda
      ),
    },
  });

  const stage = new apigatewayv2.WebSocketStage(stack, "ChatStage", {
    webSocketApi: websocketApi,
    stageName: "prod",
    autoDeploy: true,
  });

  new Cdk.CfnOutput(stack, "ChatWebSocketEndpoint", {
    value: websocketApi.apiEndpoint,
    description: "Chat WebSocket Endpoint",
  });

  // /users
  const userResource = userApi.root.addResource("users");
  const userResourceMethods = ["OPTIONS", "GET"];
  for (const method of userResourceMethods) {
    userResource.addMethod(
      method,
      new Apigateway.LambdaIntegration(userLambda)
    );
  }

  // /users/register
  const register = userResource.addResource("register");
  const registerMethods = ["POST", "OPTIONS"];
  for (const method of registerMethods) {
    register.addMethod(method, new Apigateway.LambdaIntegration(userLambda));
  }

  // /users/login
  const login = userResource.addResource("login");
  const loginMethods = ["POST", "OPTIONS"];
  for (const method of loginMethods) {
    login.addMethod(method, new Apigateway.LambdaIntegration(userLambda));
  }

  // /users/{userId}
  const user = userResource.addResource("{userId}");
  const userMethods = ["OPTIONS", "GET", "PUT", "DELETE"];
  for (const method of userMethods) {
    user.addMethod(method, new Apigateway.LambdaIntegration(userLambda));
  }

  // /users/{userId}/password
  const password = user.addResource("password");
  const passwordMethods = ["PUT", "OPTIONS"];
  for (const method of passwordMethods) {
    password.addMethod(method, new Apigateway.LambdaIntegration(userLambda));
  }

  // /users/{userId}/groups get users' groups
  const groups = user.addResource("groups");
  const groupsMethods = ["GET", "OPTIONS"];
  for (const method of groupsMethods) {
    groups.addMethod(method, new Apigateway.LambdaIntegration(userLambda));
  }

  // /groups create group by user
  const groupResource = groupApi.root.addResource("groups");
  const groupResourceMethods = ["POST", "GET", "OPTIONS"];
  for (const method of groupResourceMethods) {
    groupResource.addMethod(
      method,
      new Apigateway.LambdaIntegration(groupLambda)
    );
  }

  // /groups/{groupId}
  const group = groupResource.addResource("{groupId}");
  const groupMethods = ["GET", "OPTIONS"];
  for (const method of groupMethods) {
    group.addMethod(method, new Apigateway.LambdaIntegration(groupLambda));
  }

  // /groups/{groupId}/users
  const groupUsers = group.addResource("users");
  const groupUsersMethods = ["GET", "POST", "OPTIONS"];
  for (const method of groupUsersMethods) {
    groupUsers.addMethod(method, new Apigateway.LambdaIntegration(groupLambda));
  }

  // /groups/{groupId}/threads
  const groupThreads = group.addResource("threads");
  const groupThreadsMethods = ["GET", "OPTIONS"];
  for (const method of groupThreadsMethods) {
    groupThreads.addMethod(
      method,
      new Apigateway.LambdaIntegration(groupLambda)
    );
  }

  // /groups/{groupId}/threads/latest  get latest thread in specific group
  const groupThreadsLatest = groupThreads.addResource("latest");
  const groupThreadsLatestMethods = ["GET", "OPTIONS"];
  for (const method of groupThreadsLatestMethods) {
    groupThreadsLatest.addMethod(
      method,
      new Apigateway.LambdaIntegration(groupLambda)
    );
  }

  // /threads
  const threadResource = threadApi.root.addResource("threads");
  const threadResourceMethods = ["POST", "OPTIONS"];
  for (const method of threadResourceMethods) {
    threadResource.addMethod(
      method,
      new Apigateway.LambdaIntegration(threadLambda)
    );
  }

  // /threads/{threadId}?limit=v1&groupId=v2
  const thread = threadResource.addResource("{threadId}");
  const threadMethods = ["GET", "OPTIONS"];
  for (const method of threadMethods) {
    thread.addMethod(method, new Apigateway.LambdaIntegration(threadLambda));
  }

  new Cdk.CfnOutput(stack, "ChatApiUrl", {
    value: userApi.url,
    description: "Chat API URL",
  });

  // add cloudwatch alarms in case of high traffic when deploying
  new cloudwatch.Alarm(stack, "wssConnectCountAlarm", {
    metric: websocketApi.metric("ConnectCount"),
    threshold: 1000, // 1000 connections
    evaluationPeriods: 1,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    alarmDescription: "Alarm when connect count is greater than 1000",
  });

  new cloudwatch.Alarm(stack, "wssDisconnectCountAlarm", {
    metric: websocketApi.metric("DisconnectCount"),
    threshold: 1000, // 1000 connections
    evaluationPeriods: 1,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    alarmDescription: "Alarm when disconnect count is greater than 1000",
  });

  new cloudwatch.Alarm(stack, "wssMessageCountAlarm", {
    metric: websocketApi.metric("MessageCount"),
    threshold: 10000, // 10000 messages
    evaluationPeriods: 1,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    alarmDescription: "Alarm when message count is greater than 10000",
  });

  new cloudwatch.Alarm(stack, "wssMessageFailedCountAlarm", {
    metric: websocketApi.metric("MessageFailedCount"),
    threshold: 100, // 1000 failed messages
    evaluationPeriods: 1,
    comparisonOperator:
      cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    alarmDescription: "Alarm when failed message count is >= 100",
  });
};
