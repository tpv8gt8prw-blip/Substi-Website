// Trading engine. Single-position model (one open position at a time).
// Tracks balance, equity, P/L, and a complete trade log used by the coach.

export class TradingEngine {
  constructor({ startingBalance = 10000, onChange }) {
    this.startingBalance = startingBalance;
    this.balance = startingBalance;
    this.position = null;     // { dir, entry, qty, sl, tp, openIdx, openPrice, openCandleC, peak, trough }
    this.trades = [];         // closed trades
    this.onChange = onChange;
    this.lastPrice = null;
    this.currentIdx = 0;
  }

  setMarket(price, idx) {
    this.lastPrice = price;
    this.currentIdx = idx;
    if (this.position) {
      this.position.peak = Math.max(this.position.peak, price);
      this.position.trough = Math.min(this.position.trough, price);
      // SL / TP checks
      const p = this.position;
      if (p.dir === "LONG") {
        if (p.sl != null && price <= p.sl) return this.close({ reason: "stop", priceOverride: p.sl });
        if (p.tp != null && price >= p.tp) return this.close({ reason: "target", priceOverride: p.tp });
      } else {
        if (p.sl != null && price >= p.sl) return this.close({ reason: "stop", priceOverride: p.sl });
        if (p.tp != null && price <= p.tp) return this.close({ reason: "target", priceOverride: p.tp });
      }
    }
    this._emit();
    return null;
  }

  open({ dir, qty, sl, tp }) {
    if (this.position) return { error: "Position already open" };
    if (this.lastPrice == null) return { error: "Market not ready" };
    if (qty <= 0) return { error: "Invalid size" };
    const entry = this.lastPrice;
    if (sl != null) {
      if (dir === "LONG" && sl >= entry) return { error: "Stop loss must be below entry for a long" };
      if (dir === "SHORT" && sl <= entry) return { error: "Stop loss must be above entry for a short" };
    }
    if (tp != null) {
      if (dir === "LONG" && tp <= entry) return { error: "Take profit must be above entry for a long" };
      if (dir === "SHORT" && tp >= entry) return { error: "Take profit must be below entry for a short" };
    }
    this.position = {
      dir, entry, qty, sl, tp,
      openIdx: this.currentIdx,
      openTime: Date.now(),
      peak: entry, trough: entry,
    };
    this._emit();
    return { position: this.position };
  }

  openPnl() {
    if (!this.position || this.lastPrice == null) return 0;
    const p = this.position;
    const diff = p.dir === "LONG" ? (this.lastPrice - p.entry) : (p.entry - this.lastPrice);
    return diff * p.qty;
  }

  equity() { return this.balance + this.openPnl(); }

  close({ reason = "manual", priceOverride } = {}) {
    if (!this.position) return null;
    const exit = priceOverride ?? this.lastPrice;
    const p = this.position;
    const pnl = (p.dir === "LONG" ? (exit - p.entry) : (p.entry - exit)) * p.qty;
    this.balance += pnl;
    const trade = {
      ...p,
      exit,
      exitIdx: this.currentIdx,
      pnl,
      reason,
      durationCandles: Math.max(1, this.currentIdx - p.openIdx),
    };
    this.trades.push(trade);
    this.position = null;
    this._emit();
    return trade;
  }

  _emit() { this.onChange && this.onChange(this); }
}
