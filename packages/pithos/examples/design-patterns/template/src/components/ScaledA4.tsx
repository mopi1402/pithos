import { useRef, useState, useEffect, useCallback } from "react";

const A4_RATIO = 210 / 297;
const A4_BASE_W = 680;
const A4_BASE_H = A4_BASE_W / A4_RATIO;

export function ScaledA4({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const recalc = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const scaleW = width / A4_BASE_W;
    const scaleH = height / A4_BASE_H;
    setScale(Math.min(scaleW, scaleH, 1));
  }, []);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <div style={{ width: A4_BASE_W * scale, height: A4_BASE_H * scale }}>
        <div
          style={{
            width: A4_BASE_W,
            height: A4_BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
