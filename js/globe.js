/**
 * CYBER-SPECTRE-NEXUS: 3D WebGL Earth Globe Controller
 * High-performance Three.js interactive planetary visualization.
 * Features:
 * - High-res NASA Blue Marble satellite sphere with specular reflection
 * - Semi-transparent rotating atmospheric cloud layer
 * - Atmospheric Fresnel / cyan edge glow
 * - Deep space starfield (1,200 stars)
 * - Smooth drag rotation with momentum inertia & mouse wheel zoom
 * - Real-time ISS orbit positioning and tracking marker
 * - Preset coordinate fly-to transitions (ISS, NYC, Tokyo, Alps, custom)
 */

class EarthGlobe3D {
    constructor(containerId = 'globe-3d-container', canvasId = 'globe-3d-canvas') {
        this.container = document.getElementById(containerId);
        this.canvas = document.getElementById(canvasId);
        if (!this.container || !this.canvas) {
            console.warn('[Globe3D] Container or canvas not found.');
            return;
        }

        if (typeof THREE === 'undefined') {
            console.error('[Globe3D] Three.js is not loaded.');
            return;
        }

        this.width = this.container.clientWidth || 400;
        this.height = this.container.clientHeight || 360;

        // Globe parameters
        this.earthRadius = 10;
        this.cameraDistance = 26;
        this.minDistance = 13.5;
        this.maxDistance = 50;

        // Interaction state
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotationVelocity = { x: 0, y: 0 };
        this.autoSpinSpeed = 0.0012;
        this.lastInteractionTime = Date.now();
        this.isTransitioning = false;
        this.transitionProgress = 1.0;
        this.transitionDuration = 1200; // ms
        this.transitionStartTime = 0;
        this.startRotation = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.startDistance = 26;
        this.targetDistance = 26;

        // Current target info
        this.currentTarget = 'GLOBAL ORBIT';
        this.currentLat = 0;
        this.currentLon = 0;

        // ISS state
        this.issCoords = { lat: 0, lon: 0, alt: 420 };
        this.issMarker = null;

        this.init();
    }

    init() {
        // 1. Scene
        this.scene = new THREE.Scene();

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.z = this.cameraDistance;

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.setSize(this.width, this.height);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        // 4. Globe Master Group
        this.globeGroup = new THREE.Group();
        this.scene.add(this.globeGroup);

        // Initial orientation (tilted slightly like real Earth 23.5 deg)
        this.globeGroup.rotation.z = THREE.MathUtils.degToRad(12);

        // 5. Lighting
        const ambientLight = new THREE.AmbientLight(0x334466, 0.75);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
        sunLight.position.set(40, 20, 30);
        this.scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
        fillLight.position.set(-30, -10, -20);
        this.scene.add(fillLight);

        // 6. Starfield Background
        this.createStarfield();

        // 7. Earth Sphere & Textures
        this.createEarthMesh();

        // 8. Cloud Layer
        this.createClouds();

        // 9. Atmospheric Glow Shell
        this.createAtmosphere();

        // 10. ISS Marker
        this.createISSMarker();

        // 11. Event Listeners
        this.setupEventListeners();

        // 12. Animation Loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        // Update initial HUD
        this.updateHUD('GLOBAL ORBIT', 0, 0);

        console.log('[Globe3D] Three.js Earth Globe initialized successfully.');
    }

    createStarfield() {
        const starCount = 1200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 160 + Math.random() * 80;

            const sinPhi = Math.sin(phi);
            positions[i * 3] = r * sinPhi * Math.cos(theta);
            positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const tint = Math.random();
            if (tint > 0.8) {
                colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 1.0;
            } else if (tint > 0.6) {
                colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.7;
            } else {
                colors[i * 3] = 0.95; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);
    }

