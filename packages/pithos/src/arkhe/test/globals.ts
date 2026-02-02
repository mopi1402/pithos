//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
// INTENTIONAL: Encapsulating globalThis access to avoid repeating type casts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _globalThis = globalThis as any;

/**
 * Returns typed reference to globalThis for test environments.
 *
 * @returns The global object with any typing.
 * @since 1.1.0
 */
export const getGlobalThis = (): typeof _globalThis => _globalThis;

/**
 * Global registry to track mock restores for automatic cleanup.
 * @internal
 */
const activeRestores = new Set<() => void>();

/** @internal */
const registerRestore = (restore: () => void): void => {
  activeRestores.add(restore);
};

/** @internal */
// Stryker disable next-line BlockStatement: equivalent mutant - double restore has same observable result but causes memory leak
const unregisterRestore = (restore: () => void): void => {
  activeRestores.delete(restore);
};

/**
 * Wraps a restore function for automatic tracking.
 * @internal
 */
export const trackRestore = (restore: () => void): (() => void) => {
  registerRestore(restore);
  return () => {
    unregisterRestore(restore);
    restore();
  };
};

/**
 * Restores all tracked mocks (LIFO order). Called automatically after each test.
 * @internal
 * @performance Uses Set for O(1) add/delete. Restores in reverse order (LIFO) via Array.from and reverse iteration.
 */
const autoRestoreAll = (): void => {
  const restores = Array.from(activeRestores);
  activeRestores.clear();
  for (let i = restores.length - 1; i >= 0; i--) {
    restores[i]();
  }
};

/** @internal */
export const __autoRestoreAll = autoRestoreAll;

/** Result of mockWindow(). */
export interface MockWindowResult {
  window: Window & typeof _globalThis;
  restore: () => void;
}

/**
 * Creates a mock window object on globalThis for Node.js tests.
 *
 * @param overrides - Properties to set on the mock window.
 * @returns Object containing the mock window and restore function.
 * @since 1.1.0
 *
 * @note Always call `restore()` for cleanup. Auto-restored after each test if forgotten.
 *
 * @example
 * ```typescript
 * const { window, restore } = mockWindow({ innerWidth: 1024 });
 * expect(window.innerWidth).toBe(1024);
 * restore();
 * ```
 */
export const mockWindow = (
  overrides: Partial<Window> = {}
): MockWindowResult => {
  const originalWindow = (_globalThis as Record<string, unknown>).window;
  const hasOriginalWindow = "window" in _globalThis;

  const mockWin = { ...overrides } as Window & typeof _globalThis;
  (_globalThis as Record<string, unknown>).window = mockWin;

  const restore = () => {
    if (hasOriginalWindow) {
      (_globalThis as Record<string, unknown>).window = originalWindow;
    } else {
      delete (_globalThis as Record<string, unknown>).window;
    }
  };

  return { window: mockWin, restore: trackRestore(restore) };
};

/** Result of mockDocument(). */
export interface MockDocumentResult {
  document: Document;
  restore: () => void;
}

/**
 * Creates a mock document object on globalThis for Node.js tests.
 *
 * @param overrides - Properties to set on the mock document.
 * @returns Object containing the mock document and restore function.
 * @since 1.1.0
 *
 * @note Always call `restore()` for cleanup. Auto-restored after each test if forgotten.
 *
 * @example
 * ```typescript
 * const { document, restore } = mockDocument({
 *   querySelector: vi.fn(() => null),
 * });
 * restore();
 * ```
 */
export const mockDocument = (
  overrides: Partial<Document> = {}
): MockDocumentResult => {
  const originalDocument = (_globalThis as Record<string, unknown>).document;
  const hasOriginalDocument = "document" in _globalThis;

  const mockDoc = { ...overrides } as Document;
  (_globalThis as Record<string, unknown>).document = mockDoc;

  const restore = () => {
    if (hasOriginalDocument) {
      (_globalThis as Record<string, unknown>).document = originalDocument;
    } else {
      delete (_globalThis as Record<string, unknown>).document;
    }
  };

  return { document: mockDoc, restore: trackRestore(restore) };
};

