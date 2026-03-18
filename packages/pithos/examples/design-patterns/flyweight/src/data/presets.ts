import type { StylePreset } from "@/lib/types";

export const PRESETS: StylePreset[] = [
  { label: "Default", font: "Inter", size: 14, color: "#1e293b", swatch: "bg-slate-700" },
  { label: "Heading", font: "Inter", size: 22, color: "#0f172a", swatch: "bg-slate-900" },
  { label: "Accent", font: "Inter", size: 14, color: "#2563eb", swatch: "bg-blue-600" },
  { label: "Subtle", font: "Inter", size: 12, color: "#94a3b8", swatch: "bg-slate-400" },
  { label: "Code", font: "JetBrains Mono", size: 13, color: "#16a34a", swatch: "bg-emerald-600" },
  { label: "Warning", font: "Inter", size: 14, color: "#d97706", swatch: "bg-amber-600" },
];
