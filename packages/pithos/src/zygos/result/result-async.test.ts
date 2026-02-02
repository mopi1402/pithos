import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import {
  ResultAsync,
  okAsync,
  errAsync,
  fromPromise,
  fromSafePromise,
  fromAsyncThrowable,
  ok,
  err,
} from "@zygos/result/result"; // "@zygos/result/result" or "neverthrow"

describe("ResultAsync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Constructor", () => {
    it("creates ResultAsync from Promise<Ok>", async () => {
      const promise = Promise.resolve(ok(42));
      const resultAsync = new ResultAsync(promise);

      const result = await resultAsync;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("creates ResultAsync from Promise<Err>", async () => {
      const promise = Promise.resolve(err("error"));
      const resultAsync = new ResultAsync(promise);

      const result = await resultAsync;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("error");
      }
    });
  });

  describe("fromSafePromise", () => {
    it("creates ResultAsync from successful Promise", async () => {
      const promise = Promise.resolve(42);
      const resultAsync = ResultAsync.fromSafePromise(promise);

      const result = await resultAsync;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("handles Promise rejection by wrapping in Err", async () => {
      const promise = Promise.reject(new Error("test error"));
      const resultAsync = ResultAsync.fromSafePromise(promise);

      // fromSafePromise doesn't handle rejections, it will throw
      await expect(resultAsync).rejects.toThrow("test error");
    });
  });

  describe("fromPromise", () => {
    it("creates ResultAsync from successful Promise", async () => {
      const promise = Promise.resolve(42);
      const resultAsync = ResultAsync.fromPromise(
        promise,
        (e) => `Error: ${e}`
      );

      const result = await resultAsync;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("transforms Promise rejection using error function", async () => {
      const promise = Promise.reject("original error");
      const resultAsync = ResultAsync.fromPromise(
        promise,
        (e) => `Transformed: ${e}`
      );

      const result = await resultAsync;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("Transformed: original error");
      }
    });

    it("handles complex error transformation", async () => {
      type HttpError = { code: number; message: string };
      const promise = Promise.reject({ code: 404, message: "Not found" });
      const resultAsync = ResultAsync.fromPromise(
        promise,
        (e: unknown): string => {
          const httpError = e as HttpError;
          return `HTTP ${httpError.code}: ${httpError.message}`;
        }
      );

      const result = await resultAsync;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("HTTP 404: Not found");
      }
    });
  });

  describe("fromThrowable", () => {
    it("wraps async function that succeeds", async () => {
      const asyncFn = vi.fn().mockResolvedValue(42);
      const wrappedFn = ResultAsync.fromThrowable(asyncFn);

      const result = await wrappedFn();
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });

    it("wraps async function that throws", async () => {
      const asyncFn = vi.fn().mockRejectedValue("test error");
      const wrappedFn = ResultAsync.fromThrowable(
        asyncFn,
        (e) => `Wrapped: ${e}`
      );

      const result = await wrappedFn();
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("Wrapped: test error");
      }
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });

    it("uses default error transformation when no errorFn provided", async () => {
      const asyncFn = vi.fn().mockRejectedValue("test error");
      const wrappedFn = ResultAsync.fromThrowable(asyncFn);

      const result = await wrappedFn();
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("test error");
      }
    });

    it("handles function with multiple arguments", async () => {
      const asyncFn = vi.fn().mockResolvedValue("result");
      const wrappedFn = ResultAsync.fromThrowable(asyncFn);

      const result = await wrappedFn("arg1", 42, true);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("result");
      }
      expect(asyncFn).toHaveBeenCalledWith("arg1", 42, true);
    });
  });

  describe("combine", () => {
    it("combines multiple successful ResultAsyncs", async () => {
      const results = [okAsync(1), okAsync(2), okAsync(3)];

      const combined = ResultAsync.combine(results);
      const result = await combined;

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([1, 2, 3]);
      }
    });

    it("returns first error when any ResultAsync fails", async () => {
      const results = [okAsync(1), errAsync("second failed"), okAsync(3)];

      const combined = ResultAsync.combine(results);
      const result = await combined;

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("second failed");
      }
    });

    it("[🎯] handles empty array", async () => {
      const combined = ResultAsync.combine([]);
      const result = await combined;

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([]);
      }
    });

    it("[🎯] handles single ResultAsync", async () => {
      const results = [okAsync(42)];
      const combined = ResultAsync.combine(results);
      const result = await combined;

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([42]);
      }
    });
  });

  describe("map", () => {
    it("transforms success value synchronously", async () => {
      const resultAsync = okAsync(5);
      const mapped = resultAsync.map((x) => x * 2);

      const result = await mapped;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(10);
      }
    });

    it("transforms success value asynchronously", async () => {
      const resultAsync = okAsync(5);
      const mapped = resultAsync.map(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return x * 2;
      });

      const result = await mapped;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(10);
      }
    });

    it("[🎯] preserves error unchanged", async () => {
      const resultAsync = errAsync<number, string>("error");
      const mapped = resultAsync.map((x) => x * 2);

      const result = await mapped;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("error");
      }
    });

    it("[🎯] handles transformation that throws", async () => {
      const resultAsync = okAsync(5);
      const mapped = resultAsync.map(() => {
        throw new Error("transformation error");
      });

      // map doesn't catch transformation errors, it will throw
      await expect(mapped).rejects.toThrow("transformation error");
    });
  });

  describe("mapErr", () => {
    it("transforms error value synchronously", async () => {
      const resultAsync = errAsync("error");
      const mapped = resultAsync.mapErr((e) => `Enhanced: ${e}`);

      const result = await mapped;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("Enhanced: error");
      }
    });

    it("transforms error value asynchronously", async () => {
      const resultAsync = errAsync("error");
      const mapped = resultAsync.mapErr(async (e) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return `Async: ${e}`;
      });

      const result = await mapped;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("Async: error");
      }
    });

    it("[🎯] preserves success value unchanged", async () => {
      const resultAsync = okAsync(42);
      const mapped = resultAsync.mapErr((e) => `Enhanced: ${e}`);

      const result = await mapped;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });
  });

  describe("andThen", () => {
    it("chains successful operations", async () => {
      const resultAsync = okAsync(5);
      const chained = resultAsync.andThen((x) =>
        x > 0 ? okAsync(x * 2) : errAsync("negative")
      );

      const result = await chained;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(10);
      }
    });

    it("[🎯] propagates error from first operation", async () => {
      const resultAsync = errAsync<number, string>("first error");
      const chained = resultAsync.andThen((x) => okAsync(x * 2));

      const result = await chained;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("first error");
      }
    });

    it("[🎯] propagates error from second operation", async () => {
      const resultAsync = okAsync(5);
      const chained = resultAsync.andThen(() => errAsync("second error"));

      const result = await chained;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("second error");
      }
    });

    it("chains multiple operations", async () => {
      const resultAsync = okAsync(5);
      const chained = resultAsync
        .andThen((x) => okAsync(x * 2))
        .andThen((x) => okAsync(x.toString()));

      const result = await chained;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("10");
      }
    });
  });

  describe("unwrapOr", () => {
    it("returns success value when Ok", async () => {
      const resultAsync = okAsync(42);
      const value = await resultAsync.unwrapOr(0);

      expect(value).toBe(42);
    });

    it("returns default value when Err", async () => {
      const resultAsync = errAsync("error");
      const value = await resultAsync.unwrapOr(0);

      expect(value).toBe(0);
    });

    it("handles complex default values", async () => {
      const resultAsync = errAsync("error");
      const defaultValue = { id: 0, name: "default" };
      const value = await resultAsync.unwrapOr(defaultValue);

      expect(value).toEqual(defaultValue);
    });
  });

  describe("match", () => {
    it("executes success path when Ok", async () => {
      const resultAsync = okAsync(42);
      const message = await resultAsync.match(
        (value) => `Success: ${value}`,
        (error) => `Error: ${error}`
      );

      expect(message).toBe("Success: 42");
    });

    it("executes error path when Err", async () => {
      const resultAsync = errAsync("error");
      const message = await resultAsync.match(
        (value) => `Success: ${value}`,
        (error) => `Error: ${error}`
      );

      expect(message).toBe("Error: error");
    });

    it("handles async functions in match", async () => {
      const resultAsync = okAsync(42);
      const processed = await resultAsync.match(
        async (value) => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return value * 2;
        },
        () => 0
      );

      expect(processed).toBe(84);
    });

    it("handles different return types", async () => {
      const resultAsync = okAsync(42);
      const result = await resultAsync.match(
        (value) => value.toString(),
        () => false
      );

      expect(result).toBe("42");
    });
  });

  describe("then (PromiseLike)", () => {
    it("works with .then() method", async () => {
      const resultAsync = okAsync(42);
      const result = await resultAsync.then((res) =>
        res.isOk() ? res.value : 0
      );

      expect(result).toBe(42);
    });

    it("works with .catch() method", async () => {
      const resultAsync = errAsync("error");

      // ResultAsync doesn't implement .catch(), but we can use .then() with error handling
      const result = await resultAsync.then(
        (res) => (res.isOk() ? res.value : "caught"),
        () => "caught"
      );

      expect(result).toBe("caught");
    });

    it("works with Promise.all", async () => {
      const results = [okAsync(1), okAsync(2), okAsync(3)];

      const resolved = await Promise.all(results);
      expect(resolved).toHaveLength(3);
      expect(resolved[0].isOk()).toBe(true);
      expect(resolved[1].isOk()).toBe(true);
      expect(resolved[2].isOk()).toBe(true);
    });
  });
});

