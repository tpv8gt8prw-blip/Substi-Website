// AI-style coach. Inspects the trade log and the underlying market data
// to produce psychology-focused feedback.

export function analyzeSession({ trades, candles, startingBalance, finalBalance, ema }) {
  const n = trades.length;
  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl <= 0);
  const winRate = n ? wins.length / n : 0;
  const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : (grossWin > 0 ? Infinity : 0);
  const avgHold = n ? trades.reduce((s, t) => s + t.durationCandles, 0) / n : 0;
  const totalPnl = finalBalance - startingBalance;

  const notes = [];
  const lessons = [];

  // No trades
  if (n === 0) {
    notes.push({ kind: "info", text: "You didn't take any trades. Patience is a discipline — but so is pulling the trigger when your setup is there." });
    lessons.push("Define one specific setup. Then take it the next time it appears, even if it's small.");
    return summary({ notes, lessons, n, winRate, profitFactor, avgHold, totalPnl });
  }

  // Trade frequency
  const candleCount = candles.length;
  const tradesPerHundred = (n / candleCount) * 100;
  if (tradesPerHundred > 6) {
    notes.push({ kind: "warn", text: `You took ${n} trades in ${candleCount} candles — overtrading territory. Each click felt productive, but the edge dilutes fast.` });
    lessons.push("Cut your trade count in half. Wait for your A+ setups, not for something to happen.");
  } else if (tradesPerHundred < 1.5 && n < 3) {
    notes.push({ kind: "info", text: "Low activity. Hesitation is fine if it's selectivity — but check the chart for clean setups you ignored." });
  }

  // Win rate / profit factor
  if (n >= 3) {
    if (winRate < 0.35) {
      notes.push({ kind: "bad", text: `Win rate ${pct(winRate)} — most trades worked against you. Either entries are early, or you're fighting the trend.` });
    } else if (winRate > 0.65) {
      notes.push({ kind: "good", text: `Strong selectivity. You won ${pct(winRate)} of trades — keep that bar high.` });
    }
    if (profitFactor < 1 && totalPnl < 0) {
      notes.push({ kind: "bad", text: `Losses (${money(grossLoss)}) outpaced wins (${money(grossWin)}). Profit factor under 1 means the math is against you.` });
      lessons.push("Cut losers faster. Let winners run an extra leg before exiting.");
    }
  }

  // Trend alignment via EMA20
  const counterTrendCount = trades.filter(t => isCounterTrend(t, ema)).length;
  if (counterTrendCount / n > 0.5 && n >= 2) {
    notes.push({ kind: "warn", text: `${counterTrendCount} of ${n} trades fought the EMA20 trend. Counter-trend can work, but it requires sharper timing than you used.` });
    lessons.push("When price is below EMA20, default to short / wait. When above, default to long / wait.");
  }

  // Tight stops — measure distance vs. local volatility
  const tightStops = trades.filter(t => isTightStop(t, candles));
  if (tightStops.length / n >= 0.4 && tightStops.length >= 2) {
    notes.push({ kind: "warn", text: `Several stops were tighter than typical noise — you got wicked out before the move played out.` });
    lessons.push("Place stops beyond the most recent swing, not just inside the candle range.");
  }

  // Panic exits — closed manually as a loser, but price recovered shortly after
  const panic = trades.filter(t => isPanicExit(t, candles));
  if (panic.length >= 1) {
    notes.push({ kind: "bad", text: `On ${panic.length} trade${panic.length > 1 ? "s" : ""}, you closed in red — and the price reversed in your favor within a few candles.` });
    lessons.push("If the thesis hasn't broken, hand the decision to your stop, not your nerves.");
  }

  // Revenge trading — re-entered within 2 candles after a loser
  const revenge = countRevenge(trades);
  if (revenge >= 2) {
    notes.push({ kind: "bad", text: `Detected ${revenge} likely revenge trade${revenge > 1 ? "s" : ""}: you re-entered immediately after a loser. The market doesn't owe you anything.` });
    lessons.push("After a loss, walk to a 5-candle cooldown before placing the next trade.");
  }

  // Letting winners run vs cutting short
  const cutEarly = trades.filter(t => t.pnl > 0 && t.reason === "manual" && missedRun(t, candles)).length;
  if (cutEarly >= 1) {
    notes.push({ kind: "info", text: `${cutEarly} winning trade${cutEarly > 1 ? "s" : ""} closed early — price kept going your way after you exited.` });
    lessons.push("Use a trailing stop instead of a fixed take profit when momentum is clean.");
  }

  // Position size scaling
  const sizes = trades.map(t => t.qty);
  const sizeJump = sizes.some((s, i) => i > 0 && s / sizes[i-1] >= 2);
  if (sizeJump) {
    notes.push({ kind: "warn", text: "Position size jumped significantly between trades. Scaling up after a loss is the classic tilt signal." });
    lessons.push("Pick a unit size and stay there for the whole session. Promote size only across sessions.");
  }

  // Final outcome framing
  if (totalPnl > 0) {
    notes.push({ kind: "good", text: `Closed the session +${money(totalPnl)} (${pct(totalPnl / startingBalance)}). The chart didn't tell you the future — your process did.` });
  } else if (totalPnl < 0) {
    notes.push({ kind: "info", text: `Down ${money(Math.abs(totalPnl))} on the session. That's tuition. Now find the one decision you'd undo first — that's the lesson.` });
  } else {
    notes.push({ kind: "info", text: "Flat session. Sometimes that's the win." });
  }

  // Always end with at least one constructive lesson
  if (lessons.length === 0) {
    lessons.push("Write one sentence describing the setup you'd take again. Make it your only setup next session.");
  }

  return summary({ notes, lessons, n, winRate, profitFactor, avgHold, totalPnl });
}

