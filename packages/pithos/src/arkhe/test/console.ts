import { trackRestore } from "./globals";

// INTENTIONAL: Encapsulating console access to avoid repeating type casts and no-undef
const _console = console as unknown as Record<
  ConsoleMethod,
  typeof console.log
>;

/**
 * All available console methods.
 * @internal
 */
const ALL_CONSOLE_METHODS: readonly ConsoleMethod[] = [
  "log",
  "warn",
  "error",
  "info",
  "debug",
  "trace",
] as const;

/**
 * Console method names that can be mocked.
 * @since 1.0.0
 */
export type ConsoleMethod =
  | "log"
  | "warn"
  | "error"
  | "info"
  | "debug"
  | "trace";

/**
 * Recorded call to a console method.
 * @since 1.0.0
 */
export interface ConsoleCall {
  /** Arguments passed to the console method. */
  args: unknown[];
  /** Timestamp of the call. */
  timestamp: number;
}

/**
 * Mock object for a single console method.
 * @since 1.0.0
 */
export interface ConsoleMock {
  /** All recorded calls. */
  calls: ConsoleCall[];
  /** Number of times the method was called. */
  callCount: number;
  /** Clears recorded calls. */
  clear: () => void;
}

/**
 * Result of mockConsole().
 * @since 1.0.0
 */
export interface MockConsoleResult {
  /** Mocks for each requested method, keyed by method name. */
  mocks: Record<string, ConsoleMock>;
  /** Restores all original console methods. */
  restore: () => void;
  /** Clears all recorded calls without restoring. */
  clearAll: () => void;
}

/**
 * Options for mockConsole.
 * @since 1.0.0
 */
export interface MockConsoleOptions {
  /** If true, still outputs to console while capturing. */
  passthrough?: boolean;
}

/**
 * Creates a restore function for console methods.
 * @internal
 */
function createRestoreFn(
  methods: ConsoleMethod[],
  originals: Map<ConsoleMethod, typeof console.log>
): () => void {
  return () => {
    for (const method of methods) {
      // INTENTIONAL: Map.get always returns value for iterated methods (set in same loop)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      _console[method] = originals.get(method)!;
    }
  };
}

/**
 * Mocks specified console methods, capturing calls for assertions.
 *
 * @param args - Console methods to mock and/or configuration options.
 * @returns The object with mocks and restore function.
 * @since 1.0.0
 *
 * @performance Uses Map for O(1) lookup of original console methods. Stores calls in arrays for O(1) append.
 *
 * @example
 * ```typescript
 * const { mocks, restore } = mockConsole("log", "warn");
 * console.log("test", 123);
 * console.warn("warning!");
 * expect(mocks.log.callCount).toBe(1);
 * expect(mocks.log.calls[0].args).toEqual(["test", 123]);
 * expect(mocks.warn.callCount).toBe(1);
 * restore();
 *
 * const { mocks: m, restore: r } = mockConsole("log", { passthrough: true });
 * console.log("captured and printed");
 * r();
 * ```
 */
export function mockConsole(
  ...args: (ConsoleMethod | MockConsoleOptions)[]
): MockConsoleResult {
  const options: MockConsoleOptions = {};
  const methods: ConsoleMethod[] = [];

  for (const arg of args) {
    if (typeof arg === "string") {
      methods.push(arg);
    } else {
      Object.assign(options, arg);
    }
  }

  if (methods.length === 0) {
    methods.push("log");
  }

  const originals = new Map<ConsoleMethod, typeof console.log>();
  const mocks: Record<string, ConsoleMock> = {};

  for (const method of methods) {
    originals.set(method, _console[method]);

    const mock: ConsoleMock = {
      calls: [],
      callCount: 0,
      clear: () => {
        mock.calls = [];
        mock.callCount = 0;
      },
    };

    mocks[method] = mock;

    _console[method] = (...callArgs: unknown[]) => {
      mock.calls.push({
        args: callArgs,
        timestamp: Date.now(),
      });
      mock.callCount++;

      if (options.passthrough) {
        // Stryker disable next-line OptionalChaining: Map.get always returns value - set in same loop
        originals.get(method)?.apply(console, callArgs);
      }
    };
  }

  return {
    mocks,
    restore: trackRestore(createRestoreFn(methods, originals)),
    clearAll: () => {
      for (const mock of Object.values(mocks)) {
        mock.clear();
      }
    },
  };
}

/**
 * Silences specified console methods for the duration of a test.
 *
 * @param methods - Console methods to silence (defaults to all).
 * @returns The restore function.
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const restore = silenceConsole("log", "warn");
 * console.log("silenced");
 * console.error("still prints");
 * restore();
 * ```
 */
export function silenceConsole(...methods: ConsoleMethod[]): () => void {
  const toSilence = methods.length > 0 ? methods : [...ALL_CONSOLE_METHODS];
  const originals = new Map<ConsoleMethod, typeof console.log>();

  for (const method of toSilence) {
    originals.set(method, _console[method]);
    _console[method] = () => { };
  }

  return trackRestore(createRestoreFn(toSilence, originals));
}

/**
 * Executes a function with console methods silenced, restoring automatically.
 *
 * @param fn - Function to execute.
 * @param methods - Console methods to silence (defaults to all).
 * @returns The return value of fn.
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const result = withSilentConsole(() => {
 *   console.log("silenced");
 *   return computeSomething();
 * });
 *
 * const data = await withSilentConsole(async () => {
 *   console.warn("silenced");
 *   return await fetchData();
 * }, "warn");
 * ```
 */
export function withSilentConsole<T>(
  fn: () => T,
  ...methods: ConsoleMethod[]
): T {
  const restore = silenceConsole(...methods);
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.finally(restore) as T;
    }
    restore();
    return result;
  } catch (error) {
    restore();
    throw error;
  }
}
