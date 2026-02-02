import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { orElse, orElseAsync, orElseLazy } from "./orElse";

// Helpers for localStorage mocking
const createMockLocalStorage = (
  getItemImpl: (key: string) => string | never
): { getItem: ReturnType<typeof vi.fn> } => {
  return { getItem: vi.fn((_key: string) => getItemImpl(_key)) };
};

const setupLocalStorageMock = (mockLocalStorage: {
  getItem: ReturnType<typeof vi.fn>;
}): void => {
  (
    global as unknown as { localStorage: typeof mockLocalStorage }
  ).localStorage = mockLocalStorage;
};

const getLocalStorage = (): {
  localStorage: { getItem: (key: string) => string | null };
} => {
  return global as unknown as {
    localStorage: { getItem: (key: string) => string | null };
  };
};

// Shared setup/teardown
const setupLocalStorageHooks = (): void => {
  let originalLocalStorage: Storage | undefined;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;
  });

  afterEach(() => {
    if (originalLocalStorage !== undefined) {
      global.localStorage = originalLocalStorage;
    } else {
      delete (global as { localStorage?: Storage }).localStorage;
    }
    vi.clearAllMocks();
  });
};

// Test cases for basic functionality
const basicTestCases = [
  { value: 42, fallback: 0, type: "number" },
  { value: "success", fallback: "fallback", type: "string" },
  { value: true, fallback: false, type: "boolean" },
  { value: null, fallback: "fallback", type: "null" },
  { value: undefined, fallback: "fallback", type: "undefined" },
] as const;

// Test cases for error types
const errorTestCases = [
  { error: new TypeError("Type error"), name: "TypeError" },
  { error: new ReferenceError("Reference error"), name: "ReferenceError" },
  { error: new SyntaxError("Syntax error"), name: "SyntaxError" },
  { error: "String error", name: "string" },
  { error: 42, name: "number" },
  { error: { error: "Object error" }, name: "object" },
  { error: null, name: "null" },
  { error: undefined, name: "undefined" },
] as const;

// Test cases for edge cases
const edgeCaseTestCases = [
  { value: undefined, fallback: "fallback", matcher: "toBe" as const },
  { value: null, fallback: "fallback", matcher: "toBe" as const },
  { value: 0, fallback: 1, matcher: "toBe" as const },
  { value: "", fallback: "fallback", matcher: "toBe" as const },
  { value: false, fallback: true, matcher: "toBe" as const },
  { value: [], fallback: [1, 2, 3], matcher: "toEqual" as const },
  { value: {}, fallback: { error: "Failed" }, matcher: "toEqual" as const },
  { value: NaN, fallback: 0, matcher: "toBeNaN" as const },
  { value: Infinity, fallback: 0, matcher: "toBe" as const },
  { value: -Infinity, fallback: 0, matcher: "toBe" as const },
] as const;

