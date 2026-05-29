// Trading Replay Simulator — main orchestrator
import { generateScenario } from "./data.js";
import { Chart } from "./chart.js";
import { ReplayEngine } from "./replay.js";
import { TradingEngine } from "./trading.js";
import { analyzeSession } from "./coach.js";
import { audio } from "./audio.js";

// ----- DOM helpers -----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const els = {
  landing: $("#landing"),
  startBtn: $("#startBtn"),
  demoBtn: $("#demoBtn"),
  sim: $("#sim"),
  backBtn: $("#backBtn"),
  endBtn: $("#endBtn"),
  muteBtn: $("#muteBtn"),

  chartCanvas: $("#chart"),
  chartOverlay: $("#chartOverlay"),
  crossX: $("#crossX"),
  crossY: $("#crossY"),
  overlayReadout: $("#overlayReadout"),

  hudPosition: $("#hudPosition"),
  hudDir: $("#hudDir"),
  hudEntry: $("#hudEntry"),
  hudPnl: $("#hudPnl"),

  symName: $("#symName"),
  symTag: $("#symTag"),
  lastPrice: $("#lastPrice"),
  priceChange: $("#priceChange"),

  statBalance: $("#statBalance"),
  statEquity: $("#statEquity"),
  statOpenPnl: $("#statOpenPnl"),
  statSession: $("#statSession"),
  candleCount: $("#candleCount"),

  playBtn: $("#playBtn"),
  restartBtn: $("#restartBtn"),
  speedBtns: $$(".speed__btn"),
  progress: $("#progress"),
  progressFill: $("#progressFill"),
  progressThumb: $("#progressThumb"),
  replayTime: $("#replayTime"),

  qtyInput: $("#qtyInput"),
  slInput: $("#slInput"),
  tpInput: $("#tpInput"),
  riskPct: $("#riskPct"),
  riskFill: $("#riskFill"),
  steps: $$(".step"),
  buyBtn: $("#buyBtn"),
  sellBtn: $("#sellBtn"),
  buyPrice: $("#buyPrice"),
  sellPrice: $("#sellPrice"),
  closeBtn: $("#closeBtn"),
  positionStatus: $("#positionStatus"),

  tradeLog: $("#tradeLog"),
  tradeCount: $("#tradeCount"),

  coach: $("#coach"),
  coachTitle: $("#coachTitle"),
  coachMetrics: $("#coachMetrics"),
  coachNotes: $("#coachNotes"),
  coachLessons: $("#coachLessons"),
  coachClose: $("#coachClose"),
  coachReplay: $("#coachReplay"),
  coachNew: $("#coachNew"),

  toast: $("#toast"),

  landingChart: $("#landingChart"),
};

const state = {
  scenario: null,
  chart: null,
  replay: null,
  trading: null,
  emaCache: null,
  startBalance: 10000,
  ended: false,
  parallaxRaf: null,
};

