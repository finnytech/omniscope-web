# OmniScope OSINT & Web v2.1.0 Roadmap: 170 Neue Keyless Provider, Nodes, Panels & Tools

> **Version:** v2.1.0 Next-Gen Tactical Expansion  
> **Ecosystem:** OmniScope OSINT (Self-Hosted Python/FastAPI Localhost Core), OmniScope Web (Serverless Cloudflare Pages & Workers), Desktop EXE & Android APK  
> **Strikte Qualitäts-Direktive:** 100% Zero-Fake Policy, ausschließlich verifizierte echte Keyless Open Data APIs, KEINE nutzlosen Backend-Algorithmen oder theoretischer Mathe-Füllstoff.  
> **Fokus:** Echte nutzbringende Features — 10 neue taktische Domänen, 8 neue Haupt-Monitore (MON-13 bis MON-20), über 40 neue Keyless Provider & Datenquellen, interaktive Geo-Tools, Dekoder und Export-Funktionen.  
> **Verteilung:** Über 120 Features speziell optimiert für die browserbasierte `[WEB-EDITION]`, alle 170 Features nativ im `[OSINT-CORE]` und in den kompilierten `[EXE/APK]` Builds.

---

## 🧭 Übersicht der 10 Neuen Taktischen Domänen (170 Features Total)