describe("orElse", () => {
  setupLocalStorageHooks();

  describe("Basic functionality", () => {
    basicTestCases.forEach(({ value, fallback, type }) => {
      test(`returns function result with ${type} values`, () => {
        const result = orElse(() => value, fallback);
        expect(result).toBe(value);
      });

      test(`returns fallback with ${type} values when error occurs`, () => {
        const result = orElse(() => {
          throw new Error("Test error");
        }, fallback);
        expect(result).toBe(fallback);
      });
    });

    test("returns function result with object values", () => {
      const obj = { name: "John", age: 25 };
      const result = orElse(() => obj, { name: "Default", age: 0 });
      expect(result).toBe(obj);
    });

    test("returns fallback with object values when error occurs", () => {
      const fallback = { error: "Failed" };
      const result = orElse(() => {
        throw new Error("Test error");
      }, fallback);
      expect(result).toBe(fallback);
    });

    test("returns function result with array values", () => {
      const arr = [1, 2, 3];
      const result = orElse(() => arr, []);
      expect(result).toBe(arr);
    });

    test("returns fallback with array values when error occurs", () => {
      const fallback = [0];
      const result = orElse(() => {
        throw new Error("Test error");
      }, fallback);
      expect(result).toBe(fallback);
    });
  });

  describe("Error handling", () => {
    errorTestCases.forEach(({ error, name }) => {
      test(`handles ${name} thrown as error`, () => {
        const result = orElse(() => {
          throw error;
        }, "fallback");
        expect(result).toBe("fallback");
      });
    });

    test("handles custom error", () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = "CustomError";
        }
      }

      const result = orElse(() => {
        throw new CustomError("Custom error");
      }, "fallback");
      expect(result).toBe("fallback");
    });
  });

  describe("Real-world use cases", () => {
    test("handles JSON.parse with invalid JSON", () => {
      const result = orElse(() => JSON.parse("invalid json"), {});
      expect(result).toEqual({});
    });

    test("handles JSON.parse with valid JSON", () => {
      const result = orElse(() => JSON.parse('{"name": "John"}'), {});
      expect(result).toEqual({ name: "John" });
    });

    test("handles localStorage access", () => {
      const mockLocalStorage = createMockLocalStorage(() => "stored value");
      setupLocalStorageMock(mockLocalStorage);

      const result = orElse(
        () => getLocalStorage().localStorage.getItem("key"),
        "default"
      );
      expect(result).toBe("stored value");
    });

    test("handles localStorage access when it throws", () => {
      const mockLocalStorage = createMockLocalStorage(() => {
        throw new Error("localStorage not available");
      });
      setupLocalStorageMock(mockLocalStorage);

      const result = orElse(
        () => getLocalStorage().localStorage.getItem("key"),
        "default"
      );
      expect(result).toBe("default");
    });
  });

  describe("Edge cases", () => {
    edgeCaseTestCases.forEach(({ value, fallback, matcher }) => {
      const valueType = Array.isArray(value)
        ? "empty array"
        : typeof value === "object" && value !== null
        ? "empty object"
        : typeof value === "number" && isNaN(value)
        ? "NaN"
        : typeof value === "number" && !isFinite(value)
        ? value === Infinity
          ? "Infinity"
          : "-Infinity"
        : typeof value;

      test(`handles function that returns ${valueType}`, () => {
        const result = orElse(() => value, fallback);
        if (matcher === "toBeNaN") {
          expect(result).toBeNaN();
        } else if (matcher === "toEqual") {
          expect(result).toEqual(value);
        } else {
          expect(result).toBe(value);
        }
      });
    });
  });
});