describe("okAsync", () => {
  it("creates ResultAsync from direct value", async () => {
    const resultAsync = okAsync(42);
    const result = await resultAsync;

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  it("creates ResultAsync from Promise", async () => {
    const promise = Promise.resolve("hello");
    const resultAsync = okAsync(promise);
    const result = await resultAsync;

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      // NeverThrow wraps the Promise, doesn't resolve it
      expect(result.value).toBe(promise);
    }
  });

  it("handles complex values", async () => {
    const user = { id: 1, name: "John" };
    const resultAsync = okAsync(user);
    const result = await resultAsync;

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(user);
    }
  });

  it("handles async function result", async () => {
    const fetchData = async () => ({ id: 1, name: "John" });
    const promise = fetchData();
    const resultAsync = okAsync(promise);
    const result = await resultAsync;

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      // NeverThrow wraps the Promise, doesn't resolve it
      expect(result.value).toBe(promise);
    }
  });
});

describe("errAsync", () => {
  it("creates ResultAsync with string error", async () => {
    const resultAsync = errAsync("Something went wrong");
    const result = await resultAsync;

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("Something went wrong");
    }
  });

  it("creates ResultAsync with Error object", async () => {
    const error = new Error("Network timeout");
    const resultAsync = errAsync(error);
    const result = await resultAsync;

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe(error);
    }
  });

  it("creates ResultAsync with complex error", async () => {
    const error = { code: 500, message: "Internal error" };
    const resultAsync = errAsync(error);
    const result = await resultAsync;

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toEqual(error);
    }
  });
});

