/**
 * Functional Interpreter Pattern.
 *
 * In OOP, the Interpreter pattern requires an Expression interface with
 * `interpret(context)`, terminal expressions (literals), and non-terminal
 * expressions (operators that combine other expressions).
 *
 * In functional TypeScript, this is absorbed by the combination of:
 * - **Discriminated unions** for the AST (expression tree)
 * - **Recursive functions** for evaluation (like Visitor's switch)
 * - **Composite's fold** for tree traversal
 *
 * The pattern is essentially: define your grammar as types, write an
 * evaluator function that pattern-matches on the AST.
 *
 * @module eidos/interpreter
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/interpreter/ | Explanations, examples and live demo}
 *
 * @example
 * ```ts
 * type Expr =
 *   | { type: "num"; value: number }
 *   | { type: "add"; left: Expr; right: Expr }
 *   | { type: "mul"; left: Expr; right: Expr };
 *
 * const evaluate = (expr: Expr): number => {
 *   switch (expr.type) {
 *     case "num": return expr.value;
 *     case "add": return evaluate(expr.left) + evaluate(expr.right);
 *     case "mul": return evaluate(expr.left) * evaluate(expr.right);
 *   }
 * };
 *
 * // (5 + 3) * 2
 * const expr: Expr = {
 *   type: "mul",
 *   left: { type: "add", left: { type: "num", value: 5 }, right: { type: "num", value: 3 } },
 *   right: { type: "num", value: 2 },
 * };
 *
 * evaluate(expr); // 16
 * ```
 *
 * @deprecated **Pattern absorbed by the language.**
 *
 * In TypeScript, the Interpreter pattern is just:
 * 1. A discriminated union for your AST
 * 2. A recursive function that switches on the `type` discriminant
 *
 * Instead of `interpret(expr, ctx, evaluator)`, call the evaluator directly:
 *
 * ```ts
 * // Before (with interpret)
 * const html = interpret(ast, ctx, evalNode);
 *
 * // After (just call it)
 * const html = evalNode(ast, ctx);
 * ```
 *
 * Minimal example:
 *
 * ```ts
 * type Expr =
 *   | { type: "num"; value: number }
 *   | { type: "add"; left: Expr; right: Expr };
 *
 * const evaluate = (expr: Expr): number => {
 *   switch (expr.type) {
 *     case "num": return expr.value;
 *     case "add": return evaluate(expr.left) + evaluate(expr.right);
 *   }
 * };
 *
 * evaluate({ type: "add", left: { type: "num", value: 5 }, right: { type: "num", value: 3 } }); // 8
 * ```
 *
 * @see {@link https://pithos.dev/api/eidos/interpreter/ | Full explanation, examples and live Markdown interpreter demo}
 */
export function interpret<Expr, Context, Result>(
  expr: Expr,
  ctx: Context,
  evaluator: (expr: Expr, ctx: Context) => Result,
): Result {
  return evaluator(expr, ctx);
}
