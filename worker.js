export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get("user-agent") || "";
    const lowerUA = userAgent.toLowerCase();

    // 0. Handle www redirects cleanly (avoid origin loops)
    if (url.hostname.startsWith("www.")) {
      const cleanUrl = new URL(request.url);
      cleanUrl.hostname = url.hostname.replace(/^www\./, "");
      return Response.redirect(cleanUrl.toString(), 301);
    }

    // 1. Allow and serve robots.txt dynamically
    if (url.pathname === "/robots.txt") {
      const robotsTxt = `# ==============================================================================
# OmniScope OSINT - Tactical Search & Scraper Policy (RFC 9309)
# Search Engines: ALLOWED | AI Scrapers & Data Harvesters: STRICTLY BLOCKED
# ==============================================================================

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Google-InspectionTool
Allow: /

User-agent: bingbot
Allow: /

User-agent: msnbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Slurp
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

User-agent: Qwantify
Allow: /

User-agent: SeznamBot
Allow: /

User-agent: BraveBot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: cohere-training-data-crawler
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Quora-Bot
Disallow: /

User-agent: Poe-Bot
Disallow: /

User-agent: Scrapy
Disallow: /

User-agent: omgili
Disallow: /

User-agent: omgilibot
Disallow: /

User-agent: ImagesiftBot
Disallow: /

User-agent: Kangaroo Bot
Disallow: /

User-agent: Timpibot
Disallow: /

User-agent: VelenPublicWebCrawler
Disallow: /

User-agent: Webzio-Extended
Disallow: /

User-agent: YouBot
Disallow: /

User-agent: SemanticScholarBot
Disallow: /

User-agent: *
Allow: /
Disallow: /api/proxy/

Sitemap: https://omniscope-web.pages.dev/sitemap.xml
Sitemap: https://omniscope-web.fuchsdany1984.workers.dev/sitemap.xml
`;
      return new Response(robotsTxt, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          "X-Robots-Tag": "all",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 2. Serve sitemap.xml dynamically
    if (url.pathname === "/sitemap.xml") {
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://omniscope-web.pages.dev/</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://omniscope-web.fuchsdany1984.workers.dev/</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
      return new Response(sitemapXml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 3. Search Engine Whitelist
    const searchEngineBots = [
      "googlebot",
      "google-inspectiontool",
      "bingbot",
      "msnbot",
      "duckduckbot",
      "applebot",
      "slurp",
      "baiduspider",
      "yandexbot",
      "qwantify",
      "seznambot",
      "bravebot"
    ];
    const isSearchEngine = searchEngineBots.some(bot => lowerUA.includes(bot));

    // 4. Blocked AI Harvesters & Unwanted Scrapers
    const blockedScrapers = [
      "gptbot",
      "chatgpt-user",
      "oai-searchbot",
      "claudebot",
      "anthropic-ai",
      "claude-web",
      "ccbot",
      "bytespider",
      "perplexitybot",
      "facebookbot",
      "meta-externalagent",
      "cohere-ai",
      "cohere-training-data-crawler",
      "diffbot",
      "amazonbot",
      "google-extended",
      "applebot-extended",
      "quora",
      "poe-bot",
      "poe",
      "scrapy",
      "omgili",
      "omgilibot",
      "imagesiftbot",
      "kangaroo",
      "timpibot",
      "velenpublicwebcrawler",
      "webzio",
      "youbot",
      "semanticscholarbot"
    ];

    if (!isSearchEngine) {
      const isBlockedScraper = blockedScrapers.some(bad => lowerUA.includes(bad));
      if (isBlockedScraper) {
        return new Response(
          `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>403 FORBIDDEN // OMNISCOPE ANTI-SCRAPER DEFENSE</title>
  <style>
    body { background: #07090e; color: #ff0055; font-family: 'Consolas', 'Courier New', monospace; padding: 40px; text-align: center; }
    .card { max-width: 650px; margin: 40px auto; border: 1px solid #ff0055; box-shadow: 0 0 25px rgba(255, 0, 85, 0.4); padding: 30px; background: #0c0f17; }
    h1 { font-size: 20px; letter-spacing: 2px; text-shadow: 0 0 10px #ff0055; }
    p { color: #8892b0; font-size: 14px; line-height: 1.6; }
    .badge { display: inline-block; padding: 4px 10px; background: rgba(255,0,85,0.15); border: 1px solid #ff0055; font-size: 11px; margin-top: 15px; }
    .info { color: #00ffff; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>[ACCESS DENIED: 403 FORBIDDEN]</h1>
    <p>Automated AI scrapers, LLM training crawlers and unauthorized content extraction bots are strictly blocked by OmniScope Tactical Edge Security.</p>
    <p>Legitimate search engine indexers (Google, Bing, DuckDuckGo) and human web users are welcomed.</p>
    <div class="badge">SECURITY RULE: ZERO-HARVESTING & ANTI-AI-SCRAPER ENFORCED</div>
    <div class="info">User-Agent Detected: ${userAgent.replace(/</g, "&lt;")}</div>
  </div>
</body>
</html>`,
          {
            status: 403,
            statusText: "Forbidden - AI Scraper Blocked",
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "X-Robots-Tag": "noindex, nofollow, noarchive, noai, noimageai",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    // 5. Forward legitimate requests to static assets (NEVER fallback to fetch(request) which loops to missing origin)
    let response;
    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      response = await env.ASSETS.fetch(request);
      // SPA Fallback for non-file routes
      if (response.status === 404 && !url.pathname.includes(".")) {
        const indexUrl = new URL("/index.html", request.url);
        response = await env.ASSETS.fetch(new Request(indexUrl, request));
      }
    } else {
      return new Response("OmniScope OSINT - Tactical Edge System Ready", {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Robots-Tag", "noai, noimageai");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
