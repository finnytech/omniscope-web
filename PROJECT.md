# Project: Omniscope Web Release (Grade A+ Certified)

## Architecture
- **Frontend Core**: Vanilla JS single-page application with Leaflet.js tactical map, HLS.js multi-viewport video matrix (MON-02), tactical weather analysis HUD (MON-01), and responsive Cyberpunk HUD.
- **Backend Edge Gateway**: Cloudflare Pages Functions & Workers (`_worker.js`, `worker.js`, `js/web_bridge.js`) proxying weather telemetry, Doppler radar tile pyramids, satellite imagery, and live data feeds.
- **Data Layers**:
  - Doppler Radar: 20 verified keyless national and international Doppler feeds from `data/weather_providers.json`.
  - Rapid Satellite: NOAA GOES-16/18 High-Rate Visible & IR (IEM TMS), NASA GIBS 250m TrueColor (WMTS), and EUMETSAT/DWD High-Res Cloud Type (WMS) updating at 30s cadence.
  - Street Traffic: Google Maps native traffic raster tiles (`mt{s}.google.com/vt/lyrs=traffic`) and Stau-Watcher embed iframe streaming to MON-02.
  - Weather Stations: 288 interactive diamond map nodes querying authentic live telemetry via Open-Meteo, NOAA SWPC, and AWC METAR (zero simulated data).
- **QA & Verification**: Pre-release test suite `qa.py` enforcing 14 automated checks (Grade A+ 100%) and Python Playwright headless browser testing.
- **Deployment**: Cloudflare Pages production deployment (`omniscope-web.pages.dev`) with automated asset cache busting.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | TV Drawer Markup & Click Binding | Static `#mon02-tv-drawer` in `index.html` under `#card-webcam` with inline click handler on `#btn-toggle-tv-drawer` | M1 | Survey R1 |
| 2 | Syntax Scoping & MultiView Init Fix | Fix scoping defect in `tv_multiview.js:4274` and remove destructive select overwrites | M1 | Survey R1, R2, R5 |
| 3 | TV Drawer Channel List Population | Ensure channel list renders and filters cleanly in `#tv-channels-grid` with instant slot streaming | M1 | Survey R1 |
| 4 | Doppler Provider Selection UI | Preserve and expose all 20 verified keyless Doppler radar providers in `#select-radar-provider` | M2 | Survey R2 |
| 5 | Mode-Aware Upstream Radar Routing | Route Doppler modes (`composite`, `velocity`, `rain_rate`, `echo_tops`, `dual_pol_cc`) to matching upstream tile/WMS endpoints in `_worker.js`, `worker.js`, and `web_bridge.js` | M2 | Survey R2 |
| 6 | Weather Multi-Compare Route Alias | Map `/api/weather/multi-compare` to consensus in backend routing | M2 | Survey R2 |
| 7 | Purge Mock Data from Detail Endpoint | Replace 12 hardcoded static mock responses in `handleWeatherProviderDetail` with live Open-Meteo telemetry | M3 | Survey R3 |
| 8 | Authentic Weather Station Nodes | Render all 288 stations from `data/weather_providers.json` with authentic coordinates, metadata, and live telemetry | M3 | Survey R3 |
| 9 | Authentic Station Streaming to MON-02 | Stream authentic station telemetry, real model resolution, and cycle to MON-02 multi-view slots | M3 | Survey R3 |
| 10 | 30s Rapid Satellite Auto-Update | Reduce satellite cache bucket to 30s (`Math.floor(Date.now() / 30000)`), double-buffered ping-pong tile swap, and `#mon01-hdr-sat-cd` countdown ticker | M4 | Survey R4 |
| 11 | Verified Satellite Endpoints | NOAA GOES-16/18 Visible & IR, NASA GIBS 250m TrueColor, and EUMETSAT/DWD High-Res Cloud Type | M4 | Survey R4 |
| 12 | Google Maps Traffic Tile Layer | Native street traffic tiles (`mt{s}.google.com/vt/lyrs=traffic`) with synchronized header and sidebar toggles and base layer compatibility | M4 | Survey R5 |
| 13 | Stau-Watcher Streaming to MON-02 | Expose `window.streamTrafficToMon2` and attach trigger buttons to map click popup and sidebar | M4 | Survey R5 |
| 14 | Gitignore & Storage Hygiene | Strict exclusion of `.agents/`, `agent.*/`, `.agent/` in `.gitignore` and 100% storage confinement to `D:\` | M5 | Survey R6 |
| 15 | Asset Versioning & Cache Busting | Cache-Control `no-cache` for `index.html` in `_headers` and automated query-string bumping (`?v=2.7.6` / timestamp) | M5 | Survey R7 |
| 16 | Strict Pre-Release QA Audit | Execute `qa.py` and achieve Grade A+ (100.0%, 14/14 checks pass) | M5 | Survey R7 |
| 17 | Headless Browser Verification | Automated Playwright script verifying TV drawer toggle, traffic layer, and station nodes without JS console errors | M5 | Survey R7 |
| 18 | Production Deployment | Execute `deploy.ps1` to publish to Cloudflare Pages production and verify live site visibility | M5 | Survey R7 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | MON-02 TV Drawer & UI Controls Architecture | Static markup in `index.html`, syntax scoping fix in `tv_multiview.js:4274`, non-blocking initialization, CSS visibility | none | DONE |
| M2 | Doppler Radar Providers & Backend View Mode Routing | UI provider dropdown preservation, mode-aware upstream tile routing in `_worker.js`/`worker.js`/`web_bridge.js`, multi-compare endpoint fix | M1 | DONE |
| M3 | Authentic Weather Station Nodes & Telemetry Pipeline | Purge 12 mock data blocks in `handleWeatherProviderDetail`, live Open-Meteo telemetry, station metadata streaming to MON-02 | M2 | BLOCKED: 1x mode streamWeatherStationToMon2 & slot standby reset |
| M4 | Rapid Satellite & Google Maps Traffic / Stau-Watcher | 30s satellite auto-refresh with ping-pong swap, Google traffic tiles, and Stau-Watcher MON-02 stream trigger | M1, M2 | BLOCKED: 1x mode streamTrafficToMon2 |
| M5 | QA Audit (Grade A+), Browser Verification & Production Deploy | Cache busting, `qa.py` Grade A+ (100%), Playwright browser testing, gitignore hygiene, Cloudflare Pages live deploy | M1, M2, M3, M4 | IN_PROGRESS (Iteration 2 remediation) |

---

## Interface Contracts

### 1. MON-02 TV Drawer Interface
- `#btn-toggle-tv-drawer` in `index.html`: onclick calls `window.OmniScopeMultiView.toggleTvDrawer()`.
- `#mon02-tv-drawer`: Static `<aside id="mon02-tv-drawer" class="mon02-tv-sidepanel hidden">` located inside `#card-webcam`.
- Method `window.OmniScopeMultiView.toggleTvDrawer(forceState)`: Toggles class `hidden` on `#mon02-tv-drawer`.

