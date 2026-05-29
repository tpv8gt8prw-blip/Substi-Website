// Market simulation engine.
//
// This is not a regime-tape replay. It's a stochastic price process built from
// several independent forces that interact:
//
//   - a hidden Markov regime sampler with state-dependent transition odds
//   - momentum memory (persistent, decays, can flip)
//   - GARCH-style volatility clustering (calm begets calm, shock begets shock)
//   - heavy-tailed noise (occasional fat-tail jumps, not Gaussian)
//   - liquidity map (swing highs/lows are tracked; stop-hunts target them)
//   - exhaustion pressure (long trends raise reversal odds non-linearly)
//   - event injector (fake breakouts, trap candles, panic flushes, squeezes)
//   - emotional candle shaper (body/wick ratio depends on current micro-state)
//
// Output shape (kept compatible with the rest of the app):
//   { symbol, interval, name, seed, candles: [{ t, o, h, l, c, v }] }

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── randomness primitives ────────────────────────────────────────────────

function makeRng(seed) {
  const u = mulberry32(seed);
  let spare = null;
  // Standard normal via Box–Muller, cached pair.
  function gauss() {
    if (spare !== null) { const v = spare; spare = null; return v; }
    let a = u(), b = u();
    if (a < 1e-12) a = 1e-12;
    const r = Math.sqrt(-2 * Math.log(a));
    const th = 2 * Math.PI * b;
    spare = r * Math.sin(th);
    return r * Math.cos(th);
  }
  // Heavy-tailed: gaussian / sqrt(chi2/df) — Student-t-ish. df≈4 gives fat tails
  // but not so fat that the chart looks broken.
  function tdist(df = 4) {
    let s = 0;
    for (let i = 0; i < df; i++) { const g = gauss(); s += g * g; }
    const chi = Math.max(s / df, 1e-6);
    return gauss() / Math.sqrt(chi);
  }
  function range(lo, hi) { return lo + u() * (hi - lo); }
  function pick(arr) { return arr[Math.floor(u() * arr.length)]; }
  function chance(p) { return u() < p; }
  return { u, gauss, tdist, range, pick, chance };
}

// ─── regime definitions ───────────────────────────────────────────────────
//
// Each regime is a *bias* applied on top of the stochastic core. They're not
// played in a fixed sequence — a Markov sampler picks the next one based on
// the current one. Drift/vol are sampled per-visit so the same regime never
// feels the same twice.

const REGIMES = {
  drift:        { driftLo: -0.00010, driftHi:  0.00010, volMul: 0.85, mr: 0.35, dwellLo: 14, dwellHi: 42 },
  accumulation: { driftLo: -0.00012, driftHi:  0.00018, volMul: 0.55, mr: 0.70, dwellLo: 16, dwellHi: 36 },
  distribution: { driftLo: -0.00018, driftHi:  0.00012, volMul: 0.60, mr: 0.65, dwellLo: 16, dwellHi: 36 },
  markup:       { driftLo:  0.00040, driftHi:  0.00090, volMul: 1.05, mr: 0.15, dwellLo: 10, dwellHi: 32 },
  markdown:     { driftLo: -0.00090, driftHi: -0.00040, volMul: 1.10, mr: 0.15, dwellLo: 10, dwellHi: 32 },
  volatile:     { driftLo: -0.00020, driftHi:  0.00020, volMul: 1.85, mr: 0.10, dwellLo:  6, dwellHi: 18 },
  squeeze:      { driftLo: -0.00006, driftHi:  0.00006, volMul: 0.35, mr: 0.80, dwellLo: 12, dwellHi: 28 },
  blowoff:      { driftLo:  0.00080, driftHi:  0.00170, volMul: 1.60, mr: 0.05, dwellLo:  4, dwellHi: 12 },
  capitulation: { driftLo: -0.00170, driftHi: -0.00080, volMul: 1.75, mr: 0.05, dwellLo:  4, dwellHi: 12 },
  rotation:     { driftLo: -0.00050, driftHi:  0.00050, volMul: 1.20, mr: 0.30, dwellLo:  8, dwellHi: 20 },
};

