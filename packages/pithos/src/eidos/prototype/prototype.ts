/**
 * Functional Prototype Pattern.
 *
 * In OOP, the Prototype pattern requires a `clone()` method on objects to
 * create copies without coupling to concrete classes.
 *
 * In functional TypeScript with immutable data, this is covered by Arkhe:
 * - `deepClone` for deep copies (handles circular refs, Date, Map, Set, etc.)
 * - `deepCloneFull` for binary data (TypedArrays, ArrayBuffer, Blob, File)
 * - Spread operator `{ ...obj }` for shallow copies
 *
 * This module re-exports Arkhe's clone functions for discoverability.
 *
 * @module eidos/prototype
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { deepClone } from "@pithos/core/eidos/prototype/prototype";
 * // or directly from Arkhe:
 * import { deepClone } from "@arkhe/object/deep-clone";
 *
 * const original = { a: 1, b: { c: 2 }, d: new Map([["x", 1]]) };
 * const cloned = deepClone(original);
 *
 * // For shallow copies, just use spread:
 * const shallow = { ...original, a: 99 };
 * ```
 */

// Re-export from Arkhe for discoverability
export { deepClone } from "@arkhe/object/deep-clone";
export { deepCloneFull } from "@arkhe/object/deep-clone-full";
