/**
 * Functional Singleton Pattern.
 *
 * In OOP, the Singleton pattern requires a class with a private constructor
 * and a static `getInstance()` method to ensure only one instance exists.
 *
 * In functional TypeScript, this is absorbed by the ES module system:
 * - A module is evaluated exactly once
 * - `export const instance = create()` is a singleton by default
 * - No pattern needed — it's native module behavior
 *
 * For lazy initialization, Arkhe provides `once` which caches the first call.
 *
 * ## Why Singleton is considered an anti-pattern
 *
 * The Singleton appears in the GoF book (1994), but the community has since
 * largely recognized it as an anti-pattern:
 *
 * - **Global state in disguise** — A singleton is just a global variable with
 *   extra steps. It creates implicit coupling throughout your codebase.
 *
 * - **Testability nightmare** — You can't easily mock a singleton. Every test
 *   shares the same instance and its state, leading to flaky tests.
 *
 * - **Hidden dependencies** — Code using `getInstance()` has invisible deps.
 *   You can't tell what a function needs just by looking at its signature.
 *
 * - **Concurrency issues** — Lazy initialization is a race condition waiting
 *   to happen (less relevant in single-threaded JS, but still a code smell).
 *
 * ## The modern alternative: Dependency Injection
 *
 * Instead of reaching for a global singleton, pass dependencies explicitly:
 *
 * ```ts
 * // ❌ Singleton — hidden dependency
 * const fetchUsers = () => {
 *   const db = Database.getInstance();
 *   return db.query("SELECT * FROM users");
 * };
 *
 * // ✅ Dependency injection — explicit, testable
 * const fetchUsers = (db: Database) => {
 *   return db.query("SELECT * FROM users");
 * };
 * ```
 *
 * This module re-exports `once` from Arkhe for discoverability.
 *
 * @module eidos/singleton
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { once } from "@pithos/core/eidos/singleton/singleton";
 * // or directly from Arkhe:
 * import { once } from "@arkhe/function/once";
 *
 * // Lazy singleton initialization
 * const getDb = once(() => connectToDatabase());
 *
 * getDb(); // connects
 * getDb(); // returns cached connection
 *
 * // But consider: could this be passed as a parameter instead?
 * ```
 */

// Re-export from Arkhe for discoverability
export { once } from "@arkhe/function/once";

/**
 * Alias for `once` — creates a lazy singleton from a factory function.
 * Re-exported for discoverability when searching for "singleton".
 *
 * @see once
 */
export { once as singleton } from "@arkhe/function/once";
