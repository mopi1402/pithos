const CLAY_NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='clay'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23clay)'/%3E%3C/svg%3E")`;

export function ClayNoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.6,
        backgroundImage: CLAY_NOISE_SVG,
        mixBlendMode: "multiply",
        zIndex: 1,
      }}
    />
  );
}

export const clayCourtStyle = {
  position: "relative" as const,
  overflow: "hidden" as const,
};
