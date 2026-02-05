import type React from "react";

/**
 * Returns a background color style based on performance ratio.
 * Used for heatmap coloring in benchmark tables.
 *
 * - ratio 1.0 (fastest): bright green
 * - ratio 1.0-1.5: green to yellow-green
 * - ratio 1.5-3.0: yellow-green to orange
 * - ratio 3.0-10: orange to red
 * - ratio 10+: dark red
 */
export function getHeatmapStyle(ratio: number, isFastest: boolean): React.CSSProperties {
  if (isFastest) {
    return { backgroundColor: "rgba(0, 200, 83, 0.35)" };
  }

  if (ratio <= 1.5) {
    const t = (ratio - 1) / 0.5;
    const green = Math.round(200 - t * 50);
    const red = Math.round(t * 100);
    return { backgroundColor: `rgba(${red}, ${green}, 50, 0.25)` };
  } else if (ratio <= 3) {
    const t = (ratio - 1.5) / 1.5;
    const green = Math.round(150 - t * 80);
    const red = Math.round(100 + t * 100);
    return { backgroundColor: `rgba(${red}, ${green}, 30, 0.25)` };
  } else if (ratio <= 10) {
    const t = Math.min((ratio - 3) / 7, 1);
    const green = Math.round(70 - t * 50);
    const red = Math.round(200 + t * 55);
    return { backgroundColor: `rgba(${red}, ${green}, 20, 0.25)` };
  }

  return { backgroundColor: "rgba(255, 50, 50, 0.3)" };
}
