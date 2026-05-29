// Replay engine. Drives a tick clock that progressively reveals candles.
// Smoothly animates from one candle close to the next using requestAnimationFrame.

export class ReplayEngine {
  constructor({ onTick, onComplete }) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.candles = [];
    this.idx = 0;            // candles 0..idx-1 are fully revealed
    this.partial = 0;        // 0..1 progress through candle at idx
    this.speed = 1;
    this.running = false;
    this.candleMs = 1100;    // base time per candle at 1x
    this._lastT = 0;
    this._raf = null;
    this._frame = this._frame.bind(this);
  }

  load(candles) {
    this.candles = candles;
    this.idx = 0;
    this.partial = 0;
  }

  play() {
    if (this.running || this.candles.length === 0) return;
    this.running = true;
    this._lastT = performance.now();
    this._raf = requestAnimationFrame(this._frame);
  }
  pause() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }
  toggle() { this.running ? this.pause() : this.play(); }
  setSpeed(s) { this.speed = s; }
  restart() {
    this.pause();
    this.idx = 0;
    this.partial = 0;
    this.onTick && this.onTick({ idx: 0, partial: 0, current: this._currentPrice() });
  }
  seek(fraction) {
    fraction = Math.max(0, Math.min(1, fraction));
    const total = this.candles.length;
    const targetFloat = total * fraction;
    this.idx = Math.floor(targetFloat);
    this.partial = targetFloat - this.idx;
    if (this.idx >= total) { this.idx = total; this.partial = 0; }
    this.onTick && this.onTick({ idx: this.idx, partial: this.partial, current: this._currentPrice() });
  }

  _frame(now) {
    if (!this.running) return;
    const dt = now - this._lastT;
    this._lastT = now;
    const inc = (dt / this.candleMs) * this.speed;
    this.partial += inc;
    while (this.partial >= 1 && this.idx < this.candles.length) {
      this.idx += 1;
      this.partial -= 1;
    }
    if (this.idx >= this.candles.length) {
      this.idx = this.candles.length;
      this.partial = 0;
      this.running = false;
      this.onTick && this.onTick({ idx: this.idx, partial: 0, current: this._currentPrice() });
      this.onComplete && this.onComplete();
      return;
    }
    this.onTick && this.onTick({ idx: this.idx, partial: this.partial, current: this._currentPrice() });
    this._raf = requestAnimationFrame(this._frame);
  }

  _currentPrice() {
    if (this.candles.length === 0) return null;
    if (this.idx === 0 && this.partial === 0) return this.candles[0].o;
    const prev = this.candles[Math.max(0, this.idx - 1)];
    const next = this.candles[this.idx];
    if (!next) return prev.c;
    return prev.c + (next.c - prev.c) * this.partial;
  }
}