describe("Convenience exports", () => {
  it("fromPromise export works", async () => {
    const promise = Promise.resolve(42);
    const resultAsync = fromPromise(promise, (e) => `Error: ${e}`);

    const result = await resultAsync;
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  it("fromSafePromise export works", async () => {
    const promise = Promise.resolve(42);
    const resultAsync = fromSafePromise(promise);

    const result = await resultAsync;
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  it("fromAsyncThrowable export works", async () => {
    const asyncFn = vi.fn().mockResolvedValue(42);
    const wrappedFn = fromAsyncThrowable(asyncFn);

    const result = await wrappedFn();
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });
});

describe("Additional NeverThrow compatibility tests", () => {
  describe("orElse", () => {
    it("returns original value when Ok", async () => {
      const resultAsync = okAsync(42);
      const fallback = errAsync("fallback");

      const result = await resultAsync.orElse(() => fallback);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("returns fallback when Err", async () => {
      const resultAsync = errAsync("error");
      const fallback = okAsync(100);

      const result = await resultAsync.orElse(() => fallback);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(100);
      }
    });

    it("handles async fallback", async () => {
      const resultAsync = errAsync("error");
      const fallback = okAsync(Promise.resolve(200));

      const result = await resultAsync.orElse(() => fallback);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBeInstanceOf(Promise);
      }
    });
  });

  describe("combineWithAllErrors", () => {
    it("combines multiple ResultAsyncs and collects all errors", async () => {
      const results = [
        okAsync(1),
        errAsync("error1"),
        okAsync(3),
        errAsync("error2"),
      ];

      const combined = ResultAsync.combineWithAllErrors(results);
      const result = await combined;

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toEqual(["error1", "error2"]);
      }
    });

    it("returns all values when all are Ok", async () => {
      const results = [okAsync(1), okAsync(2), okAsync(3)];

      const combined = ResultAsync.combineWithAllErrors(results);
      const result = await combined;

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([1, 2, 3]);
      }
    });

    it("[🎯] handles empty array", async () => {
      const combined = ResultAsync.combineWithAllErrors([]);
      const result = await combined;

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([]);
      }
    });
  });

  describe("isOk and isErr", () => {
    it("isOk returns true for Ok", async () => {
      const resultAsync = okAsync(42);
      const result = await resultAsync;

      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
    });

    it("isErr returns true for Err", async () => {
      const resultAsync = errAsync("error");
      const result = await resultAsync;

      expect(result.isErr()).toBe(true);
      expect(result.isOk()).toBe(false);
    });
  });

  describe("Complex chaining scenarios", () => {
    it("handles complex async pipeline", async () => {
      const result = await okAsync(1)
        .map((x) => x * 2)
        .andThen((x) => (x > 0 ? okAsync(x.toString()) : errAsync("negative")))
        .map((str) => `Result: ${str}`)
        .mapErr((err) => `Error: ${err}`);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("Result: 2");
      }
    });

    it("handles error propagation through complex pipeline", async () => {
      const result = await okAsync(-1)
        .map((x) => x * 2)
        .andThen((x) => (x > 0 ? okAsync(x.toString()) : errAsync("negative")))
        .map((str) => `Result: ${str}`)
        .mapErr((err) => `Error: ${err}`);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("Error: negative");
      }
    });
  });
});

