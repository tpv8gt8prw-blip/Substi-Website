// Canvas-based candlestick chart.
// - Draws all revealed candles
// - Animates the in-progress candle (open->close interpolation)
// - Renders EMA(20), grid, axes, position markers

export class Chart {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.candles = [];
    this.revealedTo = 0;          // index of last fully-revealed candle (exclusive)
    this.partialProgress = 0;     // 0..1 progress for in-progress candle
    this.ema = [];
    this.position = null;
    this.lastPrice = null;
    this.padding = { top: 18, right: 64, bottom: 28, left: 12 };
    this.layout = { x: 0, y: 0, w: 0, h: 0 };
    this.viewWindow = 90;          // visible candles on screen
    this.priceFormat = (v) => v.toFixed(4);
    this.lastFrame = 0;
    this.flash = null; // {color, t}
    this.crosshair = null;
    this._resize = this._resize.bind(this);
    this._render = this._render.bind(this);
    new ResizeObserver(this._resize).observe(canvas.parentElement);
    this._resize();
    requestAnimationFrame(this._render);
  }

  setData(candles) {
    this.candles = candles;
    this.revealedTo = 0;
    this.partialProgress = 0;
    this.ema = computeEMA(candles, 20);
  }

  setRevealed(count, partial = 0) {
    this.revealedTo = Math.max(0, Math.min(count, this.candles.length));
    this.partialProgress = Math.max(0, Math.min(1, partial));
    const c = this.candles[this.revealedTo - 1];
    if (c) {
      const next = this.candles[this.revealedTo];
      // interpolate live price as the partial reveals next candle
      if (next && this.partialProgress > 0) {
        const t = this.partialProgress;
        this.lastPrice = c.c + (next.c - c.c) * t;
      } else {
        this.lastPrice = c.c;
      }
    }
  }

  setPosition(pos) { this.position = pos; }

  flashScreen(color = "rgba(40,224,164,0.18)") {
    this.flash = { color, t: performance.now() };
  }

  setCrosshair(xy) { this.crosshair = xy; }

  _resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.floor(r.width * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(r.height * this.dpr));
    this.canvas.style.width = r.width + "px";
    this.canvas.style.height = r.height + "px";
    this.layout = {
      x: this.padding.left,
      y: this.padding.top,
      w: r.width - this.padding.left - this.padding.right,
      h: r.height - this.padding.top - this.padding.bottom,
    };
  }

  _render(now) {
    const ctx = this.ctx;
    const dpr = this.dpr;
    const { x, y, w, h } = this.layout;
    if (w <= 0 || h <= 0) { requestAnimationFrame(this._render); return; }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.candles.length === 0) {
      requestAnimationFrame(this._render);
      return;
    }

    // Visible window
    const total = this.revealedTo + (this.partialProgress > 0 ? 1 : 0);
    const view = Math.min(this.viewWindow, Math.max(20, total));
    const startIdx = Math.max(0, total - view);
    const endIdx = total; // exclusive

    // Compute y range from visible candles
    let lo = Infinity, hi = -Infinity;
    for (let i = startIdx; i < endIdx; i++) {
      const c = this.candles[i];
      if (i === endIdx - 1 && this.partialProgress > 0 && i < this.candles.length) {
        const partial = this._partialCandle(i);
        lo = Math.min(lo, partial.l);
        hi = Math.max(hi, partial.h);
      } else {
        lo = Math.min(lo, c.l);
        hi = Math.max(hi, c.h);
      }
    }
    if (!isFinite(lo) || !isFinite(hi)) { requestAnimationFrame(this._render); return; }
    const pad = (hi - lo) * 0.12 || 0.001;
    lo -= pad; hi += pad;

    const xFor = (i) => x + ((i - startIdx) / view) * w;
    const yFor = (p) => y + (1 - (p - lo) / (hi - lo)) * h;
    const candleW = (w / view) * 0.66;

    // Background grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.beginPath();
    const rows = 6;
    for (let r = 0; r <= rows; r++) {
      const yy = y + (h * r) / rows;
      ctx.moveTo(x, yy + 0.5);
      ctx.lineTo(x + w, yy + 0.5);
    }
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = "rgba(139,148,168,0.7)";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (let r = 0; r <= rows; r++) {
      const p = hi - ((hi - lo) * r) / rows;
      const yy = y + (h * r) / rows;
      ctx.fillText(this.priceFormat(p), x + w + 8, yy);
    }

    // EMA line (under candles)
    if (this.ema.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(106,169,255,0.7)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(106,169,255,0.5)";
      ctx.shadowBlur = 8;
      let started = false;
      for (let i = startIdx; i < endIdx; i++) {
        const e = this.ema[i];
        if (e == null) continue;
        let val = e;
        if (i === endIdx - 1 && this.partialProgress > 0) {
          // interpolate ema toward next ema with progress
          const next = this.ema[i + 1] ?? e;
          val = e + (next - e) * this.partialProgress;
        }
        const xx = xFor(i) + candleW / 2;
        const yy = yFor(val);
        if (!started) { ctx.moveTo(xx, yy); started = true; }
        else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Candles
    for (let i = startIdx; i < endIdx; i++) {
      let c = this.candles[i];
      if (i === endIdx - 1 && this.partialProgress > 0 && i < this.candles.length) {
        c = this._partialCandle(i);
      }
      const isBull = c.c >= c.o;
      const color = isBull ? "#28e0a4" : "#ff5773";
      const glow  = isBull ? "rgba(40,224,164,0.55)" : "rgba(255,87,115,0.55)";
      const cx = xFor(i);
      const oy = yFor(c.o);
      const cy = yFor(c.c);
      const hy = yFor(c.h);
      const ly = yFor(c.l);
      const top = Math.min(oy, cy);
      const bodyH = Math.max(1, Math.abs(cy - oy));

      ctx.shadowColor = glow;
      ctx.shadowBlur = i === endIdx - 1 ? 14 : 6;

      // wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + candleW / 2, hy);
      ctx.lineTo(cx + candleW / 2, ly);
      ctx.stroke();

      // body
      ctx.fillStyle = color;
      ctx.fillRect(cx, top, candleW, bodyH);
    }
    ctx.shadowBlur = 0;

    // Last price line + label
    if (this.lastPrice != null && total > 0) {
      const yy = yFor(this.lastPrice);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yy + 0.5);
      ctx.lineTo(x + w, yy + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      this._drawTag(ctx, x + w + 4, yy, this.priceFormat(this.lastPrice), "#0b1224", "#cfe1ff");
    }

    // Position markers
    if (this.position) {
      const p = this.position;
      const drawLine = (price, color, label) => {
        if (price == null) return;
        const yy = yFor(price);
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yy + 0.5);
        ctx.lineTo(x + w, yy + 0.5);
        ctx.stroke();
        ctx.setLineDash([]);
        this._drawTag(ctx, x + w + 4, yy, label, color, "#06121a");
      };
      const entryColor = p.dir === "LONG" ? "#28e0a4" : "#ff5773";
      drawLine(p.entry, entryColor, "ENTRY " + this.priceFormat(p.entry));
      if (p.sl != null) drawLine(p.sl, "#ff5773", "SL " + this.priceFormat(p.sl));
      if (p.tp != null) drawLine(p.tp, "#28e0a4", "TP " + this.priceFormat(p.tp));
    }

    // Crosshair (overlay handled in HTML/CSS, but draw subtle dot)
    if (this.crosshair) {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.arc(this.crosshair.x, this.crosshair.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flash overlay (trade fill effect)
    if (this.flash) {
      const elapsed = (now - this.flash.t) / 600;
      if (elapsed >= 1) {
        this.flash = null;
      } else {
        const a = (1 - elapsed) * 1;
        ctx.fillStyle = this.flash.color;
        ctx.globalAlpha = a;
        ctx.fillRect(0, 0, this.layout.w + this.padding.left + this.padding.right, this.layout.h + this.padding.top + this.padding.bottom);
        ctx.globalAlpha = 1;
      }
    }

    requestAnimationFrame(this._render);
  }

  _partialCandle(i) {
    const c = this.candles[i];
    const t = this.partialProgress;
    // Reveal candle progressively: from open price expanding toward the real OHLC.
    const cur_c = c.o + (c.c - c.o) * t;
    const cur_h = c.o + (c.h - c.o) * t;
    const cur_l = c.o + (c.l - c.o) * t;
    return {
      t: c.t, o: c.o,
      h: Math.max(c.o, cur_h, cur_c),
      l: Math.min(c.o, cur_l, cur_c),
      c: cur_c,
      v: c.v,
    };
  }

  _drawTag(ctx, x, y, text, fill, textColor) {
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const padX = 5, padY = 3;
    const tw = ctx.measureText(text).width;
    const w = tw + padX * 2, h = 16;
    ctx.fillStyle = fill;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y - h/2, w, h, 4);
    else ctx.rect(x, y - h/2, w, h);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText(text, x + padX, y);
  }
}

function computeEMA(candles, period) {
  const k = 2 / (period + 1);
  const out = new Array(candles.length).fill(null);
  let ema = null;
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i].c;
    if (i === 0) { ema = c; out[i] = ema; continue; }
    ema = c * k + ema * (1 - k);
    out[i] = ema;
  }
  return out;
}
