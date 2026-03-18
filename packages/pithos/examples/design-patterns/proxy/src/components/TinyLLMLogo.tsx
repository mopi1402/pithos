export function TinyLLMLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield body */}
      <path
        d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.4 4.6-1.25 8-6.15 8-11.4V6l-8-4z"
        fill="url(#shield-grad)"
        opacity="0.9"
      />
      {/* Inner glow */}
      <path
        d="M12 4L6 7.2v4.3c0 4.2 2.7 8.1 6 9.1 3.3-1 6-4.9 6-9.1V7.2L12 4z"
        fill="url(#inner-grad)"
        opacity="0.5"
      />
      {/* Robot face */}
      <rect x="9" y="9.5" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
      <rect x="13" y="9.5" width="2" height="2" rx="0.5" fill="white" opacity="0.9" />
      <rect x="10" y="13" width="4" height="1.5" rx="0.75" fill="white" opacity="0.6" />
      {/* Antenna */}
      <line x1="12" y1="6" x2="12" y2="8" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <circle cx="12" cy="5.5" r="1" fill="white" opacity="0.8" />
      <defs>
        <linearGradient id="shield-grad" x1="4" y1="2" x2="20" y2="22">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="inner-grad" x1="6" y1="4" x2="18" y2="20">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
