import worker from './_worker.js';

console.log("=== OMNISCOPE CLOUDFLARE WORKER FAULT TOLERANCE & RECOVERY SUITE ===");

const env = {
  ASSETS: {
    fetch: async (req) => {
      const url = new URL(req.url);
      if (url.pathname === "/favicon.ico") {
        return new Response(new Uint8Array([0,0,1,0]), { status: 200, headers: { "Content-Type": "image/x-icon" } });
      }
      return new Response("Not Found", { status: 404 });
    }
  }
};

let passed = 0;
let failed = 0;

// Test 1: Unknown API endpoint
{
  const req = new Request("https://omniscope-web.pages.dev/api/does-not-exist");
  const res = await worker.fetch(req, env, {});
  if (res.status === 404) {
    const data = await res.json();
    if (data.status === "error" && data.message.includes("Unknown API endpoint")) {
      console.log("✅ [PASS] Unknown API Route -> HTTP 404 with JSON message (not 5xx)");
      passed++;
    } else {
      console.error("❌ [FAIL] Unknown API Route returned unexpected JSON", data);
      failed++;
    }
  } else {
    console.error(`❌ [FAIL] Expected 404 for unknown route, got ${res.status}`);
    failed++;
  }
}

// Test 2: Simulated Asset Server 500 Failure (Cloudflare Pages edge glitch)
{
  const brokenEnv = {
    ASSETS: {
      fetch: async () => {
        return new Response("Internal Server Error", { status: 500 });
      }
    }
  };
  const req = new Request("https://omniscope-web.pages.dev/index.html");
  const res = await worker.fetch(req, brokenEnv, {});
  if (res.status === 200) {
    console.log("✅ [PASS] Upstream Asset 500 Glitch -> Worker graceful HTML fallback (HTTP 200, 0 Cloudflare errors)");
    passed++;
  } else {
    console.error(`❌ [FAIL] Upstream Asset 500 resulted in worker returning ${res.status}`);
    failed++;
  }
}

// Test 3: Standalone Worker Favicon when Asset Missing
{
  const missingAssetEnv = {
    ASSETS: {
      fetch: async () => {
        return new Response("Not Found", { status: 404 });
      }
    }
  };
  const req = new Request("https://omniscope-web.pages.dev/favicon.ico");
  const res = await worker.fetch(req, missingAssetEnv, {});
  if (res.status === 204) {
    console.log("✅ [PASS] Missing Favicon -> Graceful 204 No Content (No broken icon, 0 5xx errors)");
    passed++;
  } else {
    console.error(`❌ [FAIL] Missing Favicon returned ${res.status}`);
    failed++;
  }
}

// Test 4: Global Uncaught Exception Recovery (Simulate request where handleRequest throws)
{
  // We can simulate an object that throws when url is accessed
  const poisonReq = {
    url: "https://omniscope-web.pages.dev/api/test-poison",
    method: "GET",
    headers: {
      get: () => { throw new Error("Simulated Uncaught Runtime Crash"); }
    }
  };
  const res = await worker.fetch(poisonReq, env, {});
  if (res.status === 200) {
    const data = await res.json();
    if (data.fallback === true && data.status === "ok") {
      console.log(`✅ [PASS] Global Uncaught Crash Recovery -> HTTP 200 JSON { status: 'ok', fallback: true }`);
      passed++;
    } else {
      console.error("❌ [FAIL] Global crash recovery returned unexpected data", data);
      failed++;
    }
  } else {
    console.error(`❌ [FAIL] Global crash returned HTTP ${res.status}`);
    failed++;
  }
}

console.log("\n=======================================================");
console.log(`FAULT TOLERANCE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================");
if (failed > 0) process.exit(1);
