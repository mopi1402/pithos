/**
 * Functional Flyweight Pattern.
 *
 * In OOP, the Flyweight pattern requires separating intrinsic state (shared)
 * from extrinsic state (unique), with a factory that caches and reuses objects
 * with the same intrinsic state to minimize memory consumption.
 *
 * In functional TypeScript, this is memoization/caching. Arkhe provides
 * `memoize` which caches function results based on arguments (the "intrinsic"
 * state). The extrinsic state is passed at call time.
 *
 * This module re-exports `memoize` from Arkhe for discoverability.
 *
 * @module eidos/flyweight
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { memoize } from "@pithos/core/eidos/flyweight/flyweight";
 * // or directly from Arkhe:
 * import { memoize } from "@arkhe/function/memoize";
 *
 * // Flyweight factory: creates/caches car configs by intrinsic state
 * const getCarConfig = memoize((brand: string, model: string, color: string) => ({
 *   brand,
 *   model,
 *   color,
 *   // ... expensive computed properties
 * }));
 *
 * // Extrinsic state (unique per instance) passed separately
 * const car1 = { config: getCarConfig("BMW", "M5", "red"), plates: "ABC123", owner: "Alice" };
 * const car2 = { config: getCarConfig("BMW", "M5", "red"), plates: "XYZ789", owner: "Bob" };
 *
 * // Same config object is reused (flyweight)
 * car1.config === car2.config; // true
 * ```
 */

// Re-export from Arkhe for discoverability
export { memoize } from "@arkhe/function/memoize";
