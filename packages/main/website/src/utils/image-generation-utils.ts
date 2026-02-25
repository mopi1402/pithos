/**
 * Pure utility functions for image generation logic.
 * Extracted for testability (PBT) without requiring filesystem or sharp.
 */

/**
 * Filter requested widths for generation, enforcing the anti-upscaling invariant.
 *
 * - Keeps only widths ≤ sourceWidth
 * - If ALL widths exceed sourceWidth, returns [sourceWidth] as fallback
 *
 * @param requestedWidths - Array of requested variant widths
 * @param sourceWidth - Actual pixel width of the source image
 * @returns Array of valid widths to generate
 */
export function filterWidthsForGeneration(
  requestedWidths: number[],
  sourceWidth: number,
): number[] {
  const valid = requestedWidths.filter((w) => w <= sourceWidth);
  if (valid.length === 0) {
    return [sourceWidth];
  }
  return valid;
}

/**
 * Count the expected number of variants for a given set of valid widths and formats.
 *
 * @param validWidths - Array of widths that passed upscaling filter
 * @param formats - Array of output format strings
 * @returns Expected number of generated variants
 */
export function countExpectedVariants(
  validWidths: number[],
  formats: string[],
): number {
  return validWidths.length * formats.length;
}
