import { useEffect, useRef } from "react";
import { readFrame } from "@/lib/audio";
import { visualize } from "@/lib/bridge";
import { VISUALIZERS } from "@/data/tracks";
import type { VisualizerKey } from "@/lib/types";

export function VisualizerCanvas({ vizKey, accent, playing }: {
  vizKey: VisualizerKey;
  accent: string;
  playing: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const vizMeta = VISUALIZERS.find((v) => v.key === vizKey);
    if (!vizMeta) return;

    const dprInit = window.devicePixelRatio || 1;
    const rectInit = canvas.getBoundingClientRect();
    canvas.width = Math.round(rectInit.width * dprInit);
    canvas.height = Math.round(rectInit.height * dprInit);

    const render = () => {
      if (!playingRef.current) { rafRef.current = requestAnimationFrame(render); return; }

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (vizKey === "smear" || vizKey === "bars" || vizKey === "cosmos" || vizKey === "cover") {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgba(10, 10, 11, 1)";
        ctx.fillRect(0, 0, w, h);
      } else {
        const fadeMap: Record<string, number> = { bars: 0.05, particles: 0.04 };
        const fadeAlpha = fadeMap[vizKey] ?? 0.05;
        ctx.fillStyle = `rgba(10, 10, 11, ${fadeAlpha})`;
        ctx.fillRect(0, 0, w, h);
      }

      const frame = readFrame();
      visualize(ctx, frame, vizMeta.fn, w, h, accent, performance.now() / 1000);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [vizKey, accent]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />;
}
