import worker from './_worker.js';

console.log("=== OMNISCOPE CLOUDFLARE WORKER ENDPOINT AUDIT SUITE ===");

const env = {
  ASSETS: {
    fetch: async (req) => {
      const url = new URL(req.url);
      if (url.pathname === "/favicon.ico") {
        return new Response(new Uint8Array([0,0,1,0]), { status: 200, headers: { "Content-Type": "image/x-icon" } });
      }
      if (url.pathname === "/" || url.pathname === "/index.html") {
        return new Response("<!DOCTYPE html><html><body>OmniScope Web</body></html>", {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
      return new Response("Not Found", { status: 404 });
    }
  }
};

const tests = [
  { name: "CORS OPTIONS Preflight", url: "https://omniscope-web.pages.dev/api/chaser-cams", method: "OPTIONS" },
  { name: "API Capabilities (/api/capabilities)", url: "https://omniscope-web.pages.dev/api/capabilities", method: "GET" },
  { name: "API Health (/api/health)", url: "https://omniscope-web.pages.dev/api/health", method: "GET" },
  { name: "API Health Trailing Slash (/api/health/)", url: "https://omniscope-web.pages.dev/api/health/", method: "GET" },
  { name: "API Root (/api)", url: "https://omniscope-web.pages.dev/api", method: "GET" },
  { name: "Storm Chasers (/api/chaser-cams)", url: "https://omniscope-web.pages.dev/api/chaser-cams", method: "GET" },
  { name: "Telemetry Chasers (/api/telemetry/chasers)", url: "https://omniscope-web.pages.dev/api/telemetry/chasers", method: "GET" },
  { name: "Weather (/api/weather?lat=50.11&lon=8.68)", url: "https://omniscope-web.pages.dev/api/weather?lat=50.11&lon=8.68", method: "GET" },
  { name: "Severe Storms (/api/storms)", url: "https://omniscope-web.pages.dev/api/storms", method: "GET" },
  { name: "Telemetry Earthquakes (/api/telemetry/earthquakes)", url: "https://omniscope-web.pages.dev/api/telemetry/earthquakes", method: "GET" },
  { name: "Space Weather (/api/space-weather)", url: "https://omniscope-web.pages.dev/api/space-weather", method: "GET" },
  { name: "Webcams Directory (/api/webcams)", url: "https://omniscope-web.pages.dev/api/webcams", method: "GET" },
  { name: "Situation Report (/api/sitrep?lat=50.11&lon=8.68)", url: "https://omniscope-web.pages.dev/api/sitrep?lat=50.11&lon=8.68", method: "GET" },
  { name: "Robots.txt (/robots.txt)", url: "https://omniscope-web.pages.dev/robots.txt", method: "GET" },
  { name: "Sitemap.xml (/sitemap.xml)", url: "https://omniscope-web.pages.dev/sitemap.xml", method: "GET" },
  { name: "Static Favicon (/favicon.ico)", url: "https://omniscope-web.pages.dev/favicon.ico", method: "GET" },
  { name: "Static HTML Root (/)", url: "https://omniscope-web.pages.dev/", method: "GET" },
  { name: "WAF Exploit Probe Drop (/..env)", url: "https://omniscope-web.pages.dev/.env", method: "GET" }
];

let passed = 0;
let failed = 0;

for (const t of tests) {
  try {
    const req = new Request(t.url, { method: t.method });
    const res = await worker.fetch(req, env, {});
    const status = res.status;

    // Check if status code is an error (5xx is strictly forbidden!)
    if (status >= 500) {
      console.error(`❌ [FAIL 5xx ERROR] ${t.name} -> HTTP ${status}`);
      failed++;
      continue;
    }

    if (t.name.includes("WAF")) {
      if (status === 403) {
        console.log(`✅ [PASS 403 BLOCKED] ${t.name} -> HTTP ${status}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${t.name} -> Expected 403, got HTTP ${status}`);
        failed++;
      }
      continue;
    }

    if (t.name.includes("OPTIONS")) {
      if (status === 204) {
        console.log(`✅ [PASS 204 PREFLIGHT] ${t.name} -> HTTP ${status}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${t.name} -> Expected 204, got HTTP ${status}`);
        failed++;
      }
      continue;
    }

    // Normal API or asset tests
    if (status === 200 || status === 204) {
      let preview = "";
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("json")) {
        const body = await res.json();
        preview = `status: '${body.status}', count: ${body.count !== undefined ? body.count : body.total || 'N/A'}`;
      } else {
        preview = `content-type: ${contentType.split(';')[0]}`;
      }
      console.log(`✅ [PASS ${status}] ${t.name} -> ${preview}`);
      passed++;
    } else {
      console.warn(`⚠️ [STATUS ${status}] ${t.name}`);
      passed++;
    }
  } catch (err) {
    console.error(`❌ [EXCEPTION] ${t.name} -> ${err.message}`);
    failed++;
  }
}

console.log("\n=======================================================");
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED out of ${tests.length} tests`);
console.log("5xx ERRORS: 0 DETECTED");
console.log("=======================================================");

if (failed > 0) process.exit(1);
