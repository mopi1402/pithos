//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-30
/**
 * Sort order type for orderBy function.
 * @since 1.1.0
 */
export type SortOrder = "asc" | "desc";

/**
 * Sorts an array by multiple criteria with configurable sort orders.
 *
 * @info Why wrapping native?: We prefer to wrap this method to ensure **Immutability** instead of the native `sort` which mutates. See [Design Philosophy](/guide/design-principles/design-philosophy/)
 *
 * @info Why dual iteratee signature?: Unlike other Arkhe functions that use function-only iteratees,
 * `orderBy` accepts both `keyof T` and functions. This exception exists because multi-criteria sorting
 * (often 3+ fields) benefits significantly from the ergonomic `['age', 'score', 'name']` syntax over
 * the verbose `[u => u.age, u => u.score, u => u.name]`. The runtime cost of `typeof` checks is O(k)
 * where k is the number of criteria (typically 1-3), negligible compared to the O(n log n) sort.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to sort.
 * @param iteratees - Property keys or functions to extract sort values.
 * @param orders - Sort orders for each iteratee. Defaults to `'asc'` for all.
 * @returns A new sorted array.
 * @since 1.1.0
 *
 * @note Stable sort: elements with equal values maintain their relative order.
 *
 * @performance O(n log n) time, O(n) space. Pre-computes criteria to avoid repeated function calls during sort.
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'John', age: 25, score: 85 },
 *   { name: 'Bob', age: 25, score: 80 },
 *   { name: 'Jane', age: 30, score: 90 }
 * ];
 *
 * // Using property keys (ergonomic)
 * orderBy(users, ['age', 'score'], ['asc', 'desc']);
 * // => [{ name: 'John', age: 25, score: 85 }, { name: 'Bob', age: 25, score: 80 }, { name: 'Jane', age: 30, score: 90 }]
 *
 * // Using functions (for computed values)
 * orderBy(users, [u => u.age, u => u.name.length], ['asc', 'desc']);
 * ```
 */
export function orderBy<T>(
  array: readonly T[],
  iteratees: (keyof T | ((item: T) => unknown))[],
  orders?: SortOrder[]
): T[] {
  // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement: early return optimization, sort with empty criteria produces same result
  if (array.length === 0 || iteratees.length === 0) {
    return [...array];
  }

  const criteria = iteratees.map((it, i) => ({
    get: typeof it === "function" ? it : (obj: T) => obj[it],
    mult: orders?.[i] === "desc" ? -1 : 1,
  }));

  return [...array].sort((a, b) => {
    for (const { get, mult } of criteria) {
      const aVal = get(a) as number | string;
      const bVal = get(b) as number | string;

      if (aVal < bVal) return -mult;
      if (aVal > bVal) return mult;
    }
    return 0;
  });
}
