import { describe, test, expect } from "vitest";
import { safe } from "./safe";

describe("safe", () => {
  describe("Basic functionality", () => {
    test("returns Result with ok when function succeeds", () => {
      const add = (a: number, b: number) => a + b;
      const safeAdd = safe(add);

      const result = safeAdd(2, 3);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(5);
      }
    });

    test("returns Result with err when function throws", () => {
      const throwError = () => {
        throw new Error("Test error");
      };
      const safeThrowError = safe(throwError);

      const result = safeThrowError();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe("Test error");
      }
    });

    test("preserves function parameters", () => {
      const multiply = (a: number, b: number, c: number) => a * b * c;
      const safeMultiply = safe(multiply);

      const result = safeMultiply(2, 3, 4);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(24);
      }
    });

    test("handles function with no parameters", () => {
      const getValue = () => 42;
      const safeGetValue = safe(getValue);

      const result = safeGetValue();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });
  });

  describe("Error handling", () => {
    test("handles TypeError", () => {
      const throwTypeError = () => {
        throw new TypeError("Type error");
      };
      const safeThrowTypeError = safe(throwTypeError);

      const result = safeThrowTypeError();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(TypeError);
        expect(result.error.message).toBe("Type error");
      }
    });

    test("handles ReferenceError", () => {
      const throwReferenceError = () => {
        throw new ReferenceError("Reference error");
      };
      const safeThrowReferenceError = safe(throwReferenceError);

      const result = safeThrowReferenceError();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(ReferenceError);
        expect(result.error.message).toBe("Reference error");
      }
    });

    test("handles SyntaxError", () => {
      const throwSyntaxError = () => {
        throw new SyntaxError("Syntax error");
      };
      const safeThrowSyntaxError = safe(throwSyntaxError);

      const result = safeThrowSyntaxError();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(SyntaxError);
        expect(result.error.message).toBe("Syntax error");
      }
    });

    test("handles custom error", () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = "CustomError";
        }
      }

      const throwCustomError = () => {
        throw new CustomError("Custom error");
      };
      const safeThrowCustomError = safe(throwCustomError);

      const result = safeThrowCustomError();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(CustomError);
        expect(result.error.message).toBe("Custom error");
      }
    });

    test("converts string thrown as error to Error", () => {
      const throwString = () => {
        throw "String error";
      };
      const safeThrowString = safe(throwString);

      const result = safeThrowString();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("String error");
      }
    });

    test("converts number thrown as error to Error", () => {
      const throwNumber = () => {
        throw 42;
      };
      const safeThrowNumber = safe(throwNumber);

      const result = safeThrowNumber();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("42");
      }
    });

    test("converts object thrown as error to Error", () => {
      const throwObject = () => {
        throw { error: "Object error" };
      };
      const safeThrowObject = safe(throwObject);

      const result = safeThrowObject();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("[object Object]");
      }
    });

    test("converts null thrown as error to Error", () => {
      const throwNull = () => {
        throw null;
      };
      const safeThrowNull = safe(throwNull);

      const result = safeThrowNull();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("null");
      }
    });

    test("converts undefined thrown as error to Error", () => {
      const throwUndefined = () => {
        throw undefined;
      };
      const safeThrowUndefined = safe(throwUndefined);

      const result = safeThrowUndefined();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("undefined");
      }
    });
  });

  describe("Real-world use cases", () => {
    test("wraps JSON.parse function", () => {
      const safeJsonParse = safe(JSON.parse);

      const validResult = safeJsonParse('{"name": "John"}');
      expect(validResult.isOk()).toBe(true);
      if (validResult.isOk()) {
        expect(validResult.value).toEqual({ name: "John" });
      }

      const invalidResult = safeJsonParse("invalid json");
      expect(invalidResult.isErr()).toBe(true);
      if (invalidResult.isErr()) {
        expect(invalidResult.error).toBeInstanceOf(Error);
      }
    });
  });

  describe("Edge cases", () => {
    test("handles function that returns null", () => {
      const returnNull = () => null;
      const safeReturnNull = safe(returnNull);

      const result = safeReturnNull();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(null);
      }
    });

    test("handles function that returns undefined", () => {
      const returnUndefined = () => undefined;
      const safeReturnUndefined = safe(returnUndefined);

      const result = safeReturnUndefined();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(undefined);
      }
    });

    test("handles function that returns NaN", () => {
      const returnNaN = () => NaN;
      const safeReturnNaN = safe(returnNaN);

      const result = safeReturnNaN();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBeNaN();
      }
    });

    test("handles function that returns Infinity", () => {
      const returnInfinity = () => Infinity;
      const safeReturnInfinity = safe(returnInfinity);

      const result = safeReturnInfinity();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(Infinity);
      }
    });

    test("handles function that returns empty array", () => {
      const returnEmptyArray = () => [];
      const safeReturnEmptyArray = safe(returnEmptyArray);

      const result = safeReturnEmptyArray();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([]);
      }
    });

    test("handles function that returns empty object", () => {
      const returnEmptyObject = () => ({});
      const safeReturnEmptyObject = safe(returnEmptyObject);

      const result = safeReturnEmptyObject();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({});
      }
    });
  });
});


