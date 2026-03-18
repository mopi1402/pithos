import { getServiceMap, type ServiceKey } from "@/lib/services";
import type { ServiceState } from "@/hooks/useSingletonDemo";

interface ServiceCardProps {
  serviceKey: ServiceKey;
  state: ServiceState;
  onRequest: (key: ServiceKey) => void;
}

export function ServiceCard({ serviceKey, state, onRequest }: ServiceCardProps) {
  const def = getServiceMap()[serviceKey];

  return (
    <div className="relative rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Subtle gradient glow at top */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/[0.07] to-transparent pointer-events-none" />
      <div className="relative bg-white/[0.03] p-3 sm:p-5 space-y-3 sm:space-y-4">
        {/* Icon + name */}
        <div className="flex sm:flex-col sm:items-center gap-2 sm:gap-1.5">
          <span className="text-base sm:text-2xl">{def.icon}</span>
          <div className="min-w-0 flex-1 sm:flex-none sm:text-center">
            <p className="text-xs sm:text-sm font-semibold text-white/80 capitalize">{serviceKey}</p>
            {state.status === "connected" && state.instance && (
              <p className="text-[9px] sm:text-[10px] text-white/25 font-mono mt-0.5 truncate">
                id: {state.instance.id}
              </p>
            )}
          </div>
          <div className="sm:hidden">
            <StatusDot status={state.status} />
          </div>
        </div>

        {/* Status (desktop: centered) */}
        <div className="hidden sm:flex flex-col items-center gap-2">
          <StatusDot status={state.status} />
          <StatusLabel status={state.status} />
        </div>

        {/* Status + button row (mobile) / button only (desktop) */}
        <div className="flex items-center justify-between sm:justify-center">
          <div className="sm:hidden">
            <StatusLabel status={state.status} />
          </div>
          <button
            onClick={() => onRequest(serviceKey)}
            disabled={state.status === "connecting"}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 sm:w-full rounded-lg text-[10px] sm:text-xs font-medium transition-all disabled:opacity-30 ${
              state.status === "connected"
                ? "bg-white/[0.06] text-white/50 hover:bg-white/[0.1]"
                : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/20"
            }`}
          >
            {state.status === "connected" ? `Ping${state.requestCount > 1 ? ` (${state.requestCount})` : ""}` : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}


function StatusDot({ status }: { status: ServiceState["status"] }) {
  if (status === "idle") {
    return <span className="w-2 h-2 rounded-full bg-white/10" />;
  }
  if (status === "connecting") {
    return <div className="w-3 h-3 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />;
  }
  return <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />;
}

function StatusLabel({ status }: { status: ServiceState["status"] }) {
  if (status === "idle") {
    return <span className="text-[10px] text-white/20">Not initialized</span>;
  }
  if (status === "connecting") {
    return <span className="text-[10px] text-cyan-400">Initializing...</span>;
  }
  return (
    <span className="text-[10px] text-emerald-400/70">
      Connected · same instance
    </span>
  );
}
