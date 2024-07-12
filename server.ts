import serverless from "serverless-http";
import app from "./app";

export const serverlessApp = serverless(app);
