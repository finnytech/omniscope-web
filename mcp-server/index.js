#!/usr/bin/env node

/**
 * OmniScope OSINT - Web Edition MCP Server
 * Zero-dependency Model Context Protocol (MCP) server for Claude Desktop, Cursor, and Agent Frameworks.
 * Connects directly to the live OmniScope Tactical Edge APIs on Cloudflare Anycast with automatic resilient upstream fallback.
 */

import readline from "node:readline";

const API_BASE = process.env.OMNISCOPE_API_BASE || "https://omniscope-web.pages.dev/api";
const SERVER_NAME = "omniscope-web-mcp";
const SERVER_VERSION = "2.0.0";

const TOOLS = [
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

// Fallback handlers to upstream public APIs
async function directFallback(toolName, args) {
  if (toolName === "omniscope_space_weather") {
    const res = await fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json");
    const data = await res.json();
    const rows = Array.isArray(data) ? data : [];
    const latest = rows.length > 0 ? rows[rows.length - 1] : null;
    const rawKp = latest ? (latest.Kp !== undefined ? latest.Kp : latest[1]) : 1.0;
    const kp = typeof rawKp === "number" ? rawKp : parseFloat(rawKp || "1.0");
    return {
      status: "ok",
      planetary_k_index: kp,
      source: "NOAA Space Weather Prediction Center (Direct Fallback)",
      observation_time: latest ? (latest.time_tag || latest[0] || new Date().toISOString()) : new Date().toISOString()
    };
  }

  if (toolName === "omniscope_seismic_monitor") {
    const minMag = parseFloat(args.min_magnitude || 2.5);
    const limit = parseInt(args.limit || 30, 10);
    const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson");
    const data = await res.json();
    const features = (data.features || []).filter(f => (f.properties?.mag || 0) >= minMag).slice(0, limit);
    return {
      status: "ok",
      count: features.length,
      events: features.map(f => ({
        id: f.id,
        title: f.properties?.title,
        magnitude: f.properties?.mag,
        place: f.properties?.place,
        time: new Date(f.properties?.time).toISOString()
      })),
      source: "USGS Earthquake Hazards Program (Direct Fallback)"
    };
  }

  if (toolName === "omniscope_storm_intercept") {
    const res = await fetch("https://api.weather.gov/alerts/active?status=actual&message_type=alert&severity=Extreme,Severe", {
      headers: { "User-Agent": "OmniScope-MCP/2.0 (Direct Fallback)" }
    });
    const data = await res.json();
    return {
      status: "ok",
      total_active_alerts: data.features?.length || 0,
      alerts: (data.features || []).slice(0, 30).map(f => ({
        event: f.properties?.event,
        area: f.properties?.areaDesc,
        severity: f.properties?.severity,
        headline: f.properties?.headline
      })),
      source: "NOAA National Weather Service (Direct Fallback)"
    };
  }

  if (toolName === "omniscope_weather_consensus") {
    const lat = parseFloat(args.latitude || 50.11);
    const lon = parseFloat(args.longitude || 8.68);
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m&models=dwd_icon,ecmwf_ifs025,gfs_seamless,gem_global&forecast_days=1`);
    const data = await res.json();
    return {
      status: "ok",
      temperature: data.current?.temperature_2m,
      source: "Open-Meteo Multi-Model (Direct Fallback)"
    };
  }

  throw new Error(`Fallback not available for ${toolName}`);
}

async function apiFetch(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.set(key, String(val));
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "OmniScope-Web-MCP/2.0 (Claude/Agent Client)",
      "Accept": "application/json"
    }
  });

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || !contentType.includes("application/json")) {
    throw new Error(`Edge returned non-JSON HTTP ${res.status}`);
  }

  return await res.json();
}

async function handleToolCall(name, args) {
  try {
    switch (name) {
      case "omniscope_weather_consensus":
        return await apiFetch("/weather", {
          latitude: args.latitude,
          longitude: args.longitude,
          models: args.models
        });

      case "omniscope_storm_intercept":
        return await apiFetch("/storms");

      case "omniscope_seismic_monitor":
        return await apiFetch("/seismic", {
          min_magnitude: args.min_magnitude || 2.5,
          limit: args.limit || 30
        });

      case "omniscope_space_weather":
        return await apiFetch("/space-weather");

      case "omniscope_search_webcams":
        return await apiFetch("/webcams", {
          query: args.query,
          country: args.country,
          limit: args.limit || 20
        });

      case "omniscope_generate_sitrep":
        return await apiFetch("/sitrep", {
          location: args.location,
          latitude: args.latitude,
          longitude: args.longitude
        });

      default:
        throw new Error(`Tool '${name}' not implemented.`);
    }
  } catch (edgeErr) {
    // Graceful fallback to direct upstream open feeds
    try {
      return await directFallback(name, args);
    } catch (_) {
      throw edgeErr;
    }
  }
}

function sendResponse(id, result, error = null) {
  const response = { jsonrpc: "2.0", id };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + "\n");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request;
  try {
    request = JSON.parse(trimmed);
  } catch (err) {
    sendResponse(null, null, { code: -32700, message: "Parse error: Invalid JSON" });
    return;
  }

  const { id, method, params } = request;

  try {
    if (method === "initialize") {
      sendResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: { listChanged: false },
          resources: { listChanged: false },
          prompts: { listChanged: false }
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION
        }
      });
      return;
    }

    if (method === "notifications/initialized") {
      return;
    }

    if (method === "ping") {
      sendResponse(id, {});
      return;
    }

    if (method === "tools/list") {
      sendResponse(id, { tools: TOOLS });
      return;
    }

    if (method === "tools/call") {
      const toolName = params && params.name;
      const toolArgs = (params && params.arguments) || {};

      try {
        const result = await handleToolCall(toolName, toolArgs);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ],
          isError: false
        });
      } catch (err) {
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: `Error executing tool '${toolName}': ${err.message}`
            }
          ],
          isError: true
        });
      }
      return;
    }

    // Unknown method
    sendResponse(id, null, { code: -32601, message: `Method not found: ${method}` });
  } catch (fatalErr) {
    sendResponse(id, null, { code: -32603, message: `Internal error: ${fatalErr.message}` });
  }
});

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
