import express from "express";
import { callProofGen } from "../utils/invoke-lambda-zk.js";

var router = express.Router();

router.get("/health", (req, res) => {
  res.json({ message: "API Health Okay" });
});

router.post("/proof-gen", async (req, res) => {
  try {
    const { owner, title, data } = req.body;

    const proof = await callProofGen({ owner, title, data });

    res.json({ proof });
  } catch (error) {
    console.error("Error generating proof:", error);
    res.status(500).json({ error: "Failed to generate proof" });
  }
});

// router.post("/verify", async (req, res) => {
//   try {
//     const { proof } = req.body;

//     const result = await VerifyProof(proof);
//     console.log(result);
//     res.json({ result });
//   } catch (error) {
//     console.error("Error Verifying Proof:", error);
//     res.status(500).json({ error: "Failed to Verifying Proof" });
//   }
// });

export default router;
