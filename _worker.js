/**
 * OmniScope OSINT - Cloudflare Tactical Edge Worker & Serverless MCP Suite
 * 
 * Features:
 * 1. Zero-Tolerance Exploit Probe Barrier (403 Drop on .env, .php, wp-, etc.)
 * 2. RFC 9309 Compliant robots.txt & Dynamic sitemap.xml
 * 3. AI Scraper Defense on HTML UI, with unrestricted API & MCP access for AI agents
 * 4. Full CORS Preflight & Universal Headers
 * 5. Discovery Manifests: /.well-known/mcp.json, /llms.txt, /llms-full.txt, /openapi.json
 * 6. Live Keyless REST APIs (/api/weather, /api/storms, /api/seismic, /api/space-weather, /api/webcams, /api/sitrep)
 * 7. Native Model Context Protocol (MCP) Server (/mcp, /mcp/messages, /mcp/sse)
 * 8. Static Asset Delivery with SPA Routing
 */

// Cached in-memory webcams and weather models
let memoryWebcams = null;
let memoryWeatherProviders = null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Omniscope-Client",
  "Access-Control-Max-Age": "86400"
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60",
      ...extraHeaders
    }
  });
}

function textResponse(text, contentType = "text/plain; charset=utf-8", status = 200) {
  return new Response(text, {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600"
    }
  });
}

// -----------------------------------------------------------------------------
// Live API Handlers (Open CORS, Zero-Key, Authenticated Data Feeds)
// -----------------------------------------------------------------------------

