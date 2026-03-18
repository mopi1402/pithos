import type { SourceId } from "@/lib/pokedex";

export interface LogEntry {
  id: number;
  source: SourceId;
  pokemon: string | null;
  exhausted: boolean;
}

const SOURCE_LABELS: Record<SourceId, string> = {
  byIndex: "IDX",
  byEvolution: "EVO",
  byType: "TYP",
};

export function YieldLog({ log }: { log: LogEntry[] }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
          yield log
        </span>
      </div>
      {log.length === 0 ? (
        <p className="text-sm text-slate-600 font-mono italic">awaiting .next()...</p>
      ) : (
        <div className="space-y-1">
          {log.map((entry) => (
            <LogEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </>
  );
}

function LogEntryRow({ entry }: { entry: LogEntry }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono py-0.5">
      <span className="text-slate-600">{SOURCE_LABELS[entry.source]}</span>
      <span className="text-slate-700">›</span>
      {entry.exhausted ? (
        <span className="text-red-400">{"{ done: true }"}</span>
      ) : (
        <span className="text-green-400">{entry.pokemon}</span>
      )}
    </div>
  );
}
