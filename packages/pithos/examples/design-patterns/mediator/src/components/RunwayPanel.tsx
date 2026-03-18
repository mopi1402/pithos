import type { RunwayCapacity } from "@/lib/dashboard";
import { BRAND_COLOR, RUNWAY_COLORS } from "./constants";

export function RunwayPanel({ capacity, gate, flightId }: {
  capacity: RunwayCapacity;
  gate?: string;
  flightId?: string;
}) {
  const rc = RUNWAY_COLORS[capacity];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: BRAND_COLOR }}>Runway Status</h2>

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-4 h-4 rounded-full ${rc.bg}`} />
        <span className={`text-lg font-bold capitalize ${rc.text}`}>{capacity}</span>
      </div>

      {gate ? (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Assigned Gate</div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono" style={{ color: BRAND_COLOR }}>{gate}</span>
            <span className="text-xs text-slate-500">{flightId}</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
          <p className="text-xs text-slate-400 italic">Select a flight to see gate info</p>
        </div>
      )}
    </div>
  );
}
