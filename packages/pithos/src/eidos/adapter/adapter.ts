/**
 * Functional Adapter Pattern.
 *
 * In OOP, the Adapter pattern requires a Target class, an Adaptee class with
 * an incompatible interface, and an Adapter class that extends/wraps both.
 * In functional TypeScript, an adapter is a pair of mapping functions
 * that transform one function signature into another.
 *
 * @module eidos/adapter
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { adapt, createAdapter } from "@pithos/core/eidos/adapter/adapter";
 *
 * // Legacy API returns XML string
 * const legacyFetch = (id: number) => `<user><name>Alice</name></user>`;
 *
 * // Adapt to new API shape: string id in, object out
 * const fetchUser = adapt(
 *   legacyFetch,
 *   (id: string) => parseInt(id),       // map input
 *   (xml) => ({ name: "Alice", xml }),   // map output
 * );
 *
 * fetchUser("42"); // { name: "Alice", xml: "<user>..." }
 * ```
 */

/**
 * An Adapter transforms a function with one signature into a function
 * with a different signature. Replaces the GoF Adapter class hierarchy.
 *
 * @template FromIn - The source function's input type
 * @template FromOut - The source function's output type
 * @template ToIn - The target input type
 * @template ToOut - The target output type
 * @since 2.4.0
 */
export type Adapter<FromIn, FromOut, ToIn, ToOut> = (
  source: (input: FromIn) => FromOut,
) => (input: ToIn) => ToOut;

/**
 * Creates a reusable adapter from input/output mappers.
 * The adapter can then be applied to any source function
 * with the matching signature.
 *
 * @template FromIn - The source function's input type
 * @template FromOut - The source function's output type
 * @template ToIn - The target input type
 * @template ToOut - The target output type
 * @param mapInput - Transforms target input into source input
 * @param mapOutput - Transforms source output into target output
 * @returns A reusable Adapter
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Adapter from Celsius to Fahrenheit API
 * const celsiusToFahrenheit = createAdapter<number, string, number, string>(
 *   (fahrenheit) => (fahrenheit - 32) * 5 / 9,  // °F -> °C input
 *   (label) => label.replace("°C", "°F"),        // output label
 * );
 *
 * const describeCelsius = (temp: number) => `${temp.toFixed(1)}°C`;
 * const describeFahrenheit = celsiusToFahrenheit(describeCelsius);
 *
 * describeFahrenheit(212); // "100.0°F"
 * ```
 */
export function createAdapter<FromIn, FromOut, ToIn, ToOut>(
  mapInput: (input: ToIn) => FromIn,
  mapOutput: (output: FromOut) => ToOut,
): Adapter<FromIn, FromOut, ToIn, ToOut> {
  return (source) => (input) => mapOutput(source(mapInput(input)));
}

/**
 * Adapts a source function in one shot by mapping both input and output.
 *
 * @template FromIn - The source function's input type
 * @template FromOut - The source function's output type
 * @template ToIn - The target input type
 * @template ToOut - The target output type
 * @param source - The function to adapt
 * @param mapInput - Transforms target input into source input
 * @param mapOutput - Transforms source output into target output
 * @returns The adapted function
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Adapt a sorting function to work with strings instead of numbers
 * const sortNumbers = (nums: number[]) => [...nums].sort((a, b) => a - b);
 *
 * const sortStrings = adapt(
 *   sortNumbers,
 *   (strs: string[]) => strs.map(Number),
 *   (nums) => nums.map(String),
 * );
 *
 * sortStrings(["3", "1", "2"]); // ["1", "2", "3"]
 * ```
 */
export function adapt<FromIn, FromOut, ToIn, ToOut>(
  source: (input: FromIn) => FromOut,
  mapInput: (input: ToIn) => FromIn,
  mapOutput: (output: FromOut) => ToOut,
): (input: ToIn) => ToOut {
  return (input) => mapOutput(source(mapInput(input)));
}
