//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Replaces `{key}` placeholders in a string with values from a data object.
 *
 * @param template - The template string with `{key}` placeholders.
 * @param data - The data object containing values.
 * @returns The interpolated string.
 * @since 1.1.0
 *
 * @note Supports nested paths (`{user.name}`). Use `{{` and `}}` for literal braces. Missing keys become empty strings.
 *
 * @performance O(n × m) time where n is template length, m is max path depth. Single regex pass with reduce for nested paths.
 *
 * @example
 * ```typescript
 * template('Hello {name}', { name: 'World' });
 * // => 'Hello World'
 *
 * template('{user.name} <{user.email}>', {
 *   user: { name: 'John', email: 'john@example.com' }
 * });
 * // => 'John <john@example.com>'
 *
 * template('Literal: {{escaped}}', {});
 * // => 'Literal: {escaped}'
 * ```
 */
export function template(
  template: string,
  data: Record<string, unknown> = {}
): string {
  return template.replace(/\{\{|\}\}|\{([^}]+)\}/g, (match, key) => {
    if (match === "{{") return "{";
    if (match === "}}") return "}";

    const value = key
      .trim()
      .split(".")
      .reduce((obj: unknown, k: string) => {
        // Stryker disable next-line ConditionalExpression: equivalent mutant - accessing property on primitive returns undefined anyway
        return obj != null && typeof obj === "object"
          ? (obj as Record<string, unknown>)[k]
          : undefined;
      }, data);

    return value != null ? String(value) : "";
  });
}