```
┌────────────────────────────────────────────────────────────────────────┐
│             OMNISCOPE v2.1.0 MASTER ARCHITECTURE (170 NEUE FEATURES)   │
│                                                                        │
│  [D1]  Global Cyber & Internet Outages Grid (F-001 - F-017)            │
│  [D2]  Disasters, Multi-Hazard & Humanitarian Crisis (F-018 - F-034)   │
│  [D3]  Planetary Defense, Asteroids & Space Hazards (F-035 - F-051)    │
│  [D4]  Environmental Radiation & Bio-Hazard Sensors (F-052 - F-068)    │
│  [D5]  Aviation Infrastructure, Airports & NOTAMs (F-069 - F-085)      │
│  [D6]  Maritime AIS Expansion & Ocean Buoy Grid (F-086 - F-102)        │
│  [D7]  RF Spectrum, Shortwave WebSDR & SIGINT (F-103 - F-119)          │
│  [D8]  International Borders, Energy & Critical Infra (F-120 - F-136)   │
│  [D9]  Neue Taktische UI Panels MON-13 bis MON-20 (F-137 - F-153)      │
│  [D10] OSINT Field Tools, Decoders & Calculators (F-154 - F-170)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Domain 1: Global Cyber & Internet Infrastructure Outage Grid (F-001 - F-017)

*Echte weltweite Überwachung von Internet-Ausfällen, Unterseekabeln, BGP-Routen, DNS-Wurzelservern und Tor-Relays ohne API-Keys.*

- **F-001** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **IODA Global Internet Outage Monitor** (`api.ioda.inetintel.cc.gatech.edu/v2/outages/summary`) - 100% keyless Echtzeit-Erkennung von weltweiten makroskopischen Netzausfällen, Telekom-Störungen und zensurbedingten Shutdowns auf Länderebene.
- **F-002** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **IODA Country Disruption Inspector** (`/v2/signals/raw/country/{code}`) - Korreliert 3 unabhängige Messsignale: BGP-Routing-Rückzüge, aktive Edge-Ping-Erreichbarkeit und Darknet-Teleskop-Hintergrundstrahlung.
- **F-003** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Interaktive Submarine Cable Network Layer** - Vollständige Vektorkarte von 550+ globalen Untersee-Glasfaserkabeln inklusive Trassenverlauf, Kabellänge in Kilometern, Landestationen und Betreiberkonsortien.
- **F-004** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Subsea Cable Chokepoint & Vulnerability Analyzer** - Analysiert strategische Nadelöhre der Weltkommunikation (Rotes Meer / Bab-el-Mandeb, Straße von Malakka, Luzon-Straße, Ärmelkanal, Straße von Gibraltar) mit Single-Point-of-Failure-Warnstufe.
- **F-005** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Tor Network Consensus Scanner via Onionoo API** (`onionoo.torproject.org/details`) - Keyless Mapping von 7.500+ weltweiten Tor-Relays (Guard-, Middle- und Exit-Nodes) mit IP-Adresse, Nickname, Bandbreite und Länderstandort.
- **F-006** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Tor Exit Node Schnell-Prüfung** - Direktes Suchfeld zur Prüfung, ob eine verdächtige IP-Adresse ein aktiver Tor-Exit-Node ist, inklusive Bandbreiten-Verlauf und Uptime.
- **F-007** `[OSINT]` `[WEB-EDITION]`: **RIPE Stat BGP Routing History & Hijack Alert** (`stat.ripe.net/data/routing-status/data.json`) - Keylose Abfrage des autonomen Systemstatus (AS), Sichtbarkeitsrate und automatischer Alarm bei unautorisierten BGP-Prefix-Hijack-Verdachtsfällen.
- **F-008** `[OSINT]` `[WEB-EDITION]`: **BGPView ASN & IXP Interconnect Explorer** (`api.bgpview.io/asn/{asn}`) - Visualisiert Upstream-Transit-Carrier, Downstream-Kunden und Internet-Knotenpunkte (IXPs wie DE-CIX, AMS-IX, LINX).
- **F-009** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Cloudflare Radar Public Outage Feed Integration** - Automatischer Live-Ticker für großflächige Stromausfälle, Kabelbrüche und behördliche Netzsperren weltweit.
- **F-010** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Global DNS Root Server Latency Map** (`stat.ripe.net/data/dns-root-telemetry/data.json`) - Live-Antwortzeiten und Query-Health aller 13 weltweiten DNS-Wurzelserver-Cluster (A bis M).
- **F-011** `[WEB-EDITION]` `[OSINT]`: **Autonomous System (ASN) Geo-Mapper** - Löst jede IP, Domain oder ASN sofort in physische Rechenzentren und geografische Serverstandorte auf.
- **F-012** `[WEB-EDITION]` `[OSINT]`: **Fiber Cut Impact Simulator** - Interaktives Simulationstool: Klick auf ein beliebiges Seekabel zeigt sofort, welche Länder Datenverkehr umleiten müssen und wie stark Latenzen steigen.
- **F-013** `[WEB-EDITION]` `[OSINT]`: **Satelliten-Internet Downlink Gateway Karte** - Geokodierte Bodenstationen für Starlink, OneWeb und O3b mPOWER mit Uplink-Frequenzbändern.
- **F-014** `[OSINT]` `[EXE/APK]`: **Lokales Egress-Netzwerk Diagnose-Tool** - Prüft Hops, Traceroute-Latenz und ISP-Jitter des Nutzers gegen globale OSINT-Endpunkte.
- **F-015** `[WEB-EDITION]` `[OSINT]`: **Taktischer Cyber-Ausfall Top-Banner** - Blinkende Alarmleiste im Header, sobald ein Staat mehr als 30% seiner makroskopischen Internet-Konnektivität verliert.
- **F-016** `[WEB-EDITION]` `[OSINT]`: **BGP Prefix Announcement Live-Ticker** - Echtzeit-Strom neuer Routenankündigungen und Routenflatter-Ereignisse (BGP Flapping).
- **F-017** `[WEB-EDITION]` `[OSINT]`: **Telekom-Krisenbericht Lagebericht-Generator** - Erzeugt mit einem Klick einen vollständigen technischen Lagebericht (Markdown/JSON) bei Netzausfällen für Analysten und Notdienste.

---

## Domain 2: Global Disasters, Multi-Hazard Alerts & Humanitarian Crisis Grid (F-018 - F-034)

*Echte Notfallüberwachung, UN-Disaster-Meldungen, Flusspegel, Tsunami-Frühwarnung und Vulkanausbrüche.*

- **F-018** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **GDACS Multi-Hazard Echtzeit-Feed** (`gdacs.org/gdacsapi/api/events/geteventlist/SEARCH`) - Einheitlicher Krisenstream der UN & Europäischen Kommission für Erdbeben, Wirbelstürme, Überschwemmungen, Vulkane und Dürren ohne API-Key.
- **F-019** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **GDACS Severity Farb-Triage System** - Standardisierte Alarmstufen: Rot (Großkatastrophe mit internationalem Hilfebedarf), Orange (Ernste Lage mit regionalen Schäden), Grün (Beobachtung/Advisory).
- **F-020** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Tropensturm Vorhersage-Kegel & Windvektoren** - Live-Zugbahnprognose, Windgeschwindigkeits-Radien (34kt, 50kt, 64kt Hurrikan-Stärke), Kerndruck in Millibar und Sturmfluthöhe.
- **F-021** `[WEB-EDITION]` `[OSINT]`: **UN OCHA ReliefWeb Krisenlageberichte** (`api.reliefweb.int/v2/disasters`) - Direkter keyloser Zugriff auf offizielle UN-Lageberichte, Hilfsappelle, Notstandsdekrete und Flüchtlingszahlen.
- **F-022** `[WEB-EDITION]` `[OSINT]`: **ReliefWeb Länder-Krisenprofil Viewer** (`api.reliefweb.int/v2/countries`) - Aktive humanitäre Krisen, Ernährungsnotstandsstufen und zuständige Hilfsorganisationen pro Nation.
- **F-023** `[WEB-EDITION]` `[OSINT]`: **USGS Water Services Live-Flusspegel** (`waterservices.usgs.gov/nwis/iv/?format=json`) - Keyless Daten von 10.000+ Pegelstationen mit aktuellem Wasserstand, Durchflussmenge (cfs) und Hochwasser-Schwellen.
- **F-024** `[WEB-EDITION]` `[OSINT]`: **Sturzflut & Dammbruch Frühwarn-Indikator** - Automatischer Alarm, sobald Flusspegel die Stufe "Major Flood" überschreiten oder schneller als 50 cm pro Stunde steigen.
- **F-025** `[WEB-EDITION]` `[OSINT]`: **Globaler Vulkan-Aktivitäts-Tracker** (Smithsonian Global Volcanism Program / GDACS) - Eruptionsstatus, Luftfahrt-Farbcodes (Rot/Orange/Gelb/Grün) und Aschewolken-Flughöhen (FL200, FL350+).
- **F-026** `[WEB-EDITION]` `[OSINT]`: **Tsunami Ausbreitungs-Zeitzonenkarte** (NOAA PTWC / GDACS) - Tiefsee-Tsunami-Laufzeitkonturen (1-Stunden-Isochronen) und Messwerte von Küsten-Pegelsensoren.
- **F-027** `[WEB-EDITION]` `[OSINT]`: **Copernicus EMS Satelliten-Notfall-Aktivierungen** - Geokodierte Satelliten-Schadenskarten bei Überschwemmungen, Erdbeben-Zerstörungszonen und Erdrutschen.
- **F-028** `[WEB-EDITION]` `[OSINT]`: **Betroffene Bevölkerungs-Kalkulator** - Schätzt in Echtzeit die betroffene Wohnbevölkerung im 25km-, 50km- und 100km-Radius um jedes Katastrophenzentrum.
- **F-029** `[WEB-EDITION]` `[OSINT]`: **Dürre- & Agrar-Krisen-Index** - Satellitengestützte Bodenfeuchte-Anomalien und Vegetations-Gesundheits-Index (VHI) zur Früherkennung von Ernteausfällen.
- **F-030** `[WEB-EDITION]` `[OSINT]`: **Humanitäre Logistik-Drehkreuze & Hilfskorridore** - Bereitschaftsstatus von Flughäfen, Seehäfen und Grenzübergängen während internationaler Hilfsoperationen.
- **F-031** `[WEB-EDITION]` `[OSINT]`: **Erdrutsch-Gefahrenkarte & Starkregen-Trigger** - Korreliert Steilhang-Topografie mit Niederschlagsmengen zur Identifikation akuter Murenabgangs-Risikogebiete.
- **F-032** `[WEB-EDITION]` `[OSINT]`: **Katastrophen-Zeitraffer-Replay** - 30-Tage-Scrubber auf der Weltkarte zur lückenlosen Rekonstruktion historischer Naturereignisse.
- **F-033** `[WEB-EDITION]` `[OSINT]`: **GDACS Detail-Lage-Modal** - Öffnet ein vollformatiges Lagefenster mit Opferzahlen, Infrastrukturschäden, betroffenen Krankenhäusern und UN-Meldungen.
- **F-034** `[WEB-EDITION]` `[OSINT]`: **Floating Crisis Ticker** - Frei schwebendes Dashboard-Widget für aktive weltweite Rote und Orange Alarme mit Kamera-Direktsprung.

---

## Domain 3: Planetary Defense, Asteroids, Solar Hazards & Space Intelligence (F-035 - F-051)

*Asteroiden-Frühwarnung, Weltraumschrott, Sonnenstürme, Polarlichter und Satellitenbahnen.*

- **F-035** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **NASA JPL SSD Asteroid Close Approach CAD API** (`ssd-api.jpl.nasa.gov/cad.api`) - 100% keyless Überwachung aller erdnahen Asteroiden und Kometen auf Annäherungskurs.
- **F-036** `[WEB-EDITION]` `[OSINT]`: **Asteroiden-Annäherungs-Radar** - Interaktives 30-Tage-Radar mit Distanz in Monddistanzen (LD) und AU, Relativgeschwindigkeit in km/s und geschätztem Durchmesser in Metern.
- **F-037** `[WEB-EDITION]` `[OSINT]`: **Torino- / Palermo-Gefahrenskala & PHA-Filter** - Ein-Klick-Filter zur Isolierung potenziell gefährlicher Asteroiden (Potentially Hazardous Asteroids - PHAs) mit Einschlagswahrscheinlichkeiten.
- **F-038** `[WEB-EDITION]` `[OSINT]`: **CelesTrak Active Satellite Fleet GP JSON API** (`celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json-pretty`) - Keyless Bahndaten von 8.000+ aktiven Satelliten in LEO, MEO und GEO.
- **F-039** `[WEB-EDITION]` `[OSINT]`: **Raumstationen Live-Orbit-Vektor** (`celestrak.org/...GROUP=stations&FORMAT=json-pretty`) - Live-Position, Bodenspur, Bahngeschwindigkeit (27.600 km/h) und Flughöhe für ISS und Tiangong.
- **F-040** `[WEB-EDITION]` `[OSINT]`: **Starlink Megakonstellations-Dichte-Heatmap** - Visualisiert Orbitalebenen, Hüllendichte und neu gestartete Starlink-Satellitenzüge.
- **F-041** `[WEB-EDITION]` `[OSINT]`: **Weltraumschrott- & Trümmerfeld-Tracker** (`GROUP=cosmos-1408-debris` / `GROUP=fengyun-1c-debris`) - Trümmerwolken vergangener Anti-Satelliten-Waffentests mit Kollisionswarnzone.
- **F-042** `[WEB-EDITION]` `[OSINT]`: **NOAA SWPC Solar Flare Röntgenfluss-Echtzeit-Feed** (`services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json`) - GOES-Röntgensensoren zur Erfassung von C-, M- und extremen X-Klasse Sonneneruptionen.
- **F-043** `[WEB-EDITION]` `[OSINT]`: **Koronaler Massenauswurf (CME) Stoßwellen-Uhr** - Berechnet die geschätzte Ankunftszeit (ETA) der Sonnenplasma-Schockwelle am Erdmagnetfeld.
- **F-044** `[WEB-EDITION]` `[OSINT]`: **Aurora Borealis / Australis OVATION 30-Minuten Vorhersage** - Wahrscheinlichkeitskonturen (0-100%) für sichtbare Polarlichter in Nordamerika und Europa.
- **F-045** `[WEB-EDITION]` `[OSINT]`: **Kurzwellen-Radio-Blackout & Satelliten-Bremsungs-Schätzer** - Berechnung der D-Schicht-Dämpfung und thermischen Aufblähung der oberen Atmosphäre nach Sonnenstürmen.
- **F-046** `[WEB-EDITION]` `[OSINT]`: **Solar Dynamics Observatory (SDO) Live-Koronagrafen-Bilder** - Extrem-Ultraviolett-Aufnahmen der Sonne (AIA 193 Å, 304 Å, 171 Å), alle 15 Minuten frisch.
- **F-047** `[WEB-EDITION]` `[OSINT]`: **Geomagnetischer Kp-Index 3-Tage-Barometer** - NOAA SWPC Balkendiagramm zur Überwachung geomagnetischer Stürme von G1 (schwach) bis G5 (extrem).
- **F-048** `[WEB-EDITION]` `[OSINT]`: **Satelliten-Überflug-Rechner** - Berechnet nächste sichtbare Überflüge, Eintrittswinkel und Himmelsrichtung über den Standort des Nutzers.
- **F-049** `[WEB-EDITION]` `[OSINT]`: **Satelliten-Flare & Solar-Reflexions-Warner** - Berechnet exakte Zeitfenster, in denen Solarpaneele helle Lichtblitze am Nachthimmel erzeugen.
- **F-050** `[WEB-EDITION]` `[OSINT]`: **Wiedereintritts- & Orbit-Verfall-Prognose** - Verfolgt ausgediente Raketenoberstufen und abstürzende Satelliten mit geschätztem Absturz-Zeitfenster.
- **F-051** `[WEB-EDITION]` `[OSINT]`: **Planetary Defense Missions-Kontroll-Panel** - Integrierter Lagebildschirm für Weltraumwetter, Asteroiden-Passagen und Satelliten-Flugbahnen.

---

## Domain 4: Environmental Radiation, Air Quality & Bio-Hazard Grid (F-052 - F-068)

*Radioaktivitäts-Überwachung, nukleare Sicherheitszonen, Luftschadstoffe und Waldbrand-Rauch.*

- **F-052** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Safecast Open Radiation API Integration** (`api.safecast.org`) - Weltweites Bürgernetzwerk für Radioaktivitätsmessungen in Mikrosievert pro Stunde (µSv/h) und CPM ohne API-Key.
- **F-053** `[WEB-EDITION]` `[OSINT]`: **Kernkraftwerks-Abstandsringe & Strahlungs-Referenzwert-Monitor** - Vergleicht aktuelle Messwerte mit historischen Normalwerten in 10km-, 25km- und 50km-Zonen um 440+ Atomkraftwerke weltweit.
- **F-054** `[WEB-EDITION]` `[OSINT]`: **Staatliche Frühwarn-Messnetze (EPA RadNet & EURDEP)** - Amtliche Gammadosisleistungs-Messdaten europäischer und amerikanischer Strahlenschutzbehörden.
- **F-055** `[WEB-EDITION]` `[OSINT]`: **Radioaktivitäts-Grenzwert-Alarm** - Optischer und akustischer Sofortalarm, sobald eine Messstation > 0,30 µSv/h anzeigt (erhöhte Strahlung über Normalpegel).
- **F-056** `[WEB-EDITION]` `[OSINT]`: **OpenAQ Global Air Quality API v3 Integration** - Keyless Zugriff auf 30.000+ amtliche Luftgütemessstationen in über 150 Ländern.
- **F-057** `[WEB-EDITION]` `[OSINT]`: **Feinstaub-Konzentrations-Heatmap (PM2.5 & PM10)** - Farbcodierter Luftqualitätsindex (AQI) nach EPA- und WHO-Gesundheitsstandards.
- **F-058** `[WEB-EDITION]` `[OSINT]`: **Industrielle Schadgas-Sensorik** - Echtzeitwerte für Stickstoffdioxid (NO2), bodennahes Ozon (O3), Schwefeldioxid (SO2) und Kohlenmonoxid (CO).
- **F-059** `[WEB-EDITION]` `[OSINT]`: **Copernicus CAMS Waldbrand-Rauchfahnen-Prognose** - 72-Stunden-Vorhersagemodell für die Ausbreitung von Ruß- und Feinstaubpartikeln.
- **F-060** `[WEB-EDITION]` `[OSINT]`: **EFFIS Aktive Brandherde & Brandleistungs-Detektor** - Satellitenerfasste Brandherde mit Fire Radiative Power (MW) und verbrannter Hektarfläche.
- **F-061** `[WEB-EDITION]` `[OSINT]`: **Waldbrand-Gefahrenindex (FWI)** - Kartiert Feuchtigkeitswerte feiner Brennstoffe und akute Brandgefahrstufen von Gering bis Extrem.
- **F-062** `[WEB-EDITION]` `[OSINT]`: **Sahara-Staub- & Sandsturm-Verfolgung** - Aerosol-Optische-Tiefe (AOD) Vektoren zur Verfolgung transkontinentaler Staubwolken.
- **F-063** `[WEB-EDITION]` `[OSINT]`: **Pollenflug- & Bio-Allergen-Gitter** - Vorhersage der Belastung durch Gräser-, Birken- und Ambrosiapollen für biologische Umweltlagebilder.
- **F-064** `[WEB-EDITION]` `[OSINT]`: **Chemiepark- & Gefahrgut-Sicherheitsradien** - Zeichnet 5km-, 10km- und 25km-Evakuierungsradien um Industriechemieanlagen und Tanklager.
- **F-065** `[WEB-EDITION]` `[OSINT]`: **Gaußsches Rauchfahnen-Ausbreitungsmodell** - Simuliert die windabhängige Ausbreitungsrichtung toxischer Gaswolken basierend auf Echtzeit-GFS-Winddaten.
- **F-066** `[WEB-EDITION]` `[OSINT]`: **24-Stunden Luftqualitäts-Trenddiagramm** - Tagesverlaufskurve für Feinstaub-Peaks, Berufsverkehrsspitzen und Inversionswetterlagen.
- **F-067** `[WEB-EDITION]` `[OSINT]`: **Taktischer Geigerzähler-Soundeffekt** - Akustische Simulation: Klick-Frequenz steigt dynamisch mit der gemessenen Strahlendosis der gewählten Station.
- **F-068** `[WEB-EDITION]` `[OSINT]`: **Umwelt-Lage-Widget** - Kompakter Lagebalken im Dashboard mit Strahlungs-, Luftqualitäts- und Brandrisiko-Score des Kartenausschnitts.

---

## Domain 5: Aviation Infrastructure, Airport Status & NOTAM Flight Hazards (F-069 - F-085)

*Flugsicherung, Flugplatz-Stopps, METAR-Klartextdekoder, Militärflug-Filter und Notfall-Squawks.*

- **F-069** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **FAA NAS Airport Status API Integration** (`nasstatus.faa.gov/api/airport-status-information`) - Live-Erfassung von Ground Stops, Ground Delays und Startbahn-Verzögerungen an Großflughäfen ohne API-Key.
- **F-070** `[WEB-EDITION]` `[OSINT]`: **Flughafen-Status & Bahnensperrungen auf der Karte** - Optische Status-Marker für weltweite Drehkreuze (JFK, ORD, ATL, LAX, LHR, FRA, CDG, HND, DXB).
- **F-071** `[WEB-EDITION]` `[OSINT]`: **AWC METAR/TAF Klartext-Dekoder** (`aviationweather.gov/api/data/metar`) - Übersetzt kryptische ICAO-Wetterberichte auf Knopfdruck in verständliche Sprache.
- **F-072** `[WEB-EDITION]` `[OSINT]`: **Flugwetter-Kategorie-Tagging** (VFR = Grün, MVFR = Blau, IFR = Rot, LIFR = Magenta) für über 4.000 weltweite Flugplätze.
- **F-073** `[WEB-EDITION]` `[OSINT]`: **Seitenwind- & Gegenwind-Komponenten-Rechner** - Berechnet automatisch die exakte Gegen- und Seitenwindkomponente aller Pisten anhand des aktuellen METAR-Windvektors.
- **F-074** `[WEB-EDITION]` `[OSINT]`: **SIGMET & AIRMET Gefahrenzonen** - Live-Polygone für schwere Gewitterzonen, schwere Vereisung, Clear-Air-Turbulenzen und Gebirgswellen.
- **F-075** `[WEB-EDITION]` `[OSINT]`: **Vulkanasche-Sperrgebiete (VAAC)** - Kartiert gesperrte Lufträume und Flugflächen-Limits bei Vulkanausbrüchen.
- **F-076** `[WEB-EDITION]` `[OSINT]`: **Airplanes.live Militärflugzeug-Isolierer** (`api.airplanes.live/v2/mil`) - Keyless Ein-Klick-Filter für Tankflugzeuge, Aufklärungsmaschinen (AWACS, RC-135) und strategische Transporter.
- **F-077** `[WEB-EDITION]` `[OSINT]`: **Notfall-Transpondercode Sofortalarm** - Optische und akustische Warnung bei Squawk 7700 (General Emergency), 7600 (Funkausfall) oder 7500 (Entführung).
- **F-078** `[WEB-EDITION]` `[OSINT]`: **Live Tower- & Flugfunk-Stream-Verzeichnis** - Verlinkte, frei zugängliche Live-ATC-Audiostreams bedeutender Verkehrsflughäfen.
- **F-079** `[WEB-EDITION]` `[OSINT]`: **Flugzeug-Steig-/Sinkraten & Höhenprofil** - Anzeige der Vertikalgeschwindigkeit in Fuß/Minute, wahrer Eigengeschwindigkeit und barometrischer Höhe.
- **F-080** `[WEB-EDITION]` `[OSINT]`: **Fehlanflug- & Durchstart-Erkenner** - Markiert automatisch Flugzeuge, die ihren Landeanflug unter 1.000 Fuß abbrechen und steil durchstarten.
- **F-081** `[WEB-EDITION]` `[OSINT]`: **Flugbeschränkungsgebiete (TFR & VIP Airspace)** - Luftraumsperrzonen bei Staatsbesuchen, Raketenstarts und Großveranstaltungen.
- **F-082** `[WEB-EDITION]` `[OSINT]`: **Großkreis-Flugdistanz- & Flugzeitrechner** - Berechnet nautische Meilen, Kompasskurs und geschätzte Flugdauer zwischen beliebigen ICAO-Flughäfen.
- **F-083** `[WEB-EDITION]` `[OSINT]`: **Drohnen-Flugverbotszonen (UAS Geofencing)** - Markiert die 5-Meilen-Schutzzone um Flugplätze, in der ziviler Drohnenbetrieb untersagt ist.
- **F-084** `[WEB-EDITION]` `[OSINT]`: **Flughafen-Verspätungs-Rangliste** - Zeigt die 10 am stärksten verspäteten internationalen Drehkreuze geordnet nach Wartezeit.
- **F-085** `[WEB-EDITION]` `[OSINT]`: **Flugbetriebs-Lagepanel** - Eigener Dashboard-Monitor für Flugbeschränkungen, Wetterminima und Luftraum-Engpässe.

---

## Domain 6: Maritime AIS Expansion, Ocean Buoys & Hydrographic Grid (F-086 - F-102)

*Schiffsverkehr, Ostsee-AIS, Tiefseebojen, Monsterwellen-Alarm und Meerengen-Zähler.*

- **F-086** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Digitraffic Finland Maritime Open AIS Feed** (`meri.digitraffic.fi/api/ais/v1/locations`) - 100% keyless Echtzeit-Schiffstracking in der Ostsee und im Finnischen Meerbusen.
- **F-087** `[WEB-EDITION]` `[OSINT]`: **Schiffstyp-Farbkodierung** - Frachter (Orange), Tanker (Rot), Passagierschiff/Fähre (Blau), Militär/Patrouille (Gelb), Fischerei (Grün), Schlepper/Spezial (Lila).
- **F-088** `[WEB-EDITION]` `[OSINT]`: **30-Minuten Kurs- & Geschwindigkeits-Vektor** - Vorausberechnete Positionspfeile basierend auf Speed Over Ground (SOG) und Course Over Ground (COG).
- **F-089** `[WEB-EDITION]` `[OSINT]`: **NOAA NDBC Hochsee-Messbojen-Netz** (`ndbc.noaa.gov/data/realtime2/`) - 1.000+ ozeanische Bojen mit Wellenhöhe, Wellenperiode, Wassertemperatur und Luftdruck.
- **F-090** `[WEB-EDITION]` `[OSINT]`: **Monsterwellen- & Schwerwetter-Warnsystem** - Automatischer Alarm, sobald eine Boje signifikante Wellenhöhen > 6,0 Meter (Grober Seegang / Seegang 6+) misst.
- **F-091** `[WEB-EDITION]` `[OSINT]`: **Nadelöhr-Schiffsverkehrs-Zähler** - Live-Zählung der Schiffe auf Transitkurs in Suezkanal, Panamakanal, Straße von Hormus, Bab-el-Mandeb und Bosporus.
- **F-092** `[WEB-EDITION]` `[OSINT]`: **"Dark Ship" AIS-Ausfall-Detektor** - Hebt Schiffe hervor, deren AIS-Signal in sicherheitskritischen Gewässern plötzlich abreißt.
- **F-093** `[WEB-EDITION]` `[OSINT]`: **Hafenbetrieb & Schiffsabfertigungen (PortNet/NEMO)** - Gemeldete Ankünfte, aktuelle Liegeplätze und Auslaufgenehmigungen an Handelshäfen.
- **F-094** `[WEB-EDITION]` `[OSINT]`: **Seenotrettungs-Suchmuster-Generator (SAR)** - Berechnet expandierende Quadrat- und Sektor-Suchmuster für maritime Rettungseinsätze.
- **F-095** `[WEB-EDITION]` `[OSINT]`: **Ozeanische Tiefenlinien & Flachwasser-Overlay** - GEBCO-Unterwassertopografie zur Erkennung von Fahrrinnen, Untiefen und Tiefseegräben.
- **F-096** `[WEB-EDITION]` `[OSINT]`: **12-Meilen-Hoheitsgewässer & 200-Meilen-AWZ Grenzen** - Vektorgrenzen der ausschließlichen Wirtschaftszonen (AWZ) aller Küstenstaaten.
- **F-097** `[WEB-EDITION]` `[OSINT]`: **Arktische Meereis-Ausdehnung & Schifffahrts-Passagen** (NSIDC) - Eiskonzentration in Nordwestpassage und Nördlichem Seeweg.
- **F-098** `[WEB-EDITION]` `[OSINT]`: **Meeresschutzgebiete & Illegale Fischerei Monitor** - Überlagert Naturschutzzonen mit aktiven Trawlern und Langleinenfischern.
- **F-099** `[WEB-EDITION]` `[OSINT]`: **Nautischer Distanz- & Peilungs-Plotter** - Interaktives Messwerkzeug für exakte Seemeilen und rechtweisende Peilung zwischen Schiffspositionen.
- **F-100** `[WEB-EDITION]` `[OSINT]`: **Schiffs-Abfangkurs- & Treffpunkt-Rechner** - Berechnet optimalen Kurs und Fahrtdauer zum Zusammentreffen zweier Schiffe auf See.
- **F-101** `[WEB-EDITION]` `[OSINT]`: **Leuchtturm- & Seezeichen-Datenbank (AtoN)** - Positionen, Kennungen, Blitzrhythmen und Tragweiten von Leuchtfeuern und Nebelhörnern.
- **F-102** `[WEB-EDITION]` `[OSINT]`: **See-Lagepanel** - Spezialisierter Monitor für globale Schifffahrtsrouten, Bojentelemetrie und Hafenlogistik.

---

## Domain 7: RF Spectrum, Shortwave WebSDR & Signal Intelligence (F-103 - F-119)

*Weltweite WebSDR-Empfänger, Notfunkfrequenzen, Blitz-Triangulation und Funkpeilung.*

- **F-103** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **KiwiSDR Globales WebSDR-Verzeichnis** (`rx.linkfanel.net/kiwisdr_com.js`) - 100% keyless Verzeichnis von 1.200+ online frei zugänglichen Software-Defined-Radio-Empfängern weltweit.
- **F-104** `[WEB-EDITION]` `[OSINT]`: **KiwiSDR Schnell-Abstimmung** - Ein Klick öffnet den gewünschten WebSDR-Empfänger direkt auf der gewählten Frequenz im Browserfenster.
- **F-105** `[WEB-EDITION]` `[OSINT]`: **Internationale Notruf-Frequenz-Schnellauswahl**:
  - 2182 kHz (See-Notruf Grenzwelle)
  - 121,5 MHz (Ziviler Luftnotruf VHF)
  - 243,0 MHz (Militärischer Luftnotruf UHF)
  - 14.300 MHz (Maritime Mobile Service Net)
  - 7.110 MHz / 14.195 MHz (Globaler Notfunkverkehr der Funkamateure).
- **F-106** `[WEB-EDITION]` `[OSINT]`: **Kurzwellen-Normalfrequenz- & Zeitzeichensender** (WWV 5/10/15/20 MHz, CHU Kanada 3330/7850/14670 kHz) - Frequenzmarker zur Prüfung der Ionosphärenausbreitung.
- **F-107** `[WEB-EDITION]` `[OSINT]`: **Zahlensender- & Militär-Baken-Frequenzführer** - Frequenzen und Sendepläne strategischer Stationen (UVB-76 'The Buzzer' 4625 kHz, The Pip 3756 kHz, The Squeaky Wheel).
- **F-108** `[WEB-EDITION]` `[OSINT]`: **Blitzortung / LightningMaps WebSocket Stream** - Direkte Anbindung an das weltweite elektromagnetische Blitz-Triangulationsnetzwerk.
- **F-109** `[WEB-EDITION]` `[OSINT]`: **Echtzeit-Donnerschall-Ausbreitungsring** - Berechnet und visualisiert die Schallwelle (343 m/s) vom Blitzeinschlag zum Standort des Nutzers.
- **F-110** `[WEB-EDITION]` `[OSINT]`: **Amateurfunk Maidenhead-Locator-Konverter** - Bidirektionale Umrechnung zwischen Breiten-/Längengraden und 6-stelligem QTH-Locator (z. B. `JO31kk`).
- **F-111** `[WEB-EDITION]` `[OSINT]`: **Ionosphärische Grenzfequenzkarte (MUF - Maximum Usable Frequency)** - Keyless Weltkarte für Kurzwellen-Reflexion und Weitverkehrsbedingungen (DX).
- **F-112** `[WEB-EDITION]` `[OSINT]`: **Funkhorizont-Rechner** - Berechnet optische und radioelektrische Reichweite von VHF/UHF-Antennen anhand der Masthöhe: $d \approx 4,12 \times \sqrt{h}$.
- **F-113** `[WEB-EDITION]` `[OSINT]`: **Behördenfunk- & Rettungsdienst-Stream-Verzeichnis** (Broadcastify / OpenMHz) - Übersicht frei verfügbarer BOS- und Feuerwehr-Funkstreams.
- **F-114** `[WEB-EDITION]` `[OSINT]`: **KiwiSDR Empfangsqualitäts-Filter** - Filtert SDR-Stationen nach Signal-Rausch-Abstand (SNR) und freien Nutzerplätzen.
- **F-115** `[WEB-EDITION]` `[OSINT]`: **Morseschrift (CW) Text-zu-Ton & Flashtool** - Wandelt Text in 800-Hz-Morse-Audiotöne und optische Blinksignale um.
- **F-116** `[WEB-EDITION]` `[OSINT]`: **Internationales Rufzeichen-Präfix-Verzeichnis** - Erkennt sofort das Herkunftsland jedes Funkrufzeichens (z. B. `DL` = Deutschland, `W/K/N` = USA, `JA` = Japan).
- **F-117** `[WEB-EDITION]` `[OSINT]`: **Aurora-Funkwarnung** - Signalisiert bei geomagnetischem Kp-Index >= 5 die Möglichkeit von UKW-Überreichweiten durch Polarlichter (Aurora-Scatter).
- **F-118** `[WEB-EDITION]` `[OSINT]`: **KiwiSDR Wasserfall-Vorschau** - Mini-Spektrum-Schnappschuss zur schnellen Beurteilung der Bandaktivität.
- **F-119** `[WEB-EDITION]` `[OSINT]`: **Funk- & Frequenz-Lagepanel** - Zentraler Monitor für Kurzwellen-Überwachung, Notruffrequenzen und SDR-Tuning.

---

## Domain 8: International Borders, Critical Energy & Infrastructure Grid (F-120 - F-136)

*Grenzkontrollen, Atomkraftwerke, Stromnetz-Frequenz, Staudämme und Rohöl-Pipelines.*

- **F-120** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **U.S. Customs & Border Protection (CBP) Border Wait Times API** (`bwt.cbp.gov/api/bwtpublicmod`) - Keyless Echtzeit-Wartezeiten an allen Landgrenzübergängen zwischen den USA, Kanada und Mexiko.
- **F-121** `[WEB-EDITION]` `[OSINT]`: **Fahrspuren-Aufschlüsselung an Grenzübergängen** - Standardspuren, Frachtverkehr, SENTRI / NEXUS Schnellabfertigung und Fußgängerzonen.
- **F-122** `[WEB-EDITION]` `[OSINT]`: **Grenzposten-Status-Warnungen** - Benachrichtigung bei Spur-Reduzierungen, Grenzschließungen und Protestblockaden.
- **F-123** `[WEB-EDITION]` `[OSINT]`: **OpenStreetMap Overpass Taktische Infrastruktur-Engine** (`overpass-api.de/api/interpreter`) - Keyless Abfrage kritischer Bauwerke:
  - Kernkraftwerke (`power=plant + plant:source=nuclear`)
  - Umspannwerke (`power=substation`)
  - Öltanklager & LNG-Terminals (`man_made=storage_tank + content=oil`)
  - Richtfunktürme & Radardome (`man_made=mast` / `man_made=tower`)
  - Zivilschutzbunker (`amenity=bunker`).
- **F-124** `[WEB-EDITION]` `[OSINT]`: **IAEA PRIS Nuklear-Reaktor-Datenbank** - Geokodierte Datenbank aller 440+ kommerziellen Atomreaktoren mit Megawatt-Leistung, Reaktortyp (DWR, SWR, WWER, CANDU) und Kühlwasserquelle.
- **F-125** `[WEB-EDITION]` `[OSINT]`: **Global Dam Watch & GRanD Talsperren-Kataster** - Standorte, Staumauertyp, Speichervolumen in Mio. Kubikmetern und Zweck von 7.000+ Großtalsperren.
- **F-126** `[WEB-EDITION]` `[OSINT]`: **Stromnetz-Netzfrequenz- & Stabilitäts-Monitor** (ENTSO-E & OpenNEM) - Live-Überwachung der Netzfrequenz (50,00 Hz Europa / 60,00 Hz USA) zur Früherkennung von Großkraftwerksausfällen.
- **F-127** `[WEB-EDITION]` `[OSINT]`: **Stromerzeugungs-Mix-Anzeige** - Prozentuale Anteile von Atomkraft, Kohle, Erdgas, Wasserkraft, Wind und Photovoltaik am Strommix.
- **F-128** `[WEB-EDITION]` `[OSINT]`: **Internationale Öl- & Gaspipeline-Routen** - Trassen von Nord Stream, D門zhba, Trans-Mediterranean, Keystone und Colonial Pipeline.
- **F-129** `[WEB-EDITION]` `[OSINT]`: **Strategische Bahn-Frachtkorridore & Alpentunnel** - Gotthard-Basistunnel, Brennerpass, Kanaltunnel und Transsibirische Eisenbahn.
- **F-130** `[WEB-EDITION]` `[OSINT]`: **Weltraum-Bahnhöfe & Raketen-Kosmodrome** (Cape Canaveral, Vandenberg, Baikonur, Kourou, Tanegashima, Wenchang) - Startrampen-Koordinaten und Seesperrzonen.
- **F-131** `[WEB-EDITION]` `[OSINT]`: **Strategische Erdölreserve-Kavernen (SPR)** - Geografische Lagen und Füllkapazitäten strategischer Rohstofflager.
- **F-132** `[WEB-EDITION]` `[OSINT]`: **Meerwasserentsalzungsanlagen-Atlas** - Kritische Trinkwasserproduktionsanlagen im Nahen Osten und ariden Regionen.
- **F-133** `[WEB-EDITION]` `[OSINT]`: **Globale Halbleiter-Fabriken (Fabs)** - Standorte führender Chipfabriken (TSMC, Intel, Samsung, ASML).
- **F-134** `[WEB-EDITION]` `[OSINT]`: **Grenzwartezeiten-Heatmap** - Farbschema (Grün < 15 Min, Gelb 15-45 Min, Rot > 45 Min, Blinkend Rot = Gesperrt).
- **F-135** `[WEB-EDITION]` `[OSINT]`: **Kritische Infrastruktur Näherungsalarm** - Schlägt Alarm, wenn Waldbrände oder Naturkatastrophen weniger als 15 km von einem AKW, Damm oder Tanklager entfernt sind.
- **F-136** `[WEB-EDITION]` `[OSINT]`: **Infrastruktur- & Energie-Lagepanel** - Dedizierte Großansicht für Grenzübergänge, Kraftwerksstatus und Stromnetzstabilität.

---

## Domain 9: Neue Taktische UI Panels & Multi-Monitor Ansichten MON-13 bis MON-20 (F-137 - F-153)

*Acht brandneue interaktive Lage-Monitore, Bild-in-Bild-Player, Split-Screen und 20-Monitor-Layout.*

- **F-137** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **MON-13: Cyber Outage & Subsea Cable Threat Matrix** - Live-Karte für weltweite Netzausfälle, BGP-Routenwarnungen und Seekabeltrassen.
- **F-138** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **MON-14: GDACS Multi-Hazard Crisis Room** - UN-Katastrophen-Feed, Tropensturm-Zugbahnen und ReliefWeb-Notstandsberichte.
- **F-139** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **MON-15: Asteroid & Space Hazard Sentry** - Asteroiden-Begegnungsradar, Solar-Röntgenfluss und Raumstations-Tracking.
- **F-140** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **MON-16: Nuclear & Radiation Sensor Grid** - Safecast-Radioaktivitätswerte, EURDEP-Gammadosis und AKW-Schutzzonen.
- **F-141** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **MON-17: Airport Operations & Airfield Ground Delay Board** - FAA-Flughafenstatus, METAR-Klartextdekoder und Flugplatz-Wetterkategorien.
- **F-142** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **MON-18: Global Border & Transit Gateways** - Grenzkontroll-Wartezeiten, Abfertigungsspuren und Transportkorridore.
- **F-143** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **MON-19: KiwiSDR Spectrum Scanner** - Interaktive Karte von 1.200+ WebSDR-Funkstationen mit Direkt-Tuning.
- **F-144** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **MON-20: Critical Energy & Grid Stability Monitor** - 50/60 Hz Netzfrequenz, Stromerzeugungs-Mix und Talsperren-Füllstände.
- **F-145** `[WEB-EDITION]` `[OSINT]`: **20-Monitor Taktik-Umschalter** - Schaltet das Dashboard stufenlos zwischen 12-Monitor-Standard und 20-Monitor-Kommandozentrale um.
- **F-146** `[WEB-EDITION]` `[OSINT]`: **Floating Picture-in-Picture (PiP) Player** - Löst jede Kamera oder jedes Radar als frei verschiebbare Miniatur über der Hauptkarte ab.
- **F-147** `[WEB-EDITION]` `[OSINT]`: **Dual-Viewport Split-Screen Modus** - Vergleicht Satellitenaufnahmen Seite an Seite mit Live-Doppler-Radar oder Webcam-Feeds.
- **F-148** `[WEB-EDITION]` `[OSINT]`: **Vollbild-Kommandowand-Preset (F11)** - Optimiert für Beamer, Leitstellen und Mehrschirm-Setups im Lagezentrum.
- **F-149** `[WEB-EDITION]` `[OSINT]`: **Drag-and-Drop Monitor-Reihenfolge** - Individuelles Verschieben und Anordnen der Monitore MON-01 bis MON-20.
- **F-150** `[WEB-EDITION]` `[OSINT]`: **Taktischer Audio-Stummschalter** - Stummschaltung aller Alarmsirenen, Radar-Beeps und Geigerzähler-Sounds mit einem Klick.
- **F-151** `[WEB-EDITION]` `[OSINT]`: **High-Contrast Night Recon Theme** - Echtes OLED-Schwarz (`#000000`) mit kontrastreichen Bernstein- und Cyan-Akzenten für blendfreie Nachtarbeit.
- **F-152** `[WEB-EDITION]` `[OSINT]`: **Taktisches Fadenkreuz & Koordinaten-Retikel** - Zeigt Fadenkreuz mit Breiten-/Längengrad und Geländehöhe im Kartenzentrum.
- **F-153** `[WEB-EDITION]` `[OSINT]`: **Panik-Schutz-Taste (Boss Key)** - Tastenkürzel `Ctrl+Shift+X` schaltet den Bildschirm blitzschnell auf ein neutrales Dokument um.