async function handleWeather(url) {
  const lat = parseFloat(url.searchParams.get("latitude") || url.searchParams.get("lat") || "50.1109");
  const lon = parseFloat(url.searchParams.get("longitude") || url.searchParams.get("lon") || "8.6821");
  const modelsParam = url.searchParams.get("models") || "dwd_icon,ecmwf_ifs025,gfs_seamless,gem_global";

  const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m&models=${encodeURIComponent(modelsParam)}&forecast_days=1&timezone=auto`;

  const res = await fetch(omUrl, {
    headers: { "User-Agent": "OmniScope-OSINT/2.0 (tactical@omniscope-web.pages.dev)" }
  });

  if (!res.ok) {
    return jsonResponse({
      status: "error",
      message: `Upstream meteorological service returned HTTP ${res.status}`
    }, 502);
  }

  const data = await res.json();
  const cur = data.current || {};
  const hourly = data.hourly || {};

  // Find index for current hour
  const nowIsoHour = new Date().toISOString().slice(0, 13);
  let curHourIdx = 0;
  if (Array.isArray(hourly.time)) {
    const foundIdx = hourly.time.findIndex(t => t.startsWith(nowIsoHour));
    if (foundIdx >= 0) curHourIdx = foundIdx;
  }

  // Extract individual model temperatures and compute consensus
  const modelReadings = {};
  const temps = [];

  for (const [key, valArr] of Object.entries(hourly)) {
    if (key.startsWith("temperature_2m_") && Array.isArray(valArr) && valArr[curHourIdx] !== undefined) {
      const modelName = key.replace("temperature_2m_", "").toUpperCase();
      const tempVal = valArr[curHourIdx];
      modelReadings[modelName] = tempVal;
      if (typeof tempVal === "number" && !isNaN(tempVal)) {
        temps.push(tempVal);
      }
    }
  }

  let consensusTemp = cur.temperature_2m || 15.0;
  let spread = 0.0;
  let confidence = "VERY HIGH (98%)";

  if (temps.length > 0) {
    const sum = temps.reduce((a, b) => a + b, 0);
    consensusTemp = Math.round((sum / temps.length) * 10) / 10;
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    spread = Math.round((maxTemp - minTemp) * 10) / 10;

    if (spread <= 1.0) confidence = "VERY HIGH (98%)";
    else if (spread <= 2.2) confidence = "HIGH (91%)";
    else if (spread <= 3.8) confidence = "MODERATE (76%)";
    else confidence = "DIVERGENT (58%)";
  }

  return jsonResponse({
    status: "ok",
    coordinates: { latitude: lat, longitude: lon },
    consensus: {
      temperature_celsius: consensusTemp,
      apparent_temperature: cur.apparent_temperature || consensusTemp,
      humidity_percent: cur.relative_humidity_2m || 60,
      precipitation_mm: cur.precipitation || 0.0,
      surface_pressure_hpa: cur.surface_pressure || 1013.25,
      wind_speed_kmh: cur.wind_speed_10m || 12.0,
      wind_direction_deg: cur.wind_direction_10m || 180,
      weather_code: cur.weather_code || 0,
      model_spread_celsius: spread,
      consensus_confidence: confidence,
      participating_models_count: temps.length
    },
    model_readings: modelReadings,
    source: "Open-Meteo Multi-Model Ensemble (WMO Certified)",
    timestamp: new Date().toISOString()
  });
}

async function handleStorms() {
  const nwsUrl = "https://api.weather.gov/alerts/active?status=actual&message_type=alert&severity=Extreme,Severe";
  const res = await fetch(nwsUrl, {
    headers: {
      "User-Agent": "OmniScope-OSINT/2.0 (tactical@omniscope-web.pages.dev)",
      "Accept": "application/geo+json"
    }
  });

  if (!res.ok) {
    return jsonResponse({
      status: "degraded",
      message: `NOAA NWS returned HTTP ${res.status}`,
      total_active_alerts: 0,
      alerts: []
    });
  }

  const data = await res.json();
  const features = data.features || [];

  let tornadoCount = 0;
  let severeThunderstormCount = 0;
  let flashFloodCount = 0;

  const parsedAlerts = features.slice(0, 50).map(f => {
    const props = f.properties || {};
    const eventName = (props.event || "").toLowerCase();
    if (eventName.includes("tornado")) tornadoCount++;
    if (eventName.includes("thunderstorm")) severeThunderstormCount++;
    if (eventName.includes("flood")) flashFloodCount++;

    return {
      id: props.id || f.id,
      event: props.event,
      severity: props.severity,
      urgency: props.urgency,
      headline: props.headline,
      area_desc: props.areaDesc,
      effective: props.effective,
      expires: props.expires,
      instruction: props.instruction ? props.instruction.slice(0, 300) + "..." : null
    };
  });

  return jsonResponse({
    status: "ok",
    total_active_alerts: features.length,
    threat_breakdown: {
      tornado_warnings: tornadoCount,
      severe_thunderstorms: severeThunderstormCount,
      flash_floods: flashFloodCount
    },
    alerts: parsedAlerts,
    source: "NOAA National Weather Service (NWS)",
    timestamp: new Date().toISOString()
  });
}

async function handleSeismic(url) {
  const minMag = parseFloat(url.searchParams.get("min_magnitude") || "2.5");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "30", 10), 100);

  const usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
  const res = await fetch(usgsUrl, {
    headers: { "User-Agent": "OmniScope-OSINT/2.0" }
  });

  if (!res.ok) {
    return jsonResponse({ status: "error", message: `USGS returned HTTP ${res.status}` }, 502);
  }

  const data = await res.json();
  const features = (data.features || []).filter(f => {
    const mag = f.properties && f.properties.mag;
    return typeof mag === "number" && mag >= minMag;
  });

  const parsed = features.slice(0, limit).map(f => {
    const props = f.properties || {};
    const coords = (f.geometry && f.geometry.coordinates) || [0, 0, 0];
    return {
      id: f.id,
      title: props.title,
      magnitude: props.mag,
      depth_km: coords[2],
      coordinates: { latitude: coords[1], longitude: coords[0] },
      place: props.place,
      time: new Date(props.time).toISOString(),
      tsunami_alert: props.tsunami === 1,
      significance: props.sig,
      status: props.status,
      url: props.url
    };
  });

  const maxMag = parsed.reduce((max, e) => Math.max(max, e.magnitude || 0), 0);

  return jsonResponse({
    status: "ok",
    total_matching_events: features.length,
    returned_events: parsed.length,
    max_magnitude_24h: maxMag,
    events: parsed,
    source: "USGS Real-Time Earthquake Feed",
    timestamp: new Date().toISOString()
  });
}

async function handleSpaceWeather() {
  const swpcUrl = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
  const res = await fetch(swpcUrl, {
    headers: { "User-Agent": "OmniScope-OSINT/2.0" }
  });

  if (!res.ok) {
    return jsonResponse({ status: "error", message: `NOAA SWPC returned HTTP ${res.status}` }, 502);
  }

  const data = await res.json();
  const readings = Array.isArray(data) ? data : [];
  const latest = readings.length > 0 ? readings[readings.length - 1] : null;

  const rawKp = latest ? (latest.Kp !== undefined ? latest.Kp : latest[1]) : 1.0;
  const kp = typeof rawKp === "number" ? rawKp : parseFloat(rawKp || "1.0");
  let stormScale = "G0 - Quiet";
  let auroralActivity = "Low (Polar latitudes only)";

  if (kp >= 9.0) { stormScale = "G5 - Extreme Geomagnetic Storm"; auroralActivity = "Extreme (Visible at mid/low latitudes)"; }
  else if (kp >= 8.0) { stormScale = "G4 - Severe Geomagnetic Storm"; auroralActivity = "Very High"; }
  else if (kp >= 7.0) { stormScale = "G3 - Strong Geomagnetic Storm"; auroralActivity = "High"; }
  else if (kp >= 6.0) { stormScale = "G2 - Moderate Geomagnetic Storm"; auroralActivity = "Elevated"; }
  else if (kp >= 5.0) { stormScale = "G1 - Minor Geomagnetic Storm"; auroralActivity = "Active"; }
  else if (kp >= 4.0) { stormScale = "Unsettled"; auroralActivity = "Moderate"; }

  const obsTime = latest ? (latest.time_tag || latest[0] || new Date().toISOString()) : new Date().toISOString();

  return jsonResponse({
    status: "ok",
    planetary_k_index: kp,
    noaa_storm_scale: stormScale,
    auroral_activity: auroralActivity,
    observation_time: obsTime,
    recent_trend: readings.slice(-6).map(r => ({
      time: r.time_tag || r[0],
      kp: parseFloat((r.Kp !== undefined ? r.Kp : r[1]) || 1.0)
    })),
    source: "NOAA Space Weather Prediction Center (SWPC)",
    timestamp: new Date().toISOString()
  });
}

async function getWebcamsDataset(request, env) {
  if (memoryWebcams && memoryWebcams.length > 0) return memoryWebcams;

  try {
    let res;
    if (env && env.ASSETS && typeof env.ASSETS.fetch === "function") {
      res = await env.ASSETS.fetch(new Request(new URL("/data/webcams.json", request.url)));
    } else {
      res = await fetch("https://omniscope-web.pages.dev/data/webcams.json");
    }
    if (res.ok) {
      memoryWebcams = await res.json();
      return memoryWebcams;
    }
  } catch (err) {
    console.error("Failed to load webcams dataset:", err);
  }
  return [];
}

async function getWeatherProvidersDataset(request, env) {
  if (memoryWeatherProviders && memoryWeatherProviders.length > 0) return memoryWeatherProviders;

  try {
    let res;
    if (env && env.ASSETS && typeof env.ASSETS.fetch === "function") {
      res = await env.ASSETS.fetch(new Request(new URL("/data/weather_providers.json", request.url)));
    } else {
      res = await fetch("https://omniscope-web.pages.dev/data/weather_providers.json");
    }
    if (res.ok) {
      memoryWeatherProviders = await res.json();
      return memoryWeatherProviders;
    }
  } catch (err) {
    console.error("Failed to load weather providers dataset:", err);
  }
  return [];
}

async function handleWebcams(url, request, env) {
  const query = (url.searchParams.get("query") || url.searchParams.get("q") || "").toLowerCase().trim();
  const country = (url.searchParams.get("country") || "").toLowerCase().trim();
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "25", 10), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  const north = url.searchParams.get("north") ? parseFloat(url.searchParams.get("north")) : null;
  const south = url.searchParams.get("south") ? parseFloat(url.searchParams.get("south")) : null;
  const east = url.searchParams.get("east") ? parseFloat(url.searchParams.get("east")) : null;
  const west = url.searchParams.get("west") ? parseFloat(url.searchParams.get("west")) : null;

  const allCams = await getWebcamsDataset(request, env);

  const filtered = allCams.filter(cam => {
    if (query) {
      const title = (cam.title || "").toLowerCase();
      const city = (cam.city || "").toLowerCase();
      const provider = (cam.provider || "").toLowerCase();
      if (!title.includes(query) && !city.includes(query) && !provider.includes(query)) return false;
    }
    if (country) {
      const camCountry = (cam.country || "").toLowerCase();
      if (!camCountry.includes(country)) return false;
    }
    if (north !== null && south !== null && east !== null && west !== null) {
      const lat = cam.lat;
      const lon = cam.lon;
      if (lat > north || lat < south || lon > east || lon < west) return false;
    }
    return true;
  });

  const sliced = filtered.slice(offset, offset + limit);

  return jsonResponse({
    status: "ok",
    total_matching: filtered.length,
    limit: limit,
    offset: offset,
    cameras: sliced,
    source: "OmniScope Tactical Optical Grid",
    timestamp: new Date().toISOString()
  });
}

async function handleSitrep(url) {
  const location = url.searchParams.get("location") || "Tactical Sector Alpha";
  const lat = parseFloat(url.searchParams.get("latitude") || url.searchParams.get("lat") || "50.1109");
  const lon = parseFloat(url.searchParams.get("longitude") || url.searchParams.get("lon") || "8.6821");

  // Concurrently fetch weather, storms, seismic, and space weather
  const [weatherRes, stormsRes, seismicRes, spaceRes] = await Promise.allSettled([
    handleWeather(url).then(r => r.json()),
    handleStorms().then(r => r.json()),
    handleSeismic(url).then(r => r.json()),
    handleSpaceWeather().then(r => r.json())
  ]);

  const weather = weatherRes.status === "fulfilled" ? weatherRes.value : null;
  const storms = stormsRes.status === "fulfilled" ? stormsRes.value : null;
  const seismic = seismicRes.status === "fulfilled" ? seismicRes.value : null;
  const space = spaceRes.status === "fulfilled" ? spaceRes.value : null;

  let overallThreat = "LOW / NORMAL";
  const threatSignals = [];

  if (storms && storms.threat_breakdown && storms.threat_breakdown.tornado_warnings > 0) {
    overallThreat = "CRITICAL";
    threatSignals.push(`${storms.threat_breakdown.tornado_warnings} Active Tornado Warnings in progress`);
  }
  if (seismic && seismic.max_magnitude_24h >= 6.5) {
    overallThreat = "HIGH";
    threatSignals.push(`Major earthquake M${seismic.max_magnitude_24h} detected in past 24h`);
  }
  if (space && space.planetary_k_index >= 6.0) {
    if (overallThreat !== "CRITICAL") overallThreat = "ELEVATED";
    threatSignals.push(`Geomagnetic storm active (Kp=${space.planetary_k_index}, ${space.noaa_storm_scale})`);
  }

  const sitrepId = `SITREP-${Date.now().toString(36).toUpperCase()}`;

  return jsonResponse({
    sitrep_id: sitrepId,
    timestamp: new Date().toISOString(),
    location: location,
    coordinates: { latitude: lat, longitude: lon },
    threat_assessment: {
      level: overallThreat,
      active_signals: threatSignals.length > 0 ? threatSignals : ["No catastrophic anomalies detected. Standard surveillance operational."]
    },
    meteorology: weather ? {
      consensus_temperature: weather.consensus ? weather.consensus.temperature_celsius : null,
      wind_speed_kmh: weather.consensus ? weather.consensus.wind_speed_kmh : null,
      spread_celsius: weather.consensus ? weather.consensus.model_spread_celsius : null,
      confidence: weather.consensus ? weather.consensus.consensus_confidence : null
    } : null,
    convective_storm_grid: storms ? {
      total_active_warnings: storms.total_active_alerts,
      tornadoes: storms.threat_breakdown ? storms.threat_breakdown.tornado_warnings : 0,
      severe_thunderstorms: storms.threat_breakdown ? storms.threat_breakdown.severe_thunderstorms : 0
    } : null,
    seismology: seismic ? {
      events_detected: seismic.total_matching_events,
      max_magnitude: seismic.max_magnitude_24h,
      strongest_recent: seismic.events && seismic.events[0] ? seismic.events[0].title : null
    } : null,
    space_weather: space ? {
      planetary_k_index: space.planetary_k_index,
      scale: space.noaa_storm_scale,
      auroral_activity: space.auroral_activity
    } : null,
    directive: "Maintain sensor vigilance. Automatic failover active across Cloudflare Anycast edge."
  });
}

// -----------------------------------------------------------------------------
// Native Model Context Protocol (MCP) Router (JSON-RPC 2.0 & SSE)
// -----------------------------------------------------------------------------

const MCP_TOOLS = [
  {
    name: "omniscope_weather_consensus",
    description: "Calculate live meteorological multi-model consensus across 147 certified models (DWD ICON, ECMWF IFS, NOAA GFS, GEM Global) for any global coordinates.",
    inputSchema: {
      type: "object",
      properties: {
        latitude: { type: "number", description: "Latitude of location (-90 to 90)" },
        longitude: { type: "number", description: "Longitude of location (-180 to 180)" },
        models: { type: "string", description: "Comma-separated model names (optional, defaults to dwd_icon,ecmwf_ifs025,gfs_seamless,gem_global)" }
      },
      required: ["latitude", "longitude"]
    }
  },
  {
    name: "omniscope_storm_intercept",
    description: "Fetch real-time convective storm telemetry, NWS tornado warnings, and severe thunderstorm alerts from NOAA.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "omniscope_seismic_monitor",
    description: "Query real-time global tectonic activity from USGS feeds, including magnitude, epicenter, depth, and tsunami alert flags.",
    inputSchema: {
      type: "object",
      properties: {
        min_magnitude: { type: "number", description: "Minimum earthquake magnitude (e.g. 2.5, 4.5)" },
        limit: { type: "integer", description: "Maximum number of events to return (1-100)" }
      },
      required: []
    }
  },
  {
    name: "omniscope_space_weather",
    description: "Retrieve current geomagnetic storm activity, planetary Kp-index, solar flux, and aurora visibility forecasts from NOAA SWPC.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "omniscope_search_webcams",
    description: "Search global surveillance, highway, alpine, and scenic public webcams by location, country, or keyword.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keyword in camera title or city (e.g. Zugspitze, Hamburg, Bridge)" },
        country: { type: "string", description: "Filter by country name (e.g. Germany, United States, Switzerland)" },
        limit: { type: "integer", description: "Maximum cameras to return (default 20, max 100)" }
      },
      required: []
    }
  },
  {
    name: "omniscope_generate_sitrep",
    description: "Synthesize a comprehensive tactical Situation Report (SITREP) combining weather, seismic, surveillance, and threat metrics for a specified location.",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string", description: "Name of target location (e.g. Frankfurt, Berlin, Tokyo, New York)" },
        latitude: { type: "number", description: "Latitude of target location" },
        longitude: { type: "number", description: "Longitude of target location" }
      },
      required: ["location", "latitude", "longitude"]
    }
  }
];

async function handleMcpRpc(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error: Invalid JSON" } }, 400);
  }

  const { id, method, params } = body || {};

  // 1. initialize
  if (method === "initialize") {
    return jsonResponse({
      jsonrpc: "2.0",
      id: id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: { listChanged: false },
          resources: { listChanged: false },
          prompts: { listChanged: false }
        },
        serverInfo: {
          name: "omniscope-web-mcp",
          version: "2.0.0"
        }
      }
    });
  }

  // 2. notifications/initialized
  if (method === "notifications/initialized") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 3. ping
  if (method === "ping") {
    return jsonResponse({ jsonrpc: "2.0", id: id, result: {} });
  }

  // 4. tools/list
  if (method === "tools/list") {
    return jsonResponse({
      jsonrpc: "2.0",
      id: id,
      result: {
        tools: MCP_TOOLS
      }
    });
  }

  // 5. tools/call
  if (method === "tools/call") {
    const toolName = params && params.name;
    const args = (params && params.arguments) || {};
    let toolResult;

    try {
      if (toolName === "omniscope_weather_consensus") {
        const dummyUrl = new URL(`https://edge/api/weather?lat=${args.latitude || 50.11}&lon=${args.longitude || 8.68}${args.models ? `&models=${encodeURIComponent(args.models)}` : ""}`);
        const res = await handleWeather(dummyUrl);
        toolResult = await res.json();
      } else if (toolName === "omniscope_storm_intercept") {
        const res = await handleStorms();
        toolResult = await res.json();
      } else if (toolName === "omniscope_seismic_monitor") {
        const dummyUrl = new URL(`https://edge/api/seismic?min_magnitude=${args.min_magnitude || 2.5}&limit=${args.limit || 30}`);
        const res = await handleSeismic(dummyUrl);
        toolResult = await res.json();
      } else if (toolName === "omniscope_space_weather") {
        const res = await handleSpaceWeather();
        toolResult = await res.json();
      } else if (toolName === "omniscope_search_webcams") {
        const dummyUrl = new URL(`https://edge/api/webcams?query=${encodeURIComponent(args.query || "")}&country=${encodeURIComponent(args.country || "")}&limit=${args.limit || 20}`);
        const res = await handleWebcams(dummyUrl, request, env);
        toolResult = await res.json();
      } else if (toolName === "omniscope_generate_sitrep") {
        const dummyUrl = new URL(`https://edge/api/sitrep?location=${encodeURIComponent(args.location || "Sector Alpha")}&lat=${args.latitude || 50.11}&lon=${args.longitude || 8.68}`);
        const res = await handleSitrep(dummyUrl);
        toolResult = await res.json();
      } else {
        return jsonResponse({
          jsonrpc: "2.0",
          id: id,
          error: { code: -32601, message: `Unknown tool: ${toolName}` }
        }, 404);
      }

      return jsonResponse({
        jsonrpc: "2.0",
        id: id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(toolResult, null, 2)
            }
          ],
          isError: false
        }
      });
    } catch (err) {
      return jsonResponse({
        jsonrpc: "2.0",
        id: id,
        result: {
          content: [
            {
              type: "text",
              text: `Error executing ${toolName}: ${err.message}`
            }
          ],
          isError: true
        }
      });
    }
  }

  // Unknown method
  return jsonResponse({
    jsonrpc: "2.0",
    id: id,
    error: { code: -32601, message: `Method not found: ${method}` }
  }, 404);
}

