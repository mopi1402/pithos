import { AlertTriangle } from "lucide-react";
import { isSourceDead } from "@/lib/cache";

export function FallbackBanner({ fallback }: { fallback: { charging: boolean; fuel: boolean } }) {
  const dead: string[] = [];
  const temp: string[] = [];
  if (fallback.charging) (isSourceDead("charging") ? dead : temp).push("IRVE (EV charging)");
  if (fallback.fuel) (isSourceDead("fuel") ? dead : temp).push("Prix-carburants (fuel)");
  if (dead.length === 0 && temp.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {dead.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[12px]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{dead.join(" and ")} API blocked (CORS / access denied) — using demo data, no retry</span>
        </div>
      )}
      {temp.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12px]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{temp.join(" and ")} API unavailable — using demo data</span>
        </div>
      )}
    </div>
  );
}
