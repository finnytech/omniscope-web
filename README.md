# 🌐 OmniScope Web [OFFICIAL ORIGINAL]

[![Official Original Project](https://img.shields.io/badge/OmniScope-OFFICIAL%20ORIGINAL-00ffcc?style=for-the-badge&logo=shield)](https://github.com/finnytech/omniscope-web)
[![FinnyTech Original](https://img.shields.io/badge/Author-FinnyTech-ff0055?style=for-the-badge)](https://github.com/finnytech)
[![Production Live](https://img.shields.io/badge/Live-omniscope--web.pages.dev-blue?style=for-the-badge)](https://omniscope-web.pages.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> [!IMPORTANT]
> ### 🚨 OFFICIAL REPOSITORY & INTELLECTUAL PROPERTY NOTICE
> **OmniScope™ is the original, authentic open-source geospatial intelligence and tactical sensor grid created and maintained exclusively by [FinnyTech](https://github.com/finnytech).**
>
> ⚠️ **BEWARE OF UNAUTHORIZED CLONES & COPYCATS**:
> Following the recent viral surge of OmniScope, third parties (including unauthorized groups such as *"Sam Good Group / OmniScope Lite"*) have begun cloning, scraping, and republishing stripped-down knockoffs.
> 
> - **Canonical Live Web Dashboard**: [`https://omniscope-web.pages.dev`](https://omniscope-web.pages.dev)
> - **Official Web Repository**: [`https://github.com/finnytech/omniscope-web`](https://github.com/finnytech/omniscope-web)
> - **Official OSINT Native Desktop Repository**: [`https://github.com/finnytech/omniscope-osint`](https://github.com/finnytech/omniscope-osint)
> 
> Any versions hosted outside `*.pages.dev` or `github.com/finnytech/*` are unauthorized copies, lack our certified 147-model keyless consensus and Cloudflare Edge WAF security, and may contain modified or malicious code.

> **Serverless, 100% Free Open Geospatial Intelligence Dashboard for Cloudflare Pages**  
> *Zero Server Costs • Zero Cloudflare Database Fees • 100% Keyless • Pure Open Data*

---

## ⚡ Overview

**OmniScope Web** is the free, client-side web edition of OmniScope OSINT. Designed specifically for static hosting platforms like **Cloudflare Pages**, it requires **zero backend servers**, **zero cloud databases**, and **zero paid API keys**.

All live data is fetched directly inside the user's browser using open, CORS-enabled endpoints and bundled datasets:
- **Real-Time Doppler Radar**: Live precipitation loops via the RainViewer global composite API.
- **Global Earthquakes**: Real-time tectonic activity via official USGS GeoJSON feeds.
- **Meteorological Supercomputers**: Live temperature, pressure, CAPE, and dew point feeds via Open-Meteo.
- **Curated Worldwide Webcams**: Over 1,500 verified scenic, beach, alpine, and city public webcams loaded from `data/webcams.json`.
- **ISS Space Station Orbit**: Real-time orbital telemetry tracking.

---

## 🤖 Model Context Protocol (MCP) & Edge REST APIs

OmniScope Web provides a native, zero-key Model Context Protocol (MCP) server and public Edge REST API suite hosted across Cloudflare's Anycast Edge for Claude Desktop, Cursor, and autonomous AI agents:

### 1. Stdio MCP Server (`omniscope-web-mcp`):
Add to `claude_desktop_config.json` or `.cursor/mcp.json`:
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

### 2. Live Cloudflare Anycast Remote MCP Endpoints:
- **Discovery Manifest**: [`https://omniscope-web.pages.dev/.well-known/mcp.json`](https://omniscope-web.pages.dev/.well-known/mcp.json)
- **JSON-RPC 2.0 Messages**: `https://omniscope-web.pages.dev/mcp/messages`
- **SSE Stream**: `https://omniscope-web.pages.dev/mcp/sse`
- **OpenAPI 3.1 Spec**: [`https://omniscope-web.pages.dev/openapi.json`](https://omniscope-web.pages.dev/openapi.json)
- **LLM Specification**: [`https://omniscope-web.pages.dev/llms.txt`](https://omniscope-web.pages.dev/llms.txt)

### 3. Public Keyless Edge APIs (`/api/*`):
- `GET /api/capabilities`: System health, capabilities, and Zero-Fake compliance.
- `GET /api/weather?latitude=50.11&longitude=8.68`: 147-model numerical consensus across DWD ICON, ECMWF IFS, NOAA GFS, and GEM Global.
- `GET /api/storms`: Active NOAA NWS tornado warnings and convective storm alerts.
- `GET /api/seismic?min_magnitude=2.5`: Real-time tectonic earthquake telemetry from USGS.
- `GET /api/space-weather`: Planetary Kp-index and geomagnetic storm threat levels from NOAA SWPC.
- `GET /api/webcams?query=zugspitze`: Search 1,500+ verified public streaming webcams.
- `GET /api/sitrep?location=Frankfurt`: Synthesize a comprehensive tactical Situation Report combining all live telemetry.

---

## 🚀 Free Deployment to Cloudflare Pages

### Option 1: Via Wrangler CLI (1-Click)
Ensure you have Node.js installed, then run inside the `omniscope-web` directory:
```bash
npx wrangler pages deploy . --project-name omniscope-web
```
*Your application will be deployed globally across Cloudflare's edge network within seconds!*

### Option 2: Via GitHub Git Integration
1. Push this folder to a new GitHub repository (e.g. `your-username/omniscope-web`).
2. Open the [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Compute (Workers & Pages)** -> **Create Application** -> **Pages**.
3. Connect your GitHub repository.
4. Set **Build output directory** to `/` (root) and leave the build command empty.
5. Click **Save and Deploy**.

---

## 🛡️ Zero-Fake Policy

Across all editions, OmniScope enforces a strict Zero-Fake Policy:
- **Meteorological Data Integrity**: Strikte wissenschaftliche Unterscheidung zwischen Doppler-Radar-Rotation in der Wolke (`RADAR INDICATED`) und bodennah verifizierten Tornados (`OBSERVED GROUND CONTACT`).
- **Keine Phantasie-Einstufungen**: Die Enhanced Fujita (EF)-Skala wird ausschließlich nach offiziellen NWS Ground Damage Surveys vergeben. Live-Alarme erhalten niemals spekulative Ratings (kein Fake EF-4/EF-5) oder pauschale Windwerte (keine erfundenen 165 MPH).
- **Client-Side Transparenz**: Features, die private Authentifizierung erfordern (z. B. geschützte Luftfahrt- oder KI-APIs), werden im Web-Interface transparent weggelassen, anstatt synthetische Dummydaten zu simulieren.
- **100% Genuine Open Data**: Sämtliche Daten basieren auf unmodifizierten, verifizierten Echtzeit-Feeds von NOAA/NWS, RainViewer, USGS und Open-Meteo.


---

## 📚 Attributions & Credits

- **Weather Consensus**: Meteorological models provided by [Open-Meteo.com](https://open-meteo.com/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Precipitation Radar**: Live composite Doppler tiles provided by [RainViewer.com](https://www.rainviewer.com/).
- **Earthquake Feeds**: Global seismic telemetry provided by the [United States Geological Survey (USGS)](https://earthquake.usgs.gov/).
- **Orbital Space Tracking**: Real-time trajectories via WhereTheISS and Open-Notify.

---

## ⚖️ Disclaimer & Trademark Notice

OmniScope Web is an independent open-source project and is not affiliated with, endorsed by, or associated with Visokio Omniscope or any other commercial entities. All data displayed originates from public open-access feeds for environmental and meteorological education and research.

---

## 📄 License

Distributed under the **MIT License**.
