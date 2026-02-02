/**
 * Reduces collection to a value which is the accumulated result of running each element in collection thru iteratee.
 *
 * @template T - The type of elements in the array.
 * @template Accumulator - The type of the accumulated value.
 * @param collection - The collection to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @param accumulator - The initial value.
 * @returns The accumulated value.
 * @deprecated Use `array.reduce()` or `Object.values().reduce()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce | Array.reduce() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_reduce | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values | Object.values() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_values | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const sum = reduce(numbers, (acc, num) => acc + num, 0);
 * console.log(sum); // 15
 *
 * // ✅ Recommended approach (for arrays)
 * const sumNative = numbers.reduce((acc, num) => acc + num, 0);
 * console.log(sumNative); // 15
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const sumObj = Object.values(obj).reduce((acc, num) => acc + num, 0);
 * console.log(sumObj); // 6
 * ```
 */

export function reduce<T, Accumulator>(
  collection: T[],
  iteratee: (accumulator: Accumulator, value: T, index: number, array: T[]) => Accumulator,
  accumulator: Accumulator
): Accumulator;
export function reduce<T>(
  collection: T[],
  iteratee: (accumulator: T, value: T, index: number, array: T[]) => T
): T | undefined;
export function reduce<T extends Record<string, unknown>, Accumulator>(
  collection: T,
  iteratee: (accumulator: Accumulator, value: T[keyof T], key: keyof T, object: T) => Accumulator,
  accumulator: Accumulator
): Accumulator;
// INTENTIONAL: Implementation uses `any` for reduce compatibility - TypeScript's reduce signature requires explicit type matching that `unknown` cannot satisfy
export function reduce(
  collection: any,
  iteratee: any,
  accumulator?: any
): any {
  if (Array.isArray(collection)) {
    return accumulator !== undefined
      ? collection.reduce(iteratee, accumulator)
      : collection.reduce(iteratee);
  }

  const entries = Object.entries(collection);

  if (accumulator !== undefined) {
    return entries.reduce(
      (acc, [key, value]) => iteratee(acc, value, key, collection),
      accumulator
    );
  }

  if (entries.length === 0) {
    return undefined;
  }

  const [, firstValue] = entries[0];
  return entries
    .slice(1)
    .reduce((acc, [key, value]) => iteratee(acc, value, key, collection), firstValue);
}