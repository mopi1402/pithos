/**
 * Lightweight Observer Pattern — zero external dependencies.
 *
 * Provides the same `subscribe` / `notify` / `clear` API as
 * {@link createObservable}, but without `safeNotify`, `once`, or `size`.
 * This avoids pulling in `@zygos/result` and keeps the bundle minimal
 * for consumers who only need basic pub/sub.
 *
 * @module eidos/observer/observer-lite
 * @since 2.5.0
 *
 * @example
 * ```ts
 * import { createLiteObservable } from "@pithos/core/eidos/observer/observer-lite";
 *
 * const onClick = createLiteObservable<{ x: number; y: number }>();
 *
 * const unsub = onClick.subscribe(({ x, y }) => console.log(x, y));
 * onClick.notify({ x: 10, y: 20 }); // logs: 10 20
 * unsub();
 * ```
 */

/** A listener callback that reacts to emitted values. */
export type Listener<T> = (value: T) => void;

/**
 * A function that removes a listener when called.
 *
 * @since 2.5.0
 */
export type Unsubscribe = () => void;

/**
 * Creates a lightweight observable (pub/sub emitter).
 *
 * Only exposes `subscribe`, `notify`, and `clear`.
 * No dependency on `@zygos/result` — ideal for size-sensitive bundles.
 *
 * @template T - The type of values emitted to listeners
 * @returns Observable with `subscribe`, `notify`, `clear`
 * @since 2.5.0
 */
export function createLiteObservable<T>() {
  const listeners = new Set<Listener<T>>();

  return {
    /** Add a listener. Returns an unsubscribe function. */
    subscribe: (listener: Listener<T>): Unsubscribe => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    /** Emit a value to all listeners (fail-fast). */
    notify: (value: T): void => {
      for (const listener of listeners) {
        listener(value);
      }
    },

    /** Remove all listeners. */
    clear: (): void => {
      listeners.clear();
    },
  };
}
