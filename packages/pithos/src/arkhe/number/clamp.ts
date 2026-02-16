/**
 * Clamps a value between min and max bounds.
 *
 * @param value - Value to clamp.
 * @param min - Minimum bound (inclusive).
 * @param max - Maximum bound (inclusive).
 * @returns The clamped value.
 * @throws {RangeError} If min is greater than max.
 * @since 2.0.0
 *
 * @performance O(1)
 *
 * @example
 * ```typescript
 * clamp(5, 0, 10);  // => 5
 * clamp(-5, 0, 10); // => 0
 * clamp(15, 0, 10); // => 10
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new RangeError("min must be <= max");
  return Math.max(min, Math.min(max, value));
}
