import app from "./app";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import serverless from "serverless-http";

const serverlessApp = serverless(app);

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2
> = async (
  event: APIGatewayProxyEvent,
  context
): Promise<APIGatewayProxyResultV2> => {
  return await serverlessApp(event, context);
};
