import * as crypto from "crypto";
import {
  CompilationArtifacts,
  initialize,
  ZoKratesProvider,
} from "zokrates-js";
import { readFileSync } from "fs";

function hashString(inputString, hashLength) {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  return hash.digest("hex").slice(0, hashLength);
}

function stringToHex(str) {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i).toString(16);
    hex += charCode.length < 2 ? "0" + charCode : charCode;
  }
  return hex;
}

let zk: ZoKratesProvider | null = null;
let artifacts: CompilationArtifacts;
let provingKey: Uint8Array;
let verifyingKey = null;
function base64ToUint8Array(base64String) {
  const binaryString = atob(base64String);
  const length = binaryString.length;
  const uint8Array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}

async function initializeZok() {
  if (!zk) {
    zk = await initialize();
    try {
      const source = readFileSync("zk-circuit/root.zok", "utf-8");
      artifacts = zk.compile(source);

      provingKey = base64ToUint8Array(
        readFileSync("zk-circuit/proving.key").toString("base64")
      );

      verifyingKey = JSON.parse(
        readFileSync("zk-circuit/verification.key", "utf-8")
      );

      console.log("Type:", typeof verifyingKey);

      console.log("Initialized Zokrates.");
    } catch (error) {
      console.error("Error initializing Zokrates:", error);
      zk = null;
    }
  }
}

export async function ProofGen(owner, title, data) {
  try {
    console.log("Initializing Zokrates...");
    await initializeZok();

    const hashedOwner = stringToHex(hashString(owner, 16));
    const hashedTitle = stringToHex(hashString(title, 16));
    const hashedData = stringToHex(hashString(data || "", 16));

    const out = zk.computeWitness(artifacts!, [
      hashedOwner,
      hashedTitle,
      hashedData,
    ]);
    console.log("Computed witness:", out.witness);
    console.log("artifact:", artifacts!.program);
    console.log("provingKey:", provingKey);
    const proof = zk.generateProof(artifacts.program, out.witness, provingKey);

    return proof;
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}

export async function VerifyProof(proof) {
  if (zk && verifyingKey) {
    await initializeZok();

    try {
      const result = zk.verify(verifyingKey, proof);
      console.log("Verification result:", result);
      return result;
    } catch (error) {
      console.error("Error processing request:", error);
      throw error;
    }
  }
}
