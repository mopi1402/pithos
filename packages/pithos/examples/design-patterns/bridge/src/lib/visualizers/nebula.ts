/**
 * Nebula — Circular radial bars with log-scale FFT, mirror symmetry,
 * smooth/smear interpolation, glowing orbs, shockwave rings on beats.
 */

import type { Visualizer } from "../types";
import { hexToRgb, rgbToHue, bandAmp } from "./helpers";

let nebulaSmooth: Float32Array | null = null;
let nebulaTrail: Float32Array | null = null;
let nebulaPrevTime = 0;
let nebulaPrevBass = 0;

interface ShockRing {
  radius: number;
  maxRadius: number;
  hue: number;
  birth: number;
  life: number;
}
const nebulaRings: ShockRing[] = [];
const RING_LIMIT = 6;

export const nebulaVisualizer: Visualizer = (ctx, frame, w, h, accent, t) => {
  const dt = nebulaPrevTime > 0 ? Math.min(t - nebulaPrevTime, 0.05) : 1 / 60;
  nebulaPrevTime = t;

  const [ar, ag, ab] = hexToRgb(accent);
  const baseHue = rgbToHue(ar, ag, ab);
  const cx = w / 2;
  const cy = h / 2;
  const minDim = Math.min(w, h);

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

  if (!nebulaSmooth || nebulaSmooth.length !== m) {
    nebulaSmooth = new Float32Array(m);
    nebulaTrail = new Float32Array(m);
  }
  const trail = nebulaTrail as Float32Array;
  for (let i = 0; i < m; i++) {
    nebulaSmooth[i] += (bins[i] - nebulaSmooth[i]) * 8 * dt;
    trail[i] += (nebulaSmooth[i] - trail[i]) * 3 * dt;
  }

  const bass = bandAmp(frame, 0, 0.12);
  const avg = bandAmp(frame, 0, 1);

  const bassJump = bass - nebulaPrevBass;
  nebulaPrevBass = bass * 0.6 + nebulaPrevBass * 0.4;
  if (bassJump > 0.1 && nebulaRings.length < RING_LIMIT) {
    nebulaRings.push({
      radius: minDim * 0.08, maxRadius: minDim * 0.55,
      hue: (baseHue + t * 20) % 360, birth: t, life: 1.2 + bassJump * 2,
    });
  }

  for (let i = nebulaRings.length - 1; i >= 0; i--) {
    if (t - nebulaRings[i].birth > nebulaRings[i].life) nebulaRings.splice(i, 1);
  }

  const prevComp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";

  const innerR = minDim * (0.08 + bass * 0.02);
  const maxBarLen = minDim * 0.35;
  const rotation = t * 0.08;
  const totalBars = m * 2;
  const angleStep = (Math.PI * 2) / totalBars;

  for (let i = 0; i < totalBars; i++) {
    const dataIdx = i < m ? i : totalBars - 1 - i;
    const sv = nebulaSmooth[dataIdx];
    const tv = trail[dataIdx];
    const angle = i * angleStep + rotation;
    const barLen = Math.max(minDim * 0.02, sv * maxBarLen);
    const trailLen = tv * maxBarLen;
    const hue = (baseHue + (dataIdx / m) * 360 + t * 10) % 360;
    const sat = 70 + sv * 30;
    const light = 45 + sv * 30;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const x1 = cx + cosA * innerR;
    const y1 = cy + sinA * innerR;
    const x2 = cx + cosA * (innerR + barLen);
    const y2 = cy + sinA * (innerR + barLen);

    const thick = 1 + sv * 3;
    if (thick > 0.3) {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsla(${hue},${sat}%,${light}%,${sv * 0.15})`;
      ctx.lineWidth = thick + 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsla(${hue},${sat}%,${light}%,${0.4 + sv * 0.5})`;
      ctx.lineWidth = thick; ctx.stroke();
    }

    const tipR = 2 + sv * 5;
    if (sv > 0.1) {
      const grad = ctx.createRadialGradient(x2, y2, 0, x2, y2, tipR);
      grad.addColorStop(0, `hsla(${hue},${sat}%,${light + 15}%,${0.5 + sv * 0.4})`);
      grad.addColorStop(0.4, `hsla(${hue},${sat}%,${light}%,${0.1 + sv * 0.15})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x2, y2, tipR, 0, Math.PI * 2); ctx.fill();
    }

    if (Math.abs(barLen - trailLen) > 2 && tv > 0.1) {
      const tx = cx + cosA * (innerR + trailLen);
      const ty = cy + sinA * (innerR + trailLen);
      const tR = 1.5 + tv * 3;
      const grad = ctx.createRadialGradient(tx, ty, 0, tx, ty, tR);
      grad.addColorStop(0, `hsla(${hue},${sat}%,${light}%,${0.3 + tv * 0.3})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(tx, ty, tR, 0, Math.PI * 2); ctx.fill();
    }
  }

  const haloR = minDim * (0.06 + bass * 0.06);
  const haloHue = (baseHue + t * 20) % 360;
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
  halo.addColorStop(0, `hsla(${haloHue},85%,75%,${0.25 + bass * 0.35})`);
  halo.addColorStop(0.5, `hsla(${haloHue},75%,55%,${0.06 + bass * 0.1})`);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, haloR, 0, Math.PI * 2); ctx.fill();

  for (const ring of nebulaRings) {
    const age = t - ring.birth;
    const progress = age / ring.life;
    const r = ring.radius + (ring.maxRadius - ring.radius) * progress;
    const alpha = (1 - progress) * 0.6;
    const lineW = 2 + progress * 12;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${ring.hue},70%,60%,${alpha * 0.2})`;
    ctx.lineWidth = lineW + 10 + progress * 20; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${ring.hue},75%,65%,${alpha})`;
    ctx.lineWidth = lineW; ctx.stroke();
  }

  const ringR = innerR + maxBarLen * avg * 0.6;
  ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(${(haloHue + 60) % 360},60%,55%,${0.03 + avg * 0.08})`;
  ctx.lineWidth = 1 + avg * 2; ctx.stroke();

  ctx.globalCompositeOperation = prevComp;
};
