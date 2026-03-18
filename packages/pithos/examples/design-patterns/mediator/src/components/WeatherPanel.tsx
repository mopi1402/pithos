import { Cloud, CloudRain, CloudLightning, Sun } from "lucide-react";
import type { WeatherCondition } from "@/lib/dashboard";
import { WEATHER_OPTIONS } from "@/lib/dashboard";
import { BRAND_COLOR } from "./constants";

const WEATHER_CONFIG: Record<WeatherCondition, { icon: React.ReactNode; label: string; bg: string; text: string }> = {
  clear:  { icon: <Sun className="w-5 h-5" />,            label: "Clear",  bg: "bg-amber-100",   text: "text-amber-700" },
  cloudy: { icon: <Cloud className="w-5 h-5" />,          label: "Cloudy", bg: "bg-slate-200",   text: "text-slate-600" },
  rain:   { icon: <CloudRain className="w-5 h-5" />,      label: "Rain",   bg: "bg-blue-100",    text: "text-blue-700" },
  storm:  { icon: <CloudLightning className="w-5 h-5" />, label: "Storm",  bg: "bg-red-100",     text: "text-red-700" },
};

export function WeatherPanel({ current, severity, destination, onChangeWeather }: {
  current: WeatherCondition;
  severity: number;
  destination?: string;
  onChangeWeather: (c: WeatherCondition) => void;
}) {
  const config = WEATHER_CONFIG[current];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: BRAND_COLOR }}>Weather</h2>
        {destination && (
          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
            Focused: {destination}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className={`w-12 h-12 rounded-xl ${config.bg} ${config.text} flex items-center justify-center`}>
          {config.icon}
        </div>
        <div>
          <div className="text-lg font-bold text-slate-800">{config.label}</div>
          <div className="text-xs text-slate-500">Severity: {severity}/10</div>
        </div>
        <div className="flex-1 max-w-32">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-400 ${
                severity >= 8 ? "bg-red-500" : severity >= 5 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${(severity / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {WEATHER_OPTIONS.map((w) => {
          const wc = WEATHER_CONFIG[w];
          return (
            <button
              key={w}
              onClick={() => onChangeWeather(w)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-400 ${
                current === w
                  ? `${wc.bg} ${wc.text} shadow-sm ring-1 ring-slate-300`
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {wc.icon}
              <span className="hidden sm:inline">{wc.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
