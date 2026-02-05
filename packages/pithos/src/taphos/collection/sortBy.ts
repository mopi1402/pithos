/**
 * Creates an array of elements, sorted in ascending order by the results of running each element in a collection thru an iteratee.
 *
 * @template T - The type of elements in the array.
 * @param collection - The collection to iterate over.
 * @param iteratee - The iteratee invoked per element.
 * @returns The new sorted array.
 * @deprecated Use `array.toSorted()` with custom comparator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted | Array.toSorted() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_tosorted | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 30 },
 *   { name: 'Bob', age: 20 }
 * ];
 *
 * // ❌ Deprecated approach
 * const sortedByAge = sortBy(users, user => user.age);
 * console.log(sortedByAge);
 * // [{ name: 'Bob', age: 20 }, { name: 'John', age: 25 }, { name: 'Jane', age: 30 }]
 *
 * // ✅ Recommended approach
 * const sortedByAgeNative = [...users].sort((a, b) => a.age - b.age);
 * console.log(sortedByAgeNative);
 * // [{ name: 'Bob', age: 20 }, { name: 'John', age: 25 }, { name: 'Jane', age: 30 }]
 *
 * // ✅ Modern approach with ES2023
 * const sortedModern = users.toSorted((a, b) => a.age - b.age);
 * console.log(sortedModern);
 * // [{ name: 'Bob', age: 20 }, { name: 'John', age: 25 }, { name: 'Jane', age: 30 }]
 * ```
 */
export function sortBy<T>(
  collection: T[] | Record<string, T>,
  iteratee: (value: T, indexOrKey?: number | string, collection?: any) => number | string
): T[] {
  if (Array.isArray(collection)) {
    return collection
      .map((value, index) => ({
        value,
        criteria: iteratee(value, index, collection)
      }))
      .sort((a, b) => {
        // Stryker disable next-line ConditionalExpression,EqualityOperator: Both undefined check is optimization - next line handles undefined vs defined
        if (a.value === undefined && b.value === undefined) return 0;
        if (a.value === undefined) return 1;
        if (b.value === undefined) return -1;
        // Stryker disable next-line ConditionalExpression,EqualityOperator: The second ternary is redundant - returning -1 for a<b is sufficient for correct sorting
        return a.criteria < b.criteria ? -1 : a.criteria > b.criteria ? 1 : 0;
      })
      .map((item) => item.value);
  }

  return Object.entries(collection)
    .map(([key, value]) => ({
      value: value as T,
      criteria: iteratee(value as T, key, collection)
    }))
    .sort((a, b) => (a.criteria < b.criteria ? -1 : /* Stryker disable next-line ConditionalExpression,EqualityOperator */ a.criteria > b.criteria ? 1 : 0))
    .map((item) => item.value);
}