/**
 * Lightweight State Machine — zero external dependencies.
 *
 * Same core API as {@link createMachine} (`current`, `send`, `matches`,
 * `onTransition`, `reset`) but without `trySend` (which pulls `@zygos/option`).
 *
 * @module eidos/state/state-lite
 * @since 2.5.0
 *
 * @example
 * ```ts
 * import { createLiteMachine } from "@pithos/core/eidos/state/state-lite";
 *
 * const light = createLiteMachine({
 *   green:  { timer: { to: "yellow" } },
 *   yellow: { timer: { to: "red" } },
 *   red:    { timer: { to: "green" } },
 * }, "green");
 *
 * light.current();      // "green"
 * light.send("timer");  // "yellow"
 * ```
 */

/** A simple transition to a target state. */
export interface SimpleTransition<S extends string> {
  readonly to: S;
}

/**
 * A transition that also updates context.
 *
 * @since 2.5.0
 */
export interface ContextTransition<S extends string, C> {
  readonly to: S;
  readonly update: (ctx: C) => C;
}

/**
 * A transition is either simple (just target) or with context update.
 *
 * @since 2.5.0
 */
export type Transition<S extends string, C> =
  | SimpleTransition<S>
  | ContextTransition<S, C>;

/**
 * A transition map for a single state.
 *
 * @since 2.5.0
 */
export type Transitions<S extends string, E extends string, C> = {
  readonly [K in E]?: Transition<S, C>;
};

/**
 * Full state machine definition.
 *
 * @since 2.5.0
 */
export type MachineDefinition<S extends string, E extends string, C> = {
  readonly [K in S]: Transitions<S, E, C>;
};

/**
 * A transition listener receives the previous state, the event, and the new state.
 *
 * @since 2.5.0
 */
export type TransitionListener<S extends string, E extends string> = (
  from: S,
  event: E,
  to: S,
) => void;

function hasUpdate<S extends string, C>(
  t: Transition<S, C>,
): t is ContextTransition<S, C> {
  return "update" in t;
}

/**
 * Creates a lightweight finite state machine (no `trySend`, no `@zygos/option` dependency).
 *
 * @template S - Union of state names
 * @template E - Union of event names
 * @param definition - The state/transition map
 * @param initial - The initial state
 * @returns A machine with `current`, `send`, `matches`, `onTransition`, `reset`
 * @since 2.5.0
 */
export function createLiteMachine<S extends string, E extends string>(
  definition: MachineDefinition<S, E, undefined>,
  initial: S,
): {
  current: () => S;
  send: (event: E) => S;
  matches: (state: S) => boolean;
  onTransition: (listener: TransitionListener<S, E>) => () => void;
  reset: () => void;
};

/**
 * Creates a lightweight finite state machine with context.
 *
 * @template S - Union of state names
 * @template E - Union of event names
 * @template C - Context type
 * @param definition - The state/transition map
 * @param initial - The initial state
 * @param initialContext - The initial context value
 * @returns A machine with `current`, `context`, `send`, `matches`, `onTransition`, `reset`
 * @since 2.5.0
 */
export function createLiteMachine<S extends string, E extends string, C>(
  definition: MachineDefinition<S, E, C>,
  initial: S,
  initialContext: C,
): {
  current: () => S;
  context: () => C;
  send: (event: E) => S;
  matches: (state: S) => boolean;
  onTransition: (listener: TransitionListener<S, E>) => () => void;
  reset: () => void;
};

export function createLiteMachine<S extends string, E extends string, C = undefined>(
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

  const onTransition = (listener: TransitionListener<S, E>): (() => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };

  const base = {
    current: () => state,
    send,
    matches: (s: S) => state === s,
    onTransition,
    reset: () => {
      state = initial;
      ctx = initialContext;
    },
  };

  if (initialContext !== undefined) {
    return {
      ...base,
      context: () => ctx as C,
    };
  }

  return base;
}