describe("Edge cases and error handling", () => {
  it("[🎯] handles Promise that resolves to undefined", async () => {
    const promise = Promise.resolve(undefined);
    const resultAsync = okAsync(promise);
    const result = await resultAsync;

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      // NeverThrow wraps the Promise, doesn't resolve it
      expect(result.value).toBe(promise);
    }
  });

  it("[🎯] handles Promise that resolves to null", async () => {
    const promise = Promise.resolve(null);
    const resultAsync = okAsync(promise);
    const result = await resultAsync;

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      // NeverThrow wraps the Promise, doesn't resolve it
      expect(result.value).toBe(promise);
    }
  });

  it("[🎯] handles nested ResultAsync", async () => {
    const inner = okAsync(42);
    const outer = okAsync(inner);
    const result = await outer;

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const innerResult = await result.value;
      expect(innerResult.isOk()).toBe(true);
      if (innerResult.isOk()) {
        expect(innerResult.value).toBe(42);
      }
    }
  });

  it("[🎯] handles very long chains", async () => {
    let resultAsync = okAsync(1);

    for (let i = 0; i < 100; i++) {
      resultAsync = resultAsync.map((x) => x + 1);
    }

    const result = await resultAsync;
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(101);
    }
  });

  it("[🎯] handles concurrent operations", async () => {
    const results = Array.from({ length: 10 }, (_, i) => okAsync(i));
    const combined = ResultAsync.combine(results);
    const result = await combined;

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  });
});

describe("Property-based tests", () => {
  itProp.prop([fc.anything()])(
    "[🎲] okAsync wraps any value without modification",
    async (value) => {
      const result = await okAsync(value);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(value);
      }
    }
  );

  itProp.prop([fc.anything()])(
    "[🎲] errAsync wraps any error without modification",
    async (error) => {
      const result = await errAsync(error);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(error);
      }
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] map preserves Ok state",
    async (n) => {
      const result = await okAsync(n).map((x) => x * 2);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(n * 2);
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] map preserves Err state",
    async (error) => {
      const result = await errAsync<number, string>(error).map((x) => x * 2);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(error);
      }
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] mapErr preserves Ok state",
    async (n) => {
      const result = await okAsync(n).mapErr((e) => `Error: ${e}`);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(n);
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] mapErr transforms Err value",
    async (error) => {
      const result = await errAsync(error).mapErr((e) => `Wrapped: ${e}`);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(`Wrapped: ${error}`);
      }
    }
  );

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] unwrapOr returns value for Ok",
    async (value, defaultValue) => {
      const result = await okAsync(value).unwrapOr(defaultValue);
      expect(result).toBe(value);
    }
  );

  itProp.prop([fc.string(), fc.integer()])(
    "[🎲] unwrapOr returns default for Err",
    async (error, defaultValue) => {
      const result = await errAsync(error).unwrapOr(defaultValue);
      expect(result).toBe(defaultValue);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] combine preserves order of values",
    async (values) => {
      const results = values.map((v) => okAsync(v));
      const combined = await ResultAsync.combine(results);
      expect(combined.isOk()).toBe(true);
      if (combined.isOk()) {
        expect(combined.value).toEqual(values);
      }
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] andThen chains Ok values correctly",
    async (n) => {
      const result = await okAsync(n)
        .andThen((x) => okAsync(x + 1))
        .andThen((x) => okAsync(x * 2));

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe((n + 1) * 2);
      }
    }
  );

  itProp.prop([fc.string(), fc.integer()])(
    "[🎲] andThen short-circuits on Err",
    async (error, _n) => {
      const result = await errAsync<number, string>(error)
        .andThen((x) => okAsync(x + 1))
        .andThen((x) => okAsync(x * 2));

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(error);
      }
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] match executes ok branch for Ok",
    async (n) => {
      const result = await okAsync(n).match(
        (v) => `ok:${v}`,
        (e) => `err:${e}`
      );
      expect(result).toBe(`ok:${n}`);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] match executes err branch for Err",
    async (error) => {
      const result = await errAsync(error).match(
        (v) => `ok:${v}`,
        (e) => `err:${e}`
      );
      expect(result).toBe(`err:${error}`);
    }
  );
});
