let idCounter = 0;

/**
 * Generates a unique ID. If prefix is given, the ID is appended to it.
 *
 * @param prefix - The value to prefix the ID with.
 * @returns The unique ID string.
 * @since 1.1.0
 *
 * @note IDs are unique within the current runtime session.
 * @note Counter resets on page reload or process restart.
 *
 * @example
 * ```typescript
 * uniqueId();         // => '1'
 * uniqueId();         // => '2'
 * uniqueId('user_');  // => 'user_3'
 * uniqueId('item_');  // => 'item_4'
 *
 * // Use case: Generate unique keys for React
 * const items = data.map(item => ({
 *   ...item,
 *   key: uniqueId('item_')
 * }));
 *
 * // Use case: Create unique DOM IDs
 * const modalId = uniqueId('modal_');
 * ```
 */
export function uniqueId(prefix = ""): string {
  return prefix + ++idCounter;
}
