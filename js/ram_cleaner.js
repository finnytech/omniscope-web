/**
 * CYBER-SPECTRE-NEXUS: Extreme RAM & YouTube Stream Garbage Cleaner
 * 
 * High-performance concurrency governor and memory eviction engine:
 * 1. Deep Chromium iframe teardown (postMessage stopVideo + about:blank + DOM eviction)
 * 2. Concurrency Governor: ECO (max 2), STRICT (max 1), UNLIMITED modes
 * 3. Cyberpunk Standby Cards with instant 1-click restore
 * 4. Viewport Intersection Observer (auto-suspend off-screen streams)
 * 5. Periodic Garbage Collection cycle & manual FLUSH RAM button
 * 6. Live RAM telemetry badge (performance.memory)
 */

class ExtremeRamCleaner {
    constructor() {
        this.streams = new Map();
        this.mode = localStorage.getItem('spectre_ram_mode') || 'eco';
        this.activeStreamOrder = []; // LRU tracking: oldest at index 0
        this.idleThresholdMs = 45000; // 45 seconds idle
        this.observer = null;
        this.telemetryInterval = null;
        this.periodicGcInterval = null;
        this.initialized = false;
    }

    get maxConcurrent() {
        if (this.mode === 'strict') return 1;
        if (this.mode === 'eco') return 2;
        return 99; // unlimited
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.setupStreamRegistry();
        this.setupIntersectionObserver();
        this.setupUiControls();
        this.startTelemetryLoop();
        this.startPeriodicGc();

        // Enforce initial boot policy (keep only 1-2 primary streams active, suspend others)
        this.enforceBootPolicy();

        console.log(`[ExtremeRamCleaner] Initialized in ${this.mode.toUpperCase()} mode (Max ${this.maxConcurrent} streams).`);
    }

    /**
     * Purges an iframe deeply to force Chromium to release video decoders, GPU textures and RAM
     */
    static purgeIframe(iframe) {
        if (!iframe) return;
        try {
            // Signal YouTube player API to halt playback and release media buffers
            iframe.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            iframe.contentWindow?.postMessage('{"event":"command","func":"clearVideo","args":""}', '*');
        } catch (e) {
            // Cross-origin safe
        }

        try {
            // Force Chromium to tear down the sub-frame renderer process
            iframe.src = 'about:blank';
            iframe.removeAttribute('src');
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
        } catch (e) {
            console.warn('[RamCleaner] Error removing iframe:', e);
        }
    }

