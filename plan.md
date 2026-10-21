# OmniScope Master Architecture Plan v2.3.0: 340 Neue Keyless Features & Taktische Expansion

> **Version:** v2.3.0 Mega-Tactical Expansion  
> **Umfang:** Exakt 340 neue Features (F-001 bis F-340) über 10 taktische Domänen  
> **Ecosystem (5 Ziel-Plattformen):**
> 1. `omniscope-web` (Cloudflare Pages Production & Edge Worker API)
> 2. `omniscope-osint` (Self-Host Localhost Edition mit lokaler SQLite 3 DB `cameras.db`, `nodes.db`, `omniscope_spatial.db` & `start.bat` / `start.ps1` / `run_server.py` für jeden Nutzer)
> 3. `omniscope-privat` (Origin Tactical Command Center & Private Network Grid)
> 4. `omniscope-desktop-neu` (Ultra-Lightweight Windows Desktop EXE via Native WebView2)
> 5. `omniscope-apk` (Android Standalone APK)  
> **Strikte Qualitäts-Direktive:** 100% Zero-Fake Policy, ausschließlich verifizierte echte Keyless Open Data APIs (NOAA, Open-Meteo, DWD, USGS, GDACS, Safecast, TeleGeography, INTERMAGNET), KEINE nutzlosen theoretischen Python-Backend-Algorithmen, maximale Client- und Edge-Performance.

---

## 🧭 Übersicht der 10 Taktischen Domänen (340 Features Total)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                    OMNISCOPE v2.3.0 ARCHITEKTUR-GRID (340 NEUE FEATURES)                 │
│                                                                                         │
│  [D1]  NOAA & NEXRAD Keyless Doppler Radar & Storm Tracking (F-001 - F-034)             │
│  [D2]  Open-Meteo & DWD Multi-Model Physics & Atmospheric Grid (F-035 - F-068)          │
│  [D3]  Tactical Map Nodes & Spezialisierte Sub-Node Kategorien (F-069 - F-102)          │
│  [D4]  140+ Neue Keyless Open Data Provider & Sensor-Netzwerke (F-103 - F-136)          │
│  [D5]  Tiefsee-Ozeanographie, Marine-Bojen & Tsunami-Frühwarnung (F-137 - F-170)        │
│  [D6]  Weltraumwetter, Sonnenphysik, Asteroiden & Satelliten-Downlinks (F-171 - F-204)  │
│  [D7]  Globaler Vulkanismus, Seismik-Spektrogramme & Katastrophen-Lage (F-205 - F-238)  │
│  [D8]  RF-Spektrum, Blitzortung TOA & In-App Shortwave SDR Audio Decks (F-239 - F-272)  │
│  [D9]  Neue Taktische Monitore MON-13 bis MON-20 & Modulare Ops Panels (F-273 - F-306)  │
│  [D10] OSINT Field Workbench, Taktische Rechner, Decoder & GIS Exporter (F-307 - F-340) │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Domäne 1: NOAA & NEXRAD Keyless Doppler Radar & Storm Tracking (F-001 - F-034)

*Vollständiger nativer Ausbau aller offenen NOAA Level-II/III Radar- und Storm-Prediction-Dienste ohne API-Keys.*

- **F-001** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA NEXRAD N0Q Base Reflectivity High-Res Tiling** (Iowa State Mesonet Cache) - 1 km Auflösung über die gesamten USA/Alaska/Hawaii/Puerto Rico mit dBZ Farbskala.
- **F-002** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NEXRAD N0U Radial-Geschwindigkeits-Overlay** - Echte Doppler-Radialwinde zur Erkennung von Mesozyklonen, Tornado-Rotations-Couplets und Downbursts.
- **F-003** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NEXRAD EET Echo Tops Radar** - Maximale Höhe der Radarechos in Tausend Fuß (kft) zur Früherkennung penetrierender Superzellen-Gipfel.
- **F-004** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NEXRAD ZDR Dual-Polarisations-Differential-Reflektivität** - Unterscheidung zwischen Hagel, Regentropfen und Tornado Debris Signatures (TDS).
- **F-005** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA SPC Convective Outlook Day 1-3 Polygone** - Keyless GeoJSON Import der offiziellen Unwetter-Risikozonen (Marginal, Slight, Enhanced, Moderate, High Risk).
- **F-006** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA SPC Mesoscale Discussions (MD) Live-Parser** - Automatische Extraktion akuter Tornado-Watch und Severe-Thunderstorm-Watch Regionen.
- **F-007** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Tornado Warning Vector Polygone (TOR)** - Rote Echtzeit-Schadenspfad-Polygone mit NWS Notfall-Meldungstext und Vektor-Zugbahn.
- **F-008** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Severe Thunderstorm Warning Polygone (SVR)** - Gelbe Warnpolygone mit Hagelgröße ($cm$/Inches) und orkanartigen Böen ($km/h$/mph).
- **F-009** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Flash Flood Warning Polygone (FFW)** - Grüne Sturzflut-Warnpolygone mit akuten Regenraten und gefährdeten Flussläufen.
- **F-010** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NWS Local Storm Reports (LSR) Live-Ticker** - Augenzeugen- und Chaser-Meldungen zu Hagelschlag, Windbruch und Tornadosichtungen.
- **F-011** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Physische Doppler-Radar Stations-Anvisierung** - Direkte Verlinkung aller 160 WSR-88D NEXRAD Stationen mit 50/120/240 km Range-Ringen.
- **F-012** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Conical Radar Sweep Azimut-Animation** - Flüssiger 60 FPS Sweep-Effekt synchronisiert mit dem aktuellen Elevationswinkel (0.5° bis 19.5°).
- **F-013** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Multi-Radar Multi-Sensor (MRMS) MESH Hagel-Schätzer** - Maximum Expected Size of Hail in Millimetern über das US-Radar-Grid.
- **F-014** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MRMS Vertically Integrated Liquid (VIL)** - Flüssigwassergehalt der Wolkensäule zur Erkennung kollabierender Gewitter und Microbursts.
- **F-015** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA ASOS/AWOS Bodenstationen (2.000+ Stationen)** - Temperatur, Taupunkt, Luftdruck, Windböen und Wolkenuntergrenze alle 5 Minuten.
- **F-016** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Supercell Motion Bunkers Vektor-Rechner** - Berechnung der Abweichungsrichtung von rechtziehenden Superzellen (Right-Movers) vs. Left-Movers.
- **F-017** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Significant Tornado Parameter (STP) Overlay** - Keyless Korrelation von CAPE, LCL, Scherung und Helizität zur Tornado-Wahrscheinlichkeit.
- **F-018** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Supercell Composite Parameter (SCP) Grid** - Räumliche Lokalisierung organisierter rotierender Aufwinde.
- **F-019** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Storm Relative Helicity (SRH 0-1km / 0-3km)** - Lokale bodennahe Windscherung für Tornado-Triage.
- **F-020** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NWS Radar Volume Coverage Pattern (VCP) Detector** - Automatische Anzeige des aktiven Scanmodus (VCP 12, VCP 212, VCP 31, VCP 35).
- **F-021** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **GOES-East (GOES-16) Mesoscale Sector 1 & 2 Rapid Scan** - 1-Minuten Satellitenbilder über aktiven Unwetter-Zentren.
- **F-022** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **GOES-West (GOES-18) Pazifik-Sturm-Scanner** - Verfolgung von Atmospheric Rivers und extratropischen Tiefdrucksystemen.
- **F-023** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **GOES Geostationary Lightning Mapper (GLM)** - Optische Erfassung von Wolke-zu-Wolke Blitzen zur Vorhersage von Rapid Intensification.
- **F-024** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NWS Watches / Warnings / Advisories (WWA) Master Feed** - Bundesweiter Gesamt-Krisen-Feed nach Gefahrenstufen triage-codiert.
- **F-025** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Tornado Touchdown Archive & Damage Track Replay** - Historische Pfad-Rekonstruktionen verheerender EF-4/EF-5 Ereignisse.
- **F-026** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NEXRAD Clear-Air Modus vs. Precipitation Modus Umschalter** - Hochempfindliche Detektion von Grenzschichten, Vögeln und Rauch im Clear-Air Modus.
- **F-027** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NWS Wind Chill & Heat Index Gefahrenrechner** - Automatische Berechnung gefühlter Extremtemperaturen.
- **F-028** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **US Drought Monitor (USDM) Vektor-Layer** - Wöchentliche Dürrestufen D0 (Ungewöhnlich trocken) bis D4 (Aussergewöhnliche Dürre).
- **F-029** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NWS River Gauges Flood Stage Monitor** - 8.000+ Pegelmessstellen der US-Flusssysteme mit Hochwasserstufe.
- **F-030** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **National Hurricane Center (NHC) Tropical Storm Tracking** - Offizielle Kegelprognosen für Atlantik- und Ostpazifik-Hurrikane.
- **F-031** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Hurrikan-Windgeschwindigkeits-Radien** - Quadranten-Darstellung von 34kt-, 50kt- und 64kt-Windfeldern.
- **F-032** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Storm Surge Inundation Risk Map** - Modellierte Überflutungshöhen bei Hurrikan-Landfall an der US-Golf- und Ostküste.
- **F-033** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA Marine Offshore Weather Buoy Integrator** - Kopplung der Küstenbojen mit NEXRAD Niederschlagsradar.
- **F-034** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **One-Click CONUS Unwetter-Fokus** - Sofortiger Kamerasprung und Radarzoom auf den aktivsten Unwettersektor Nordamerikas.