    createEarthMesh() {
        const geometry = new THREE.SphereGeometry(this.earthRadius, 64, 64);
        
        // Procedural gradient fallback texture while image is downloading
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 512;
        fallbackCanvas.height = 256;
        const ctx = fallbackCanvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#0c1a30');
        grad.addColorStop(0.5, '#1e3a5f');
        grad.addColorStop(1, '#0c1a30');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 256);
        
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        for (let y = 0; y <= 256; y += 32) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
        }
        for (let x = 0; x <= 512; x += 32) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
        }

        const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);

        const material = new THREE.MeshPhongMaterial({
            map: fallbackTexture,
            specular: new THREE.Color(0x1e3a5f),
            shininess: 12
        });

        this.earthMesh = new THREE.Mesh(geometry, material);
        this.globeGroup.add(this.earthMesh);

        // Load realistic high-res satellite texture
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');

        const primaryUrl = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg';
        const fallbackUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg';

        loader.load(
            primaryUrl,
            (tex) => {
                tex.anisotropy = 8;
                material.map = tex;
                material.needsUpdate = true;
            },
            undefined,
            () => {
                console.warn('[Globe3D] Primary texture failed, trying CDN fallback...');
                loader.load(fallbackUrl, (tex) => {
                    tex.anisotropy = 8;
                    material.map = tex;
                    material.needsUpdate = true;
                });
            }
        );
    }

    createClouds() {
        const cloudGeom = new THREE.SphereGeometry(this.earthRadius + 0.12, 64, 64);
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.38,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
        this.globeGroup.add(this.cloudMesh);

        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_clouds_1024.png', (tex) => {
            cloudMat.map = tex;
            cloudMat.opacity = 0.45;
            cloudMat.needsUpdate = true;
        });
    }

    createAtmosphere() {
        const atmosGeom = new THREE.SphereGeometry(this.earthRadius + 0.38, 64, 64);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.atmosphereMesh = new THREE.Mesh(atmosGeom, atmosMat);
        this.scene.add(this.atmosphereMesh);
    }

    createISSMarker() {
        this.issGroup = new THREE.Group();

        const coreGeom = new THREE.SphereGeometry(0.3, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const core = new THREE.Mesh(coreGeom, coreMat);
        this.issGroup.add(core);

        const panelGeom = new THREE.BoxGeometry(1.2, 0.05, 0.4);
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
        const panels = new THREE.Mesh(panelGeom, panelMat);
        this.issGroup.add(panels);

        const haloGeom = new THREE.SphereGeometry(0.6, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({
            color: 0xef4444,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });
        const halo = new THREE.Mesh(haloGeom, haloMat);
        this.issGroup.add(halo);

        const ringGeom = new THREE.RingGeometry(0.7, 0.85, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2;
        this.issGroup.add(ring);

        this.updateISSMarkerPosition(0, 0);
        this.globeGroup.add(this.issGroup);
    }

    updateISSPosition(lat, lon, alt = 420) {
        this.issCoords = { lat, lon, alt };
        this.updateISSMarkerPosition(lat, lon);
    }

    updateISSMarkerPosition(lat, lon) {
        if (!this.issGroup) return;
        const r = this.earthRadius + 1.2;
        const pos = this.latLonToVector3(lat, lon, r);
        this.issGroup.position.copy(pos);
        this.issGroup.lookAt(0, 0, 0);
    }

    latLonToVector3(lat, lon, radius = this.earthRadius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
    }

    setupEventListeners() {
        this.canvas.addEventListener('pointerdown', (e) => {
            this.isDragging = true;
            this.canvas.style.cursor = 'grabbing';
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
            this.rotationVelocity = { x: 0, y: 0 };
            this.isTransitioning = false;
            this.lastInteractionTime = Date.now();
        });

        window.addEventListener('pointermove', (e) => {
            if (!this.isDragging) return;

            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;

            const sensitivity = 0.005;
            this.globeGroup.rotation.y += deltaX * sensitivity;
            this.globeGroup.rotation.x += deltaY * sensitivity;

            const maxTilt = Math.PI / 2.2;
            this.globeGroup.rotation.x = Math.max(-maxTilt, Math.min(maxTilt, this.globeGroup.rotation.x));

            this.rotationVelocity = {
                x: deltaY * sensitivity,
                y: deltaX * sensitivity
            };

            this.previousMousePosition = { x: e.clientX, y: e.clientY };
            this.lastInteractionTime = Date.now();
        });

        window.addEventListener('pointerup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.canvas.style.cursor = 'grab';
                this.lastInteractionTime = Date.now();
            }
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.05;
            this.cameraDistance += e.deltaY * zoomSpeed;
            this.cameraDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.cameraDistance));
            this.camera.position.z = this.cameraDistance;
            this.lastInteractionTime = Date.now();

            const zoomNorm = (1 - (this.cameraDistance - this.minDistance) / (this.maxDistance - this.minDistance)).toFixed(1);
            const zoomEl = document.getElementById('globe-target-zoom');
            if (zoomEl) zoomEl.innerText = `ZOOM: ${zoomNorm}X`;
        }, { passive: false });

        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                this.onResize();
            });
            ro.observe(this.container);
        } else {
            window.addEventListener('resize', () => this.onResize());
        }

        // Cached viewport visibility flag (checked every frame in animate())
        this.isGlobeVisible = true;
        if ('IntersectionObserver' in window) {
            this.visibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    this.isGlobeVisible = entry.isIntersecting;
                });
            }, { threshold: 0 });
            this.visibilityObserver.observe(this.container);
        }
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const w = this.container.clientWidth || 400;
        const h = this.container.clientHeight || 360;
        if (w === 0 || h === 0) return;

        this.width = w;
        this.height = h;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    rotateTo(lat, lon, label = 'TARGET FOCUS', targetDist = 17) {
        this.currentTarget = label;
        this.currentLat = lat;
        this.currentLon = lon;

        const radLat = THREE.MathUtils.degToRad(lat);
        const radLon = THREE.MathUtils.degToRad(lon);

        this.startRotation = {
            x: this.globeGroup.rotation.x,
            y: this.globeGroup.rotation.y
        };

        let targetY = -radLon - Math.PI / 2;
        while (targetY - this.startRotation.y > Math.PI) targetY -= Math.PI * 2;
        while (targetY - this.startRotation.y < -Math.PI) targetY += Math.PI * 2;

        this.targetRotation = {
            x: radLat,
            y: targetY
        };

        this.startDistance = this.camera.position.z;
        this.targetDistance = targetDist;

        this.isTransitioning = true;
        this.transitionStartTime = Date.now();
        this.lastInteractionTime = Date.now() + 5000;

        this.updateHUD(label, lat, lon);
    }

    async rotateToISS() {
        try {
            const res = await fetch('/api/telemetry/iss');
            if (res.ok) {
                const data = await res.json();
                const lat = data.latitude !== undefined ? data.latitude : 0;
                const lon = data.longitude !== undefined ? data.longitude : 0;
                const alt = data.altitude_km || 420;
                const vel = data.velocity_kmh || 27600;

                this.updateISSPosition(lat, lon, alt);
                this.rotateTo(lat, lon, 'ISS ORBITAL INTERCEPT', 19);

                const bannerLeft = document.getElementById('gearth-telemetry-left');
                const bannerRight = document.getElementById('gearth-telemetry-right');
                if (bannerLeft) bannerLeft.innerText = `ISS ORBIT // LAT ${lat.toFixed(2)}° LON ${lon.toFixed(2)}°`;
                if (bannerRight) bannerRight.innerText = `ALT: ${alt} KM // VELOCITY: ${vel.toLocaleString()} KM/H`;
                return;
            }
        } catch (e) {
            console.warn('[Globe3D] ISS fetch failed, using fallback:', e);
        }

        this.rotateTo(this.issCoords.lat, this.issCoords.lon, 'ISS ORBITAL POSITION', 19);
    }

    updateHUD(label, lat, lon) {
        const nameEl = document.getElementById('globe-target-name');
        const coordsEl = document.getElementById('globe-target-coords');
        const bannerLeft = document.getElementById('gearth-telemetry-left');
        const bannerRight = document.getElementById('gearth-telemetry-right');

        const latStr = lat >= 0 ? `${lat.toFixed(2)}°N` : `${Math.abs(lat).toFixed(2)}°S`;
        const lonStr = lon >= 0 ? `${lon.toFixed(2)}°E` : `${Math.abs(lon).toFixed(2)}°W`;

        if (nameEl) nameEl.innerText = `TARGET: ${label.toUpperCase()}`;
        if (coordsEl) coordsEl.innerText = `${latStr} / ${lonStr}`;

        if (bannerLeft) bannerLeft.innerText = `3D MESH // ${label.toUpperCase()}`;
        if (bannerRight) bannerRight.innerText = `COORDS: ${latStr}, ${lonStr} // PHOTOREALISTIC SPHERE`;
    }

    animate() {
        requestAnimationFrame(this.animate);

        // High-performance visibility check: 0% GPU / WebGL cost when off-screen.
        // Uses a cached IntersectionObserver flag instead of forcing a layout
        // reflow with getBoundingClientRect() on every single frame.
        if (document.hidden || !this.isGlobeVisible) {
            return;
        }

        const now = Date.now();

        if (this.isTransitioning) {
            const elapsed = now - this.transitionStartTime;
            const progress = Math.min(1.0, elapsed / this.transitionDuration);

            const ease = 1 - Math.pow(1 - progress, 3);

            this.globeGroup.rotation.x = THREE.MathUtils.lerp(this.startRotation.x, this.targetRotation.x, ease);
            this.globeGroup.rotation.y = THREE.MathUtils.lerp(this.startRotation.y, this.targetRotation.y, ease);
            this.camera.position.z = THREE.MathUtils.lerp(this.startDistance, this.targetDistance, ease);
            this.cameraDistance = this.camera.position.z;

            if (progress >= 1.0) {
                this.isTransitioning = false;
            }
        } else if (!this.isDragging) {
            this.globeGroup.rotation.y += this.rotationVelocity.y;
            this.globeGroup.rotation.x += this.rotationVelocity.x;
            this.rotationVelocity.x *= 0.92;
            this.rotationVelocity.y *= 0.92;

            if (now - this.lastInteractionTime > 2500) {
                this.globeGroup.rotation.y += this.autoSpinSpeed;
            }
        }

        if (this.cloudMesh) {
            this.cloudMesh.rotation.y += 0.0004;
        }

        if (this.issGroup) {
            const pulse = 1.0 + Math.sin(now * 0.005) * 0.2;
            this.issGroup.scale.set(pulse, pulse, pulse);
        }

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.animId) cancelAnimationFrame(this.animId);
        if (this.observer) this.observer.disconnect();

        if (this.scene) {
            this.scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(m => {
                            if (m.map) m.map.dispose();
                            m.dispose();
                        });
                    } else {
                        if (obj.material.map) obj.material.map.dispose();
                        obj.material.dispose();
                    }
                }
            });
        }
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
    }
}

window.EarthGlobe3D = EarthGlobe3D;
