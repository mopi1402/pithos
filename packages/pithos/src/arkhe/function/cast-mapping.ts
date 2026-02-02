//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Creates a mapping function from a property key, function, or identity.
 *
 * @template Item - The type of items being mapped.
 * @template Key - The type of the property key.
 * @template Result - The type of the mapping result.
 * @param input - Property key, mapping function, or nullish (identity).
 * @returns A mapping function.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const users = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }];
 *
 * // Property key → accessor
 * users.map(castMapping('name'));
 * // => ['Alice', 'Bob']
 *
 * // Function → itself
 * users.map(castMapping((u) => u.name.length));
 * // => [5, 3]
 *
 * // Nullish → identity
 * users.map(castMapping());
 * // => [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]
 * ```
 */

export function castMapping<Item, Key extends keyof Item>(
  key: Key
): (item: Item) => Item[Key];
export function castMapping<Item, Result>(
  mapper: (item: Item) => Result
): (item: Item) => Result;
export function castMapping<Item>(input?: null): (item: Item) => Item;
export function castMapping<Item, Key extends keyof Item, Result>(
  input?: Key | ((item: Item) => Result) | null
): (item: Item) => Item[Key] | Result | Item {
  if (typeof input === "function") {
    return input;
  }

  if (input != null) {
    return (item) => item[input];
  }

  return (item) => item;
}