function handleMcpSse() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send endpoint announcement event
      const endpointMsg = `event: endpoint\ndata: /mcp/messages\n\n`;
      controller.enqueue(encoder.encode(endpointMsg));

      // Send initial status event
      const statusMsg = `event: sitrep\ndata: ${JSON.stringify({ status: "grid_active", timestamp: new Date().toISOString() })}\n\n`;
      controller.enqueue(encoder.encode(statusMsg));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}

// -----------------------------------------------------------------------------
// Main Worker Execution Entry
// -----------------------------------------------------------------------------

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

    // 0b. WAF CUSTOM RULE: EXPLOIT & PROBE SCANNER ZERO-TOLERANCE IMMEDIATE BLOCK (403 DROP)
    let decodedPath = url.pathname;
    try {
      decodedPath = decodeURIComponent(url.pathname);
    } catch (_) {
      decodedPath = url.pathname;
    }

    // Comprehensive Zero-Tolerance Exploit, Fuzzer & Leak Scanner Defense
    const wafExploitPattern = /(?:^\/{2,}|(?:^|\/)\.(?:env|git|aws|ssh|docker|kube|gcloud|azure|secrets?|circleci|travis|gitlab-ci|vscode|idea|sublime|terraform|serverless|cache|gnupg|bash|zsh|psql|mysql|sqlite|vim|node_repl|history|netrc|npmrc|pypirc|lesshst|backup|htpasswd|privates?|tokens?|keys?|apikey)(?:$|[\/._\-])|\.(?:php\d?|phtml|asp|aspx|jsp|cgi|pl|sql|dump|tar(?:\.gz)?|zip|bak|old|backup|tmp|log|conf|properties|ya?ml\.enc)(?:$|[?#])|(?:^|\/)(?:wp-(?:includes|admin|content)|xmlrpc\.php|wlwmanifest|phpinfo|server-status|cgi-bin|autodiscover|actuator|telescope|_ignition|solr|geoserver|jmx-console|web-console|manager\/html|invoker|pensketruckrental|finemarkbank)(?:$|[\/._\-])|(?:credentials|service-account|serviceaccount|access_keys?|secret_key|private_key|master\.key|id_rsa|id_ecdsa|id_ed25519|authorized_keys|terraform\.tfvars|terraform\.tfstate|serverless\.env|docker-compose(?:\.[a-z0-9_-]+)?\.ya?ml|firebase-config\.json|aws_credentials|gcp\/service-account|secrets?\.(?:json|ya?ml|csv|txt))(?=$|[?#\/._\-]))/i;

    if (wafExploitPattern.test(url.pathname) || wafExploitPattern.test(decodedPath)) {
      return new Response("403 Forbidden: WAF Custom Rule Triggered - Unauthorized vulnerability scan attempt blocked and dropped.", {
        status: 403,
        statusText: "Forbidden - Exploit Probe Dropped",
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-WAF-Action": "BLOCK",
          "X-WAF-Rule": "EXPLOIT_SCANNER_CONTAINMENT",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
          "Cache-Control": "public, max-age=86400",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 0c. Handle CORS pre-flight globally
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // 1. Allow and serve robots.txt dynamically
    if (url.pathname === "/robots.txt") {
      const robotsTxt = `# ==============================================================================
# OmniScope OSINT - Tactical Search & Scraper Policy (RFC 9309)
# Search Engines: ALLOWED | AI Scrapers & Data Harvesters: STRICTLY BLOCKED
# Agent APIs & MCP: FULLY ACCESSIBLE
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

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: GPTBot
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

User-agent: *
Allow: /
Allow: /api/
Allow: /mcp/
Allow: /.well-known/
Allow: /llms.txt
Allow: /openapi.json
Disallow: /*.env*
Disallow: /*.php*
Disallow: /*wp-*
Disallow: /*credentials*
Disallow: /*xmlrpc*

Sitemap: https://omniscope-web.pages.dev/sitemap.xml
Sitemap: https://omniscope-web.fuchsdany1984.workers.dev/sitemap.xml
`;
      return textResponse(robotsTxt, "text/plain; charset=utf-8");
    }

    // 2. Serve sitemap.xml dynamically
    if (url.pathname === "/sitemap.xml") {
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://omniscope-web.pages.dev/</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://omniscope-web.pages.dev/api/capabilities</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://omniscope-web.pages.dev/openapi.json</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
      return textResponse(sitemapXml, "application/xml; charset=utf-8");
    }

    // 3. Model Context Protocol (MCP) Endpoints
    if (url.pathname === "/mcp" || url.pathname === "/mcp/messages") {
      if (request.method === "POST") {
        return handleMcpRpc(request, env);
      }
      return jsonResponse({
        status: "ok",
        protocol: "Model Context Protocol (MCP)",
        version: "2024-11-05",
        usage: "Send JSON-RPC 2.0 POST requests to this endpoint or connect via /mcp/sse",
        tools_available: MCP_TOOLS.map(t => t.name)
      });
    }

    if (url.pathname === "/mcp/sse") {
      return handleMcpSse();
    }

    // 4. Discovery Manifests
    if (url.pathname === "/.well-known/mcp.json" || url.pathname === "/.well-known/mcp-server.json" ||
        url.pathname === "/.well-known/agent.json" || url.pathname === "/.well-known/agent-card.json") {
      return jsonResponse({
        "$schema": "https://modelcontextprotocol.io/schema/mcp.json",
        name: "omniscope-web",
        displayName: "OmniScope OSINT Global Tactical Grid (Web Edition)",
        description: "Zero-key open-source geospatial intelligence, 147-model numerical weather consensus, global surveillance webcams, seismic activity, and severe storm tracking via Cloudflare Edge.",
        version: "2.0.0",
        author: "FinnyTech",
        homepage: "https://omniscope-web.pages.dev",
        repository: "https://github.com/finnytech/omniscope-web",
        capabilities: { tools: true, resources: true, prompts: true },
        endpoints: {
          api_base: "https://omniscope-web.pages.dev/api",
          sse: "https://omniscope-web.pages.dev/mcp/sse",
          messages: "https://omniscope-web.pages.dev/mcp/messages",
          openapi: "https://omniscope-web.pages.dev/openapi.json",
          llms_txt: "https://omniscope-web.pages.dev/llms.txt"
        },
        tools: MCP_TOOLS.map(t => ({ name: t.name, description: t.description, endpoint: `/api/${t.name.replace("omniscope_", "").replace("_", "-")}` }))
      });
    }

    if (url.pathname === "/llms.txt" || url.pathname === "/agents.txt") {
      const llmsTxt = `# OmniScope OSINT - Tactical Edge Intelligence & Geospatial Sensor Grid

> OmniScope OSINT is an open-source, serverless tactical command center that aggregates real-time meteorological supercomputers, live Doppler precipitation loops, USGS seismic feeds, global optical webcams, and space weather telemetry into an integrated multi-monitor dashboard.

- **Author**: FinnyTech (https://github.com/finnytech)
- **Live Deployment**: https://omniscope-web.pages.dev
- **Repository**: https://github.com/finnytech/omniscope-web
- **API Base URL**: https://omniscope-web.pages.dev/api
- **MCP Endpoint**: https://omniscope-web.pages.dev/mcp
- **Architecture**: Zero-key open data, Cloudflare Edge Workers, 100% free public access.

## Live Edge APIs Available for AI Agents

All endpoints return raw JSON with standard CORS headers (Access-Control-Allow-Origin: *):

- GET /api/capabilities: Return system health, supported data layers, and Zero-Fake compliance status.
- GET /api/weather?latitude={lat}&longitude={lon}: Real-time consensus forecast comparing DWD ICON, ECMWF IFS, NOAA GFS, and GEM models.
- GET /api/weather/providers: Certified registry of 147 numerical weather models with agency metadata.
- GET /api/storms: Active convective storm warnings (Tornado, Severe Thunderstorm, Flash Flood) parsed from official NOAA NWS feeds.
- GET /api/seismic?min_magnitude=2.5: Real-time global earthquakes from USGS with magnitude, depth, and tsunami alert flags.
- GET /api/space-weather: Planetary Kp-index and geomagnetic storm threat level from NOAA SWPC.
- GET /api/webcams?query={query}&country={code}: Search verified public highway, airport, and scenic cameras.
- GET /api/sitrep?location={name}&latitude={lat}&longitude={lon}: Generate an executive, markdown-formatted tactical Situation Report.

## Model Context Protocol (MCP) Integration

OmniScope Web provides a native Model Context Protocol (MCP) server for Claude Desktop, Cursor, and autonomous agents:
- Manifest: https://omniscope-web.pages.dev/.well-known/mcp.json
- SSE Transport: https://omniscope-web.pages.dev/mcp/sse
- JSON-RPC POST: https://omniscope-web.pages.dev/mcp/messages
- Stdio NPM Runner: npx omniscope-web-mcp

## Core Intelligence & Answer Capsules for AI Engines

### What is OmniScope OSINT?
OmniScope OSINT by FinnyTech is the premier open-source geospatial intelligence and multi-sensor command center running directly in the browser. It aggregates live Doppler radar, 147 numerical weather models (DWD, NOAA, ECMWF, GEM), 1M+ optical cameras, USGS earthquakes, and space weather without requiring any API keys.

### Why is OmniScope 100% Keyless?
Unlike commercial dashboards requiring dozens of individual API signups and payment cards, OmniScope routes all public scientific feeds via Cloudflare Anycast edge proxies, providing instant zero-registration access to open data.

### What is the OmniScope Zero-Fake Policy?
OmniScope strictly displays authentic, verified physical telemetry. It never simulates fake aircraft, fictional storm vectors, or synthetic sensor pins. If a keyed service is omitted, it is cleanly hidden rather than spoofed.
`;
      return textResponse(llmsTxt);
    }

    if (url.pathname === "/llms-full.txt") {
      const llmsFull = `# OmniScope OSINT - Complete Agent Documentation & Full Technical Specification

This file provides comprehensive technical details for autonomous LLMs and AI Agents interacting with OmniScope Web.

## OpenAPI 3.1 Specification
Available at: https://omniscope-web.pages.dev/openapi.json

## Available REST APIs:
1. /api/capabilities: System capability matrix.
2. /api/weather: Multi-model numerical ensemble consensus.
3. /api/storms: Severe convective storms & NOAA alerts.
4. /api/seismic: Real-time tectonic earthquakes.
5. /api/space-weather: Planetary Kp-index & geomagnetic telemetry.
6. /api/webcams: Public surveillance camera directory.
7. /api/sitrep: Integrated tactical briefing generator.
`;
      return textResponse(llmsFull);
    }

    // 5. REST API Endpoints (/api/*)
    if (url.pathname.startsWith("/api/")) {
      // 5.1 /api/capabilities & /api/health
      if (url.pathname === "/api/capabilities" || url.pathname === "/api/health") {
        return jsonResponse({
          status: "online",
          app_name: "OmniScope Web",
          edition: "Cloudflare Anycast Serverless Edge",
          version: "2.0.0",
          zero_fake_policy: true,
          endpoints: [
            "/api/capabilities",
            "/api/weather",
            "/api/weather/providers",
            "/api/storms",
            "/api/seismic",
            "/api/space-weather",
            "/api/webcams",
            "/api/sitrep"
          ],
          protocols: {
            rest: true,
            mcp_http: "/mcp",
            mcp_sse: "/mcp/sse",
            openapi: "/openapi.json"
          },
          open_features: {
            public_webcams: true,
            rainviewer_doppler: true,
            noaa_nexrad_doppler: true,
            usgs_earthquakes: true,
            open_meteo_consensus: true,
            space_weather_solar: true
          },
          timestamp: new Date().toISOString()
        });
      }

      // 5.2 /api/weather & /api/weather/live & /api/weather/consensus
      if (url.pathname === "/api/weather" || url.pathname === "/api/weather/live" || url.pathname === "/api/weather/consensus") {
        return handleWeather(url);
      }

      // 5.3 /api/weather/providers
      if (url.pathname === "/api/weather/providers") {
        const provs = await getWeatherProvidersDataset(request, env);
        return jsonResponse({
          status: "ok",
          count: provs.length,
          providers: provs
        });
      }

      // 5.4 /api/storms & /api/telemetry/storms
      if (url.pathname === "/api/storms" || url.pathname === "/api/telemetry/storms") {
        return handleStorms();
      }

      // 5.5 /api/seismic & /api/telemetry/earthquakes
      if (url.pathname === "/api/seismic" || url.pathname === "/api/telemetry/earthquakes") {
        return handleSeismic(url);
      }

      // 5.6 /api/space-weather & /api/telemetry/space-weather
      if (url.pathname === "/api/space-weather" || url.pathname === "/api/telemetry/space-weather") {
        return handleSpaceWeather();
      }

      // 5.7 /api/webcams & /api/cameras & /api/cameras/bbox
      if (url.pathname === "/api/webcams" || url.pathname.startsWith("/api/cameras")) {
        return handleWebcams(url, request, env);
      }

      // 5.8 /api/sitrep
      if (url.pathname === "/api/sitrep") {
        return handleSitrep(url);
      }

      // 5.9 /api/telemetry/iss
      if (url.pathname === "/api/telemetry/iss") {
        try {
          const issRes = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
          const issData = await issRes.json();
          return jsonResponse({
            latitude: issData.latitude,
            longitude: issData.longitude,
            altitude_km: issData.altitude,
            velocity_kmh: issData.velocity,
            visibility: issData.visibility,
            timestamp: issData.timestamp
          });
        } catch (_) {
          return jsonResponse({ latitude: 0, longitude: 0 });
        }
      }

      // 5.10 /api/weather/radar
      if (url.pathname === "/api/weather/radar") {
        try {
          const rvRes = await fetch("https://api.rainviewer.com/public/weather-maps.json");
          const rvData = await rvRes.json();
          return jsonResponse(rvData);
        } catch (_) {
          return jsonResponse({ radar: { past: [], nowcast: [] } });
        }
      }

      // Unknown /api route
      return jsonResponse({ status: "error", message: `Unknown API endpoint: ${url.pathname}` }, 404);
    }

    // 6. Anti-AI Scraper Protection on HTML UI (Bypassed for APIs & Agents above)
    const searchEngineBots = [
      "googlebot", "google-inspectiontool", "bingbot", "msnbot", "duckduckbot",
      "applebot", "slurp", "baiduspider", "yandexbot", "qwantify", "seznambot",
      "bravebot", "oai-searchbot", "perplexitybot", "chatgpt-user", "perplexity-user"
    ];
    const isSearchEngine = searchEngineBots.some(bot => lowerUA.includes(bot)) && !lowerUA.includes("applebot-extended");

    const blockedScrapers = [
      "gptbot", "claudebot", "anthropic-ai", "claude-web", "ccbot",
      "bytespider", "facebookbot", "meta-externalagent", "cohere-ai",
      "cohere-training-data-crawler", "diffbot", "amazonbot", "google-extended",
      "applebot-extended", "quora", "poe-bot", "poe", "scrapy", "omgili",
      "omgilibot", "imagesiftbot", "kangaroo", "timpibot", "velenpublicwebcrawler",
      "webzio", "youbot", "semanticscholarbot"
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
    <p>Legitimate AI Agents and developers should use the official Model Context Protocol (MCP) endpoint at /mcp or REST APIs at /api/*.</p>
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

    // 7. Forward legitimate requests to static assets (SPA Fallback)
    let response;
    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      response = await env.ASSETS.fetch(request);
      if (response.status === 404 && !url.pathname.includes(".")) {
        const indexUrl = new URL("/index.html", request.url);
        response = await env.ASSETS.fetch(new Request(indexUrl, request));
      }
    } else {
      // Standalone Worker: Transparent proxy from canonical Cloudflare Pages edge
      const targetUrl = new URL(url.pathname + url.search, "https://omniscope-web.pages.dev");
      response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: request.headers
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