---

## Domäne 2: Open-Meteo & DWD Multi-Model Physics & Atmospheric Grid (F-035 - F-068)

*Ausbau aller hochauflösenden numerischen Wettermodelle (DWD ICON, ECMWF, GFS, AROME) über offene Schnittstellen.*

- **F-035** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DWD ICON-D2 Hochauflösungs-Modell (2.2 km)** - Stündliche Aktualisierung für Deutschland, Österreich und Schweiz inklusive Konvektions-Zellen.
- **F-036** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DWD ICON-EU Regionalmodell (7 km)** - Europaweites physikalisches Modell für Windböen, Bodendruck und Niederschlagsart.
- **F-037** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DWD ICON Globalmodell (13 km)** - Weltweites 14-Tage-Vorhersagemodell mit Isobarendruckflächen.
- **F-038** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **ECMWF Integrated Forecasting System (IFS 9 km)** - Weltweit führendes europäisches Mittelfrist-Wettermodell.
- **F-039** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **ECMWF AIFS Neural AI Modell** - Revolutionäres KI-Wettermodell mit extrem geringem Vorhersagefehler.
- **F-040** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA GFS Global Forecast System (0.25° Mesh)** - Weltweite Druckgebilde, Jetstream-Windbänder und 500 hPa Geopotenzialhöhe.
- **F-041** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA HRRR High-Resolution Rapid Refresh (3 km)** - Stündlich re-initialisiertes US-Konvektionsmodell mit Radar-Datenassimilation.
- **F-042** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Météo-France AROME (1.3 km)** - Hochauflösendes Alpen- und Westeuropa-Modell für Starkregen und Fallwinde.
- **F-043** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Météo-France ARPEGE (0.1°)** - Synoptisches Modell für Atlantik-Tiefdrucksysteme und Westwetterlagen.
- **F-044** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **JMA MSM Meso-Scale Modell (5 km)** - Japanisches Modell für Taifune, Meeres-Konvektion und Starkregen.
- **F-045** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **BOM ACCESS-G & ACCESS-C Modelle** - Australische Wetter- und Buschfeuer-Atmosphärenmodelle.
- **F-046** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Multi-Modell-Konsens Rechner (147 Modelle)** - Automatischer Mittelwert, Standardabweichung und Konfidenzintervall aller Modelle für jeden Klickpunkt der Welt.
- **F-047** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Atmosphärisches CAPE Profiling (J/kg)** - Konvektiv verfügbare potentielle Energie zur Blitz- und Hagel-Prognose.
- **F-048** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Lifted Condensation Level (LCL Höhe in m)** - Wolkenuntergrenze für Gewitterzellen und Tornadogenese.
- **F-049** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Troposphärischer Jetstream Wind-Mapper (250 hPa / 300 hPa)** - Visualisierung der Starkwindbänder zur Flugrouten- und Unwetter-Analyse.
- **F-050** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Bodeninversions- & Nebel-Index** - Differenz zwischen 2m Temperatur und Taupunkt zur Vorhersage von Strahlungsnebel und Smog.
- **F-051** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Open-Meteo GloFAS River Discharge Forecast** - 14-Tage Flusspegel- und Abflussprognosen ($m^3/s$) für alle Kontinente.
- **F-052** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Open-Meteo CAMS Air Quality Forecast** - Globale Vorhersage von $PM_{2.5}$, $PM_{10}$, Stickstoffdioxid ($NO_2$), Ozon ($O_3$) und Saharastaub.
- **F-053** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Open-Meteo Marine Wave & Swell Physics** - Signifikante Wellenhöhe, Dünungshöhe, Wellenperiode und Strömungsrichtung.
- **F-054** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Open-Meteo Solar PV & Direct Normal Irradiance (DNI)** - Direkte und diffuse Sonnenstrahlung in $W/m^2$ für Solar-Monitoring.
- **F-055** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Open-Meteo Historical Reanalysis (ERA5)** - Lückenloser Zugriff auf historische Wetterdaten seit 1940 zur Klimatrend-Analyse.
- **F-056** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DWD Stationsmessnetz (CDC Open Data)** - Live-Messwerte von über 500 DWD Wetterstationen in Deutschland.
- **F-057** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DWD Bodenfeuchte- & Dürre-Monitor** - Nutzbaren Feldkapazität (nFK in %) zur Beurteilung von Waldbrand- und Austrocknungsrisiko.
- **F-058** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DWD Pollenflug-Gefahrenindex** - Vorhersage der Belastung durch Hasel, Erle, Birke, Gräser und Ambrosia.
- **F-059** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MeteoSwiss SwissMetNet Open Data** - Live-Messwerte der 260 Schweizer Hochgebirgs- und Talstationen.
- **F-060** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **GeoSphere Austria TAWES Messnetz** - 280 österreichische Wetterstationen mit alpinen Windspitzen.
- **F-061** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Schneefallgrenzen- & Nullgradgrenzen-Rechner** - Exakte Berechnung der Gefrierhöhe in Metern über Meer.
- **F-062** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Niederschlagsphasen-Klassifikator** - Unterscheidung zwischen Regen, Schnee, Schneeregen, gefrierendem Regen (Glatteis) und Graupel.
- **F-063** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Böen-Faktor (Gust-Factor) Abschätzung** - Verhältnis von Spitzenböen zu mittlerem Wind zur Sturmschaden-Prävention.
- **F-064** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Thermisches Wolkenbedeckungs-Profil** - Aufteilung in tiefe (Low), mittelhohe (Mid) und hohe (High Cirrus) Bewölkung.
- **F-065** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **UV-Index & Sonnenbrandzeit-Sensorik** - Echtzeit-UV-Belastung und maximale ungeschützte Expositionszeit.
- **F-066** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Sturmtief-Kerndruck-Gradient-Rechner** - Berechnung des horizontalen Druckgradienten zur Orkan-Erkennung.
- **F-067** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Ensemble-Streuungs-Anzeige (Ensemble Spread)** - Visualisierung der Vorhersageunsicherheit zwischen 50 Ensemble-Läufen.
- **F-068** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Dynamische Modell-Favoritenleiste** - Schnellwechsel zwischen DWD ICON, GFS, ECMWF und AIFS mit einem Klick.

---

## Domäne 3: Tactical Map Nodes & Spezialisierte Sub-Node Kategorien (F-069 - F-102)

*Ausbau interaktiver Vektor-Nodes auf MON-01 mit Canvas-Rendering und spezialisierter MON-02 Telemetrie.*

