import type { Flight } from "@/lib/dashboard";
import { SplitFlapStatus } from "./SplitFlap";

export function FlightListPanel({ flights, selectedId, onSelect }: {
  flights: Flight[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-slate-900 rounded-xl p-4 shadow-lg">
      <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-amber-400">Departures</h2>
      <div className="flex items-center gap-2 pb-2 border-b border-slate-700 mb-1">
        <span className="text-[9px] font-mono text-slate-500 uppercase w-12 shrink-0">Flight</span>
        <span className="text-[9px] font-mono text-slate-500 uppercase flex-1">Destination</span>
        <span className="text-[9px] font-mono text-slate-500 uppercase w-12 shrink-0">Time</span>
        <span className="text-[9px] font-mono text-slate-500 uppercase w-28 shrink-0">Status</span>
      </div>
      <div className="space-y-0.5">
        {flights.map((f) => {
          const selected = f.id === selectedId;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className={`w-full flex items-center gap-2 py-1.5 rounded text-left transition-colors uppercase ${
                selected ? "bg-slate-700/60" : "hover:bg-slate-800"
              }`}
            >
              <span className="text-xs font-mono font-bold text-white w-12 shrink-0">{f.id}</span>
              <span className="text-xs font-mono text-slate-300 truncate flex-1">{f.destination}</span>
              <span className="text-xs font-mono text-amber-400/80 w-12 shrink-0 text-center">{f.scheduledTime}</span>
              <span className="shrink-0 flex justify-end">
                <SplitFlapStatus status={f.status} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
