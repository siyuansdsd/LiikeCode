#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LiikeTaskStack } from "../lib/liike_task-stack";
import dotenv from "dotenv";

dotenv.config();
const app = new cdk.App();
new LiikeTaskStack(app, "LiikeTaskStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
