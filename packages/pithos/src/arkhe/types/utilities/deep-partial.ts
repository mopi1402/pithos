/**
 * Makes all properties of T optional recursively, at every depth level.
 *
 * Unlike TypeScript's built-in `Partial<T>` which only affects the first level,
 * `DeepPartial<T>` makes nested object properties optional as well.
 *
 * @template T - The type to make deeply partial
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
 * // Partial<Config> = { server?: { host: string; port: number }; debug?: boolean }
 * // ⚠️ server.host and server.port are still required!
 *
 * // DeepPartial<Config> = { server?: { host?: string; port?: number }; debug?: boolean }
 * // ✅ Everything is optional at all levels
 *
 * function updateConfig(patch: DeepPartial<Config>) {
 *   // Can pass just { server: { port: 8080 } }
 * }
 * ```
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
