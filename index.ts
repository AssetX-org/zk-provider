import serverless from "serverless-http";
import app from "./app.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export const handler = serverless(app);