// Transition weights from -> {to: weight}. Unlisted destinations get a tiny
// floor so anything *can* happen, just rarely. The matrix is intentionally
// asymmetric — e.g. blowoffs love to roll into distribution or capitulation,
// squeezes love to release into markup/markdown/volatile.
const TRANSITIONS = {
  drift:        { drift: 3, accumulation: 2, distribution: 2, squeeze: 2, volatile: 1, markup: 1.5, markdown: 1.5, rotation: 1 },
  accumulation: { accumulation: 2, markup: 3, drift: 1.5, squeeze: 1.5, distribution: 0.5, volatile: 0.7 },
  distribution: { distribution: 2, markdown: 3, drift: 1.5, squeeze: 1.5, accumulation: 0.5, volatile: 0.7 },
  markup:       { markup: 3, blowoff: 1.2, distribution: 2, rotation: 1.5, volatile: 1, drift: 1, markdown: 0.4 },
  markdown:     { markdown: 3, capitulation: 1.2, accumulation: 2, rotation: 1.5, volatile: 1, drift: 1, markup: 0.4 },
  volatile:     { volatile: 1.5, rotation: 2, drift: 1.5, markup: 1.2, markdown: 1.2, squeeze: 0.5 },
  squeeze:      { squeeze: 2, markup: 2.2, markdown: 2.2, volatile: 1.5, drift: 1 },
  blowoff:      { distribution: 3, capitulation: 1.5, volatile: 2, rotation: 1, markdown: 1.5, markup: 0.5 },
  capitulation: { accumulation: 3, blowoff: 0.4, volatile: 2, rotation: 1, markup: 1.5, markdown: 0.5 },
  rotation:     { rotation: 1, drift: 1.5, accumulation: 1.5, distribution: 1.5, volatile: 1.5, markup: 1, markdown: 1 },
};

function sampleNextRegime(current, rng) {
  const row = TRANSITIONS[current] || {};
  const keys = Object.keys(REGIMES);
  let total = 0;
  const w = {};
  for (const k of keys) { const v = (row[k] ?? 0) + 0.05; w[k] = v; total += v; }
  let r = rng.u() * total;
  for (const k of keys) { r -= w[k]; if (r <= 0) return k; }
  return current;
}

// ─── chart label — describes the *shape*, not a script ────────────────────

const FLAVOR = [
  "Restless tape",
  "Liquidity hunt",
  "Trap and reverse",
  "Slow grind, sudden break",
  "Two-sided chop",
  "Squeeze release",
  "Failed breakout",
  "Stop-run rotation",
  "Drift then panic",
  "Hidden accumulation",
  "Late-session flush",
  "Indecision break",
];

// ─── main engine ──────────────────────────────────────────────────────────

