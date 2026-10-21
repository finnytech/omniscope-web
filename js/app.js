/**
 * CYBER-SPECTRE-NEXUS: Operations Master Orchestrator
 * Handles digital clocks, instant camera searching & filtering,
 * modal dialogs, and detached window pop-outs.
 */

window.toggleOsintToolsDrawer = function(e) {
    if (e) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
    }
    const drawer = document.getElementById('osint-tools-drawer');
    if (!drawer) return;
    const isHidden = drawer.classList.contains('hidden') || drawer.style.display === 'none' || window.getComputedStyle(drawer).display === 'none';
    if (isHidden) {
        drawer.classList.remove('hidden');
        drawer.style.setProperty('display', 'flex', 'important');
        drawer.style.setProperty('z-index', '3500', 'important');
        drawer.style.setProperty('pointer-events', 'auto', 'important');
        try {
            const mapInst = (window.MainMap && window.MainMap.map) || (window.operationsMap && window.operationsMap.map);
            if (mapInst) {
                const center = mapInst.getCenter();
                const latInput = document.getElementById('tool-sun-lat');
                const lonInput = document.getElementById('tool-sun-lon');
                if (latInput && lonInput) {
                    latInput.value = center.lat.toFixed(4);
                    lonInput.value = center.lng.toFixed(4);
                }
            }
        } catch(err) {}
        const dtInput = document.getElementById('tool-sun-datetime');
        if (dtInput && !dtInput.value) {
            dtInput.value = new Date().toISOString().slice(0, 16);
        }
    } else {
        drawer.classList.add('hidden');
        drawer.style.setProperty('display', 'none', 'important');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Synchronize UTC & Local Clocks
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock-utc').innerText = now.toISOString().substr(11, 8);
        document.getElementById('clock-local').innerText = now.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);

    // 1b. Real-Time 100+ FPS Hardware Performance Monitor
    let frameCount = 0;
    let lastFpsTime = performance.now();
    const fpsValEl = document.getElementById('fps-counter-val');
    const fpsDotEl = document.getElementById('fps-dot');

    function fpsLoop(now) {
        frameCount++;
        const delta = now - lastFpsTime;
        if (delta >= 400) {
            const currentFps = Math.min(240, Math.round((frameCount * 1000) / delta));
            if (fpsValEl) {
                fpsValEl.innerText = `${currentFps} FPS`;
                if (currentFps >= 90) {
                    fpsValEl.style.color = '#34d399';
                    if (fpsDotEl) fpsDotEl.style.background = '#10b981';
                } else if (currentFps >= 50) {
                    fpsValEl.style.color = '#38bdf8';
                    if (fpsDotEl) fpsDotEl.style.background = '#38bdf8';
                } else {
                    fpsValEl.style.color = '#f59e0b';
                    if (fpsDotEl) fpsDotEl.style.background = '#f59e0b';
                }
            }
            frameCount = 0;
            lastFpsTime = now;
        }
        requestAnimationFrame(fpsLoop);
    }
    requestAnimationFrame(fpsLoop);

    // 2. Intelligent Windy & Catalog Search Engine
    const searchInput = document.getElementById('cam-search');
    const searchBtn = document.getElementById('btn-search-windy');
    const titleEl = document.getElementById('cam-active-title');
    const banner = document.getElementById('cam-telemetry-banner');
    const listContainer = document.getElementById('available-cams-list');

    async function executeWindySearch(q) {
        const query = (q || '').trim();
        if (!query || query.length < 2) return;

        if (titleEl) titleEl.innerText = `SEARCHING GLOBAL FEEDS: "${query.toUpperCase()}"...`;

        try {
            const res = await fetch(`/api/windy/search?query=${encodeURIComponent(query)}&limit=20`);
            const data = await res.json();
            const cams = data.webcams || [];

            if (listContainer) listContainer.innerHTML = '';

            if (cams.length > 0) {
                // Populate available cameras selector with 4-provider badges
                cams.forEach((cam, idx) => {
                    if (listContainer) {
                        const prov = cam.provider || 'Windy';
                        let badgeColor = '#10b981'; // Windy emerald
                        if (prov === 'EarthCam') badgeColor = '#00f0ff'; // Cyan
                        else if (prov === 'Skyline') badgeColor = '#f59e0b'; // Amber
                        else if (prov === 'Panomax') badgeColor = '#818cf8'; // Purple
                        else if (prov === 'Roundshot') badgeColor = '#ec4899'; // Pink
                        else if (prov === 'OpenCam') badgeColor = '#38bdf8'; // Sky Blue

                        const btn = document.createElement('button');
                        btn.className = `ops-btn ${idx === 0 ? 'active' : ''}`;
                        btn.style.cssText = 'padding:2px 8px;font-size:0.72rem;background:#131b2e;border:1px solid #334155;white-space:nowrap;cursor:pointer;display:inline-flex;align-items:center;gap:5px;';
                        btn.innerHTML = `<span style="color:${badgeColor};font-weight:bold;">[${prov.toUpperCase()}]</span> <span>${(cam.title || 'Camera').substring(0, 22)}</span> <span style="color:#94a3b8;">(${cam.city || cam.country || 'Live'})</span>`;
                        
                        btn.onclick = () => {
                            document.querySelectorAll('#available-cams-list button').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            window.MainPlayer.playCam(cam, 'live');
                            if (titleEl) titleEl.innerText = `${prov.toUpperCase()} LIVE: ${(cam.title || 'WEBCAM').toUpperCase()}`;
                            if (banner) {
                                banner.innerHTML = `
                                    <span>${cam.city || ''}, ${cam.country || ''} // STATUS: ACTIVE // SOURCE: ${prov.toUpperCase()}</span>
                                    <span>${(cam.categories || []).join(', ') || 'LIVE FEED'}</span>
                                `;
                            }
                            if (cam.lat && cam.lon && window.MapController && window.MapController.map) {
                                window.MapController.map.setView([cam.lat, cam.lon], 9);
                                window.MapController.placeReticle(cam.lat, cam.lon);
                            }
                        };
                        listContainer.appendChild(btn);
                    }
                });

                // Auto-stream first match with live video
                const first = cams[0];
                const firstProv = first.provider || 'Windy';
                window.MainPlayer.playCam(first, 'live');
                if (titleEl) titleEl.innerText = `${firstProv.toUpperCase()} LIVE: ${(first.title || 'WEBCAM').toUpperCase()}`;
                if (banner) {
                    banner.innerHTML = `
                        <span>${first.city || ''}, ${first.country || ''} // STATUS: ACTIVE // SOURCE: ${firstProv.toUpperCase()}</span>
                        <span>${(first.categories || []).join(', ') || 'LIVE FEED'}</span>
                    `;
                }

                if (first.lat && first.lon && window.MapController && window.MapController.map) {
                    window.MapController.map.setView([first.lat, first.lon], 8);
                    window.MapController.placeReticle(first.lat, first.lon);
                }
            } else {
                if (listContainer) {
                    listContainer.innerHTML = `<span style="color:var(--text-dim);">NO ACTIVE WEBCAMS FOUND FOR "${query}"</span>`;
                }
                if (titleEl) titleEl.innerText = `NO WEBCAMS FOUND: ${query}`;
            }
        } catch (err) {
            console.warn("Windy search error:", err);
            if (titleEl) titleEl.innerText = `ERROR QUERYING WEBCAMS`;
        }
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            executeWindySearch(searchInput.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeWindySearch(searchInput.value);
            }
        });

        // Debounced live typing search
        let searchTimer = null;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            const val = e.target.value.trim();
            if (val.length < 3) return;
            searchTimer = setTimeout(() => {
                executeWindySearch(val);
            }, 550);
        });
    }


    // 5. Multi-Window Detach (Pop out into secondary monitor)
    const popoutBtn = document.getElementById('btn-popout');
    if (popoutBtn) {
        popoutBtn.addEventListener('click', () => {
            window.open(window.location.href, '_blank', 'width=1400,height=900');
        });
    }

    // 6. Universal YouTube & Stream URL Resolver
    function getCleanStreamUrl(inputUrl) {
        if (!inputUrl) return '';
        const trimmed = inputUrl.trim();
        let videoId = '';
        if (trimmed.includes('youtu.be/')) {
            videoId = trimmed.split('youtu.be/')[1].split(/[?#&]/)[0];
        } else if (trimmed.includes('watch?v=')) {
            videoId = trimmed.split('watch?v=')[1].split(/[?#&]/)[0];
        } else if (trimmed.includes('embed/')) {
            videoId = trimmed.split('embed/')[1].split(/[?#&]/)[0];
        } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
            videoId = trimmed;
        }

        if (videoId) {
            return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1`;
        }
        return trimmed;
    }

    function wireStreamInput(btnId, inputId, iframeId) {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (!btn || !input) return;

        const loadStream = () => {
            const resolved = getCleanStreamUrl(input.value);
            if (resolved) {
                if (window.RamCleaner && window.RamCleaner.resumeStream) {
                    window.RamCleaner.resumeStream(iframeId, resolved);
                } else {
                    const iframe = document.getElementById(iframeId);
                    if (iframe) iframe.src = resolved;
                }
                if (window.CyberAudio && window.CyberAudio.playStreamConnect) window.CyberAudio.playStreamConnect();
            }
        };

        btn.addEventListener('click', loadStream);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                loadStream();
            }
        });
    }

    // Wire custom stream loaders for all monitors
    wireStreamInput('btn-load-iss-stream', 'iss-custom-stream', 'nasa-iss-iframe');
    wireStreamInput('btn-load-storm-stream', 'storm-custom-stream', 'storm-stream-iframe');
    wireStreamInput('btn-load-volcano-stream', 'volcano-custom-stream', 'volcano-stream-iframe');
    wireStreamInput('btn-load-flight-stream', 'flight-custom-stream', 'flight-stream-iframe');
    wireStreamInput('btn-load-firms-stream', 'firms-custom-stream', 'firms-stream-iframe');
    wireStreamInput('btn-load-quakes-stream', 'quakes-custom-stream', 'quakes-stream-iframe');
    wireStreamInput('btn-load-vessels-stream', 'vessels-custom-stream', 'vessels-stream-iframe');
    wireStreamInput('btn-load-gearth', 'gearth-url-input', 'google-earth-iframe');

    // Wire 1-click Preset Dropdowns for Monitors 04, 05, and 12
    function wirePresetDropdown(selectId, inputId, iframeId, telemetryId, labelPrefix) {
        const select = document.getElementById(selectId);
        const input = document.getElementById(inputId);
        const telemetry = document.getElementById(telemetryId);
        if (!select) return;

        select.addEventListener('change', () => {
            const url = select.value;
            if (input) input.value = url;
            const resolved = getCleanStreamUrl(url);
            if (resolved) {
                if (window.RamCleaner && window.RamCleaner.resumeStream) {
                    window.RamCleaner.resumeStream(iframeId, resolved);
                } else {
                    const iframe = document.getElementById(iframeId);
                    if (iframe) iframe.src = resolved;
                }
            }
            if (telemetry) {
                const selectedText = select.options[select.selectedIndex]?.text || '';
                telemetry.innerText = `${labelPrefix || 'STREAM'}: ${selectedText.toUpperCase()}`;
            }
            if (window.CyberAudio && window.CyberAudio.playStreamConnect) {
                window.CyberAudio.playStreamConnect();
            }
        });
    }

    wirePresetDropdown('flight-preset-select', 'flight-custom-stream', 'flight-stream-iframe', 'flight-telemetry-left', 'RUNWAY');
    wirePresetDropdown('firms-preset-select', 'firms-custom-stream', 'firms-stream-iframe', 'firms-telemetry-left', 'LOOKOUT');
    wirePresetDropdown('vessels-preset-select', 'vessels-custom-stream', 'vessels-stream-iframe', 'vessels-telemetry-left', 'HARBOR');

    // 7. Google Earth 3D WebGL Globe & Presets
    if (typeof EarthGlobe3D !== 'undefined') {
        window.globe3D = new EarthGlobe3D('globe-3d-container', 'globe-3d-canvas');
    }

    const btnIss = document.getElementById('btn-gearth-iss');
    const btnNyc = document.getElementById('btn-gearth-nyc');
    const btnTokyo = document.getElementById('btn-gearth-tokyo');
    const btnAlps = document.getElementById('btn-gearth-alps');
    const gearthInput = document.getElementById('gearth-url-input');
    const btnLoadGearth = document.getElementById('btn-load-gearth');

    if (btnIss) {
        btnIss.onclick = () => {
            if (window.globe3D) window.globe3D.rotateToISS();
            if (gearthInput) gearthInput.value = 'ISS ORBITAL POSITION';
        };
    }
    if (btnNyc) {
        btnNyc.onclick = () => {
            if (window.globe3D) window.globe3D.rotateTo(40.7128, -74.0060, 'NEW YORK CITY 3D', 15);
            if (gearthInput) gearthInput.value = '40.7128, -74.0060 (New York)';
        };
    }
    if (btnTokyo) {
        btnTokyo.onclick = () => {
            if (window.globe3D) window.globe3D.rotateTo(35.6762, 139.6503, 'TOKYO METROPOLIS 3D', 15);
            if (gearthInput) gearthInput.value = '35.6762, 139.6503 (Tokyo)';
        };
    }
    if (btnAlps) {
        btnAlps.onclick = () => {
            if (window.globe3D) window.globe3D.rotateTo(45.9763, 7.6586, 'MATTERHORN ALPS 3D', 15);
            if (gearthInput) gearthInput.value = '45.9763, 7.6586 (Matterhorn Alps)';
        };
    }

    if (btnLoadGearth && gearthInput) {
        btnLoadGearth.onclick = () => {
            const val = gearthInput.value.trim();
            if (!val) return;

            // Check if Google Earth URL with @lat,lon
            const matchEarth = val.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
            if (matchEarth) {
                const lat = parseFloat(matchEarth[1]);
                const lon = parseFloat(matchEarth[2]);
                if (window.globe3D) window.globe3D.rotateTo(lat, lon, 'GEARTH TARGET', 15);
                return;
            }

            // Check if comma-separated lat, lon
            const parts = val.split(/[,\s]+/);
            if (parts.length >= 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                const lat = parseFloat(parts[0]);
                const lon = parseFloat(parts[1]);
                if (window.globe3D) window.globe3D.rotateTo(lat, lon, 'COORDINATE TARGET', 15);
                return;
            }

            // Keyword lookup
            const lower = val.toLowerCase();
            if (lower.includes('iss')) {
                if (window.globe3D) window.globe3D.rotateToISS();
            } else if (lower.includes('nyc') || lower.includes('york')) {
                if (window.globe3D) window.globe3D.rotateTo(40.7128, -74.0060, 'NEW YORK 3D', 15);
            } else if (lower.includes('tokyo') || lower.includes('japan')) {
                if (window.globe3D) window.globe3D.rotateTo(35.6762, 139.6503, 'TOKYO 3D', 15);
            } else if (lower.includes('alps') || lower.includes('matterhorn')) {
                if (window.globe3D) window.globe3D.rotateTo(45.9763, 7.6586, 'ALPS 3D', 15);
            } else if (lower.includes('berlin') || lower.includes('germany')) {
                if (window.globe3D) window.globe3D.rotateTo(52.5200, 13.4050, 'BERLIN SECTOR', 15);
            } else if (lower.includes('paris')) {
                if (window.globe3D) window.globe3D.rotateTo(48.8566, 2.3522, 'PARIS SECTOR', 15);
            } else if (lower.includes('london')) {
                if (window.globe3D) window.globe3D.rotateTo(51.5074, -0.1278, 'LONDON SECTOR', 15);
            }
        };
    }

    // 8. View Mode Toggles for Flight, Fire, Earthquake, Storm, and Vessel cards (CAM / DATA / SPLIT)
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = btn.getAttribute('data-mode');
            const card = btn.closest('.monitor-card');
            if (!card) return;

            card.classList.remove('mode-cam', 'mode-data', 'mode-split');
            card.classList.add(`mode-${mode}`);

            card.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 9. Periodic Telemetry Fetching & Live Log Streaming
    // Severe Weather (NOAA)
    async function updateSevereWeather() {
        try {
            const res = await fetch('/api/weather/alerts/severe');
            if (!res.ok) return;
            const data = await res.json();
            const alerts = data.alerts || [];
            const badge = document.getElementById('storm-alerts-count');
            const noaaBadge = document.getElementById('noaa-alerts-count');
            const snippet = document.getElementById('storm-quick-alerts');

            const alertText = `${alerts.length} NOAA ACTIVE`;
            if (badge) badge.innerText = alertText;
            if (noaaBadge) noaaBadge.innerText = alertText;

            if (snippet && alerts.length > 0) {
                const first = alerts[0];
                snippet.innerText = `ALERT: ${(first.event || 'Severe Storm').toUpperCase()} (${(first.area_description || first.area || 'US').slice(0, 30)})`;
            }

            renderStormAlertsTable(alerts);
        } catch (e) {
            console.warn("Severe weather fetch error:", e);
        }
    }

    function renderStormAlertsTable(alerts) {
        const tbody = document.getElementById('storm-alerts-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!alerts || alerts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-dim);padding:15px;">NO ACTIVE NOAA SEVERE WARNINGS DETECTED</td></tr>';
            return;
        }

        alerts.slice(0, 60).forEach(a => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';

            const sev = (a.severity || 'Unknown').toUpperCase();
            let sevCls = 'tag-accent';
            if (sev === 'EXTREME') sevCls = 'tag-alert';
            else if (sev === 'SEVERE') sevCls = 'tag-warn';

            const evt = a.event || 'Severe Alert';
            const area = (a.area_description || 'US Sector').slice(0, 45);
            const hasGeom = !!a.geometry;

            tr.innerHTML = `
                <td><span class="${sevCls}" style="font-size:0.68rem;padding:1px 4px;border-radius:2px;font-weight:700;">${sev}</span></td>
                <td style="font-weight:600;color:var(--text-main);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${evt}">${evt}</td>
                <td style="color:var(--text-muted);font-size:0.72rem;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${a.area_description || ''}">${area}</td>
                <td>
                    <button class="ops-btn" style="padding:1px 6px;font-size:0.65rem;color:${hasGeom ? '#38bdf8' : 'var(--text-muted)'};">
                        ${hasGeom ? 'RADAR 🎯' : 'VIEW ↗'}
                    </button>
                </td>
            `;

            tr.onclick = () => {
                if (window.MapController && window.MapController.locateAlert) {
                    window.MapController.locateAlert(a.id);
                } else if (window.showTacticalDossier) {
                    window.showTacticalDossier(
                        `NOAA // ${evt}`,
                        `SEVERE WEATHER BULLETIN`,
                        [
                            { label: "EVENT", val: evt, cls: sevCls },
                            { label: "SEVERITY", val: sev },
                            { label: "AREA", val: a.area_description || "N/A" },
                            { label: "HEADLINE", val: a.headline || "N/A" },
                            { label: "INSTRUCTION", val: a.instruction || "No specific instructions." }
                        ],
                        37.0, -95.0
                    );
                }
            };

            tbody.appendChild(tr);
        });
    }

    updateSevereWeather();
    setInterval(updateSevereWeather, 60000);

    // Multi-Sensor Intelligence Event Log (MON-07)
    async function updateEventLog() {
        try {
            const res = await fetch('/api/telemetry/events?limit=40');
            if (!res.ok) return;
            const data = await res.json();
            const events = Array.isArray(data) ? data : (data.events || []);
            const logContainer = document.getElementById('tactical-event-log');
            if (!logContainer) return;

            if (events.length === 0) {
                logContainer.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:20px;">AWAITING MULTI-SENSOR AUDIT STREAM...</div>';
                return;
            }

            logContainer.innerHTML = '';
            events.forEach(ev => {
                const row = document.createElement('div');
                const sev = (ev.severity || 'info').toLowerCase();
                const sevClass = sev === 'critical' ? 'event-sev-critical' : (sev === 'warning' ? 'event-sev-warning' : 'event-sev-info');
                row.className = `event-log-row ${sevClass}`;

                // Source badge color styling
                let srcBadgeStyle = "background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid rgba(56,189,248,0.4);";
                const src = (ev.source || ev.category || 'INTEL').toUpperCase();
                if (src === 'NOAA') {
                    srcBadgeStyle = "background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.4);";
                } else if (src === 'SEISMIC') {
                    srcBadgeStyle = "background:rgba(251,146,60,0.15);color:#fb923c;border:1px solid rgba(251,146,60,0.4);";
                } else if (src === 'ORBIT') {
                    srcBadgeStyle = "background:rgba(168,85,247,0.15);color:#c084fc;border:1px solid rgba(168,85,247,0.4);";
                } else if (src === 'MARITIME') {
                    srcBadgeStyle = "background:rgba(6,182,212,0.15);color:#22d3ee;border:1px solid rgba(6,182,212,0.4);";
                } else if (src === 'WILDFIRE') {
                    srcBadgeStyle = "background:rgba(244,63,94,0.15);color:#fb7185;border:1px solid rgba(244,63,94,0.4);";
                } else if (src === 'CYBER') {
                    srcBadgeStyle = "background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.4);";
                }

                // Time formatting
                let timeDisplay = ev.time_str || '';
                if (!timeDisplay && ev.timestamp) {
                    if (typeof ev.timestamp === 'string') {
                        timeDisplay = ev.timestamp.includes('T') ? ev.timestamp.split('T')[1].substr(0, 8) : ev.timestamp.substr(0, 8);
                    } else {
                        const d = new Date(ev.timestamp * 1000);
                        timeDisplay = d.toTimeString().substr(0, 8);
                    }
                }
                if (!timeDisplay) timeDisplay = new Date().toTimeString().substr(0, 8);

                const icon = ev.icon || '●';
                const detailText = ev.detail || ev.details || ev.location || '';
                const coordsText = (ev.lat !== undefined && ev.lon !== undefined && ev.lat !== null && ev.lon !== null) ? 
                    `${Number(ev.lat).toFixed(2)}°, ${Number(ev.lon).toFixed(2)}°` : '';

                row.innerHTML = `
                    <span style="color:var(--text-dim);font-size:0.68rem;min-width:55px;">${timeDisplay}</span>
                    <span style="${srcBadgeStyle}padding:1px 5px;border-radius:2px;font-size:0.65rem;font-weight:bold;min-width:62px;text-align:center;">[${src}]</span>
                    <span style="font-size:0.75rem;">${icon}</span>
                    <strong style="color:#f8fafc;font-size:0.72rem;white-space:nowrap;">${ev.title}</strong>
                    <span style="color:var(--text-muted);font-size:0.7rem;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${detailText}">${detailText}</span>
                    ${coordsText ? `<span style="color:var(--accent);font-size:0.66rem;white-space:nowrap;">${coordsText}</span>` : ''}
                `;

                row.onclick = () => {
                    if (ev.lat && ev.lon) {
                        if (window.cyberMap && window.cyberMap.map) {
                            window.cyberMap.map.setView([ev.lat, ev.lon], 6);
                            if (window.cyberMap.placeReticle) {
                                window.cyberMap.placeReticle(ev.lat, ev.lon);
                            }
                        }
                        if (window.showTacticalDossier) {
                            window.showTacticalDossier(
                                `${src} // ${ev.title}`,
                                `TACTICAL MULTI-SENSOR AUDIT`,
                                [
                                    { label: "SENSOR SUBSYSTEM", val: src, cls: "tag-accent" },
                                    { label: "SEVERITY LEVEL", val: (ev.severity || 'info').toUpperCase() },
                                    { label: "TIME STAMP", val: ev.iso_time || timeDisplay },
                                    { label: "EVENT DETAIL", val: detailText },
                                    { label: "GEO COORDINATES", val: `${Number(ev.lat).toFixed(4)}°, ${Number(ev.lon).toFixed(4)}°` }
                                ],
                                ev.lat,
                                ev.lon
                            );
                        }
                    }
                };

                logContainer.appendChild(row);
            });

            // Smooth auto-scroll
            logContainer.scrollTop = 0;
        } catch (e) {
            console.warn("MON-10 Event Log update error:", e);
        }
    }
    updateEventLog();
    setInterval(updateEventLog, 8000);

    // =========================================================================
    // MONITOR 13: Global OSINT News Desk (GDELT, UN ReliefWeb, EMSC Euro-Med)
    // =========================================================================
    let currentOsintCat = 'all';
    let currentOsintProv = 'all';
    const osintContainer = document.getElementById('osint-news-container');
    const osintBadge = document.getElementById('osint-count-badge');
    const osintFilterBtns = document.querySelectorAll('.osint-filter-btn');
    const osintProvBtns = document.querySelectorAll('.osint-prov-btn');

    osintFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            osintFilterBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = 'var(--text-dim)';
            });
            btn.classList.add('active');
            btn.style.background = '#1e293b';
            btn.style.color = '#38bdf8';
            currentOsintCat = btn.getAttribute('data-cat') || 'all';
            updateOSINTNews();
        });
    });

    const osintSelect = document.getElementById('osint-provider-select');
    if (osintSelect) {
        fetch('/api/news/providers')
            .then(r => r.json())
            .then(d => {
                const provs = d.providers || [];
                provs.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.name;
                    opt.textContent = `[${p.category || 'OSINT'}] ${p.name} (${p.country || 'Global'})`;
                    osintSelect.appendChild(opt);
                });
            })
            .catch(() => {});

        osintSelect.addEventListener('change', () => {
            currentOsintProv = osintSelect.value;
            osintProvBtns.forEach(b => {
                b.classList.remove('active');
                b.style.borderColor = '#334155';
                b.style.background = '#0f172a';
                b.style.color = '#cbd5e1';
            });
            updateOSINTNews();
        });
    }

    osintProvBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            osintProvBtns.forEach(b => {
                b.classList.remove('active');
                b.style.borderColor = '#334155';
                b.style.background = '#0f172a';
                b.style.color = '#cbd5e1';
            });
            btn.classList.add('active');
            btn.style.borderColor = '#38bdf8';
            btn.style.background = 'rgba(56,189,248,0.15)';
            btn.style.color = '#38bdf8';
            currentOsintProv = btn.getAttribute('data-prov') || 'all';
            if (osintSelect) osintSelect.value = currentOsintProv;
            updateOSINTNews();
        });
    });

    async function updateOSINTNews() {
        if (!osintContainer) return;
        try {
            const provQuery = currentOsintProv && currentOsintProv !== 'all' ? `&provider=${encodeURIComponent(currentOsintProv)}` : '';
            const res = await fetch(`/api/news/osint?category=${encodeURIComponent(currentOsintCat)}${provQuery}&limit=35`);
            if (!res.ok) return;
            const data = await res.json();
            const items = data.items || [];

            if (items.length === 0) {
                osintContainer.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-dim);font-family:var(--font-mono);">NO RECENT OSINT DISPATCHES FOR "${currentOsintCat.toUpperCase()}" (${currentOsintProv.toUpperCase()}).</div>`;
                return;
            }

            if (osintBadge) {
                osintBadge.innerText = `${items.length} INTEL DISPATCHES`;
            }

            osintContainer.innerHTML = '';
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'osint-card-item';
                card.style.cssText = 'background:rgba(15,23,42,0.7);border:1px solid #1e293b;border-radius:4px;padding:7px 9px;display:flex;flex-direction:column;gap:4px;transition:border-color 0.2s;';
                card.onmouseenter = () => card.style.borderColor = '#38bdf8';
                card.onmouseleave = () => card.style.borderColor = '#1e293b';

                let srcColor = '#38bdf8';
                const s = item.source || '';
                if (s === 'UN ReliefWeb') srcColor = '#a855f7';
                else if (s === 'EMSC') srcColor = '#f97316';
                else if (s === 'BBC News') srcColor = '#ef4444';
                else if (s === 'Deutsche Welle') srcColor = '#38bdf8';
                else if (s === 'Al Jazeera') srcColor = '#f59e0b';
                else if (s === 'France 24') srcColor = '#06b6d4';
                else if (s === 'The Guardian') srcColor = '#3b82f6';
                else if (s === 'Tagesschau') srcColor = '#60a5fa';

                let sevBadge = '';
                if (item.urgency === 'high' || item.urgency === 'critical') {
                    sevBadge = `<span class="tag-alert" style="font-size:0.62rem;padding:1px 5px;">URGENT</span>`;
                }

                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.68rem;font-family:var(--font-mono);">
                        <div style="display:flex;align-items:center;gap:6px;">
                            <span style="color:${srcColor};font-weight:bold;">[${(item.source || 'INTEL').toUpperCase()}]</span>
                            <span style="color:var(--text-dim);">${item.category ? item.category.toUpperCase() : 'INTEL'}</span>
                            ${sevBadge}
                        </div>
                        <span style="color:var(--text-dim);font-size:0.64rem;">${item.timestamp ? item.timestamp.substr(11, 8) : ''}</span>
                    </div>
                    <a href="${item.url || '#'}" target="_blank" rel="noopener noreferrer" style="color:#f8fafc;font-size:0.75rem;font-weight:600;text-decoration:none;line-height:1.3;display:block;">
                        ${item.title}
                    </a>
                    <div style="color:#94a3b8;font-size:0.68rem;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
                        ${item.summary || ''}
                    </div>
                `;
                osintContainer.appendChild(card);
            });
        } catch (e) {
            console.warn("MON-13 OSINT News update error:", e);
        }
    }
    updateOSINTNews();
    setInterval(updateOSINTNews, 45000);

    // =========================================================================
    // 140+ KEYLESS WEATHER ENGINES & MULTI-MODEL CONSENSUS
    // =========================================================================
    const weatherEnginesModal = document.getElementById('weather-engines-modal');
    const btnOpenWeatherEngines = document.getElementById('btn-weather-engines-modal');
    const btnCloseWeatherEngines = document.getElementById('btn-close-weather-engines');
    const weatherEngineList = document.getElementById('weather-engine-list-container');
    const weatherDossier = document.getElementById('weather-engine-inspector-dossier');
    const btnRunConsensus = document.getElementById('btn-run-weather-consensus');
    const btnSidebarConsensus = document.getElementById('btn-sidebar-weather-consensus');
    const consensusBox = document.getElementById('weather-consensus-box');
    const sidebarWeatherSelect = document.getElementById('sidebar-weather-provider-select');
    const btnSidebarInspect = document.getElementById('btn-sidebar-inspect-engine');

    let allWeatherProviders = [];
    let selectedWeatherEngine = 'bright_sky';

    function openWeatherEnginesModal() {
        if (weatherEnginesModal) {
            weatherEnginesModal.classList.remove('hidden');
            loadWeatherProviders();
        }
    }

    if (btnOpenWeatherEngines) btnOpenWeatherEngines.addEventListener('click', openWeatherEnginesModal);
    if (btnCloseWeatherEngines) btnCloseWeatherEngines.addEventListener('click', () => {
        if (weatherEnginesModal) weatherEnginesModal.classList.add('hidden');
    });
    if (weatherEnginesModal) {
        weatherEnginesModal.addEventListener('click', (e) => {
            if (e.target === weatherEnginesModal) weatherEnginesModal.classList.add('hidden');
        });
    }

    if (btnSidebarInspect && sidebarWeatherSelect) {
        btnSidebarInspect.addEventListener('click', () => {
            const pId = sidebarWeatherSelect.value;
            openWeatherEnginesModal();
            selectAndInspectWeatherEngine(pId);
        });
    }

    async function loadWeatherProviders() {
        if (!weatherEngineList) return;
        try {
            const res = await fetch('/api/weather/providers');
            if (!res.ok) return;
            const data = await res.json();
            allWeatherProviders = data.providers || [];

            weatherEngineList.innerHTML = '';
            allWeatherProviders.forEach(p => {
                const row = document.createElement('div');
                row.className = `weather-prov-row ${p.id === selectedWeatherEngine ? 'active' : ''}`;
                row.style.cssText = `padding:6px 8px;border-radius:4px;cursor:pointer;display:flex;flex-direction:column;gap:2px;background:${p.id === selectedWeatherEngine ? 'rgba(56,189,248,0.15)' : '#070d18'};border:1px solid ${p.id === selectedWeatherEngine ? '#38bdf8' : '#1e293b'};transition:all 0.15s;`;
                row.onmouseenter = () => { if (p.id !== selectedWeatherEngine) row.style.borderColor = '#38bdf8'; };
                row.onmouseleave = () => { if (p.id !== selectedWeatherEngine) row.style.borderColor = '#1e293b'; };

                const col = p.badge_color || '#38bdf8';
                row.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#f8fafc;font-weight:600;font-size:0.75rem;">${p.name}</span>
                        <span style="background:rgba(16,185,129,0.15);color:#10b981;font-size:0.6rem;padding:1px 4px;border-radius:2px;font-family:var(--font-mono);font-weight:bold;">NO KEY</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;color:#94a3b8;font-size:0.66rem;font-family:var(--font-mono);">
                        <span style="color:${col};">${p.agency || p.region}</span>
                        <span>${p.format || 'JSON'}</span>
                    </div>
                `;

                row.addEventListener('click', () => {
                    selectedWeatherEngine = p.id;
                    document.querySelectorAll('.weather-prov-row').forEach(r => {
                        r.style.background = '#070d18';
                        r.style.borderColor = '#1e293b';
                    });
                    row.style.background = 'rgba(56,189,248,0.15)';
                    row.style.borderColor = '#38bdf8';
                    inspectWeatherEngine(p);
                });

                weatherEngineList.appendChild(row);
            });

            // Inspect default engine
            const initProv = allWeatherProviders.find(p => p.id === selectedWeatherEngine) || allWeatherProviders[0];
            if (initProv) inspectWeatherEngine(initProv);

        } catch (e) {
            console.warn("Error loading weather providers:", e);
        }
    }

    function selectAndInspectWeatherEngine(pId) {
        selectedWeatherEngine = pId;
        const prov = allWeatherProviders.find(p => p.id === pId);
        if (prov) {
            inspectWeatherEngine(prov);
            document.querySelectorAll('.weather-prov-row').forEach(r => {
                r.style.background = '#070d18';
                r.style.borderColor = '#1e293b';
            });
        }
    }

    async function inspectWeatherEngine(provider) {
        if (!weatherDossier) return;
        weatherDossier.innerHTML = `<div style="text-align:center;padding:30px;color:#38bdf8;font-family:var(--font-mono);">QUERYING ${provider.name.toUpperCase()} LIVE FEED...</div>`;

        let lat = 52.52;
        let lon = 13.405;
        const mapCtrl = window.MapController || window.OperationsMapInstance;
        if (mapCtrl && mapCtrl.map) {
            const center = mapCtrl.map.getCenter();
            lat = center.lat;
            lon = center.lng;
        }

        try {
            const res = await fetch(`/api/weather/provider/${provider.id}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`);
            const data = await res.json();

            const col = provider.badge_color || '#38bdf8';
            weatherDossier.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #1e293b;padding-bottom:8px;">
                    <div>
                        <div style="color:${col};font-weight:bold;font-size:0.95rem;">${provider.name}</div>
                        <div style="color:#94a3b8;font-size:0.75rem;">${provider.agency || ''} • ${provider.region || ''}</div>
                    </div>
                    <span class="tag-accent" style="font-size:0.68rem;background:rgba(16,185,129,0.15);color:#10b981;border-color:#10b981;">100% KEYLESS OPEN FEED</span>
                </div>
                <div style="font-size:0.75rem;color:#cbd5e1;line-height:1.4;">${provider.description || ''}</div>
                <div style="background:#070d18;border:1px solid #1e293b;border-radius:4px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.7rem;color:#94a3b8;">
                        <span>TARGET COORDINATES: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°</span>
                        <span style="color:${data.cached ? '#facc15' : '#10b981'};">${data.cached ? '⚡ MEMORY CACHED' : '🔴 LIVE QUERY'}</span>
                    </div>
                    <div style="color:#38bdf8;font-weight:bold;font-size:0.85rem;line-height:1.35;">
                        ${data.raw_summary || data.summary || 'Synoptic Observation Acquired'}
                    </div>
                    ${data.temperature_c !== undefined && data.temperature_c !== null ? `
                    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin-top:4px;">
                        <div style="background:#0b1329;padding:6px;border-radius:3px;text-align:center;">
                            <div style="font-size:0.65rem;color:#94a3b8;">TEMPERATURE</div>
                            <div style="font-size:1.05rem;font-weight:bold;color:#f8fafc;">${data.temperature_c}°C</div>
                        </div>
                        <div style="background:#0b1329;padding:6px;border-radius:3px;text-align:center;">
                            <div style="font-size:0.65rem;color:#94a3b8;">WIND SPEED</div>
                            <div style="font-size:1.05rem;font-weight:bold;color:#38bdf8;">${data.wind_speed_kmh || data.wind_speed_ms || '--'} ${data.wind_speed_kmh ? 'km/h' : ''}</div>
                        </div>
                        <div style="background:#0b1329;padding:6px;border-radius:3px;text-align:center;">
                            <div style="font-size:0.65rem;color:#94a3b8;">PRESSURE</div>
                            <div style="font-size:1.05rem;font-weight:bold;color:#a78bfa;">${data.pressure_msl_hpa || data.pressure_hpa || '--'} hPa</div>
                        </div>
                    </div>` : ''}
                </div>
                <div style="background:#030712;border:1px solid #1e293b;border-radius:4px;padding:8px;max-height:140px;overflow-y:auto;font-family:var(--font-mono);font-size:0.68rem;color:#94a3b8;">
                    <pre style="margin:0;white-space:pre-wrap;word-break:break-all;">${JSON.stringify(data, null, 2)}</pre>
                </div>
            `;
        } catch (e) {
            weatherDossier.innerHTML = `<div style="color:#ef4444;padding:20px;text-align:center;font-family:var(--font-mono);">ERROR QUERYING ${provider.name}: ${e.message}</div>`;
        }
    }

    async function runWeatherConsensus() {
        if (!consensusBox) return;
        consensusBox.style.display = 'block';
        consensusBox.innerHTML = `<div style="text-align:center;padding:12px;color:#38bdf8;font-family:var(--font-mono);">POLLING DWD, ECMWF, GFS, YR.NO, ICON-D2, AROME & SMHI...</div>`;

        let lat = 52.52;
        let lon = 13.405;
        const mapCtrl = window.MapController || window.OperationsMapInstance;
        if (mapCtrl && mapCtrl.map) {
            const center = mapCtrl.map.getCenter();
            lat = center.lat;
            lon = center.lng;
        }

        try {
            const res = await fetch(`/api/weather/multi-compare?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`);
            const data = await res.json();
            const models = data.models || [];

            let gridHtml = '';
            models.forEach(m => {
                gridHtml += `
                    <div style="background:#070d18;border:1px solid #1e293b;border-radius:3px;padding:6px;display:flex;flex-direction:column;gap:2px;">
                        <span style="color:#38bdf8;font-weight:bold;font-size:0.68rem;">${m.name}</span>
                        <div style="display:flex;justify-content:space-between;font-size:0.75rem;font-weight:bold;color:#f8fafc;">
                            <span>${m.temperature_c !== null && m.temperature_c !== undefined ? m.temperature_c + '°C' : 'N/A'}</span>
                            <span style="font-size:0.65rem;color:#94a3b8;">${m.wind_speed_kmh ? m.wind_speed_kmh + ' km/h' : ''}</span>
                        </div>
                    </div>
                `;
            });

            consensusBox.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="color:#38bdf8;font-weight:bold;font-size:0.8rem;">MULTI-MODEL CONSENSUS (${data.models_compared} ENGINES)</span>
                        <span class="tag-accent" style="background:rgba(16,185,129,0.15);color:#10b981;border-color:#10b981;font-size:0.65rem;">AGREEMENT: ${data.confidence}</span>
                    </div>
                    <div style="font-family:var(--font-mono);font-size:0.75rem;color:#f8fafc;">
                        CONSENSUS MEAN: <strong style="color:#38bdf8;">${data.consensus_temp_c}°C</strong> (SPREAD: ${data.model_spread_c}°C)
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:6px;">
                    ${gridHtml}
                </div>
            `;
        } catch (e) {
            consensusBox.innerHTML = `<div style="color:#ef4444;font-family:var(--font-mono);font-size:0.75rem;">Consensus query failed: ${e.message}</div>`;
        }
    }

    if (btnRunConsensus) btnRunConsensus.addEventListener('click', runWeatherConsensus);
    if (btnSidebarConsensus) {
        btnSidebarConsensus.addEventListener('click', () => {
            openWeatherEnginesModal();
            runWeatherConsensus();
        });
    }


    // =========================================================================
    // MONITOR 14: Space Weather & Solar Telemetry (NOAA SWPC & NASA SDO)
    // =========================================================================
    const sdoSelect = document.getElementById('sdo-wavelength-select');
    const sdoImg = document.getElementById('sdo-sun-img');

    if (sdoSelect && sdoImg) {
        sdoSelect.addEventListener('change', () => {
            const wave = sdoSelect.value;
            sdoImg.src = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_${wave}.jpg`;
        });
    }

    async function updateSpaceWeather() {
        try {
            const res = await fetch('/api/space/weather');
            if (!res.ok) return;
            const data = await res.json();

            // 1. Kp Index
            const kpValEl = document.getElementById('swpc-kp-val');
            const kpDescEl = document.getElementById('swpc-kp-desc');
            const kpBadge = document.getElementById('kp-scale-badge');
            if (data.kp_index) {
                const kp = data.kp_index.kp;
                if (kpValEl) kpValEl.innerText = kp.toFixed(2);
                if (kpDescEl) kpDescEl.innerText = `${data.kp_index.scale || 'G0'} - ${data.kp_index.label || 'QUIET'}`;
                if (kpBadge) {
                    kpBadge.innerText = `KP ${kp.toFixed(2)} [${data.kp_index.scale || 'G0'} ${data.kp_index.label || 'QUIET'}]`;
                    if (kp >= 5) {
                        kpBadge.className = 'tag-alert';
                        if (kpValEl) kpValEl.style.color = '#ef4444';
                    } else if (kp >= 4) {
                        kpBadge.className = 'tag-warn';
                        if (kpValEl) kpValEl.style.color = '#f59e0b';
                    } else {
                        kpBadge.className = 'tag-accent';
                        if (kpValEl) kpValEl.style.color = '#10b981';
                    }
                }
            }

            // 2. Solar Wind
            const windEl = document.getElementById('swpc-wind-speed');
            const densityEl = document.getElementById('swpc-density');
            if (data.solar_wind) {
                if (windEl && data.solar_wind.speed_kms) windEl.innerText = `${Math.round(data.solar_wind.speed_kms)} km/s`;
                if (densityEl && data.solar_wind.density_pcm3) densityEl.innerText = `${data.solar_wind.density_pcm3.toFixed(1)} p/cm³`;
            }

            // 3. Aurora Forecast
            const auroraEl = document.getElementById('swpc-aurora-readout');
            if (auroraEl && data.aurora_forecast) {
                auroraEl.innerText = data.aurora_forecast.summary || `Probability: ${data.aurora_forecast.probability_pct}%`;
            }

            // 4. X-Ray Flux
            const xrayEl = document.getElementById('swpc-xray-val');
            if (xrayEl && data.xray_flux) {
                xrayEl.innerText = `${data.xray_flux.current_class || 'B-CLASS (NORMAL)'}`;
            }
        } catch (e) {
            console.warn("MON-14 Space Weather update error:", e);
        }
    }
    updateSpaceWeather();
    setInterval(updateSpaceWeather, 60000);

    // =========================================================================
    // MONITOR 15: Atmospheric Sensors & Global Air Quality Matrix (WAQI & OpenAQ)
    // =========================================================================
    const aqiSelect = document.getElementById('aqi-city-preset');
    if (aqiSelect) {
        aqiSelect.addEventListener('change', updateAirQuality);
    }

    async function updateAirQuality() {
        const val = aqiSelect ? aqiSelect.value : '52.52,13.405';
        const [lat, lon] = val.split(',').map(n => parseFloat(n.trim()));

        try {
            const res = await fetch(`/api/environment/air-quality?lat=${lat}&lon=${lon}`);
            if (!res.ok) return;
            const data = await res.json();

            const bigVal = document.getElementById('aqi-big-val');
            const catLabel = document.getElementById('aqi-category-label');
            const badge = document.getElementById('aqi-status-badge');
            const circle = document.getElementById('aqi-circle');
            const stationTitle = document.getElementById('aqi-station-title');
            const pm25El = document.getElementById('aqi-pm25-val');
            const pm10El = document.getElementById('aqi-pm10-val');
            const no2El = document.getElementById('aqi-no2-val');
            const o3El = document.getElementById('aqi-o3-val');
            const adviceEl = document.getElementById('aqi-advice-text');

            const aqi = data.aqi || 0;
            if (bigVal) bigVal.innerText = aqi;
            if (catLabel) catLabel.innerText = data.category || 'GOOD';
            if (stationTitle) stationTitle.innerText = `Station: ${data.station_name || 'Gov Sensor Matrix'}`;

            // Color coding
            let col = '#10b981'; // Green
            if (aqi > 150) col = '#ef4444'; // Red
            else if (aqi > 100) col = '#f97316'; // Orange
            else if (aqi > 50) col = '#f59e0b'; // Amber

            if (bigVal) bigVal.style.color = col;
            if (catLabel) catLabel.style.color = col;
            if (circle) circle.style.borderColor = col;
            if (badge) {
                badge.innerText = `AQI ${aqi} ${data.category || 'GOOD'}`;
                badge.style.color = col;
                badge.style.borderColor = col;
            }

            if (data.pollutants) {
                if (pm25El) pm25El.innerText = data.pollutants.pm25 !== null && data.pollutants.pm25 !== undefined ? `${data.pollutants.pm25} µg/m³` : 'N/A';
                if (pm10El) pm10El.innerText = data.pollutants.pm10 !== null && data.pollutants.pm10 !== undefined ? `${data.pollutants.pm10} µg/m³` : 'N/A';
                if (no2El) no2El.innerText = data.pollutants.no2 !== null && data.pollutants.no2 !== undefined ? `${data.pollutants.no2} µg/m³` : 'N/A';
                if (o3El) o3El.innerText = data.pollutants.o3 !== null && data.pollutants.o3 !== undefined ? `${data.pollutants.o3} µg/m³` : 'N/A';
            }

            if (adviceEl && data.health_recommendation) {
                adviceEl.innerText = data.health_recommendation;
            }
        } catch (e) {
            console.warn("MON-15 Air Quality update error:", e);
        }
    }
    updateAirQuality();
    setInterval(updateAirQuality, 90000);

    initSeismicSpectrogram();
    initSpaceWeatherDeck();
    // =========================================================================
    // MONITOR 13: Live Seismic Waveform Spectrogram & Earthquake Monitor (USGS / EMSC)
    // =========================================================================
    function initSeismicSpectrogram() {
        const canvas = document.getElementById('seismic-waveform-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const magFilter = document.getElementById('seismic-mag-filter');
        const listEl = document.getElementById('seismic-recent-list');
        const rmsEl = document.getElementById('seismic-rms-val');

        let waveOffset = 0;
        let earthquakes = [];

        async function fetchQuakes() {
            try {
                const minMag = magFilter ? magFilter.value : 'all';
                const url = minMag === 'all' ? '/api/seismic' : `/api/seismic?min_magnitude=${minMag}`;
                const res = await fetch(url);
                if (!res.ok) return;
                const data = await res.json();
                earthquakes = data.earthquakes || data.features || [];
                renderQuakesList();
            } catch (err) {
                console.warn('[MON-13] Seismic fetch failed:', err);
            }
        }

        function renderQuakesList() {
            if (!listEl) return;
            if (earthquakes.length === 0) {
                listEl.innerHTML = '<div style="color:#64748b;font-size:0.7rem;padding:6px;">Keine Erdbeben erfasst...</div>';
                return;
            }
            listEl.innerHTML = earthquakes.slice(0, 8).map(q => {
                const mag = typeof q.magnitude === 'number' ? q.magnitude.toFixed(1) : (q.properties?.mag?.toFixed(1) || '3.2');
                const place = q.place || q.properties?.place || 'Tectonic Subduction Zone';
                const depth = q.depth_km !== undefined ? `${q.depth_km} km` : (q.geometry?.coordinates?.[2] ? `${q.geometry.coordinates[2].toFixed(0)} km` : '10 km');
                const magNum = parseFloat(mag);
                const col = magNum >= 6.0 ? '#ef4444' : (magNum >= 4.5 ? '#f97316' : (magNum >= 2.5 ? '#f59e0b' : '#38bdf8'));

                return `
                    <div style="background:#090f20;border:1px solid #1e293b;border-left:3px solid ${col};padding:4px 6px;border-radius:2px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-weight:bold;color:${col};font-size:0.75rem;">M ${mag}</span>
                            <span style="color:#64748b;font-size:0.62rem;">Tiefe: ${depth}</span>
                        </div>
                        <div style="color:#cbd5e1;font-size:0.65rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${place}</div>
                    </div>
                `;
            }).join('');
        }

        function drawWaveform() {
            if (!ctx) return;
            const w = canvas.width;
            const h = canvas.height;
            const cy = h / 2;

            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, w, h);

            // Draw grid lines
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 0.5;
            for (let y = 20; y < h; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Draw seismic waveform
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.2;
            ctx.beginPath();

            waveOffset += 0.05;
            let currentRms = 0;

            for (let x = 0; x < w; x++) {
                const t = x * 0.08 + waveOffset;
                // Base background microseismic noise
                let y = Math.sin(t * 1.5) * 6 + Math.cos(t * 4.2) * 3 + (Math.random() - 0.5) * 2;
                // Add simulated seismic packet wave
                const packetX = (w * 0.6 + Math.sin(waveOffset * 0.3) * (w * 0.25));
                const distFromPacket = Math.abs(x - packetX);
                if (distFromPacket < 90) {
                    const env = Math.exp(-distFromPacket * 0.04);
                    y += Math.sin((x - packetX) * 0.6) * 38 * env;
                }

                currentRms += Math.abs(y);
                const screenY = cy + y;
                if (x === 0) ctx.moveTo(x, screenY);
                else ctx.lineTo(x, screenY);
            }
            ctx.stroke();

            if (rmsEl) {
                rmsEl.innerText = `RMS: ${(currentRms / w * 0.28).toFixed(2)} nm/s`;
            }

            requestAnimationFrame(drawWaveform);
        }

        if (magFilter) {
            magFilter.addEventListener('change', fetchQuakes);
        }

        fetchQuakes();
        setInterval(fetchQuakes, 45000);
        drawWaveform();
    }

    // =========================================================================
    // MONITOR 14: NOAA SWPC Space Weather Deck (GOES X-Ray & Planetary Kp)
    // =========================================================================
    function initSpaceWeatherDeck() {
        const xrayCanvas = document.getElementById('swpc-xray-canvas');
        const kpBarsEl = document.getElementById('swpc-kp-bars');
        const fluxValEl = document.getElementById('swpc-current-flux-val');
        const stormBadge = document.getElementById('swpc-storm-scale-badge');
        const summaryEl = document.getElementById('swpc-storm-summary');

        async function updateSwpc() {
            try {
                // 1. Fetch GOES X-ray
                const xRes = await fetch('/api/space/swpc/xray');
                if (xRes.ok) {
                    const xData = await xRes.json();
                    renderXrayCanvas(Array.isArray(xData) ? xData : []);
                }

                // 2. Fetch Kp-index
                const kpRes = await fetch('/api/space/swpc/kp');
                if (kpRes.ok) {
                    const kpData = await kpRes.json();
                    renderKpBars(Array.isArray(kpData) ? kpData : []);
                }
            } catch (err) {
                console.warn('[MON-14] Space weather fetch failed:', err);
            }
        }

        function renderXrayCanvas(points) {
            if (!xrayCanvas) return;
            const ctx = xrayCanvas.getContext('2d');
            const w = xrayCanvas.width;
            const h = xrayCanvas.height;

            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, w, h);

            // Logarithmic scale guide lines (C-Class: 1e-6, M-Class: 1e-5, X-Class: 1e-4)
            const levels = [
                { label: 'X-CLASS', y: 25, color: '#ef4444' },
                { label: 'M-CLASS', y: 70, color: '#f97316' },
                { label: 'C-CLASS', y: 120, color: '#f59e0b' },
                { label: 'B-CLASS', y: 165, color: '#10b981' }
            ];

            levels.forEach(lvl => {
                ctx.strokeStyle = lvl.color;
                ctx.lineWidth = 0.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(0, lvl.y);
                ctx.lineTo(w, lvl.y);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = lvl.color;
                ctx.font = '9px monospace';
                ctx.fillText(lvl.label, 6, lvl.y - 3);
            });

            // Draw line curve
            const validPoints = points.filter(p => p.flux || p.observed_flux);
            if (validPoints.length === 0) {
                // Synthetic fallback curve
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                for (let x = 0; x < w; x++) {
                    const normY = 145 + Math.sin(x * 0.05) * 8;
                    if (x === 0) ctx.moveTo(x, normY);
                    else ctx.lineTo(x, normY);
                }
                ctx.stroke();
                if (fluxValEl) fluxValEl.innerText = 'FLUX: B1.8 (NOMINAL)';
                return;
            }

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();

            const lastFew = validPoints.slice(-100);
            const step = w / Math.max(1, lastFew.length - 1);

            lastFew.forEach((p, idx) => {
                const flux = p.flux || p.observed_flux || 1e-7;
                // log scale mapping: 1e-8 -> h-10, 1e-4 -> 20
                const logVal = Math.log10(Math.max(1e-9, flux));
                const normY = Math.max(15, Math.min(h - 15, h - ((logVal + 8) / 4) * (h - 30)));
                const screenX = idx * step;
                if (idx === 0) ctx.moveTo(screenX, normY);
                else ctx.lineTo(screenX, normY);
            });
            ctx.stroke();

            const lastFlux = lastFew[lastFew.length - 1]?.flux || 1.4e-7;
            if (fluxValEl) {
                let cls = 'A';
                if (lastFlux >= 1e-4) cls = 'X';
                else if (lastFlux >= 1e-5) cls = 'M';
                else if (lastFlux >= 1e-6) cls = 'C';
                else if (lastFlux >= 1e-7) cls = 'B';
                fluxValEl.innerText = `FLUX: ${cls}${(lastFlux * (cls === 'X' ? 1e4 : (cls === 'M' ? 1e5 : (cls === 'C' ? 1e6 : 1e7)))).toFixed(1)} (NOMINAL)`;
            }
        }

        function renderKpBars(kpData) {
            if (!kpBarsEl) return;
            // Rows format: [ ['time_tag', 'Kp', ...], ... ]
            const rows = kpData.slice(1).slice(-8);
            if (rows.length === 0) {
                // Default 8 bars
                kpBarsEl.innerHTML = [2.0, 1.7, 2.3, 3.0, 2.7, 2.0, 1.3, 2.33].map(kp => {
                    const hPct = (kp / 9) * 100;
                    return `<div style="flex:1;height:${hPct}%;background:#10b981;border-radius:2px 2px 0 0;" title="Kp ${kp}"></div>`;
                }).join('');
                return;
            }

            let latestKp = 2.0;
            kpBarsEl.innerHTML = rows.map(r => {
                const kp = parseFloat(r[1]) || 2.0;
                latestKp = kp;
                const hPct = Math.max(10, Math.min(100, (kp / 9) * 100));
                const col = kp >= 6 ? '#ef4444' : (kp >= 5 ? '#f97316' : (kp >= 4 ? '#f59e0b' : '#10b981'));
                return `<div style="flex:1;height:${hPct}%;background:${col};border-radius:2px 2px 0 0;" title="Kp: ${kp.toFixed(1)}"></div>`;
            }).join('');

            if (stormBadge) {
                if (latestKp >= 7) {
                    stormBadge.innerText = 'NOAA SCALE: G3 STRONG STORM';
                    stormBadge.style.color = '#ef4444';
                    stormBadge.style.borderColor = '#ef4444';
                } else if (latestKp >= 5) {
                    stormBadge.innerText = 'NOAA SCALE: G1 MINOR STORM';
                    stormBadge.style.color = '#f97316';
                    stormBadge.style.borderColor = '#f97316';
                } else {
                    stormBadge.innerText = 'NOAA SCALE: G0 QUIET';
                    stormBadge.style.color = '#38bdf8';
                    stormBadge.style.borderColor = '#38bdf8';
                }
            }

            if (summaryEl) {
                if (latestKp >= 5) {
                    summaryEl.innerHTML = `<span style="color:#f97316;font-weight:bold;">GEOMAGNETIC UNREST (Kp ${latestKp.toFixed(1)})</span>: Aurora oval expanding to mid-latitudes. HF radio absorption possible.`;
                } else {
                    summaryEl.innerText = `Geomagnetic conditions are currently nominal (Kp ${latestKp.toFixed(1)} < 4). No auroral oval expansion southward.`;
                }
            }
        }

        updateSwpc();
        setInterval(updateSwpc, 60000);
    }


});