- **F-069** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **🌋 Vulkane & Calderas Node Layer (Smithsonian GVP)** - Rote/orange Dreiecke mit Luftfahrt-Farbcode (Rot, Orange, Gelb, Grün).
- **F-070** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Vulkan Sub-Node Dossier in MON-02** - Gipfelhöhe, VEI-Index, Aschewolken-Höhe ($FL$), Eruptionshistorie und Windverfrachtungs-Kegel.
- **F-071** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **🌊 Tiefsee-Tsunami-Bojen Node Layer (NOAA DART)** - Cyanblaue Rauten mit akustischen Wellen-Pulsringen.
- **F-072** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DART Sub-Node Dossier in MON-02** - Seeboden-Druckmesswerte, Meeressäulenhöhe, SST-Wassertemperatur und Tsunami-Alarmstatus.
- **F-073** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **⚡ Blitzortung Real-Time Strike Cluster Node Layer** - Gelbe Blitzsymbole mit Nanosekunden-TOA-Genauigkeitsringen.
- **F-074** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Blitzortung Sub-Node Dossier in MON-02** - 1-Sekunden Live-Ticker ("vor Xs"), Blitzrate/min, Peak-Stromstärke ($kA$) und Polarität.
- **F-075** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **📡 Weltraum-Bodenstationen Node Layer (NASA DSN / ESA)** - Magenta Parabolantennen-Symbole mit Spiegeldurchmesser.
- **F-076** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DSN Sub-Node Dossier in MON-02** - S/X/Ka-Frequenzbänder, aktives Zielraumfahrzeug, Azimut-/Elevationswinkel und Signallaufzeit.
- **F-077** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **🛢️ Strategische Energie- & LNG-Terminals Node Layer** - Goldene Sechsecke an maritimen Engpässen (Hormus, Malakka, Suez).
- **F-078** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Energie-Infrastruktur Sub-Node Dossier in MON-02** - Umschlagvolumen, Pipeline-Durchsatz, Tankerkapazität und Versorgungs-Risikostufe.
- **F-079** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **🧲 Geomagnetische Observatorien Node Layer (INTERMAGNET)** - Violette Fünfecke mit Störvektor-Pfeilen.
- **F-080** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **INTERMAGNET Sub-Node Dossier in MON-02** - Magnetfeldstärke ($nT$), Deklination, $H/Z$-Komponenten und GIC-Stromnetz-Alarmstufe.
- **F-081** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **🌐 Untersee-Glasfaserkabel Vektor-Layer (TeleGeography)** - 550+ Seekabel-Trassen im dedizierten `cablesPane` (z-Index: 350).
- **F-082** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Seekabel-Landestationen Circle-Marker** - 1.400+ weltweite Landepunkte mit Landing-Station Dossier in MON-02.
- **F-083** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **☢️ Safecast Strahlungs- & Geiger-Sensor Node Layer** - 320+ Live-Geigerzähler mit CPM, $\mu Sv/h$ und Dosisleistungs-Farbverlauf.
- **F-084** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Safecast Sub-Node Dossier in MON-02** - Sensor-ID, Modell, 24h Dosisverlauf und Radioaktivitäts-Status.
- **F-085** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **🚢 Baltic AIS Realtime Vessel Tracking Node Layer** - Echte Schiffspositionen in Nord- und Ostsee mit MMSI, Kurs und Speed.
- **F-086** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Schiffs-Dossier in MON-02** - Schiffstyp (Tanker, Frachter, Fähre, Schlepper), Zielhafen, ETA und Tiefgang.
- **F-087** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **✈️ Aviation METAR Flugplatz-Stationen Node Layer (AWC)** - Farbcodierte ICAO Flugkategorien (VFR=Grün, MVFR=Blau, IFR=Rot, LIFR=Magenta).
- **F-088** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **METAR Sub-Node Dossier in MON-02** - Dekodierter Rohstring, Runway Visual Range (RVR), Windkomponenten und QNH.
- **F-089** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **📻 Public KiwiSDR Kurzwellen-Empfänger Node Layer** - SDR-Icons weltweit über 80+ Länder verteilt.
- **F-090** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **KiwiSDR In-App Audio Deck in MON-02** - Direkter Web-Audio Demodulator, Frequenz-Wasserfall (0-30 MHz) und Audio-Streaming.
- **F-091** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **🛂 US CBP Grenzwartezeiten Node Layer** - Reale Wartezeiten aller 300+ Grenzübergänge zu Mexiko und Kanada.
- **F-092** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Grenz-Dossier in MON-02** - PKW-/LKW-Spuren, Wartezeit in Minuten, Grenzhafen-Name und Rush-Hour Trend.
- **F-093** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **🧅 Tor Relays & Exit Nodes Layer (Onionoo API)** - Guard-, Middle- und Exit-Nodes mit Flag-Kennzeichnung.
- **F-094** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Tor Node Dossier in MON-02** - Nickname, Fingerprint, Bandbreite in Mbps, AS-Nummer und Exit-Policy.
- **F-095** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **⚠️ UN/EU GDACS Multi-Hazard Disaster Node Layer** - Katastrophen-Marker (Erdbeben, Wirbelstürme, Fluten, Dürren).
- **F-096** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **GDACS Sub-Node Dossier in MON-02** - Severity-Stufe (Rot/Orange/Grün), betroffene Einwohnerzahl und UN OCHA Hilfsaufrufe.
- **F-097** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **28 px Leaflet Canvas Klick-Toleranz** - Zero-Miss Klick-Präzision für alle Canvas-Nodes auch auf Touchscreens.
- **F-098** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Dynamische Zoom-Skalierung (4.0 bis 8.5 px)** - Perfekt proportionierte Marker ohne unschöne Pixel-Scheiben.
- **F-099** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Schnellfilter im MON-01 Sidebar Drawer** - Ein-Klick Toggle für jede der 12 Vektor-Ebenen.
- **F-100** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Master Controls "ALL ON" & "ALL OFF"** - Gleichzeitiges Ein- und Ausschalten aller Sensor-Ebenen für maximale Übersicht.
- **F-101** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Sektor-Scan Kollisions-Vermeidung** - Klicks auf Marker öffnen immer das Ziel-Dossier und lösen nie den Karten-Sektor-Scan aus.
- **F-102** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Hardware-beschleunigtes Canvas-Redraw (60 FPS)** - Butterweiches Schwenken und Zoomen auch bei über 10.000 aktiven Punkten.

---

## Domäne 4: 140+ Neue Keyless Open Data Provider & Sensor-Netzwerke (F-103 - F-136)

*Ausbau von `weather_providers.json` von 147 auf 287 zertifizierte weltweite Keyless Open Data Provider.*

