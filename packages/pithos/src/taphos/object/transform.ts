/**
 * Iterates over own enumerable properties of object and accumulates a result.
 *
 * @template T - The type of the object.
 * @template Acc - The type of the accumulator.
 * @param object - The object to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @param accumulator - The initial value.
 * @returns The accumulated value.
 * @deprecated Use `Object.entries().reduce()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries | Object.entries() - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * transform({ a: 1, b: 2, c: 1 }, (result, value, key) => {
 *   (result[value] ||= []).push(key);
 * }, {} as Record<number, string[]>);
 * // => { 1: ['a', 'c'], 2: ['b'] }
 *
 * // ✅ Recommended approach
 * Object.entries({ a: 1, b: 2, c: 1 }).reduce((result, [key, value]) => {
 *   (result[value] ||= []).push(key);
 *   return result;
 * }, {} as Record<number, string[]>);
 * // => { 1: ['a', 'c'], 2: ['b'] }
 * ```
 */
export function transform<T extends object, Acc>(
  object: T,
  iteratee: (accumulator: Acc, value: T[keyof T], key: string, object: T) => void,
  accumulator: Acc
): Acc {
  for (const key of Object.keys(object)) {
    iteratee(accumulator, object[key as keyof T], key, object);
  }
  return accumulator;
}
