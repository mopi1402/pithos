import type { RefCheck } from "@/lib/configPrototype";

export function StepCompare({ refs, diffs, leaked }: {
  refs: RefCheck[] | null;
  diffs: { path: string; original: string; cloned: string }[];
  leaked: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col gap-3">
      {/* References */}
      <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="h-9 px-3 flex items-center border-b border-white/[0.04]">
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Object references</span>
        </div>
        <div className="p-3">
          {refs ? (
            <div className="space-y-1.5">
              {refs.map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <code className="text-white/40 font-mono text-[11px]">{r.label}</code>
                  {r.shared ? (
                    <span className="text-red-400 text-[10px] font-medium bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">shared ⚠️</span>
                  ) : (
                    <span className="text-emerald-400 text-[10px] font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">isolated ✓</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-white/20 text-center">No clone yet</p>
          )}
        </div>
      </div>

      {/* Diff */}
      <div className="bg-gradient-to-b from-[#1a1a1f] to-[#141417] rounded-xl border border-white/[0.06] overflow-hidden flex-1">
        <div className="h-9 px-3 flex items-center border-b border-white/[0.04]">
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider font-mono">$ diff prod staging</span>
        </div>
        <div className="p-3">
          {diffs.length > 0 ? (
            <div className="space-y-1 font-mono text-[11px]">
              {diffs.map((d) => (
                <div key={d.path}>
                  <div className="text-red-400/70">- {d.path}: {d.original}</div>
                  <div className="text-emerald-400/70">+ {d.path}: {d.cloned}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-white/20 font-mono">No changes made to staging</p>
          )}
          {leaked && (
            <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-red-400 font-mono">
              ⚠ shallow copy leaked mutations to production
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