- **F-103** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Darwin VAAC (Australien)** - Vulkanasche-Flugberatung für Südostasien und Ozeanien.
- **F-104** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Tokyo VAAC (Japan)** - Überwachung von Sakurajima, Asama und dem westpazifischen Feuerring.
- **F-105** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Anchorage VAAC (Alaska)** - Aleuten-Bogen, Shishaldin und nordpazifische Eruptionsüberwachung.
- **F-106** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **London VAAC (UK Met Office)** - Nordatlantik und Island Vulkanasche-Ausbreitungsmodelle.
- **F-107** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Toulouse VAAC (Météo-France)** - Mittelmeer, Ätna, Stromboli und afrikanische Plumes.
- **F-108** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Buenos Aires VAAC (Argentinien)** - Südanden, Villarrica, Puyehue und patagonische Vulkane.
- **F-109** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Wellington VAAC (Neuseeland)** - Kermadec-Graben, White Island, Ruapehu und Mount Erebus.
- **F-110** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **USGS Yellowstone Volcano Observatory (YVO)** - Magmakammer-Deformation und hydrothermale Geysire.
- **F-111** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **INGV Catania / Ätna Observatorium (Italien)** - Infraschall-Sensorik, $SO_2$-Messungen und thermische Kameras.
- **F-112** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **OVDAS Südanden Vulkan-Netzwerk (Chile)** - Seismizität und Tiltmeter für 45 aktive Andenvulkane.
- **F-113** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **IGN Kanaren Vulkanologie (Spanien)** - La Palma, Teide und unterseeische Eruptionen.
- **F-114** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **PHIVOLCS Taal & Mayon Überwachung (Philippinen)** - Phreatische Eruptionswarnungen und Seetemperaturen.
- **F-115** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **PVMBG Merapi & Semeru Netzwerk (Indonesien)** - Pyroklastische Ströme und Lahar-Warnung.
- **F-116** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **OVSM Montagne Pelée Observatorium (Martinique)** - Karibik-Subduktionszone und Fumarolen-Gasanalytik.
- **F-117** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **KVERT Kamtschatka Eruption Team (Russland)** - Klyuchevskoy und Sheveluch Aschewolken.
- **F-118** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Sakurajima Volcano Research Center (Kyoto University)** - Hochpräzise Bohrloch-Dehnungsmessung.
- **F-119** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Sonnblick Hochalpen-Observatorium (3.106m, Österreich)** - Freie Troposphäre, Aerosole und Neutronen-Monitor.
- **F-120** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Jungfraujoch Sphinx Observatorium (3.571m, Schweiz)** - WMO GAW globale Treibhausgas-Referenzstation.
- **F-121** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **UFS Schneefernerhaus Zugspitze (2.650m, Deutschland)** - Permafrost-Degradation und alpine Wolkenphysik.
- **F-122** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Pic du Midi Observatorium (2.877m, Frankreich)** - Pyrenäen-Grenzschicht und atmosphärische Transparenz.
- **F-123** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Mauna Loa Baseline Observatory (3.397m, Hawaii)** - Historische Keeling-Kurve und solare Strahlung.
- **F-124** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Amundsen-Scott Südpol-Station (Antarktis)** - Katabatische Winde und Ozonloch-Sondierungen.
- **F-125** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Neumayer Station III (AWI Antarktis)** - Tägliche Radiosondierungen in antarktische Blizzards.
- **F-126** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Halley VI Research Station (British Antarctic Survey)** - Entdeckungsort des Ozonlochs und VLF-Whistler-Wellen.
- **F-127** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Concordia Dome C Station (3.233m, Antarktis)** - Kälterekorde bis -84.6°C und planetare Kältegrenzschicht.
- **F-128** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Ny-Ålesund Arktis-Basis (78°55'N, Spitzbergen)** - Arktische Verstärkung und Black-Carbon Deposition.
- **F-129** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Alert Station (82°30'N, Ellesmere Island, Kanada)** - Nördlichste bewohnte meteorologische Forschungsstation.
- **F-130** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Summit Camp Grönland (3.216m)** - Inlandeis-Schmelzereignisse und katabatische Ausflüsse.
- **F-131** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Mount Washington Observatory (1.917m, USA)** - Weltweit stärkste gemessene Oberflächenwinde (231 mph).
- **F-132** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **WMO Global Atmosphere Watch (GAW Genf)** - Standardisierte weltweite Chemie- und Aerosolmessungen.
- **F-133** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **SLF Davos Lawinenforschung (Schweiz)** - IMIS alpine Schneestationen und Schneebrett-Stabilität.
- **F-134** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **EURDEP Europäisches Radioaktivitäts-Austauschnetz** - 4.500+ kontinuierliche Geigerstationen.
- **F-135** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **BfS ODL Strahlungsmessnetz (Deutschland)** - 1.800 Gammasonden des Bundesamts für Strahlenschutz.
- **F-136** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **CTBTO Internationales Radionuklid-Messnetz (Wien)** - Weltweites 80-Stationen Netz für Spaltprodukte und Edelgase.

---

## Domäne 5: Tiefsee-Ozeanographie, Marine-Bojen & Tsunami-Frühwarnung (F-137 - F-170)

*Globales maritimes Sensornetz zur Erkennung von Tsunami-Wellen, Monsterwellen und thermischen Meeresströmungen.*

- **F-137** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA DART Pacific & Atlantic Tsunami Array** - Bodendruckaufnehmer zur Tsunami-Detektion im offenen Ozean.
- **F-138** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Tsunami Travel-Time (TTT) Isochronen-Rechner** - Berechnet Ankunftszeiten von Tsunami-Wellen an Küsten.
- **F-139** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA NDBC Moored Weather Buoy Grid (120+ Bojen)** - Wellenhöhe, dominante Periode und Wassertemperatur.
- **F-140** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **EuroGOOS Europäisches Meeres-Beobachtungssystem** - Küstenpegel, Sturmfluten und Gezeitenströme.
- **F-141** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Argo Floats Profiling Roboter-Array (4.000 Einheiten)** - Tiefenprofile bis 2.000 Meter für Temperatur und Salzgehalt.
- **F-142** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **PIRATA Tropischer Atlantik Bojen-Array** - Ozean-Atmosphäre-Kopplung und Hurrikan-Genesis.
- **F-143** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **RAMA Indischer Ozean Monsun-Array** - Monsun-Einbruch und Dipol-Monitoring im Indischen Ozean.
- **F-144** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **CDIP Scripps Coastal Wave Telemetry** - Richtungs-Wellenspektren und Brandungswarnungen.
- **F-145** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **IMOS Australien Tiefsee-Glider & Bojen** - Great Barrier Reef Wassertemperaturen und Ozeanglider.
- **F-146** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **JMA Japan Marine Offshore Buoys** - Früherkennung von Taifunwellen und plötzlichen Druckabfällen.
- **F-147** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Puertos del Estado REDEXT Tiefsee-Bojen (Spanien)** - Golf von Biskaya und Atlantik-Dünung bis 20 Meter.
- **F-148** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Met Éireann M-Bojen Netzwerk (Irland)** - M2-M5 Bojen im Nordatlantik zur Warnung vor Bomb-Cyclones.
- **F-149** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **BSH MARNET Nord- & Ostsee Umweltmessnetz** - Fino 1-3 Plattformen und Sturmflut-Pegel.
- **F-150** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **KMA Südkorea Marine-Bojennetzwerk** - Gelbes Meer Seenebel und Monsunstürme.
- **F-151** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NIO Indien Arabisches Meer Array** - Tropische Zyklon-Wärmepotenziale und Meeresströmungen.
- **F-152** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **U.S. IOOS High-Frequency Radar Oberflächenströmungen** - Küstenströmungs-Geschwindigkeitsfelder via HF-Radar.
- **F-153** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Global Sea Level Observing System (GLOSS)** - Weltweite Tidenpegel-Stationen zur Meeresspiegel-Überwachung.
- **F-154** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Kollisions- & Havarie-Drift-Rechner** - Berechnung der Drift-Richtung treibender Objekte auf Hoher See.
- **F-155** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Monsterwellen (Freak Waves) Risiko-Indikator** - Korrelation kreuzender Dünungen mit Strömungs-Gradienten.
- **F-156** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Marine Heatwave (MHW) Klassifikator** - Erkennung mariner Hitzewellen (Kategorie 1 bis 4).
- **F-157** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **El Niño / La Niña Southern Oscillation (ENSO) Barometer** - Nino 3.4 SST-Index in Echtzeit.
- **F-158** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Golfstrom- & AMOC Strömungs-Geschwindigkeitsanzeige** - Monitoring der Atlantischen Umwälzzirkulation.
- **F-159** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Arktische Meereis-Ausdehnungs-Karte (NSIDC)** - Tägliche Meereis-Fläche und Minimum-Projektion.
- **F-160** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Antarktische Schelfeis-Riss & Eisberg-Tracker** - Tracking von Riesen-Eisbergen (A-68, A-23a).
- **F-161** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Meeresleuchten (Biolumineszenz) & Rote Tiden (HAB) Alarm** - Algenblüten-Sensorik via MODIS Chlorophyll-A.
- **F-162** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Seewetter-Gale & Storm Warning Ticker** - Weltweite Starkwind- und Orkanwarnungen für Seeschiffe.
- **F-163** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Wassertiefen- & Bathymetrie-Klick-Abfrage (GEBCO)** - Meerestiefe in Metern für jeden Koordinatenpunkt.
- **F-164** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Gezeiten-Vorhersage (Tides Pro)** - Ebbe- und Flut-Kurven für 4.000 Häfen weltweit.
- **F-165** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Spezifische Dichte & Salinitäts-Messung** - Meerwasser-Dichte in PSU ($g/kg$).
- **F-166** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Meereis-Dicke & Navigation-Freigabe** - Eisklasse-Empfehlungen für Nordost- und Nordwestpassage.
- **F-167** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Küsteninundations- & Deichüberlauf-Simulator** - Modellierung von Sturmflutspitzen gegen Flutmauern.
- **F-168** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Kabel-Havarie Anker-Gefahrenzone** - Automatische Warnung wenn Schiffe über Unterseekabeln ankern oder driften.
- **F-169** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Maritimes Such- & Rettungs-Sektoren-Raster (SAR Grid)** - IAMSAR Suchmuster-Generierung für Notfälle.
- **F-170** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Integrierte MON-09 Hafen- & Schifffahrts-Command-Brücke** - Synchronisierter Schiffsradar mit Hafen-CCTV.

---

## Domäne 6: Weltraumwetter, Sonnenphysik, Asteroiden & Satelliten-Downlinks (F-171 - F-204)

*Planetare Verteidigung, erdnahe Asteroiden, Röntgenflares, Erdmagnetfeld-Stürme und Satelliten-Orbits.*

- **F-171** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NASA JPL SSD CNEOS Close Approach API (Keyless)** - Live-Katalog erdnaher Asteroiden mit Vorbeiflug-Distanz (LD und AU).
- **F-172** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Potentially Hazardous Asteroids (PHA) Schnell-Filter** - Isolierung aller Objekte $>140$ m innerhalb von 19.5 Monddistanzen.
- **F-173** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Torino- & Palermo-Impakt-Gefahrenskalen-Rechner** - Einschlagswahrscheinlichkeit und kinetische Energie ($MT$ TNT).
- **F-174** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NASA Sentry Collision Risk Monitoring Feed** - Automatische Überwachung künftiger potentieller Impakt-Korridore.
- **F-175** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA SWPC GOES Primär-Röntgenfluss (0.05-0.4nm & 0.1-0.8nm)** - Erfassung von A-, B-, C-, M- und extremen X-Klasse Flares.
- **F-176** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Koronaler Massenauswurf (CME) Ankunftszeit-Kalkulator (ETA)** - Plasma-Schockwellen-Laufzeit von Sonne zu Erde (18 bis 72 Stunden).
- **F-177** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NOAA Planetary Kp-Index 3-Tage-Barometer** - Geomagnetische Sturm-Einstufung von G1 (Gering) bis G5 (Extrem).
- **F-178** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DSCOVR / ACE Sonnenwind-Geschwindigkeits-Sensor ($km/s$)** - Echtzeit-Plasmageschwindigkeit am Lagrange-Punkt L1.
- **F-179** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Interplanetares Magnetfeld (IMF $B_z$ in $nT$)** - Südausrichtung von $B_z$ als Haupt-Auslöser geomagnetischer Stürme.
- **F-180** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Protonen-Dichte-Messer ($p/cm^3$)** - Dichte des solaren Partikelstroms zur Vorhersage von Kompressions-Ereignissen.
- **F-181** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Solar Radiation Storm (S1 bis S5) Alarm** - Hochenergetische Protonen-Events ($>10$ MeV) zur Luftfahrt-Strahlenwarnung über den Polen.
- **F-182** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Radio Blackout (R1 bis R5) HF-Dämpfungs-Karte** - Ionosphärische D-Schicht Absorption auf Kurzwellenbändern.
- **F-183** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Aurora Borealis & Australis OVATION Wahrscheinlichkeits-Oval** - Wahrscheinlichkeits-Konturen für Polarlichter.
- **F-184** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **CelesTrak GP Active Satellite Fleet (8.000+ Satelliten)** - LEO, MEO und GEO Umlaufbahnen mit Bahnvektoren.
- **F-185** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **ISS & Tiangong Raumstationen Live-Bodenspur** - Höhe (420 km), Geschwindigkeit (27.600 km/h) und Astronauten-Besatzung.
- **F-186** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Starlink Megakonstellations-Tracker** - Dichte der Starlink-Shells und Startketten (Starlink Trains).
- **F-187** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Weltraumschrott- & Trümmerfeld-Katalog** - Gefahrenzonen vergangener ASAT-Waffentests (Kosmos-1408, Fengyun-1C).
- **F-188** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NASA Deep Space Network (DSN) Antennen-Status** - Live-Uplinks der Stationen Goldstone, Madrid und Canberra zu Voyager 1, New Horizons und Mars Rovern.
- **F-189** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **ESA ESTRACK Bodenstations-Netzwerk** - Cebreros, Malargüe und New Norcia 35m Tiefraum-Antennen.
- **F-190** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Solar Dynamics Observatory (SDO) Live-Filterbilder** - AIA 193Å, 304Å, 171Å Koronabilder der Sonne im 15-Minuten-Takt.
- **F-191** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **SOHO LASCO C2 & C3 Koronagrafen** - Erkennung von koronalen Massenauswürfen und Sonnenkorona-Schockwellen.
- **F-192** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **INTERMAGNET Niemegk & Wingst Live-Magnetogramme** - 1-Sekunden Feldschwankungen des Erdmagnetfelds.
- **F-193** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **SuperDARN Ionosphären-Plasma-Konvektions-Radar** - Globale elektrische Feldmuster in der Hochatmosphäre.
- **F-194** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Satelliten-Wiedereintritts- & Verfall-Prognose** - Tracking abstürzender Raketenstufen mit Wiedereintritts-Korridor.
- **F-195** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Satelliten-Überflug-Rechner für jeden Standort** - Uhrzeit, Elevation, Azimut und Helligkeit (Magnitude) sichtbarer Überflüge.
- **F-196** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Iridium Flare & Solarpanel-Reflexions-Warner** - Vorhersage blendender Lichtblitze am Nachthimmel.
- **F-197** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Galaktische Kosmische Strahlung (GCR) Neutronen-Monitor** - Messwerte alpiner und polarer Neutronen-Detektoren.
- **F-198** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Thermosphärische Bremsungs-Kalkulation für LEO-Satelliten** - Atmosphärische Aufblähung bei Sonnenstürmen.
- **F-199** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Sonnenflecken-Relativzahl (Wolf-Zahl) Tracker** - Fortschritt des 11-jährigen solaren Zyklus 25.
- **F-200** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **F10.7 cm Solare Radiofluss-Dichte ($SFU$)** - Proxy für ultraviolette Sonnenstrahlung und Ionosphärendichte.
- **F-201** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Geomagnetisch induzierte Ströme (GIC) Gefahren-Barometer** - Risiko von Transformator-Sättigungen in Hochspannungsnetzen.
- **F-202** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Mondphasen-, Beleuchtungsgrad- & Libration-Sensor** - Nachtsicht- und Tiden-Planungstool.
- **F-203** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Optischer Deep-Sky Lichtverschmutzungs-Filter (Bortle-Skala)** - Lokalisierung von Dark-Sky Reservaten.
- **F-204** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Integrierte MON-11 & MON-14 Weltraumwetter-Zentrale** - Synchronisierte Anzeige von Sonne, Magnetfeld und ISS-Stream.

---

## Domäne 7: Globaler Vulkanismus, Seismik-Spektrogramme & Katastrophen-Lage (F-205 - F-238)

*Frühwarnung für Erdbeben, vulkanische Asche, Waldbrände, Lawinen und humanitäre Krisen.*

- **F-205** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **USGS Real-Time Earthquake GeoJSON API** - Alle globalen Beben ($M \ge 1.0$) innerhalb von 90 Sekunden.
- **F-206** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **EMSC Euro-Med Seismological Centre Feed** - Detail-Daten für Erdbeben im europäischen und mediterranen Raum.
- **F-207** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Interaktives Seismogramm-Canvas in MON-13** - Reale Wellenformen von P- und S-Wellen globaler Seismometer.
- **F-208** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Magnituden-Stufen Triage ($M \ge 2.5$, $M \ge 4.5$, $M \ge 6.0$, $M \ge 7.0$)** - Schnelle visuelle Unterscheidung.
- **F-209** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Hypozentrum-Tiefen-Farbcodierung** - Flachbeben ($0-30$ km = Hohe Zerstörung) vs. Tiefbeben ($>300$ km).
- **F-210** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Submariner Erdbeben- & Tsunami-Gefahren-Evaluator** - Sofortiger Alarm wenn Magnitude $\ge 6.5$ und Tiefe $\le 50$ km im Ozean.
- **F-211** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **USGS ShakeMap Intensitäts-Konturen (MMI I bis X)** - Modellierte Erschütterungsstärken und Schadensradien.
- **F-212** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **USGS PAGER Opfer- & Wirtschaftsschadens-Schätzer** - Rote/Gelbe/Grüne volkswirtschaftliche Verluststufen.
- **F-213** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Smithsonian Global Volcanism Program (GVP) Feed** - Wöchentliche Eruptionsberichte aller aktiven Vulkane weltweit.
- **F-214** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Luftfahrt-Farbcode (VONA) für Vulkane** - Rote und orange Warnstufen für internationale Transkontinental-Flüge.
- **F-215** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Vulkanischer Explosivitäts-Index (VEI 0 bis 8)** - Eruptionsvolumen und Wolkenaufstiegshöhe.
- **F-216** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Copernicus Sentinel-5P Schwefeldioxid ($SO_2$) Plume Tracker** - Orbitales Tracking vulkanischer Gaswolken.
- **F-217** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NASA FIRMS Thermal Fire Hotspots (MODIS & VIIRS 375m)** - Weltweite Waldbrand- und Vegetationsbrand-Hotspots.
- **F-218** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Fire Radiative Power (FRP in $MW$)** - Intensität und Energiefreisetzung von Waldbränden zur Abschätzung von Rauchmengen.
- **F-219** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Pyrocumulonimbus (PyroCb) Gewitterwolken-Erkennung** - Durch Waldbrände generierte Gewitterstürme mit Feuer-Blitzen.
- **F-220** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Copernicus EFFIS Europäisches Waldbrand-Informationssystem** - Brandgefahren-Index (FWI) und verbrannte Flächen.
- **F-221** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **InciWeb USA Waldbrand-Lageberichte** - Eindämmungsgrad (Containment %), evakuierte Zonen und Brandflächen.
- **F-222** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **CWFIS Kanadischer Waldbrand-Rauch-Simulator** - Grenzüberschreitender Rauchtransport über Nordamerika.
- **F-223** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **UN OCHA ReliefWeb Krisenlageberichte** - Humanitäre Notsituationen, Flüchtlingsströme und UN-Hilfseinsätze.
- **F-224** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **UN/EU GDACS Multi-Hazard Master Dashboard** - Korrelierte Lageübersicht für alle Naturkatastrophen.
- **F-225** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Katastrophen-Betroffene Bevölkerungs-Rechner** - Wohnbevölkerung im 25 km, 50 km und 100 km Radius um Schadenszentren.
- **F-226** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Erdrutsch- & Murenabgangs-Risikokarte** - Korrelation von Steilhang-Topografie mit Niederschlagssummen.
- **F-227** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Dammbruch & Sturzflut-Inundations-Simulator** - Gefährdete Talsohlen und Vorwarnzeiten bei Talsperren-Überlauf.
- **F-228** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Alpine Lawinen-Gefahrenstufen (1 bis 5)** - Tirol, Bayern, Schweiz (SLF) und Frankreich (BERA).
- **F-229** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Triebschnee- & Schwachschicht-Indikator** - Kritische Windscherung auf Altschneedecken in den Alpen.
- **F-230** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Gletschersee-Ausbruch (GLOF) Frühwarnsystem** - Himalaya und Anden Gletschersee-Pegelüberwachung.
- **F-231** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Klimatische Dürre- & Ariditäts-Klassifikation** - Standardized Precipitation Index (SPI) für Erntezonen.
- **F-232** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Trinkwasserversorgungs- & Grundwasserpegel-Monitor** - Messwerte europäischer und US-amerikanischer Grundwassermessstellen.
- **F-233** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Humanitäre Evakuierungsrouten & Chokepoint-Status** - Befahrbarkeit von Fernstraßen und Brücken im Krisengebiet.
- **F-234** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Krankenhaus- & Notfall-Infrastruktur-Status** - Kapazitäten medizinischer Zentren im Katastrophengebiet.
- **F-235** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Notunterkunft- & Camp-Geolokalisierungs-Grid** - UNHCR Notlager und Verteilzentren.
- **F-236** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Historischer 30-Tage Katastrophen-Replay-Slider** - Rekonstruktion von Schadensabläufen auf der Weltkarte.
- **F-237** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Automatischer Krisenlage-Markdown-Report-Generator** - Erzeugt vollständige Lageberichte für Analysten mit einem Klick.
- **F-238** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Integrierte MON-04 & MON-06 Vulkan-/Seismik-Zentrale** - Synchronisierter Seismograph mit Vulkan-Webcams.

---

## Domäne 8: RF-Spektrum, Blitzortung TOA & In-App Shortwave SDR Audio Decks (F-239 - F-272)

*Hochfrequenz-Funküberwachung, VLF TOA Blitzortung, WebSDR Demodulatoren und SIGINT Radio-Decks.*

- **F-239** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Native In-App Web Audio Kurzwellen-Demodulator** - AM, USB, LSB, CW und Schmalband-FM direkt im Browser ohne Plugins.
- **F-240** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **60 FPS Live FFT Frequenz-Spektrum- & Wasserfall-Canvas** - Flüssige Visualisierung von HF-Signalen von 0 bis 30 MHz.
- **F-241** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Audio Deck Steuerung in MON-02** - Play/Pause, -15s Rücksprung, +15s Vorsprung, Lautstärkeregler und Frequenz-Drehknopf.
- **F-242** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **80+ Länder KiwiSDR Routing Engine** - Automatischer Verbindungsaufbau zu freien WebSDR-Empfängern weltweit.
- **F-243** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **VLF Blitzortung Time-of-Arrival (TOA) Hyperbel-Peilung** - Berechnung von Blitzeinschlägen durch Laufzeitunterschiede.
- **F-244** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Dynamischer 1-Sekunden Blitz-Ticker** - Zählt die Sekunden seit dem letzten registrierten Blitzschlag live hoch.
- **F-245** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Kontinuierlicher 4-Sekunden Blitz-Sensor-Poller** - Erkennt neue Blitzeinschläge, setzt den Ticker zurück und pulsiert gelb.
- **F-246** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Blitz-Polaritäts-Klassifikator** - Negativer Erdblitz ($CG^-$ 86%) vs. Positiver Erdblitz ($CG^+$ 14% = Extrem brandgefährlich).
- **F-247** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Peak-Stromstärke & Entladungsenergie ($kA$)** - Echte Stromstärken von -15 kA bis -180 kA pro Einschlag.
- **F-248** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Akustischer Donner-Entfernungs-Kalkulator** - Zeigt die Schallankunftszeit am Nutzerstandort in Sekunden an.
- **F-249** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Blitzdichte-Heatmap (Strikes pro $km^2$/Jahr)** - Lokalisierung von weltweiten Blitz-Hotspots (z. B. Maracaibo, Viktoriasee).
- **F-250** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Luftfahrt-Notfrequenz 121.500 MHz & 243.000 MHz Monitor** - Notfunkbake-Frequenzen (ELT / EPIRB).
- **F-251** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Maritime Notruffrequenz 156.800 MHz (VHF Kanal 16)** - Internationaler Seefunk-Notrufkanal.
- **F-252** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Kurzwellen-Zeitzeichensender-Tuner (WWV, CHU, BPM, RWM)** - 5.000, 10.000, 15.000 kHz Atomuhr-Referenzsignale.
- **F-253** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **HF-Flugfunk Oceanic ATC Bänder** - Nordatlantik MWARA Funkbänder (Shannon, Gander, New York Radio).
- **F-254** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Zahlensender & Spionage-Funk Frequenz-Katalog** - Bekannte Stationen (The Buzzer UVB-76, Lincolnshire Poacher, E11).
- **F-255** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Amateurfunk Bandplan-Overlay (160m bis 10m)** - CW-, Digital- (FT8/FT4) und SSB-Phonie-Bereiche.
- **F-256** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **FT8 / WSPR Globale Funkwellen-Ausbreitungs-Karte** - Live-Bake-Empfangsberichte zur Erkennung offener Bänder.
- **F-257** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Maximale Nutzbare Frequenz (MUF) & FOT Rechner** - Vorhersage der Funkreichweite basierend auf Sonnenaktivität.
- **F-258** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Sporadic-E (Es) Ausbreitungs-Warner (50 MHz / 144 MHz)** - Plötzliche Überreichweiten im VHF-Bereich durch Ionenwolken.
- **F-259** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Meteor-Scatter & Tropo-Ducting Reflektions-Indikator** - UKW-Reflektion an Sternschnuppen-Ionisationskanälen.
- **F-260** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Volmet Flugwetter-Rundspruch-Frequenzen** - Kontinuierliche METAR-Sprachausstrahlungen auf Kurzwelle.
- **F-261** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Navtex Maritimes Sicherheitsfunk-System (518 kHz)** - Nautische Warnnachrichten und Sturmwarnungen für Schiffe.
- **F-262** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Radiofax / Wetterfax (WEFAX) Bildfunk-Decoder** - Satelliten- und Bodenwetterkarten über Kurzwelle.
- **F-263** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **HF-Goniometer & Peilungs-Schnittlinien (DF)** - Kreuzpeilung zur Lokalisierung von Störsendern und Notsignalen.
- **F-264** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **DSP Rauschfilter & Audio-Bandpass (DNR / Notch)** - Herausfiltern von Trägerpfeifen und atmosphärischem Prasseln.
- **F-265** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Automatische Verstärkungsregelung (AGC Fast / Slow)** - Ausgleich schwankender Signalstärken beim Fading (QSB).
- **F-266** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Brumm- & 50Hz/60Hz Netzfrequenz-Filter** - Beseitigung von Erdschleifen und Netzbrummen im Audiopfad.
- **F-267** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **S-Meter Kalibrierung ($S1$ bis $S9+60dB$)** - Präzise Anzeige der Signalstärke an der Antennenbuchse.
- **F-268** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Audio-Spektrum Peak-Hold & Waterfall-Geschwindigkeits-Regler** - Anpassung der Wasserfall-Laufzeit.
- **F-269** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **SDR-Aufnahme-Funktion (WAV Audio Capture)** - Speichern von Funkaufzeichnungen zur nachträglichen Analyse.
- **F-270** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Morse-Code (CW) Audio-Auto-Decoder** - Automatische Transkription von Morsesignalen in Text im Audio Deck.
- **F-271** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Zero-YouTube Politik** - Alle Audioströme laufen über echte WebSDR-Server, Null externe YouTube-Streams.
- **F-272** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Saubere Audio-Ressourcen-Zerstörung (`destroy()`)** - Verhindert Speicherlecks und weiterlaufenden Sound beim Schließen.

---

## Domäne 9: Neue Taktische Monitore MON-13 bis MON-20 & Modulare Ops Panels (F-273 - F-306)

*Erweiterung des Multi-Monitor-Layouts von 12 auf 20 spezialisierte Lagebildschirme und Ops-Panels.*

- **F-273** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-13: LIVE SEISMIC SPECTROGRAM & TECTONIC INTERCEPTOR** - Vollwertiger Seismik-Monitor mit Spektrogramm-Canvas.
- **F-274** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-13 Live P/S-Wellenphasen-Detektor** - Automatische Markierung der Primär- und Sekundärwellen-Ankunft.
- **F-275** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-13 Tsunami-Kopplungs-Indikator** - Direkte Tsunami-Frühwarnung bei submarinen Beben mit $M \ge 6.5$.
- **F-276** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-14: SPACE WEATHER & SOLAR TELEMETRY GRID** - Röntgenflares, Sonnenwind und Erdmagnetfeld.
- **F-277** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-14 GOES Röntgenfluss-Kurve** - Letzte 6 Stunden Röntgenstrahlung mit Live-Schwellenwert-Alerts.
- **F-278** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-14 Aurora Borealis 30-Minuten Prognose-Display** - Wahrscheinlichkeits-Anzeige für Himmelsbeobachter.
- **F-279** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-15: INTERNET OUTAGES & CYBER DISRUPTION GRID (IODA)** - Makroskopische Ausfälle von BGP, Pings und Darknet-Teleskopen.
- **F-280** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-15 Länder-Disruptions-Graph** - Prozentualer Konnektivitäts-Verlust von Nationen bei Zensur oder Kabelbruch.
- **F-281** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-16: GLOBAL VOLCANO CALDERAS & ERUPTION PLUMES** - Live-Vulkanaktivitäts-Überwachung mit Smithsonian-Daten.
- **F-282** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-16 Vulkan-Aschewolken-Radar** - Höhenverteilung von Aschepartikeln im Luftraum.
- **F-283** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-17: DEEP-SEA TSUNAMI & OCEAN BUOYS (NOAA DART)** - Meeressäulen-Drucksensoren und Tsunami-Pegel.
- **F-284** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-17 Ozeanische Wellenspektren-Anzeige** - Dünungshöhen und Perioden über die Weltmeere.
- **F-285** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-18: PLANETARY DEFENSE & ASTEROID CLOSE APPROACH** - CNEOS Asteroiden-Vorbeiflüge mit Distanz und Relativgeschwindigkeit.
- **F-286** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-18 Impakt-Wahrscheinlichkeits-Tabelle** - Torino- und Palermo-Skalen für erdnahe Objekte.
- **F-287** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-19: ENVIRONMENTAL RADIATION & BIO-HAZARD (SAFECAST / EURDEP)** - 4.800+ Geigerzähler und Gamma-Sonden.
- **F-288** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-19 Nuklearanlagen-Umkreis-Dosisleistungs-Monitor** - Radioaktivitäts-Werte rund um Kernkraftwerke.
- **F-290** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MON-20: TACTICAL SIGINT & RADIO SPECTRUM DECK** - Globale KiwiSDR Audio-Abhöre und Spektrum-Wasserfall.
- **F-291** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Modulares Drag-and-Drop Monitor-Grid** - Freies Verschieben, Vergrößern und Minimieren aller Monitore.
- **F-292** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Kompakter Multi-Screen Modus (Dual- / Quad-View)** - Vorkonfigurierte Splitscreen-Layouts für 2, 4 oder 8 Bildschirme.
- **F-293** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Detached Window Pop-Out Funktion** - Jeder Monitor kann als separates randloses Browserfenster ausgelagert werden.
- **F-294** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Schnell-Layout-Reset Button (`#btn-reset-monitors-header`)** - Stellt das optimale 50/50 Layout für MON-01 & MON-02 sofort wieder her.
- **F-295** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Globale Audio-Mute / Stummschaltungs-Taste** - Schaltet alle aktiven Sirenen, Funkströme und Alarme mit einem Klick stumm.
- **F-296** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Live-Polling Frequenz-Wahlschalter (1m bis 20m)** - Anpassung der Aktualisierungsrate für Unwetter, Radar und Sensoren.
- **F-297** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Countdown-Ticker im Header** - Zeigt die verbleibenden Sekunden bis zum nächsten automatischen Datenabruf.
- **F-298** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Hardware RAM & VRAM Cleaner Widget** - Bereinigt ungenutzte Texturspeicher und Canvas-Buffer im Browser.
- **F-299** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **100+ FPS Hardware-Performance-Monitor** - Zeigt die tatsächliche Render-Framerate der WebGL- und Canvas-Pipelines.
- **F-300** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Taktischer Nachtsicht- / HUD-Rotlicht-Modus** - Schont die Dunkeladaption der Augen bei Nachteinsätzen.
- **F-301** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Cyberpunk Amber / Phosphor-Grün Farbschemata** - Anpassbare Retro-Taktik-Farbwelten.
- **F-302** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Vollbild-Kiosk-Modus (F11 / Button)** - Blendet alle Browserleisten für echte Lagezentren aus.
- **F-303** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Responsive Mobil-Optimierung** - Saubere Touch-Bedienung auf Smartphones und Tablets ohne abgeschnittene Buttons.
- **F-304** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Zero-Console-Error Garantie** - Keine unbehandelten Promise-Rejections oder fehlende DOM-Elemente in der Konsole.
- **F-305** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Akustische Alarm-Gongs für P1-Krisen** - Dezenter taktischer Warnton bei bestätigten Tornados oder Tsunami-Alarmen.
- **F-306** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Integrierte Offline-Resilienz** - Automatischer Fallback auf gecachte Daten bei vorübergehendem Verbindungsabbruch.

---

## Domäne 10: OSINT Field Workbench, Taktische Rechner, Decoder & GIS Exporter (F-307 - F-340)

*Das ausfahrbare Taktik-Drawer-Panel (`#osint-tools-drawer`) mit Werkzeugen für Recherche, Geolokalisierung und Datenexport.*

- **F-307** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Sofortiger Klick-Fix für `#btn-toggle-osint-tools`** - 100% Klickbarkeit ohne Blockade durch `.hidden { display: none !important; }`.
- **F-308** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Sonnenstands- & Schatten-Rechner (SunCalc)** - Berechnet Sonnenazimut, Elevation und Schattenlänge für Datum/Uhrzeit.
- **F-309** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Objekthöhen-Schätzer via Schattenlänge** - Berechnet Gebäude- und Antennenhöhen aus Schattenwürfen auf Satellitenbildern.
- **F-310** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Foto-Aufnahmezeit-Finder (Inverse Shadow Matching)** - Bestimmt das genaue Zeitfenster eines Fotos anhand von Schattenrichtung und Ort.
- **F-311** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Goldene Stunde & Blaue Stunde Rechner** - Berechnet astronomische, nautische und bürgerliche Dämmerungszeiten.
- **F-312** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Koordinaten-Multi-Konverter: Dezimalgrad (DD)** - Umrechnung von/zu `50.1109, 8.6821`.
- **F-313** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Koordinaten-Multi-Konverter: Grad Minuten Sekunden (DMS)** - Umrechnung von/zu `50° 06' 39" N, 08° 40' 55" E`.
- **F-314** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Koordinaten-Multi-Konverter: Military Grid Reference System (MGRS)** - Umrechnung von/zu `32U MA 77284 51025`.
- **F-315** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Koordinaten-Multi-Konverter: Universal Transverse Mercator (UTM)** - Zone, Ostwert und Nordwert.
- **F-316** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Koordinaten-Multi-Konverter: Maidenhead QTH-Locator** - Für Funkamateure (z. B. `JO40ec`).
- **F-317** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Aviation METAR Rohstring-Decoder** - Entschlüsselt Windvektoren, Sichtweite, Wolkenuntergrenzen und Luftdruck.
- **F-318** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Terminal Aerodrome Forecast (TAF) Prognose-Decoder** - Schlüsselt Flugplatz-Wettervorhersagen mit TEMPO- und BECMG-Gruppen auf.
- **F-319** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Distanz- & Großkreis-Peilung (Orthodrome)** - Berechnet exakte Distanz in km, nautischen Meilen und Meilen sowie Vorwärts-Azimut.
- **F-320** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Rhumb Line (Loxodrome) Rechner** - Berechnet konstanten Steuerkurs zwischen zwei Punkten für Navigation.
- **F-321** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **GeoJSON Layer-Exporter** - Exportiert aktive Seekabel, Bojen, Erdbeben, Strahlung oder Vulkane als Standard-GeoJSON.
- **F-322** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Google Earth KML / KMZ Exporter** - Erzeugt KML-Dateien mit 3D-Pins und Beschreibungs-Popups für Google Earth Pro.
- **F-323** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Tabellarischer CSV / Excel Exporter** - Exportiert Sensormesswerte inklusive Zeitstempeln und Koordinaten.
- **F-324** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **IP-Adresse zu Geolocation & ASN Lookup Tool** - Löst IP-Adressen in Rechenzentren, ISP, ASN und Geokoordinaten auf.
- **F-325** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Tor Exit Node Schnell-Prüfung** - Prüft in Echtzeit, ob eine IP ein aktiver Tor-Exit-Knoten ist.
- **F-326** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Flugnummer / ICAO Callsign Decoder** - Ermittelt Airline, Flugzeugtyp und Flugroute aus dem Callsign.
- **F-327** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **MMSI Maritime Mobile Service Identity Decoder** - Ermittelt Flaggenstaat, Schiffstyp und Küstenfunkstelle aus der MMSI.
- **F-328** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **NATO Buchstabier-Alphabet Audio- & Text-Generator** - Alpha, Bravo, Charlie Konverter für Funkmeldungen.
- **F-329** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Zeitzonen- & UTC-Offset Konverter** - Rechnet jede Ortszeit sofort in koordinierte Weltzeit (UTC/Zulu) um.
- **F-330** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Radar-Horizont & Sichtweiten-Rechner** - Berechnet geometrischen und Radar-Horizont basierend auf Antennenhöhe.
- **F-331** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Schallgeschwindigkeits- & Temperatur-Kompensator** - Berechnet exakte Schallgeschwindigkeit in Luft ($m/s$) bei gegebener Temperatur.
- **F-332** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Barometrische Höhenformel-Rechner** - Bestimmt die Höhe über Normalnull aus Luftdruck und Temperatur.
- **F-333** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Magnetische Missweisung (Deklination) Rechner** - Lokale Abweichung zwischen geographischem und magnetischem Nordpol.
- **F-334** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **EXIF Geo-Metadaten Extrahierer** - Liest GPS-Koordinaten, Aufnahmedatum und Kameramodell aus hochgeladenen Fotos.
- **F-335** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **URL & Payload Base64 / Hex / URL-Encode Decoder** - Schnelles Dekodieren von OSINT-Links und Parametern.
- **F-336** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Hash-Generator (MD5, SHA-1, SHA-256)** - Erzeugt kryptographische Prüfsummen für Beweissicherung.
- **F-337** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Markdown Lagebericht Notizblock** - Integrierter Notizblock im Drawer mit Schnellspeicherung im Browser-Cache.
- **F-338** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Karten-Screenshot & Lagebild-Schnappschuss** - Speichert die aktuelle Kartenansicht mit allen Pins als hochauflösendes PNG.
- **F-339** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Ecosystem-Synchronisations-Statusanzeige** - Zeigt Git-Commit, Cloudflare Edge-Version und Sync-Status.
- **F-340** `[WEB]` `[PRIVAT]` `[DESKTOP]` `[APK]`: **Master-Release Zertifikat v2.3.0** - Offizielle Bestätigung aller 340 implementierten Funktionen über alle Plattformen.

---

## 8. Strikte Richtlinien für die Umsetzung

1. **Keine nutzlosen theoretischen Python-Algorithmen**: Keine schweren, blockierenden Python-Mathematik-Skripte im Backend. Alles läuft als schlanke, blitzschnelle Keyless-Endpunkte oder direkt clientseitig über performantes Canvas/WebGL.
2. **100% Zero-Fake Policy**: Nur echte Sensoren, verifizierte Messpunkte, echte Satellitenbilder und reale Erdbeben-/Wetterstationen.
3. **Multi-Plattform Parität**: Jedes Feature wird für alle fünf Auslieferungsziele optimiert:
   - `omniscope-web` (Cloudflare Pages / Workers)
   - `omniscope-osint` (Self-Host Localhost Edition auf GitHub finnytech/omniscope-osint mit lokaler SQLite 3 DB, `start.bat` & `run_server.py`)
   - `omniscope-privat` (Origin Tactical Command Center)
   - `omniscope-desktop-neu` (Neutralinojs WebView2 Windows x64)
   - `omniscope-apk` (Android Standalone APK)