function summary({ notes, lessons, n, winRate, profitFactor, avgHold, totalPnl }) {
  return {
    notes,
    lessons,
    metrics: {
      trades: n,
      winRate: n ? pct(winRate) : "—",
      profitFactor: isFinite(profitFactor) ? profitFactor.toFixed(2) : (n ? "∞" : "—"),
      avgHold: avgHold ? `${avgHold.toFixed(1)} c` : "—",
      pnl: money(totalPnl, true),
      pnlValue: totalPnl,
    },
  };
}

function isCounterTrend(t, ema) {
  const e = ema[t.openIdx];
  if (e == null) return false;
  if (t.dir === "LONG" && t.entry < e) return true;
  if (t.dir === "SHORT" && t.entry > e) return true;
  return false;
}

function isTightStop(t, candles) {
  if (t.sl == null) return false;
  // Local ATR-ish: avg candle range of ~10 prior candles
  const start = Math.max(0, t.openIdx - 10);
  const slice = candles.slice(start, t.openIdx);
  if (slice.length === 0) return false;
  const avgRange = slice.reduce((s, c) => s + (c.h - c.l), 0) / slice.length;
  const stopDist = Math.abs(t.entry - t.sl);
  return stopDist < avgRange * 0.6;
}

function isPanicExit(t, candles) {
  if (t.reason !== "manual" || t.pnl >= 0) return false;
  const lookahead = 5;
  const end = Math.min(candles.length - 1, t.exitIdx + lookahead);
  if (end <= t.exitIdx) return false;
  for (let i = t.exitIdx + 1; i <= end; i++) {
    const c = candles[i];
    if (t.dir === "LONG" && c.h >= t.entry) return true;
    if (t.dir === "SHORT" && c.l <= t.entry) return true;
  }
  return false;
}

function missedRun(t, candles) {
  const lookahead = 8;
  const end = Math.min(candles.length - 1, t.exitIdx + lookahead);
  if (end <= t.exitIdx) return false;
  const closedProfitDist = Math.abs(t.exit - t.entry);
  for (let i = t.exitIdx + 1; i <= end; i++) {
    const c = candles[i];
    if (t.dir === "LONG" && (c.h - t.entry) > closedProfitDist * 1.6) return true;
    if (t.dir === "SHORT" && (t.entry - c.l) > closedProfitDist * 1.6) return true;
  }
  return false;
}

function countRevenge(trades) {
  let count = 0;
  for (let i = 1; i < trades.length; i++) {
    const prev = trades[i - 1];
    const cur = trades[i];
    if (prev.pnl < 0 && cur.openIdx - prev.exitIdx <= 2) count++;
  }
  return count;
}

function pct(v) { return (v * 100).toFixed(0) + "%"; }
function money(v, signed = false) {
  const s = v < 0 ? "-" : (signed ? "+" : "");
  return s + "$" + Math.abs(v).toFixed(2);
}
