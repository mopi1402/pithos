import type { FilterState } from "./types";
import { buildCSSFilter } from "./filters";

export const THUMB_W = 160;
export const THUMB_H = 90;
export const SAMPLE_IMAGE = "/demos/design-patterns/memento/sample.jpg";

export function loadImageToCanvas(canvas: HTMLCanvasElement, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No 2d context"));
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export function renderThumbnail(
  sourceCanvas: HTMLCanvasElement,
  filters: FilterState,
  tw: number = THUMB_W,
  th: number = THUMB_H,
): string {
  const offscreen = document.createElement("canvas");
  offscreen.width = tw;
  offscreen.height = th;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return "";
  ctx.filter = buildCSSFilter(filters);
  ctx.drawImage(sourceCanvas, 0, 0, tw, th);
  return offscreen.toDataURL("image/jpeg", 0.6);
}