/** Result of mockDOMRect(). */
export interface MockDOMRectResult {
  DOMRect: typeof DOMRect;
  restore: () => void;
}

/**
 * Creates a mock DOMRect constructor on globalThis for Node.js tests.
 *
 * @param implementation - Optional custom DOMRect implementation.
 * @returns Object containing the mock DOMRect and restore function.
 * @since 1.1.0
 *
 * @note Always call `restore()` for cleanup. Auto-restored after each test if forgotten.
 *
 * @example
 * ```typescript
 * const { DOMRect, restore } = mockDOMRect();
 * const rect = new DOMRect(0, 0, 100, 100);
 * expect(rect.width).toBe(100);
 * restore();
 * ```
 */
export const mockDOMRect = (
  implementation?: typeof DOMRect
): MockDOMRectResult => {
  const originalDOMRect = (_globalThis as Record<string, unknown>).DOMRect;
  const hasOriginalDOMRect = "DOMRect" in _globalThis;

  const mockDOMRectClass =
    implementation ??
    (class DOMRect {
      x: number;
      y: number;
      width: number;
      height: number;
      top: number;
      right: number;
      bottom: number;
      left: number;

      constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = y;
        this.left = x;
        this.right = x + width;
        this.bottom = y + height;
      }

      toJSON() {
        return JSON.stringify({
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
          top: this.top,
          right: this.right,
          bottom: this.bottom,
          left: this.left,
        });
      }
    } as typeof DOMRect);

  (_globalThis as Record<string, unknown>).DOMRect = mockDOMRectClass;

  const restore = () => {
    if (hasOriginalDOMRect) {
      (_globalThis as Record<string, unknown>).DOMRect = originalDOMRect;
    } else {
      delete (_globalThis as Record<string, unknown>).DOMRect;
    }
  };

  return { DOMRect: mockDOMRectClass, restore: trackRestore(restore) };
};

/** Result of mockPerformance(). */
export interface MockPerformanceResult {
  performance: Performance;
  restore: () => void;
}

/**
 * Creates a mock performance object on globalThis for Node.js tests.
 *
 * @param overrides - Properties to override on the mock performance.
 * @returns Object containing the mock performance and restore function.
 * @since 1.1.0
 *
 * @note Always call `restore()` for cleanup. Auto-restored after each test if forgotten.
 *
 * @example
 * ```typescript
 * const { performance, restore } = mockPerformance({
 *   now: vi.fn(() => 12345),
 * });
 * expect(performance.now()).toBe(12345);
 * restore();
 * ```
 */
export const mockPerformance = (
  overrides: Partial<Performance> = {}
): MockPerformanceResult => {
  const originalPerformance = (_globalThis as Record<string, unknown>)
    .performance;
  const hasOriginalPerformance = "performance" in _globalThis;

  const mockPerf = { now: () => Date.now(), ...overrides } as Performance;
  (_globalThis as Record<string, unknown>).performance = mockPerf;

  const restore = () => {
    if (hasOriginalPerformance) {
      (_globalThis as Record<string, unknown>).performance =
        originalPerformance;
    } else {
      delete (_globalThis as Record<string, unknown>).performance;
    }
  };

  return { performance: mockPerf, restore: trackRestore(restore) };
};

/**
 * Sets a value on globalThis and returns a restore function.
 *
 * @template T - The value type.
 * @param key - The key to set on globalThis.
 * @param value - The value to set.
 * @returns A restore function.
 * @since 1.1.0
 *
 * @note Always call the returned restore function. Auto-restored after each test if forgotten.
 *
 * @example
 * ```typescript
 * const restore = setGlobal('fetch', vi.fn());
 * // ... tests ...
 * restore();
 * ```
 */
export const setGlobal = <T>(key: string, value: T): (() => void) => {
  const globals = _globalThis as Record<string, unknown>;
  const originalValue = globals[key];
  const hasOriginal = key in _globalThis;

  globals[key] = value;

  const restore = () => {
    if (hasOriginal) {
      globals[key] = originalValue;
    } else {
      delete globals[key];
    }
  };

  return trackRestore(restore);
};
