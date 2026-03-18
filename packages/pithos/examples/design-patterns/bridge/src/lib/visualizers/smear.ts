/**
 * Smear — Tsoding's Musializer algorithm: log-scale FFT, smooth/smear
 * interpolation, rainbow bars, glowing orbs, explosion sparks on peaks.
 */

import type { Visualizer } from "../types";
import { clamp } from "./helpers";

let smearSmooth: Float32Array | null = null;
let smearTrail: Float32Array | null = null;
let smearPrevTime = 0;

interface SmearSpark {
  x: number; y: number; vx: number; vy: number;
  life: number; hue: number; size: number;
}

const smearSparks: SmearSpark[] = [];
const SPARK_LIMIT = 500;
let smearPrevSmooth: Float32Array | null = null;

export const smearVisualizer: Visualizer = (ctx, frame, w, h, _accent, t) => {
  const dt = smearPrevTime > 0 ? Math.min(t - smearPrevTime, 0.05) : 1 / 60;
  smearPrevTime = t;

  const step = 1.06;
  const bins: number[] = [];
  const halfLen = frame.length;
  for (let f = 1.0; f < halfLen; f = Math.ceil(f * step)) {
    const f1 = Math.ceil(f * step);
    let maxVal = 0;
    for (let q = Math.floor(f); q < halfLen && q < f1; q++) {
      const val = frame[q] / 255;
      if (val > maxVal) maxVal = val;
    }
    bins.push(maxVal);
  }
  const m = bins.length;
  if (m === 0) return;

  if (!smearSmooth || smearSmooth.length !== m) {
    smearSmooth = new Float32Array(m);
    smearTrail = new Float32Array(m);
    smearPrevSmooth = new Float32Array(m);
  }
  const trail = smearTrail as Float32Array;
  const prev = smearPrevSmooth as Float32Array;

  for (let i = 0; i < m; i++) {
    smearSmooth[i] += (bins[i] - smearSmooth[i]) * 8 * dt;
    trail[i] += (smearSmooth[i] - trail[i]) * 3 * dt;
  }

  for (let i = smearSparks.length - 1; i >= 0; i--) {
    const s = smearSparks[i];
    s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 120 * dt; s.life -= dt;
    if (s.life <= 0 || s.y < -10) smearSparks.splice(i, 1);
  }

  const prevComp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";

  const cellW = w / m;
  const barArea = h * 2 / 3;
  const bottom = h;

  for (let i = 0; i < m; i++) {
    const sv = smearSmooth[i];
    const hue = (i / m) * 360;
    const cx = i * cellW + cellW / 2;
    const barTop = bottom - barArea * sv;

    const thick = cellW / 3 * Math.sqrt(sv);
    if (thick > 0.3) {
      ctx.beginPath(); ctx.moveTo(cx, bottom); ctx.lineTo(cx, barTop);
      ctx.strokeStyle = `hsla(${hue},75%,60%,${0.6 + sv * 0.4})`;
      ctx.lineWidth = thick; ctx.stroke();
    }

    const trailY = bottom - barArea * trail[i];
    const orbR = cellW * 2.5 * Math.sqrt(trail[i]);
    if (orbR > 1) {
      const grad = ctx.createRadialGradient(cx, trailY, 0, cx, trailY, orbR);
      grad.addColorStop(0, `hsla(${hue},80%,70%,${0.4 + trail[i] * 0.4})`);
      grad.addColorStop(0.4, `hsla(${hue},75%,55%,${0.1 + trail[i] * 0.15})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, trailY, orbR, 0, Math.PI * 2); ctx.fill();
    }

    const tipR = cellW * 3 * Math.sqrt(sv);
    if (tipR > 1) {
      const grad = ctx.createRadialGradient(cx, barTop, 0, cx, barTop, tipR);
      grad.addColorStop(0, `hsla(${hue},80%,75%,${0.6 + sv * 0.4})`);
      grad.addColorStop(0.25, `hsla(${hue},75%,60%,${0.2 + sv * 0.2})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, barTop, tipR, 0, Math.PI * 2); ctx.fill();
    }

    const excess = bins[i] - smearSmooth[i];
    const margin = 0;
    if (excess > 0.12 && sv > 0.15 && cx > margin && cx < w - margin && barTop > margin && smearSparks.length < SPARK_LIMIT) {
      const intensity = clamp(excess * 4, 0, 1);
      const count = Math.floor(3 + intensity * 8);
      for (let j = 0; j < count; j++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 180 * intensity;
        smearSparks.push({ x: cx, y: barTop, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.3 + Math.random() * 0.5, hue, size: 1.5 + Math.random() * 2.5 });
      }
    }
    prev[i] = smearSmooth[i];
  }

  for (const s of smearSparks) {
    const alpha = s.life * 1.5;
    const r = s.size * (0.5 + s.life);
    ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${s.hue},80%,70%,${clamp(alpha, 0, 1)})`; ctx.fill();
  }

  ctx.globalCompositeOperation = prevComp;
};
