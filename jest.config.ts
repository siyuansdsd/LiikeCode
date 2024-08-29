import { Config } from "@jest/types";
import path from "path";

process.env.JEST_DYNAMODB_CONFIG = path.resolve(
  __dirname,
  "./jest-dynamodb-config"
);

const baseTestDir = "<rootDir>/src/lambdas/test/main_test";

const config: Config.InitialOptions = {
  testEnvironment: "node",
  testMatch: [`${baseTestDir}/**/*.test.ts`],
  collectCoverageFrom: ["src/data/service/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};

module.exports = {
  ...config,
  preset: "@shelf/jest-dynamodb",
};
export default config;
