/**
 * Checks if a value is one of the values in a readonly array.
 *
 * @template T - The string literal type.
 * @param value - The value to check (can be null or undefined).
 * @param source - The readonly array of allowed values.
 * @returns `true` if the value exists in the source array, `false` otherwise.
 * @since 1.1.0
 *
 * @note Returns `false` for null/undefined. Useful for validating string unions.
 *
 * @example
 * ```typescript
 * const statuses = ['pending', 'active', 'done'] as const;
 *
 * isOneOf('pending', statuses);  // => true
 * isOneOf('invalid', statuses);  // => false
 * isOneOf(null, statuses);       // => false
 *
 * // Type narrowing
 * const input: string | null = getInput();
 * if (isOneOf(input, statuses)) {
 *   input; // => 'pending' | 'active' | 'done'
 * }
 * ```
 */
export const isOneOf = <T extends string>(
  value: string | null | undefined,
  source: readonly T[]
): value is T => !!value && source.includes(value as T);
