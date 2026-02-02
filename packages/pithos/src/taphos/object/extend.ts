import { assign } from "./assign";

/**
 * Assigns own enumerable string keyed properties of source objects to the destination object.
 *
 * Alias for {@link assign}.
 *
 * @template Target - The type of the destination object.
 * @template Source - The type of the source objects.
 * @param object - The destination object.
 * @param sources - The source objects.
 * @returns The destination object.
 * @deprecated Use `Object.assign()` or spread syntax directly instead.
 * Reason: Alias of {@link assign}
 * @see {@link assign}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign | Object.assign() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_assign | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const target = { a: 1, b: 2 };
 * const source1 = { b: 3, c: 4 };
 * const source2 = { c: 5, d: 6 };
 *
 * // ❌ Deprecated approach
 * const result = extend(target, source1, source2);
 * console.log(result); // { a: 1, b: 3, c: 5, d: 6 }
 *
 * // ✅ Recommended approach (mutable)
 * const resultNative = Object.assign(target, source1, source2);
 * console.log(resultNative); // { a: 1, b: 3, c: 5, d: 6 }
 *
 * // ✅ Recommended approach (immutable)
 * const resultImmutable = { ...target, ...source1, ...source2 };
 * console.log(resultImmutable); // { a: 1, b: 3, c: 5, d: 6 }
 * ```
 */
export function extend<
    Target extends Record<string, unknown>,
    Source extends Record<string, unknown>
>(object: Target, ...sources: Source[]): Target & Source {
    return assign(object, ...sources);
}