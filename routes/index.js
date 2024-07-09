import express from "express";
import { ProofGen } from "../utils/zokrates.js";
var router = express.Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});
router.post("/", async (req, res) => {
  try {
    const { owner, title, data } = req.body;

    console.log(owner, title, data);
    console.log("body:", req.body);
    const proof = await ProofGen(owner, title, data);
    console.log(proof);
    res.json({ proof });
  } catch (error) {
    console.error("Error generating proof:", error);
    res.status(500).json({ error: "Failed to generate proof" });
  }
});

export default router;
