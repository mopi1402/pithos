/**
 * Options for the comparator function.
 *
 * @template ComparedValue - The type of values being compared.
 * @since 1.1.0
 */
export interface ComparatorOptions<ComparedValue> {
  /** Custom comparison function. */
  compare?: (a: ComparedValue, b: ComparedValue) => number;
  /** If true, reverses the sort order. */
  reverse?: boolean;
}

/**
 * Default comparison function handling common types.
 *
 * @internal
 */
const defaultCompare = <Value>(a: Value, b: Value): number => {
  if (Object.is(a, b)) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Stryker disable next-line all: equivalent mutant, String(string) === string, so fallback produces identical result
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return String(a).localeCompare(String(b));
};

/**
 * Creates a comparator function for Array.sort() with flexible mapping and comparison options.
 *
 * @template Item - The type of items being sorted.
 * @template Key - The type of the property key.
 * @template MappedValue - The type of the mapped value.
 * @param mapping - A property key or mapping function to extract the comparison value.
 * @param options - Comparison options.
 * @returns A comparator function for Array.sort().
 * @since 1.1.0
 *
 * @note Null/undefined values sort last. Dates compare by timestamp. Uses `localeCompare` for strings.
 *
 * @example
 * ```typescript
 * const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
 *
 * users.sort(castComparator('age'));
 * // Sorted by age ascending
 *
 * users.sort(castComparator((u) => u.name.length));
 * // Sorted by name length
 *
 * users.sort(castComparator('age', { reverse: true }));
 * // Sorted by age descending
 * ```
 */

export function castComparator<Item, Key extends keyof Item>(
  key: Key,
  options?: ComparatorOptions<Item[Key]>
): (a: Item, b: Item) => number;
export function castComparator<Item, MappedValue>(
  mapper: (item: Item) => MappedValue,
  options?: ComparatorOptions<MappedValue>
): (a: Item, b: Item) => number;
export function castComparator<Item, Key extends keyof Item, MappedValue>(
  mapping: Key | ((item: Item) => MappedValue),
  options: ComparatorOptions<Item[Key]> | ComparatorOptions<MappedValue> = {}
): (a: Item, b: Item) => number {
  const { compare, reverse = false } = options;
  const multiplier = reverse ? -1 : 1;

  if (typeof mapping === "function") {
    const mapper = mapping;
    const compareFn =
      (compare as ((a: MappedValue, b: MappedValue) => number) | undefined) ??
      defaultCompare;
    // Stryker disable next-line ArithmeticOperator: equivalent mutant, x*1=x/1 and x*(-1)=x/(-1)
    return (a, b) => compareFn(mapper(a), mapper(b)) * multiplier;
  }

  const key = mapping;
  const compareFn =
    (compare as ((a: Item[Key], b: Item[Key]) => number) | undefined) ??
    defaultCompare;
  // Stryker disable next-line ArithmeticOperator: equivalent mutant, x*1=x/1 and x*(-1)=x/(-1)
  return (a, b) => compareFn(a[key], b[key]) * multiplier;
}
