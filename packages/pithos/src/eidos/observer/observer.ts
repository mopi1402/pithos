/**
 * Functional Observer Pattern.
 *
 * In OOP, the Observer pattern requires Subject/Observer interfaces,
 * concrete classes, and manual attach/detach management.
 * In functional TypeScript, it's a Set of callbacks behind a closure.
 *
 * @module eidos/observer
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { createObservable } from "@pithos/core/eidos/observer/observer";
 *
 * const onClick = createObservable<{ x: number; y: number }>();
 *
 * const unsub = onClick.subscribe(({ x, y }) => console.log(x, y));
 * onClick.notify({ x: 10, y: 20 }); // logs: 10 20
 * unsub();
 * onClick.notify({ x: 30, y: 40 }); // nothing - unsubscribed
 * ```
 */

import { ok, err } from "@zygos/result/result";
import type { Result } from "@zygos/result/result";

/**
 * A listener is a callback that reacts to emitted values.
 * Replaces the GoF Observer interface.
 *
 * @template T - The value type
 * @since 2.4.0
 */
export type Listener<T> = (value: T) => void;

/**
 * A function that removes a listener when called.
 * Replaces the GoF `detach(observer)` method.
 *
 * @since 2.4.0
 */
export type Unsubscribe = () => void;

/**
 * Creates an observable (pub/sub emitter).
 * Replaces the GoF Subject class - no interface, no attach/detach ceremony,
 * just subscribe and get back an unsubscribe function.
 *
 * @template T - The type of values emitted to listeners
 * @returns Observable with `subscribe`, `notify`, `once`, `safeNotify`, `size`, `clear`
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const onUserLogin = createObservable<{ id: string; name: string }>();
 *
 * // Subscribe - returns an unsubscribe function
 * const unsub = onUserLogin.subscribe((user) => {
 *   console.log(`${user.name} logged in`);
 * });
 *
 * // One-time listener
 * onUserLogin.once((user) => {
 *   sendWelcomeEmail(user);
 * });
 *
 * onUserLogin.notify({ id: "1", name: "Alice" });
 * unsub();
 * ```
 */
export function createObservable<T>() {
  const listeners = new Set<Listener<T>>();

  return {
    /** Add a listener. Returns an unsubscribe function. */
    subscribe: (listener: Listener<T>): Unsubscribe => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    /**
     * Emit a value to all listeners. Fail-fast: if a listener throws,
     * the error propagates and subsequent listeners are not called.
     * Use `safeNotify` for resilient notification.
     */
    notify: (value: T): void => {
      for (const listener of listeners) {
        listener(value);
      }
    },

    /**
     * Subscribe for a single notification, then auto-unsubscribe.
     * The listener is wrapped internally - always use the returned
     * `Unsubscribe` function to cancel before it fires.
     */
    once: (listener: Listener<T>): Unsubscribe => {
      const wrapper: Listener<T> = (value) => {
        listeners.delete(wrapper);
        listener(value);
      };
      listeners.add(wrapper);
      return () => {
        listeners.delete(wrapper);
      };
    },

    /**
     * Emit a value to all listeners with error safety.
     * Unlike `notify`, this catches listener errors and continues
     * notifying remaining listeners. Returns a zygos `Result`:
     * - `Ok(void)` if all listeners succeeded
     * - `Err(Error[])` with collected errors from failing listeners
     *
     * @since 2.4.0
     */
    safeNotify: (value: T): Result<void, Error[]> => {
      const errors: Error[] = [];
      for (const listener of listeners) {
        try {
          listener(value);
        } catch (error) {
          errors.push(
            error instanceof Error ? error : new Error(String(error)),
          );
        }
      }
      return errors.length > 0 ? err(errors) : ok(undefined);
    },

    /** Current number of listeners. */
    get size(): number {
      return listeners.size;
    },

    /** Remove all listeners. */
    clear: (): void => {
      listeners.clear();
    },
  };
}
