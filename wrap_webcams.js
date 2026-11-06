const fs = require('fs');
let c = fs.readFileSync('D:/projects/omniscope-web/_worker.js', 'utf8');

const startSig = 'async function handleWebcams(url, request, env) {';
const startIdx = c.indexOf(startSig);
const sitrepSig = 'async function handleSitrep(url) {';
const sitrepIdx = c.indexOf(sitrepSig);

if (startIdx === -1 || sitrepIdx === -1) {
  console.error('Could not locate handleWebcams or handleSitrep');
  process.exit(1);
}

// Find the last closing brace before handleSitrep
const between = c.slice(startIdx + startSig.length, sitrepIdx);
const lastBraceIdx = between.lastIndexOf('}');
if (lastBraceIdx === -1) {
  console.error('Could not locate closing brace');
  process.exit(1);
}

const funcBody = between.slice(0, lastBraceIdx);
const newBody = `\n  try {\n${funcBody}\n  } catch (err) {\n    return jsonResponse({ status: "ok", fallback: true, count: 0, webcams: [], cameras: [] }, 200);\n  }\n}\n\n`;

c = c.slice(0, startIdx + startSig.length) + newBody + between.slice(lastBraceIdx + 1) + c.slice(sitrepIdx);
fs.writeFileSync('D:/projects/omniscope-web/_worker.js', c, 'utf8');
console.log('Successfully wrapped handleWebcams in try-catch!');
