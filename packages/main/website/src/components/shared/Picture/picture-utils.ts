/**
 * Pure utility functions for the Picture component.
 * Extracted for testability (PBT) without requiring JSX context.
 */

/**
 * Compute the densities array based on displaySize, sourceWidth, and explicit densities.
 *
 * - If explicitDensities is provided → use as-is
 * - Otherwise → [1, 2, 3], capped by maxDpr if provided
 * - If sourceWidth is known, further cap so we don't exceed source resolution
 */
export function computeDensities(
  displaySize: number,
  sourceWidth?: number,
  explicitDensities?: number[],
  maxDpr?: number,
): number[] {
  if (explicitDensities != null) {
    return explicitDensities;
  }
  const allDensities = [1, 2, 3];
  return allDensities.filter((d) => {
    if (maxDpr != null && d > maxDpr) return false;
    if (sourceWidth != null && displaySize * d > sourceWidth) return false;
    return true;
  });
}

/**
 * Compute the widths for density mode srcSet.
 *
 * For each density d, calculates displaySize × d, caps at sourceWidth, and deduplicates.
 * Deduplication rule: a capped width is kept only if strictly greater than the largest already retained.
 */
export function computeWidths(
  displaySize: number,
  densities: number[],
  sourceWidth?: number,
): number[] {
  const result: number[] = [];
  for (const d of densities) {
    let w = Math.round(displaySize * d);
    if (sourceWidth != null && w > sourceWidth) {
      w = sourceWidth;
    }
    const maxRetained = result.length > 0 ? result[result.length - 1]! : -1;
    if (w > maxRetained) {
      result.push(w);
    }
  }
  return result;
}
