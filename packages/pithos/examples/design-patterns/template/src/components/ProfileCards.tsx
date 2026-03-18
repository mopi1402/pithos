import { PROFILES } from "@/data/profiles";
import { PROFILE_ICONS } from "./icons";
import type { ProfileKey } from "@/lib/types";

export function ProfileCards({ profile, onChange, disabled }: {
  profile: ProfileKey;
  onChange: (key: ProfileKey) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {PROFILES.map((p) => {
        const isActive = p.key === profile;
        const Icon = PROFILE_ICONS[p.key];
        return (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            disabled={disabled && !isActive}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group ${
              isActive
                ? "bg-white/[0.06] ring-1 ring-white/[0.08]"
                : "hover:bg-white/[0.03] disabled:opacity-30"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isActive ? "shadow-lg" : "opacity-60 group-hover:opacity-80"
              }`}
              style={{ backgroundColor: isActive ? `${p.color}18` : "rgba(255,255,255,0.03)" }}
            >
              <Icon size={16} color={isActive ? p.color : "#71717a"} />
            </div>
            <div>
              <div className={`text-[12px] font-medium transition-colors ${isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                {p.label}
              </div>
              <div className="text-[10px] text-zinc-700">{p.desc}</div>
            </div>
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function MobileProfileTabs({ profile, onChange, disabled, accentColor }: {
  profile: ProfileKey;
  onChange: (key: ProfileKey) => void;
  disabled: boolean;
  accentColor: string;
}) {
  return (
    <div className="flex gap-2">
      {PROFILES.map((p) => {
        const isActive = p.key === profile;
        return (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            disabled={disabled && !isActive}
            className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 ${
              isActive
                ? "text-white"
                : "bg-white/[0.04] text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
            }`}
            style={isActive ? { backgroundColor: accentColor } : undefined}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
