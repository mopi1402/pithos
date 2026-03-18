import { useRef, useCallback, useEffect } from "react";
import type { Flight } from "@/lib/dashboard";
import { STATUS_FLAP_COLORS } from "./constants";

const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ-";

export function SplitFlapStatus({ status }: { status: Flight["status"] }) {
  const label = status.toUpperCase().padEnd(9, " ");
  const color = STATUS_FLAP_COLORS[status];

  return (
    <div className="flex gap-px">
      {label.split("").map((char, i) => (
        <SplitFlapChar key={i} char={char} color={color} index={i} />
      ))}
    </div>
  );
}

function SplitFlapChar({ char, color, index }: { char: string; color: string; index: number }) {
  const cellRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef(" ");
  const animatingRef = useRef(false);
  const targetCharRef = useRef(char);
  targetCharRef.current = char;

  const runFlips = useCallback(async () => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const el = cellRef.current;
    if (!el) { animatingRef.current = false; return; }

    const layers = Array.from(el.querySelectorAll<HTMLSpanElement>(".flap-layer"));
    const [unfoldTop, unfoldBottom, foldTop, foldBottom] = layers;

    await new Promise((r) => setTimeout(r, index * 30));

    while (currentRef.current !== targetCharRef.current) {
      const idx = Math.max(0, FLAP_CHARS.indexOf(currentRef.current));
      const nextIdx = (idx + 1) % FLAP_CHARS.length;
      const nextChar = FLAP_CHARS[nextIdx];
      const currentChar = FLAP_CHARS[idx];

      unfoldTop.textContent = nextChar;
      unfoldBottom.textContent = nextChar;
      foldTop.textContent = currentChar;
      foldBottom.textContent = currentChar;

      await Promise.all([
        unfoldBottom.animate(
          { transform: ["rotateX(180deg)", "rotateX(0deg)"] },
          { duration: 35, easing: "ease-out", fill: "forwards" },
        ).finished,
        foldTop.animate(
          { transform: ["rotateX(0deg)", "rotateX(-180deg)"] },
          { duration: 35, easing: "ease-in", fill: "forwards" },
        ).finished,
      ]);

      for (const l of layers) l.textContent = nextChar;
      unfoldBottom.getAnimations().forEach((a) => a.cancel());
      foldTop.getAnimations().forEach((a) => a.cancel());
      currentRef.current = nextChar;
    }

    animatingRef.current = false;
  }, [index]);

  useEffect(() => {
    if (targetCharRef.current !== currentRef.current && !animatingRef.current) {
      runFlips();
    }
  });

  const layerBase = "flap-layer absolute inset-0 flex items-center justify-center text-xs font-mono font-bold leading-none";
  const bg = { backgroundColor: "#1e293b" };

  return (
    <span ref={cellRef} className={`relative inline-block w-3.5 h-5 ${color}`} style={{ perspective: "80px", ...bg }}>
      <span className={layerBase} style={{ ...bg, clipPath: "polygon(0 0, 100% 0, 100% 49.5%, 0 49.5%)", borderRadius: "2px 2px 0 0" }}>{" "}</span>
      <span className={layerBase} style={{ ...bg, clipPath: "polygon(0 50.5%, 100% 50.5%, 100% 100%, 0 100%)", borderRadius: "0 0 2px 2px", transformOrigin: "center top", backfaceVisibility: "hidden" }}>{" "}</span>
      <span className={layerBase} style={{ ...bg, clipPath: "polygon(0 0, 100% 0, 100% 49.5%, 0 49.5%)", borderRadius: "2px 2px 0 0", transformOrigin: "center bottom", backfaceVisibility: "hidden", zIndex: 2 }}>{" "}</span>
      <span className={layerBase} style={{ ...bg, clipPath: "polygon(0 50.5%, 100% 50.5%, 100% 100%, 0 100%)", borderRadius: "0 0 2px 2px" }}>{" "}</span>
      <span className="absolute inset-x-0 top-1/2 bg-black/40 z-10" style={{ height: "0.5px" }} />
    </span>
  );
}
