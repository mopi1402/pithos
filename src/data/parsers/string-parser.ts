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

export function parseCommaSeparated(input = ""): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