describe("orElseAsync", () => {
  setupLocalStorageHooks();

  describe("Basic functionality", () => {
    basicTestCases.forEach(({ value, fallback, type }) => {
      test(`returns function result with ${type} values`, async () => {
        const result = await orElseAsync(async () => value, fallback);
        expect(result).toBe(value);
      });

      test(`returns fallback with ${type} values when error occurs`, async () => {
        const result = await orElseAsync(async () => {
          throw new Error("Test error");
        }, fallback);
        expect(result).toBe(fallback);
      });
    });

    test("returns function result with object values", async () => {
      const obj = { name: "John", age: 25 };
      const result = await orElseAsync(async () => obj, {
        name: "Default",
        age: 0,
      });
      expect(result).toBe(obj);
    });

    test("returns fallback with object values when error occurs", async () => {
      const fallback = { error: "Failed" };
      const result = await orElseAsync(async () => {
        throw new Error("Test error");
      }, fallback);
      expect(result).toBe(fallback);
    });

    test("returns function result with array values", async () => {
      const arr = [1, 2, 3];
      const result = await orElseAsync(async () => arr, []);
      expect(result).toBe(arr);
    });

    test("returns fallback with array values when error occurs", async () => {
      const fallback = [0];
      const result = await orElseAsync(async () => {
        throw new Error("Test error");
      }, fallback);
      expect(result).toBe(fallback);
    });
  });

  describe("Error handling", () => {
    errorTestCases.forEach(({ error, name }) => {
      test(`handles ${name} thrown as error`, async () => {
        const result = await orElseAsync(async () => {
          throw error;
        }, "fallback");
        expect(result).toBe("fallback");
      });
    });

    test("handles custom error", async () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = "CustomError";
        }
      }

      const result = await orElseAsync(async () => {
        throw new CustomError("Custom error");
      }, "fallback");
      expect(result).toBe("fallback");
    });
  });

  describe("Real-world use cases", () => {
    test("handles fetch with network error", async () => {
      global.fetch = vi.fn(() => {
        throw new Error("Network error");
      });

      const result = await orElseAsync(async () => {
        const response = await fetch("/api/data");
        return await response.json();
      }, {});

      expect(result).toEqual({});
    });

    test("handles fetch with successful response", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: "success" }),
        } as Response)
      );

      const result = await orElseAsync(async () => {
        const response = await fetch("/api/data");
        return await response.json();
      }, {});

      expect(result).toEqual({ data: "success" });
    });
  });

  describe("Edge cases", () => {
    edgeCaseTestCases.forEach(({ value, fallback, matcher }) => {
      const valueType = Array.isArray(value)
        ? "empty array"
        : typeof value === "object" && value !== null
        ? "empty object"
        : typeof value === "number" && isNaN(value)
        ? "NaN"
        : typeof value === "number" && !isFinite(value)
        ? value === Infinity
          ? "Infinity"
          : "-Infinity"
        : typeof value;

      test(`handles function that returns ${valueType}`, async () => {
        const result = await orElseAsync(async () => value, fallback);
        if (matcher === "toBeNaN") {
          expect(result).toBeNaN();
        } else if (matcher === "toEqual") {
          expect(result).toEqual(value);
        } else {
          expect(result).toBe(value);
        }
      });
    });
  });
});

