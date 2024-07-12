import express from "express";
import { ProofGen, VerifyProof } from "../utils/zokrates.js";
var router = express.Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});
router.post("/proof-gen", async (req, res) => {
  try {
    const { owner, title, data } = req.body;

    console.log(owner, title, data);
    console.log("body:", req.body);
    const proof = await ProofGen(owner, title, data);
    console.log("Gen Proof:", proof);
    res.json({ proof });
  } catch (error) {
    console.error("Error generating proof:", error);
    res.status(500).json({ error: "Failed to generate proof" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { proof } = req.body;

    const result = await VerifyProof(proof);
    console.log(result);
    res.json({ result });
  } catch (error) {
    console.error("Error Verifying Proof:", error);
    res.status(500).json({ error: "Failed to Verifying Proof" });
  }
});

export default router;
