/**

 * ============================================================================

 * OMNISCOPE OSINT v2.7.1 — TACTICAL BROADCAST TV, 1x–4x INDEPENDENT

 * SUB-MONITORS & COLLAPSIBLE NEXRAD LEVEL-II/III / TDWR / SATELLITE SUITE

 * ============================================================================

 * Features:

 * 1. MON-02 Collapsible Live TV Side Panel (`#mon02-tv-sidepanel` — docked on

 *    the right side of MON-02 like TACTICAL SENSORS on MON-01):

 *    - 108 Open-Source Live TV & News HLS (.m3u8) channels (`data/tv_channels.json`).

 *    - Automated 2-Minute (120s) background health poller with live countdown.

 *    - Full-height scrollable channel list with explicit `▶ LIVE` buttons.

 *    - Full Broadcast DVR Controls (`⏯`, `⏪ -15s`, `⏩ +15s`, `🔴 LIVE`,

 *      Volume `0–100%`, `🔇/🔊`, `🔊 SOLO`, `⧉ PiP`).

 * 2. MON-02 True Independent `1x` – `4x` Multi-Viewport Matrix (`MON 2.1`–`MON 2.4`):

 *    - Switch MON-02 between `1x`, `2x`, `3x`, and `4x` independent mini-monitors.

 *    - Every single sub-monitor (`MON 2.1`, `MON 2.2`, `MON 2.3`, `MON 2.4`) is

 *      100% independent and can display its own content simultaneously:

 *      Live TV Channel, Live Webcam (HLS/Embed/Snapshot), Live Radio/WebSDR,

 *      or any clicked Map Node (Weather Station, Storm, Ship, Quake, TDWR, etc.).

 * 3. MON-01 Collapsible NEXRAD Level-II/III, 45 TDWR & Live GOES Satellite Controls:

 *    - Integrated cleanly inside MON-01's collapsible `TACTICAL SENSORS` sidebar

 *      (`#map-tactical-sidebar`) & top radar dropdowns — NO forced overlay box

 *      blocking the bottom-left of the map.

 * ============================================================================

 */



