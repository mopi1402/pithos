//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Finds the element that produces the extreme value according to a comparator.
 *
 * @template T - The type of elements in the array.
 * @template Criterion - The type of the comparison criterion.
 * @param array - The array to search.
 * @param iteratee - A function that returns the comparison value for each element.
 * @param compareFn - Returns true if the first criterion should replace the current extreme.
 * @returns The element with the extreme value, or `undefined` if array is empty.
 * @since 1.1.0
 *
 * @performance O(n) time, O(1) space, uses `for` loop with early return for empty arrays.
 *
 * @example
 * ```typescript
 * findBest(
 *   [{ name: 'John', age: 25 }, { name: 'Bob', age: 20 }],
 *   (u) => u.age,
 *   (a, b) => a < b
 * );
 * // => { name: 'Bob', age: 20 }
 *
 * findBest(['hi', 'hello', 'hey'], (s) => s.length, (a, b) => a > b);
 * // => 'hello'
 * ```
 */
export function findBest<T, Criterion>(
  array: readonly T[],
  iteratee: (value: T) => Criterion,
  compareFn: (a: Criterion, b: Criterion) => boolean
): T | undefined {
  if (array.length === 0) return undefined;

  let extremeValue = array[0];
  let extremeCriterion = iteratee(extremeValue);

  for (let i = 1; i < array.length; i++) {
    const currentCriterion = iteratee(array[i]);

    if (compareFn(currentCriterion, extremeCriterion)) {
      extremeValue = array[i];
      extremeCriterion = currentCriterion;
    }
  }

  return extremeValue;
}
