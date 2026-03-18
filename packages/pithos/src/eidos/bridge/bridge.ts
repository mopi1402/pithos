/**
 * Functional Bridge Pattern.
 *
 * In OOP, the Bridge pattern requires an Abstraction class hierarchy and a
 * separate Implementation interface hierarchy, linked via composition.
 *
 * In functional TypeScript, a bridge is just a function `(impl) => abstraction`.
 * The pattern is absorbed by the language — no wrapper needed.
 *
 * This module exists for documentation and discoverability. The functions are
 * identity wrappers marked `@deprecated` to guide developers toward idiomatic
 * functional code.
 *
 * @module eidos/bridge
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/bridge/ | Explanations, examples and live demo}
 *
 * @example
 * ```ts
 * // No import needed — just write a function:
 * type Renderer = {
 *   drawCircle: (x: number, y: number, r: number) => void;
 *   drawRect: (x: number, y: number, w: number, h: number) => void;
 * };
 *
 * const shapes = (impl: Renderer) => ({
 *   icon: (x: number, y: number) => {
 *     impl.drawCircle(x, y, 10);
 *     impl.drawRect(x - 5, y + 15, 10, 5);
 *   },
 *   button: (x: number, y: number) => {
 *     impl.drawRect(x, y, 100, 30);
 *     impl.drawCircle(x + 10, y + 15, 5);
 *   },
 * });
 *
 * // Swap implementations freely
 * const svgShapes = shapes(svgRenderer);
 * const canvasShapes = shapes(canvasRenderer);
 * ```
 */

/**
 * A Bridge is a function that takes an implementation and returns an abstraction.
 * This is just a type alias for documentation — use `(impl: I) => A` directly.
 *
 * @internal Not exported in API docs — use inline `(impl: I) => A` instead
 * @template Impl - The implementation type
 * @template Abs - The abstraction type
 * @since 2.4.0
 */
export type Bridge<Impl, Abs> = (impl: Impl) => Abs;

/**
 * @deprecated **Pattern absorbed by the language.**
 *
 * In functional TypeScript, a bridge is just `(impl) => abstraction`.
 * This function is the identity — it exists only so you find this message.
 *
 * Write your bridge directly:
 * ```ts
 * const repo = (db: DbDriver) => ({
 *   findById: (id) => db.query(`SELECT * FROM users WHERE id = '${id}'`),
 *   save: (user) => db.execute(`INSERT INTO users ...`),
 * });
 * ```
 *
 * @see {@link https://pithos.dev/api/eidos/bridge/ | Full explanation, examples and live demo}
 * @since 2.4.0
 */
export function createBridge<Impl, Abs>(
  factory: (impl: Impl) => Abs,
): (impl: Impl) => Abs {
  return factory;
}

/**
 * @deprecated **Pattern absorbed by the language.**
 *
 * Compose two bridges: `(impl) => mid` and `(mid) => abs` into `(impl) => abs`.
 * This is just function composition — use `(impl) => b(a(impl))` directly.
 *
 * @see {@link https://pithos.dev/api/eidos/bridge/ | Full explanation, examples and live demo}
 * @since 2.4.0
 */
export function composeBridges<Impl, Mid, Abs>(
  a: (impl: Impl) => Mid,
  b: (mid: Mid) => Abs,
): (impl: Impl) => Abs {
  return (impl) => b(a(impl));
}