// ----- Landing animated chart background -----
function startLandingChart() {
  const canvas = els.landingChart;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let raf;
  let w, h;
  function resize() {
    const rect = els.landing.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);
  const lines = 4;
  const seeds = Array.from({ length: lines }, (_, i) => ({
    phase: Math.random() * Math.PI * 2,
    speed: 0.0006 + i * 0.00015,
    amp: 0.18 + i * 0.05,
    yOff: 0.5 + (i - lines / 2) * 0.06,
    hue: 210 + i * 18,
  }));
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    seeds.forEach((s, idx) => {
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.shadowColor = `hsla(${s.hue}, 90%, 65%, 0.7)`;
      ctx.shadowBlur = 16;
      ctx.strokeStyle = `hsla(${s.hue}, 80%, 70%, ${0.18 + idx * 0.05})`;
      const steps = 80;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w;
        const phase = i * 0.18 + s.phase + t * s.speed;
        const y = h * (s.yOff + Math.sin(phase) * s.amp * 0.4 + Math.sin(phase * 0.5) * 0.04);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
}

// ----- App lifecycle -----
function startSession({ withDemo = false } = {}) {
  state.ended = false;
  state.scenario = generateScenario({ candles: 240, basePrice: 1.0825 });
  els.symName.textContent = state.scenario.symbol;
  els.symTag.textContent = state.scenario.interval + " · LIVE REPLAY";
  els.candleCount.textContent = `${state.scenario.candles.length} candles`;

  // Build engines
  if (!state.chart) state.chart = new Chart(els.chartCanvas);
  state.chart.setData(state.scenario.candles);
  state.chart.priceFormat = (v) => v.toFixed(4);

  // Cache ema for coach
  state.emaCache = computeEMA(state.scenario.candles, 20);

  state.trading = new TradingEngine({
    startingBalance: state.startBalance,
    onChange: () => syncTradingUI(),
  });

  state.replay = new ReplayEngine({
    onTick: ({ idx, partial, current }) => onReplayTick(idx, partial, current),
    onComplete: () => onReplayComplete(),
  });
  state.replay.load(state.scenario.candles);

  // Reset replay UI
  setSpeed(1);
  setPlayingUI(false);
  els.progressFill.style.width = "0%";
  els.progressThumb.style.left = "0%";
  els.replayTime.textContent = `00:00 / ${formatTime(state.scenario.candles.length)}`;
  els.tradeLog.innerHTML = '<li class="tradelog__empty">No trades yet. The market is patient.</li>';
  els.tradeCount.textContent = "0 trades";
  syncTradingUI();

  // Show simulator
  els.landing.classList.add("is-hidden");
  els.sim.classList.add("is-visible");
  requestAnimationFrame(() => requestAnimationFrame(() => els.sim.classList.add("is-revealed")));
  els.sim.setAttribute("aria-hidden", "false");

  // Start replay (delay slightly for transition)
  setTimeout(() => {
    state.replay.play();
    setPlayingUI(true);
    if (withDemo) toast("Demo mode — sit back and watch the market unfold.", "info");
  }, 700);

  // Reset live ticker baseline
  state.openingPrice = state.scenario.candles[0].o;
}

function endSession({ silent = false } = {}) {
  if (state.ended) return;
  state.ended = true;
  if (state.replay) state.replay.pause();
  setPlayingUI(false);
  if (state.trading.position) state.trading.close({ reason: "session-end" });

  if (silent) return;
  showCoach();
}

function backToLanding() {
  if (state.replay) state.replay.pause();
  els.sim.classList.remove("is-revealed");
  setTimeout(() => {
    els.sim.classList.remove("is-visible");
    els.sim.setAttribute("aria-hidden", "true");
    els.landing.classList.remove("is-hidden");
  }, 500);
}

// ----- Replay handling -----
function onReplayTick(idx, partial, currentPrice) {
  state.chart.setRevealed(idx, partial);
  els.progressFill.style.width = (idx / state.scenario.candles.length * 100).toFixed(2) + "%";
  els.progressThumb.style.left = (idx / state.scenario.candles.length * 100).toFixed(2) + "%";
  els.replayTime.textContent = `${formatTime(idx)} / ${formatTime(state.scenario.candles.length)}`;
  els.statSession.textContent = `${idx} / ${state.scenario.candles.length}`;

  // Live price
  const last = currentPrice;
  if (last != null) {
    const open = state.openingPrice;
    const diff = last - open;
    const pct = (diff / open) * 100;
    const prevText = els.lastPrice.textContent;
    const newText = last.toFixed(4);
    if (prevText !== newText) {
      els.lastPrice.textContent = newText;
    }
    els.priceChange.textContent = `${diff >= 0 ? "+" : ""}${diff.toFixed(4)} (${diff >= 0 ? "+" : ""}${pct.toFixed(2)}%)`;
    els.priceChange.classList.toggle("is-up", diff > 0);
    els.priceChange.classList.toggle("is-down", diff < 0);

    // Update buy/sell ticket prices
    els.buyPrice.textContent = last.toFixed(4);
    els.sellPrice.textContent = last.toFixed(4);

    // Update trading P/L
    if (state.trading) {
      const closed = state.trading.setMarket(last, idx);
      if (closed) onAutoClosed(closed);
    }
  }
}

function onReplayComplete() {
  setPlayingUI(false);
  toast("Session complete. Coach is reviewing your decisions…", "info");
  setTimeout(() => endSession(), 500);
}

function setPlayingUI(playing) {
  els.playBtn.querySelector(".ic-play").hidden = playing;
  els.playBtn.querySelector(".ic-pause").hidden = !playing;
}

function setSpeed(s) {
  state.replay && state.replay.setSpeed(s);
  els.speedBtns.forEach(b => b.classList.toggle("is-active", parseFloat(b.dataset.speed) === s));
}

// ----- Trading -----
function onAutoClosed(trade) {
  if (trade.reason === "stop") {
    audio.loss(); toast(`Stop loss hit · ${money(trade.pnl)}`, "bad");
    state.chart.flashScreen("rgba(255,87,115,0.18)");
  } else if (trade.reason === "target") {
    audio.win(); toast(`Take profit hit · ${money(trade.pnl)}`, "good");
    state.chart.flashScreen("rgba(40,224,164,0.18)");
  }
  appendTradeLog(trade);
}

function syncTradingUI() {
  const t = state.trading;
  if (!t) return;
  const open = t.openPnl();
  const equity = t.equity();
  els.statBalance.textContent = "$" + t.balance.toFixed(2);
  els.statEquity.textContent = "$" + equity.toFixed(2);
  els.statOpenPnl.textContent = (open >= 0 ? "+$" : "-$") + Math.abs(open).toFixed(2);
  els.statOpenPnl.classList.toggle("is-up", open > 0);
  els.statOpenPnl.classList.toggle("is-down", open < 0);

  // Position HUD
  if (t.position) {
    const p = t.position;
    els.hudPosition.hidden = false;
    els.hudPosition.dataset.dir = p.dir;
    els.hudDir.textContent = p.dir;
    els.hudEntry.textContent = "@ " + p.entry.toFixed(4);
    els.hudPnl.textContent = (open >= 0 ? "+" : "") + open.toFixed(2);
    els.hudPnl.classList.toggle("is-up", open > 0);
    els.hudPnl.classList.toggle("is-down", open < 0);
    els.positionStatus.textContent = `${p.dir} ${p.qty} @ ${p.entry.toFixed(4)}`;
    els.closeBtn.disabled = false;
    els.buyBtn.disabled = true;
    els.sellBtn.disabled = true;
    els.buyBtn.classList.add("is-disabled");
    els.sellBtn.classList.add("is-disabled");
    state.chart.setPosition(p);
  } else {
    els.hudPosition.hidden = true;
    els.positionStatus.textContent = "No position";
    els.closeBtn.disabled = true;
    els.buyBtn.disabled = false;
    els.sellBtn.disabled = false;
    els.buyBtn.classList.remove("is-disabled");
    els.sellBtn.classList.remove("is-disabled");
    state.chart.setPosition(null);
  }

  updateRiskMeter();
}

function readTicket() {
  const qty = Math.max(100, Math.floor(parseFloat(els.qtyInput.value) || 0));
  const sl = parseFloat(els.slInput.value);
  const tp = parseFloat(els.tpInput.value);
  return { qty, sl: isFinite(sl) ? sl : null, tp: isFinite(tp) ? tp : null };
}

function autoStops(dir, entry) {
  // Default 25 pip stop / 50 pip target if user didn't set anything.
  const pip = 0.0010;
  if (dir === "LONG") return { sl: round4(entry - pip * 25), tp: round4(entry + pip * 50) };
  return { sl: round4(entry + pip * 25), tp: round4(entry - pip * 50) };
}

function placeOrder(dir) {
  if (!state.trading || state.ended) return;
  if (state.replay && !state.replay.running) {
    // allow trading while paused but warn
  }
  const t = state.trading;
  const { qty } = readTicket();
  let { sl, tp } = readTicket();
  const entry = t.lastPrice;
  if (entry == null) return toast("Market not ready yet", "info");

  if (sl == null && tp == null) {
    const auto = autoStops(dir, entry);
    sl = auto.sl; tp = auto.tp;
    els.slInput.value = sl.toFixed(4);
    els.tpInput.value = tp.toFixed(4);
  }

  const result = t.open({ dir, qty, sl, tp });
  if (result.error) return toast(result.error, "bad");
  audio.resume();
  dir === "LONG" ? audio.buy() : audio.sell();
  state.chart.flashScreen(dir === "LONG" ? "rgba(40,224,164,0.14)" : "rgba(255,87,115,0.14)");
  toast(`${dir} ${qty} @ ${entry.toFixed(4)}`, "info");
}

function closePosition() {
  if (!state.trading || !state.trading.position) return;
  const t = state.trading.close({ reason: "manual" });
  if (!t) return;
  if (t.pnl >= 0) { audio.win(); toast(`Closed +${money(t.pnl).slice(1)}`, "good"); state.chart.flashScreen("rgba(40,224,164,0.16)"); }
  else { audio.loss(); toast(`Closed ${money(t.pnl)}`, "bad"); state.chart.flashScreen("rgba(255,87,115,0.16)"); }
  appendTradeLog(t);
}

function appendTradeLog(t) {
  if (els.tradeLog.querySelector(".tradelog__empty")) els.tradeLog.innerHTML = "";
  const li = document.createElement("li");
  li.className = "tradelog__item";
  const dirCls = t.dir === "LONG" ? "is-long" : "is-short";
  const pnlCls = t.pnl >= 0 ? "is-up" : "is-down";
  li.innerHTML = `
    <span class="tradelog__dir ${dirCls}">${t.dir}</span>
    <span class="tradelog__det">${t.qty} · ${t.entry.toFixed(4)} → ${t.exit.toFixed(4)} · ${t.reason}</span>
    <span class="tradelog__pnl ${pnlCls}">${t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}</span>
  `;
  els.tradeLog.prepend(li);
  els.tradeCount.textContent = `${state.trading.trades.length} trade${state.trading.trades.length === 1 ? "" : "s"}`;
}

function updateRiskMeter() {
  const t = state.trading;
  if (!t) return;
  const { qty, sl } = readTicket();
  const entry = t.lastPrice;
  if (!entry || !sl || !qty) {
    els.riskPct.textContent = "—";
    els.riskFill.style.width = "0%";
    return;
  }
  const dist = Math.abs(entry - sl);
  const risk$ = dist * qty;
  const pct = (risk$ / state.startBalance) * 100;
  els.riskPct.textContent = `$${risk$.toFixed(2)} · ${pct.toFixed(1)}%`;
  els.riskFill.style.width = Math.min(100, pct * 20) + "%";
}

// ----- Coach -----
function showCoach() {
  const result = analyzeSession({
    trades: state.trading.trades.slice(),
    candles: state.scenario.candles,
    startingBalance: state.startBalance,
    finalBalance: state.trading.balance,
    ema: state.emaCache,
  });

  els.coachTitle.textContent = headlineFor(result);
  els.coachMetrics.innerHTML = "";
  const m = result.metrics;
  const metrics = [
    { k: "Net P/L", v: m.pnl, cls: m.pnlValue > 0 ? "is-up" : (m.pnlValue < 0 ? "is-down" : "") },
    { k: "Trades", v: m.trades },
    { k: "Win Rate", v: m.winRate },
    { k: "Profit Factor", v: m.profitFactor },
  ];
  for (const item of metrics) {
    const d = document.createElement("div");
    d.className = "metric";
    d.innerHTML = `<div class="metric__k">${item.k}</div><div class="metric__v ${item.cls || ""}">${item.v}</div>`;
    els.coachMetrics.appendChild(d);
  }

  els.coachNotes.innerHTML = "";
  for (const n of result.notes) {
    const li = document.createElement("li");
    li.className = "is-" + n.kind;
    li.textContent = n.text;
    els.coachNotes.appendChild(li);
  }

  els.coachLessons.innerHTML = "";
  for (const l of result.lessons) {
    const li = document.createElement("li");
    li.textContent = l;
    els.coachLessons.appendChild(li);
  }

  els.coach.classList.add("is-open");
  els.coach.setAttribute("aria-hidden", "false");
}

function headlineFor(result) {
  const v = result.metrics.pnlValue;
  if (result.metrics.trades === 0) return "You watched. Now read the room.";
  if (v > 200) return "Sharp session. Process over outcome.";
  if (v > 0) return "In the green — let's tighten it up.";
  if (v < -200) return "Tough one. The lessons are louder than the loss.";
  if (v < 0) return "Small bleed. Easy fix.";
  return "Flat session. Honest data.";
}

function hideCoach() {
  els.coach.classList.remove("is-open");
  els.coach.setAttribute("aria-hidden", "true");
}

// ----- Toast -----
let toastTimer;
function toast(text, kind = "info") {
  els.toast.textContent = text;
  els.toast.className = "toast is-show is-" + kind;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("is-show"), 2400);
}

// ----- Crosshair / parallax -----
function bindChartHover() {
  const wrap = els.chartCanvas.parentElement;
  wrap.addEventListener("mousemove", (e) => {
    const r = wrap.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    els.crossX.style.transform = `translate3d(${x}px,0,0)`;
    els.crossY.style.transform = `translate3d(0,${y}px,0)`;
    els.crossX.style.opacity = els.crossY.style.opacity = 1;
    if (state.trading && state.trading.lastPrice != null) {
      els.overlayReadout.style.opacity = 1;
      els.overlayReadout.textContent = `LAST ${state.trading.lastPrice.toFixed(4)}  ·  P/L ${state.trading.openPnl().toFixed(2)}`;
    }
  });
  wrap.addEventListener("mouseleave", () => {
    els.crossX.style.opacity = els.crossY.style.opacity = 0;
    els.overlayReadout.style.opacity = 0;
  });
}

function bindParallax() {
  // Subtle layered parallax tied to mouse
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener("mousemove", (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    tx = (e.clientX / w - 0.5);
    ty = (e.clientY / h - 0.5);
  });
  function loop() {
    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.05;
    document.querySelector(".ambient__glow--a").style.transform = `translate3d(${cx * 30}px, ${cy * 20}px, 0) scale(1.05)`;
    document.querySelector(".ambient__glow--b").style.transform = `translate3d(${-cx * 40}px, ${-cy * 30}px, 0) scale(1.08)`;
    state.parallaxRaf = requestAnimationFrame(loop);
  }
  loop();
}

// ----- Helpers -----
function formatTime(idx) {
  // 15M candles → minutes total
  const minutes = idx * 15;
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
}
function money(v) { return (v < 0 ? "-" : "") + "$" + Math.abs(v).toFixed(2); }
function round4(v) { return Math.round(v * 10000) / 10000; }
function computeEMA(candles, period) {
  const k = 2 / (period + 1);
  const out = []; let ema = null;
  candles.forEach((c, i) => {
    if (i === 0) ema = c.c; else ema = c.c * k + ema * (1 - k);
    out.push(ema);
  });
  return out;
}

// ----- Wire up events -----
function bindEvents() {
  els.startBtn.addEventListener("click", () => { audio.resume(); audio.click(); startSession(); });
  els.demoBtn.addEventListener("click", () => { audio.resume(); audio.click(); startSession({ withDemo: true }); });

  els.backBtn.addEventListener("click", () => { audio.click(); backToLanding(); });
  els.endBtn.addEventListener("click", () => { audio.click(); endSession(); });

  els.muteBtn.addEventListener("click", () => {
    const on = els.muteBtn.dataset.on === "true";
    els.muteBtn.dataset.on = (!on).toString();
    audio.setMuted(on);
    els.muteBtn.style.color = on ? "#5b647a" : "";
    toast(on ? "Sound off" : "Sound on", "info");
  });

  els.playBtn.addEventListener("click", () => {
    audio.click(); audio.resume();
    if (!state.replay) return;
    state.replay.toggle();
    setPlayingUI(state.replay.running);
  });
  els.restartBtn.addEventListener("click", () => {
    audio.click();
    if (!state.replay) return;
    state.replay.restart();
    state.trading = new TradingEngine({ startingBalance: state.startBalance, onChange: () => syncTradingUI() });
    els.tradeLog.innerHTML = '<li class="tradelog__empty">No trades yet. The market is patient.</li>';
    els.tradeCount.textContent = "0 trades";
    syncTradingUI();
    state.replay.play();
    setPlayingUI(true);
    toast("Replay restarted", "info");
  });
  els.speedBtns.forEach(b => b.addEventListener("click", () => {
    audio.click();
    setSpeed(parseFloat(b.dataset.speed));
  }));

  // Progress scrub
  let dragging = false;
  const onScrub = (clientX) => {
    const r = els.progress.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    state.replay && state.replay.seek(f);
  };
  els.progress.addEventListener("mousedown", (e) => { dragging = true; onScrub(e.clientX); });
  window.addEventListener("mousemove", (e) => { if (dragging) onScrub(e.clientX); });
  window.addEventListener("mouseup", () => dragging = false);
  els.progress.addEventListener("touchstart", (e) => onScrub(e.touches[0].clientX), { passive: true });
  els.progress.addEventListener("touchmove", (e) => onScrub(e.touches[0].clientX), { passive: true });

  // Trade controls
  els.buyBtn.addEventListener("click", () => placeOrder("LONG"));
  els.sellBtn.addEventListener("click", () => placeOrder("SHORT"));
  els.closeBtn.addEventListener("click", closePosition);

  els.steps.forEach(s => s.addEventListener("click", () => {
    audio.click();
    const dir = parseFloat(s.dataset.step);
    const v = Math.max(100, Math.floor(parseFloat(els.qtyInput.value) || 0) + dir * 100);
    els.qtyInput.value = v;
    updateRiskMeter();
  }));
  els.qtyInput.addEventListener("input", updateRiskMeter);
  els.slInput.addEventListener("input", updateRiskMeter);
  els.tpInput.addEventListener("input", updateRiskMeter);

  // Coach modal
  els.coachClose.addEventListener("click", hideCoach);
  els.coach.querySelector(".modal__scrim").addEventListener("click", hideCoach);
  els.coachReplay.addEventListener("click", () => { hideCoach(); audio.click(); state.replay.restart(); state.trading = new TradingEngine({ startingBalance: state.startBalance, onChange: () => syncTradingUI() }); els.tradeLog.innerHTML = '<li class="tradelog__empty">No trades yet. The market is patient.</li>'; els.tradeCount.textContent = "0 trades"; state.ended = false; state.replay.play(); setPlayingUI(true); syncTradingUI(); });
  els.coachNew.addEventListener("click", () => { hideCoach(); audio.click(); startSession(); });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (!els.sim.classList.contains("is-visible")) return;
    if (e.target.tagName === "INPUT") return;
    if (e.code === "Space") { e.preventDefault(); els.playBtn.click(); }
    if (e.key.toLowerCase() === "b") placeOrder("LONG");
    if (e.key.toLowerCase() === "s") placeOrder("SHORT");
    if (e.key.toLowerCase() === "c") closePosition();
    if (e.key.toLowerCase() === "r") els.restartBtn.click();
  });
}

// ----- Boot -----
function boot() {
  bindEvents();
  bindChartHover();
  bindParallax();
  startLandingChart();
}
document.addEventListener("DOMContentLoaded", boot);
