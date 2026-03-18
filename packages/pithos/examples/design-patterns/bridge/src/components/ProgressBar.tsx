import { useRef, useEffect } from "react";
import { getCurrentTime, getDuration, seekTo } from "@/lib/audio";

export function ProgressBar({ accent }: { accent: string }) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const curRef = useRef<HTMLSpanElement | null>(null);
  const durRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef(0);
  const draggingRef = useRef(false);
  const dragFracRef = useRef(0);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const getFrac = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  useEffect(() => {
    const update = () => {
      const dur = getDuration();
      if (dur <= 0) {
        if (barRef.current) barRef.current.style.width = "0%";
        if (curRef.current) curRef.current.textContent = "--";
        if (durRef.current) durRef.current.textContent = "--";
        rafRef.current = requestAnimationFrame(update);
        return;
      }
      if (draggingRef.current) {
        const previewTime = dragFracRef.current * dur;
        if (barRef.current) barRef.current.style.width = `${dragFracRef.current * 100}%`;
        if (curRef.current) curRef.current.textContent = fmt(previewTime);
      } else {
        const cur = getCurrentTime();
        if (barRef.current) barRef.current.style.width = `${(cur / dur) * 100}%`;
        if (curRef.current) curRef.current.textContent = fmt(cur);
      }
      if (durRef.current) durRef.current.textContent = fmt(dur);
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (draggingRef.current) dragFracRef.current = getFrac(e.clientX); };
    const onUp = () => { if (!draggingRef.current) return; draggingRef.current = false; const dur = getDuration(); if (dur > 0) seekTo(dragFracRef.current * dur); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-5 bg-white/[0.06] rounded-full overflow-hidden cursor-pointer relative" onMouseDown={(e) => { draggingRef.current = true; dragFracRef.current = getFrac(e.clientX); }}>
      <div ref={barRef} className="h-full rounded-full pointer-events-none" style={{ backgroundColor: accent, width: "0%" }} />
      <span className="absolute inset-0 flex items-center justify-center text-[11px] text-white font-mono pointer-events-none">
        <span ref={curRef}>0:00</span>
        <span className="mx-1 opacity-50">/</span>
        <span ref={durRef} className="font-bold">0:00</span>
      </span>
    </div>
  );
}
