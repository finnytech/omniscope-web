/**
 * CYBER-SPECTRE-NEXUS: NVIDIA NIM AI Assistant & Tactical Operations
 * Integrates:
 * 1. DeepSeek v4.1 Flash Ask-Question OSINT Support Bot
 * 2. NVIDIA cuOpt Escape & Intercept Routing
 * 3. NVIDIA Body Pose 3D Human Skeleton & Bounding Box Overlays
 */

class AiAssistantController {
    constructor() {
        this.isOpen = false;
        this.history = [];
        this.bodyPoseActive = false;
        this.bodyPoseLayers = { knochen: true, kasten: true };
        this.lastPoseDetections = null;
        this.routeLayerGroup = null;

        this.init();
    }

    init() {
        // Wire Open/Close buttons
        const openBtn = document.getElementById('btn-open-ai-chat');
        const modal = document.getElementById('ai-support-bot-modal');
        const closeBtn = document.getElementById('btn-close-ai-bot');
        const sendBtn = document.getElementById('btn-ai-send');
        const input = document.getElementById('ai-input-field');

        if (openBtn) {
            openBtn.addEventListener('click', () => this.toggleModal(true));
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleModal(false));
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.toggleModal(false);
            });
        }
        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => this.handleSend());
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });
        }

        // Wire quick prompt chips
        document.querySelectorAll('.ai-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                if (prompt && input) {
                    input.value = prompt;
                    this.handleSend();
                }
            });
        });

        // Wire 3D Body Pose Toggle in MON-02
        const poseBtn = document.getElementById('btn-toggle-body-pose');
        if (poseBtn) {
            poseBtn.addEventListener('click', () => this.toggleBodyPose());
        }

        const chkKnochen = document.getElementById('chk-layer-knochen');
        const chkKasten = document.getElementById('chk-layer-kasten');
        if (chkKnochen) {
            chkKnochen.addEventListener('change', (e) => {
                this.bodyPoseLayers.knochen = e.target.checked;
                this.renderPoseOverlay();
            });
        }
        if (chkKasten) {
            chkKasten.addEventListener('change', (e) => {
                this.bodyPoseLayers.kasten = e.target.checked;
                this.renderPoseOverlay();
            });
        }

        window.addEventListener('resize', () => {
            if (this.bodyPoseActive) this.renderPoseOverlay();
        });
    }

    toggleModal(show) {
        const modal = document.getElementById('ai-support-bot-modal');
        if (!modal) return;
        this.isOpen = show;
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            const input = document.getElementById('ai-input-field');
            if (input) setTimeout(() => input.focus(), 100);
            if (this.history.length === 0) {
                this.addBotMessage(
                    "👋 Willkommen im Cyber-Spectre Tactical OSINT Support Terminal.\n\n" +
                    "Ich bin dein **Ask-Question Support Bot** (angetrieben von **NVIDIA NIM: DeepSeek v4.1 Flash** & **Nemotron 3 Ultra**).\n" +
                    "Ich beantworte deine Fragen zu:\n" +
                    "- 🌪️ Unwetterlagen, Tornado-Gefahren und Zugbahnen\n" +
                    "- 📡 Doppler-Radar-Interpretation (dBZ, Radial Velocity, Echo Tops)\n" +
                    "- 🏃 Schnellste Flucht- oder Abfangrouten (NVIDIA cuOpt)\n" +
                    "- 🦴 3D-Körpererkennung auf Webcams (NVIDIA Body Pose)\n\n" +
                    "Wie kann ich dich bei deiner Lagebeurteilung unterstützen?"
                );
            }
        }
    }

    async handleSend() {
        const input = document.getElementById('ai-input-field');
        if (!input) return;
        const query = input.value.trim();
        if (!query) return;

        input.value = '';
        this.addUserMessage(query);

        // Check for routing triggers
        const qLower = query.toLowerCase();
        if (qLower.includes('flucht') || qLower.includes('escape') || qLower.includes('abfang') || qLower.includes('route')) {
            const mode = (qLower.includes('flucht') || qLower.includes('escape')) ? 'escape' : 'intercept';
            await this.requestRouteOptimization(mode);
            return;
        }

        // Show typing indicator
        const typingId = this.showTypingIndicator();

        try {
            // Gather live situational telemetry as system context
            let activeThreatContext = "Keine aktiven Tornados im aktuellen Fokus.";
            if (window.MapController && window.MapController.pinnedStorm) {
                const ps = window.MapController.pinnedStorm;
                activeThreatContext = `Aktiver Fokus-Sturm: ${ps.title} bei LAT ${ps.lat}, LON ${ps.lon}. Wind: ${ps.wind_speed}, Zugbahn: ${ps.motion_vector}.`;
            }

            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: this.history,
                    system: `Du bist der offizielle Cyber-Spectre Nexus Tactical OSINT Support Bot. Aktueller Systemstatus: ${activeThreatContext}. Antworte präzise auf Deutsch.`
                })
            });

            this.removeTypingIndicator(typingId);

            if (res.ok) {
                const data = await res.json();
                this.addBotMessage(data.reply || "Keine Antwort erhalten.");
            } else {
                this.addBotMessage("⚠️ Fehler bei der Kommunikation mit dem NVIDIA NIM Server.");
            }
        } catch (err) {
            this.removeTypingIndicator(typingId);
            this.addBotMessage(`⚠️ Verbindungsfehler: ${err.message}`);
        }
    }

    addUserMessage(text) {
        this.history.push({ role: 'user', content: text });
        this.appendMessageToDOM('user', text);
    }

    addBotMessage(markdownText) {
        this.history.push({ role: 'assistant', content: markdownText });
        this.appendMessageToDOM('bot', markdownText);
    }

    appendMessageToDOM(sender, text) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;

        const row = document.createElement('div');
        row.className = `ai-msg-row ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = `ai-msg-bubble ${sender}`;

        // Basic formatting
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;">$1</code>')
            .replace(/\n/g, '<br/>');

        bubble.innerHTML = formatted;
        row.appendChild(bubble);
        container.appendChild(row);

        container.scrollTop = container.scrollHeight;
    }

    showTypingIndicator() {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return null;
        const id = 'typing-' + Date.now();
        const row = document.createElement('div');
        row.id = id;
        row.className = 'ai-msg-row bot';
        row.innerHTML = `<div class="ai-msg-bubble bot" style="color:#94a3b8;font-style:italic;">⚡ DeepSeek v4.1 Flash analysiert Telemetrie...</div>`;
        container.appendChild(row);
        container.scrollTop = container.scrollHeight;
        return id;
    }

    removeTypingIndicator(id) {
        if (!id) return;
        const elem = document.getElementById(id);
        if (elem) elem.remove();
    }

    // =========================================================================
    // NVIDIA cuOpt ROUTING INTEGRATION
    // =========================================================================
    async requestRouteOptimization(mode = 'escape') {
        const mapCtrl = window.MapController;
        if (!mapCtrl || !mapCtrl.map) {
            this.addBotMessage("⚠️ Kartencontroller nicht bereit.");
            return;
        }

        const center = mapCtrl.map.getCenter();
        let target = { lat: 35.3395, lon: -97.4867 };

        if (mapCtrl.pinnedStorm) {
            target = { lat: mapCtrl.pinnedStorm.lat, lon: mapCtrl.pinnedStorm.lon };
        }

        const origin = { lat: center.lat, lon: center.lng };

        const typingId = this.showTypingIndicator();

        try {
            const res = await fetch('/api/ai/route-opt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ origin, target, mode })
            });

            this.removeTypingIndicator(typingId);

            if (res.ok) {
                const data = await res.json();
                this.addBotMessage(data.summary);
                this.renderRouteOnMap(data, mode);
            } else {
                this.addBotMessage("⚠️ NVIDIA cuOpt Routenoptimierung fehlgeschlagen.");
            }
        } catch (e) {
            this.removeTypingIndicator(typingId);
            this.addBotMessage(`⚠️ Routenfehler: ${e.message}`);
        }
    }

    renderRouteOnMap(routeData, mode) {
        const mapCtrl = window.MapController;
        if (!mapCtrl || !mapCtrl.map) return;

        if (this.routeLayerGroup) {
            mapCtrl.map.removeLayer(this.routeLayerGroup);
        }

        this.routeLayerGroup = L.layerGroup();

        const color = mode === 'escape' ? '#38bdf8' : '#22c55e';
        const lineCoords = [[routeData.origin.lat, routeData.origin.lon]];

        (routeData.waypoints || []).forEach(wp => {
            lineCoords.push([wp.lat, wp.lon]);

            const marker = L.circleMarker([wp.lat, wp.lon], {
                radius: 7,
                color: color,
                fillColor: mode === 'escape' ? '#0284c7' : '#15803d',
                fillOpacity: 0.9,
                weight: 2
            });
            marker.bindTooltip(`📍 ${wp.instruction} (${wp.dist_km} km)`, { sticky: true });
            this.routeLayerGroup.addLayer(marker);
        });

        const polyline = L.polyline(lineCoords, {
            color: color,
            weight: 4,
            dashArray: '8, 6',
            opacity: 0.95
        });
        this.routeLayerGroup.addLayer(polyline);

        this.routeLayerGroup.addTo(mapCtrl.map);
        mapCtrl.map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }

    // =========================================================================
    // NVIDIA BODY POSE 3D SKELETON & DETECTION
    // =========================================================================
    async toggleBodyPose() {
        this.bodyPoseActive = !this.bodyPoseActive;
        const hud = document.getElementById('body-pose-hud');
        const btn = document.getElementById('btn-toggle-body-pose');

        if (btn) btn.classList.toggle('active', this.bodyPoseActive);
        if (hud) hud.style.display = this.bodyPoseActive ? 'flex' : 'none';

        if (this.bodyPoseActive) {
            // Trigger detection
            try {
                const res = await fetch('/api/ai/body-pose', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ camera_id: 'mon02_current' })
                });
                if (res.ok) {
                    const data = await res.json();
                    this.lastPoseDetections = data.detections || [];
                    const badge = document.getElementById('pose-count-badge');
                    if (badge) badge.innerText = `${data.people_detected_count} Erkannt (NVIDIA NIM)`;
                    this.renderPoseOverlay();
                }
            } catch (e) {
                console.warn("[BodyPose] Error fetching detection:", e);
            }
        } else {
            this.clearPoseCanvas();
        }
    }

    renderPoseOverlay() {
        if (!this.bodyPoseActive || !this.lastPoseDetections) return;
        const canvas = document.getElementById('body-pose-canvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const W = canvas.width;
        const H = canvas.height;

        this.lastPoseDetections.forEach(p => {
            // 1. Draw Bounding Box (Kasten)
            if (this.bodyPoseLayers.kasten && p.bbox) {
                const bx = p.bbox.x * W;
                const by = p.bbox.y * H;
                const bw = p.bbox.w * W;
                const bh = p.bbox.h * H;

                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.strokeRect(bx, by, bw, bh);

                ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
                ctx.fillRect(bx, by - 18, 90, 18);
                ctx.fillStyle = '#000';
                ctx.font = 'bold 11px monospace';
                ctx.fillText(`PERSON ${Math.round(p.confidence * 100)}%`, bx + 4, by - 5);
            }

            // 2. Draw Skeleton Bones (Knochen)
            if (this.bodyPoseLayers.knochen && p.keypoints_3d) {
                const kp = p.keypoints_3d;
                const connections = [
                    ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
                    ['left_shoulder', 'right_shoulder'],
                    ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
                    ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
                    ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
                    ['left_hip', 'right_hip'],
                    ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
                    ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
                ];

                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 3;
                connections.forEach(([ptA, ptB]) => {
                    if (kp[ptA] && kp[ptB]) {
                        ctx.beginPath();
                        ctx.moveTo(kp[ptA][0] * W, kp[ptA][1] * H);
                        ctx.lineTo(kp[ptB][0] * W, kp[ptB][1] * H);
                        ctx.stroke();
                    }
                });

                // Keypoint joints
                ctx.fillStyle = '#ef4444';
                Object.values(kp).forEach(coord => {
                    ctx.beginPath();
                    ctx.arc(coord[0] * W, coord[1] * H, 4, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
        });
    }

    clearPoseCanvas() {
        const canvas = document.getElementById('body-pose-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.AiAssistant = new AiAssistantController();
});
