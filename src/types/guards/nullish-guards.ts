import { Nullable, Nullish, Optional } from "../common";

/**
 * Checks if a nullable value is not null.
 * Type guard that narrows Nullable<T> to T by excluding null.
 * @param value - The nullable value to check
 * @returns True if the value is not null, false otherwise
 * @example
 * ```typescript
 * function process(data: Nullable<string>) {
 *   if (isNonNull(data)) {
 *     // data is now typed as string
 *     console.log(data.toUpperCase());
 *   }
 * }
 * ```
 */
export const isNonNull = <T>(value: Nullable<T>): value is T => value !== null;

/**
 * Checks if an optional value is not undefined.
 * Type guard that narrows Optional<T> to T by excluding undefined.
 * @param value - The optional value to check
 * @returns True if the value is not undefined, false otherwise
 * @example
 * ```typescript
 * function process(data: Optional<string>) {
 *   if (isNonUndefined(data)) {
 *     // data is now typed as string
 *     console.log(data.length);
 *   }
 * }
 * ```
 */
export const isNonUndefined = <T>(value: Optional<T>): value is T =>
  value !== undefined;

/**
 * Checks if a nullish value is neither null nor undefined.
 * Type guard that narrows Nullish<T> to T by excluding null and undefined.
 * @param value - The nullish value to check
 * @returns True if the value is neither null nor undefined, false otherwise
 * @example
 * ```typescript
 * function process(data: Nullish<string>) {
 *   if (isNonNullish(data)) {
 *     // data is now typed as string
 *     console.log(data.trim());
 *   }
 * }
 * ```
 */
export const isNonNullish = <T>(value: Nullish<T>): value is T =>
  value !== null && value !== undefined;

/**
 * Checks if a value is nullish (null or undefined).
 * @param value - The value to check
 * @returns True if the value is null or undefined, false otherwise
 * @example
 * ```typescript
 * if (isNullish(data.optional)) {
 *   // Handle nullish case
 *   console.log('Value is null or undefined');
 * }
 * ```
 */
export const isNullish = (value: unknown): value is null | undefined =>
  value === null || value === undefined;
