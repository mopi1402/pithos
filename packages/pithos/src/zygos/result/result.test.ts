import {
  Result,
  err,
  ok,
  safeTry,
  okAsync,
  errAsync,
  ResultAsync,
  fromOption,
  fromEither,
  toEither,
} from "@zygos/result/result"; // "neverthrow" or "@zygos/result/result"
import { safeAsyncTry } from "@zygos/result/result"; // no equivalent in neverthrow
import { test, expect, describe } from "vitest";
import { cast } from "@arkhe/test/private-access";

describe("Result constructors", () => {
  test("ok creates success result", () => {
    const result = ok(42);
    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);
    expect(result.value).toBe(42);
  });

  test("err creates error result", () => {
    const result = err("failure");
    expect(result.isErr()).toBe(true);
    expect(result.isOk()).toBe(false);
    expect(result.error).toBe("failure");
  });

  test("explicit generic types", () => {
    const result: Result<number, string> = ok(42);
    const error: Result<number, string> = err("error");

    expect(result.isOk()).toBe(true);
    expect(error.isErr()).toBe(true);
    expect(result.value).toBe(42);
    expect(error.error).toBe("error");
  });

  test("complex types", () => {
    type User = { name: string; age: number };
    type UserError = { code: string; message: string };

    const userResult: Result<User, UserError> = ok({ name: "John", age: 30 });
    const errorResult: Result<User, UserError> = err({
      code: "404",
      message: "Not found",
    });

    expect(userResult.isOk()).toBe(true);
    expect(errorResult.isErr()).toBe(true);

    if (userResult.isOk()) {
      expect(userResult.value.name).toBe("John");
      expect(userResult.value.age).toBe(30);
    }

    if (errorResult.isErr()) {
      expect(errorResult.error.code).toBe("404");
      expect(errorResult.error.message).toBe("Not found");
    }
  });

  test("union types", () => {
    type NumberOrString = number | string;
    type ErrorType = string | Error;

    const numberResult: Result<NumberOrString, ErrorType> = ok(42);
    const stringResult: Result<NumberOrString, ErrorType> = ok("hello");
    const stringError: Result<NumberOrString, ErrorType> = err("error");
    const errorError: Result<NumberOrString, ErrorType> = err(
      new Error("error")
    );

    expect(numberResult.isOk() && numberResult.value).toBe(42);
    expect(stringResult.isOk() && stringResult.value).toBe("hello");
    expect(stringError.isErr() && stringError.error).toBe("error");
    expect(errorError.isErr() && errorError.error instanceof Error).toBe(true);
  });

  test("null and undefined types", () => {
    const nullResult: Result<null, string> = ok(null);
    const undefinedResult: Result<undefined, string> = ok(undefined);
    const nullError: Result<number, null> = err(null);

    expect(nullResult.isOk() && nullResult.value).toBe(null);
    expect(undefinedResult.isOk() && undefinedResult.value).toBe(undefined);
    expect(nullError.isErr() && nullError.error).toBe(null);
  });
});

describe("Result type guards", () => {
  test("isOk identifies Ok results", () => {
    expect(ok(42).isOk()).toBe(true);
    expect(err("fail").isOk()).toBe(false);
  });

  test("isErr identifies Err results", () => {
    expect(err("fail").isErr()).toBe(true);
    expect(ok(42).isErr()).toBe(false);
  });
});

describe("map function", () => {
  test("transforms Ok values", () => {
    const result = ok(5).map((x) => x * 2);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(10);
    }
  });

  test("preserves Err values", () => {
    const result = err("fail").map(() => 42);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("fail");
    }
  });

  test("handles string transformations", () => {
    const result = ok("hello").map((str) => str.toUpperCase());
    if (result.isOk()) {
      expect(result.value).toBe("HELLO");
    }
  });

  test("handles object transformations", () => {
    const user = { name: "John", age: 30 };
    const result = ok(user).map((u) => ({ ...u, age: u.age + 1 }));
    if (result.isOk()) {
      expect(result.value.age).toBe(31);
    }
  });
});

describe("mapErr function", () => {
  test("transforms Err values", () => {
    const result = err("fail").mapErr((error) => `Error: ${error}`);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("Error: fail");
    }
  });

  test("preserves Ok values", () => {
    const result = ok(42).mapErr(() => "Error");
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  test("handles error type transformations", () => {
    const result = err("network error").mapErr((error) => new Error(error));
    expect(result.isErr() && result.error instanceof Error).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe("network error");
    }
  });
});

