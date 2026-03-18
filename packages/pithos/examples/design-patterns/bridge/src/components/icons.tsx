import { Sparkles, Waves, Activity, Orbit, Disc3 } from "lucide-react";
import type { VisualizerKey } from "@/lib/types";

export const VIZ_ICONS: Record<VisualizerKey, React.ReactNode> = {
  bars: <Sparkles size={15} />,
  particles: <Waves size={15} />,
  smear: <Activity size={15} />,
  cosmos: <Orbit size={15} />,
  cover: <Disc3 size={15} />,
};

export function VisualizerIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="3" y="18" width="4" height="10" rx="1" fill="#64748b" />
      <rect x="9" y="12" width="4" height="16" rx="1" fill="#94a3b8" />
      <rect x="15" y="6" width="4" height="22" rx="1" fill="#64748b" />
      <rect x="21" y="14" width="4" height="14" rx="1" fill="#94a3b8" />
      <rect x="27" y="20" width="4" height="8" rx="1" fill="#64748b" />
      <circle cx="17" cy="4" r="2" fill="#f43f5e" opacity="0.8" />
    </svg>
  );
}
