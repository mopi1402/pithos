/**
 * Makes all properties of T readonly recursively, at every depth level.
 *
 * Unlike TypeScript's built-in `Readonly<T>` which only affects the first level,
 * `DeepReadonly<T>` makes nested object properties readonly as well.
 *
 * @template T - The type to make deeply readonly
 * @since 1.0.13
 *
 * @example
 * ```typescript
 * type Config = {
 *   server: {
 *     host: string;
 *     port: number;
 *   };
 *   debug: boolean;
 * };
 *
 * type FrozenConfig = DeepReadonly<Config>;
 * // All properties are readonly at every level
 *
 * const config: FrozenConfig = { server: { host: "localhost", port: 3000 }, debug: true };
 * config.debug = false; // ❌ Error: Cannot assign to 'debug' because it is a read-only property
 * config.server.port = 8080; // ❌ Error: Cannot assign to 'port' because it is a read-only property
 * ```
 */
export type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;
