#!/usr/bin/env node
/**
 * OmniScope Encrypted Edge Telemetry Reader (AES-256-GCM)
 * Usage:
 *   set OMNISCOPE_OPS_SECRET=your-secret
 *   node ops_telemetry.mjs [https://omniscope-web.pages.dev]
 */
import crypto from "node:crypto";

const baseUrl = (process.argv[2] || "https://omniscope-web.pages.dev").replace(/\/$/, "");
const secret = process.env.OMNISCOPE_OPS_SECRET || "";

if (!secret) {
  console.error("Missing OMNISCOPE_OPS_SECRET env var. Set secret first with: npx wrangler secret put OMNISCOPE_OPS_SECRET");
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
