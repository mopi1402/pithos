import type { WeatherCondition, RunwayCapacity } from "@/lib/dashboard";

export const BRAND_COLOR = "#10218b";

export const WEATHER_CONFIG: Record<WeatherCondition, { label: string; bg: string; text: string }> = {
  clear:  { label: "Clear",  bg: "bg-amber-100",  text: "text-amber-700" },
  cloudy: { label: "Cloudy", bg: "bg-slate-200",  text: "text-slate-600" },
  rain:   { label: "Rain",   bg: "bg-blue-100",   text: "text-blue-700" },
  storm:  { label: "Storm",  bg: "bg-red-100",    text: "text-red-700" },
};

export const RUNWAY_COLORS: Record<RunwayCapacity, { bg: string; text: string }> = {
  full:    { bg: "bg-emerald-500", text: "text-emerald-700" },
  reduced: { bg: "bg-amber-500",   text: "text-amber-700" },
  closed:  { bg: "bg-red-500",     text: "text-red-700" },
};

export const STATUS_FLAP_COLORS: Record<string, string> = {
  "on-time": "text-emerald-400",
  delayed: "text-amber-400",
  boarding: "text-sky-400",
  departed: "text-slate-500",
  cancelled: "text-red-400",
};
