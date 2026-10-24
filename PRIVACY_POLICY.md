# Privacy Policy — OmniScope OSINT (Web, Chrome Extension, Windows & Android)

**Effective Date:** October 24, 2026

## 1. Zero Personal Data Collection
OmniScope OSINT (including the Chrome Side Panel Extension, Web Application, Windows Desktop App, and Android App) **does not collect, store, track, or transmit any personal user data, browsing history, IP logs, or analytics.**

## 2. Local Storage Only (`chrome.storage.local`)
All user preferences—such as your last viewed map coordinates, selected city name, and cached weather/seismic telemetry—are stored strictly locally on your own device using `chrome.storage.local` (or `localStorage` on Web). This data never leaves your browser.

## 3. Direct Keyless Open-Data Requests
When you use OmniScope OSINT, your client makes direct, unauthenticated HTTPS requests to public scientific and meteorological open-data providers to display live weather and geophysical telemetry:
- **Open-Meteo** (`*.open-meteo.com`) — Weather forecasts, air quality, geocoding, and ERA5 historical climate archive.
- **RainViewer** (`*.rainviewer.com`) — Public Doppler precipitation radar tiles.
- **USGS Earthquake Hazards Program** (`earthquake.usgs.gov`) — Live global seismic GeoJSON feed.
- **NOAA NWS & SWPC** (`api.weather.gov`, `services.swpc.noaa.gov`) — Severe weather alerts and planetary Kp-index.
- **WhereTheISS** (`api.wheretheiss.at`) — International Space Station orbital telemetry.
- **CartoDB / OpenStreetMap** — Map base tiles.

## 4. Third-Party Sharing
Because OmniScope OSINT collects zero personal data, no data is ever sold, shared, or transferred to any third party.

## 5. Contact & Open-Source Verification
The complete source code is publicly auditable under the MIT License at:
- https://github.com/finnytech/omniscope-web
- https://github.com/finnytech/omniscope-osint
