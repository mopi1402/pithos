/**
 * Functional Command Pattern.
 *
 * In OOP, the Command pattern requires a Command interface, concrete command
 * classes, a Receiver, and an Invoker - all to encapsulate an action as an object.
 * In functional TypeScript, a command is a thunk (zero-arg function).
 * The real value is in undo/redo, which becomes a pair of closures.
 *
 * ## Two flavors
 *
 * - `createCommandStack`: imperative. Commands are thunks that mutate external state.
 *   Works naturally with Vue, Angular, Svelte, or any mutable-reactive system.
 *
 * - `createReactiveCommandStack`: declarative. Commands are pure `(state) => state`
 *   transforms. The stack manages state and notifies via `onChange`.
 *   Works naturally with React or any immutable-state system.
 *
 * ## Command vs Memento for undo/redo
 *
 * - **Command** (`createCommandStack` / `createReactiveCommandStack`):
 *   stores *actions* with their inverses.
 *   Undo calls the command's undo function. Use when you have reversible operations.
 *
 * - **Memento** (`createHistory`): stores *state snapshots*.
 *   Undo restores the previous state. Use when state is cheap to copy.
 *
 * @module eidos/command
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/command/ | Explanations, examples and live demo}
 *
 * @example Imperative (side effects, external state)
 * ```ts
 * import { undoable, createCommandStack } from "@pithos/core/eidos/command/command";
 *
 * let counter = 0;
 * const increment = undoable(() => counter++, () => counter--);
 *
 * const stack = createCommandStack();
 * stack.execute(increment); // counter = 1
 * stack.execute(increment); // counter = 2
 * stack.undo();             // counter = 1
 * stack.redo();             // counter = 2
 * ```
 *
 * @example Reactive (pure transforms, framework-friendly)
 * ```ts
 * import { undoableState, createReactiveCommandStack } from "@pithos/core/eidos/command/command";
 *
 * interface Counter { value: number }
 *
 * const increment = undoableState<Counter>(
 *   (s) => ({ ...s, value: s.value + 1 }),
 *   (s) => ({ ...s, value: s.value - 1 }),
 * );
 *
 * const stack = createReactiveCommandStack({
 *   initial: { value: 0 },
 *   onChange: (state) => console.log(state), // or setBoard, or ref.value = state
 * });
 *
 * stack.execute(increment); // onChange({ value: 1 })
 * stack.execute(increment); // onChange({ value: 2 })
 * stack.undo();             // onChange({ value: 1 })
 * stack.redo();             // onChange({ value: 2 })
 * ```
 */

import { Result } from "@zygos/result/result";
import type { Result as ResultType } from "@zygos/result/result";

/**
 * A Command is a thunk - a deferred action with no arguments.
 * In FP, this IS the pattern: a function is already a reifiable value.
 *
 * @since 2.4.0
 */
export type Command = () => void;

/**
 * An UndoableCommand pairs an execute action with its inverse.
 * Replaces the GoF Command interface + ConcreteCommand classes.
 *
 * @since 2.4.0
 */
export interface UndoableCommand {
  readonly execute: Command;
  readonly undo: Command;
}

/**
 * Creates an undoable command from an execute/undo pair.
 *
 * @param execute - The action to perform
 * @param undo - The action that reverses execute
 * @returns An UndoableCommand
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const items: string[] = [];
 *
 * const addItem = (item: string) => undoable(
 *   () => items.push(item),
 *   () => items.pop(),
 * );
 *
 * const cmd = addItem("hello");
 * cmd.execute(); // items = ["hello"]
 * cmd.undo();    // items = []
 * ```
 */
export function undoable(execute: Command, undo: Command): UndoableCommand {
  return { execute, undo };
}

/**
 * Creates a command stack with undo/redo support.
 *
 * This stores *actions* (execute/undo pairs). When you undo, it calls the
 * command's undo function. Use this when you have reversible operations.
 *
 * For storing *states* (snapshots) instead of actions, see the Memento pattern's
 * `createHistory` which stores state snapshots and restores them on undo.
 *
 * @returns Stack with `execute`, `undo`, `redo`, `canUndo`, `canRedo`, `clear`
 * @since 2.4.0
 *
 * @example
 * ```ts
 * let value = 0;
 * const stack = createCommandStack();
 *
 * stack.execute(undoable(() => value += 10, () => value -= 10));
 * stack.execute(undoable(() => value *= 2,  () => value /= 2));
 * // value = 20
 *
 * stack.undo(); // value = 10
 * stack.undo(); // value = 0
 * stack.redo(); // value = 10
 * ```
 */
export function createCommandStack() {
  const past: UndoableCommand[] = [];
  const future: UndoableCommand[] = [];

  return {
    /** Execute a command and push it to the undo stack. Clears redo stack. */
    execute: (cmd: UndoableCommand): void => {
      cmd.execute();
      past.push(cmd);
      future.length = 0;
    },

    /**
     * Undo the last command. Returns false if nothing to undo.
     * Check `canUndo` first if the result matters to your logic.
     */
    undo: (): boolean => {
      const cmd = past.pop();
      if (!cmd) return false;
      cmd.undo();
      future.push(cmd);
      return true;
    },

    /**
     * Redo the last undone command. Returns false if nothing to redo.
     * Check `canRedo` first if the result matters to your logic.
     */
    redo: (): boolean => {
      const cmd = future.pop();
      if (!cmd) return false;
      cmd.execute();
      past.push(cmd);
      return true;
    },

    get canUndo(): boolean {
      return past.length > 0;
    },

    get canRedo(): boolean {
      return future.length > 0;
    },

    /** Clear all history. */
    clear: (): void => {
      past.length = 0;
      future.length = 0;
    },
  };
}

