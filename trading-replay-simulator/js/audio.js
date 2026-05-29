// Minimal Web Audio synth. No assets, just clean tones for clicks, fills, wins, losses.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.master = null;
    this.ambient = null;
  }
  _ensure() {
    if (this.ctx) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.18;
      this.master.connect(this.ctx.destination);
    } catch { /* ignore */ }
  }
  resume() {
    this._ensure();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }
  setMuted(m) { this.muted = m; if (this.master) this.master.gain.value = m ? 0 : 0.18; }
  click() { this._tone({ freq: 720, dur: 0.05, type: "square", gain: 0.05 }); }
  buy()   { this._chord([520, 780], 0.18, "triangle", 0.08); }
  sell()  { this._chord([520, 360], 0.18, "triangle", 0.08); }
  win()   { this._chord([660, 880, 1180], 0.32, "sine", 0.1); }
  loss()  { this._chord([320, 220, 160], 0.32, "sawtooth", 0.06); }
  alert() { this._tone({ freq: 980, dur: 0.08, type: "square", gain: 0.05 }); }

  _tone({ freq, dur = 0.1, type = "sine", gain = 0.06 }) {
    if (this.muted) return;
    this._ensure(); if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  _chord(freqs, dur, type, gain) {
    freqs.forEach((f, i) => setTimeout(() => this._tone({ freq: f, dur, type, gain }), i * 60));
  }
}

export const audio = new AudioEngine();
