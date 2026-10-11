class AudioEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    _playTone(freq, type, duration, volLevel) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(volLevel, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playClick() {
        this._playTone(800, 'square', 0.1, 0.1);
    }

    playPing() {
        this._playTone(1200, 'sine', 0.5, 0.2);
    }

    playSiren() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.5);
        osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 1.0);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.0);
    }

    playTelemetry() {
        this._playTone(2000, 'square', 0.05, 0.05);
    }

    // Alias used by the RAM cleaner telemetry events
    playTelemetryChirp() {
        this.playTelemetry();
    }

    playStreamConnect() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.15);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // Authentic FCC Emergency Alert System (EAS) Dual-Tone Siren: 853 Hz + 960 Hz
    playEASAlert(duration = 2.5) {
        if (!this.enabled) return;
        try {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            const now = this.ctx.currentTime;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(853, now); // FCC EAS Tone 1

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(960, now); // FCC EAS Tone 2

            // Attention signal amplitude envelope
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.35, now + 0.05);
            gainNode.gain.setValueAtTime(0.35, now + duration - 0.05);
            gainNode.gain.linearRampToValueAtTime(0, now + duration);

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(this.ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + duration);
            osc2.stop(now + duration);

            this.activeEASGain = gainNode;
        } catch (e) {
            console.warn('[AudioEngine] EAS play error:', e);
        }
    }

    // Procedural Mechanical Outdoor Warning Tornado Siren (Wail cycle)
    playTornadoSiren(duration = 5.0) {
        if (!this.enabled) return;
        try {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.3, now + 0.3);

            // Cycle pitch: 440 Hz -> 780 Hz -> 460 Hz -> 820 Hz
            let t = now;
            const cycleTime = 1.4;
            const cycles = Math.ceil(duration / cycleTime);
            osc.frequency.setValueAtTime(420, t);

            for (let i = 0; i < cycles; i++) {
                osc.frequency.linearRampToValueAtTime(800, t + (cycleTime * 0.5));
                osc.frequency.linearRampToValueAtTime(440, t + cycleTime);
                t += cycleTime;
            }

            gain.gain.setValueAtTime(0.3, now + duration - 0.5);
            gain.gain.linearRampToValueAtTime(0, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            console.warn('[AudioEngine] Siren play error:', e);
        }
    }

    // =========================================================================
    // 3-PHASE 30-SECOND STORM ALARM & CONTINUOUS AMBIENT LOOP
    // Phase 1 (0-10s):  Authentic NOAA EAS Dual-Tone (853 Hz + 960 Hz)
    // Phase 2 (10-20s): Classic Mechanical Tornado Siren Wail (440 - 820 Hz)
    // Phase 3 (20-30s): High-Urgency +20% Louder Fast Warble Siren
    // Post-30s:         Lower-volume ambient alert loop until silenced
    // =========================================================================
    stopAlarm() {
        this.alarmActive = false;
        if (this.alarmPhaseTimer) {
            clearTimeout(this.alarmPhaseTimer);
            this.alarmPhaseTimer = null;
        }
        if (this.alarmLoopTimer) {
            clearInterval(this.alarmLoopTimer);
            this.alarmLoopTimer = null;
        }
        if (this.activeAlarmOscs) {
            const now = this.ctx.currentTime;
            this.activeAlarmOscs.forEach(item => {
                try {
                    if (item.gain) {
                        item.gain.gain.cancelScheduledValues(now);
                        item.gain.gain.linearRampToValueAtTime(0.0001, now + 0.15);
                    }
                    if (item.osc) {
                        item.osc.stop(now + 0.2);
                    }
                } catch (e) {}
            });
            this.activeAlarmOscs = [];
        }
    }

    playTacticalStormAlarm() {
        if (!this.enabled) return;
        this.stopAlarm();
        this.alarmActive = true;
        this.activeAlarmOscs = [];

        try {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (e) {}

        const runPhase1 = () => {
            if (!this.alarmActive) return;
            // PHASE 1 (0 - 10s): NOAA EAS Dual-Tone (853 Hz + 960 Hz)
            const now = this.ctx.currentTime;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(853, now);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(960, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
            gain.gain.setValueAtTime(0.35, now + 9.8);
            gain.gain.linearRampToValueAtTime(0, now + 10.0);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 10.0);
            osc2.stop(now + 10.0);

            this.activeAlarmOscs.push({ osc: osc1, gain }, { osc: osc2, gain });

            this.alarmPhaseTimer = setTimeout(() => {
                if (this.alarmActive) runPhase2();
            }, 10000);
        };

        const runPhase2 = () => {
            if (!this.alarmActive) return;
            // PHASE 2 (10 - 20s): Classic Outdoor Tornado Wailing Siren (440 - 820 Hz sweep)
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.3);

            let t = now;
            const cycleDuration = 2.0; // 5 full sweeps across 10 seconds
            for (let i = 0; i < 5; i++) {
                osc.frequency.setValueAtTime(440, t);
                osc.frequency.linearRampToValueAtTime(820, t + 1.0);
                osc.frequency.linearRampToValueAtTime(440, t + 2.0);
                t += cycleDuration;
            }

            gain.gain.setValueAtTime(0.35, now + 9.7);
            gain.gain.linearRampToValueAtTime(0, now + 10.0);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 10.0);

            this.activeAlarmOscs.push({ osc, gain });

            this.alarmPhaseTimer = setTimeout(() => {
                if (this.alarmActive) runPhase3();
            }, 10000);
        };

        const runPhase3 = () => {
            if (!this.alarmActive) return;
            // PHASE 3 (20 - 30s): Louder (+20% -> 0.45), Urgent Fast Warble Siren
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const oscHarmonic = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            oscHarmonic.type = 'square';

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.44, now + 0.15); // +20% louder

            // Fast high-pitch emergency warble (0.4s cycles)
            let t = now;
            const warbleCycle = 0.4;
            const cycles = Math.floor(10.0 / warbleCycle);
            for (let i = 0; i < cycles; i++) {
                osc.frequency.setValueAtTime(650, t);
                osc.frequency.linearRampToValueAtTime(1050, t + (warbleCycle * 0.5));
                osc.frequency.linearRampToValueAtTime(650, t + warbleCycle);

                oscHarmonic.frequency.setValueAtTime(1300, t);
                oscHarmonic.frequency.linearRampToValueAtTime(2100, t + (warbleCycle * 0.5));
                oscHarmonic.frequency.linearRampToValueAtTime(1300, t + warbleCycle);
                t += warbleCycle;
            }

            gain.gain.setValueAtTime(0.44, now + 9.8);
            gain.gain.linearRampToValueAtTime(0, now + 10.0);

            const harmGain = this.ctx.createGain();
            harmGain.gain.setValueAtTime(0.12, now);
            oscHarmonic.connect(harmGain);
            harmGain.connect(gain);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            oscHarmonic.start(now);
            osc.stop(now + 10.0);
            oscHarmonic.stop(now + 10.0);

            this.activeAlarmOscs.push({ osc, gain }, { osc: oscHarmonic, gain: harmGain });

            this.alarmPhaseTimer = setTimeout(() => {
                if (this.alarmActive) runPostLoop();
            }, 10000);
        };

        const runPostLoop = () => {
            if (!this.alarmActive) return;
            // POST-30s: Gentle, quiet looping ambient alert sound (plays until silenced)
            const playPulse = () => {
                if (!this.alarmActive) return;
                try {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(520, now);
                    osc.frequency.linearRampToValueAtTime(660, now + 0.4);
                    osc.frequency.linearRampToValueAtTime(520, now + 0.8);

                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.12, now + 0.2); // Gentle 12% volume
                    gain.gain.linearRampToValueAtTime(0, now + 1.2);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + 1.2);
                } catch (e) {}
            };

            playPulse();
            this.alarmLoopTimer = setInterval(playPulse, 2600);
        };

        runPhase1();
    }
}

window.CyberAudio = new AudioEngine();

// Auto-wire silence button to immediately terminate alarm
document.addEventListener('DOMContentLoaded', () => {
    const silenceBtn = document.getElementById('btn-alarm-silence');
    if (silenceBtn) {
        silenceBtn.addEventListener('click', () => {
            if (window.CyberAudio) {
                window.CyberAudio.stopAlarm();
            }
        });
    }
});
