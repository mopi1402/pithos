export function TracelyLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Rounded square background */}
      <rect x="1" y="1" width="22" height="22" rx="5" fill="url(#trc-bg)" />

      {/* Pulse/trace line — a heartbeat-style path */}
      <path
        d="M4 13h3l1.5-4 2 8 2-6 1.5 3H20"
        stroke="url(#trc-line)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Small dot at the end of the trace */}
      <circle cx="20" cy="14" r="1.2" fill="#1CE783" />

      <defs>
        <linearGradient id="trc-bg" x1="1" y1="1" x2="23" y2="23">
          <stop stopColor="#064E3B" />
          <stop offset="1" stopColor="#0E3A4A" />
        </linearGradient>
        <linearGradient id="trc-line" x1="4" y1="12" x2="20" y2="12">
          <stop stopColor="#1CE783" />
          <stop offset="1" stopColor="#0ED7E8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
