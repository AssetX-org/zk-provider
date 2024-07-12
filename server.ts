import app from "./app.js";
import serverless from "serverless-http";

// Adapt Express app for AWS Lambda
export const handler = serverless(app);
