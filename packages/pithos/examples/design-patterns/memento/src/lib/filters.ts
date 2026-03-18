import type { FilterState, FilterKey, FilterDef } from "./types";

export const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
};

export const FILTER_DEFS: FilterDef[] = [
  { key: "brightness", label: "Brightness", min: 0, max: 200, step: 1, unit: "%", color: "#facc15" },
  { key: "contrast", label: "Contrast", min: 0, max: 200, step: 1, unit: "%", color: "#f97316" },
  { key: "saturation", label: "Saturation", min: 0, max: 200, step: 1, unit: "%", color: "#3b82f6" },
  { key: "blur", label: "Blur", min: 0, max: 10, step: 0.1, unit: "px", color: "#a78bfa" },
  { key: "sepia", label: "Sepia", min: 0, max: 100, step: 1, unit: "%", color: "#d97706" },
];

export function buildCSSFilter(f: FilterState): string {
  return [
    `brightness(${f.brightness}%)`,
    `contrast(${f.contrast}%)`,
    `saturate(${f.saturation}%)`,
    `blur(${f.blur}px)`,
    `sepia(${f.sepia}%)`,
  ].join(" ");
}

export function isDefault(f: FilterState): boolean {
  return (Object.keys(DEFAULT_FILTERS) as FilterKey[]).every(
    (k) => f[k] === DEFAULT_FILTERS[k],
  );
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
