import * as Cdk from "aws-cdk-lib";
import * as Apigateway from "aws-cdk-lib/aws-apigateway";
import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as Lambda from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

export const createApiGateWay = (stack: Cdk.Stack) => {
  const lambda = new NodejsFunction(stack, "ChatHttpLambda", {
    entry: join("./.build/chat.js"),
    handler: "httpHandler",
    runtime: Lambda.Runtime.NODEJS_18_X,
  });

  lambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:*"],
      resources: [
        `${process.env.CHAT_TABLE_ARN as string}`,
        `${process.env.CHAT_TABLE_ARN as string}/index/*`, // for GISs
      ],
    })
  );

  const api = new Apigateway.RestApi(stack, "ChatApi", {
    restApiName: "Chat Service",
  });

  // /users
  const resource = api.root.addResource("users");
  // /users/register
  const register = resource.addResource("register");

  const Methods = ["POST", "OPTIONS", "GET", "PUT", "DELETE"];
  for (const method of Methods) {
    register.addMethod(method, new Apigateway.LambdaIntegration(lambda));
    resource.addMethod(method, new Apigateway.LambdaIntegration(lambda));
  }

  new Cdk.CfnOutput(stack, "ChatApiUrl", {
    value: api.url,
    description: "Chat API URL",
  });
};
