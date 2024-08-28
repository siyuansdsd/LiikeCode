import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { logger } from "../../../shared/utils/logger";

let client: DynamoDBClient;
console.log("process.env.NODE_ENV : ", process.env.NODE_ENV);
if (process.env.NODE_ENV === "test") {
  process.env.TABLE_NAME = "TEST_TABLE";
  process.env.IS_MOCK = "true";
  process.env.ENV = "test";
  client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    tls: false,
    // region: "local-env",
    credentials: {
      accessKeyId: "fakeMyKeyId",
      secretAccessKey: "fakeSecretAccessKey",
    },
  });
} else {
  client = new DynamoDBClient({});
}

const dynamo = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: true,
  },
});

// TODO: Recommendation: Avoid using any
// TODO: investigate do we need sort key
// TODO: pagination for list

interface DbOutput {
  statusCode: number;
  data?: object;
  errorMessage?: string;
}

export default class DynamoDB {
  async dbPut(props: PutCommandInput): Promise<DbOutput> {
    try {
      const response = await dynamo.send(new PutCommand(props));
      logger.info("[DB] dbPut: " + JSON.stringify(response));
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      };
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      };
    }
  }

  async dbDelete(props: DeleteCommandInput): Promise<DbOutput> {
    try {
      const response = await dynamo.send(new DeleteCommand(props));
      logger.info("[DB] dbDelete: " + JSON.stringify(response));
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      };
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      };
    }
  }

  async dbGet(props: GetCommandInput): Promise<DbOutput> {
    try {
      const response = await dynamo.send(new GetCommand(props));
      logger.info("[DB] dbGet: " + JSON.stringify(response));
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: [response.Item],
      };
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      };
    }
  }

  // TODO: pagination
  async dbScan(props: ScanCommandInput) {
    try {
      const response = await dynamo.send(new ScanCommand(props));
      logger.info("[DB] dbScan: " + JSON.stringify(response));
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: response.Items,
      };
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      };
    }
  }

  async dbQuery(props: QueryCommandInput) {
    logger.info("Query params: " + JSON.stringify(props));
    try {
      const response = await dynamo.send(new QueryCommand(props));
      logger.info("[DB] dbQuery: " + JSON.stringify(response));
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: response.Items,
        id: response.$metadata.requestId,
      };
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      };
    }
  }
}