    setupStreamRegistry() {
        // Register known tactical monitor streams
        const monitors = [
            {
                id: 'nasa-iss-iframe',
                containerId: 'iss-player-container',
                cardId: 'card-iss',
                title: 'SPACE STATION // NASA HD LIVE CAM',
                icon: '🛰️',
                defaultUrl: 'https://www.youtube-nocookie.com/embed/fO9e9jnhYK8?autoplay=1&mute=1&playsinline=1&enablejsapi=1',
                priority: 1
            },
            {
                id: 'flight-stream-iframe',
                containerSelector: '#card-flights .video-stream-container',
                cardId: 'card-flights',
                title: 'AIRPORT RUNWAY LIVE (LAX 24L)',
                icon: '✈️',
                defaultUrl: 'https://www.youtube-nocookie.com/embed/n4I0d44oBEs?autoplay=1&mute=1&playsinline=1&enablejsapi=1',
                priority: 3
            },
            {
                id: 'firms-stream-iframe',
                containerSelector: '#card-firms .video-stream-container',
                cardId: 'card-firms',
                title: 'WILDFIRE & VOLCANO LOOKOUT (USGS KILAUEA)',
                icon: '🔥',
                defaultUrl: 'https://www.youtube-nocookie.com/embed/HggWKlZv9yk?autoplay=1&mute=1&playsinline=1&enablejsapi=1',
                priority: 4
            },
            {
                id: 'quakes-stream-iframe',
                containerSelector: '#card-quakes .video-stream-container',
                cardId: 'card-quakes',
                title: 'SEISMIC LIVE HELICORDER STREAM',
                icon: '⚡',
                defaultUrl: 'https://www.youtube-nocookie.com/embed/TWy9JMPs5Gk?autoplay=1&mute=1&playsinline=1&enablejsapi=1',
                priority: 5
            },
            {
                id: 'storm-stream-iframe',
                containerId: 'storm-player-container',
                cardId: 'card-storm',
                title: 'SEVERE WEATHER & TORNADO CHASER',
                icon: '🌪️',
                defaultUrl: 'https://www.youtube-nocookie.com/embed/sgJ14rQRUgQ?autoplay=1&mute=1&playsinline=1&enablejsapi=1',
                priority: 6
            },
            {
                id: 'volcano-stream-iframe',
                containerId: 'volcano-player-container',
                cardId: 'card-volcano',
                title: 'ACTIVE VOLCANO LIVE (LITLI-HRUTUR)',
                icon: '🌋',
                defaultUrl: 'https://www.youtube-nocookie.com/embed/BgimbZHOICU?autoplay=1&mute=1&playsinline=1&enablejsapi=1',
                priority: 7
            },
            {
                id: 'vessels-stream-iframe',
                containerSelector: '#card-vessels .split-stream-box .video-stream-container, #card-vessels .video-stream-container',
                cardId: 'card-vessels',
                title: 'MARITIME HARBOR LIVE (HAMBURG ELBE)',
                icon: '🚢',
                defaultUrl: 'https://www.youtube-nocookie.com/embed/vukolcrIkzc?autoplay=1&mute=1&playsinline=1&enablejsapi=1',
                priority: 8
            }
        ];

        monitors.forEach(m => {
            let container = null;
            if (m.containerId) {
                container = document.getElementById(m.containerId);
            } else if (m.containerSelector) {
                container = document.querySelector(m.containerSelector);
            }

            const initialIframe = document.getElementById(m.id);
            const initialUrl = initialIframe ? (initialIframe.getAttribute('data-src') || (initialIframe.getAttribute('src') !== 'about:blank' ? initialIframe.getAttribute('src') : null) || m.defaultUrl) : m.defaultUrl;

            this.streams.set(m.id, {
                id: m.id,
                container: container,
                cardId: m.cardId,
                title: m.title,
                icon: m.icon,
                currentUrl: initialUrl,
                defaultUrl: m.defaultUrl,
                status: initialIframe ? 'active' : 'standby',
                lastActive: Date.now(),
                priority: m.priority,
                iframe: initialIframe
            });

            if (initialIframe) {
                this.activeStreamOrder.push(m.id);
            }
        });
    }

