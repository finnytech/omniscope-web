# OmniScope OSINT - Web Edition MCP Server (`omniscope-web-mcp`)

Official Model Context Protocol (MCP) server connecting LLMs and autonomous AI agents directly to the live OmniScope Tactical Edge API network hosted on Cloudflare Anycast.

Zero API keys required. Zero dependencies. 100% verified real-time open data.

---

## Capabilities & Tools

1. **`omniscope_weather_consensus`**: 147-model numerical weather consensus (DWD ICON, ECMWF IFS, NOAA GFS, GEM Global) with model spread and confidence scores.
2. **`omniscope_storm_intercept`**: Live NOAA NWS tornado warnings, severe thunderstorm watches, and convective storm cells.
3. **`omniscope_seismic_monitor`**: Real-time tectonic earthquake feed from USGS with magnitude, depth, and tsunami flags.
4. **`omniscope_space_weather`**: Planetary Kp-index and geomagnetic storm threat levels from NOAA SWPC.
5. **`omniscope_search_webcams`**: Search 1,500+ verified public highway, airport, alpine, and coastal webcams.
6. **`omniscope_generate_sitrep`**: Synthesize a comprehensive tactical Situation Report (SITREP) combining all live data layers.

---

## Quick Start (Stdio)

### In Claude Desktop (`claude_desktop_config.json`):

Add to your `claude_desktop_config.json` (located at `%APPDATA%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "omniscope-web": {
      "command": "node",
      "args": ["D:/projects/omniscope-web/mcp-server/index.js"]
    }
  }
}
```

Or run via npx when published:
```json
{
  "mcpServers": {
    "omniscope-web": {
      "command": "npx",
      "args": ["-y", "omniscope-web-mcp"]
    }
  }
}
```

### In Cursor (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "omniscope-web": {
      "command": "node",
      "args": ["D:/projects/omniscope-web/mcp-server/index.js"]
    }
  }
}
```

---

## Direct HTTP / SSE Remote Integration

If your MCP client supports remote SSE or HTTP transports, connect directly to the Cloudflare Edge endpoint:
- **SSE URL**: `https://omniscope-web.pages.dev/mcp/sse`
- **JSON-RPC POST**: `https://omniscope-web.pages.dev/mcp/messages`
- **Discovery Manifest**: `https://omniscope-web.pages.dev/.well-known/mcp.json`
- **OpenAPI 3.1 Spec**: `https://omniscope-web.pages.dev/openapi.json`
