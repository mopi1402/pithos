import { Globe } from "lucide-react";
import { PLATFORMS } from "@/data/platforms";
import { AppleLogo, AndroidLogo } from "./icons";
import type { Platform } from "@/lib/types";

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  ios: <AppleLogo />,
  android: <AndroidLogo />,
  web: <Globe className="w-4 h-4" />,
};

export function PlatformSwitcher({ platform, onChange }: { platform: Platform; onChange: (p: Platform) => void }) {
  return (
    <div className="flex gap-2">
      {PLATFORMS.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-400 ${
            platform === p.key
              ? "bg-slate-800 text-white shadow-md"
              : "bg-white text-slate-500 hover:bg-slate-200 border border-slate-200"
          }`}
        >
          {PLATFORM_ICONS[p.key]}
          {p.label}
        </button>
      ))}
    </div>
  );
}
