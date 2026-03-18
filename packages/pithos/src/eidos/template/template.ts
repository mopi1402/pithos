/**
 * Functional Template Method Pattern.
 *
 * In OOP, the Template Method pattern requires an abstract class that defines
 * the algorithm skeleton with abstract/hook methods, and concrete subclasses
 * that override specific steps.
 *
 * In functional TypeScript, a template is just `(steps) => algorithm`.
 * The base pattern is absorbed by the language — no wrapper needed.
 *
 * However, {@link templateWithDefaults} provides real value: it handles
 * merging default step implementations with caller overrides.
 *
 * @module eidos/template
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/template/ | Explanations, examples and live demo}
 *
 * @example
 * ```ts
 * // No import needed for basic templates — just write a function:
 * const processData = (steps: { parse: (raw: string) => number[]; analyze: (data: number[]) => string }) =>
 *   (raw: string) => steps.analyze(steps.parse(raw));
 *
 * const csvProcessor = processData({
 *   parse: (raw) => raw.split(",").map(Number),
 *   analyze: (data) => `sum: ${data.reduce((a, b) => a + b, 0)}`,
 * });
 *
 * // For templates with defaults, use templateWithDefaults:
 * import { templateWithDefaults } from "@pithos/core/eidos/template/template";
 *
 * const report = templateWithDefaults(
 *   (steps: { header: () => string; body: (d: string) => string }) =>
 *     (data: string) => `${steps.header()}\n${steps.body(data)}`,
 *   { header: () => "=== Report ===", body: (d) => d },
 * );
 *
 * report({ header: () => "Custom" })("content");
 * ```
 *
 * @deprecated **Pattern absorbed by the language.**
 *
 * In functional TypeScript, a template is just `(steps) => algorithm`.
 * This function is the identity — it exists only so you find this message.
 *
 * Write your template directly:
 * ```ts
 * const gameAI = (steps: { collect: () => number; attack: (n: number) => string }) =>
 *   () => steps.attack(steps.collect());
 * ```
 *
 * For templates with default steps, use {@link templateWithDefaults} which
 * provides actual value (merging defaults with overrides).
 *
 * @see {@link https://pithos.dev/api/eidos/template/ | Full explanation, examples and live demo}
 */
export function template<
  // INTENTIONAL: any[] for args; constraint must accept functions with concrete signatures (e.g. () => T)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Steps extends Record<string, (...args: any[]) => unknown>,
  Fn,
>(
  skeleton: (steps: Steps) => Fn,
): (steps: Steps) => Fn {
  return skeleton;
}

/**
 * Creates a template method with default steps that can be partially overridden.
 *
 * This is the functional equivalent of an abstract class with hook methods
 * that have default implementations. Only the steps you want to customize
 * need to be provided.
 *
 * @template Steps - The record type describing the customizable steps
 * @template Fn - The resulting algorithm function type
 * @param skeleton - A function that wires the steps into an algorithm
 * @param defaults - Default implementations for all steps
 * @returns A function that accepts partial step overrides and returns the algorithm
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const report = templateWithDefaults(
 *   (steps: {
 *     header: () => string;
 *     body: (data: string) => string;
 *     footer: () => string;
 *   }) =>
 *     (data: string) => [steps.header(), steps.body(data), steps.footer()].join("\n"),
 *   {
 *     header: () => "=== Report ===",
 *     body: (data) => data,
 *     footer: () => "=== End ===",
 *   },
 * );
 *
 * // Only override what you need
 * const custom = report({ header: () => "** Custom **" });
 * custom("content"); // "** Custom **\ncontent\n=== End ==="
 * ```
 */
export function templateWithDefaults<Steps extends object, Fn>(
  skeleton: (steps: Steps) => Fn,
  defaults: NoInfer<Steps>,
): (overrides?: Partial<NoInfer<Steps>>) => Fn {
  return (overrides) => {
    // Stryker disable next-line ConditionalExpression: Stryker can't find related tests due to vitest.related config
    if (!overrides) return skeleton(defaults);
    const merged = { ...defaults };
    for (const key of Object.keys(overrides) as (keyof Steps)[]) {
      if (overrides[key] !== undefined) {
        merged[key] = overrides[key] as Steps[keyof Steps];
      }
    }
    return skeleton(merged);
  };
}
