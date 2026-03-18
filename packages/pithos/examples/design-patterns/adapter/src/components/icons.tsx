export function RoadLogo({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <polygon points="0,32 32,32 23.5,2 8.5,2" fill="#475569" />
      <line x1="0" y1="32" x2="8.5" y2="2" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="32" y1="32" x2="23.5" y2="2" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="16" y1="28" x2="16" y2="23" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="19" x2="16" y2="15.5" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16" y1="12" x2="16" y2="9.5" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="7" x2="16" y2="5.5" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}
