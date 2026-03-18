/**
 * Functional Mediator Pattern.
 *
 * In OOP, the Mediator pattern requires a Mediator interface, concrete mediator
 * classes, and components that communicate through the mediator instead of
 * directly with each other.
 *
 * In functional TypeScript, a mediator is an event hub that routes messages
 * between decoupled handlers. Components emit events, the mediator dispatches
 * to registered handlers based on event type.
 *
 * The key difference from Observer: Observer broadcasts to all subscribers,
 * Mediator routes to specific handlers based on event type and can orchestrate
 * complex interactions.
 *
 * @module eidos/mediator
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { createMediator } from "@pithos/core/eidos/mediator/mediator";
 *
 * type Events = {
 *   userLoggedIn: { userId: string };
 *   orderPlaced: { orderId: string; total: number };
 *   paymentReceived: { orderId: string };
 * };
 *
 * const mediator = createMediator<Events>();
 *
 * // Register handlers
 * mediator.on("userLoggedIn", ({ userId }) => {
 *   console.log(`Welcome ${userId}`);
 *   loadUserPreferences(userId);
 * });
 *
 * mediator.on("orderPlaced", ({ orderId, total }) => {
 *   sendConfirmationEmail(orderId);
 *   if (total > 100) mediator.emit("paymentReceived", { orderId });
 * });
 *
 * // Components emit events without knowing who handles them
 * mediator.emit("userLoggedIn", { userId: "alice" });
 * ```
 */

/**
 * Event handler function type.
 * Replaces the GoF Colleague callback interface.
 *
 * @template T - The event payload type
 * @since 2.4.0
 */
export type Handler<T> = (payload: T) => void;

/**
 * Mediator interface for typed event routing.
 * Replaces the GoF Mediator abstract class.
 *
 * @template Events - Record mapping event names to payload types
 * @since 2.4.0
 */
export type Mediator<Events extends Record<string, unknown>> = {
  /** Register a handler for an event type. Returns unsubscribe function. */
  on: <K extends keyof Events>(event: K, handler: Handler<Events[K]>) => () => void;
  /** Emit an event to all registered handlers. */
  emit: <K extends keyof Events>(event: K, payload: Events[K]) => void;
  /** Remove all handlers for an event type, or all handlers if no event specified. */
  clear: (event?: keyof Events) => void;
};

/**
 * Creates a typed mediator for decoupled component communication.
 *
 * Components emit events without knowing who handles them. The mediator
 * routes events to registered handlers, enabling loose coupling.
 *
 * @template Events - Record mapping event names to payload types
 * @returns A mediator with `on`, `emit`, and `clear` methods
 * @since 2.4.0
 *
 * @example
 * ```ts
 * type UIEvents = {
 *   buttonClicked: { buttonId: string };
 *   formSubmitted: { data: FormData };
 *   modalClosed: { modalId: string };
 * };
 *
 * const ui = createMediator<UIEvents>();
 *
 * // Dialog component
 * ui.on("buttonClicked", ({ buttonId }) => {
 *   if (buttonId === "confirm") ui.emit("modalClosed", { modalId: "dialog" });
 * });
 *
 * // Form component
 * ui.on("formSubmitted", ({ data }) => {
 *   validate(data);
 *   ui.emit("buttonClicked", { buttonId: "confirm" });
 * });
 * ```
 */
export function createMediator<
  Events extends Record<string, unknown>,
>(): Mediator<Events> {
  const handlers: { [K in keyof Events]?: Set<Handler<Events[K]>> } = {};

  return {
    on<K extends keyof Events>(event: K, handler: Handler<Events[K]>) {
      let set = handlers[event];
      if (!set) {
        set = new Set();
        handlers[event] = set;
      }
      set.add(handler);

      return () => {
        set.delete(handler);
      };
    },

    emit<K extends keyof Events>(event: K, payload: Events[K]) {
      const set = handlers[event];
      if (set) {
        for (const handler of set) {
          handler(payload);
        }
      }
    },

    clear(event?: keyof Events) {
      if (event) {
        delete handlers[event];
      } else {
        for (const key in handlers) {
          delete handlers[key];
        }
      }
    },
  };
}