/**
 * Executes a command safely, catching any error and returning
 * a zygos `Result` instead of throwing.
 *
 * @deprecated Use `Result.fromThrowable` from `@zygos/result/result` instead.
 *
 * ```ts
 * import { Result } from "@zygos/result/result";
 *
 * const safeCmd = Result.fromThrowable(riskyCommand, (e) =>
 *   e instanceof Error ? e : new Error(String(e)),
 * );
 * const result = safeCmd();
 * ```
 *
 * @see {@link https://pithos.dev/api/eidos/command/ | Full explanation, examples and live demo}
 * @param cmd - The command to execute
 * @returns `Ok(void)` on success, `Err(Error)` on failure
 * @since 2.4.0
 */
export function safeExecute(cmd: Command): ResultType<void, Error> {
  const safe = Result.fromThrowable(cmd, (e) =>
    e instanceof Error ? e : new Error(String(e)),
  );
  return safe();
}

// ── Reactive variant ─────────────────────────────────────────────────

/**
 * A state command is a pure function: takes current state, returns next state.
 * No mutation, no side effects. The stack manages the state for you.
 *
 * @since 2.5.0
 */
export type StateCommand<S> = (state: S) => S;

/**
 * An undoable state command pairs a forward transform with its inverse.
 * Both are pure functions from state to state.
 *
 * @since 2.5.0
 */
export interface UndoableStateCommand<S> {
  readonly execute: StateCommand<S>;
  readonly undo: StateCommand<S>;
}

/**
 * Creates an undoable state command from an execute/undo pair.
 * Unlike `undoable` (imperative thunks), these are pure state transforms.
 *
 * @param execute - Pure function that produces the next state
 * @param undo - Pure function that reverses execute
 * @returns An UndoableStateCommand
 * @since 2.5.0
 *
 * @example
 * ```ts
 * interface Counter { value: number }
 *
 * const increment = undoableState<Counter>(
 *   (s) => ({ ...s, value: s.value + 1 }),
 *   (s) => ({ ...s, value: s.value - 1 }),
 * );
 * ```
 */
export function undoableState<S>(
  execute: StateCommand<S>,
  undo: StateCommand<S>,
): UndoableStateCommand<S> {
  return { execute, undo };
}

/**
 * Options for `createReactiveCommandStack`.
 *
 * @since 2.5.0
 */
export interface ReactiveCommandStackOptions<S> {
  /** The initial state. */
  readonly initial: S;
  /** Called after every state change (execute, undo, redo, clear). */
  readonly onChange: (state: S) => void;
}

/**
 * Creates a reactive command stack with undo/redo support.
 *
 * Unlike `createCommandStack` (imperative, mutation-based), this variant
 * manages state internally and notifies via `onChange` on every transition.
 * Commands are pure functions from state to state, making it naturally
 * compatible with React, Vue, Angular, or any reactive framework.
 *
 * @param options - Initial state and onChange callback
 * @returns Stack with `execute`, `undo`, `redo`, `canUndo`, `canRedo`, `clear`, `state`
 * @since 2.5.0
 *
 * @example
 * ```ts
 * // React
 * const [board, setBoard] = useState(INITIAL);
 * const stack = useRef(createReactiveCommandStack({
 *   initial: INITIAL,
 *   onChange: setBoard,
 * }));
 *
 * stack.current.execute(undoableState(
 *   (b) => moveTask(b, "todo", "done", task),
 *   (b) => moveTask(b, "done", "todo", task),
 * ));
 * // setBoard is called automatically with the new state
 *
 * stack.current.undo();  // setBoard called with previous state
 * stack.current.redo();  // setBoard called with next state
 * ```
 */
export function createReactiveCommandStack<S>(
  options: ReactiveCommandStackOptions<S>,
) {
  let current: S = options.initial;
  const past: UndoableStateCommand<S>[] = [];
  const future: UndoableStateCommand<S>[] = [];

  function notify() {
    options.onChange(current);
  }

  return {
    /** Execute a state command. Clears redo stack. */
    execute: (cmd: UndoableStateCommand<S>): void => {
      current = cmd.execute(current);
      past.push(cmd);
      future.length = 0;
      notify();
    },

    /** Undo the last command. Returns false if nothing to undo. */
    undo: (): boolean => {
      const cmd = past.pop();
      if (!cmd) return false;
      current = cmd.undo(current);
      future.push(cmd);
      notify();
      return true;
    },

    /** Redo the last undone command. Returns false if nothing to redo. */
    redo: (): boolean => {
      const cmd = future.pop();
      if (!cmd) return false;
      current = cmd.execute(current);
      past.push(cmd);
      notify();
      return true;
    },

    /** Current state. */
    get state(): S {
      return current;
    },

    get canUndo(): boolean {
      return past.length > 0;
    },

    get canRedo(): boolean {
      return future.length > 0;
    },

    /** Reset to initial state and clear all history. */
    clear: (): void => {
      current = options.initial;
      past.length = 0;
      future.length = 0;
      notify();
    },
  };
}
