#!/usr/bin/env node
/**
 * OmniScope Encrypted Edge Telemetry Reader (AES-256-GCM)
 * Usage:
 *   node ops_telemetry.mjs [https://omniscope-web.pages.dev]
 * Reads OMNISCOPE_OPS_SECRET from env or gitignored local file `.ops_secret.local`.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = (process.argv[2] || "https://omniscope-web.pages.dev").replace(/\/$/, "");
let secret = (process.env.OMNISCOPE_OPS_SECRET || "").trim();

if (!secret) {
  const localSecretPath = path.join(path.dirname(fileURLToPath(import.meta.url)), ".ops_secret.local");
  if (fs.existsSync(localSecretPath)) {
    secret = fs.readFileSync(localSecretPath, "utf8").trim();
  }
}

if (!secret) {
  console.error("Missing OMNISCOPE_OPS_SECRET env var or gitignored .ops_secret.local file.");
  process.exit(1);
}

const res = await fetch(`${baseUrl}/api/ops/telemetry`, {
  headers: {
    "X-Omni-Ops-Key": secret,
    "User-Agent": "OmniScope-OpsClient/2.9.4"
  }
});

const json = await res.json();
if (!res.ok || !json.encrypted) {
  console.error(`HTTP ${res.status}:`, JSON.stringify(json, null, 2));
  process.exit(1);
}

const { iv, ciphertext } = json.encrypted;
const keyHash = crypto.createHash("sha256").update(secret, "utf8").digest();
const ivBuf = Buffer.from(iv, "base64");
const dataBuf = Buffer.from(ciphertext, "base64");
const tag = dataBuf.subarray(dataBuf.length - 16);
const encPayload = dataBuf.subarray(0, dataBuf.length - 16);

const decipher = crypto.createDecipheriv("aes-256-gcm", keyHash, ivBuf);
decipher.setAuthTag(tag);
const decrypted = Buffer.concat([decipher.update(encPayload), decipher.final()]).toString("utf8");
console.log(JSON.stringify(JSON.parse(decrypted), null, 2));