---

## Domain 10: OSINT Field Tools, Calculators, Geo-Decoders & Exporters (F-154 - F-170)

*Foto-Geolokalisierungs-Rechner, Schattenlängen, Koordinaten-Umrechner, GeoJSON/KML-Exporte.*

- **F-154** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Sonnen- & Schattenwinkel Foto-Geolokalisierungs-Rechner** - Berechnet Sonnenstand (Azimut und Elevation) für jedes historische Datum und ermittelt die erwartete Schattenlänge bekannter Objekte: $L = \frac{h}{\tan(\theta)}$.
- **F-155** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Dämmerungs-Rechner (Bürgerlich / Nautisch / Astronomisch)** - Berechnet Sonnenauf- und -untergang, Goldene Stunde und absolute Dunkelheitsfenster für Aufklärungsmissionen.
- **F-156** `[WEB-EDITION]` `[OSINT]` `[EXE/APK]`: **Militär- & Taktik-Koordinaten-Konverter** - Bidirektionale Sofortumrechnung zwischen:
  - Dezimalgrad (DD: `52.5200, 13.4050`)
  - Grad Minuten Sekunden (DMS: `52°31'12"N, 13°24'18"E`)
  - UTM (Universal Transverse Mercator: `33U 391820 5820120`)
  - MGRS (Military Grid Reference System: `33UUU9182020120`)
  - Maidenhead QTH Locator (`JO62qn`).
