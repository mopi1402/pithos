//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
import { camelCase } from "./camel-case";

/**
 * Converts a string to PascalCase.
 *
 * @param str - The string to convert.
 * @returns The string in PascalCase.
 * @since 1.1.0
 *
 * @note Handles kebab-case, snake_case, camelCase, and space-separated strings.
 *       Delegates word parsing to `camelCase` for consistency.
 *
 * @performance O(n) where n is string length. Single pass via camelCase + O(1) uppercase.
 *
 * @see camelCase
 *
 * @example
 * ```typescript
 * pascalCase('hello-world');      // => 'HelloWorld'
 * pascalCase('background_color'); // => 'BackgroundColor'
 * pascalCase('foo bar');          // => 'FooBar'
 * pascalCase('helloWorld');       // => 'HelloWorld'
 * pascalCase('XMLHttpRequest');   // => 'XmlHttpRequest'
 * ```
 */
export function pascalCase(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - camelCase("") returns "" anyway
  if (str.length === 0) return "";

  const camel = camelCase(str);
  // Stryker disable next-line ConditionalExpression: equivalent mutant - "".charAt(0).toUpperCase() returns "" anyway
  if (camel.length === 0) return "";

  return camel.charAt(0).toUpperCase() + camel.slice(1);
}
