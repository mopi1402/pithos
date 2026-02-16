/**
 * Checks if a value is a Promise or Promise-like object (thenable).
 *
 * @template T - The type of the value the promise resolves to.
 * @param value - The value to check.
 * @returns `true` if the value is a Promise or thenable, `false` otherwise.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * isPromise(new Promise(() => {})); // => true
 * isPromise({ then: () => {} });    // => true
 * isPromise(async () => {});        // => false (it's a function that returns a promise)
 * isPromise({});                    // => false
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPromise = <T = any>(value: unknown): value is Promise<T> =>
    !!value &&
    // Stryker disable next-line ConditionalExpression: equivalent mutant, primitives never have .then method, so typeof check on .then is sufficient
    (typeof value === "object" || typeof value === "function") &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (value as any).then === "function";
