/**
 * Flyweight pattern — style object pool via memoize.
 *
 * Same args = same object reference (shared intrinsic state).
 * Without flyweight: every character gets its own copy.
 */

import { memoize } from "@pithos/core/eidos/flyweight/flyweight";
import type { CharStyle, EditorChar, EditorStats } from "./types";

/** Memoized style factory — same args = same object reference */
const memoizedCreateStyle = memoize(
  (font: string, size: number, color: string): CharStyle => ({ font, size, color }),
  (font: string, size: number, color: string) => `${font}|${size}|${color}`,
);

export function getSharedStyle(font: string, size: number, color: string): CharStyle {
  return memoizedCreateStyle(font, size, color);
}

export function getCopiedStyle(font: string, size: number, color: string): CharStyle {
  return { font, size, color };
}

export function resetPool(): void { memoizedCreateStyle.cache.clear(); }

const STYLE_OBJECT_SIZE = 64;

export function computeStats(chars: EditorChar[], useFlyweight: boolean): EditorStats {
  const totalChars = chars.length;
  if (totalChars === 0) return { totalChars: 0, styleObjects: 0, memoryBytes: 0, savedPercent: 0 };

  if (useFlyweight) {
    const refs = new Set(chars.map((c) => c.style));
    const styleObjects = refs.size;
    const memoryBytes = styleObjects * STYLE_OBJECT_SIZE;
    const wouldBe = totalChars * STYLE_OBJECT_SIZE;
    return { totalChars, styleObjects, memoryBytes, savedPercent: wouldBe > 0 ? Math.round(((wouldBe - memoryBytes) / wouldBe) * 100) : 0 };
  }

  return { totalChars, styleObjects: totalChars, memoryBytes: totalChars * STYLE_OBJECT_SIZE, savedPercent: 0 };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
