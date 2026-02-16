/**
 * Validates if a value is a valid Option type with Some tag.
 * @template A - The value type.
 * @param fa - The value to validate.
 * @returns True if the value is a valid Some Option.
 * @since 2.0.0
 * @example
 * ```typescript
 * if (isSomeOption(fa)) {
 *   return E.right(fa.value!);
 * }
 * return E.left(onNone());
 * ```
 */
export const isSomeOption = <A>(fa: {
  _tag: "Some" | "None";
  value?: A;
}): fa is { _tag: "Some"; value: A } => {
  return fa && fa._tag === "Some";
};
