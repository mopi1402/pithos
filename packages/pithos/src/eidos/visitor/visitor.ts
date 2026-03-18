/**
 * Functional Visitor Pattern.
 *
 * In OOP, the Visitor pattern requires a Component interface with `accept()`,
 * concrete components that call `visitor.visitX(this)`, and Visitor interfaces
 * with a method per component type. This "double dispatch" works around the
 * limitation that OOP languages dispatch only on the receiver type.
 *
 * In functional TypeScript, this is absorbed by discriminated unions + switch:
 * - Define your types as a union with a discriminant (`type`, `kind`, `_tag`)
 * - Use `switch` on the discriminant — TypeScript narrows the type in each case
 * - Exhaustiveness is checked at compile time
 *
 * No wrapper needed — it's native language behavior.
 *
 * @module eidos/visitor
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/visitor/ | Explanations, examples and live demo}
 *
 * @example
 * ```ts
 * // No import needed — just use discriminated unions + switch:
 *
 * type Shape =
 *   | { type: "circle"; radius: number }
 *   | { type: "rectangle"; width: number; height: number }
 *   | { type: "triangle"; base: number; height: number };
 *
 * // "Visitor 1" - calculate area
 * const area = (shape: Shape): number => {
 *   switch (shape.type) {
 *     case "circle": return Math.PI * shape.radius ** 2;
 *     case "rectangle": return shape.width * shape.height;
 *     case "triangle": return (shape.base * shape.height) / 2;
 *   }
 * };
 *
 * // "Visitor 2" - describe shape
 * const describe = (shape: Shape): string => {
 *   switch (shape.type) {
 *     case "circle": return `Circle with radius ${shape.radius}`;
 *     case "rectangle": return `Rectangle ${shape.width}x${shape.height}`;
 *     case "triangle": return `Triangle base=${shape.base}`;
 *   }
 * };
 *
 * // Same data, different "visitors" (functions)
 * const shapes: Shape[] = [
 *   { type: "circle", radius: 5 },
 *   { type: "rectangle", width: 3, height: 4 },
 * ];
 *
 * shapes.map(area);     // [78.54, 12]
 * shapes.map(describe); // ["Circle with radius 5", "Rectangle 3x4"]
 * ```
 *
 * @deprecated **Pattern absorbed by the language.**
 *
 * In functional TypeScript, the Visitor pattern is just a switch on a
 * discriminated union. TypeScript narrows the type in each case branch.
 *
 * Write your visitor directly:
 * ```ts
 * const visit = (shape: Shape): number => {
 *   switch (shape.type) {
 *     case "circle": return Math.PI * shape.radius ** 2;
 *     case "rectangle": return shape.width * shape.height;
 *   }
 * };
 * ```
 *
 * This function is the identity — it exists only so you find this message.
 *
 * @see {@link https://pithos.dev/api/eidos/visitor/ | Full explanation, examples and live demo}
 */
export function visit<T, R>(value: T, visitor: (v: T) => R): R {
  return visitor(value);
}