### 2. Doppler Radar Backend API
- `GET /api/weather/radar?provider={id}&mode={mode}`
  - `provider`: one of 20 verified keys (`nexrad`, `bright_sky`, `dwd`, `buienradar`, `chmi_czechia`, `cwa_taiwan`, `singapore_nea`, `rainviewer_radar_grid`, `knmi_radar_composites`, etc.).
  - `mode`: `composite`, `velocity`, `rain_rate`, `echo_tops`, `dual_pol_cc`, `differential_z`, `satellite_ir`, `satellite_vis`.
  - Response JSON: `{ status: "ok", provider: string, mode: string, tile_url: string, wms_url: string, wms_layer: string, refresh_sec: number, attribution: string }`.

### 3. Weather Station Telemetry API
- `GET /api/weather/provider/{id}`
  - Response JSON: `{ status: "ok", provider_id: string, name: string, agency: string, lat: number, lon: number, telemetry: { temperature_c: number, relative_humidity_pct: number, pressure_hpa: number, wind_speed_kmh: number, wind_direction_deg: number, weather_condition: string, observation_time: string }, model_resolution: string, update_cycle: string }`.

### 4. Stau-Watcher MON-02 Streaming
- Function `window.streamTrafficToMon2(lat, lon, zoom = 14)`:
  - Embed URL: `https://maps.google.com/maps?q=${lat},${lon}&z=${zoom}&layer=t&output=embed`
  - Assigns custom embed HTML to active MON-02 sub-monitor slot.

---

## Code Layout
- `index.html`: Main SPA document, HUD layout, header controls, static TV drawer container.
- `css/cyberpunk.css`: Tactical cyberpunk styling, TV drawer positioning, z-index layers.
- `js/tv_multiview.js`: MON-02 multi-viewport manager, TV catalog filter, HLS player binding, global stream helpers.
- `js/map.js`: Leaflet tactical map controller, weather station diamond markers, traffic tile layer, Doppler tile renderer.
- `_worker.js`: Cloudflare Pages Functions edge gateway, radar/weather/satellite proxying, static asset fallback.
- `worker.js`: Standalone Cloudflare Worker copy of `_worker.js` (must remain 100% identical).
- `js/web_bridge.js`: Local / electron browser bridge fallback implementing same routing as `_worker.js`.
- `_headers`: Cloudflare Pages HTTP header configuration (cache-control, CSP).
- `qa.py`: Pre-release QA auditor script (14 test assertions, Grade A+ 100% required).
- `deploy.ps1` / `deploy.bat`: Automated Cloudflare Pages deployment scripts.
- `.gitignore`: Repository exclusion rules (.agents/, agent.*/, .agent/).
