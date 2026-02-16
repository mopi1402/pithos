/**
 * This method is like `reduce` except that it iterates over elements of collection from right to left.
 *
 * @template T - The type of elements in the array.
 * @template Accumulator - The type of the accumulated value.
 * @param collection - The collection to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @param accumulator - The initial value.
 * @returns The accumulated value.
 * @deprecated Use `array.reduceRight()` or `Object.values().reverse().reduce()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight | Array.reduceRight() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_reduceright | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values | Object.values() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_values | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const rightSum = reduceRight(numbers, (acc, num) => acc + num, 0);
 * console.log(rightSum); // 15
 *
 * // ✅ Recommended approach (for arrays)
 * const rightSumNative = numbers.reduceRight((acc, num) => acc + num, 0);
 * console.log(rightSumNative); // 15
 *
 * // ✅ Recommended approach (for objects)
 * const obj = { a: 1, b: 2, c: 3 };
 * const rightSumObj = Object.values(obj).reverse().reduce((acc, num) => acc + num, 0);
 * console.log(rightSumObj); // 6
 * ```
 */

export function reduceRight<T, Accumulator>(
  collection: T[],
  iteratee: (accumulator: Accumulator, value: T, index: number, array: T[]) => Accumulator,
  accumulator: Accumulator
): Accumulator;
export function reduceRight<T>(
  collection: T[],
  iteratee: (accumulator: T, value: T, index: number, array: T[]) => T
): T | undefined;
export function reduceRight<T extends Record<string, unknown>, Accumulator>(
  collection: T,
  iteratee: (accumulator: Accumulator, value: T[keyof T], key: keyof T, object: T) => Accumulator,
  accumulator: Accumulator
): Accumulator;
export function reduceRight<T extends Record<string, unknown>>(
  collection: T,
  iteratee: (accumulator: T[keyof T], value: T[keyof T], key: keyof T, object: T) => T[keyof T]
): T[keyof T] | undefined;
// INTENTIONAL: Implementation uses `any` for reduceRight compatibility - TypeScript's reduce signature requires explicit type matching that `unknown` cannot satisfy
export function reduceRight(
  collection: any,
  iteratee: any,
  accumulator?: any
): any {
  if (Array.isArray(collection)) {
    return accumulator !== undefined
      ? collection.reduceRight(iteratee, accumulator)
      : collection.reduceRight(iteratee);
  }

  const entries = Object.entries(collection).reverse();

  if (accumulator !== undefined) {
    return entries.reduce(
      (acc, [key, value]) => iteratee(acc, value, key, collection),
      accumulator
    );
  }

  if (entries.length === 0) {
    return undefined;
  }

  return entries
    .slice(1)
    .reduce(
      (acc, [key, value]) => iteratee(acc, value, key, collection),
      entries[0][1]
    );
}