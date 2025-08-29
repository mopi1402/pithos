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
