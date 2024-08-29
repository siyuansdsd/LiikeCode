import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { createApiGateWay } from "../src/cdk/createApiGateWay";
import { createDynamoDB } from "../src/cdk/createDynamoDB";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LiikeTaskStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    createDynamoDB(this);
    createApiGateWay(this);
  }
}