- **F-157** `[WEB-EDITION]` `[OSINT]`: **Großkreis-Distanz- & Peilungs-Werkzeug** - Exakte Distanz in Kilometern, Meilen und Seemeilen inklusive Anfangs- und Endkompasskurs.
- **F-158** `[WEB-EDITION]` `[OSINT]`: **VHF/UHF Sichtlinien- & Funkhorizont-Rechner** - Berücksichtigt Sende- und Empfangsantennenhöhe über gekrümmter Erdoberfläche: $d \approx 4,12 \times (\sqrt{h_{\text{tx}}} + \sqrt{h_{\text{rx}}})$.
- **F-159** `[WEB-EDITION]` `[OSINT]`: **METAR / TAF Rohcode Sofort-Dekoder** - Eingabefeld für Flugwettercodes (z. B. `EDDF 200820Z 04008KT 9999 FEW030 14/06 Q1022 NOSIG`) mit sofortiger Klartextanzeige.
- **F-160** `[WEB-EDITION]` `[OSINT]`: **Seismischer P- und S-Wellen Ankunftszeit-Schätzer** - Berechnet die exakte Vorwarnzeit bis zum Eintreffen der zerstörerischen Scherwellen am Standort des Nutzers.
- **F-161** `[WEB-EDITION]` `[OSINT]`: **Doppler-Windvektor Trigonometrische Zerlegung** - Löst Radialgeschwindigkeiten des Radars in echten meteorologischen Windvektor auf: $V_{\text{true}} = \frac{V_r}{\cos(\theta - \phi)}$.
- **F-162** `[WEB-EDITION]` `[OSINT]`: **Geschwindigkeits-, Zeit- & Wegstrecken-Rechner** - Berechnet Reisezeiten bei vorgegebener Geschwindigkeit in Knoten, km/h oder mph.
- **F-163** `[WEB-EDITION]` `[OSINT]`: **Taktischer Radien-Generator** - Klick auf einen Kartenpunkt zeichnet konzentrische Sperr- und Gefahrenringe (1km, 5km, 10km, 25km, 50km).
- **F-164** `[WEB-EDITION]` `[OSINT]`: **Polygon-Flächen- & Umfangs-Messwerkzeug** - Ermöglicht das Einzeichnen von Suchgebieten und berechnet die Fläche in $\text{km}^2$, Hektar und Quadratmeilen.
- **F-165** `[WEB-EDITION]` `[OSINT]`: **Ein-Klick GeoJSON Taktik-Export** - Exportiert alle aktiven Kartenebenen, Katastrophenpolygone und Kameras in eine standardisierte GeoJSON-Datei für QGIS und ArcGIS.
- **F-166** `[WEB-EDITION]` `[OSINT]`: **KML / KMZ Export für Google Earth** - Erzeugt 3D-fähige KML-Dateien von Flugrouten, Satelliten-Bodenspuren und Unwetterzonen.
- **F-167** `[WEB-EDITION]` `[OSINT]`: **CSV-Sensor-Telemetrie-Export** - Lädt sichtbare Sensortabellen (Erdbeben, Wetterstationen, Luftgütedaten) als saubere CSV-Tabelle herunter.
- **F-168** `[WEB-EDITION]` `[OSINT]`: **Hochauflösender Taktischer Screenshot-Generator** - Erzeugt PNG-Kartenexporte mit Zeitstempel, Koordinatenraster und Klassifizierungsbanner.
- **F-169** `[WEB-EDITION]` `[OSINT]`: **Offline-Lagebild Snapshot-Paketierer** - Packt das aktuelle Lagebild in eine autarke HTML/JS-Datei für den netzunabhängigen Einsatz im Feld.
- **F-170** `[WEB-EDITION]` `[OSINT]`: **Missions-Fallakten Manager (Case Files)** - Speichert, benennt und lädt vollständige OSINT-Untersuchungen (aktive Ebenen, Kamera-Favoriten, Pins und Notizen).

---

## 📊 Zusammenfassung des v2.1.0 Ausbauplans
* **Gesamtanzahl neuer Features:** **170 Features** (F-001 bis F-170)
* **Neue Groß-Monitore:** **8 neue Panels** (MON-13 bis MON-20)
* **Web-Edition Kompatibilität:** **Über 120 Features speziell mit `[WEB-EDITION]` gekennzeichnet**
* **Self-Hosted Core & Desktop/APK:** **Alle 170 Features uneingeschränkt nutzbar**
* **Zero-Fake Richtlinie:** 100% echte, verifizierte offene Daten — keinerlei Fake-Simulationen oder Dummy-Platzhalter!
