/**
 * Checks if a value is a symbol.
 * @param value - The value to check
 * @returns True if the value is a symbol, false otherwise
 * @example
 * ```typescript
 * const sym = Symbol('test');
 * if (isSymbol(sym)) {
 *   // sym is now typed as symbol
 *   console.log(sym.toString());
 * }
 * ```
 */
export const isSymbol = (value: unknown): value is symbol =>
  typeof value === "symbol";

/**
 * Checks if a value is a boolean.
 * @param value - The value to check
 * @returns True if the value is a boolean, false otherwise
 * @example
 * ```typescript
 * if (isBoolean(data.flag)) {
 *   // data.flag is now typed as boolean
 *   console.log(data.flag ? 'enabled' : 'disabled');
 * }
 * ```
 */
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

/**
 * Checks if a value is a string.
 * @param value - The value to check
 * @returns True if the value is a string, false otherwise
 * @example
 * ```typescript
 * if (isString(data.name)) {
 *   // data.name is now typed as string
 *   console.log(data.name.toUpperCase());
 * }
 * ```
 */
export const isString = (value: unknown): value is string =>
  typeof value === "string";

/**
 * Checks if a value is a number (including NaN and Infinity).
 * @param value - The value to check
 * @returns True if the value is a number, false otherwise
 * @example
 * ```typescript
 * if (isNumber(data.age)) {
 *   // data.age is now typed as number
 *   console.log(data.age + 1);
 * }
 * ```
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

/**
 * Checks if a value is a bigint.
 * @param value - The value to check
 * @returns True if the value is a bigint, false otherwise
 * @example
 * ```typescript
 * if (isBigint(data.id)) {
 *   // data.id is now typed as bigint
 *   console.log(data.id.toString());
 * }
 * ```
 */
export const isBigint = (value: unknown): value is bigint =>
  typeof value === "bigint";

/**
 * Checks if a value is undefined.
 * @param value - The value to check
 * @returns True if the value is undefined, false otherwise
 * @example
 * ```typescript
 * if (isUndefined(data.optional)) {
 *   // Handle undefined case
 *   console.log('Value is not provided');
 * }
 * ```
 */
export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;

/**
 * Checks if a value is null.
 * @param value - The value to check
 * @returns True if the value is null, false otherwise
 * @example
 * ```typescript
 * if (isNull(data.value)) {
 *   // Handle null case
 *   console.log('Value is explicitly null');
 * }
 * ```
 */
export const isNull = (value: unknown): value is null => value === null;

/**
 * Checks if a value is a function.
 * @param value - The value to check
 * @returns True if the value is a function, false otherwise
 * @example
 * ```typescript
 * if (isFunction(data.callback)) {
 *   // data.callback is now typed as Function
 *   data.callback();
 * }
 * ```
 */
export const isFunction = (value: unknown): value is Function =>
  typeof value === "function";

/**
 * Checks if a value is an object (excluding null and arrays).
 * This includes objects created with object literals, constructors, and Object.create().
 * @param value - The value to check
 * @returns True if the value is an object (not null, not array), false otherwise
 * @example
 * ```typescript
 * if (isObject(data)) {
 *   // data is now typed as Record<string, any>
 *   console.log(Object.keys(data));
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isObject = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * Checks if a value is a plain object (object literal).
 * Only returns true for objects created with {} or new Object(),
 * excluding arrays, dates, custom class instances, etc.
 * @param value - The value to check
 * @returns True if the value is a plain object, false otherwise
 * @example
 * ```typescript
 * if (isPlainObject(data)) {
 *   // data is now typed as Record<string, any>
 *   // Safe to assume it's a simple key-value object
 *   Object.assign(data, newProps);
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPlainObject = (value: unknown): value is Record<string, any> =>
  Object.prototype.toString.call(value) === "[object Object]";

/**
 * Type guard that checks if a value is one of the values in a readonly array of string literals
 * @template T - The string literal type
 * @param value - The value to check (can be null or undefined)
 * @param source - The readonly array of string literals to check against
 * @returns True if the value exists in the source array, false otherwise
 * @example
 * ```typescript
 * const validStatuses = ['pending', 'active', 'completed'] as const;
 * type Status = typeof validStatuses[number];
 *
 * const status = 'pending';
 * if (isOneOf(status, validStatuses)) {
 *   // status is now typed as Status ('pending' | 'active' | 'completed')
 *   console.log(status); // TypeScript knows this is a valid status
 * }
 *
 * // Also works with null/undefined values
 * const userInput = getUserInput(); // string | null | undefined
 * if (isOneOf(userInput, validStatuses)) {
 *   // userInput is now typed as Status
 *   updateStatus(userInput); // Safe to use
 * }
 * ```
 */
export const isOneOf = <T extends string>(
  value: string | null | undefined,
  source: readonly T[]
): value is (typeof source)[number] => !!value && source.includes(<T>value);
