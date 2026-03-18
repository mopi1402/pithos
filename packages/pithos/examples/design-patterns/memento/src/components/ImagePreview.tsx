import { useRef, useEffect } from "react";
import type { FilterState } from "@/lib/photoEditor";
import { buildCSSFilter } from "@/lib/photoEditor";

export function ImagePreview({ sourceRef, filters, loaded }: {
  sourceRef: React.RefObject<HTMLCanvasElement | null>;
  filters: FilterState;
  loaded: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const source = sourceRef.current;
    const canvas = canvasRef.current;
    if (!source || !canvas || !loaded) return;
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = buildCSSFilter(filters);
    ctx.drawImage(source, 0, 0);
  }, [sourceRef, filters, loaded]);

  if (!loaded) return <div className="w-full aspect-video rounded-lg bg-white/[0.03] animate-pulse" />;

  return <canvas ref={canvasRef} className="max-w-full max-h-full rounded-lg object-contain shadow-2xl shadow-black/60" style={{ display: "block" }} />;
}
