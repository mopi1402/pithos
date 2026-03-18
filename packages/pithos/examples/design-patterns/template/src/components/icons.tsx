import type { ProfileKey } from "@/lib/types";

export function CvIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect x="5" y="2" width="22" height="28" rx="2" fill="#334155" />
      <rect x="8" y="5" width="8" height="8" rx="1" fill="#64748b" />
      <rect x="18" y="6" width="6" height="2" rx="1" fill="#94a3b8" />
      <rect x="18" y="10" width="5" height="1.5" rx="0.75" fill="#64748b" />
      <rect x="8" y="16" width="16" height="0.5" rx="0.25" fill="#475569" />
      <rect x="8" y="19" width="16" height="1.5" rx="0.75" fill="#64748b" />
      <rect x="8" y="22" width="13" height="1.5" rx="0.75" fill="#64748b" />
      <rect x="8" y="25" width="15" height="1.5" rx="0.75" fill="#64748b" />
    </svg>
  );
}

function DevIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function DesignIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function ManagerIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export const PROFILE_ICONS: Record<ProfileKey, (props: { size?: number; color?: string }) => React.ReactNode> = {
  developer: DevIcon,
  designer: DesignIcon,
  manager: ManagerIcon,
};
