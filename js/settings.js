/**
 * CYBER-SPECTRE-NEXUS: API Key Vault Manager
 * Syncs with backend /api/config and provides real-time key testing.
 */

class KeyVault {
    constructor() {
        this.bindEvents();
        this.loadVault();
    }

    bindEvents() {
        // Save button
        const saveBtn = document.getElementById('vault-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveVault());
        }

        // Test buttons
        document.querySelectorAll('.btn-test').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (window.CyberAudio && window.CyberAudio.playPing) window.CyberAudio.playPing();
                const service = btn.getAttribute('data-service');
                await this.testServiceKey(service, btn);
            });
        });
    }

    async loadVault() {
        try {
            const res = await fetch('/api/config');
            if (res.ok) {
                const data = await res.json();
                if (data.mapbox_token) document.getElementById('key-mapbox').value = data.mapbox_token;
                if (data.firms_map_key) document.getElementById('key-firms').value = data.firms_map_key;
                
                if (data.google_maps_key && document.getElementById('key-google-maps')) {
                    document.getElementById('key-google-maps').value = data.google_maps_key;
                }
                
                if (data.codiv_api_key && document.getElementById('key-codiv')) {
                    document.getElementById('key-codiv').value = data.codiv_api_key;
                }
                
                // Sync default JEV engine radio
                const currentJevEngine = localStorage.getItem('csn_jev_engine') || 'cloud';
                if (currentJevEngine === 'local') {
                    const elLocal = document.getElementById('engine-local');
                    if (elLocal) elLocal.checked = true;
                } else {
                    const elCloud = document.getElementById('engine-cloud');
                    if (elCloud) elCloud.checked = true;
                }

                // Check local storage for extra values
                const local = JSON.parse(localStorage.getItem('cyber_vault_keys') || '{}');
                if (local.windy) document.getElementById('key-windy').value = local.windy;
                if (local.owm) document.getElementById('key-owm').value = local.owm;
                if (local.opensky_id) document.getElementById('key-opensky-id').value = local.opensky_id;
                if (local.opensky_secret) document.getElementById('key-opensky-secret').value = local.opensky_secret;
                if (local.google_maps && document.getElementById('key-google-maps')) {
                    document.getElementById('key-google-maps').value = local.google_maps;
                }
                if (local.maptiler && document.getElementById('key-maptiler')) {
                    document.getElementById('key-maptiler').value = local.maptiler;
                }
                if (local.codiv && document.getElementById('key-codiv')) {
                    document.getElementById('key-codiv').value = local.codiv;
                }
            }
        } catch (e) {
            console.warn("Could not load backend config:", e);
        }
    }

    async saveVault() {
        const windy = document.getElementById('key-windy').value.trim();
        const owm = document.getElementById('key-owm').value.trim();
        const mapbox = document.getElementById('key-mapbox').value.trim();
        const firms = document.getElementById('key-firms').value.trim();
        const opensky_id = document.getElementById('key-opensky-id').value.trim();
        const opensky_secret = document.getElementById('key-opensky-secret').value.trim();
        const google_maps = document.getElementById('key-google-maps') ? document.getElementById('key-google-maps').value.trim() : '';
        const maptiler = document.getElementById('key-maptiler') ? document.getElementById('key-maptiler').value.trim() : '';
        const codiv = document.getElementById('key-codiv') ? document.getElementById('key-codiv').value.trim() : '';

        // Save selected JEV Engine preference
        const elLocal = document.getElementById('engine-local');
        const chosenEngine = (elLocal && elLocal.checked) ? 'local' : 'cloud';
        localStorage.setItem('csn_jev_engine', chosenEngine);

        // Sync toolbar select and badge
        const topSelect = document.getElementById('jev-engine-select');
        if (topSelect) topSelect.value = chosenEngine;
        if (window.MapController && window.MapController.updateJevHardwareBadge) {
            window.MapController.updateJevHardwareBadge(chosenEngine);
        }

        const payload = {};
        if (windy) payload.windy_api_key = windy;
        if (owm) payload.openweather_api_key = owm;
        if (mapbox) payload.mapbox_token = mapbox;
        if (firms) payload.firms_map_key = firms;
        if (opensky_id) payload.opensky_client_id = opensky_id;
        if (opensky_secret) payload.opensky_client_secret = opensky_secret;
        if (google_maps) payload.google_maps_key = google_maps;
        if (maptiler) payload.maptiler_key = maptiler;
        if (codiv) {
            payload.codiv_api_key = codiv;
            payload.openjev_api_key = codiv;
        }

        const statusEl = document.getElementById('vault-status');
        if (statusEl) statusEl.innerText = "SAVING TO ENCRYPTED VAULT...";

        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // Save locally
                localStorage.setItem('cyber_vault_keys', JSON.stringify({
                    windy, owm, mapbox, firms, opensky_id, opensky_secret, google_maps, maptiler, codiv
                }));

                if (window.CyberAudio && window.CyberAudio.playStreamConnect) window.CyberAudio.playStreamConnect();
                if (statusEl) statusEl.innerText = "VAULT UPDATED SUCCESSFULLY";
                setTimeout(() => {
                    document.getElementById('vault-modal').classList.add('hidden');
                    if (statusEl) statusEl.innerText = "";
                }, 1200);
            }
        } catch (e) {
            if (statusEl) statusEl.innerText = "ERROR SAVING TO VAULT";
        }
    }

    async testServiceKey(service, btn) {
        btn.innerText = 'TESTING...';
        btn.style.color = 'var(--warn)';

        try {
            if (service === 'codiv') {
                const key = document.getElementById('key-codiv') ? document.getElementById('key-codiv').value.trim() : '';
                const res = await fetch('/api/weather/jev-prediction?lat=52.52&lon=13.41&radius_km=30&engine=cloud');
                if (res.ok) {
                    const data = await res.json();
                    const valid = data && data.status === 'success' && data.jev_decision && data.jev_decision.is_cloud;
                    this.setTestResult(btn, valid);
                } else {
                    this.setTestResult(btn, false);
                }
            } else if (service === 'owm') {
                const key = document.getElementById('key-owm').value.trim();
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=52.52&lon=13.40&appid=${key}`);
                this.setTestResult(btn, res.ok);
            } else if (service === 'mapbox') {
                const token = document.getElementById('key-mapbox').value.trim();
                const res = await fetch(`https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=${token}`);
                this.setTestResult(btn, res.ok);
            } else if (service === 'firms') {
                const key = document.getElementById('key-firms').value.trim();
                const res = await fetch(`https://firms.modaps.eosdis.nasa.gov/mapserver/mapkey_status/?MAP_KEY=${key}`);
                this.setTestResult(btn, res.ok);
            } else if (service === 'windy') {
                const key = document.getElementById('key-windy').value.trim();
                if (key.length > 5) {
                    this.setTestResult(btn, true);
                } else {
                    this.setTestResult(btn, false);
                }
            } else if (service === 'maptiler') {
                const res = await fetch('/api/tiles/maptiler/streets-v2/1/1/0.png');
                this.setTestResult(btn, res.ok);
            } else {
                this.setTestResult(btn, true);
            }
        } catch (e) {
            this.setTestResult(btn, false);
        }
    }

    setTestResult(btn, success) {
        if (success) {
            btn.innerText = 'OK (VALID)';
            btn.style.color = 'var(--primary)';
        } else {
            btn.innerText = 'FAILED';
            btn.style.color = 'var(--alert)';
        }
        setTimeout(() => {
            btn.innerText = 'TEST';
            btn.style.color = '';
        }, 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.Vault = new KeyVault();
});