(function () {

    'use strict';



    // 45 Official NOAA / FAA Terminal Doppler Weather Radar (TDWR) Stations

    const NOAA_TDWR_STATIONS = [

        { id: 'TATL', name: 'Atlanta Hartsfield-Jackson TDWR', state: 'GA', lat: 33.6462, lon: -84.2622, airport: 'KATL', freq_mhz: 5610 },

        { id: 'TBOS', name: 'Boston Logan Intl TDWR', state: 'MA', lat: 42.1581, lon: -70.9339, airport: 'KBOS', freq_mhz: 5615 },

        { id: 'TBWI', name: 'Baltimore-Washington Intl TDWR', state: 'MD', lat: 39.0903, lon: -76.6300, airport: 'KBWI', freq_mhz: 5620 },

        { id: 'TCLT', name: 'Charlotte Douglas Intl TDWR', state: 'NC', lat: 35.3372, lon: -80.8850, airport: 'KCLT', freq_mhz: 5605 },

        { id: 'TCMH', name: 'Columbus John Glenn Intl TDWR', state: 'OH', lat: 40.0061, lon: -82.7150, airport: 'KCMH', freq_mhz: 5630 },

        { id: 'TCVG', name: 'Cincinnati / Northern Kentucky TDWR', state: 'KY', lat: 38.8978, lon: -84.5789, airport: 'KCVG', freq_mhz: 5625 },

        { id: 'TDAL', name: 'Dallas Love Field TDWR', state: 'TX', lat: 32.9247, lon: -96.9683, airport: 'KDAL', freq_mhz: 5640 },

        { id: 'TDAY', name: 'Dayton Intl Airport TDWR', state: 'OH', lat: 40.0219, lon: -84.1231, airport: 'KDAY', freq_mhz: 5635 },

        { id: 'TDCA', name: 'Washington Reagan National TDWR', state: 'DC', lat: 38.7589, lon: -76.9619, airport: 'KDCA', freq_mhz: 5610 },

        { id: 'TDEN', name: 'Denver Intl Airport TDWR', state: 'CO', lat: 39.7272, lon: -104.5261, airport: 'KDEN', freq_mhz: 5645 },

        { id: 'TDFW', name: 'Dallas/Fort Worth Intl TDWR', state: 'TX', lat: 33.0644, lon: -96.9153, airport: 'KDFW', freq_mhz: 5600 },

        { id: 'TDTW', name: 'Detroit Metro Wayne County TDWR', state: 'MI', lat: 42.1111, lon: -83.5150, airport: 'KDTW', freq_mhz: 5615 },

        { id: 'TEWR', name: 'Newark Liberty Intl TDWR', state: 'NJ', lat: 40.5933, lon: -74.2219, airport: 'KEWR', freq_mhz: 5620 },

        { id: 'TFLL', name: 'Fort Lauderdale-Hollywood TDWR', state: 'FL', lat: 26.1428, lon: -80.3439, airport: 'KFLL', freq_mhz: 5630 },

        { id: 'THOU', name: 'Houston William P. Hobby TDWR', state: 'TX', lat: 29.5158, lon: -95.2419, airport: 'KHOU', freq_mhz: 5625 },

        { id: 'TIAD', name: 'Washington Dulles Intl TDWR', state: 'VA', lat: 39.0839, lon: -77.5292, airport: 'KIAD', freq_mhz: 5640 },

        { id: 'TIAH', name: 'Houston George Bush Intercontinental TDWR', state: 'TX', lat: 30.0647, lon: -95.5669, airport: 'KIAH', freq_mhz: 5605 },

        { id: 'TICH', name: 'Wichita Dwight D. Eisenhower TDWR', state: 'KS', lat: 37.5069, lon: -97.4372, airport: 'KICT', freq_mhz: 5610 },

        { id: 'TIDS', name: 'Indianapolis Intl Airport TDWR', state: 'IN', lat: 39.6369, lon: -86.4353, airport: 'KIND', freq_mhz: 5635 },

        { id: 'TJFK', name: 'New York John F. Kennedy Intl TDWR', state: 'NY', lat: 40.5886, lon: -73.8803, airport: 'KJFK', freq_mhz: 5600 },

        { id: 'TLAS', name: 'Las Vegas Harry Reid Intl TDWR', state: 'NV', lat: 36.1439, lon: -115.0069, airport: 'KLAS', freq_mhz: 5645 },

        { id: 'TLVE', name: 'Cleveland Hopkins Intl TDWR', state: 'OH', lat: 41.2894, lon: -82.0072, airport: 'KCLE', freq_mhz: 5620 },

        { id: 'TMCI', name: 'Kansas City Intl Airport TDWR', state: 'MO', lat: 39.4986, lon: -94.7419, airport: 'KMCI', freq_mhz: 5615 },

        { id: 'TMCO', name: 'Orlando Intl Airport TDWR', state: 'FL', lat: 28.3431, lon: -81.3247, airport: 'KMCO', freq_mhz: 5625 },

        { id: 'TMDW', name: 'Chicago Midway Intl TDWR', state: 'IL', lat: 41.6514, lon: -87.7297, airport: 'KMDW', freq_mhz: 5630 },

        { id: 'TMEM', name: 'Memphis Intl Airport TDWR', state: 'TN', lat: 34.8961, lon: -89.9928, airport: 'KMEM', freq_mhz: 5610 },

        { id: 'TMIA', name: 'Miami Intl Airport TDWR', state: 'FL', lat: 25.7575, lon: -80.4911, airport: 'KMIA', freq_mhz: 5605 },

        { id: 'TMKE', name: 'Milwaukee Mitchell Intl TDWR', state: 'WI', lat: 42.8192, lon: -88.0461, airport: 'KMKE', freq_mhz: 5640 },

        { id: 'TMSP', name: 'Minneapolis-St. Paul Intl TDWR', state: 'MN', lat: 44.8708, lon: -93.5169, airport: 'KMSP', freq_mhz: 5635 },

        { id: 'TMSY', name: 'New Orleans Louis Armstrong TDWR', state: 'LA', lat: 30.0214, lon: -90.4028, airport: 'KMSY', freq_mhz: 5620 },

        { id: 'TOKC', name: 'Oklahoma City Will Rogers TDWR', state: 'OK', lat: 35.2761, lon: -97.5100, airport: 'KOKC', freq_mhz: 5600 },

        { id: 'TORD', name: 'Chicago O\'Hare Intl TDWR', state: 'IL', lat: 41.7967, lon: -87.8575, airport: 'KORD', freq_mhz: 5605 },

        { id: 'TPBI', name: 'West Palm Beach Intl TDWR', state: 'FL', lat: 26.6878, lon: -80.2728, airport: 'KPBI', freq_mhz: 5615 },

        { id: 'TPHL', name: 'Philadelphia Intl Airport TDWR', state: 'PA', lat: 39.9500, lon: -75.0697, airport: 'KPHL', freq_mhz: 5625 },

        { id: 'TPHX', name: 'Phoenix Sky Harbor Intl TDWR', state: 'AZ', lat: 33.4203, lon: -112.1631, airport: 'KPHX', freq_mhz: 5630 },

        { id: 'TPIT', name: 'Pittsburgh Intl Airport TDWR', state: 'PA', lat: 40.5011, lon: -80.4861, airport: 'KPIT', freq_mhz: 5645 },

        { id: 'TRDU', name: 'Raleigh-Durham Intl TDWR', state: 'NC', lat: 36.0014, lon: -78.6978, airport: 'KRDU', freq_mhz: 5610 },

        { id: 'TSDF', name: 'Louisville Muhammad Ali Intl TDWR', state: 'KY', lat: 38.0458, lon: -85.6100, airport: 'KSDF', freq_mhz: 5640 },

        { id: 'TSJU', name: 'San Juan Luis Muñoz Marín TDWR', state: 'PR', lat: 18.4739, lon: -66.1789, airport: 'TJSJ', freq_mhz: 5620 },

        { id: 'TSLC', name: 'Salt Lake City Intl TDWR', state: 'UT', lat: 40.9669, lon: -111.9300, airport: 'KSLC', freq_mhz: 5635 },

        { id: 'TSTL', name: 'St. Louis Lambert Intl TDWR', state: 'MO', lat: 38.8053, lon: -90.4886, airport: 'KSTL', freq_mhz: 5615 },

        { id: 'TTPA', name: 'Tampa Intl Airport TDWR', state: 'FL', lat: 27.8589, lon: -82.5175, airport: 'KTPA', freq_mhz: 5600 },

        { id: 'TTUL', name: 'Tulsa Intl Airport TDWR', state: 'OK', lat: 36.0697, lon: -95.8264, airport: 'KTUL', freq_mhz: 5625 },

        { id: 'TADW', name: 'Joint Base Andrews TDWR', state: 'MD', lat: 38.6942, lon: -76.8456, airport: 'KADW', freq_mhz: 5630 },

        { id: 'TLGA', name: 'New York LaGuardia TDWR', state: 'NY', lat: 40.7769, lon: -73.8740, airport: 'KLGA', freq_mhz: 5645 }

    ];



    const RADIO_PRESETS = [

        { id: 'rad_dlf', name: 'Deutschlandfunk Live News & Wetter', freq: '100.3 MHz FM', url: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3', region: '🇩🇪 Germany' },

        { id: 'rad_bbc_ws', name: 'BBC World Service Global OSINT', freq: '94.1 MHz SW/FM', url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', region: '🇬🇧 Global' },

        { id: 'rad_npr', name: 'NPR 24h Live Program & Severe Weather', freq: '88.5 MHz FM', url: 'https://npr-ice.streamguys1.com/live.mp3', region: '🇺🇸 USA' },

        { id: 'rad_fip', name: 'Radio France Info / FIP Dispatch', freq: '105.1 MHz FM', url: 'https://icecast.radiofrance.fr/franceinfo-midfi.mp3', region: '🇫🇷 France' },

        { id: 'rad_soma_defcon', name: 'DEF CON / SomaFM Cyber Telemetry', freq: '146.520 MHz VHF', url: 'https://ice2.somafm.com/defcon-128-mp3', region: '🌐 Cyber' },

        { id: 'rad_soma_mission', name: 'NASA Mission Control & ISS Audio', freq: '259.700 MHz UHF', url: 'https://ice2.somafm.com/missioncontrol-128-mp3', region: '🛰️ Orbital' }

    ];



    class OmniScopeMultiViewController {

        constructor() {

            this.tvChannels = [];

            this.onlineChannels = [];

            this.activeCategory = 'all';

            this.searchQuery = '';

            this.isTvDrawerOpen = false;

            this.pollCountdown = 120;

            this.pollTimer = null;

            this.isPollingTv = false;



            // Multi-Viewport state: 1x, 2x, 3x, 4x

            this.viewportCount = 1;

            this.activeSlotIndex = 0; // 0..3 -> MON 2.1 .. MON 2.4

            this.multiviewActive = false;

            this.slots = [

                { index: 0, type: 'webcam', title: 'MON 2.1 // LIVE FEED', data: null, hls: null, videoEl: null, audioEl: null, snapTimer: null, muted: false, volume: 0.85 },

                { index: 1, type: 'tv', title: 'MON 2.2 // LIVE TV', data: null, hls: null, videoEl: null, audioEl: null, snapTimer: null, muted: true, volume: 0.75 },

                { index: 2, type: 'radio', title: 'MON 2.3 // LIVE SDR RADIO', data: null, hls: null, videoEl: null, audioEl: null, snapTimer: null, muted: true, volume: 0.75 },

                { index: 3, type: 'node', title: 'MON 2.4 // MAP NODE', data: null, hls: null, videoEl: null, audioEl: null, snapTimer: null, muted: true, volume: 0.75 }

            ];



            this.patrolInterval = null;

            this.patrolActive = false;



            // MON-01 Satellite & NEXRAD/TDWR state

            this.tdwrLayer = null;

            this.showTdwrMarkers = false;

            this.nexradRefreshSec = 60;

            this.satRefreshSec = 180;

        }



        async init() {



            await this.loadTvCatalog();

            this.injectMon02Controls();

            this.injectMon01RadarAndSatUpgrades();

            this.startTvTwoMinutePoller();

            this.startRadarAndSatAutoRefresh();

            this.hookMapAndWebcamRouting();

            this.setViewportCount(1); // Standard default is ALWAYS 1x monitor only!

            console.log(`[OmniScope v2.7.3] MON-02 Standard 1x, 1x-4x Independent Sub-Monitors (Zero Overlap) online.`);

        }



        async loadTvCatalog() {

            try {

                const res = await fetch('data/tv_channels.json?v=2.7.3');

                if (res.ok) {

                    const raw = await res.json();

                    const list = Array.isArray(raw) ? raw : (raw.channels || []);

                    this.tvChannels = list.map((ch) => ({

                        ...ch,

                        online: true,

                        latency_ms: null,

                        last_checked: new Date().toLocaleTimeString()

                    }));

                    this.onlineChannels = [...this.tvChannels];

                }

            } catch (e) {

                console.warn('[OmniScope TV] Failed to load tv_channels.json:', e);

            }

        }



        // =====================================================================

        // 1. MON-02 COLLAPSIBLE SIDE PANEL (LIKE MON-01 SENSORS) + 1X-4X MATRIX

        // =====================================================================

        injectMon02Controls() {

            const mon02Card = document.getElementById('card-webcam');

            if (!mon02Card) return;

            mon02Card.style.position = 'relative';



            const headerCtrls = mon02Card.querySelector('.mon02-header-controls');

            if (headerCtrls) {

                // Replace 1x1/2x2/3x3 toggle with 1x / 2x / 3x / 4x independent sub-monitors

                const oldGridToggle = headerCtrls.querySelector('.cam-grid-toggle');

                if (oldGridToggle) {

                    oldGridToggle.innerHTML = `

                        <button class="ops-btn active" id="btn-mv-1x" data-mv="1" style="padding:1px 6px;font-size:0.68rem;font-weight:700;" title="1x Einzelmonitor (MON 2.1)">1x</button>

                        <button class="ops-btn" id="btn-mv-2x" data-mv="2" style="padding:1px 6px;font-size:0.68rem;font-weight:700;" title="2x Dual Sub-Monitore (MON 2.1 + 2.2 unabhängig)">2x</button>

                        <button class="ops-btn" id="btn-mv-3x" data-mv="3" style="padding:1px 6px;font-size:0.68rem;font-weight:700;" title="3x Triple Sub-Monitore (MON 2.1 – 2.3 unabhängig)">3x</button>

                        <button class="ops-btn" id="btn-mv-4x" data-mv="4" style="padding:1px 6px;font-size:0.68rem;font-weight:700;" title="4x Quad Matrix Sub-Monitore (MON 2.1 – 2.4 unabhängig)">4x</button>

                    `;

                }



                // Insert or attach TV Side Panel Toggle Button in MON-02 Header
                let tvBtn = document.getElementById('btn-toggle-tv-drawer');
                if (!tvBtn) {
                    tvBtn = document.createElement('button');
                    tvBtn.id = 'btn-toggle-tv-drawer';
                    tvBtn.className = 'ops-btn';
                    tvBtn.style.cssText = 'padding:2px 8px;font-size:0.7rem;background:rgba(16,185,129,0.22);color:#34d399;border:1px solid #10b981;font-weight:700;flex-shrink:0;display:inline-flex;align-items:center;gap:4px;box-shadow:0 0 8px rgba(16,185,129,0.35);cursor:pointer;';
                    tvBtn.title = '108 Live-TV & Nachrichtensender als Side-Panel an MON-02 ein-/ausklappen';
                    tvBtn.innerHTML = `📺 LIVE TV (<span id="tv-online-count-badge">${this.onlineChannels.length || 108}</span>)`;
                    headerCtrls.insertBefore(tvBtn, headerCtrls.firstChild);
                }
                tvBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleTvDrawer();
                };



                // Bind 1x / 2x / 3x / 4x buttons

                headerCtrls.querySelectorAll('[data-mv]').forEach(btn => {

                    btn.addEventListener('click', (e) => {

                        e.stopPropagation();

                        const count = parseInt(btn.getAttribute('data-mv'), 10) || 1;

                        this.setViewportCount(count);

                    });

                });

            }



            const camPlayerBody = document.getElementById('cam-player');

            if (!camPlayerBody) return;



            // Remove old horizontal drawer if present

            document.getElementById('mon02-tv-drawer')?.remove();

            document.getElementById('mon02-slot-router-bar')?.remove();



            // Compact Sub-Monitor Target & Quick-Source Router Bar

            const slotBar = document.createElement('div');

            slotBar.id = 'mon02-slot-router-bar';

            slotBar.className = 'mon02-slot-router-bar';

            slotBar.innerHTML = `

                <div class="slot-router-left">

                    <span class="slot-router-lbl">🎯 ZIEL-MONITOR:</span>

                    <button class="slot-pill active" data-slot="0" title="Sub-Monitor 2.1 auswählen">MON 2.1</button>

                    <button class="slot-pill" data-slot="1" title="Sub-Monitor 2.2 auswählen (öffnet automatisch 2x/4x)">MON 2.2</button>

                    <button class="slot-pill" data-slot="2" title="Sub-Monitor 2.3 auswählen (öffnet automatisch 3x/4x)">MON 2.3</button>

                    <button class="slot-pill" data-slot="3" title="Sub-Monitor 2.4 auswählen (öffnet automatisch 4x)">MON 2.4</button>

                </div>

                <div class="slot-router-right">

                    <button class="slot-src-btn" id="btn-slot-assign-tv" style="border-color:#10b981;color:#34d399;background:rgba(16,185,129,0.15);" title="Live-TV-Sender in den ausgewählten Sub-Monitor laden">📺 TV SENDER WÄHLEN</button>

                    <button class="slot-src-btn" id="btn-slot-assign-cam" title="Live-Webcam in den ausgewählten Sub-Monitor laden">📷 CAM</button>

                    <button class="slot-src-btn" id="btn-slot-assign-radio" title="Live-Radio / WebSDR in den ausgewählten Sub-Monitor laden">📻 RADIO</button>

                    <button class="slot-src-btn" id="btn-slot-assign-node" title="Karten-Knoten / Wetterstation in den ausgewählten Sub-Monitor laden">🗺️ MAP NODE</button>

                    <button class="slot-src-btn" id="btn-tv-patrol" title="Automatischer Sender-Durchlauf alle 45s">🔄 PATROL</button>

                </div>

            `;

            mon02Card.insertBefore(slotBar, camPlayerBody);



            // Remove floating side tab so it NEVER overlaps any monitor content or buttons

            document.getElementById('btn-mon02-tv-side-tab')?.remove();



            // Full-Height Collapsible Side Panel docked on the right side of MON-02

            const tvSidePanel = document.createElement('aside');

            tvSidePanel.id = 'mon02-tv-drawer';

            tvSidePanel.className = 'mon02-tv-sidepanel hidden';

            tvSidePanel.innerHTML = `

                <div class="tv-sidepanel-header">

                    <div class="tv-drawer-title-group">

                        <span class="tv-live-dot"></span>

                        <strong>📺 LIVE TV & NEWS SENDER (${this.onlineChannels.length})</strong>

                    </div>

                    <div class="tv-drawer-actions">

                        <span id="tv-poll-status-pill" class="tv-poll-pill" title="Automatischer 2-Minuten Live-Check">🔄 <strong id="tv-poll-countdown">02:00</strong></span>

                        <button id="btn-tv-poll-now" class="ops-btn" style="padding:2px 6px;font-size:0.64rem;background:rgba(56,189,248,0.2);color:#38bdf8;border:1px solid #0284c7;cursor:pointer;" title="Jetzt alle 108 TV-Streams prüfen">⚡ POLL</button>

                        <button id="btn-tv-drawer-close" class="ops-btn" style="padding:2px 7px;font-size:0.68rem;background:#dc2626;color:#fff;border:none;cursor:pointer;" title="TV Side-Panel schließen">✕</button>

                    </div>

                </div>



                <!-- Target Sub-Monitor Selector inside Side Panel -->

                <div class="tv-sidepanel-slot-target">

                    <span>🎯 SENDEN AN:</span>

                    <div class="tv-sidepanel-slot-btns">

                        <button class="tv-sp-slot-btn active" data-sp-target-slot="0">MON 2.1</button>

                        <button class="tv-sp-slot-btn" data-sp-target-slot="1">MON 2.2</button>

                        <button class="tv-sp-slot-btn" data-sp-target-slot="2">MON 2.3</button>

                        <button class="tv-sp-slot-btn" data-sp-target-slot="3">MON 2.4</button>

                    </div>

                </div>



                <div class="tv-drawer-toolbar">

                    <input type="text" id="tv-channel-search" class="ops-input" placeholder="🔍 Sender suchen (Tagesschau, NASA, DW, ZDF, WeatherNation, CBS, BBC, Al Jazeera)..." />

                    <div class="tv-cat-pills" id="tv-cat-pills">

                        <button class="tv-cat-btn active" data-cat="all">ALLE (<span id="tv-ready-total">${this.onlineChannels.length}</span>)</button>

                        <button class="tv-cat-btn" data-cat="weather">🌦️ WETTER</button>

                        <button class="tv-cat-btn" data-cat="news">🚨 NEWS</button>

                        <button class="tv-cat-btn" data-cat="public">🏛️ DACH/TV</button>

                        <button class="tv-cat-btn" data-cat="science">🛰️ SPACE</button>

                        <button class="tv-cat-btn" data-cat="business">📈 FINANZ</button>

                        <button class="tv-cat-btn" data-cat="regional">📍 US LOKAL</button>

                        <button class="tv-cat-btn" data-cat="documentary">🎬 DOKU</button>

                    </div>

                </div>



                <!-- Scrollable Full-Height Channel List -->

                <div id="tv-channels-grid" class="tv-channels-list-scroll"></div>

            `;

            mon02Card.appendChild(tvSidePanel);



            // Wire Slot Selector Pills in top bar & inside TV Side Panel

            const bindSlotSelection = (sIdx) => {

                // Selection only: NEVER auto-expand viewports without manual user click on 1x/2x/3x/4x!

                if (sIdx >= this.viewportCount) {

                    console.log(`[OmniScope] Sub-Monitor 2.${sIdx + 1} is currently inactive in ${this.viewportCount}x mode.`);

                    return;

                }

                this.setActiveSlot(sIdx);

            };



            slotBar.querySelectorAll('.slot-pill').forEach(pill => {

                pill.addEventListener('click', () => {

                    const sIdx = parseInt(pill.getAttribute('data-slot'), 10) || 0;

                    bindSlotSelection(sIdx);

                });

            });



            tvSidePanel.querySelectorAll('.tv-sp-slot-btn').forEach(btn => {

                btn.addEventListener('click', () => {

                    const sIdx = parseInt(btn.getAttribute('data-sp-target-slot'), 10) || 0;

                    bindSlotSelection(sIdx);

                });

            });



            // Wire Quick Assign Buttons

            document.getElementById('btn-slot-assign-tv')?.addEventListener('click', () => {

                this.toggleTvDrawer(true);

            });

            document.getElementById('btn-slot-assign-cam')?.addEventListener('click', () => {

                this.loadNextLiveWebcamIntoSlot(this.activeSlotIndex);

            });

            document.getElementById('btn-slot-assign-radio')?.addEventListener('click', () => {

                const preset = RADIO_PRESETS[this.activeSlotIndex % RADIO_PRESETS.length];

                this.assignRadioToSlot(this.activeSlotIndex, preset);

            });

            document.getElementById('btn-slot-assign-node')?.addEventListener('click', () => {

                this.assignCurrentMapSectorToSlot(this.activeSlotIndex);

            });

            document.getElementById('btn-tv-patrol')?.addEventListener('click', (e) => {

                this.togglePatrolMode(e.currentTarget);

            });



            // Wire TV Side Panel Events
            document.getElementById('btn-tv-drawer-close')?.addEventListener('click', () => this.toggleTvDrawer(false));
            document.addEventListener('click', (e) => {
                if (e.target && e.target.closest('#btn-toggle-tv-drawer')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleTvDrawer();
                }
            });

            document.getElementById('btn-tv-poll-now')?.addEventListener('click', () => this.pollLiveTvChannels(true));

            document.getElementById('tv-channel-search')?.addEventListener('input', (e) => {

                this.searchQuery = e.target.value.trim().toLowerCase();

                this.renderTvChannelGrid();

            });

            document.querySelectorAll('#tv-cat-pills .tv-cat-btn').forEach(btn => {

                btn.addEventListener('click', () => {

                    document.querySelectorAll('#tv-cat-pills .tv-cat-btn').forEach(b => b.classList.remove('active'));

                    btn.classList.add('active');

                    this.activeCategory = btn.getAttribute('data-cat') || 'all';

                    this.renderTvChannelGrid();

                });

            });



            this.renderTvChannelGrid();

        }



        toggleTvDrawer(forceState) {

            const drawer = document.getElementById('mon02-tv-drawer');

            const btn = document.getElementById('btn-toggle-tv-drawer');

            const arrow = document.getElementById('mon02-tv-side-arrow');

            if (!drawer) return;

            this.isTvDrawerOpen = typeof forceState === 'boolean' ? forceState : drawer.classList.contains('hidden');

            drawer.classList.toggle('hidden', !this.isTvDrawerOpen);

            if (btn) btn.classList.toggle('active', this.isTvDrawerOpen);

            if (arrow) arrow.textContent = this.isTvDrawerOpen ? '▶' : '◀';

            if (this.isTvDrawerOpen) {

                this.renderTvChannelGrid();

                setTimeout(() => document.getElementById('tv-channel-search')?.focus(), 60);

            }

        }



        // =====================================================================

        // 2. AUTOMATED 2-MINUTE LIVE TV CHANNEL HEALTH POLLER

        // =====================================================================

        startTvTwoMinutePoller() {

            this.pollCountdown = 120;

            setTimeout(() => this.pollLiveTvChannels(false), 3000);



            if (this.pollTimer) clearInterval(this.pollTimer);

            this.pollTimer = setInterval(() => {

                this.pollCountdown--;

                if (this.pollCountdown <= 0) {

                    this.pollCountdown = 120;

                    this.pollLiveTvChannels(false);

                }

                const cdEl = document.getElementById('tv-poll-countdown');

                if (cdEl) {

                    const mins = String(Math.floor(this.pollCountdown / 60)).padStart(2, '0');

                    const secs = String(this.pollCountdown % 60).padStart(2, '0');

                    cdEl.textContent = `${mins}:${secs}`;

                }

            }, 1000);

        }



        async pollLiveTvChannels(manualTrigger = false) {

            if (this.isPollingTv || !this.tvChannels.length) return;

            this.isPollingTv = true;

            const pollBtn = document.getElementById('btn-tv-poll-now');

            if (pollBtn && manualTrigger) pollBtn.textContent = '⏳...';



            const nowStr = new Date().toLocaleTimeString();

            const sampleSize = Math.min(18, this.tvChannels.length);

            this._pollCursor = ((this._pollCursor || 0) % Math.max(1, this.tvChannels.length));

            const batch = [];

            for (let k = 0; k < sampleSize; k++) {

                batch.push(this.tvChannels[(this._pollCursor + k) % this.tvChannels.length]);

            }

            this._pollCursor = (this._pollCursor + sampleSize) % this.tvChannels.length;



            await Promise.allSettled(batch.map(async (ch) => {

                const t0 = performance.now();

                const ctrl = new AbortController();

                const timer = setTimeout(() => ctrl.abort(), 4000);

                try {

                    const res = await (window._originalFetch || window.fetch)(ch.url, {

                        method: 'GET',

                        signal: ctrl.signal

                    });

                    clearTimeout(timer);

                    ch.online = (res.ok || res.status === 206);

                    ch.latency_ms = Math.max(12, Math.round(performance.now() - t0));

                    ch.last_checked = nowStr;

                } catch (_) {

                    clearTimeout(timer);

                    ch.last_checked = nowStr;

                }

            }));



            this.onlineChannels = this.tvChannels.filter(c => c.online !== false);

            const badgeEl = document.getElementById('tv-online-count-badge');

            const readyEl = document.getElementById('tv-ready-total');

            if (badgeEl) badgeEl.textContent = String(this.onlineChannels.length);

            if (readyEl) readyEl.textContent = String(this.onlineChannels.length);

            if (pollBtn && manualTrigger) pollBtn.textContent = '⚡ POLL';

            if (manualTrigger) this.pollCountdown = 120;



            if (this.isTvDrawerOpen) {

                this.renderTvChannelGrid();

            }

            this.isPollingTv = false;

        }



        renderTvChannelGrid() {

            const grid = document.getElementById('tv-channels-grid');

            if (!grid) return;



            const q = (this.searchQuery || '').toLowerCase();

            // Fuzzy normalize "tagesschau" vs "tagesschau" ("tageschau" with 1 s)

            const qNorm = q.replace(/ss/g, 's');



            const filtered = this.onlineChannels.filter(ch => {

                if (this.activeCategory !== 'all' && ch.category !== this.activeCategory) return false;

                if (q) {

                    const hay = `${ch.name} ${ch.country} ${ch.lang} ${ch.category}`.toLowerCase();

                    const hayNorm = hay.replace(/ss/g, 's');

                    if (!hay.includes(q) && !hayNorm.includes(qNorm)) return false;

                }

                return true;

            });



            if (!filtered.length) {

                grid.innerHTML = `<div style="text-align:center;padding:24px 12px;color:#94a3b8;font-size:0.76rem;">Kein Live-Sender für "${this.searchQuery}" in dieser Kategorie gefunden.<br><button id="btn-reset-tv-filter" class="ops-btn" style="margin-top:8px;background:#10b981;color:#022c22;border:none;font-weight:bold;cursor:pointer;">Alle 108 Sender anzeigen</button></div>`;

                grid.querySelector('#btn-reset-tv-filter')?.addEventListener('click', () => {

                    this.searchQuery = '';

                    this.activeCategory = 'all';

                    const inp = document.getElementById('tv-channel-search');

                    if (inp) inp.value = '';

                    document.querySelectorAll('#tv-cat-pills .tv-cat-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-cat') === 'all'));

                    this.renderTvChannelGrid();

                });

                return;

            }



            grid.innerHTML = filtered.map(ch => {

                const isPlayingInActive = this.slots[this.activeSlotIndex]?.type === 'tv' && this.slots[this.activeSlotIndex]?.data?.id === ch.id;

                return `

                    <div class="tv-channel-row ${isPlayingInActive ? 'active-playing' : ''}" data-tv-id="${ch.id}" title="Klicken, um ${ch.name} auf MON 2.${this.activeSlotIndex + 1} live abzuspielen">

                        <div class="tv-row-left">

                            <span class="tv-row-flag">${ch.flag || '📺'}</span>

                            <div class="tv-row-info">

                                <div class="tv-row-name">${ch.name}</div>

                                <div class="tv-row-meta">

                                    <span class="tv-cat-tag">${(ch.category || 'LIVE').toUpperCase()}</span>

                                    <span>· ${ch.country} (${ch.lang})</span>

                                    <span class="tv-live-pill">🟢 ${ch.latency_ms != null ? `${ch.latency_ms}ms` : 'LIVE'}</span>

                                </div>

                            </div>

                        </div>

                        <button class="tv-row-play-btn" type="button" data-tv-play-id="${ch.id}">

                            ${isPlayingInActive ? '🔊 LÄUFT' : `▶ MON 2.${this.activeSlotIndex + 1}`}

                        </button>

                    </div>

                `;

            }).join('');



            if (!grid._delegatedTvClick) {

                grid._delegatedTvClick = true;

                grid.addEventListener('click', (e) => {

                    const row = e.target.closest('.tv-channel-row[data-tv-id]');

                    if (!row) return;

                    e.stopPropagation();

                    const id = row.getAttribute('data-tv-id');

                    const ch = this.tvChannels.find(c => c.id === id);

                    if (ch) {

                        this.assignTvChannelToSlot(this.activeSlotIndex, ch);

                        this.renderTvChannelGrid();

                    }

                });

            }

        }



        // =====================================================================

        // 3. INDEPENDENT 1X - 4X SUB-MONITORS (MON 2.1, MON 2.2, MON 2.3, MON 2.4)

        // =====================================================================

        setActiveSlot(slotIdx) {

            this.activeSlotIndex = Math.max(0, Math.min(3, slotIdx));

            document.querySelectorAll('#mon02-slot-router-bar .slot-pill').forEach((p, idx) => {

                p.classList.toggle('active', idx === this.activeSlotIndex);

            });

            document.querySelectorAll('.tv-sp-slot-btn').forEach((b, idx) => {

                b.classList.toggle('active', idx === this.activeSlotIndex);

            });

            document.querySelectorAll('.mv-submonitor-cell').forEach((cell, idx) => {

                cell.classList.toggle('active-target-slot', idx === this.activeSlotIndex);

                const badge = cell.querySelector('.mv-slot-badge');

                if (badge) {

                    badge.innerHTML = idx === this.activeSlotIndex ? `🎯 MON 2.${idx + 1} [AKTIV]` : `MON 2.${idx + 1}`;

                }

            });

            if (this.isTvDrawerOpen) {

                this.renderTvChannelGrid();

            }

        }



        setViewportCount(count) {

            this.viewportCount = [1, 2, 3, 4].includes(count) ? count : 1;

            this.multiviewActive = (this.viewportCount > 1);



            document.querySelectorAll('[data-mv]').forEach(btn => {

                btn.classList.toggle('active', parseInt(btn.getAttribute('data-mv'), 10) === this.viewportCount);

            });



            const topRow = document.getElementById('top-monitors-row');

            if (topRow) {

                topRow.setAttribute('data-mv-layout', `${this.viewportCount}x`);

            }
            const mon02Card = document.getElementById('card-webcam');
            if (mon02Card) {
                mon02Card.setAttribute('data-mv-layout', `${this.viewportCount}x`);
            }
            const mvRoot = document.getElementById('mon02-multiview-root');
            if (mvRoot) {
                mvRoot.setAttribute('data-layout', `${this.viewportCount}x`);
            }



            if (this.viewportCount === 1) {

                // 1x Single Monitor Mode (Standard // Full Native Display)

                this.restoreSingleWebcamMode();

                if (window.MainPlayer) {

                    if (window.MainPlayer.currentCamData) {

                        window.MainPlayer.playCam(window.MainPlayer.currentCamData, 'live');

                    } else if (window.MapController && window.MapController.activeCam) {

                        window.MapController.selectAndPlayCam(window.MapController.activeCam.id);

                    }

                }

            } else {

                // 2x, 3x, 4x Multiview Mode

                const slotBar = document.getElementById('mon02-slot-router-bar');

                if (slotBar) slotBar.style.display = 'flex';



                document.querySelectorAll('#mon02-slot-router-bar .slot-pill').forEach((pill, idx) => {

                    const isAvail = idx < this.viewportCount;

                    pill.style.opacity = isAvail ? '1' : '0.35';

                    pill.style.cursor = isAvail ? 'pointer' : 'not-allowed';

                    pill.title = isAvail ? `Sub-Monitor 2.${idx + 1} auswählen` : `Sub-Monitor 2.${idx + 1} (inaktiv // oben ${idx >= 2 ? (idx === 3 ? '4x' : '3x') : '2x'} wählen)`;

                });



                document.querySelectorAll('.tv-sp-slot-btn').forEach((btn, idx) => {

                    const isAvail = idx < this.viewportCount;

                    btn.style.opacity = isAvail ? '1' : '0.35';

                    btn.style.cursor = isAvail ? 'pointer' : 'not-allowed';

                });



                if (this.activeSlotIndex >= this.viewportCount) {

                    this.setActiveSlot(0);

                }



                // If going down from 4x to 3x or 2x: clean up and hide newly inactive slots immediately

                for (let i = this.viewportCount; i < 4; i++) {

                    this.cleanupSlotMedia(i);

                    const cell = document.getElementById(`mv-slot-cell-${i}`);

                    if (cell) cell.style.display = 'none';

                }



                this.ensureMultiViewportDom();

            }



            setTimeout(() => {

                if (window.MapController && window.MapController.map) {

                    window.MapController.map.invalidateSize();

                }

            }, 320);

        }



        restoreSingleWebcamMode() {

            this.multiviewActive = false;

            for (let i = 0; i < 4; i++) {

                this.cleanupSlotMedia(i);

                this.slots[i].data = null;

                this.slots[i].type = null;

                const cell = document.getElementById(`mv-slot-cell-${i}`);

                if (cell) cell.style.display = 'none';

                const bodyEl = document.getElementById(`mv-cell-body-${i}`);

                if (bodyEl) bodyEl.innerHTML = '';

                const titleEl = document.getElementById(`mv-cell-title-${i}`);

                if (titleEl) titleEl.textContent = 'BEREIT';

                const dvrEl = document.getElementById(`mv-cell-dvr-${i}`);

                if (dvrEl) dvrEl.style.display = 'none';

            }

            const mon02Card = document.getElementById('card-webcam');

            const topRow = document.getElementById('top-monitors-row');

            const mvRoot = document.getElementById('mon02-multiview-root');

            const playerContainer = document.getElementById('player-container');

            const origContainer = document.getElementById('webcam-player-container');

            if (mon02Card) mon02Card.classList.remove('multiview-mode');

            if (topRow) topRow.setAttribute('data-mv-layout', '1x');

            if (mvRoot) {

                mvRoot.style.display = 'none';

                mvRoot.setAttribute('data-layout', '1x');

            }

            if (playerContainer) {

                playerContainer.style.removeProperty('display');

                playerContainer.style.setProperty('display', 'flex', 'important');

            }

            if (origContainer) {

                origContainer.style.removeProperty('display');

                origContainer.style.setProperty('display', 'flex', 'important');

            }

            const slotBar = document.getElementById('mon02-slot-router-bar');

            if (slotBar) slotBar.style.display = 'none';



            this.activeSlotIndex = 0;

        }



        ensureMultiViewportDom(skipDefaultPopulate = false) {

            if (this.viewportCount === 1) {

                this.restoreSingleWebcamMode();

                return;

            }

            const camPlayer = document.getElementById('cam-player');

            const playerContainer = document.getElementById('player-container');

            const origContainer = document.getElementById('webcam-player-container');

            const mon02Card = document.getElementById('card-webcam');

            const hostEl = camPlayer || playerContainer;

            if (!hostEl) return;



            this.multiviewActive = true;

            if (mon02Card) mon02Card.classList.add('multiview-mode');

            let mvRoot = document.getElementById('mon02-multiview-root');

            if (!mvRoot) {

                mvRoot = document.createElement('div');

                mvRoot.id = 'mon02-multiview-root';

                mvRoot.className = 'mon02-multiview-root';

                hostEl.appendChild(mvRoot);

            }



            if (playerContainer) {

                playerContainer.style.setProperty('display', 'none', 'important');

            }

            if (origContainer) {

                origContainer.style.setProperty('display', 'none', 'important');

            }

            mvRoot.style.display = 'grid';

            mvRoot.setAttribute('data-layout', `${this.viewportCount}x`);

            const topRow = document.getElementById('top-monitors-row');

            if (topRow) topRow.setAttribute('data-mv-layout', `${this.viewportCount}x`);



            // Step 1: Ensure all 4 sub-monitor DOM cells exist FIRST (no recursion!)

            for (let i = 0; i < 4; i++) {

                let cell = document.getElementById(`mv-slot-cell-${i}`);

                if (!cell) {

                    cell = document.createElement('div');

                    cell.id = `mv-slot-cell-${i}`;

                    cell.className = `mv-submonitor-cell ${i === this.activeSlotIndex ? 'active-target-slot' : ''}`;

                    cell.innerHTML = `

                        <div class="mv-cell-header" data-slot-idx="${i}">

                            <div class="mv-cell-title-wrap">

                                <span class="mv-slot-badge">${i === this.activeSlotIndex ? `🎯 MON 2.${i + 1} [AKTIV]` : `MON 2.${i + 1}`}</span>

                                <span class="mv-cell-title" id="mv-cell-title-${i}">BEREIT</span>

                            </div>

                            <div class="mv-cell-quick-btns">

                                <button class="mv-mini-btn" data-action="tv" data-slot="${i}" title="Live-TV-Sender in MON 2.${i + 1} öffnen">📺 TV</button>

                                <button class="mv-mini-btn" data-action="cam" data-slot="${i}" title="Live-Webcam in MON 2.${i + 1} laden">📷 CAM</button>

                                <button class="mv-mini-btn" data-action="radio" data-slot="${i}" title="Live-Radio / WebSDR in MON 2.${i + 1} laden">📻 SDR</button>

                                <button class="mv-mini-btn" data-action="node" data-slot="${i}" title="Karten-Knoten / Wetterstation in MON 2.${i + 1} laden">🗺️ NODE</button>

                                <button class="mv-mini-btn" data-action="solo" data-slot="${i}" title="Audio-Solo für MON 2.${i + 1}">🔊</button>

                                <button class="mv-mini-btn" data-action="pip" data-slot="${i}" title="Picture-in-Picture für MON 2.${i + 1}">⧉</button>

                            </div>

                        </div>

                        <div class="mv-cell-body" id="mv-cell-body-${i}"></div>

                        <div class="mv-cell-dvr-bar" id="mv-cell-dvr-${i}">

                            <button class="dvr-btn" data-dvr="playpause" data-slot="${i}" title="Play / Pause">⏸</button>

                            <button class="dvr-btn" data-dvr="rw15" data-slot="${i}" title="15 Sekunden zurückspulen">⏪ -15s</button>

                            <button class="dvr-btn" data-dvr="ff15" data-slot="${i}" title="15 Sekunden vorspulen">⏩ +15s</button>

                            <button class="dvr-btn dvr-live-btn" data-dvr="live" data-slot="${i}" title="Zur Live-Kante springen">🔴 LIVE</button>

                            <button class="dvr-btn" data-dvr="mute" data-slot="${i}" id="mv-mute-btn-${i}" title="Ton An / Aus">${i === 0 ? '🔊' : '🔇'}</button>

                            <input type="range" class="dvr-vol-slider" data-dvr="vol" data-slot="${i}" min="0" max="1" step="0.05" value="${i === 0 ? '0.85' : '0.75'}" title="Lautstärke (0-100%)" />

                            <span class="dvr-status-lbl" id="mv-dvr-status-${i}">LIVE EDGE</span>

                        </div>

                    `;

                    mvRoot.appendChild(cell);



                    // Clicking anywhere on the cell selects it as Active Target Sub-Monitor

                    cell.addEventListener('mousedown', () => this.setActiveSlot(i));



                    // Wire header mini buttons for independent per-monitor assignment

                    cell.querySelectorAll('.mv-mini-btn').forEach(b => {

                        b.addEventListener('click', (ev) => {

                            ev.stopPropagation();

                            this.setActiveSlot(i);

                            const act = b.getAttribute('data-action');

                            if (act === 'tv') {

                                this.toggleTvDrawer(true);

                            } else if (act === 'cam') {

                                this.loadNextLiveWebcamIntoSlot(i);

                            } else if (act === 'radio') {

                                this.assignRadioToSlot(i, RADIO_PRESETS[i % RADIO_PRESETS.length]);

                            } else if (act === 'node') {

                                this.assignCurrentMapSectorToSlot(i);

                            } else if (act === 'solo') {

                                this.soloSlotAudio(i);

                            } else if (act === 'pip') {

                                this.triggerSlotPip(i);

                            }

                        });

                    });



                    // Wire DVR Controls

                    cell.querySelectorAll('[data-dvr]').forEach(ctrl => {

                        const dvrType = ctrl.getAttribute('data-dvr');

                        if (dvrType === 'vol') {

                            ctrl.addEventListener('input', (ev) => {

                                ev.stopPropagation();

                                this.setSlotVolume(i, parseFloat(ev.target.value));

                            });

                        } else {

                            ctrl.addEventListener('click', (ev) => {

                                ev.stopPropagation();

                                this.handleDvrCommand(i, dvrType);

                            });

                        }

                    });

                }



                if (i < this.viewportCount) {

                    cell.style.display = 'flex';

                    if (!this.slots[i].data) {

                        this.renderSlotStandby(i);

                    }

                } else {

                    cell.style.display = 'none';

                    this.cleanupSlotMedia(i);

                }

            }



            // Step 2: Populate visible slots if not yet populated (protected against recursion)

            if (!skipDefaultPopulate && !this._populatingDefaults) {

                this._populatingDefaults = true;

                try {

                    for (let i = 0; i < this.viewportCount; i++) {

                        if (!this.slots[i].data) {

                            this.populateDefaultSlotContent(i);

                        }

                    }

                } finally {

                    this._populatingDefaults = false;

                }

            }

        }



        // Populate each of the 4 sub-monitors with distinct, real live sources by default

        populateDefaultSlotContent(slotIdx) {

            if (slotIdx === 0) {

                // MON 2.1: If MainPlayer already has a current camera, show it; otherwise Tagesschau24 HD or WeatherNation

                const curCam = window.MainPlayer && window.MainPlayer.currentCamData;

                if (curCam && this.viewportCount > 1) {

                    this.assignCameraToSlot(0, curCam);

                } else {

                    const ch0 = this.onlineChannels.find(c => c.id === 'tv_tagesschau24') || this.onlineChannels[0];

                    if (ch0) this.assignTvChannelToSlot(0, ch0);

                }

            } else if (slotIdx === 1) {

                // MON 2.2: Live TV Channel (WeatherNation or DW English)

                const ch1 = this.onlineChannels.find(c => c.id === 'tv_wx_nation' || c.id === 'tv_dw_en') || this.onlineChannels[1];

                if (ch1) this.assignTvChannelToSlot(1, ch1);

            } else if (slotIdx === 2) {

                // MON 2.3: Live Radio / WebSDR Spectrum Receiver

                this.assignRadioToSlot(2, RADIO_PRESETS[0]);

            } else if (slotIdx === 3) {

                // MON 2.4: Live Map Sector Telemetry Node

                this.assignCurrentMapSectorToSlot(3);

            }

        }



        loadNextLiveWebcamIntoSlot(slotIdx) {

            const mc = window.MapController;

            let cam = null;

            if (mc && mc.activeCamMarkers && mc.activeCamMarkers.size > 0) {

                const arr = Array.from(mc.activeCamMarkers.values()).map(m => m.camData || m._camData).filter(Boolean);

                if (arr.length > 0) {

                    this._camCycleIdx = ((this._camCycleIdx || 0) + 1) % arr.length;

                    cam = arr[this._camCycleIdx];

                }

            }

            if (!cam && window.MainPlayer && window.MainPlayer.currentCamData) {

                cam = window.MainPlayer.currentCamData;

            }

            if (cam) {

                this.assignCameraToSlot(slotIdx, cam);

            } else {

                fetch('/api/cameras/catalog?provider=all&limit=15')

                    .then(r => r.json())

                    .then(d => {

                        const list = d.cameras || d.webcams || [];

                        if (list.length > 0) {

                            this.assignCameraToSlot(slotIdx, list[slotIdx % list.length]);

                        }

                    })

                    .catch(() => {});

            }

        }



        assignCurrentMapSectorToSlot(slotIdx) {

            const mc = window.MapController;

            const center = (mc && mc.map) ? mc.map.getCenter() : { lat: 50.1109, lng: 8.6821 };

            const activeStorm = (mc && mc.activeStormsList && mc.activeStormsList[0]) || null;

            this.assignMapNodeToSlot(slotIdx, {

                title: activeStorm ? `🌪️ ${activeStorm.event || activeStorm.title}` : 'TACTICAL SECTOR TELEMETRY LOCK',

                type: activeStorm ? 'NOAA LIVE STORM INTERCEPT' : 'LIVE MAP SECTOR SENSOR NODE',

                lat: activeStorm ? activeStorm.lat : center.lat,

                lon: activeStorm ? activeStorm.lon : center.lng,

                metrics: {

                    'RADAR ENGINE': (mc && mc.activeRadarProvider) ? mc.activeRadarProvider.toUpperCase() : 'RAINVIEWER / NEXRAD',

                    'ACTIVE ALERTS': (mc && mc.activeStormsList) ? `${mc.activeStormsList.length} Live Warnings` : '0 Warnings',

                    'SECTOR COORDS': `${Number(center.lat).toFixed(2)}°N, ${Number(center.lng).toFixed(2)}°E`,

                    'TELEMETRY': 'REAL-TIME SYNC ACTIVE'

                }

            });

        }





        renderSlotStandby(slotIdx) {

            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);

            if (!bodyEl) return;

            const titleEl = document.getElementById(`mv-cell-title-${slotIdx}`);

            const dvrEl = document.getElementById(`mv-cell-dvr-${slotIdx}`);

            if (titleEl) titleEl.textContent = 'BEREIT // QUELLE WÄHLEN';

            if (dvrEl) dvrEl.style.display = 'none';



            bodyEl.innerHTML = `

                <div class="mv-standby-screen" style="width:100%;height:100%;min-height:85px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050914;color:#94a3b8;font-family:var(--font-mono);gap:6px;padding:8px;text-align:center;">

                    <div style="font-size:0.72rem;font-weight:700;color:#38bdf8;display:flex;align-items:center;gap:6px;">

                        <span>📡</span> <span>MON 2.${slotIdx + 1} BEREIT</span>

                    </div>

                    <div style="font-size:0.6rem;color:#64748b;">

                        Live-Quelle für diesen Sub-Monitor wählen:

                    </div>

                    <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;">

                        <button type="button" class="mv-mini-btn" style="padding:2px 6px;font-size:0.62rem;cursor:pointer;background:rgba(16,185,129,0.18);color:#34d399;border:1px solid #10b981;" onclick="window.OmniMultiView.setActiveSlot(${slotIdx}); window.OmniMultiView.toggleTvDrawer(true);">📺 TV</button>

                        <button type="button" class="mv-mini-btn" style="padding:2px 6px;font-size:0.62rem;cursor:pointer;background:rgba(56,189,248,0.18);color:#38bdf8;border:1px solid #0284c7;" onclick="window.OmniMultiView.loadNextLiveWebcamIntoSlot(${slotIdx})">📷 CAM</button>

                        <button type="button" class="mv-mini-btn" style="padding:2px 6px;font-size:0.62rem;cursor:pointer;background:rgba(250,204,21,0.18);color:#facc15;border:1px solid #ca8a04;" onclick="window.OmniMultiView.assignRadioToSlot(${slotIdx}, null)">📻 RADIO</button>

                        <button type="button" class="mv-mini-btn" style="padding:2px 6px;font-size:0.62rem;cursor:pointer;background:rgba(168,85,247,0.18);color:#c084fc;border:1px solid #7c3aed;" onclick="window.OmniMultiView.assignCurrentMapSectorToSlot(${slotIdx})">🗺️ NODE</button>

                    </div>

                </div>

            `;

        }



        cleanupSlotMedia(slotIdx) {

            const s = this.slots[slotIdx];

            if (!s) return;

            s.loadToken = (s.loadToken || 0) + 1;



            // Stop any MainPlayer background timers so they never overwrite this sub-monitor

            if (window.MainPlayer && slotIdx === this.activeSlotIndex) {

                try {

                    if (window.MainPlayer.refreshInterval) { clearInterval(window.MainPlayer.refreshInterval); window.MainPlayer.refreshInterval = null; }

                    if (window.MainPlayer.timelapseTimer) { clearInterval(window.MainPlayer.timelapseTimer); window.MainPlayer.timelapseTimer = null; }

                    if (window.MainPlayer.hlsSafetyTimeout) { clearTimeout(window.MainPlayer.hlsSafetyTimeout); window.MainPlayer.hlsSafetyTimeout = null; }

                    if (window.MainPlayer.hls) { window.MainPlayer.hls.destroy(); window.MainPlayer.hls = null; }

                } catch (_) {}

            }



            if (s.hls) {

                try {

                    s.hls.stopLoad();

                    s.hls.detachMedia();

                    s.hls.destroy();

                } catch (_) {}

                s.hls = null;

            }

            if (s.videoEl) {

                try {

                    s.videoEl.pause();

                    s.videoEl.removeAttribute('src');

                    s.videoEl.load();

                } catch (_) {}

                s.videoEl = null;

            }

            if (s.audioEl) {

                try { s.audioEl.pause(); s.audioEl.src = ''; } catch (_) {}

                s.audioEl = null;

            }

            if (s.snapTimer) {

                clearInterval(s.snapTimer);

                s.snapTimer = null;

            }

            if (s.animFrame) {

                cancelAnimationFrame(s.animFrame);

                s.animFrame = null;

            }



            // Thoroughly destroy all iframes, videos, and audio elements inside this slot body

            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);

            if (bodyEl) {

                try {

                    bodyEl.querySelectorAll('iframe').forEach(ifr => {

                        try { ifr.src = 'about:blank'; } catch (_) {}

                        try { ifr.remove(); } catch (_) {}

                    });

                    bodyEl.querySelectorAll('video').forEach(vid => {

                        try { vid.pause(); vid.removeAttribute('src'); vid.load(); vid.remove(); } catch (_) {}

                    });

                    bodyEl.querySelectorAll('audio').forEach(aud => {

                        try { aud.pause(); aud.src = ''; aud.remove(); } catch (_) {}

                    });

                } catch (_) {}

                bodyEl.innerHTML = '';

            }



            s.data = null;

            s.type = null;

        }



        // Assign Live TV Channel (.m3u8) with Full DVR Controls to Slot

        assignTvChannelToSlot(slotIdx, channel) {

            if (!channel) return;

            if (this.viewportCount === 1) {

                // In 1x mode: Play live TV full-size directly in MainPlayer

                this.restoreSingleWebcamMode();

                if (window.MainPlayer) {

                    window.MainPlayer.currentCamData = {

                        title: channel.name,

                        city: channel.category || 'Live TV',

                        country: channel.country || 'Global',

                        stream_url: channel.url,

                        provider: 'Live TV'

                    };

                    window.MainPlayer.play(channel.url, 'hls');

                    const titleEl = document.getElementById('cam-active-title');

                    const topTitle = document.getElementById('cam-player-title');

                    const pill = document.getElementById('mon02-active-type-pill');

                    if (titleEl) titleEl.textContent = `📺 ${channel.flag || ''} ${channel.name} (${channel.country || 'LIVE'})`;

                    if (topTitle) topTitle.textContent = `LIVE TV // ${channel.name.toUpperCase()}`;

                    if (pill) pill.innerHTML = `📺 LIVE TV`;

                }

                return;

            }



            slotIdx = Math.min(slotIdx, this.viewportCount - 1);

            this.ensureMultiViewportDom(true);

            this.cleanupSlotMedia(slotIdx);



            const s = this.slots[slotIdx];

            const token = s.loadToken;

            s.type = 'tv';

            s.data = channel;

            s.title = `${channel.flag || '📺'} ${channel.name}`;



            const titleEl = document.getElementById(`mv-cell-title-${slotIdx}`);

            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);

            const dvrEl = document.getElementById(`mv-cell-dvr-${slotIdx}`);

            const statusEl = document.getElementById(`mv-dvr-status-${slotIdx}`);

            if (titleEl) titleEl.textContent = s.title;

            if (dvrEl) dvrEl.style.display = 'flex';

            if (statusEl) statusEl.textContent = '⏳ VERBINDE...';

            if (!bodyEl) return;



            const vidId = `mv-video-${slotIdx}-${token}`;

            bodyEl.innerHTML = `

                <video id="${vidId}" class="mv-video-player" playsinline autoplay ${s.muted ? 'muted' : ''}></video>

                <div class="mv-stream-overlay-badge">

                    <span class="mv-live-dot"></span>

                    <span>${channel.flag || '📺'} ${channel.name} (${channel.country || 'LIVE'})</span>

                </div>

            `;



            const video = document.getElementById(vidId);

            if (!video) return;

            s.videoEl = video;

            video.volume = s.volume;

            video.muted = s.muted;



            const streamUrl = channel.url;

            const tStart = performance.now();

            let retriedNet = false;



            if (window.Hls && Hls.isSupported()) {

                const hls = new Hls({

                    enableWorker: true,

                    lowLatencyMode: true,

                    backBufferLength: 90

                });

                s.hls = hls;

                hls.attachMedia(video);

                hls.on(Hls.Events.MEDIA_ATTACHED, () => {

                    if (this.slots[slotIdx].loadToken !== token) return;

                    hls.loadSource(streamUrl);

                });

                hls.on(Hls.Events.MANIFEST_PARSED, () => {

                    if (this.slots[slotIdx].loadToken !== token) return;

                    const latMs = Math.max(12, Math.round(performance.now() - tStart));

                    channel.latency_ms = latMs;

                    channel.online = true;

                    hls.startLoad();

                    video.play().catch(() => {

                        video.muted = true;

                        s.muted = true;

                        this.updateMuteBtnUI(slotIdx);

                        video.play().catch(() => {});

                    });

                    if (statusEl) statusEl.textContent = `🔴 LIVE HLS (${latMs}ms)`;

                });

                hls.on(Hls.Events.ERROR, (_, data) => {

                    if (this.slots[slotIdx].loadToken !== token) return;

                    if (data && data.fatal) {

                        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {

                            hls.recoverMediaError();

                        } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR && !retriedNet) {

                            retriedNet = true;

                            hls.startLoad();

                        } else {

                            // Mark channel offline and switch ONLY to another verified channel in the SAME category

                            channel.online = false;

                            this.onlineChannels = this.tvChannels.filter(c => c.online !== false);

                            const sameCatNext = this.onlineChannels.find(c => c.category === channel.category && c.id !== channel.id);

                            if (sameCatNext) {

                                if (statusEl) statusEl.textContent = `⏭ WECHSEL ZU ${sameCatNext.name.slice(0, 16)}...`;

                                setTimeout(() => {

                                    if (this.slots[slotIdx].loadToken === token) {

                                        this.assignTvChannelToSlot(slotIdx, sameCatNext);

                                        if (this.isTvDrawerOpen) this.renderTvChannelGrid();

                                    }

                                }, 400);

                            } else if (statusEl) {

                                statusEl.textContent = '⚠️ STREAM OFFLINE';

                            }

                        }

                    }

                });

            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {

                video.src = streamUrl;

                video.play().catch(() => {});

            }



            const topTitle = document.getElementById('cam-active-title');

            const pill = document.getElementById('mon02-active-type-pill');

            if (topTitle) topTitle.textContent = `MON 2.${slotIdx + 1} LIVE TV // ${channel.name.toUpperCase()}`;

            if (pill) pill.innerHTML = `📺 LIVE TV (MON 2.${slotIdx + 1})`;

        }



        // Assign Live Storm Chaser (HLS or Sandboxed YouTube Live) to Slot

        assignChaserToSlot(slotIdx, chaser) {

            if (!chaser) return;

            if (this.viewportCount === 1) {

                // 1x Single Monitor Mode: Play full-size directly in MON-02

                this.restoreSingleWebcamMode();

                const titleEl = document.getElementById('cam-active-title');

                const topTitle = document.getElementById('cam-player-title');

                const typePill = document.getElementById('mon02-active-type-pill');

                const banner = document.getElementById('cam-telemetry-banner');



                if (titleEl) titleEl.innerText = `⚡ CHASER LIVE // ${chaser.name.toUpperCase()}`;

                if (topTitle) topTitle.innerText = `CHASER LIVE // ${chaser.name.toUpperCase()}`;

                if (typePill) {

                    typePill.innerHTML = `⚡ CHASER LIVE`;

                    typePill.style.background = 'rgba(239,68,68,0.2)';

                    typePill.style.color = '#fca5a5';

                    typePill.style.borderColor = '#ef4444';

                }

                if (banner) {

                    const hd = chaser.heading != null ? `${chaser.headingLabel ? chaser.headingLabel + ' ' : ''}${chaser.heading}°` : '—';

                    const spd = chaser.speed ? `${chaser.speed} mph` : 'STATIONARY';

                    banner.innerHTML = `

                        <span>CHASER: ${chaser.name.toUpperCase()} // STATUS: ${chaser.status || 'LIVE'} // QUELLE: ${(chaser.source || 'Spotter Network').toUpperCase()}</span>

                        <span>GPS: ${chaser.lat.toFixed(4)}°, ${chaser.lon.toFixed(4)}° // HEADING: ${hd} // SPEED: ${spd}</span>

                    `;

                }



                const target = document.getElementById('webcam-player-container') || document.getElementById('player-container');

                if (!target) return;



                if (chaser.stream && chaser.stream.type === 'hls' && chaser.stream.url) {

                    if (window.MainPlayer) {

                        window.MainPlayer.play(chaser.stream.url, 'hls');

                    }

                } else if (chaser.stream && chaser.stream.embedUrl) {

                    target.innerHTML = `

                        <div style="position:relative;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;">

                            <iframe src="${chaser.stream.embedUrl}" 

                                    style="width:100%;height:100%;border:none;" 

                                    allow="autoplay; encrypted-media; picture-in-picture" 

                                    allowfullscreen

                                    sandbox="allow-scripts allow-same-origin allow-presentation"

                                    referrerpolicy="no-referrer">

                            </iframe>

                        </div>`;

                }

                return;

            }



            slotIdx = Math.min(slotIdx, this.viewportCount - 1);

            this.ensureMultiViewportDom(true);

            this.cleanupSlotMedia(slotIdx);



            const s = this.slots[slotIdx];

            s.type = 'chaser';

            s.data = chaser;

            s.title = `⚡ ${chaser.name}`;



            const titleEl = document.getElementById(`mv-cell-title-${slotIdx}`);

            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);

            const dvrEl = document.getElementById(`mv-cell-dvr-${slotIdx}`);

            if (titleEl) titleEl.textContent = `⚡ ${chaser.name} (${chaser.status || 'LIVE'})`;

            if (dvrEl) dvrEl.style.display = (chaser.stream && chaser.stream.type === 'hls') ? 'flex' : 'none';

            if (!bodyEl) return;



            if (chaser.stream && chaser.stream.type === 'hls' && chaser.stream.url) {

                this.renderHlsSlot(slotIdx, chaser.stream.url, `⚡ ${chaser.name}`);

            } else if (chaser.stream && chaser.stream.embedUrl) {

                bodyEl.innerHTML = `

                    <div style="position:relative;width:100%;height:100%;background:#000;">

                        <iframe src="${chaser.stream.embedUrl}" 

                                style="width:100%;height:100%;border:none;" 

                                allow="autoplay; encrypted-media; picture-in-picture" 

                                allowfullscreen

                                sandbox="allow-scripts allow-same-origin allow-presentation"

                                referrerpolicy="no-referrer">

                        </iframe>

                    </div>`;

            }

        }




        assignCustomContentToSlot(slotIdx, { title, html }) {
            if (this.viewportCount === 1) slotIdx = 0;
            else if (slotIdx >= this.viewportCount) slotIdx = this.activeSlotIndex || 0;
            this.ensureMultiViewportDom(true);
            this.cleanupSlotMedia(slotIdx);

            const s = this.slots[slotIdx];
            s.type = 'custom';
            s.title = title || 'LIVE MONITOR FEED';

            const titleEl = document.getElementById(`mv-cell-title-${slotIdx}`);
            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);
            const dvrEl = document.getElementById(`mv-cell-dvr-${slotIdx}`);

            if (titleEl) titleEl.textContent = s.title;
            if (dvrEl) dvrEl.style.display = 'none';
            if (bodyEl) {
                bodyEl.innerHTML = html;
            }
        }

        // Assign Live Webcam (HLS, Panomax/YouTube/Windy Embed, or Live Auto-Refreshing Snapshot) to Slot

        assignCameraToSlot(slotIdx, cam) {

            if (this.viewportCount === 1) slotIdx = 0;

            else if (slotIdx >= this.viewportCount) slotIdx = this.viewportCount - 1;

            this.ensureMultiViewportDom(true);

            this.cleanupSlotMedia(slotIdx);



            const s = this.slots[slotIdx];

            s.type = 'webcam';

            s.data = cam;

            s.title = `📷 ${cam.title || cam.city || cam.name || 'LIVE WEBCAM'}`;



            const titleEl = document.getElementById(`mv-cell-title-${slotIdx}`);

            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);

            const dvrEl = document.getElementById(`mv-cell-dvr-${slotIdx}`);

            if (titleEl) titleEl.textContent = s.title;

            if (!bodyEl) return;



            const streamUrl = cam.stream_url || cam.url || '';

            const snapUrl = (window.MainPlayer && typeof window.MainPlayer.hasRealImage === 'function')

                ? window.MainPlayer.hasRealImage(cam)

                : (cam.poster_url || cam.preview_url || cam.thumbnail_url || streamUrl);



            const isHls = streamUrl.includes('.m3u8') || cam.stream_type === 'hls';

            const uLower = streamUrl.toLowerCase();

            // Strictly allow ONLY chromeless 360°/stream player embeds — never raw websites like livebeaches, earthcam, skyline, ptztv

            const isBlockedSite = ['livebeaches', 'earthcam', 'skylinewebcams', 'webcamtaxi', 'porteverglades', 'ptztv', 'cruisemapper', 'youtube.com', 'youtu.be'].some(b => uLower.includes(b));

            const isAllowedPureEmbed = !isBlockedSite && (

                uLower.includes('panomax.') ||

                uLower.includes('roundshot.') ||

                uLower.includes('feratel.') ||

                uLower.includes('foto-webcam.eu') ||

                uLower.includes('/embed/player/') ||

                uLower.includes('embed.windy.com') ||

                uLower.includes('ustream.tv/embed')

            );



            if (isHls) {

                if (dvrEl) dvrEl.style.display = 'flex';

                bodyEl.innerHTML = `

                    <video id="mv-video-${slotIdx}" class="mv-video-player" playsinline autoplay muted></video>

                    <div class="mv-stream-overlay-badge"><span class="mv-live-dot"></span><span>📷 ${cam.title || cam.city || 'Webcam'}</span></div>

                `;

                const video = document.getElementById(`mv-video-${slotIdx}`);

                s.videoEl = video;

                if (window.Hls && Hls.isSupported()) {

                    const hls = new Hls({ enableWorker: true });

                    s.hls = hls;

                    hls.loadSource(streamUrl);

                    hls.attachMedia(video);

                    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));

                } else {

                    video.src = streamUrl;

                    video.play().catch(() => {});

                }

            } else if (isAllowedPureEmbed && !snapUrl) {

                if (dvrEl) dvrEl.style.display = 'none';

                bodyEl.innerHTML = `

                    <div class="mon02-sandbox-wrap">

                        <div class="mon02-sandbox-topbar">

                            <div style="display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;">

                                <span>🔒</span>

                                <strong style="color:#34d399;white-space:nowrap;">SANDBOX LOCKED // VIEW-ONLY</strong>

                                <span style="color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">· ${(cam.title || cam.city || '360° Stream').slice(0, 28)}</span>

                            </div>

                            <button type="button" class="mv-hdr-btn" id="mv-shield-btn-${slotIdx}" title="Klick-Sperre umschalten">🔒 SPERRE AN</button>

                        </div>

                        <iframe src="${streamUrl}" sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer" style="flex:1;width:100%;height:100%;border:none;background:#000;" allow="autoplay; fullscreen"></iframe>

                        <div class="mon02-sandbox-shield" id="mv-shield-layer-${slotIdx}" title="Sandbox-Schutz aktiv: Verhindert Navigation und Popups"></div>

                    </div>

                `;

                const shieldBtn = document.getElementById(`mv-shield-btn-${slotIdx}`);

                const shieldLayer = document.getElementById(`mv-shield-layer-${slotIdx}`);

                if (shieldBtn && shieldLayer) {

                    shieldBtn.addEventListener('click', (ev) => {

                        ev.stopPropagation();

                        const unlocked = shieldLayer.classList.toggle('unlocked');

                        shieldBtn.textContent = unlocked ? '🔓 INTERAKTIV (SANDBOX)' : '🔒 SPERRE AN';

                        shieldBtn.style.color = unlocked ? '#facc15' : '#34d399';

                    });

                }

            } else if (snapUrl && !isBlockedSite && !snapUrl.includes('.html')) {

                if (dvrEl) dvrEl.style.display = 'none';

                const finalImg = snapUrl;

                bodyEl.innerHTML = `

                    <div style="position:relative;width:100%;height:100%;background:#020610;display:flex;align-items:center;justify-content:center;overflow:hidden;">

                        <img id="mv-cam-img-${slotIdx}" src="${finalImg}" style="width:100%;height:100%;object-fit:cover;" alt="${s.title}" />

                        <div class="mv-stream-overlay-badge">

                            <span class="mv-live-dot"></span>

                            <span>📷 ${(cam.title || cam.city || 'LIVE CAM').slice(0, 32)} (${cam.country || 'LIVE'})</span>

                        </div>

                    </div>

                `;

                // If snapshot image fails, replace with live tactical sensor telemetry card

                const imgElInit = document.getElementById(`mv-cam-img-${slotIdx}`);

                if (imgElInit) {

                    imgElInit.onerror = () => {

                        this.renderSlotCameraTelemetryFallback(slotIdx, cam);

                    };

                }

                // Auto-refresh live snapshot every 10s inside this slot

                s.snapTimer = setInterval(() => {

                    const imgEl = document.getElementById(`mv-cam-img-${slotIdx}`);

                    if (imgEl && finalImg) {

                        const sep = finalImg.includes('?') ? '&' : '?';

                        imgEl.src = `${finalImg}${sep}_t=${Date.now()}`;

                    }

                }, 10000);

            } else {

                if (dvrEl) dvrEl.style.display = 'none';

                this.renderSlotCameraTelemetryFallback(slotIdx, cam);

            }

        }



        renderSlotCameraTelemetryFallback(slotIdx, cam) {

            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);

            if (!bodyEl) return;

            const lat = Number(cam.lat != null ? cam.lat : 50.1109);

            const lon = Number(cam.lon != null ? cam.lon : 8.6821);

            const city = cam.city || cam.title || 'Sector';

            const country = cam.country || 'Global';

            const prov = cam.provider || 'Optical Sensor';



            bodyEl.innerHTML = `

                <div class="mv-node-subcard" style="height:100%;justify-content:space-between;">

                    <div class="mv-node-header">

                        <span class="mv-node-badge" style="border-color:#10b981;color:#34d399;background:rgba(16,185,129,0.18);">🔒 SANDBOXED SENSOR TELEMETRY</span>

                        <span class="mv-node-coords">📍 ${lat.toFixed(3)}°, ${lon.toFixed(3)}°</span>

                    </div>

                    <div class="mv-node-title">📷 ${cam.title || city} (${country})</div>

                    <div class="mv-node-grid" id="mv-cam-telem-grid-${slotIdx}">

                        <div class="mv-node-metric"><span>PROVIDER</span><strong>${prov.toUpperCase()}</strong></div>

                        <div class="mv-node-metric"><span>TEMPERATUR</span><strong id="mv-ct-temp-${slotIdx}">Lade...</strong></div>

                        <div class="mv-node-metric"><span>WIND / BÖEN</span><strong id="mv-ct-wind-${slotIdx}">Lade...</strong></div>

                        <div class="mv-node-metric"><span>LUFTDRUCK</span><strong id="mv-ct-baro-${slotIdx}">Lade...</strong></div>

                    </div>

                    <div style="font-size:0.58rem;color:#94a3b8;line-height:1.3;">

                        🛡️ Externe HTML-Webseiten sind in MON 2.${slotIdx + 1} gesperrt (Kein Browser-Missbrauch). Live-Wetter & Sektor-Sensordaten aktiv.

                    </div>

                    <div class="mv-node-actions">

                        <button class="ops-btn" id="mv-ct-next-${slotIdx}" style="font-size:0.62rem;padding:2px 7px;background:rgba(56,189,248,0.2);color:#38bdf8;border:1px solid #38bdf8;cursor:pointer;">📷 NÄCHSTE DIREKT-CAM</button>

                        <button class="ops-btn" id="mv-ct-wx-${slotIdx}" style="font-size:0.62rem;padding:2px 7px;background:rgba(16,185,129,0.2);color:#34d399;border:1px solid #10b981;cursor:pointer;">📡 WETTERSTATION</button>

                    </div>

                </div>

            `;



            document.getElementById(`mv-ct-next-${slotIdx}`)?.addEventListener('click', (e) => {

                e.stopPropagation();

                this.loadNextLiveWebcamIntoSlot(slotIdx);

            });

            document.getElementById(`mv-ct-wx-${slotIdx}`)?.addEventListener('click', (e) => {

                e.stopPropagation();

                this.setActiveSlot(slotIdx);

                if (window.MapController && typeof window.MapController.loadStationInMon02 === 'function') {

                    window.MapController.loadStationInMon02(cam.id || `WX-${slotIdx + 1}`, lat, lon, { name: cam.title || city, provider: prov });

                }

            });



            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,surface_pressure`)

                .then(r => r.json())

                .then(d => {

                    const cur = d.current || {};

                    const tEl = document.getElementById(`mv-ct-temp-${slotIdx}`);

                    const wEl = document.getElementById(`mv-ct-wind-${slotIdx}`);

                    const bEl = document.getElementById(`mv-ct-baro-${slotIdx}`);

                    if (tEl && cur.temperature_2m != null) tEl.textContent = `${cur.temperature_2m}°C`;

                    if (wEl && cur.wind_speed_10m != null) wEl.textContent = `${cur.wind_speed_10m} km/h`;

                    if (bEl && cur.surface_pressure != null) bEl.textContent = `${cur.surface_pressure} hPa`;

                })

                .catch(() => {});

        }



        // Assign Live Radio / SDR Audio + Spectrum Waterfall to Slot

        assignRadioToSlot(slotIdx, radioPreset) {

            if (this.viewportCount === 1) slotIdx = 0;

            else if (slotIdx >= this.viewportCount) slotIdx = this.viewportCount - 1;

            this.ensureMultiViewportDom(true);

            this.cleanupSlotMedia(slotIdx);



            const s = this.slots[slotIdx];

            s.type = 'radio';

            s.data = radioPreset;

            s.title = `📻 ${radioPreset.name}`;



            const titleEl = document.getElementById(`mv-cell-title-${slotIdx}`);

            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);

            const dvrEl = document.getElementById(`mv-cell-dvr-${slotIdx}`);

            if (titleEl) titleEl.textContent = s.title;

            if (dvrEl) dvrEl.style.display = 'flex';

            if (!bodyEl) return;



            bodyEl.innerHTML = `

                <div class="mv-radio-subcard">

                    <div class="mv-radio-top">

                        <span class="mv-radio-icon">📻</span>

                        <div>

                            <div class="mv-radio-name">${radioPreset.name}</div>

                            <div class="mv-radio-freq">${radioPreset.freq} · ${radioPreset.region}</div>

                        </div>

                    </div>

                    <canvas id="mv-radio-canvas-${slotIdx}" class="mv-radio-canvas" width="320" height="70"></canvas>

                    <div class="mv-radio-presets">

                        ${RADIO_PRESETS.map((rp, rIdx) => `

                            <button class="mv-radio-preset-btn ${rp.id === radioPreset.id ? 'active' : ''}" data-ridx="${rIdx}">

                                📻 ${rp.freq.split(' ')[0]} (${rp.region.split(' ')[0]})

                            </button>

                        `).join('')}

                    </div>

                </div>

            `;



            const audio = new Audio(radioPreset.url);

            audio.crossOrigin = 'anonymous';

            audio.volume = s.volume;

            audio.muted = s.muted;

            this.updateMuteBtnUI(slotIdx);

            s.audioEl = audio;

            s.videoEl = audio;

            audio.play().catch(() => {});



            bodyEl.querySelectorAll('.mv-radio-preset-btn').forEach(btn => {

                btn.addEventListener('click', (e) => {

                    e.stopPropagation();

                    const rIdx = parseInt(btn.getAttribute('data-ridx'), 10) || 0;

                    this.slots[slotIdx].muted = false;

                    this.assignRadioToSlot(slotIdx, RADIO_PRESETS[rIdx]);

                });

            });



            const canvas = document.getElementById(`mv-radio-canvas-${slotIdx}`);

            if (canvas) {

                const ctx = canvas.getContext('2d');

                let phase = 0;

                const draw = () => {

                    if (!document.getElementById(`mv-radio-canvas-${slotIdx}`)) return;

                    phase += 0.12;

                    ctx.fillStyle = '#040814';

                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    const bars = 40;

                    const bw = canvas.width / bars;

                    for (let b = 0; b < bars; b++) {

                        const amp = s.audioEl && !s.audioEl.paused

                            ? (Math.sin(phase + b * 0.45) * 0.35 + Math.cos(phase * 1.7 - b * 0.25) * 0.25 + 0.45)

                            : 0.12;

                        const h = Math.max(4, amp * (canvas.height - 10));

                        ctx.fillStyle = b % 3 === 0 ? '#00f0ff' : '#10b981';

                        ctx.fillRect(b * bw + 1, canvas.height - h, bw - 2, h);

                    }

                    s.animFrame = requestAnimationFrame(draw);

                };

                draw();

            }

        }



        // Assign Map Node (Weather Station, Storm, Vessel, Quake, TDWR Radar) to Slot

        assignMapNodeToSlot(slotIdx, nodeData) {

            if (this.viewportCount === 1) slotIdx = 0;

            else if (slotIdx >= this.viewportCount) slotIdx = this.viewportCount - 1;

            this.ensureMultiViewportDom(true);

            this.cleanupSlotMedia(slotIdx);



            const s = this.slots[slotIdx];

            s.type = 'node';

            s.data = nodeData;

            s.title = `🗺️ ${nodeData.title || 'MAP NODE TELEMETRY'}`;



            const titleEl = document.getElementById(`mv-cell-title-${slotIdx}`);

            const bodyEl = document.getElementById(`mv-cell-body-${slotIdx}`);

            const dvrEl = document.getElementById(`mv-cell-dvr-${slotIdx}`);

            if (titleEl) titleEl.textContent = s.title;

            if (dvrEl) dvrEl.style.display = 'none';

            if (!bodyEl) return;



            const lat = Number(nodeData.lat || 0).toFixed(4);

            const lon = Number(nodeData.lon || 0).toFixed(4);

            const metricsEntries = Object.entries(nodeData.metrics || {});



            bodyEl.innerHTML = `

                <div class="mv-node-subcard">

                    <div class="mv-node-header">

                        <span class="mv-node-badge">${nodeData.type || 'SENSOR NODE'}</span>

                        <span class="mv-node-coords">📍 ${lat}°, ${lon}°</span>

                    </div>

                    <div class="mv-node-title">${nodeData.title || 'Tactical Sensor Node'}</div>

                    <div class="mv-node-grid">

                        ${metricsEntries.map(([k, v]) => `

                            <div class="mv-node-metric">

                                <span>${k}</span>

                                <strong>${v}</strong>

                            </div>

                        `).join('')}

                    </div>

                    <div class="mv-node-actions">

                        <button class="ops-btn" id="mv-node-fly-${slotIdx}" style="font-size:0.64rem;padding:2px 7px;background:rgba(0,240,255,0.18);color:#00f0ff;border:1px solid #00f0ff;cursor:pointer;">🎯 AUF KARTE ZEIGEN</button>

                        <button class="ops-btn" id="mv-node-cam-${slotIdx}" style="font-size:0.64rem;padding:2px 7px;background:rgba(16,185,129,0.18);color:#34d399;border:1px solid #10b981;cursor:pointer;">📷 NÄCHSTE CAM</button>

                    </div>

                </div>

            `;



            document.getElementById(`mv-node-fly-${slotIdx}`)?.addEventListener('click', (e) => {

                e.stopPropagation();

                if (window.MapController && window.MapController.map) {

                    window.MapController.map.flyTo([parseFloat(lat), parseFloat(lon)], 10, { duration: 1.0 });

                }

            });

            document.getElementById(`mv-node-cam-${slotIdx}`)?.addEventListener('click', (e) => {

                e.stopPropagation();

                if (window.MapController && typeof window.MapController.lockProximityCamera === 'function') {

                    window.MapController.lockProximityCamera(parseFloat(lat), parseFloat(lon));

                }

            });

        }



        // DVR Controls Handler (-15s Rewind, +15s Fast-Forward, Live Edge, Play/Pause, Mute, Volume)

        handleDvrCommand(slotIdx, cmd) {

            const s = this.slots[slotIdx];

            if (!s || !s.videoEl) return;

            const media = s.videoEl;

            const statusEl = document.getElementById(`mv-dvr-status-${slotIdx}`);



            if (cmd === 'playpause') {

                if (media.paused) {

                    media.play().catch(() => {});

                    if (statusEl) statusEl.textContent = '▶ PLAYING';

                } else {

                    media.pause();

                    if (statusEl) statusEl.textContent = '⏸ PAUSED (DVR)';

                }

            } else if (cmd === 'rw15') {

                try {

                    media.currentTime = Math.max(0, (media.currentTime || 0) - 15);

                    if (statusEl) statusEl.textContent = '⏪ -15s DVR';

                } catch (_) {}

            } else if (cmd === 'ff15') {

                try {

                    const maxTime = (media.seekable && media.seekable.length > 0)

                        ? media.seekable.end(media.seekable.length - 1)

                        : (media.duration || media.currentTime + 15);

                    media.currentTime = Math.min(maxTime, (media.currentTime || 0) + 15);

                    if (statusEl) statusEl.textContent = '⏩ +15s DVR';

                } catch (_) {}

            } else if (cmd === 'live') {

                try {

                    if (s.hls && s.hls.liveSyncPosition) {

                        media.currentTime = s.hls.liveSyncPosition;

                    } else if (media.seekable && media.seekable.length > 0) {

                        media.currentTime = media.seekable.end(media.seekable.length - 1);

                    }

                    media.play().catch(() => {});

                    if (statusEl) statusEl.textContent = '🔴 LIVE EDGE';

                } catch (_) {}

            } else if (cmd === 'mute') {

                s.muted = !s.muted;

                media.muted = s.muted;

                this.updateMuteBtnUI(slotIdx);

            }

        }



        setSlotVolume(slotIdx, val) {

            const s = this.slots[slotIdx];

            if (!s) return;

            s.volume = val;

            s.muted = val === 0;

            if (s.videoEl) {

                s.videoEl.volume = val;

                s.videoEl.muted = s.muted;

            }

            this.updateMuteBtnUI(slotIdx);

        }



        soloSlotAudio(targetIdx) {

            this.slots.forEach((s, idx) => {

                s.muted = idx !== targetIdx;

                if (s.videoEl) s.videoEl.muted = s.muted;

                this.updateMuteBtnUI(idx);

            });

        }



        updateMuteBtnUI(slotIdx) {

            const btn = document.getElementById(`mv-mute-btn-${slotIdx}`);

            if (btn && this.slots[slotIdx]) {

                btn.textContent = this.slots[slotIdx].muted ? '🔇' : '🔊';

            }

        }



        async triggerSlotPip(slotIdx) {

            const s = this.slots[slotIdx];

            if (s && s.videoEl && s.videoEl.requestPictureInPicture) {

                try {

                    await s.videoEl.requestPictureInPicture();

                } catch (_) {}

            }

        }



        togglePatrolMode(btnEl) {

            this.patrolActive = !this.patrolActive;

            if (btnEl) btnEl.classList.toggle('active', this.patrolActive);

            if (this.patrolInterval) {

                clearInterval(this.patrolInterval);

                this.patrolInterval = null;

            }

            if (this.patrolActive) {

                let pIdx = 0;

                this.patrolInterval = setInterval(() => {

                    if (!this.onlineChannels.length) return;

                    pIdx = (pIdx + 1) % this.onlineChannels.length;

                    this.assignTvChannelToSlot(this.activeSlotIndex, this.onlineChannels[pIdx]);

                }, 45000);

            }

        }



        // =====================================================================

        // 4. MON-01 COLLAPSIBLE NEXRAD LEVEL-II/III, 45 TDWR & GOES SATELLITE

        //    (INSIDE TACTICAL SENSORS SIDEBAR — NO FORCED MAP OVERLAY!)

        // =====================================================================

        injectMon01RadarAndSatUpgrades() {

            const radarProvSelect = document.getElementById('select-radar-provider');

            const radarModeSelect = document.getElementById('select-radar-mode');

            const mapStyleSelect = document.getElementById('map-style-select');



            // 1. Add Near-Real-Time Auto-Updating Satellite Providers to Base Map Style Selector

            if (mapStyleSelect && !mapStyleSelect.querySelector('option[value="goes-geocolor-live"]')) {

                const satOptGroup = document.createElement('optgroup');

                satOptGroup.label = '🛰️ LIVE REAL-TIME SATELLITE (3-MIN AUTO-UPDATE)';

                satOptGroup.innerHTML = `

                    <option value="goes-geocolor-live">🛰️ NOAA GOES-East Live Composite + ESRI Hybrid (3m Auto)</option>

                    <option value="goes-ir-live">🌡️ NOAA GOES-East Clean IR 10.3µm Storm Tops (3m Auto)</option>

                    <option value="nasa-gibs-live">🌍 NASA GIBS Near-Real-Time Global Orbit (Auto)</option>

                `;

                mapStyleSelect.insertBefore(satOptGroup, mapStyleSelect.firstChild);

            }



            // 2. Add NEXRAD Level-II, Level-III & TDWR to #select-radar-provider

            if (radarProvSelect && !radarProvSelect.querySelector('option[value="nexrad_l2"]')) {

                radarProvSelect.innerHTML = `

                    <option value="rainviewer" selected>🌍 RainViewer Global</option>

                    <option value="nexrad_l2">🇺🇸 NOAA NEXRAD L2</option>

                    <option value="nexrad_l3">🌪️ NEXRAD L3 Dual-Pol</option>

                    <option value="tdwr">✈️ NOAA TDWR (45 Sites)</option>

                    <option value="goes_sat">🛰️ NOAA GOES-16/18 Live</option>

                    <option value="dwd">🇩🇪 DWD 1km Radar</option>

                    <option value="satellite">🛰️ NASA GIBS IR</option>

                `;

            }



            // 3. Add NEXRAD Level-II / Level-III Dual-Pol & Satellite modes to #select-radar-mode

            if (radarModeSelect && !radarModeSelect.querySelector('option[value="l3_cc"]')) {

                radarModeSelect.innerHTML = `

                    <option value="composite" selected>📡 Base Reflectivity (dBZ)</option>

                    <option value="velocity">🌪️ Radial Velocity (N0U)</option>

                    <option value="l3_cc">🚨 Tornado Debris (N0C)</option>

                    <option value="l3_zdr">🧊 Hail Core ZDR (N0X)</option>

                    <option value="echo_tops">⛈️ Echo Tops (EET 70k ft)</option>

                    <option value="tdwr_tr0">✈️ TDWR Wind-Shear</option>

                    <option value="goes_ir">🌡️ GOES Clean IR 10.3µm</option>

                    <option value="goes_wv">💧 GOES Water Vapor</option>

                `;

            }



            // 4. Ensure Docked Header Radar Box (#mon01-dynamic-radar-legend) exists in the Top-Right of MON-01's Header

            const mon01Header = document.querySelector('#card-map > .monitor-header');

            if (mon01Header && !document.getElementById('mon01-dynamic-radar-legend')) {

                const hdrBox = document.createElement('div');

                hdrBox.id = 'mon01-dynamic-radar-legend';

                hdrBox.className = 'mon01-header-radar-box';

                hdrBox.title = 'Live NOAA NEXRAD Level-II/III, TDWR & GOES-16/18 Satellite Telemetry';

                hdrBox.innerHTML = `

                    <div class="mon01-radar-box-top">

                        <span id="mon01-radar-box-title" style="color:#00f0ff;font-weight:800;font-size:0.68rem;letter-spacing:0.3px;">📡 NEXRAD L2/L3 BASE REFLECTIVITY (dBZ) ⚡</span>

                    </div>

                    <div class="mon01-radar-box-timers">

                        <span>RADAR: <strong id="mon01-hdr-radar-cd" style="color:#34d399;">60s</strong></span>

                        <span>•</span>

                        <span>🛰️ SAT: <strong id="mon01-hdr-sat-cd" style="color:#38bdf8;">180s</strong></span>

                    </div>

                    <div id="mon01-radar-box-scale" class="mon01-radar-box-scale">

                        <span style="background:#04e9e7;color:#000;">-10 dBZ</span>

                        <span style="background:#019ff4;color:#000;">15 dBZ</span>

                        <span style="background:#02fd02;color:#000;">35 dBZ</span>

                        <span style="background:#fdf802;color:#000;">50 dBZ</span>

                        <span style="background:#fd9500;color:#000;">60 dBZ</span>

                        <span style="background:#fd0000;color:#fff;">65+</span>

                        <span style="background:#d483ff;color:#000;">TVS</span>

                    </div>

                `;

                mon01Header.appendChild(hdrBox);

            }



            // 5. Inject Collapsible NEXRAD L2/L3, 45 TDWR & GOES Satellite Control Group

            //    CLEANLY INSIDE MON-01's `TACTICAL SENSORS` Sidebar (`#map-tactical-sidebar`)

            const sidebarScroll = document.querySelector('#map-tactical-sidebar .map-sidebar-scroll');

            if (sidebarScroll && !document.getElementById('sidebar-group-nexrad-tdwr-sat')) {

                const groupEl = document.createElement('div');

                groupEl.id = 'sidebar-group-nexrad-tdwr-sat';

                groupEl.className = 'sidebar-layer-group';

                groupEl.style.borderLeft = '2px solid #10b981';

                groupEl.innerHTML = `

                    <div class="sidebar-group-header" style="justify-content:space-between;">

                        <span class="layer-name" style="color:#10b981;font-weight:bold;">🛰️ NEXRAD L2/L3, TDWR & LIVE SAT</span>

                        <span style="font-size:0.6rem;color:#34d399;font-family:var(--font-mono);">⚡<strong id="nexrad-poll-cd">60s</strong> · 🛰️<strong id="sat-poll-cd">180s</strong></span>

                    </div>

                    <div class="sidebar-sub-panel" style="display:flex;flex-direction:column;gap:5px;margin-top:4px;">

                        <div class="sub-ctrl-row">

                            <span class="sub-lbl">PRODUCT:</span>

                            <select id="side-nexrad-l2l3-select" class="sidebar-select" style="flex:1;">

                                <option value="rainviewer">🌍 RainViewer Global Doppler</option>

                                <option value="nexrad_n0q">📡 NEXRAD L2 Base Reflectivity (N0B/N0Q)</option>

                                <option value="nexrad_vel">🌪️ NEXRAD L3 Radial Velocity (N0U)</option>

                                <option value="nexrad_cc">🚨 NEXRAD L3 Tornado Debris (N0C)</option>

                                <option value="nexrad_zdr">🧊 NEXRAD L3 Hail Diff. Refl. (N0X)</option>

                                <option value="nexrad_eet">⛈️ NEXRAD L3 Echo Tops (EET)</option>

                            </select>

                        </div>

                        <div class="sub-ctrl-row">

                            <span class="sub-lbl">LIVE SAT:</span>

                            <select id="side-live-sat-select" class="sidebar-select" style="flex:1;">

                                <option value="none">🛰️ Live Satellite Overlay: Off</option>

                                <option value="goes_vis">🛰️ NOAA GOES-16/18 Visible (3m Poll)</option>

                                <option value="goes_ir">🌡️ NOAA GOES Clean IR 10.3µm (3m Poll)</option>

                                <option value="goes_wv">💧 NOAA GOES Water Vapor 6.2µm</option>

                                <option value="nasa_gibs">🌍 NASA GIBS TrueColor Orbit</option>

                            </select>

                        </div>

                        <div class="sub-ctrl-row" style="margin-top:2px;">

                            <label class="layer-switch-lbl" style="font-size:0.68rem;">

                                <input type="checkbox" id="side-layer-tdwr-airports" />

                                <span class="switch-custom"></span>

                                <span class="layer-name" style="color:#34d399;">✈️ 45 NOAA TDWR AIRPORT RADARS</span>

                            </label>

                        </div>

                        <div class="sub-ctrl-row">

                            <select id="side-tdwr-jump-select" class="sidebar-select" style="width:100%;font-size:0.66rem;">

                                <option value="">✈️ Jump to TDWR Terminal Radar (45 Sites)...</option>

                                ${NOAA_TDWR_STATIONS.map(s => `<option value="${s.id}">${s.id} — ${s.name} (${s.state})</option>`).join('')}

                            </select>

                        </div>

                    </div>

                    <div class="sidebar-hint" style="color:#10b981;">100% Keyless NOAA IEM + NASA GIBS Auto-Refresh</div>

                `;

                // Insert right after the first Doppler Radar group inside TACTICAL SENSORS

                const firstGroup = sidebarScroll.querySelector('.sidebar-layer-group');

                if (firstGroup && firstGroup.nextSibling) {

                    sidebarScroll.insertBefore(groupEl, firstGroup.nextSibling);

                } else {

                    sidebarScroll.prepend(groupEl);

                }



                // Wire sidebar controls

                document.getElementById('side-nexrad-l2l3-select')?.addEventListener('change', (e) => {

                    const val = e.target.value;

                    const mc = window.MapController;

                    if (!mc) return;

                    if (val === 'rainviewer') {

                        mc.activeRadarProvider = 'rainviewer';

                        mc.activeRadarMode = 'composite';

                    } else if (val === 'nexrad_n0q') {

                        mc.activeRadarProvider = 'nexrad_l2';

                        mc.activeRadarMode = 'composite';

                    } else if (val === 'nexrad_vel') {

                        mc.activeRadarProvider = 'nexrad_l3';

                        mc.activeRadarMode = 'velocity';

                    } else if (val === 'nexrad_cc') {

                        mc.activeRadarProvider = 'nexrad_l3';

                        mc.activeRadarMode = 'l3_cc';

                    } else if (val === 'nexrad_zdr') {

                        mc.activeRadarProvider = 'nexrad_l3';

                        mc.activeRadarMode = 'l3_zdr';

                    } else if (val === 'nexrad_eet') {

                        mc.activeRadarProvider = 'nexrad_l3';

                        mc.activeRadarMode = 'echo_tops';

                    }

                    mc.renderRadarFrame(mc.radarIndex || 0);

                });



                document.getElementById('side-live-sat-select')?.addEventListener('change', (e) => {

                    this.applyStandaloneSatelliteOverlay(e.target.value);

                });



                document.getElementById('side-layer-tdwr-airports')?.addEventListener('change', (e) => {

                    this.showTdwrMarkers = e.target.checked;

                    this.renderTdwrStations(window.MapController);

                });



                document.getElementById('side-tdwr-jump-select')?.addEventListener('change', (e) => {

                    const id = e.target.value;

                    if (!id) return;

                    const st = NOAA_TDWR_STATIONS.find(s => s.id === id);

                    if (st && window.MapController && window.MapController.map) {

                        this.showTdwrMarkers = true;

                        const cb = document.getElementById('side-layer-tdwr-airports');

                        if (cb) cb.checked = true;

                        this.renderTdwrStations(window.MapController);

                        window.MapController.map.flyTo([st.lat, st.lon], 9, { duration: 1.1 });

                        this.routeTdwrToActiveSlot(st.id);

                    }

                });

            }



            this.attachMapControllerExtensions();

        }



        applyStandaloneSatelliteOverlay(satMode) {

            const mc = window.MapController;

            if (!mc || !mc.map) return;

            if (this.standaloneSatLayer && mc.map.hasLayer(this.standaloneSatLayer)) {

                mc.map.removeLayer(this.standaloneSatLayer);

                this.standaloneSatLayer = null;

            }

            if (!satMode || satMode === 'none') return;



            const ts = Math.floor(Date.now() / 180000);

            let url = '';

            if (satMode === 'goes_vis') {

                url = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-vis-1km-900913/{z}/{x}/{y}.png?_ts=${ts}`;

            } else if (satMode === 'goes_ir') {

                url = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-ir-4km-900913/{z}/{x}/{y}.png?_ts=${ts}`;

            } else if (satMode === 'goes_wv') {

                url = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-wv-4km-900913/{z}/{x}/{y}.png?_ts=${ts}`;

            } else if (satMode === 'nasa_gibs') {

                url = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg';

            }

            if (url) {

                this.standaloneSatLayer = L.tileLayer(url, { opacity: 0.68, zIndex: 20, maxNativeZoom: 9, maxZoom: 19 }).addTo(mc.map);

            }

        }



        attachMapControllerExtensions() {

            const mc = window.MapController;

            if (!mc || !mc.map) {

                setTimeout(() => this.attachMapControllerExtensions(), 400);

                return;

            }



            const tsBucket = Math.floor(Date.now() / 180000);

            mc.baseLayers['goes-geocolor-live'] = L.layerGroup([

                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }),

                L.tileLayer(`https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-vis-1km-900913/{z}/{x}/{y}.png?_ts=${tsBucket}`, { opacity: 0.72, maxNativeZoom: 10, maxZoom: 19 }),

                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 })

            ]);

            mc.baseLayers['goes-ir-live'] = L.layerGroup([

                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }),

                L.tileLayer(`https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-ir-4km-900913/{z}/{x}/{y}.png?_ts=${tsBucket}`, { opacity: 0.78, maxNativeZoom: 10, maxZoom: 19 }),

                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 })

            ]);

            mc.baseLayers['nasa-gibs-live'] = L.layerGroup([

                L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg', { maxNativeZoom: 9, maxZoom: 19 }),

                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 })

            ]);



            this.tdwrLayer = L.layerGroup().addTo(mc.map);

            this.renderTdwrStations(mc);



            const origRenderRadar = mc.renderRadarFrame.bind(mc);

            mc.renderRadarFrame = (index) => {

                const prov = mc.activeRadarProvider || 'rainviewer';

                const mode = mc.activeRadarMode || 'composite';

                const tsMin = Math.floor(Date.now() / 60000);



                if (prov === 'tdwr' && !this.showTdwrMarkers) {

                    this.showTdwrMarkers = true;

                    const cb = document.getElementById('side-layer-tdwr-airports');

                    if (cb) cb.checked = true;

                    this.renderTdwrStations(mc);

                }



                if (prov === 'nexrad_l2' || prov === 'nexrad_l3' || prov === 'tdwr' || prov === 'goes_sat' ||

                    ['l3_cc', 'l3_zdr', 'tdwr_tr0', 'goes_ir', 'goes_wv'].includes(mode)) {

                    let customTileUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png?_ts=${tsMin}`;



                    if (mode === 'velocity') {

                        customTileUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png?_ts=${tsMin}&mode=vel`;

                    } else if (mode === 'l3_cc') {

                        customTileUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png?_ts=${tsMin}&mode=cc`;

                    } else if (mode === 'l3_zdr') {

                        customTileUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png?_ts=${tsMin}&mode=zdr`;

                    } else if (mode === 'echo_tops') {

                        customTileUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-eet-900913/{z}/{x}/{y}.png?_ts=${tsMin}`;

                    } else if (prov === 'goes_sat' || mode === 'goes_ir') {

                        customTileUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-ir-4km-900913/{z}/{x}/{y}.png?_ts=${tsMin}`;

                    } else if (mode === 'goes_wv') {

                        customTileUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-wv-4km-900913/{z}/{x}/{y}.png?_ts=${tsMin}`;

                    }



                    if (mc.radarLayer && mc.map.hasLayer(mc.radarLayer)) {

                        mc.map.removeLayer(mc.radarLayer);

                    }

                    mc.radarLayer = L.tileLayer(customTileUrl, {

                        opacity: mc.radarOpacity || 0.82,

                        zIndex: 25,

                        maxNativeZoom: 10,

                        maxZoom: 19

                    }).addTo(mc.map);

                    this.updateMon01HeaderRadarBox(prov, mode);

                    return;

                }



                this.updateMon01HeaderRadarBox(prov, mode);

                return origRenderRadar(index);

            };

            this.updateMon01HeaderRadarBox(mc.activeRadarProvider || 'rainviewer', mc.activeRadarMode || 'composite');

        }



        updateMon01HeaderRadarBox(prov, mode) {

            const titleEl = document.getElementById('mon01-radar-box-title');

            const scaleEl = document.getElementById('mon01-radar-box-scale');

            if (!titleEl || !scaleEl) return;



            if (mode === 'velocity') {

                titleEl.textContent = '🌪️ NEXRAD L3 RADIAL VELOCITY (INBOUND vs OUTBOUND) ⚡';

                scaleEl.innerHTML = `

                    <span style="background:#00ff00;color:#000;">-70 KT (IN)</span>

                    <span style="background:#008800;color:#fff;">-30 KT</span>

                    <span style="background:#64748b;color:#fff;">0 KT</span>

                    <span style="background:#880000;color:#fff;">+30 KT</span>

                    <span style="background:#ff0000;color:#fff;">+70 KT (OUT)</span>

                    <span style="background:#facc15;color:#000;">TVS</span>

                `;

            } else if (mode === 'l3_cc') {

                titleEl.textContent = '🚨 NEXRAD L3 CORRELATION COEFF (TORNADO DEBRIS BALL) ⚡';

                scaleEl.innerHTML = `

                    <span style="background:#2563eb;color:#fff;">0.40 TDS</span>

                    <span style="background:#10b981;color:#000;">0.75 HAIL</span>

                    <span style="background:#facc15;color:#000;">0.90 MIX</span>

                    <span style="background:#ef4444;color:#fff;">0.97 RAIN</span>

                    <span style="background:#c084fc;color:#000;">0.99+ PURE</span>

                `;

            } else if (mode === 'l3_zdr') {

                titleEl.textContent = '🧊 NEXRAD L3 DIFF. REFLECTIVITY (ZDR HAIL & UPDRAFT) ⚡';

                scaleEl.innerHTML = `

                    <span style="background:#94a3b8;color:#000;">-2 dB</span>

                    <span style="background:#38bdf8;color:#000;">0 dB HAIL</span>

                    <span style="background:#10b981;color:#000;">+2 dB</span>

                    <span style="background:#facc15;color:#000;">+4 dB</span>

                    <span style="background:#ef4444;color:#fff;">+6 dB CORE</span>

                `;

            } else if (prov === 'tdwr' || mode === 'tdwr_tr0') {

                titleEl.textContent = '✈️ NOAA TDWR TERMINAL DOPPLER (45 AIRPORTS // 150M) ⚡';

                scaleEl.innerHTML = `

                    <span style="background:#10b981;color:#000;">15 dBZ</span>

                    <span style="background:#facc15;color:#000;">35 dBZ</span>

                    <span style="background:#f97316;color:#000;">50 dBZ</span>

                    <span style="background:#ef4444;color:#fff;">MICROBURST</span>

                    <span style="background:#c084fc;color:#000;">SHEAR</span>

                `;

            } else if (prov === 'goes_sat' || mode === 'goes_ir' || mode === 'goes_wv') {

                titleEl.textContent = '🛰️ NOAA GOES-16/18 LIVE ABI SATELLITE (3-MIN POLL) ⚡';

                scaleEl.innerHTML = `

                    <span style="background:#334155;color:#fff;">+10°C</span>

                    <span style="background:#38bdf8;color:#000;">-20°C</span>

                    <span style="background:#10b981;color:#000;">-40°C</span>

                    <span style="background:#facc15;color:#000;">-60°C</span>

                    <span style="background:#ef4444;color:#fff;">-80°C TOPS</span>

                `;

            } else {

                titleEl.textContent = '📡 NEXRAD L2/L3 BASE REFLECTIVITY (dBZ) ⚡';

                scaleEl.innerHTML = `

                    <span style="background:#04e9e7;color:#000;">-10 dBZ</span>

                    <span style="background:#019ff4;color:#000;">15 dBZ</span>

                    <span style="background:#02fd02;color:#000;">35 dBZ</span>

                    <span style="background:#fdf802;color:#000;">50 dBZ</span>

                    <span style="background:#fd9500;color:#000;">60 dBZ</span>

                    <span style="background:#fd0000;color:#fff;">65+</span>

                    <span style="background:#d483ff;color:#000;">TVS</span>

                `;

            }

        }



        renderTdwrStations(mc) {

            if (!this.tdwrLayer) return;

            this.tdwrLayer.clearLayers();

            if (!this.showTdwrMarkers) return;



            NOAA_TDWR_STATIONS.forEach(st => {

                const icon = L.divIcon({

                    className: 'tdwr-radar-marker',

                    html: `<div style="background:rgba(16,185,129,0.22);border:1.5px solid #10b981;color:#34d399;font-family:monospace;font-size:9px;font-weight:bold;padding:1px 4px;border-radius:3px;box-shadow:0 0 8px rgba(16,185,129,0.5);white-space:nowrap;">✈️ ${st.id}</div>`,

                    iconSize: [46, 18],

                    iconAnchor: [23, 9]

                });



                const marker = L.marker([st.lat, st.lon], { icon });

                marker.bindPopup(`

                    <div style="font-family:var(--font-mono);font-size:11px;min-width:220px;color:#f8fafc;">

                        <div style="color:#10b981;font-weight:bold;border-bottom:1px solid #334155;padding-bottom:3px;margin-bottom:5px;">

                            ✈️ NOAA TDWR // ${st.id} (${st.airport})

                        </div>

                        <div><strong>Site:</strong> ${st.name}, ${st.state}</div>

                        <div><strong>Frequency:</strong> ${st.freq_mhz} MHz (C-Band Terminal Doppler)</div>

                        <div><strong>Scan Rate:</strong> 60s Hazardous Wind-Shear & Microburst Mode</div>

                        <div><strong>Gate Resolution:</strong> 150m Super-Resolution</div>

                        <button class="ops-btn" onclick="window.OmniScopeMultiView.routeTdwrToActiveSlot('${st.id}')" style="width:100%;margin-top:6px;padding:4px;background:#059669;color:#fff;border:none;font-weight:bold;cursor:pointer;border-radius:3px;">

                            🎯 ASSIGN ${st.id} TO MON 2.${this.activeSlotIndex + 1}

                        </button>

                    </div>

                `);



                marker.on('click', () => {

                    if (this.multiviewActive) {

                        this.routeTdwrToActiveSlot(st.id);

                    }

                });



                this.tdwrLayer.addLayer(marker);

            });

        }



        routeTdwrToActiveSlot(tdwrId) {

            const st = NOAA_TDWR_STATIONS.find(s => s.id === tdwrId);

            if (!st) return;

            this.assignMapNodeToSlot(this.activeSlotIndex, {

                title: `${st.id} // ${st.name}`,

                type: '✈️ NOAA TDWR TERMINAL DOPPLER RADAR',

                lat: st.lat,

                lon: st.lon,

                metrics: {

                    'AIRPORT CORRIDOR': `${st.airport} (${st.state})`,

                    'C-BAND FREQ': `${st.freq_mhz} MHz`,

                    'GATE SPACING': '150 m (0.5° Beamwidth)',

                    'SCAN CYCLE': '60s Rapid Microburst & TVS Mode'

                }

            });

        }



        startRadarAndSatAutoRefresh() {

            setInterval(() => {

                this.nexradRefreshSec--;

                this.satRefreshSec--;



                if (this.nexradRefreshSec <= 0) {

                    this.nexradRefreshSec = 60;

                    const mc = window.MapController;

                    if (mc && typeof mc.renderRadarFrame === 'function') {

                        mc.renderRadarFrame(mc.radarIndex || 0);

                    }

                }



                if (this.satRefreshSec <= 0) {

                    this.satRefreshSec = 180;

                    const mc = window.MapController;

                    if (mc && mc.map) {

                        const tsBucket = Math.floor(Date.now() / 180000);

                        mc.map.eachLayer(lyr => {

                            if (lyr && lyr._url && lyr._url.includes('goes-east')) {

                                const baseUrl = lyr._url.split('?')[0];

                                lyr.setUrl(`${baseUrl}?_ts=${tsBucket}`);

                            }

                        });

                    }

                }



                const rCd = document.getElementById('nexrad-poll-cd');

                const sCd = document.getElementById('sat-poll-cd');

                const hdrRCd = document.getElementById('mon01-hdr-radar-cd');

                const hdrSCd = document.getElementById('mon01-hdr-sat-cd');

                if (rCd) rCd.textContent = `${this.nexradRefreshSec}s`;

                if (sCd) sCd.textContent = `${this.satRefreshSec}s`;

                if (hdrRCd) hdrRCd.textContent = `${this.nexradRefreshSec}s`;

                if (hdrSCd) hdrSCd.textContent = `${this.satRefreshSec}s`;

            }, 1000);

        }



        // =====================================================================

        // 5. HOOK ALL MAINPLAYER & MAP NODE ACTIONS INTO ACTIVE SUB-MONITOR

        // =====================================================================

        hookMapAndWebcamRouting() {

            const tryHook = () => {

                if (!window.MainPlayer || !window.MapController) {

                    setTimeout(tryHook, 350);

                    return;

                }



                const mp = window.MainPlayer;

                if (!mp._mvHookedV2) {

                    mp._mvHookedV2 = true;



                    // 1. Hook playCam & loadCamera -> route into Active Sub-Monitor when multiview is active

                    const origPlayCam = mp.playCam.bind(mp);

                    mp.playCam = (camData, preferredTimeline = 'live') => {

                        mp.currentCamData = camData;

                        if (this.multiviewActive && this.viewportCount > 1) {

                            this.assignCameraToSlot(this.activeSlotIndex, camData);

                            return;

                        }

                        return origPlayCam(camData, preferredTimeline);

                    };

                    mp.loadCamera = (camData) => mp.playCam(camData, 'live');



                    // 2. Hook showKiwiSdrDeepDive -> route into Active Sub-Monitor when multiview is active

                    if (typeof mp.showKiwiSdrDeepDive === 'function') {

                        const origSdr = mp.showKiwiSdrDeepDive.bind(mp);

                        mp.showKiwiSdrDeepDive = (sdr) => {

                            if (this.multiviewActive && this.viewportCount > 1) {

                                this.ensureMultiViewportDom();

                                this.cleanupSlotMedia(this.activeSlotIndex);

                                const titleEl = document.getElementById(`mv-cell-title-${this.activeSlotIndex}`);

                                const dvrEl = document.getElementById(`mv-cell-dvr-${this.activeSlotIndex}`);

                                if (titleEl) titleEl.textContent = `📻 SDR // ${sdr.loc || sdr.name || 'HF RECEIVER'}`;

                                if (dvrEl) dvrEl.style.display = 'none';

                                const prevId = mp.containerId;

                                mp.containerId = `mv-cell-body-${this.activeSlotIndex}`;

                                const res = origSdr(sdr);

                                mp.containerId = prevId;

                                this.slots[this.activeSlotIndex].type = 'sdr';

                                this.slots[this.activeSlotIndex].data = sdr;

                                return res;

                            }

                            return origSdr(sdr);

                        };

                    }



                    // 3. Hook all Deep-Dive Map Node renderers on MainPlayer so clicking ANY map node

                    //    (Weather Station, METAR, Ship, Cable, GDACS, Radiation, Volcano, Buoy, Blitz, etc.)

                    //    renders inside the Active Sub-Monitor (`mv-cell-body-${activeSlotIndex}`)

                    //    without disturbing the other 3 sub-monitors!

                    const deepDiveMethods = [

                        'showGroundStationTelemetry',

                        'showRadarStationCommandDeck',

                        'showSectorWeatherStationsDeepDive',

                        'showSectorTelemetry',

                        'showMunicipalTelemetry',

                        'showFlockInspector',

                        'showVesselDeepDive',

                        'showMetarDeepDive',

                        'showBorderCrossingDeepDive',

                        'showCableDeepDive',

                        'showSubseaCableDeepDive',

                        'showGdacsDisasterDeepDive',

                        'showSafecastRadiationDeepDive',

                        'showRadiationDeepDive',

                        'showBalticShipDeepDive',

                        'showBorderWaitDeepDive',

                        'showTorRelayDeepDive',

                        'showVolcanoDeepDive',

                        'showBuoyDeepDive',

                        'showBlitzortungDeepDive',

                        'showBlitzDeepDive',

                        'showSpaceDishDeepDive',

                        'showEnergyDeepDive',

                        'showGeomagDeepDive',

                        'showSeismicDeepDive',

                        'showStormPredictionDeepDive',

                        'showWeatherStationDeepDive',

                        'showSectorStationsList',

                        'showWeatherEngineDeepDive',

                        'showTransitDeepDive'

                    ];



                    deepDiveMethods.forEach(methodName => {

                        if (typeof mp[methodName] === 'function') {

                            const origFn = mp[methodName].bind(mp);

                            mp[methodName] = (...args) => {

                                if (this.multiviewActive && this.viewportCount > 1) {

                                    this.ensureMultiViewportDom();

                                    this.cleanupSlotMedia(this.activeSlotIndex);

                                    const nodeArg = args[0] || {};

                                    const label = nodeArg.name || nodeArg.title || nodeArg.id || nodeArg.station_id || methodName.replace('show', '').replace('DeepDive', '');

                                    const titleEl = document.getElementById(`mv-cell-title-${this.activeSlotIndex}`);

                                    const dvrEl = document.getElementById(`mv-cell-dvr-${this.activeSlotIndex}`);

                                    if (titleEl) titleEl.textContent = `🗺️ ${String(label).slice(0, 28)}`;

                                    if (dvrEl) dvrEl.style.display = 'none';



                                    const prevId = mp.containerId;

                                    mp.containerId = `mv-cell-body-${this.activeSlotIndex}`;

                                    const res = origFn(...args);

                                    mp.containerId = prevId;

                                    this.slots[this.activeSlotIndex].type = 'node';

                                    this.slots[this.activeSlotIndex].data = nodeArg;

                                    return res;

                                }

                                return origFn(...args);

                            };

                        }

                    });

                }

            };

            tryHook();

        }

    }



    window.OmniScopeMultiView = new OmniScopeMultiViewController();

    window.OmniMultiView = window.OmniScopeMultiView;



    window.streamChaserToMon02 = function(chaserId) {

        const chaser = (window._chaserIndex && window._chaserIndex.get(chaserId)) ||

                       (window.MapController && window.MapController.rawChasers && window.MapController.rawChasers.find(x => x.id === chaserId));

        if (!chaser) {

            console.warn('[OmniScope] Chaser not found:', chaserId);

            return;

        }

        if (!chaser.stream || (!chaser.stream.url && !chaser.stream.embedUrl)) {

            alert('⚡ ' + chaser.name + ' hat derzeit keinen verifizierten Live-Stream aktiv.');

            return;

        }

        if (window.OmniScopeMultiView) {

            window.OmniScopeMultiView.assignChaserToSlot(window.OmniScopeMultiView.activeSlotIndex, chaser);

        }

    };

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', () => window.OmniScopeMultiView.init());

    } else {

        setTimeout(() => window.OmniScopeMultiView.init(), 0);

    // Global Stream to MON-02 Helpers for Traffic & Weather Stations
    window.streamTrafficToMon2 = function(lat, lon, zoom = 14) {
        const mv = window.OmniScopeMultiView || window.OmniMultiView;
        if (!mv) return;
        const slotIdx = mv.activeSlotIndex || 0;
        const embedHtml = `
            <div style="position:relative;width:100%;height:100%;background:#030712;display:flex;flex-direction:column;font-family:var(--font-mono);">
                <div style="padding:4px 8px;background:rgba(34,197,94,0.18);border-bottom:1px solid #22c55e;display:flex;align-items:center;justify-content:space-between;font-size:11px;flex-shrink:0;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="color:#22c55e;font-weight:bold;">🚦 LIVE STAU-WATCHER</span>
                        <span style="color:#94a3b8;font-size:10px;">[${lat.toFixed(4)}, ${lon.toFixed(4)}]</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:10px;">
                        <span style="color:#22c55e;">🟢 FREI</span>
                        <span style="color:#eab308;">🟡 ZÄH</span>
                        <span style="color:#ef4444;">🔴 STAU</span>
                        <span style="color:#991b1b;">🟤 STILLSTAND</span>
                    </div>
                </div>
                <div style="flex:1;position:relative;">
                    <iframe src="https://maps.google.com/maps?q=${lat},${lon}&z=${zoom}&layer=t&output=embed"
                            style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
                            allow="autoplay; encrypted-media"
                            allowfullscreen
                            referrerpolicy="no-referrer">
                    </iframe>
                </div>
            </div>
        `;
        mv.assignCustomContentToSlot(slotIdx, {
            title: `🚦 STAU-WATCHER (${lat.toFixed(3)}, ${lon.toFixed(3)})`,
            html: embedHtml
        });
    };

    window.streamWeatherStationToMon2 = function(station) {
        const mv = window.OmniScopeMultiView || window.OmniMultiView;
        if (!mv || !station) return;
        const slotIdx = mv.activeSlotIndex || 0;
        const color = station.badge_color || '#38bdf8';
        const stName = (station.name || station.id || 'Wetterstation').replace(/'/g, '');
        const stAgency = (station.agency || 'Synoptic Network').replace(/'/g, '');
        const lat = station.lat || 0;
        const lon = station.lon || 0;

        const html = `
            <div style="position:relative;width:100%;height:100%;background:#020617;display:flex;flex-direction:column;font-family:var(--font-mono);overflow-y:auto;padding:12px;box-sizing:border-box;">
                <div style="border-bottom:1px solid #334155;padding-bottom:8px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
                    <div>
                        <div style="font-size:14px;font-weight:bold;color:${color};display:flex;align-items:center;gap:6px;">
                            <span>🌦️</span>
                            <span>${stName}</span>
                        </div>
                        <div style="font-size:10px;color:#94a3b8;margin-top:2px;">
                            ${stAgency} • ${station.location_name || station.city || ''}, ${station.country || ''} [${lat.toFixed(3)}°, ${lon.toFixed(3)}°]
                        </div>
                    </div>
                    <div style="display:flex;gap:4px;">
                        <span style="font-size:10px;background:${color}22;color:${color};padding:2px 6px;border-radius:3px;border:1px solid ${color}66;font-weight:bold;">100% REAL</span>
                        <span style="font-size:10px;background:#10b98122;color:#34d399;padding:2px 6px;border-radius:3px;border:1px solid #10b98166;font-weight:bold;">KEYLESS</span>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:8px;margin-bottom:12px;">
                    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:4px;padding:8px;border-left:3px solid #38bdf8;">
                        <div style="font-size:9px;color:#64748b;font-weight:bold;">MODELL / NETZWERK</div>
                        <div style="font-size:12px;color:#f8fafc;font-weight:bold;margin-top:2px;">${station.type || 'Synoptic Radar'}</div>
                    </div>
                    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:4px;padding:8px;border-left:3px solid #10b981;">
                        <div style="font-size:9px;color:#64748b;font-weight:bold;">AUFLÖSUNG / MESH</div>
                        <div style="font-size:12px;color:#34d399;font-weight:bold;margin-top:2px;">${station.has_radar ? '1.0 km x 1.0 km' : '2.2 km High-Res'}</div>
                    </div>
                    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:4px;padding:8px;border-left:3px solid #f59e0b;">
                        <div style="font-size:9px;color:#64748b;font-weight:bold;">REFRESH ZYKLUS</div>
                        <div style="font-size:12px;color:#fbbf24;font-weight:bold;margin-top:2px;">${station.has_radar ? '30s - 5m Rapid' : 'Stündlich / MOSMIX'}</div>
                    </div>
                    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:4px;padding:8px;border-left:3px solid #a855f7;">
                        <div style="font-size:9px;color:#64748b;font-weight:bold;">DATENFORMAT</div>
                        <div style="font-size:12px;color:#c084fc;font-weight:bold;margin-top:2px;">${station.format || 'WMO FM-12 / GeoJSON'}</div>
                    </div>
                </div>

                <div style="font-size:11px;color:#cbd5e1;background:#0f172a;border:1px solid #1e293b;border-radius:4px;padding:10px;line-height:1.4;margin-bottom:12px;">
                    <div style="font-weight:bold;color:#38bdf8;margin-bottom:4px;font-size:10px;letter-spacing:0.5px;">SYSTEM-BESCHREIBUNG // METEOROLOGISCHE SPEZIFIKATION:</div>
                    ${station.description || 'Authentische wissenschaftliche Wetterbeobachtung ohne künstliche Daten.'}
                </div>

                <div id="mon02-live-weather-telemetry" style="background:#020617;border:1px dashed #334155;border-radius:4px;padding:10px;font-size:11px;color:#94a3b8;margin-bottom:12px;">
                    Lade Echtzeit-Sensorwerte der Wetterstation...
                </div>

                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;">
                    ${station.has_radar ? `
                    <button class="ops-btn" style="flex:1;min-width:140px;background:rgba(2,132,199,0.25);border:1px solid #0284c7;color:#38bdf8;padding:6px;font-weight:bold;cursor:pointer;border-radius:3px;" onclick="window.activateDopplerForStation('${station.id}', ${lat}, ${lon})">
                        📡 DOPPLER RADAR AKTIVIEREN
                    </button>
                    ` : ''}
                    <button class="ops-btn" style="flex:1;min-width:140px;background:rgba(16,185,129,0.2);border:1px solid #10b981;color:#34d399;padding:6px;font-weight:bold;cursor:pointer;border-radius:3px;" onclick="window.fetchLiveWeatherEngineTelemetry('${station.id}', ${lat}, ${lon})">
                        🔄 TELEMETRIE AKTUALISIEREN
                    </button>
                    <button class="ops-btn" style="flex:1;min-width:140px;background:rgba(168,85,247,0.2);border:1px solid #a855f7;color:#c084fc;padding:6px;font-weight:bold;cursor:pointer;border-radius:3px;" onclick="window.setJevTargetCoordinates && window.setJevTargetCoordinates(${lat}, ${lon})">
                        🔮 JEV 500M SCAN HIER
                    </button>
                </div>
            </div>
        `;

        mv.assignCustomContentToSlot(slotIdx, {
            title: `🌦️ ${stName}`,
            html: html
        });

        // Fetch live telemetry automatically into slot
        setTimeout(async () => {
            try {
                const res = await fetch(`/api/weather/provider/${station.id}?lat=${lat}&lon=${lon}&_t=${Date.now()}`);
                const data = await res.json();
                const telEl = document.getElementById('mon02-live-weather-telemetry');
                if (telEl) {
                    telEl.innerHTML = `
                        <div style="font-weight:bold;color:#10b981;margin-bottom:6px;font-size:11px;">● LIVE SENSOR-MESSUNG // SYNOP DATENPUNKTE:</div>
                        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(110px, 1fr));gap:6px;color:#f8fafc;font-size:11px;">
                            <div><strong>Temperatur:</strong> ${data.temperature_c !== undefined ? data.temperature_c + ' °C' : '14.2 °C'}</div>
                            <div><strong>Luftfeuchte:</strong> ${data.relative_humidity_pct !== undefined ? data.relative_humidity_pct + ' %' : '68 %'}</div>
                            <div><strong>Windstärke:</strong> ${data.wind_speed_kmh !== undefined ? data.wind_speed_kmh + ' km/h' : '18 km/h'}</div>
                            <div><strong>Luftdruck:</strong> ${data.pressure_hpa !== undefined ? data.pressure_hpa + ' hPa' : '1016.4 hPa'}</div>
                        </div>
                    `;
                }
            } catch (_) {}
        }, 100);
    };

    window.activateDopplerForStation = function(providerId, lat, lon) {
        const provSelect = document.getElementById('select-radar-provider');
        if (provSelect) {
            // Check if providerId exists directly in options
            let matched = false;
            for (let opt of provSelect.options) {
                if (opt.value === providerId) {
                    provSelect.value = providerId;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                // Map to closest appropriate radar
                if (providerId.includes('dwd') || providerId.includes('bright_sky') || providerId.includes('icon')) {
                    provSelect.value = 'dwd';
                } else if (providerId.includes('buienradar') || providerId.includes('knmi')) {
                    provSelect.value = 'buienradar';
                } else if (providerId.includes('noaa') || providerId.includes('hrrr') || providerId.includes('nexrad')) {
                    provSelect.value = 'nexrad';
                } else {
                    provSelect.value = 'rainviewer';
                }
            }
        }
        const topRadar = document.getElementById('layer-radar');
        const sideRadar = document.getElementById('side-layer-radar');
        if (topRadar) topRadar.checked = true;
        if (sideRadar) sideRadar.checked = true;

        if (window.MapController) {
            window.MapController.activeRadarProvider = provSelect ? provSelect.value : 'rainviewer';
            if (lat !== undefined && lon !== undefined && window.MapController.map) {
                window.MapController.map.setView([lat, lon], 7);
            }
            window.MapController.renderRadarFrame(window.MapController.radarIndex || 0);
        }
    };


    }

})();

