import app from "./app.js";
import serverless from "serverless-http";

export const handler = serverless(app);

const startServer = async () => {
  app.listen(3000, () => {
    console.log("listening on port 3000!");
  });
};

startServer();