describe("andThen function", () => {
  test("chains Ok results", () => {
    const result = ok(5).andThen((x) => (x > 0 ? ok(x * 2) : err("negative")));
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(10);
    }
  });

  test("chains to Err when condition fails", () => {
    const result = ok(-5).andThen((x) => (x > 0 ? ok(x * 2) : err("negative")));
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("negative");
    }
  });

  test("preserves original Err", () => {
    const result = err("original").andThen(() => ok(42));
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("original");
    }
  });

  test("chains multiple operations", () => {
    const result = ok(5)
      .andThen((x) => ok(x * 2))
      .andThen((x) => (x > 5 ? ok(x.toString()) : err("too small")));
    expect(result.isOk() && result.value).toBe("10");
  });

  test("stops chain on first error", () => {
    const result = ok(5)
      .andThen(() => err("first error"))
      .andThen(() => ok(42));
    expect(result.isErr() && result.error).toBe("first error");
  });
});

describe("safeTry function", () => {
  test("catches successful operations", () => {
    const result = safeTry(() => {
      return ok(JSON.parse('{"test": true}'));
    });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ test: true });
    }
  });

  test("catches thrown errors", () => {
    const result = safeTry(() => {
      try {
        const parsed = JSON.parse("invalid json");
        return ok(parsed);
      } catch (error) {
        return err(error);
      }
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  test("handles mathematical operations", () => {
    const result = safeTry(() => {
      const x = 10;
      const y = 0;
      if (y === 0) {
        return err(new Error("Division by zero"));
      }
      return ok(x / y);
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      const error = result.error as Error;
      expect(error.message).toBe("Division by zero");
    }
  });

  test("handles custom errors", () => {
    const result = safeTry(() => {
      return err(new Error("Custom error message"));
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      const error = result.error as Error;
      expect(error.message).toBe("Custom error message");
    }
  });

  test("handles generator that returns immediately (done = true)", () => {
    const result = safeTry(() => {
      return ok(42);
    });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  test("handles generator that returns error immediately (done = true)", () => {
    const result = safeTry(() => {
      return err("immediate error");
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("immediate error");
    }
  });

  test("handles direct Result return (not a generator)", () => {
    const result = safeTry(() => ok(42));
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  test("handles direct Err Result return (not a generator)", () => {
    const result = safeTry(() => err("direct error"));
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("direct error");
    }
  });

  test("handles generator with yield (done = false)", () => {
    const result = safeTry(function* () {
      yield err("test");
      return ok(42);
    });

    // When done is false, it should return the yielded value
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("test");
    }
  });

  test("handles generator yielding Err (done = false)", () => {
    const result = safeTry(function* () {
      yield err("validation failed");
      return ok(42);
    });

    // When done is false, it should return the yielded Err value
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("validation failed");
    }
  });

  test("detects generator by checking next method", () => {
    // Test that the generator detection logic works correctly
    // by creating a generator function
    const generatorFn = function* () {
      yield err("error");
      return ok(10);
    };

    const result = safeTry(generatorFn);

    // Should detect it as a generator and return the first yielded value
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("error");
    }
  });

  test("handles generator with multiple yields but returns first yield value", () => {
    const result = safeTry(function* () {
      yield err("first");
      yield err("second");
      return ok("final");
    });

    // Should return the first yielded value, not continue iteration
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("first");
    }
  });

  test("handles object with next method that is not a generator", () => {
    // An object that has a next method but is not a generator
    // should be treated as a generator-like object
    const fakeGenerator = {
      next: () => ({ done: true, value: ok(42) }),
    };

    // INTENTIONAL: Testing generator detection logic with object that has next method
    const bodyFn = () => cast(fakeGenerator);
    const result = safeTry(cast(bodyFn));

    // Should treat it as a generator and call next()
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  test("handles generator detection condition with null result", () => {
    // Test that null/undefined results are handled correctly
    // INTENTIONAL: Testing edge case where body returns null
    const result = safeTry(
      cast<() => Result<unknown, unknown>>(() => cast(null))
    );

    // Should fall through to "direct Result" case
    expect(result).toBe(null);
  });

  test("handles generator detection condition with primitive result", () => {
    // Test that primitive results are handled correctly
    // INTENTIONAL: Testing edge case where body returns primitive
    const result = safeTry(cast<() => Result<number, unknown>>(() => cast(42)));

    // Should fall through to "direct Result" case
    expect(result).toBe(42);
  });

  test("handles generator detection condition when next is not a function", () => {
    // Object with "next" property but not a function
    const objWithNext = {
      next: "not a function",
    };

    // INTENTIONAL: Testing edge case where object has "next" but it's not a function
    const result = safeTry(
      cast<() => Result<typeof objWithNext, unknown>>(() => cast(objWithNext))
    );

    // Should fall through to "direct Result" case because typeof next !== "function"
    expect(result).toBe(objWithNext);
  });
});

describe("unwrap functions", () => {
  test("unwrapOr returns Ok values", () => {
    const value = ok(42).unwrapOr(0);
    expect(value).toBe(42);
  });

  test("unwrapOr returns default for Err values", () => {
    const value = err("fail").unwrapOr(0);
    expect(value).toBe(0);
  });
});

describe("match function", () => {
  test("handles Ok values with match", () => {
    const result = ok(42);
    const value = result.match(
      (okValue) => `Success: ${okValue}`,
      (error) => `Error: ${error}`
    );
    expect(value).toBe("Success: 42");
  });

  test("handles Err values with match", () => {
    const result = err("network error");
    const value = result.match(
      (okValue) => `Success: ${okValue}`,
      (error) => `Error: ${error}`
    );
    expect(value).toBe("Error: network error");
  });

  test("match with different return types", () => {
    const okResult = ok(10);
    const errResult = err("validation failed");

    const okValue = okResult.match(
      (value) => value * 2,
      () => 0
    );
    expect(okValue).toBe(20);

    const errValue = errResult.match(
      (value) => value * 2,
      () => 0
    );
    expect(errValue).toBe(0);
  });

  test("match with async-like operations", () => {
    const okResult = ok("data");
    const errResult = err("timeout");

    const okValue = okResult.match(
      (data) => `Processed: ${data}`,
      (error) => `Failed: ${error}`
    );
    expect(okValue).toBe("Processed: data");

    const errValue = errResult.match(
      (data) => `Processed: ${data}`,
      (error) => `Failed: ${error}`
    );
    expect(errValue).toBe("Failed: timeout");
  });
});

describe("Result chaining scenarios", () => {
  test("complex validation chain", () => {
    const validateAge = (age: number) =>
      age >= 0 && age <= 150 ? ok(age) : err("Invalid age");
    const validateName = (name: string) =>
      name.length > 0 ? ok(name) : err("Name required");

    const createUser = (name: string, age: number) => {
      const nameResult = validateName(name);
      if (nameResult.isErr()) return nameResult;

      const ageResult = validateAge(age);
      if (ageResult.isErr()) return ageResult;

      return ok({ name: nameResult.value, age: ageResult.value });
    };

    const validUser = createUser("John", 30);
    expect(validUser.isOk() && validUser.value).toEqual({
      name: "John",
      age: 30,
    });

    const invalidAge = createUser("John", -5);
    expect(invalidAge.isErr() && invalidAge.error).toBe("Invalid age");

    const invalidName = createUser("", 30);
    expect(invalidName.isErr() && invalidName.error).toBe("Name required");
  });

  test("async operation chain", async () => {
    interface User {
      id: string;
      name: string;
    }

    interface UserProfile extends User {
      email: string;
    }

    const fetchUser = async (id: string) =>
      id === "valid" ? ok({ id, name: "John" } as User) : err("User not found");
    const fetchProfile = async (user: User) =>
      ok({ ...user, email: "john@test.com" } as UserProfile);

    const userResult = await fetchUser("valid");
    expect(userResult.isOk()).toBe(true);

    if (userResult.isOk()) {
      const profileResult = await fetchProfile(userResult.value);
      expect(profileResult.isOk()).toBe(true);

      if (profileResult.isOk()) {
        expect(profileResult.value).toEqual({
          id: "valid",
          name: "John",
          email: "john@test.com",
        });
      }
    }

    const invalidUserResult = await fetchUser("invalid");
    expect(invalidUserResult.isErr()).toBe(true);
    if (invalidUserResult.isErr()) {
      expect(invalidUserResult.error).toBe("User not found");
    }
  });
});

describe("Complex error scenarios - Stress testing the pattern", () => {
  test("deep nested error chain with transformations", () => {
    // Simulates complex cascade validation
    const validateInput = (input: unknown) =>
      typeof input === "string"
        ? ok(input)
        : err({ type: "TYPE_ERROR", field: "input", expected: "string" });

    const validateLength = (str: string) =>
      str.length >= 3
        ? ok(str)
        : err({
            type: "LENGTH_ERROR",
            field: "input",
            min: 3,
            actual: str.length,
          });

    const validateFormat = (str: string) =>
      /^[a-zA-Z]+$/.test(str)
        ? ok(str)
        : err({
            type: "FORMAT_ERROR",
            field: "input",
            pattern: "letters only",
          });

    const validateBusinessRule = (str: string) =>
      str !== "admin"
        ? ok(str)
        : err({
            type: "BUSINESS_ERROR",
            field: "input",
            reason: "reserved word",
          });

    const result = ok("a") // Input invalide
      .andThen(validateInput)
      .andThen(validateLength)
      .andThen(validateFormat)
      .andThen(validateBusinessRule)
      .mapErr((error) => `Validation failed: ${JSON.stringify(error)}`);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toContain("LENGTH_ERROR");
      expect(result.error).toContain('"min":3');
    }
  });

  test("complex error recovery and fallback scenarios", () => {
    // Simulates a system with multiple fallbacks
    const primaryService = (id: string) =>
      id === "primary"
        ? ok("primary data")
        : err({ service: "primary", error: "unavailable" });

    const secondaryService = (id: string) =>
      id === "secondary"
        ? ok("secondary data")
        : err({ service: "secondary", error: "unavailable" });

    const fallbackService = () => ok("fallback data");

    const getData = (id: string) => {
      const primary = primaryService(id);
      if (primary.isOk()) return primary;

      const secondary = secondaryService(id);
      if (secondary.isOk()) return secondary;

      return fallbackService();
    };

    // Test fallback en cascade
    const result1 = getData("invalid");
    expect(result1.isOk()).toBe(true);
    if (result1.isOk()) {
      expect(result1.value).toBe("fallback data");
    }

    // Test avec service secondaire
    const result2 = getData("secondary");
    expect(result2.isOk()).toBe(true);
    if (result2.isOk()) {
      expect(result2.value).toBe("secondary data");
    }
  });

  test("error aggregation and batch processing", () => {
    // Simulates batch processing with multiple error handling
    const processItem = (item: number) =>
      item > 0 ? ok(item * 2) : err({ item, reason: "negative number" });

    const items = [1, -2, 3, -4, 5];
    const results = items.map(processItem);

    // Collect successes and failures
    const successes = results
      .filter((r) => r.isOk())
      .map((r) => (r.isOk() ? r.value : 0));
    const errors = results
      .filter((r) => r.isErr())
      .map((r) => (r.isErr() ? r.error : null));

    expect(successes).toEqual([2, 6, 10]);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toEqual({ item: -2, reason: "negative number" });
    expect(errors[1]).toEqual({ item: -4, reason: "negative number" });
  });

  test("async error handling with complex state management", async () => {
    // Simulates a complex operation with state management
    interface OperationState {
      step: string;
      data: unknown;
      attempts: number;
    }

    const initialState: OperationState = {
      step: "init",
      data: null,
      attempts: 0,
    };

    const step1 = async (state: OperationState) =>
      state.attempts < 3
        ? ok({ ...state, step: "step1", data: "data1" })
        : err("max attempts exceeded");

    const step2 = async (state: OperationState) =>
      state.step === "step1"
        ? ok({ ...state, step: "step2", data: "data2" })
        : err("invalid step order");

    const step3 = async (state: OperationState) =>
      Math.random() > 0.5
        ? ok({ ...state, step: "complete", data: "final" })
        : err("random failure");

    const executeOperation = async (state: OperationState) => {
      const result1 = await step1(state);
      if (result1.isErr()) return result1;

      const result2 = await step2(result1.value);
      if (result2.isErr()) return result2;

      const result3 = await step3(result2.value);
      return result3;
    };

    // Test with multiple attempts
    const result = await executeOperation(initialState);

    // Result can be Ok or Err depending on random, but structure is correct
    if (result.isOk()) {
      expect(result.value.step).toBe("complete");
      expect(result.value.data).toBe("final");
    } else {
      expect(result.error).toBe("random failure");
    }
  });

  test("error type transformations and complex error hierarchies", () => {
    // Simulates complex error hierarchy
    type BaseError = { code: string; message: string };
    type ValidationError = BaseError & { field: string; value: unknown };
    type BusinessError = BaseError & {
      operation: string;
      context: Record<string, unknown>;
    };

    const createValidationError = (
      field: string,
      value: unknown
    ): ValidationError => ({
      code: "VALIDATION_ERROR",
      message: `Invalid value for ${field}`,
      field,
      value,
    });

    const createBusinessError = (
      operation: string,
      context: Record<string, unknown>
    ): BusinessError => ({
      code: "BUSINESS_ERROR",
      message: `Operation ${operation} failed`,
      operation,
      context,
    });

    // Test complex error transformations
    const result = err(createValidationError("email", "invalid")).mapErr(
      (error) => {
        if (error.code === "VALIDATION_ERROR") {
          return createBusinessError("user_creation", {
            field: error.field,
            originalError: error.message,
          });
        }
        return error;
      }
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      // Type guard to ensure it's a BusinessError
      const businessError = result.error as BusinessError;
      expect(businessError.code).toBe("BUSINESS_ERROR");
      expect(businessError.operation).toBe("user_creation");
      expect(businessError.context.field).toBe("email");
    }
  });
});

describe("ResultAsync constructors", () => {
  test("okAsync creates success async result", async () => {
    const result = okAsync(Promise.resolve(42));
    const resolved = await result;

    expect(resolved.isOk()).toBe(true);
    if (resolved.isOk()) {
      const value = await resolved.value;
      expect(value).toBe(42);
    }
  });

  test("errAsync creates error async result", async () => {
    const result = errAsync("network error");
    const resolved = await result;

    expect(resolved.isErr()).toBe(true);
    expect(resolved.isOk()).toBe(false);
    if (resolved.isErr()) {
      expect(resolved.error).toBe("network error");
    }
  });

  test("okAsync with complex objects", async () => {
    const user = { name: "John", age: 30 };
    const result = okAsync(Promise.resolve(user));
    const resolved = await result;

    expect(resolved.isOk()).toBe(true);
    if (resolved.isOk()) {
      const value = await resolved.value;
      expect(value).toEqual(user);
    }
  });

  test("errAsync with Error objects", async () => {
    const error = new Error("test error");
    const result = errAsync(error);
    const resolved = await result;

    expect(resolved.isErr()).toBe(true);
    if (resolved.isErr()) {
      expect(resolved.error).toBe(error);
    }
  });
});

describe("ResultAsync.fromPromise", () => {
  test("fromPromise with successful promise", async () => {
    const promise = Promise.resolve(42);
    const result = ResultAsync.fromPromise(promise, (error) => error);
    const resolved = await result;

    expect(resolved.isOk()).toBe(true);
    if (resolved.isOk()) {
      expect(resolved.value).toBe(42);
    }
  });

  test("fromPromise with rejected promise", async () => {
    const promise = Promise.reject("network error");
    const result = ResultAsync.fromPromise(promise, (error) => error);
    const resolved = await result;

    expect(resolved.isErr()).toBe(true);
    if (resolved.isErr()) {
      expect(resolved.error).toBe("network error");
    }
  });

  test("fromPromise with complex objects", async () => {
    const user = { name: "John", age: 30 };
    const promise = Promise.resolve(user);
    const result = ResultAsync.fromPromise(promise, (error) => error);
    const resolved = await result;

    expect(resolved.isOk()).toBe(true);
    if (resolved.isOk()) {
      expect(resolved.value).toEqual(user);
    }
  });

  test("fromPromise with Error rejection", async () => {
    const error = new Error("test error");
    const promise = Promise.reject(error);
    const result = ResultAsync.fromPromise(promise, (error) => error);
    const resolved = await result;

    expect(resolved.isErr()).toBe(true);
    if (resolved.isErr()) {
      expect(resolved.error).toBe(error);
    }
  });
});

describe("Result utilities", () => {
  describe("fromThrowable", () => {
    test("wraps successful functions", () => {
      const safeParse = Result.fromThrowable(
        (...args: unknown[]) => JSON.parse(args[0] as string),
        (error) => `Parse error: ${error}`
      );
      const result = safeParse('{"test": true}');

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({ test: true });
      }
    });

    test("wraps throwing functions with custom error handler", () => {
      const safeParse = Result.fromThrowable(
        (...args: unknown[]) => JSON.parse(args[0] as string),
        (error) => `Parse error: ${error}`
      );
      const result = safeParse("invalid json");

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("Parse error:");
      }
    });

    test("wraps mathematical operations", () => {
      const safeDivide = Result.fromThrowable(
        (...args: unknown[]) => {
          const a = args[0] as number;
          const b = args[1] as number;
          if (b === 0) throw new Error("Division by zero");
          return a / b;
        },
        (error: unknown) =>
          `Math error: ${
            error instanceof Error ? error.message : String(error)
          }`
      );

      const success = safeDivide(10, 2);
      expect(success.isOk() && success.value).toBe(5);

      const failure = safeDivide(10, 0);
      expect(failure.isErr() && failure.error).toBe(
        "Math error: Division by zero"
      );
    });

    test("[🎯] wraps throwing functions without custom error handler", () => {
      const safeParse = Result.fromThrowable<
        (...args: unknown[]) => unknown,
        Error
      >((...args: unknown[]) => JSON.parse(args[0] as string));
      const result = safeParse("invalid json");

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(SyntaxError);
      }
    });
  });

  describe("fromThrowable (async)", () => {
    test("wraps async functions with ResultAsync.fromThrowable", async () => {
      const asyncOperation = async (input: number) => {
        if (input < 0) throw new Error("Negative input");
        return input * 2;
      };

      const safeOperation = ResultAsync.fromThrowable(
        asyncOperation,
        (error) => `Error: ${error}`
      );

      const success = await safeOperation(5);
      expect(success.isOk() && success.value).toBe(10);

      const failure = await safeOperation(-1);
      expect(failure.isErr() && failure.error).toBe(
        "Error: Error: Negative input"
      );
    });
  });

  describe("combine", () => {
    test("combines successful Results", () => {
      const results = [ok(1), ok(2), ok(3)];
      const combined = Result.combine(results);

      expect(combined.isOk()).toBe(true);
      if (combined.isOk()) {
        expect(combined.value).toEqual([1, 2, 3]);
      }
    });

    test("combines Results with different types", () => {
      const results = [ok("hello"), ok(42), ok(true)];
      const combined = Result.combine(results);

      expect(combined.isOk()).toBe(true);
      if (combined.isOk()) {
        expect(combined.value).toEqual(["hello", 42, true]);
      }
    });

    test("returns first error when any Result fails", () => {
      const results = [ok(1), err("second error"), ok(3), err("fourth error")];
      const combined = Result.combine(results);

      expect(combined.isErr()).toBe(true);
      if (combined.isErr()) {
        expect(combined.error).toBe("second error");
      }
    });

    test("combines empty array", () => {
      const results: Result<number, string>[] = [];
      const combined = Result.combine(results);

      expect(combined.isOk()).toBe(true);
      if (combined.isOk()) {
        expect(combined.value).toEqual([]);
      }
    });

    test("combines Results with complex objects", () => {
      const user1 = { id: 1, name: "John" };
      const user2 = { id: 2, name: "Jane" };
      const results = [ok(user1), ok(user2)];
      const combined = Result.combine(results);

      expect(combined.isOk()).toBe(true);
      if (combined.isOk()) {
        expect(combined.value).toEqual([user1, user2]);
      }
    });
  });
});

describe("safeAsyncTry", () => {
  test("retourne Ok avec la valeur si la Promise réussit", async () => {
    const fn = async () => 42;
    const result = await safeAsyncTry(fn);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  test("retourne Err avec l'erreur si la Promise échoue", async () => {
    const fn = async () => {
      throw new Error("test error");
    };
    const result = await safeAsyncTry(fn);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      if (result.error instanceof Error) {
        expect(result.error.message).toBe("test error");
      }
    }
  });
});

describe("Result conversions", () => {
  describe("fromOption", () => {
    test("converts Some to Ok", () => {
      const someOption = { _tag: "Some" as const, value: 42 };
      const result = fromOption(() => "No value")(someOption);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    test("[🎯] converts None to Err", () => {
      const noneOption = { _tag: "None" as const };
      const result = fromOption(() => "No value")(noneOption);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("No value");
      }
    });
  });

  describe("fromEither", () => {
    test("converts Right to Ok", () => {
      const rightEither = { _tag: "Right" as const, right: 42 };
      const result = fromEither(rightEither);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    test("[🎯] converts Left to Err", () => {
      const leftEither = { _tag: "Left" as const, left: "error message" };
      const result = fromEither(leftEither);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("error message");
      }
    });
  });

  describe("toEither", () => {
    test("converts Ok to Right", () => {
      const result = ok(42);
      const either = toEither(result);

      expect(either._tag).toBe("Right");
      expect(either.right).toBe(42);
    });

    test("[🎯] converts Err to Left", () => {
      const result = err("error message");
      const either = toEither(result);

      expect(either._tag).toBe("Left");
      expect(either.left).toBe("error message");
    });
  });
});
