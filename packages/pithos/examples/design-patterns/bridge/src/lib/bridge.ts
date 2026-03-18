/**
 * The Bridge function.
 *
 * Two independent axes: AudioSource × Visualizer.
 * This function is the bridge — it connects a frame of audio data
 * to any renderer, with zero coupling between them.
 */

import type { AudioFrame, Visualizer } from "./types";

export function visualize(
  ctx: CanvasRenderingContext2D,
  frame: AudioFrame,
  renderer: Visualizer,
  w: number,
  h: number,
  accent: string,
  time: number,
): void {
  renderer(ctx, frame, w, h, accent, time);
}