    enforceBootPolicy() {
        if (this.mode === 'unlimited') return;

        // On boot, keep ISS (priority 1) active, suspend the others to free ~2GB of RAM immediately
        const streamsToSuspend = ['flight-stream-iframe', 'firms-stream-iframe', 'quakes-stream-iframe', 'storm-stream-iframe', 'volcano-stream-iframe', 'vessels-stream-iframe'];

        streamsToSuspend.forEach(id => {
            this.suspendStream(id);
        });

        this.updateTelemetryBadge();
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                const cardId = card.id;

                // Find stream associated with this card
                for (const [streamId, stream] of this.streams.entries()) {
                    if (stream.cardId === cardId) {
                        if (!entry.isIntersecting || entry.intersectionRatio < 0.15) {
                            // Scrolled out of view: if in eco or strict, mark for suspension after grace period
                            if (stream.status === 'active' && this.mode !== 'unlimited') {
                                stream.offScreenSince = Date.now();
                            }
                        } else {
                            // Scrolled back into view
                            stream.offScreenSince = null;
                        }
                    }
                }
            });
        }, { threshold: [0, 0.15, 0.5] });

        // Observe all cards
        this.streams.forEach(stream => {
            if (stream.cardId) {
                const el = document.getElementById(stream.cardId);
                if (el) this.observer.observe(el);
            }
        });
    }

    suspendStream(streamId) {
        const stream = this.streams.get(streamId);
        if (!stream || stream.status === 'standby') return;

        // 1. Purge existing iframe
        if (stream.container) {
            const iframes = stream.container.querySelectorAll('iframe');
            iframes.forEach(f => ExtremeRamCleaner.purgeIframe(f));
        }

        stream.status = 'standby';
        stream.iframe = null;

        // Remove from active LRU list
        const idx = this.activeStreamOrder.indexOf(streamId);
        if (idx !== -1) this.activeStreamOrder.splice(idx, 1);

        // 2. Render sleek Cyberpunk Standby Card
        if (stream.container) {
            stream.container.innerHTML = `
                <div class="ram-standby-placeholder" data-stream-id="${stream.id}">
                    <div class="standby-scanline"></div>
                    <div class="standby-header">
                        <span class="standby-led amber"></span>
                        <span class="standby-tag">ECO STANDBY // ZERO-RAM DECODER</span>
                    </div>
                    <div class="standby-center">
                        <div class="standby-icon">${stream.icon || '📹'}</div>
                        <div class="standby-name">${stream.title}</div>
                        <div class="standby-stat">RAM FREIGEGEBEN: ~250 MB GESPART</div>
                        <button class="ops-btn active btn-resume-stream" data-stream-id="${stream.id}" style="margin-top:10px;padding:5px 14px;font-size:0.75rem;">
                            ▶ STREAM STARTEN (RAM-SCHONEND)
                        </button>
                    </div>
                    <div class="standby-footer">KLICKE ZUM AKTIVIEREN • AUTOMATISCHER SPEICHER-GUARD</div>
                </div>
            `;

            // Wire instant resume button
            const resumeBtn = stream.container.querySelector('.btn-resume-stream');
            if (resumeBtn) {
                resumeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.resumeStream(streamId);
                });
            }
        }

        this.updateTelemetryBadge();
    }

    resumeStream(streamId, newUrl = null) {
        const stream = this.streams.get(streamId);
        if (!stream) return;

        if (newUrl) {
            stream.currentUrl = newUrl;
        }

        const targetUrl = stream.currentUrl || stream.defaultUrl;

        // Check concurrency limit before activating
        if (this.mode !== 'unlimited') {
            const activeStreams = Array.from(this.streams.values()).filter(s => s.status === 'active');
            while (activeStreams.length >= this.maxConcurrent && this.activeStreamOrder.length > 0) {
                // Suspend the least recently active stream
                const oldestId = this.activeStreamOrder.shift();
                if (oldestId && oldestId !== streamId) {
                    this.suspendStream(oldestId);
                }
            }
        }

        // Re-inject fresh iframe
        if (stream.container) {
            stream.container.innerHTML = '';

            const iframe = document.createElement('iframe');
            iframe.id = stream.id;
            iframe.src = targetUrl;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;

            stream.container.appendChild(iframe);
            stream.iframe = iframe;
            stream.status = 'active';
            stream.lastActive = Date.now();

            // Add to LRU order
            const idx = this.activeStreamOrder.indexOf(streamId);
            if (idx !== -1) this.activeStreamOrder.splice(idx, 1);
            this.activeStreamOrder.push(streamId);

            if (window.CyberAudio && window.CyberAudio.playStreamConnect) {
                window.CyberAudio.playStreamConnect();
            }
        }

        this.updateTelemetryBadge();
    }

    flushRamExtreme(forceAll = false) {
        let freedCount = 0;

        this.streams.forEach((stream, streamId) => {
            // In forceAll mode: suspend every monitor
            // Otherwise: keep only the most recently used stream
            if (stream.status === 'active') {
                if (forceAll || this.activeStreamOrder.indexOf(streamId) !== this.activeStreamOrder.length - 1) {
                    this.suspendStream(streamId);
                    freedCount++;
                }
            }
        });

        // Also purge any orphaned or detached iframes found in the DOM
        const allIframes = document.querySelectorAll('iframe');
        allIframes.forEach(f => {
            const isKnown = Array.from(this.streams.values()).some(s => s.iframe === f);
            const isWebcam = f.closest('#webcam-player-container');
            const isMap = f.closest('#card-map');
            if (!isKnown && !isWebcam && !isMap) {
                ExtremeRamCleaner.purgeIframe(f);
                freedCount++;
            }
        });

        // Clear image decoding cache hints
        if (window.performance && window.performance.clearResourceTimings) {
            window.performance.clearResourceTimings();
        }

        // Trigger procedural feedback
        if (window.CyberAudio && window.CyberAudio.playTelemetryChirp) {
            window.CyberAudio.playTelemetryChirp();
        }

        this.flashHudPurgeNotice(freedCount);
        this.updateTelemetryBadge();
    }

    setMode(mode) {
        if (!['eco', 'strict', 'unlimited'].includes(mode)) return;
        this.mode = mode;
        localStorage.setItem('spectre_ram_mode', mode);

        // If switched to eco or strict, enforce limits immediately
        if (this.mode !== 'unlimited') {
            const activeStreams = Array.from(this.streams.values()).filter(s => s.status === 'active');
            while (activeStreams.length > this.maxConcurrent && this.activeStreamOrder.length > 0) {
                const oldest = this.activeStreamOrder.shift();
                if (oldest) this.suspendStream(oldest);
            }
        }

        this.updateTelemetryBadge();
    }

    startPeriodicGc() {
        this.periodicGcInterval = setInterval(() => {
            const now = Date.now();

            // Check off-screen streams that have been out of viewport for > 20s
            this.streams.forEach((stream, streamId) => {
                if (stream.status === 'active' && stream.offScreenSince) {
                    if (now - stream.offScreenSince > 20000 && this.mode !== 'unlimited') {
                        console.log(`[RamCleaner] Auto-suspending off-screen stream: ${streamId}`);
                        this.suspendStream(streamId);
                    }
                }
            });

            // Enforce max concurrency limit
            if (this.mode !== 'unlimited') {
                const activeStreams = Array.from(this.streams.values()).filter(s => s.status === 'active');
                if (activeStreams.length > this.maxConcurrent && this.activeStreamOrder.length > 0) {
                    const oldest = this.activeStreamOrder.shift();
                    if (oldest) this.suspendStream(oldest);
                }
            }
        }, 15000);
    }

    startTelemetryLoop() {
        this.updateTelemetryBadge();
        this.telemetryInterval = setInterval(() => {
            this.updateTelemetryBadge();
        }, 2000);
    }

    updateTelemetryBadge() {
        const badge = document.getElementById('ram-telemetry-badge');
        const dot = document.getElementById('ram-indicator-dot');
        if (!badge) return;

        let memStr = '--';
        let usedMb = 0;
        if (window.performance && window.performance.memory) {
            usedMb = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
            memStr = `${usedMb} MB`;
        }

        const activeCount = Array.from(this.streams.values()).filter(s => s.status === 'active').length;
        const totalCount = this.streams.size;

        badge.innerText = `RAM: ${memStr} | ${activeCount}/${totalCount} ACTIVE (${this.mode.toUpperCase()})`;

        if (dot) {
            if (activeCount <= 2) {
                dot.style.background = '#10b981';
                dot.style.boxShadow = '0 0 8px #10b981';
            } else if (activeCount <= 4) {
                dot.style.background = '#f59e0b';
                dot.style.boxShadow = '0 0 8px #f59e0b';
            } else {
                dot.style.background = '#ef4444';
                dot.style.boxShadow = '0 0 8px #ef4444';
            }
        }
    }

    flashHudPurgeNotice(freedCount) {
        const badge = document.getElementById('ram-telemetry-badge');
        if (!badge) return;

        const origText = badge.innerText;
        badge.innerText = `🧹 PURGED ${freedCount} STREAMS // RAM FREED!`;
        badge.style.color = '#38bdf8';

        setTimeout(() => {
            badge.style.color = '';
            this.updateTelemetryBadge();
        }, 2500);
    }

    setupUiControls() {
        const flushBtn = document.getElementById('btn-flush-ram-extreme');
        if (flushBtn) {
            flushBtn.addEventListener('click', () => {
                this.flushRamExtreme(false);
            });
        }

        const modeSelect = document.getElementById('ram-governor-mode');
        if (modeSelect) {
            modeSelect.value = this.mode;
            modeSelect.addEventListener('change', (e) => {
                this.setMode(e.target.value);
            });
        }
    }
}

// Global instance attached to window
window.RamCleaner = new ExtremeRamCleaner();

document.addEventListener('DOMContentLoaded', () => {
    window.RamCleaner.init();
});