describe("orElseLazy", () => {
  setupLocalStorageHooks();

  describe("Basic functionality", () => {
    basicTestCases.forEach(({ value, fallback, type }) => {
      test(`returns function result with ${type} values`, () => {
        const result = orElseLazy(
          () => value,
          () => fallback
        );
        expect(result).toBe(value);
      });

      test(`returns fallback function result with ${type} values when error occurs`, () => {
        const result = orElseLazy(
          () => {
            throw new Error("Test error");
          },
          () => fallback
        );
        expect(result).toBe(fallback);
      });
    });

    test("returns function result with object values", () => {
      const obj = { name: "John", age: 25 };
      const result = orElseLazy(
        () => obj,
        () => ({})
      );
      expect(result).toBe(obj);
    });

    test("returns fallback function result with object values when error occurs", () => {
      const fallback = { error: "Failed" };
      const result = orElseLazy(
        () => {
          throw new Error("Test error");
        },
        () => fallback
      );
      expect(result).toBe(fallback);
    });

    test("returns function result with array values", () => {
      const arr = [1, 2, 3];
      const result = orElseLazy(
        () => arr,
        () => []
      );
      expect(result).toBe(arr);
    });

    test("returns fallback function result with array values when error occurs", () => {
      const fallback = [0];
      const result = orElseLazy(
        () => {
          throw new Error("Test error");
        },
        () => fallback
      );
      expect(result).toBe(fallback);
    });
  });

  describe("Lazy evaluation", () => {
    test("does not execute fallback function when main function succeeds", () => {
      const fallbackFn = vi.fn(() => "fallback");
      const result = orElseLazy(() => "success", fallbackFn);
      expect(result).toBe("success");
      expect(fallbackFn).not.toHaveBeenCalled();
    });

    test("executes fallback function when main function fails", () => {
      const fallbackFn = vi.fn(() => "fallback");
      const result = orElseLazy(() => {
        throw new Error("Test error");
      }, fallbackFn);
      expect(result).toBe("fallback");
      expect(fallbackFn).toHaveBeenCalledTimes(1);
    });

    test("executes fallback function with side effects", () => {
      let sideEffect = 0;
      const fallbackFn = () => {
        sideEffect++;
        return "fallback";
      };

      const result = orElseLazy(() => {
        throw new Error("Test error");
      }, fallbackFn);
      expect(result).toBe("fallback");
      expect(sideEffect).toBe(1);
    });

    test("does not execute fallback function with side effects when main function succeeds", () => {
      let sideEffect = 0;
      const fallbackFn = () => {
        sideEffect++;
        return "fallback";
      };

      const result = orElseLazy(() => "success", fallbackFn);
      expect(result).toBe("success");
      expect(sideEffect).toBe(0);
    });
  });

  describe("Error handling", () => {
    errorTestCases.forEach(({ error, name }) => {
      test(`handles ${name} thrown as error`, () => {
        const result = orElseLazy(
          () => {
            throw error;
          },
          () => "fallback"
        );
        expect(result).toBe("fallback");
      });
    });

    test("handles custom error", () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = "CustomError";
        }
      }

      const result = orElseLazy(
        () => {
          throw new CustomError("Custom error");
        },
        () => "fallback"
      );
      expect(result).toBe("fallback");
    });
  });

  describe("Real-world use cases", () => {
    test("handles JSON.parse with invalid JSON and dynamic fallback", () => {
      const result = orElseLazy(
        () => JSON.parse("invalid json"),
        () => ({ error: "Invalid JSON", timestamp: Date.now() })
      );
      expect(result).toHaveProperty("error", "Invalid JSON");
      expect(result).toHaveProperty("timestamp");
      expect(typeof result.timestamp).toBe("number");
    });

    test("handles JSON.parse with valid JSON", () => {
      const result = orElseLazy(
        () => JSON.parse('{"name": "John"}'),
        () => ({ error: "Invalid JSON", timestamp: Date.now() })
      );
      expect(result).toEqual({ name: "John" });
    });

    test("handles localStorage access with dynamic fallback", () => {
      const mockLocalStorage = createMockLocalStorage(() => {
        throw new Error("localStorage not available");
      });
      setupLocalStorageMock(mockLocalStorage);

      const result = orElseLazy(
        () => getLocalStorage().localStorage.getItem("config"),
        () =>
          ({ theme: "dark", language: "en" } as
            | string
            | { theme: string; language: string })
      );
      expect(result).toEqual({ theme: "dark", language: "en" });
    });

    test("handles localStorage access with successful result", () => {
      const mockLocalStorage = createMockLocalStorage(
        () => '{"theme": "light", "language": "fr"}'
      );
      setupLocalStorageMock(mockLocalStorage);

      const result = orElseLazy(
        () =>
          JSON.parse(getLocalStorage().localStorage.getItem("config") || "{}"),
        () => ({ theme: "dark", language: "en" })
      );
      expect(result).toEqual({ theme: "light", language: "fr" });
    });
  });

  describe("Edge cases", () => {
    edgeCaseTestCases.forEach(({ value, fallback, matcher }) => {
      const valueType = Array.isArray(value)
        ? "empty array"
        : typeof value === "object" && value !== null
        ? "empty object"
        : typeof value === "number" && isNaN(value)
        ? "NaN"
        : typeof value === "number" && !isFinite(value)
        ? value === Infinity
          ? "Infinity"
          : "-Infinity"
        : typeof value;

      test(`handles function that returns ${valueType}`, () => {
        const result = orElseLazy(
          () => value,
          () => fallback
        );
        if (matcher === "toBeNaN") {
          expect(result).toBeNaN();
        } else if (matcher === "toEqual") {
          expect(result).toEqual(value);
        } else {
          expect(result).toBe(value);
        }
      });
    });
  });
});