export function generateScenario({
  candles = 240,
  basePrice = 1.0825,
  seed = Math.floor(Math.random() * 1e9),
  tickMs = 900,
} = {}) {
  const rng = makeRng(seed);
  const name = FLAVOR[Math.floor(rng.u() * FLAVOR.length)];

  // base scale of the instrument — keeps drift/vol numbers comparable across
  // any basePrice the host passes in.
  const scale = basePrice;

  // ── persistent simulation state ──────────────────────────────────────────
  let price = basePrice;
  let regime = rng.pick(["drift", "accumulation", "distribution", "squeeze", "rotation"]);
  let regimeParams = sampleRegimeParams(regime, rng);
  let dwell = Math.floor(rng.range(regimeParams.dwellLo, regimeParams.dwellHi));
  let regimeAge = 0;

  // GARCH-ish volatility: sigma2[t] = omega + a*shock2[t-1] + b*sigma2[t-1]
  let sigma2 = sq(0.0011 * scale);
  let lastShock = 0;
  const omega = sq(0.00045 * scale);
  const alpha = 0.18;
  const beta  = 0.78;

  // momentum memory: a "true direction" the market wants to keep going
  let momentum = 0;            // signed, in price units
  const momDecay = 0.84;

  // exhaustion: increases when the market trends in one direction; raises
  // reversal probability and softens drift over time.
  let exhaust = 0;             // 0..~1

  // mean reversion anchor — slow EMA of price
  let anchor = price;
  const anchorAlpha = 0.04;

  // liquidity map — recent swing highs/lows the engine "remembers" and
  // occasionally targets with a stop hunt.
  const liquidity = { highs: [], lows: [] };
  let swingHi = price, swingLo = price, sinceSwing = 0;

  // event cooldowns so we don't fire two shocks back-to-back
  let cdShock = 8;
  let cdHunt  = 12;
  let cdTrap  = 14;

  // candle buffer
  const out = [];
  let t = Date.now() - candles * tickMs * 60;

  for (let i = 0; i < candles; i++) {
    // ─ regime transition ─
    regimeAge++;
    if (regimeAge >= dwell || rng.chance(0.015 + exhaust * 0.06)) {
      const prevRegime = regime;
      regime = sampleNextRegime(prevRegime, rng);
      regimeParams = sampleRegimeParams(regime, rng);
      dwell = Math.floor(rng.range(regimeParams.dwellLo, regimeParams.dwellHi));
      regimeAge = 0;
      // a regime flip partially resets exhaustion and bumps vol slightly
      exhaust *= 0.4;
      sigma2 *= 1 + rng.u() * 0.35;
    }

    // ─ volatility update (GARCH-ish) ─
    sigma2 = omega + alpha * sq(lastShock) + beta * sigma2;
    let sigma = Math.sqrt(sigma2) * regimeParams.volMul;
    // slow breathing of vol (intraday-like ebb/flow)
    sigma *= 0.85 + 0.3 * Math.sin(i * 0.07 + seed * 0.0001) + 0.15 * rng.u();

    // ─ base drift this candle ─
    let drift = regimeParams.drift * scale;

    // ─ momentum memory: amplify drift in its direction, decay each candle ─
    drift += momentum * 0.35;
    momentum *= momDecay;

    // ─ mean reversion pull toward the slow anchor (regime-weighted) ─
    const mrPull = (anchor - price) * regimeParams.mr * 0.18;
    drift += mrPull;

    // ─ exhaustion drag: trends that have gone too far start to slow down ─
    if (Math.sign(drift) !== 0) {
      drift -= Math.sign(drift) * exhaust * 0.0008 * scale;
    }

    // ─ noise: heavy-tailed, scaled by current vol ─
    let shock = rng.tdist(4) * sigma;

    // ─ event injector ─────────────────────────────────────────────────────
    let eventTag = null;
    cdShock--; cdHunt--; cdTrap--;

    // 1) Liquidity grab / stop hunt — pierce a known swing then snap back
    if (cdHunt <= 0 && liquidity.highs.length + liquidity.lows.length > 0 && rng.chance(0.06 + exhaust * 0.08)) {
      const hunting = pickHuntTarget(price, liquidity, rng);
      if (hunting) {
        const overshoot = sigma * rng.range(1.8, 3.4);
        const target = hunting.level + Math.sign(hunting.level - price) * overshoot * 0.15;
        // push price toward the target this candle, then queue a reversal impulse
        const toward = (target - price);
        shock = toward * rng.range(0.7, 1.1) + rng.tdist(4) * sigma * 0.4;
        momentum = -Math.sign(toward) * Math.abs(toward) * rng.range(0.35, 0.6);
        eventTag = "hunt";
        cdHunt = Math.floor(rng.range(10, 22));
      }
    }

    // 2) Fake breakout / trap candle — strong move in regime direction that
    //    fully retraces. Only meaningful in trending regimes.
    if (!eventTag && cdTrap <= 0 && (regime === "markup" || regime === "markdown") && rng.chance(0.05)) {
      const dir = regime === "markup" ? 1 : -1;
      shock = dir * sigma * rng.range(2.2, 3.6);
      // pre-load a counter momentum so the *next* candle starts to reverse
      momentum = -dir * sigma * rng.range(1.0, 1.8);
      exhaust = Math.min(1, exhaust + 0.25);
      eventTag = "trap";
      cdTrap = Math.floor(rng.range(14, 28));
    }

    // 3) Pure volatility shock — fat-tail spike, regime-agnostic, rare
    if (!eventTag && cdShock <= 0 && rng.chance(0.025)) {
      const dir = rng.chance(0.5) ? 1 : -1;
      shock += dir * sigma * rng.range(3.0, 5.5);
      momentum += dir * sigma * rng.range(0.4, 1.0);
      sigma2 *= 1.6;
      eventTag = "shock";
      cdShock = Math.floor(rng.range(8, 22));
    }

    // 4) Squeeze release — squeeze regimes occasionally erupt
    if (!eventTag && regime === "squeeze" && regimeAge > dwell * 0.6 && rng.chance(0.08)) {
      const dir = rng.chance(0.5) ? 1 : -1;
      shock += dir * sigma * rng.range(2.4, 4.2);
      momentum += dir * sigma * rng.range(0.8, 1.5);
      eventTag = "release";
      // force the next regime to pick a directional one
      regime = dir > 0 ? "markup" : "markdown";
      regimeParams = sampleRegimeParams(regime, rng);
      dwell = Math.floor(rng.range(regimeParams.dwellLo, regimeParams.dwellHi));
      regimeAge = 0;
    }

    // ─ candle assembly ─
    const open = price;
    let close = open + drift + shock;
    // a soft, non-zero floor so weird seeds can't drag the price negative
    if (close < scale * 0.02) close = scale * 0.02;

    // wicks: their length is a function of regime, event, and rng — not a
    // fixed multiple of body. This is what kills the "identical candle" look.
    const body = close - open;
    const baseWick = sigma * rng.range(0.4, 1.6);
    let wickUp, wickDn;

    if (eventTag === "hunt") {
      // huge wick on the hunt side, small wick on the rebound side
      const dir = Math.sign(shock) || 1;
      const longWick = sigma * rng.range(1.6, 3.0);
      const shortWick = sigma * rng.range(0.1, 0.5);
      wickUp = dir > 0 ? longWick : shortWick;
      wickDn = dir > 0 ? shortWick : longWick;
    } else if (eventTag === "trap") {
      // body and wick both extend the trap direction
      wickUp = baseWick * (body > 0 ? rng.range(1.2, 2.2) : rng.range(0.2, 0.7));
      wickDn = baseWick * (body < 0 ? rng.range(1.2, 2.2) : rng.range(0.2, 0.7));
    } else if (regime === "volatile" || eventTag === "shock") {
      wickUp = baseWick * rng.range(0.8, 2.4);
      wickDn = baseWick * rng.range(0.8, 2.4);
    } else if (regime === "squeeze") {
      wickUp = baseWick * rng.range(0.1, 0.5);
      wickDn = baseWick * rng.range(0.1, 0.5);
    } else {
      // normal candles: wicks lean against the body more often than with it,
      // which is what you actually see on real charts (rejection wicks).
      const withBody = rng.range(0.15, 0.9);
      const against  = rng.range(0.25, 1.4);
      if (body >= 0) { wickUp = baseWick * withBody; wickDn = baseWick * against; }
      else           { wickUp = baseWick * against;  wickDn = baseWick * withBody; }
    }

    // occasional doji / inside / outside structure
    if (rng.chance(0.04)) {
      close = open + (close - open) * rng.range(-0.15, 0.15);
      wickUp *= rng.range(1.2, 2.0);
      wickDn *= rng.range(1.2, 2.0);
    }

    const high = Math.max(open, close) + wickUp;
    const low  = Math.min(open, close) - wickDn;

    // volume: louder on big bodies, events, and high-vol regimes
    const bodyAbs = Math.abs(close - open);
    const volBase = 700 + rng.u() * 900;
    const volImpact = (bodyAbs / Math.max(sigma, 1e-9)) * 350;
    const eventVol = eventTag ? rng.range(800, 2200) : 0;
    const v = Math.round(volBase + volImpact + eventVol);

    out.push({
      t,
      o: round(open),
      h: round(high),
      l: round(low),
      c: round(close),
      v,
    });

    // ─ post-candle state updates ─
    const realizedMove = close - open;
    lastShock = realizedMove;

    // momentum gets a fraction of the realized move, signed
    momentum = momentum * 0.5 + realizedMove * 0.35;

    // exhaustion grows with same-direction continuation, decays otherwise
    if (out.length >= 2) {
      const prev = out[out.length - 2];
      const prevMove = prev.c - prev.o;
      if (Math.sign(prevMove) !== 0 && Math.sign(prevMove) === Math.sign(realizedMove)) {
        exhaust = Math.min(1, exhaust + 0.06 + Math.abs(realizedMove) / (sigma * 20));
      } else {
        exhaust *= 0.85;
      }
    }

    // anchor follows price slowly
    anchor = anchor + (close - anchor) * anchorAlpha;

    // swing tracker → liquidity map
    if (high > swingHi) { swingHi = high; sinceSwing = 0; }
    else if (low < swingLo) { swingLo = low; sinceSwing = 0; }
    else { sinceSwing++; }
    if (sinceSwing === 6) {
      liquidity.highs.push(swingHi);
      liquidity.lows.push(swingLo);
      if (liquidity.highs.length > 8) liquidity.highs.shift();
      if (liquidity.lows.length  > 8) liquidity.lows.shift();
      swingHi = high; swingLo = low; sinceSwing = 0;
    }

    price = close;
    t += tickMs * 60;
  }

  return {
    symbol: "AURA / USD",
    interval: "15M",
    name,
    seed,
    candles: out,
  };
}

// ─── helpers ──────────────────────────────────────────────────────────────

function sampleRegimeParams(regime, rng) {
  const r = REGIMES[regime];
  return {
    drift: rng.range(r.driftLo, r.driftHi),
    volMul: r.volMul * rng.range(0.85, 1.2),
    mr: r.mr,
    dwellLo: r.dwellLo,
    dwellHi: r.dwellHi,
  };
}

function pickHuntTarget(price, liq, rng) {
  // Prefer the nearest untested swing within a reasonable distance.
  const candidates = [];
  for (const h of liq.highs) if (h > price) candidates.push({ level: h, side: "above" });
  for (const l of liq.lows)  if (l < price) candidates.push({ level: l, side: "below" });
  if (candidates.length === 0) return null;
  // weight by inverse distance
  let total = 0;
  const weights = candidates.map(c => {
    const w = 1 / Math.max(1e-6, Math.abs(c.level - price));
    total += w;
    return w;
  });
  let r = rng.u() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function sq(x) { return x * x; }
function round(n) { return Math.round(n * 100000) / 100000; }
