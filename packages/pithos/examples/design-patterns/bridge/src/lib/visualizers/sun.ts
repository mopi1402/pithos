/**
 * Cover — Solar starburst, inspired by Nebula's approach.
 * Log-scale FFT → radial rays from a central sun disc.
 * Each ray length = frequency amplitude. Golden warm palette.
 * Persistence-of-vision via the component's fade overlay.
 */

import type { Visualizer } from "../types";
import { bandAmp } from "./helpers";

let coverImg: HTMLImageElement | null = null;
let coverUrl = "";

export function setCoverImage(url: string): void {
  if (url === coverUrl && coverImg) return;
  coverUrl = url; coverImg = null;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => { coverImg = img; };
  img.src = url;
}

// Smooth state (same pattern as Nebula)
let sunSmooth: Float32Array | null = null;
let sunTrail: Float32Array | null = null;
let sunPrevTime = 0;
let sunPrevBass = 0;

interface SunRing {
  radius: number;
  maxRadius: number;
  birth: number;
  life: number;
}
const sunRings: SunRing[] = [];
const SUN_RING_LIMIT = 6;

export const coverVisualizer: Visualizer = (ctx, frame, w, h, _accent, t) => {
  const dt = sunPrevTime > 0 ? Math.min(t - sunPrevTime, 0.05) : 1 / 60;
  sunPrevTime = t;

  const cx = w / 2, cy = h / 2;
  const minDim = Math.min(w, h);

  // --- Log-scale FFT bins (same as Nebula) ---
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

  // --- Smooth and trail ---
  if (!sunSmooth || sunSmooth.length !== m) {
    sunSmooth = new Float32Array(m);
    sunTrail = new Float32Array(m);
  }
  const trail = sunTrail as Float32Array;
  for (let i = 0; i < m; i++) {
    sunSmooth[i] += (bins[i] - sunSmooth[i]) * 8 * dt;
    trail[i] += (sunSmooth[i] - trail[i]) * 3 * dt;
  }

  const bass = bandAmp(frame, 0, 0.12);
  const avg = bandAmp(frame, 0, 1);

  // --- Render ---
  const prevComp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";

  const sunR = minDim * (0.06 + bass * 0.02);
  const maxRayLen = minDim * 1.2;
  const rotation = t * 0.03;

  const totalRays = m * 2;
  const angleStep = (Math.PI * 2) / totalRays;

  // --- Rays as tapered triangles with gradient ---
  // Golden-ratio shuffle: distributes bins uniformly around the circle
  const PHI = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < totalRays; i++) {
    const dataIdx = Math.floor((i * PHI * m) % m);
    const sv = sunSmooth[dataIdx];
    const angle = i * angleStep + rotation;

    // Per-ray variation: deterministic pseudo-random from dataIdx
    const lenVar = 0.3 + ((dataIdx * 7 + 13) % 17) / 17 * 0.7;
    const widthVar = 0.6 + ((dataIdx * 11 + 3) % 13) / 13 * 0.4;
    const rayLen = Math.max(minDim * 0.03, sv * maxRayLen * lenVar);
    const hue = 40 + sv * 15;
    const sat = 70 + sv * 20;
    const light = 55 + sv * 30;
    const alpha = 0.2 + sv * 0.6;

    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    const x1 = cx + cosA * sunR, y1 = cy + sinA * sunR;
    const tipX = cx + cosA * (sunR + rayLen);
    const tipY = cy + sinA * (sunR + rayLen);
    const baseWidth = (3 + sv * 8) * widthVar;

    // Gradient along the ray
    const grad = ctx.createLinearGradient(x1, y1, tipX, tipY);
    grad.addColorStop(0, `hsla(${hue},${sat}%,${light}%,${alpha.toFixed(3)})`);
    grad.addColorStop(0.12, `hsla(${hue},${sat}%,${light}%,${(alpha * 0.6).toFixed(3)})`);
    grad.addColorStop(0.5, `hsla(${hue},${sat - 10}%,${light - 10}%,${(alpha * 0.15).toFixed(3)})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.lineCap = "round";

    // Wide dim pass (soft glow edges)
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = baseWidth * 4;
    ctx.globalAlpha = 0.3;
    ctx.stroke();

    // Medium pass
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = baseWidth * 2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();

    // Sharp bright core
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = baseWidth * 0.8;
    ctx.globalAlpha = 1;
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  // --- Central sun disc ---
  const discR = sunR * (1.5 + bass * 2.5);
  const disc = ctx.createRadialGradient(cx, cy, 0, cx, cy, discR);
  disc.addColorStop(0, `hsla(50,95%,97%,${Math.min(1, 0.8 + bass * 0.5).toFixed(2)})`);
  disc.addColorStop(0.2, `hsla(45,90%,80%,${(0.6 + bass * 0.4).toFixed(2)})`);
  disc.addColorStop(0.5, `hsla(40,75%,60%,${(0.2 + bass * 0.3).toFixed(2)})`);
  disc.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = disc;
  ctx.beginPath(); ctx.arc(cx, cy, discR, 0, Math.PI * 2); ctx.fill();

  // Large soft halo that spreads wide from center
  const haloR = minDim * (0.5 + avg * 0.4 + bass * 0.3);
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
  halo.addColorStop(0, `hsla(45,80%,70%,${(0.25 + bass * 0.2).toFixed(2)})`);
  halo.addColorStop(0.1, `hsla(43,70%,55%,${(0.12 + avg * 0.1).toFixed(2)})`);
  halo.addColorStop(0.4, `hsla(40,60%,40%,${(0.04 + avg * 0.04).toFixed(2)})`);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(cx - haloR, cy - haloR, haloR * 2, haloR * 2);

  // --- Expanding rings on transient peaks (same logic as Smear sparks) ---
  // Compare raw energy vs smoothed energy — spike = transient
  let rawEnergy = 0;
  for (let i = 0; i < frame.length; i++) rawEnergy += frame[i];
  rawEnergy /= frame.length * 255;
  const spike = rawEnergy - sunPrevBass;
  sunPrevBass += (rawEnergy - sunPrevBass) * 0.15; // smooth follow
  if (spike > 0.04 && sunRings.length < SUN_RING_LIMIT) {
    sunRings.push({
      radius: sunR,
      maxRadius: minDim * 1.5, // expand way beyond canvas
      birth: t,
      life: 1.2,
    });
  }

  for (let i = sunRings.length - 1; i >= 0; i--) {
    const ring = sunRings[i];
    const age = t - ring.birth;
    if (age > ring.life) { sunRings.splice(i, 1); continue; }
    const progress = age / ring.life;
    // Ease-out: fast at start, slows down
    const eased = 1 - (1 - progress) * (1 - progress);
    const r = ring.radius + (ring.maxRadius - ring.radius) * eased;
    const alpha = (1 - eased) * (1 - eased) * 0.35;
    const lineW = 10 + eased * 500; // starts thin, gets very thick fast

    // Soft outer
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(45,70%,65%,${(alpha * 0.25).toFixed(3)})`;
    ctx.lineWidth = lineW + 150; ctx.stroke();
    // Inner
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(45,75%,75%,${alpha.toFixed(3)})`;
    ctx.lineWidth = lineW; ctx.stroke();
  }

  ctx.globalCompositeOperation = prevComp;
};
