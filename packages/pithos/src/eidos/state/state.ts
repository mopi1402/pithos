/**
 * Functional State Pattern.
 *
 * In OOP, the State pattern requires a Context class, a State interface,
 * and concrete State subclasses that the Context delegates to.
 * In functional TypeScript, a state machine is a record of transitions
 * keyed by state, where each transition maps an event to the next state
 * (and optionally updates context).
 *
 * @module eidos/state
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { createMachine } from "@pithos/core/eidos/state/state";
 *
 * const light = createMachine({
 *   green:  { timer: { to: "yellow" } },
 *   yellow: { timer: { to: "red" } },
 *   red:    { timer: { to: "green" } },
 * }, "green");
 *
 * light.current();      // "green"
 * light.send("timer");  // "yellow"
 * light.send("timer");  // "red"
 * ```
 */

import { some, none } from "@zygos/option";
import type { Option } from "@zygos/option";

/**
 * A simple transition to a target state.
 *
 * @template S - Union of state names
 * @since 2.4.0
 */
export interface SimpleTransition<S extends string> {
  readonly to: S;
}

/**
 * A transition that updates context.
 *
 * @template S - Union of state names
 * @template C - Context type
 * @since 2.4.0
 */
export interface ContextTransition<S extends string, C> {
  readonly to: S;
  readonly update: (ctx: C) => C;
}

/**
 * A transition is either simple (just target) or with context update.
 *
 * @template S - Union of state names
 * @template C - Context type
 * @since 2.4.0
 */
export type Transition<S extends string, C> =
  | SimpleTransition<S>
  | ContextTransition<S, C>;

/**
 * A transition map for a single state.
 *
 * @template S - Union of state names
 * @template E - Union of event names
 * @template C - Context type
 * @since 2.4.0
 */
export type Transitions<S extends string, E extends string, C> = {
  readonly [K in E]?: Transition<S, C>;
};

/**
 * Full state machine definition.
 *
 * @template S - Union of state names
 * @template E - Union of event names
 * @template C - Context type
 * @since 2.4.0
 */
export type MachineDefinition<S extends string, E extends string, C> = {
  readonly [K in S]: Transitions<S, E, C>;
};

/**
 * A transition listener receives the previous state, the event, and the new state.
 *
 * @template S - Union of state names
 * @template E - Union of event names
 * @since 2.4.0
 */
export type TransitionListener<S extends string, E extends string> = (
  from: S,
  event: E,
  to: S,
) => void;

/**
 * Type guard for context transitions.
 */
function hasUpdate<S extends string, C>(
  t: Transition<S, C>,
): t is ContextTransition<S, C> {
  return "update" in t;
}

/**
 * Creates a finite state machine.
 *
 * @template S - Union of state names
 * @template E - Union of event names
 * @param definition - The state/transition map
 * @param initial - The initial state
 * @returns A machine with `current`, `send`, `matches`, `trySend`, `onTransition`, `reset`
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const door = createMachine({
 *   locked: { unlock: { to: "closed" } },
 *   closed: { open: { to: "opened" }, lock: { to: "locked" } },
 *   opened: { close: { to: "closed" } },
 * }, "locked");
 *
 * door.send("unlock"); // "closed"
 * door.send("open");   // "opened"
 * door.matches("opened"); // true
 * ```
 */
export function createMachine<S extends string, E extends string>(
  definition: MachineDefinition<S, E, undefined>,
  initial: S,
): {
  current: () => S;
  send: (event: E) => S;
  matches: (state: S) => boolean;
  trySend: (event: E) => Option<S>;
  onTransition: (listener: TransitionListener<S, E>) => () => void;
  reset: () => void;
};

/**
 * Creates a finite state machine with context.
 *
 * @template S - Union of state names
 * @template E - Union of event names
 * @template C - Context type
 * @param definition - The state/transition map
 * @param initial - The initial state
 * @param initialContext - The initial context value
 * @returns A machine with `current`, `context`, `send`, `matches`, `trySend`, `onTransition`, `reset`
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const counter = createMachine({
 *   active: {
 *     increment: { to: "active", update: (ctx: number) => ctx + 1 },
 *     reset: { to: "active", update: () => 0 },
 *   },
 * }, "active", 0);
 *
 * counter.send("increment"); // "active"
 * counter.context();         // 1
 * ```
 */
export function createMachine<S extends string, E extends string, C>(
  definition: MachineDefinition<S, E, C>,
  initial: S,
  initialContext: C,
): {
  current: () => S;
  context: () => C;
  send: (event: E) => S;
  matches: (state: S) => boolean;
  trySend: (event: E) => Option<S>;
  onTransition: (listener: TransitionListener<S, E>) => () => void;
  reset: () => void;
};

export function createMachine<S extends string, E extends string, C = undefined>(
  definition: MachineDefinition<S, E, C>,
  initial: S,
  initialContext?: C,
) {
  let state: S = initial;
  let ctx: C | undefined = initialContext;
  const listeners = new Set<TransitionListener<S, E>>();

  const send = (event: E): S => {
    const transitions = definition[state];
    const transition = transitions[event];
    if (transition === undefined) return state;

    const from = state;
    state = transition.to;

    // Stryker disable next-line ConditionalExpression: ctx check is defensive - TypeScript prevents update on machines without context
    if (hasUpdate(transition) && ctx !== undefined) {
      ctx = transition.update(ctx);
    }

    for (const listener of listeners) {
      listener(from, event, state);
    }

    return state;
  };

  const trySend = (event: E): Option<S> => {
    const transitions = definition[state];
    if (transitions[event] === undefined) return none;
    return some(send(event));
  };

  const onTransition = (listener: TransitionListener<S, E>): (() => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };

  const base = {
    current: () => state,
    send,
    matches: (s: S) => state === s,
    trySend,
    onTransition,
    reset: () => {
      state = initial;
      ctx = initialContext;
    },
  };

  if (initialContext !== undefined) {
    return {
      ...base,
      // INTENTIONAL: ctx is guaranteed to be C when initialContext is provided
      context: () => ctx as C,
    };
  }

  return base;
}
