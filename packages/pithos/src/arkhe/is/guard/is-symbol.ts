//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Checks if a value is a symbol.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a symbol, `false` otherwise.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * isSymbol(Symbol('id'));     // => true
 * isSymbol(Symbol.iterator);  // => true
 * isSymbol('symbol');         // => false
 * isSymbol({ sym: Symbol() }); // => false
 * ```
 */
export const isSymbol = (value: unknown): value is symbol =>
  typeof value === "symbol";
