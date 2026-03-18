import type { AudioFrame } from "../types";

export { clamp } from "@pithos/core/arkhe/number/clamp";

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function bandAmp(frame: AudioFrame, from: number, to: number): number {
  const s = Math.floor(frame.length * from);
  const e = Math.floor(frame.length * to);
  let sum = 0;
  for (let i = s; i < e; i++) sum += frame[i];
  return sum / ((e - s) * 255);
}

export function rgbToHue(r: number, g: number, b: number): number {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  if (max === min) return 0;
  const d = max - min;
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + 6) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return h * 60;
}
