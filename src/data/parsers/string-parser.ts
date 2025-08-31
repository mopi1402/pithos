/**
 * Parses a string containing key-value pairs into a JavaScript object.
 *
 * This function splits a string by pair separators and key-value separators to create
 * a structured object. It automatically trims whitespace and filters out invalid pairs.
 * Useful for parsing query strings, configuration strings, or any key-value formatted data.
 *
 * @param input - The input string to parse (default: empty string)
 * @param pairSeparator - Character(s) used to separate key-value pairs (default: ",")
 * @param keyValueSeparator - Character(s) used to separate keys from values (default: "=")
 * @returns Object containing the parsed key-value pairs
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Basic usage with default separators
 * parseKeyValuePairs("name=John,age=30,city=Paris")
 * // Returns: { name: "John", age: "30", city: "Paris" }
 *
 * // Custom separators
 * parseKeyValuePairs("name:John;age:30;city:Paris", ";", ":")
 * // Returns: { name: "John", age: "30", city: "Paris" }
 *
 * // With spaces and mixed formatting
 * parseKeyValuePairs(" name = John , age = 30 ")
 * // Returns: { name: "John", age: "30" }
 *
 * // Empty or invalid pairs are filtered out
 * parseKeyValuePairs("name=John,,age=30,=invalid")
 * // Returns: { name: "John", age: "30" }
 * ```
 */
export function parseKeyValuePairs(
  input = "",
  pairSeparator = ",",
  keyValueSeparator = "="
): Record<string, string> {
  return Object.fromEntries(
    input
      .split(pairSeparator)
      .map((pair) =>
        pair
          .trim()
          .split(keyValueSeparator)
          .map((s) => s.trim())
      )
      .filter(([key, value]) => key && value)
  );
}

/**
 * Generic function to parse comma-separated values using a custom parser.
 * Useful for parsing any type of comma-separated data with custom parsing logic.
 *
 * @param value - Comma-separated string values
 * @param parser - Function to parse each individual value
 * @returns Array of parsed values
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * parseCommaSeparated("1,2,3", (x) => parseInt(x))           // returns [1, 2, 3]
 * parseCommaSeparated("a,b,c", (x) => x.toUpperCase())        // returns ["A", "B", "C"]
 * parseCommaSeparated("true,false", (x) => x === "true")      // returns [true, false]
 * ```
 */
export const parseCommaSeparated = <T>(
  value: string,
  parser: (item: string) => T
): T[] => value.split(",").map(parser);
