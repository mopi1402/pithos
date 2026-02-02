/**
 * Extracts the key and value types from a Map and converts them to an array of tuples.
 * @template MapToConvert - The Map type to convert.
 * @since 1.0.0
 * @example
 * ```typescript
 * const userMap = new Map<string, number>([
 *   ["John", 25],
 *   ["Jane", 30]
 * ]);
 *
 * // MapEntries<typeof userMap> resolves to: [string, number][]
 * const entries: MapEntries<typeof userMap> = Array.from(userMap);
 *
 * entries.forEach(([key, value]) => {
 *   // key is typed as string
 *   // value is typed as number
 *   console.log(`${key}: ${value}`);
 * });
 * ```
 */
export type MapEntries<MapToConvert> = MapToConvert extends Map<
  infer Key,
  infer Value
>
  ? [Key, Value][]
  : never;
