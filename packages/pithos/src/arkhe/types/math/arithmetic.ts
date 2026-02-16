/**
 * Arithmetic and mathematical types for common use cases
 *
 * @since 2.0.0
 */

/**
 * Represents a min/max value pair - simple and extensible
 *
 * @example
 * ```typescript
 * const ageRange: MinMax = { min: 18, max: 65 };
 * const priceRange: MinMax = { min: 0, max: 1000 };
 * const scoreConstraints: MinMax = { min: 0, max: 100 };
 * ```
 */
export interface MinMax {
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
}

/**
 * Extends MinMax with inclusivity control for both bounds.
 * @since 2.0.0
 * @example
 * ```typescript
 * const range1: InclusiveMinMax = { min: 0, max: 10 }; // [0, 10) - default
 * const range2: InclusiveMinMax = { min: 0, max: 10, minInclusive: false }; // (0, 10)
 * const range3: InclusiveMinMax = { min: 0, max: 10, maxInclusive: true }; // [0, 10]
 * const range4: InclusiveMinMax = { min: 0, max: 10, minInclusive: false, maxInclusive: true }; // (0, 10]
 * ```
 */
export interface InclusiveMinMax extends MinMax {
  /** Whether the minimum value is inclusive (default: true) */
  minInclusive?: boolean;
  /** Whether the maximum value is inclusive (default: false) */
  maxInclusive?: boolean;
}

/**
 * Represents a percentage calculation.
 * @since 2.0.0
 * @example
 * ```typescript
 * const progress: Percentage = {
 *   value: 75,
 *   total: 100,
 *   percentage: 75
 * };
 * ```
 */
export interface Percentage {
  /** The current value */
  value: number;
  /** The total value */
  total: number;
  /** The calculated percentage */
  percentage: number;
}

/**
 * Represents a mathematical interval with start, end, and optional step.
 * @since 2.0.0
 * @example
 * ```typescript
 * const timeInterval: Interval = {
 *   start: 0,
 *   end: 10,
 *   step: 1
 * };
 * ```
 */
export interface Interval {
  /** Start value of the interval */
  start: number;
  /** End value of the interval */
  end: number;
  /** Step size for progression (default: 1) */
  step?: number;
}
