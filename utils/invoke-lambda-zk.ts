import AWS from "aws-sdk";
import "dotenv/config";

const aws_access_key_id = process.env.AWS_ACCESS_KEY_ID;
const aws_scret_access_key = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.update({
  region: "ap-south-1",
  credentials: new AWS.Credentials(aws_access_key_id, aws_scret_access_key),
});

const lambda = new AWS.Lambda();

export const callProofGen = async ({ owner, title, data }) => {
  const params = {
    FunctionName: "proof-generation-lambda-function",
    Payload: JSON.stringify({
      owner: owner,
      title: title,
      data: data,
    }),
  };

  try {
    const data = await lambda.invoke(params).promise();
    return JSON.parse(data.Payload.toString());
  } catch (error) {
    console.error("Error calling Lambda function:", error);
    throw error;
  }
};
