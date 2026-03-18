/**
 * Silk — Flowing Bézier ribbons that undulate like silk fabric,
 * each driven by a different frequency band. Screen blending.
 */

import type { Visualizer } from "../types";
import { hexToRgb, rgbToHue, bandAmp, clamp } from "./helpers";

const SILK_RIBBONS = 7;
const SILK_POINTS = 10;

export const silkVisualizer: Visualizer = (ctx, frame, w, h, accent, t) => {
  const [r, g, b] = hexToRgb(accent);
  const baseHue = rgbToHue(r, g, b);
  const midY = h / 2;
  const bass = bandAmp(frame, 0, 0.12);
  const mids = bandAmp(frame, 0.12, 0.5);
  const avg = bandAmp(frame, 0, 1);

  const prevComp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "screen";

  for (let ribbon = 0; ribbon < SILK_RIBBONS; ribbon++) {
    const hue = (baseHue + ribbon * (360 / SILK_RIBBONS) + t * 10) % 360;
    const phase = ribbon * 0.7 + t * (0.8 + ribbon * 0.15);
    const amplitude = h * (0.15 + avg * 0.25);
    const bandFrom = (ribbon / SILK_RIBBONS) * 0.8;
    const bandTo = Math.min(1, bandFrom + 0.3);
    const ribbonAmp = bandAmp(frame, bandFrom, bandTo);

    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < SILK_POINTS; i++) {
      const frac = i / (SILK_POINTS - 1);
      const x = frac * w;
      const dataIdx = Math.floor(frac * frame.length * (bandTo - bandFrom) + frame.length * bandFrom);
      const dataVal = frame[clamp(dataIdx, 0, frame.length - 1)] / 255;
      const wave = Math.sin(phase + frac * Math.PI * 3) * amplitude * 0.5;
      const freqDisp = (dataVal - 0.5) * amplitude * 1.2;
      points.push({ x, y: midY + wave + freqDisp });
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);

    const ribbonWidth = 8 + ribbonAmp * 40;
    for (let i = points.length - 1; i >= 1; i--) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2 + ribbonWidth;
      ctx.quadraticCurveTo(points[i].x, points[i].y + ribbonWidth, xc, yc);
    }
    ctx.closePath();

    const sat = 70 + ribbonAmp * 30;
    const light = 45 + ribbonAmp * 25;
    ctx.fillStyle = `hsla(${hue},${sat}%,${light}%,${0.06 + ribbonAmp * 0.12})`;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y + ribbonWidth / 2);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2 + ribbonWidth / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y + ribbonWidth / 2, xc, yc);
    }
    ctx.lineTo(last.x, last.y + ribbonWidth / 2);
    ctx.strokeStyle = `hsla(${hue},${sat}%,${light + 15}%,${0.15 + ribbonAmp * 0.25})`;
    ctx.lineWidth = 5 + ribbonAmp * 8; ctx.stroke();
    ctx.strokeStyle = `hsla(${hue},${sat}%,${light + 15}%,${0.3 + ribbonAmp * 0.5})`;
    ctx.lineWidth = 1.5 + ribbonAmp * 3; ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(last.x, last.y);
    ctx.strokeStyle = `hsla(${hue},90%,${light + 25}%,${0.1 + ribbonAmp * 0.2})`;
    ctx.lineWidth = 0.5; ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = prevComp;

  const lineGrad = ctx.createLinearGradient(0, midY, w, midY);
  const glowHue = (baseHue + t * 15) % 360;
  const lineAlpha = 0.02 + mids * 0.08;
  lineGrad.addColorStop(0, "rgba(0,0,0,0)");
  lineGrad.addColorStop(0.3, `hsla(${glowHue},70%,60%,${lineAlpha})`);
  lineGrad.addColorStop(0.5, `hsla(${glowHue},80%,70%,${lineAlpha * 2})`);
  lineGrad.addColorStop(0.7, `hsla(${glowHue},70%,60%,${lineAlpha})`);
  lineGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = lineGrad;
  ctx.fillRect(0, midY - 1, w, 2);

  const bloomR = h * (0.15 + bass * 0.2);
  const bloom = ctx.createRadialGradient(w / 2, midY, 0, w / 2, midY, bloomR);
  bloom.addColorStop(0, `hsla(${glowHue},80%,65%,${0.03 + bass * 0.06})`);
  bloom.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(w / 2 - bloomR, midY - bloomR, bloomR * 2, bloomR * 2);
};
