/* ==========================================================================
   CYBER-SPECTRE NEXUS v2.5 - Real-Data Upgrade Layer
   FIRMS (FRP-scaled), AirNow, NDBC buoys, USGS volcanoes/rivers, GDACS, SGP4 satellites,
   ORS isochrones, measure tool, flight-to-storm correlator, threat matrix, provider health,
   audit blackbox, EAS siren + voice announcer, keyboard control.
   All data comes from /api/v2/* (authentic providers, zero simulation).
   ========================================================================== */
(function () {
    'use strict';
    const API = '/api/v2';
    const SESSION = 'S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    // ---------- generic canvas n-gon / star / trapezoid marker -----------------
    L.NgonMarker = L.CircleMarker.extend({
        _updatePath: function () { this._renderer._updateNgon(this); }
    });
    L.ngonMarker = (ll, o) => new L.NgonMarker(ll, o);
    if (L.Canvas) {
        L.Canvas.include({
            _updateNgon: function (layer) {
                if (!this._drawing || layer._empty()) return;
                const p = layer._point, ctx = this._ctx, o = layer.options;
                const r = Math.max(layer._radius, 2);
                if (this._drawnLayers) this._drawnLayers[layer._leaflet_id] = layer;
                ctx.beginPath();
                if (o.shape === 'trapezoid') {
                    ctx.moveTo(p.x - r * 0.45, p.y - r);
                    ctx.lineTo(p.x + r * 0.45, p.y - r);
                    ctx.lineTo(p.x + r * 1.15, p.y + r);
                    ctx.lineTo(p.x - r * 1.15, p.y + r);
                } else if (o.shape === 'cross') {
                    const w = r * 0.38;
                    ctx.moveTo(p.x - w, p.y - r); ctx.lineTo(p.x + w, p.y - r); ctx.lineTo(p.x + w, p.y - w);
                    ctx.lineTo(p.x + r, p.y - w); ctx.lineTo(p.x + r, p.y + w); ctx.lineTo(p.x + w, p.y + w);
                    ctx.lineTo(p.x + w, p.y + r); ctx.lineTo(p.x - w, p.y + r); ctx.lineTo(p.x - w, p.y + w);
                    ctx.lineTo(p.x - r, p.y + w); ctx.lineTo(p.x - r, p.y - w); ctx.lineTo(p.x - w, p.y - w);
                } else if (o.shape === 'star') {
                    for (let i = 0; i < 10; i++) {
                        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r * 1.15;
                        const x = p.x + rr * Math.cos(a), y = p.y + rr * Math.sin(a);
                        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                    }
                } else {
                    const n = o.sides || 6, rot = o.rotation || 0;
                    for (let i = 0; i < n; i++) {
                        const a = rot + -Math.PI / 2 + i * 2 * Math.PI / n;
                        const x = p.x + r * Math.cos(a), y = p.y + r * Math.sin(a);
                        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                    }
                }
                ctx.closePath();
                this._fillStroke(ctx, layer);
            }
        });
    }

    // ---------- helpers --------------------------------------------------------
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const fmt = (v, d = 1) => (v == null || isNaN(v)) ? '–' : Number(v).toFixed(d);
    async function jget(url, signal) {
        const r = await fetch(url, { signal });
        if (!r.ok) throw new Error(url + ' -> HTTP ' + r.status);
        return r.json();
    }
    function audit(action, target, lat, lon, detail) {
        try {
            fetch(API + '/audit', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
                body: JSON.stringify({ session: SESSION, action, target: target || '', lat, lon, detail: detail || '' })
            }).catch(() => { });
        } catch (e) { }
    }
    const haversineKm = (a, b, c, d) => {
        const R = 6371, t = x => x * Math.PI / 180, dl = t(c - a), dn = t(d - b);
        const h = Math.sin(dl / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(dn / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
    };
    const bearing = (a, b, c, d) => {
        const t = x => x * Math.PI / 180, y = Math.sin(t(d - b)) * Math.cos(t(c));
        const x = Math.cos(t(a)) * Math.sin(t(c)) - Math.sin(t(a)) * Math.cos(t(c)) * Math.cos(t(d - b));
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    };

    function init(M) {
        const map = M.map;
        const R = M.canvasRenderer;
        const hud = () => document.getElementById('cam-zoom-hud');
        const state = { iso: false, measure: false, measurePts: [], voice: false, eas: false, ac: null, layers: {}, abort: {} };

        const mkLayer = (id, label, color, on, fetcher, opts = {}) => {
            const lg = L.layerGroup();
            state.layers[id] = { lg, label, color, fetcher, on, minZoom: opts.minZoom || 0, ttl: opts.ttl || 0, count: 0, timer: null, status: '' };
            return lg;
        };

        // ---------------- FIRMS (replaces legacy 40-marker renderer) -----------------
        const firmsLg = M.firmsLayer;
        state.layers.firms = { lg: firmsLg, label: 'FIRMS', minZoom: 2, count: 0, on: true, status: '' };
        async function loadFirms() {
            const b = map.getBounds();
            const bb = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].map(x => Math.max(-180, Math.min(180, x)).toFixed(3)).join(',');
            const z = map.getZoom();
            const limit = z < 4 ? 2500 : z < 7 ? 6000 : 12000;
            const j = await jget(`${API}/firms?bbox=${bb}&days=1&limit=${limit}`);
            firmsLg.clearLayers();
            j.hotspots.forEach(h => {
                const rad = 2.6 + Math.min(Math.sqrt(Math.max(h.frp, 0)) * 0.75, 8);
                const col = h.frp >= 80 ? '#fff7ed' : h.frp >= 25 ? '#ef4444' : h.frp >= 8 ? '#f97316' : '#fb923c';
                const m = L.circleMarker([h.lat, h.lon], {
                    renderer: R, radius: rad, color: h.frp >= 80 ? '#dc2626' : '#7c2d12', weight: 1,
                    fillColor: col, fillOpacity: 0.85
                });
                m._cyberNodeType = 'fire';
                m.bindPopup(`<div style="font-family:var(--font-mono);font-size:11px;min-width:210px;color:#0f172a;">
                    <div style="font-weight:bold;color:#dc2626;">🔥 [NASA FIRMS ${esc(h.instrument || '')}]</div>
                    <strong>FRP:</strong> ${fmt(h.frp)} MW &nbsp; <strong>${fmt(h.brightness, 0)} K</strong><br>
                    <strong>Satellit:</strong> ${esc(h.satellite)} (${esc(h.source)})<br>
                    <strong>Erfasst:</strong> ${esc(h.acq_date)} ${esc(String(h.acq_time || '').padStart(4, '0').replace(/(..)(..)/, '$1:$2'))} UTC<br>
                    <strong>Konfidenz:</strong> ${esc(h.confidence)} // ${h.daynight === 'D' ? 'Tag' : 'Nacht'}<br>
                    <strong>Pos:</strong> ${fmt(h.lat, 4)}°, ${fmt(h.lon, 4)}°</div>`, { offset: [0, -3] });
                m.on('click', ev => { M.notifyLayerClicked(ev); audit('click_fire', h.source, h.lat, h.lon, { frp: h.frp }); });
                firmsLg.addLayer(m);
            });
            state.layers.firms.count = j.count;
            state.layers.firms.status = `${j.matched.toLocaleString()} Detektionen / ${fmt(j.total_frp_mw, 0)} MW`;
        }
        state.layers.firms.fetcher = loadFirms;
        // legacy renderer only feeds the side table + badge now
        M.renderFires = function (hotspots) {
            const tbody = document.getElementById('firms-table-body');
            const badge = document.getElementById('firms-count-badge');
            if (badge) badge.innerText = `${hotspots.length}+ LIVE SATELLITEN-BRÄNDE (FIRMS, nach FRP sortiert)`;
            if (tbody) {
                tbody.innerHTML = '';
                hotspots.slice(0, 40).forEach(f => {
                    const tr = document.createElement('tr');
                    tr.style.cursor = 'pointer';
                    tr.innerHTML = `<td>${esc(f.acq_date)}</td><td>${fmt(f.lat, 2)}</td><td>${fmt(f.lon, 2)}</td><td class="tag-alert">${fmt(f.frp, 0)} MW</td><td>${esc(f.satellite)}</td><td>${esc(f.confidence)}</td>`;
                    tr.onclick = () => { map.setView([f.lat, f.lon], 9); M.placeReticle(f.lat, f.lon); };
                    tbody.appendChild(tr);
                });
            }
        };

        // ---------------- AirNow ------------------------------------------------------
        const airLg = mkLayer('airnow', 'AirNow', '#c084fc', true, async () => {
            const b = map.getBounds();
            if (b.getEast() - b.getWest() > 24) { airLg.clearLayers(); state.layers.airnow.status = 'zoom in (bbox < 24°)'; return; }
            const bb = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].map(x => x.toFixed(2)).join(',');
            const j = await jget(`${API}/airnow?bbox=${bb}`);
            airLg.clearLayers();
            j.stations.forEach(s => {
                const m = L.ngonMarker([s.lat, s.lon], { renderer: R, shape: 'cross', radius: 6.5, color: '#1e1b4b', weight: 1, fillColor: s.color, fillOpacity: 0.95 });
                const rd = Object.entries(s.readings).map(([k, v]) => `<strong>${esc(k)}</strong>: AQI ${v.aqi} (${fmt(v.value)} ${esc(v.unit)})`).join('<br>');
                m.bindPopup(`<div style="font-family:var(--font-mono);font-size:11px;min-width:210px;color:#0f172a;">
                    <div style="font-weight:bold;color:#7e22ce;">✚ [EPA AIRNOW]</div><strong>${esc(s.name)}</strong><br>
                    <span style="color:#64748b">${esc(s.agency)}</span><br>${rd}<br>
                    <span style="background:${s.color};padding:1px 6px;border-radius:3px;font-weight:bold;">${esc(s.label)}</span> ${esc(s.utc)} UTC</div>`);
                m.on('click', ev => { M.notifyLayerClicked(ev); audit('click_airnow', s.id, s.lat, s.lon); });
                airLg.addLayer(m);
            });
            state.layers.airnow.status = `${j.count} Stationen`;
        }, { minZoom: 4 });

        // ---------------- NDBC buoys --------------------------------------------------
        const buoyLg = mkLayer('buoys', 'Bojen', '#0284c7', true, async () => {
            const b = map.getBounds();
            const bb = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].map(x => x.toFixed(2)).join(',');
            const j = await jget(`${API}/buoys?bbox=${bb}`);
            buoyLg.clearLayers();
            j.buoys.forEach(s => {
                const m = L.ngonMarker([s.lat, s.lon], { renderer: R, sides: 8, radius: 5.5, color: '#082f49', weight: 1.2, fillColor: s.storm ? '#ef4444' : '#38bdf8', fillOpacity: 0.95 });
                m.bindPopup(`<div style="font-family:var(--font-mono);font-size:11px;min-width:200px;color:#0f172a;">
                    <div style="font-weight:bold;color:#0369a1;">⯃ [NOAA NDBC ${esc(s.id)}]</div>
                    <strong>Wellenhöhe:</strong> ${fmt(s.wave_m)} m (${fmt(s.wave_period_s, 0)} s)<br>
                    <strong>Wind:</strong> ${fmt(s.wind_ms)} m/s, Böen ${fmt(s.gust_ms)} m/s @ ${fmt(s.wind_dir, 0)}°<br>
                    <strong>Luftdruck:</strong> ${fmt(s.pressure_hpa)} hPa<br>
                    <strong>Wasser/Luft:</strong> ${fmt(s.water_c)} / ${fmt(s.air_c)} °C<br>
                    <span style="color:#64748b">${esc(s.time)}</span>${s.storm ? '<br><b style="color:#dc2626">⚠ STURMBEDINGUNGEN</b>' : ''}</div>`);
                m.on('click', ev => { M.notifyLayerClicked(ev); audit('click_buoy', s.id, s.lat, s.lon); });
                buoyLg.addLayer(m);
            });
            state.layers.buoys.status = `${j.count} Bojen`;
        }, { minZoom: 3 });

        // ---------------- USGS volcanoes ---------------------------------------------
        const volcLg = mkLayer('volc', 'Vulkane', '#b91c1c', true, async () => {
            const j = await jget(`${API}/volcanoes`);
            volcLg.clearLayers();
            j.volcanoes.forEach(v => {
                if (v.lat == null || v.lon == null) return;
                const hot = v.level >= 3;
                const m = L.ngonMarker([v.lat, v.lon], { renderer: R, shape: 'trapezoid', radius: hot ? 8 : 5.5, color: '#1c1917', weight: 1.2, fillColor: v.color, fillOpacity: 0.95 });
                m.bindPopup(`<div style="font-family:var(--font-mono);font-size:11px;min-width:200px;color:#0f172a;">
                    <div style="font-weight:bold;color:${v.color};">⏢ [USGS VOLCANO]</div><strong>${esc(v.name)}</strong><br>
                    ${esc(v.region || '')} // ${fmt(v.elevation_m, 0)} m<br>
                    <strong>Alarmstufe:</strong> <span style="background:${v.color};padding:1px 6px;border-radius:3px;font-weight:bold;">${esc(v.alert)}</span><br>
                    <strong>Observatorium:</strong> ${esc(v.observatory)}<br>${v.url ? `<a href="${esc(v.url)}" target="_blank" rel="noopener">Observatorium ↗</a>` : ''}</div>`);
                m.on('click', ev => { M.notifyLayerClicked(ev); audit('click_volcano', v.name, v.lat, v.lon); });
                volcLg.addLayer(m);
            });
            state.layers.volc.status = `${j.count} Vulkane / ${j.elevated} erhöht`;
        }, { ttl: 1800000 });

        // ---------------- GDACS --------------------------------------------------------
        const TYPE_ICON = { EQ: '🌍 Erdbeben', TC: '🌀 Zyklon', FL: '🌊 Flut', VO: '🌋 Vulkan', DR: '☀ Dürre', WF: '🔥 Waldbrand' };
        const gdacsLg = mkLayer('gdacs', 'GDACS', '#f59e0b', true, async () => {
            const j = await jget(`${API}/gdacs?days=14`);
            gdacsLg.clearLayers();
            j.events.forEach(e => {
                const col = e.alert === 'Red' ? '#ef4444' : e.alert === 'Orange' ? '#f97316' : '#84cc16';
                const m = L.ngonMarker([e.lat, e.lon], { renderer: R, shape: 'star', radius: e.alert === 'Red' ? 9 : e.alert === 'Orange' ? 7.5 : 5, color: '#111827', weight: 1, fillColor: col, fillOpacity: 0.95 });
                m.bindPopup(`<div style="font-family:var(--font-mono);font-size:11px;min-width:220px;color:#0f172a;">
                    <div style="font-weight:bold;color:${col};">★ [GDACS ${esc(e.alert).toUpperCase()}] ${TYPE_ICON[e.type] || esc(e.type)}</div>
                    <strong>${esc(e.name)}</strong><br>${esc(e.country || '')}<br>${esc(e.severity || '')}<br>
                    <span style="color:#64748b">${esc((e.from || '').slice(0, 10))} → ${esc((e.to || '').slice(0, 10))}</span>
                    ${e.url ? `<br><a href="${esc(e.url)}" target="_blank" rel="noopener">GDACS-Report ↗</a>` : ''}</div>`);
                m.on('click', ev => { M.notifyLayerClicked(ev); audit('click_gdacs', e.id, e.lat, e.lon); });
                gdacsLg.addLayer(m);
            });
            state.layers.gdacs.status = `${j.count} Ereignisse / ${j.red} rot / ${j.orange} orange`;
            const reds = j.events.filter(e => e.alert === 'Red').map(e => e.id);
            const seen = state.seenGdacs || (state.seenGdacs = new Set(reds));
            reds.filter(id => !seen.has(id)).forEach(id => { seen.add(id); const e = j.events.find(x => x.id === id); announce(`GDACS Rotalarm: ${e.name}`); });
        }, { ttl: 900000 });

        // ---------------- USGS river gauges -------------------------------------------
        const riverLg = mkLayer('rivers', 'Pegel', '#06b6d4', true, async () => {
            const b = map.getBounds();
            if ((b.getEast() - b.getWest()) * (b.getNorth() - b.getSouth()) > 25) { riverLg.clearLayers(); state.layers.rivers.status = 'zoom in (< 25 deg²)'; return; }
            const bb = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].map(x => x.toFixed(3)).join(',');
            const j = await jget(`${API}/rivers?bbox=${bb}`);
            riverLg.clearLayers();
            j.gauges.forEach(g => {
                const m = L.ngonMarker([g.lat, g.lon], { renderer: R, sides: 3, rotation: Math.PI, radius: 5.5, color: '#083344', weight: 1.2, fillColor: '#22d3ee', fillOpacity: 0.95 });
                m.bindPopup(`<div style="font-family:var(--font-mono);font-size:11px;min-width:200px;color:#0f172a;">
                    <div style="font-weight:bold;color:#0e7490;">💧 [USGS GAUGE ${esc(g.id)}]</div><strong>${esc(g.name)}</strong><br>
                    <strong>Pegel:</strong> ${fmt(g.stage_ft, 2)} ft<br><strong>Abfluss:</strong> ${fmt(g.discharge_cfs, 0)} cfs<br>
                    <span style="color:#64748b">${esc(g.time || '')}</span></div>`);
                m.on('click', ev => { M.notifyLayerClicked(ev); audit('click_river', g.id, g.lat, g.lon); });
                riverLg.addLayer(m);
            });
            state.layers.rivers.status = `${j.count} Pegel`;
        }, { minZoom: 7 });

        // ---------------- Satellites (SGP4) -------------------------------------------
        const satLg = mkLayer('sats', 'Satelliten', '#94a3b8', false, async () => {
            const [a, w] = await Promise.all([jget(`${API}/satellites?group=stations`), jget(`${API}/satellites?group=weather&limit=60`)]);
            satLg.clearLayers();
            [...a.satellites, ...w.satellites].forEach(s => {
                const m = L.ngonMarker([s.lat, s.lon], { renderer: R, sides: 6, radius: 6, color: '#0f172a', weight: 1.2, fillColor: s.name.includes('ISS') ? '#fbbf24' : '#cbd5e1', fillOpacity: 0.95 });
                m.bindPopup(`<div style="font-family:var(--font-mono);font-size:11px;min-width:200px;color:#0f172a;">
                    <div style="font-weight:bold;color:#475569;">⬡ [SGP4 / CELESTRAK]</div><strong>${esc(s.name)}</strong> (NORAD ${s.norad})<br>
                    Höhe ${fmt(s.alt_km, 0)} km // ${fmt(s.speed_kms, 2)} km/s<br>Inklination ${fmt(s.inclination, 1)}° // Umlauf ${fmt(s.period_min, 1)} min<br>
                    <button class="ops-btn" style="margin-top:4px;width:100%;" onclick="window.NexusUpgrade.showTrack(${s.norad})">Bodenspur (100 min)</button></div>`);
                m.on('click', ev => { M.notifyLayerClicked(ev); audit('click_satellite', s.name, s.lat, s.lon); });
                satLg.addLayer(m);
            });
            state.layers.sats.status = `${a.count + w.count} Objekte`;
        }, { ttl: 15000 });
        const trackLg = L.layerGroup();
        async function showTrack(norad) {
            try {
                const gj = await Promise.all(['stations', 'weather'].map(g => jget(`${API}/satellites?group=${g}&track_minutes=100&norad=${norad}`)));
                const s = gj.flatMap(x => x.satellites).find(x => x.norad === norad);
                trackLg.clearLayers();
                if (s && s.track) {
                    // split at the antimeridian
                    let seg = []; const segs = [seg];
                    s.track.forEach((p, i) => { if (i && Math.abs(p[1] - s.track[i - 1][1]) > 180) { seg = []; segs.push(seg); } seg.push(p); });
                    segs.forEach(sg => L.polyline(sg, { color: '#fbbf24', weight: 2, dashArray: '6,6', opacity: 0.9, interactive: false }).addTo(trackLg));
                    trackLg.addTo(map);
                }
            } catch (e) { console.warn(e); }
        }

        // ---------------- layer lifecycle ---------------------------------------------
        function layerEnabled(id) { const cb = document.getElementById('nx-' + id); return cb ? cb.checked : state.layers[id].on; }
        async function refresh(id, force) {
            const L_ = state.layers[id];
            if (!L_ || !L_.fetcher) return;
            const on = id === 'firms' ? (document.getElementById('layer-firms') || { checked: true }).checked : layerEnabled(id);
            if (!on) { if (id !== 'firms' && map.hasLayer(L_.lg)) map.removeLayer(L_.lg); return; }
            if (!map.hasLayer(L_.lg)) L_.lg.addTo(map);
            if (map.getZoom() < L_.minZoom) { L_.lg.clearLayers(); L_.status = `zoom ≥ ${L_.minZoom}`; renderPanel(); return; }
            if (state.abort[id]) state.abort[id] = false;
            try { await L_.fetcher(); } catch (e) { L_.status = 'Fehler: ' + String(e.message).slice(0, 40); console.warn('[nexus]', id, e); }
            renderPanel();
        }
        let vpTimer = null;
        const onView = () => { clearTimeout(vpTimer); vpTimer = setTimeout(() => ['firms', 'airnow', 'buoys', 'rivers'].forEach(i => refresh(i)), 450); };
        map.on('moveend', onView);
        ['volc', 'gdacs', 'sats'].forEach(id => {
            refresh(id);
            const ttl = state.layers[id].ttl;
            state.layers[id].timer = setInterval(() => refresh(id), ttl);
        });
        setTimeout(() => ['firms', 'airnow', 'buoys', 'rivers'].forEach(i => refresh(i)), 1500);
        const firmsCb = document.getElementById('layer-firms');
        if (firmsCb) firmsCb.addEventListener('change', () => { if (firmsCb.checked) refresh('firms'); });
        const sideFirms = document.getElementById('side-layer-firms');
        if (sideFirms) sideFirms.addEventListener('change', () => { if (sideFirms.checked) refresh('firms'); });

        // ---------------- Isochrones (ORS) ---------------------------------------------
        const isoLg = L.layerGroup().addTo(map);
        const ISO_COL = { 15: '#22c55e', 30: '#eab308', 60: '#ef4444' };
        async function drawIso(lat, lon) {
            const profile = (document.getElementById('nx-iso-profile') || {}).value || 'driving-car';
            setNote(`⏱ Isochronen werden berechnet (${profile})…`);
            try {
                const j = await jget(`${API}/isochrone?lat=${lat}&lon=${lon}&minutes=15,30,60&profile=${profile}`);
                isoLg.clearLayers();
                [...j.features].sort((a, b) => b.properties.minutes - a.properties.minutes).forEach(f => {
                    const mn = f.properties.minutes, col = ISO_COL[mn] || '#38bdf8';
                    L.geoJSON(f, { pane: 'weatherZonesPane', style: { color: col, weight: 2, fillColor: col, fillOpacity: 0.14, dashArray: '5,4' }, interactive: false }).addTo(isoLg);
                });
                L.circleMarker([lat, lon], { radius: 6, color: '#fff', fillColor: '#38bdf8', fillOpacity: 1 }).bindTooltip('Isochronen-Ursprung').addTo(isoLg);
                setNote(`⏱ 15/30/60-Min-Reichweite (${profile}) – ${j.provider}`);
                audit('isochrone', profile, lat, lon);
            } catch (e) { setNote('Isochrone fehlgeschlagen: ' + e.message); }
        }

        // ---------------- Measure tool --------------------------------------------------
        const measLg = L.layerGroup().addTo(map);
        function measureAdd(ll) {
            state.measurePts.push(ll);
            L.circleMarker(ll, { radius: 4, color: '#fff', fillColor: '#f43f5e', fillOpacity: 1, interactive: false }).addTo(measLg);
            if (state.measurePts.length > 1) {
                const a = state.measurePts[state.measurePts.length - 2];
                L.polyline([a, ll], { color: '#f43f5e', weight: 2, dashArray: '4,4', interactive: false }).addTo(measLg);
                let tot = 0; for (let i = 1; i < state.measurePts.length; i++) tot += haversineKm(state.measurePts[i - 1].lat, state.measurePts[i - 1].lng, state.measurePts[i].lat, state.measurePts[i].lng);
                const brg = bearing(a.lat, a.lng, ll.lat, ll.lng);
                setNote(`📏 ${fmt(tot, 1)} km // ${fmt(tot / 1.852, 1)} NM // letztes Segment ${fmt(brg, 0)}° // ≈${fmt(tot / 850 * 60, 0)} min Flug @850 km/h`);
            }
        }
        function setMode(mode) {
            state.iso = mode === 'iso'; state.measure = mode === 'measure';
            if (!state.measure) { /* keep drawing until cleared */ }
            if (mode === 'measure') { measLg.clearLayers(); state.measurePts = []; }
            document.getElementById('nx-btn-iso')?.classList.toggle('nx-on', state.iso);
            document.getElementById('nx-btn-measure')?.classList.toggle('nx-on', state.measure);
            map.getContainer().style.cursor = mode ? 'crosshair' : '';
            setNote(mode === 'iso' ? '⏱ ISOCHRONE: Karte anklicken (ORS) – Esc zum Beenden' : mode === 'measure' ? '📏 MESSEN: Punkte anklicken – Esc zum Beenden' : '');
        }
        // intercept the sector-scan click while a tool is active
        const origClick = M.onMapLocationClicked.bind(M);
        M.onMapLocationClicked = async function (lat, lng) {
            audit('map_click', 'sector_scan', lat, lng);
            if (state.iso) return drawIso(lat, lng);
            if (state.measure) return measureAdd(L.latLng(lat, lng));
            return origClick(lat, lng);
        };
        if (M.selectAndPlayCam) {
            const o = M.selectAndPlayCam.bind(M);
            M.selectAndPlayCam = function (id) { audit('select_camera', String(id)); return o(id); };
        }

        // ---------------- Voice + EAS siren --------------------------------------------
        function announce(text) {
            if (!state.voice || !('speechSynthesis' in window)) return;
            const u = new SpeechSynthesisUtterance(text);
            u.lang = /[äöüß]/i.test(text) ? 'de-DE' : 'en-US'; u.pitch = 0.6; u.rate = 0.95;
            window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
        }
        function siren(ms = 1800) {
            if (!state.eas) return;
            try {
                const ac = state.ac || (state.ac = new (window.AudioContext || window.webkitAudioContext)());
                const g = ac.createGain(); g.gain.value = 0.06; g.connect(ac.destination);
                [853, 960].forEach(f => { const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.connect(g); o.start(); o.stop(ac.currentTime + ms / 1000); });
            } catch (e) { }
        }

        // ---------------- Flight-to-storm correlator -------------------------------------
        function pip(pt, ring) {
            let c = false;
            for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
                if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) c = !c;
            }
            return c;
        }
        function inGeom(lat, lon, g) {
            if (!g) return false;
            const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
            return polys.some(p => pip([lon, lat], p[0]) && !p.slice(1).some(h => pip([lon, lat], h)));
        }
        function correlateFlights() {
            const alerts = (M.rawAlerts || []).filter(a => a.geometry && ['Extreme', 'Severe'].includes(a.severity));
            const out = [];
            (M.rawFlights || []).forEach(f => {
                const lat = f.latitude ?? f.lat, lon = f.longitude ?? f.lon;
                if (lat == null || lon == null) return;
                const hit = alerts.find(a => inGeom(lat, lon, a.geometry));
                if (hit) out.push({ callsign: f.callsign || f.icao24, event: hit.event, lat, lon });
            });
            state.flightStorm = out;
            const el = document.getElementById('nx-flightstorm');
            if (el) el.innerHTML = out.length ? out.slice(0, 5).map(o => `✈ ${esc(o.callsign)} in ${esc(o.event)}`).join('<br>') : 'keine Flüge in Unwetterzonen';
            if (out.length) audit('flight_in_storm', out[0].callsign, out[0].lat, out[0].lon, { n: out.length });
        }
        setInterval(correlateFlights, 20000);

        // ---------------- DWD warnings + NWS tornado alarms --------------------------------
        async function pollAlarms() {
            try {
                const d = await jget(`${API}/dwd-warnings?min_level=3`);
                state.dwd = d;
                const el = document.getElementById('nx-dwd');
                if (el) el.innerHTML = d.count ? d.warnings.slice(0, 4).map(w => `<span style="color:${w.level >= 4 ? '#ef4444' : '#f97316'}">${esc(w.event)}</span> ${esc(w.region)}`).join('<br>') + (d.count > 4 ? `<br>+${d.count - 4} weitere` : '') : 'keine schweren Warnungen';
                const seen = state.seenDwd || (state.seenDwd = new Set(d.warnings.map(w => w.cell + w.event + w.start)));
                d.warnings.filter(w => w.level >= 4 && !seen.has(w.cell + w.event + w.start)).forEach(w => {
                    seen.add(w.cell + w.event + w.start); siren(); announce(`Achtung: Extreme Warnung ${w.event} in ${w.region}`);
                });
            } catch (e) { /* surfaced via health */ }
        }
        pollAlarms(); setInterval(pollAlarms, 300000);

        // ---------------- Ops panel (threat, health, grid, Kp) ------------------------------
        const host = map.getContainer();
        const note = document.createElement('div'); note.id = 'nx-note'; host.appendChild(note);
        function setNote(t) { note.textContent = t; note.style.display = t ? 'block' : 'none'; }

        // Bind interactive tools on the middle panel
        const btnIso = document.getElementById('nx-btn-iso');
        if (btnIso) btnIso.onclick = () => setMode(state.iso ? null : 'iso');
        const btnMeasure = document.getElementById('nx-btn-measure');
        if (btnMeasure) btnMeasure.onclick = () => setMode(state.measure ? null : 'measure');
        const chkVoice = document.getElementById('nx-voice');
        if (chkVoice) chkVoice.onchange = e => { state.voice = e.target.checked; if (state.voice) announce('Sprachalarm aktiviert'); };
        const chkEas = document.getElementById('nx-eas');
        if (chkEas) chkEas.onchange = e => { state.eas = e.target.checked; if (state.eas) siren(500); };

        const LAYER_UI = [['airnow', '✚ Luftqualität (AirNow)', '#c084fc'], ['buoys', '⯃ Bojen (NDBC)', '#38bdf8'], ['volc', '⏢ Vulkane (USGS)', '#ef4444'],
        ['gdacs', '★ Katastrophen (GDACS)', '#f59e0b'], ['rivers', '▼ Pegel (USGS)', '#22d3ee'], ['sats', '⬡ Satelliten (SGP4)', '#cbd5e1']];
        function renderPanel() {
            const box = document.getElementById('nx-layers'); if (!box) return;
            if (!box.dataset.init) {
                box.innerHTML = LAYER_UI.map(([id, lbl, col]) => `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" id="nx-${id}" ${state.layers[id].on ? 'checked' : ''}><span style="color:${col};font-weight:600;">${lbl}</span><span id="nx-st-${id}" style="margin-left:auto;color:#64748b;font-size:10px"></span></label>`).join('')
                    + `<div class="nx-row" style="color:#f97316;display:flex;justify-content:space-between;margin-top:2px;"><span>🔥 FIRMS Waldbrände (NASA)</span><span id="nx-st-firms" style="color:#64748b;font-size:10px"></span></div>`;
                box.dataset.init = 1;
                LAYER_UI.forEach(([id]) => {
                    const el = document.getElementById('nx-' + id);
                    if (el) el.addEventListener('change', () => refresh(id));
                });
            }
            Object.keys(state.layers).forEach(id => { const e = document.getElementById('nx-st-' + id); if (e) e.textContent = state.layers[id].status || ''; });
        }
        renderPanel();

        async function pollOps() {
            try {
                const t = await jget(`${API}/threat`);
                const cols = ['', '#22c55e', '#eab308', '#f97316', '#ef4444', '#b91c1c'];
                const b = document.getElementById('nx-threat-badge');
                b.innerHTML = `<span style="color:${cols[t.level]}">● LEVEL ${t.level} ${esc(t.label)}</span>`;
                document.getElementById('nx-threat').innerHTML = Object.entries(t.components).map(([k, v]) => `${esc(k)}: ${v.error ? '<i>n/a</i>' : esc(Object.entries(v).filter(([a]) => a !== 'pts').map(([a, c]) => a + '=' + c).join(' '))}`).join('<br>') + `<br><b>Score ${t.score}</b>`;
            } catch (e) { }
            try {
                const [g, k] = await Promise.all([jget(`${API}/grid/de`), jget(`${API}/kp`)]);
                document.getElementById('nx-grid').innerHTML = `Last ${fmt(g.load_mw.value / 1000, 1)} GW // Wind ${fmt(g.wind_onshore_mw.value / 1000, 1)} GW // Solar ${fmt(g.solar_mw.value / 1000, 1)} GW<br>Kp ${fmt(k.kp, 2)} ${k.kp >= 5 ? '<b style="color:#ef4444">GEOMAGNETISCHER STURM</b>' : ''}`;
            } catch (e) { }
            try {
                const h = await jget(`${API}/health`);
                document.getElementById('nx-health').innerHTML = `<b>${h.up}/${h.total} online</b><br>` + h.providers.map(p => `<span class="nx-dot" style="background:${p.level === 'green' ? '#22c55e' : p.level === 'yellow' ? '#eab308' : '#ef4444'}"></span>${esc(p.name)} ${p.ms}ms`).join('<br>');
                const sumEl = document.getElementById('nx-status-summary');
                if (sumEl) sumEl.textContent = `${h.up}/${h.total} ONLINE`;
            } catch (e) { }
        }
        pollOps(); setInterval(pollOps, 180000);

        // ---------------- SITREP Dossier Export (Feature 07) ---------------------------------
        const btnSitrep = document.getElementById('nx-btn-sitrep');
        const modalSitrep = document.getElementById('modal-sitrep');
        const sitrepContent = document.getElementById('sitrep-content');
        const btnCloseSitrep = document.getElementById('btn-close-sitrep');
        const btnPrintSitrep = document.getElementById('btn-print-sitrep');

        async function openSitrep() {
            if (!modalSitrep) return;
            modalSitrep.style.display = 'flex';
            sitrepContent.innerHTML = '<div style="color:#38bdf8;padding:20px;text-align:center;">GENERATING CLASSIFIED SITREP DOSSIER…</div>';
            try {
                const rep = await jget(`${API}/report/sitrep`);
                const comp = rep.components || {};
                const dwdWarns = (rep.severe_alerts?.dwd_top_warnings || []).map(w => `<li style="margin:2px 0;"><span style="color:#ef4444;font-weight:bold;">${esc(w.event)}</span> – ${esc(w.region)} (${esc(w.start).slice(0, 16)})</li>`).join('') || '<li>Keine Stufe ≥3 Unwetter aktiv</li>';

                sitrepContent.innerHTML = `
                    <div style="border-bottom:2px solid #ef4444;padding-bottom:10px;margin-bottom:15px;display:flex;justify-content:space-between;align-items:flex-end;">
                        <div>
                            <div style="color:#ef4444;font-size:0.7rem;font-weight:bold;letter-spacing:2px;">[ CLASSIFIED TACTICAL DOSSIER // ECHTE OSINT-QUELLEN ]</div>
                            <h2 style="margin:4px 0;color:#f8fafc;font-size:1.3rem;">OPERATIONAL SITREP REPORT</h2>
                            <div style="color:#94a3b8;font-size:0.75rem;">TIMESTAMP: <span style="color:#38bdf8;">${esc(rep.timestamp_utc)}</span> // SESSION: <code>${SESSION}</code></div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:1.4rem;font-weight:900;color:${rep.threat_level >= 4 ? '#ef4444' : rep.threat_level >= 3 ? '#f97316' : '#22c55e'};">
                                DEFCON ${rep.threat_level} // ${esc(rep.threat_label)}
                            </div>
                            <div style="color:#94a3b8;font-size:0.75rem;">COMPOSITE RISK SCORE: ${rep.threat_score} / 10</div>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
                        <div style="background:#0b1324;border:1px solid #1e293b;padding:12px;border-radius:4px;">
                            <div style="color:#38bdf8;font-weight:bold;border-bottom:1px solid #1e293b;padding-bottom:4px;margin-bottom:8px;">⚡ KRITISCHE INFRASTRUKTUR & STROMNETZ (SMARD)</div>
                            <div>Netzlast (Deutschland): <strong style="color:#fff;">${rep.grid?.load_gw ?? '–'} GW</strong></div>
                            <div>Photovoltaik Solar: <strong style="color:#facc15;">${rep.grid?.solar_gw ?? '–'} GW</strong></div>
                            <div>Windenergie Onshore: <strong style="color:#38bdf8;">${rep.grid?.wind_onshore_gw ?? '–'} GW</strong></div>
                            <div style="margin-top:6px;padding-top:6px;border-top:1px dashed #1e293b;">
                                Sonnenwind / Magnetosphäre: <strong style="color:${rep.space_weather?.kp_index >= 5 ? '#ef4444' : '#22c55e'};">Kp ${rep.space_weather?.kp_index} (${rep.space_weather?.status})</strong>
                            </div>
                        </div>

                        <div style="background:#0b1324;border:1px solid #1e293b;padding:12px;border-radius:4px;">
                            <div style="color:#ef4444;font-weight:bold;border-bottom:1px solid #1e293b;padding-bottom:4px;margin-bottom:8px;">🌪️ KATASTROPHEN & EXTREMWETTER</div>
                            <div>DWD Unwetter (≥ Stufe 3): <strong style="color:#f97316;">${rep.severe_alerts?.dwd_level_3_plus} Landkreise</strong></div>
                            <div>NWS Extremwarnungen (USA): <strong style="color:#ef4444;">${rep.severe_alerts?.nws_extreme_us}</strong></div>
                            <div>GDACS globale Notlagen: <strong>${comp.gdacs?.red || 0} Rot / ${comp.gdacs?.orange || 0} Orange</strong></div>
                            <div>Erdbeben (M≥4.5 weltweit, 24h): <strong>${comp.earthquakes?.count_m45 || 0} (Max M${comp.earthquakes?.max_mag || '–'})</strong></div>
                            <div>NASA FIRMS thermische Brände: <strong>${comp.wildfires?.detections || 0} Hotspots (${comp.wildfires?.frp100 || 0} FRP≥100MW)</strong></div>
                            <div>USGS aktive Vulkane: <strong>${comp.volcanoes?.watch_or_warning || 0} auf Warnstufe</strong></div>
                        </div>
                    </div>

                    <div style="background:#0b1324;border:1px solid #1e293b;padding:12px;border-radius:4px;margin-bottom:15px;">
                        <div style="color:#f97316;font-weight:bold;border-bottom:1px solid #1e293b;padding-bottom:4px;margin-bottom:8px;">⚠️ AKTUELLE DWD EXTREMWETTER-LAGE (AUSZUG)</div>
                        <ul style="margin:0;padding-left:18px;font-size:0.75rem;color:#cbd5e1;">${dwdWarns}</ul>
                    </div>

                    <div style="background:#030712;border-left:3px solid #38bdf8;padding:8px 12px;font-size:0.72rem;color:#94a3b8;">
                        <strong style="color:#38bdf8;">EXECUTIVE SITUATION SUMMARY:</strong><br>${esc(rep.summary)}
                    </div>
                `;
                audit('sitrep_export', 'generated', 0, 0, { level: rep.threat_level, score: rep.threat_score });
            } catch (e) {
                sitrepContent.innerHTML = `<div style="color:#ef4444;padding:20px;">Fehler beim Laden des SITREP: ${esc(e.message)}</div>`;
            }
        }

        if (btnSitrep) btnSitrep.onclick = openSitrep;
        if (btnCloseSitrep) btnCloseSitrep.onclick = () => { if (modalSitrep) modalSitrep.style.display = 'none'; };
        if (btnPrintSitrep) btnPrintSitrep.onclick = () => window.print();
        if (modalSitrep) modalSitrep.onclick = e => { if (e.target === modalSitrep) modalSitrep.style.display = 'none'; };

        // ---------------- Multi-Cam Grid & Optical Filters (Features 01 & 51) ----------------
        const camContainer = document.getElementById('webcam-player-container');
        const filterSelect = document.getElementById('cam-shader-filter');

        if (filterSelect) {
            filterSelect.onchange = () => {
                const f = filterSelect.value;
                if (!camContainer) return;
                camContainer.classList.remove('filter-nvg', 'filter-flir', 'filter-mono');
                if (f === 'nvg') camContainer.classList.add('filter-nvg');
                else if (f === 'flir') camContainer.classList.add('filter-flir');
                else if (f === 'mono') camContainer.classList.add('filter-mono');
                audit('cam_shader_filter', f);
            };
        }

        async function setGridMode(num) {
            document.querySelectorAll('.cam-grid-toggle .ops-btn').forEach(b => {
                b.classList.toggle('active', parseInt(b.dataset.grid) === num);
            });
            if (!camContainer) return;

            if (num === 1) {
                if (window.PlayerController && window.PlayerController.currentCamId) {
                    window.PlayerController.loadStream(window.PlayerController.currentCamId);
                } else if (window.MapController && window.MapController.activeCam) {
                    window.MapController.selectAndPlayCam(window.MapController.activeCam.id);
                }
                audit('cam_grid_mode', '1x1');
                return;
            }

            const cams = (window.MapController?.activeSectorCams || []).slice(0, num);
            if (cams.length < num) {
                try {
                    const c = map.getCenter();
                    const d = 5.0;
                    const res = await jget(`/api/cameras/bbox?min_lat=${(c.lat - d).toFixed(2)}&max_lat=${(c.lat + d).toFixed(2)}&min_lon=${(c.lng - d).toFixed(2)}&max_lon=${(c.lng + d).toFixed(2)}&limit=${num}`);
                    const fetched = (res.cameras || []).slice(0, num);
                    if (fetched.length) cams.push(...fetched.slice(cams.length));
                } catch (e) { }
            }
            if (cams.length < num) {
                try {
                    const cat = await jget(`/api/cameras/catalog?provider=all&limit=${num}`);
                    const fetched = (cat.cameras || []).slice(0, num);
                    if (fetched.length) cams.push(...fetched.slice(cams.length));
                } catch (e) { }
            }

            camContainer.innerHTML = '';
            const gridEl = document.createElement('div');
            gridEl.className = `cam-grid-container cam-grid-${num}`;

            (cams.length ? cams : [{ id: 'live_1', title: 'Live Sektor Feed' }]).slice(0, num).forEach((c, idx) => {
                const cell = document.createElement('div');
                cell.className = 'cam-grid-cell';
                const img = document.createElement('img');
                const streamUrl = `/api/cameras/stream-proxy?id=${encodeURIComponent(c.id)}&t=${Date.now()}`;
                img.src = streamUrl;
                img.alt = c.title || `Cam #${idx + 1}`;
                img.onerror = () => { img.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80'; };
                const timer = setInterval(() => {
                    if (!cell.isConnected) return clearInterval(timer);
                    img.src = `/api/cameras/stream-proxy?id=${encodeURIComponent(c.id)}&t=${Date.now()}`;
                }, 4000 + idx * 800);

                cell.appendChild(img);
                const badge = document.createElement('div');
                badge.className = 'cam-grid-cell-badge';
                badge.textContent = `CAM ${idx + 1}`;
                cell.appendChild(badge);

                const title = document.createElement('div');
                title.className = 'cam-grid-cell-title';
                title.textContent = c.title || `Kamera ${idx + 1}`;
                cell.appendChild(title);

                cell.onclick = () => {
                    setGridMode(1);
                    if (window.MapController) window.MapController.selectAndPlayCam(c.id);
                };
                gridEl.appendChild(cell);
            });

            camContainer.appendChild(gridEl);
            audit('cam_grid_mode', `${num}-grid`, 0, 0, { count: cams.length });
        }

        ['btn-cam-view-1x1', 'btn-cam-view-2x2', 'btn-cam-view-3x3'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.onclick = () => setGridMode(parseInt(btn.dataset.grid));
        });

        // ---------------- Keyboard control ---------------------------------------------------
        document.addEventListener('keydown', e => {
            const t = e.target; if (t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable)) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            const k = e.key.toLowerCase(), step = 140;
            if (k === 'w' || k === 'arrowup') map.panBy([0, -step]);
            else if (k === 's' || k === 'arrowdown') map.panBy([0, step]);
            else if (k === 'a' || k === 'arrowleft') map.panBy([-step, 0]);
            else if (k === 'd' || k === 'arrowright') map.panBy([step, 0]);
            else if (k === '+' || k === '=') map.zoomIn();
            else if (k === '-') map.zoomOut();
            else if (k === 'i') setMode(state.iso ? null : 'iso');
            else if (k === 'm') setMode(state.measure ? null : 'measure');
            else if (k === 'escape') { setMode(null); isoLg.clearLayers(); measLg.clearLayers(); trackLg.clearLayers(); }
            else return;
            if (k.startsWith('arrow')) e.preventDefault();
        });

        window.NexusUpgrade = { state, refresh, showTrack, audit, setMode, announce, siren, correlateFlights, SESSION };
        audit('session_start', navigator.userAgent.slice(0, 80));
        console.log('[NEXUS v2.5] upgrade layer online, session', SESSION);
    }

    const t = setInterval(() => { if (window.MapController && window.MapController.map && window.MapController.firmsLayer) { clearInterval(t); init(window.MapController); } }, 250);
})();
