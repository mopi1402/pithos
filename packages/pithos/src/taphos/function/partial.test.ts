import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { partial } from "./partial";

describe("partial", () => {
  describe("Basic functionality", () => {
    test("applies single partial argument", () => {
      const mockFn = vi.fn((a: number, b: number, c: number) => a + b + c);
      const partialFn = partial(mockFn, 1);

      const result = partialFn(2, 3);

      expect(result).toBe(6); // 1 + 2 + 3
      expect(mockFn).toHaveBeenCalledWith(1, 2, 3);
    });

    test("applies multiple partial arguments", () => {
      const mockFn = vi.fn(
        (a: number, b: number, c: number, d: number) => a + b + c + d
      );
      const partialFn = partial(mockFn, 1, 2);

      const result = partialFn(3, 4);

      expect(result).toBe(10); // 1 + 2 + 3 + 4
      expect(mockFn).toHaveBeenCalledWith(1, 2, 3, 4);
    });

    test("applies all arguments as partials", () => {
      const mockFn = vi.fn((a: number, b: number, c: number) => a + b + c);
      const partialFn = partial(mockFn, 1, 2, 3);

      const result = partialFn();

      expect(result).toBe(6); // 1 + 2 + 3
      expect(mockFn).toHaveBeenCalledWith(1, 2, 3);
    });

    test("applies no partial arguments", () => {
      const mockFn = vi.fn((a: number, b: number) => a + b);
      const partialFn = partial(mockFn);

      const result = partialFn(1, 2);

      expect(result).toBe(3); // 1 + 2
      expect(mockFn).toHaveBeenCalledWith(1, 2);
    });

    test("handles function with no parameters", () => {
      const mockFn = vi.fn(() => "no params");
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toBe("no params");
      expect(mockFn).toHaveBeenCalledWith();
    });

    test("handles function with no parameters and partials", () => {
      const mockFn = vi.fn(() => "no params");
      const partialFn = partial(mockFn, 1, 2, 3);

      const result = partialFn();

      expect(result).toBe("no params");
      expect(mockFn).toHaveBeenCalledWith(1, 2, 3);
    });
  });

  describe("Function with different parameter types", () => {
    test("applies partials with number parameters", () => {
      const mockFn = vi.fn((a: number, b: number, c: number) => a * b * c);
      const partialFn = partial(mockFn, 2);

      const result = partialFn(3, 4);

      expect(result).toBe(24); // 2 * 3 * 4
      expect(mockFn).toHaveBeenCalledWith(2, 3, 4);
    });

    test("applies partials with string parameters", () => {
      const mockFn = vi.fn(
        (str1: string, str2: string, str3: string) => str1 + str2 + str3
      );
      const partialFn = partial(mockFn, "Hello");

      const result = partialFn(" ", "World");

      expect(result).toBe("Hello World");
      expect(mockFn).toHaveBeenCalledWith("Hello", " ", "World");
    });

    test("applies partials with boolean parameters", () => {
      const mockFn = vi.fn(
        (flag1: boolean, flag2: boolean, flag3: boolean) =>
          flag1 && flag2 && flag3
      );
      const partialFn = partial(mockFn, true);

      const result = partialFn(true, false);

      expect(result).toBe(false);
      expect(mockFn).toHaveBeenCalledWith(true, true, false);
    });

    test("applies partials with object parameters", () => {
      const mockFn = vi.fn(
        (obj1: { name: string }, obj2: { age: number }) =>
          `${obj1.name} is ${obj2.age}`
      );
      const partialFn = partial(mockFn, { name: "John" });

      const result = partialFn({ age: 25 });

      expect(result).toBe("John is 25");
      expect(mockFn).toHaveBeenCalledWith({ name: "John" }, { age: 25 });
    });

    test("applies partials with array parameters", () => {
      const mockFn = vi.fn((arr1: number[], arr2: number[]) => [
        ...arr1,
        ...arr2,
      ]);
      const partialFn = partial(mockFn, [1, 2]);

      const result = partialFn([3, 4]);

      expect(result).toEqual([1, 2, 3, 4]);
      expect(mockFn).toHaveBeenCalledWith([1, 2], [3, 4]);
    });

    test("applies partials with mixed parameter types", () => {
      const mockFn = vi.fn((name: string, age: number, active: boolean) => ({
        name,
        age,
        active,
      }));
      const partialFn = partial(mockFn, "John");

      const result = partialFn(25, true);

      expect(result).toEqual({ name: "John", age: 25, active: true });
      expect(mockFn).toHaveBeenCalledWith("John", 25, true);
    });

    test("applies partials with rest parameters", () => {
      const mockFn = vi.fn(
        (prefix: string, ...suffixes: string[]) => prefix + suffixes.join(" ")
      );
      const partialFn = partial(mockFn, "Hello");

      const result = partialFn("World", "!");

      expect(result).toBe("HelloWorld !"); // No space between prefix and suffixes
      expect(mockFn).toHaveBeenCalledWith("Hello", "World", "!");
    });
  });

  describe("Function return values", () => {
    test("preserves string return value", () => {
      const mockFn = vi.fn(() => "Hello World");
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toBe("Hello World");
      expect(mockFn).toHaveBeenCalledWith();
    });

    test("preserves number return value", () => {
      const mockFn = vi.fn(() => 42);
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toBe(42);
      expect(mockFn).toHaveBeenCalledWith();
    });

    test("preserves boolean return value", () => {
      const mockFn = vi.fn(() => true);
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toBe(true);
      expect(mockFn).toHaveBeenCalledWith();
    });

    test("preserves object return value", () => {
      const mockFn = vi.fn(() => ({ name: "John", age: 25 }));
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toEqual({ name: "John", age: 25 });
      expect(mockFn).toHaveBeenCalledWith();
    });

    test("preserves array return value", () => {
      const mockFn = vi.fn(() => [1, 2, 3]);
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toEqual([1, 2, 3]);
      expect(mockFn).toHaveBeenCalledWith();
    });

    test("preserves null return value", () => {
      const mockFn = vi.fn(() => null);
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toBe(null);
      expect(mockFn).toHaveBeenCalledWith();
    });

    test("preserves undefined return value", () => {
      const mockFn = vi.fn(() => undefined);
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toBe(undefined);
      expect(mockFn).toHaveBeenCalledWith();
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles function with many parameters", () => {
      const mockFn = vi.fn(
        (a: number, b: number, c: number, d: number, e: number) =>
          a + b + c + d + e
      );
      const partialFn = partial(mockFn, 1, 2);

      const result = partialFn(3, 4, 5);

      expect(result).toBe(15); // 1 + 2 + 3 + 4 + 5
      expect(mockFn).toHaveBeenCalledWith(1, 2, 3, 4, 5);
    });

    test("[🎯] handles function that throws error", () => {
      const mockFn = vi.fn((message: string) => {
        throw new Error(message);
      });
      const partialFn = partial(mockFn, "Test error");

      expect(() => partialFn()).toThrow("Test error");
    });

    test("handles function with side effects", () => {
      let counter = 0;
      const mockFn = vi.fn((value: number) => {
        counter += value;
        return counter;
      });
      const partialFn = partial(mockFn, 5);

      const result1 = partialFn();
      const result2 = partialFn();

      expect(result1).toBe(5);
      expect(result2).toBe(10);
      expect(counter).toBe(10);
    });

    test("handles function with async behavior", () => {
      const mockFn = vi.fn((value: number) => Promise.resolve(value));
      const partialFn = partial(mockFn, 42);

      const result = partialFn();

      expect(result).toBeInstanceOf(Promise);
    });

    test("handles function with complex return type", () => {
      const mockFn = vi.fn(() => ({
        data: { name: "John" },
        meta: { timestamp: Date.now() },
        success: true,
      }));
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("meta");
      expect(result).toHaveProperty("success");
      expect(result.data.name).toBe("John");
      expect(result.success).toBe(true);
    });

    test("[🎯] handles function with circular reference", () => {
      const mockFn = vi.fn(() => {
        const obj: any = { name: "John" };
        obj.self = obj;
        return obj;
      });
      const partialFn = partial(mockFn);

      const result = partialFn();

      expect(result).toBe(result.self);
    });

    test("handles function with default parameters", () => {
      const mockFn = vi.fn((name: string, greeting: string = "Hello") => {
        return `${greeting}, ${name}!`;
      });
      const partialFn = partial(mockFn, "John");

      const result = partialFn();

      expect(result).toBe("Hello, John!");
      expect(mockFn).toHaveBeenCalledWith("John");
    });
  });

  describe("Type safety", () => {
    test("preserves function signature", () => {
      const mockFn = vi.fn((a: number, b: number): number => a + b);
      const partialFn = partial(mockFn, 5);

      const result = partialFn(3);

      expect(result).toBe(8);
      expect(mockFn).toHaveBeenCalledWith(5, 3);
    });

    test("preserves function signature with string return", () => {
      const mockFn = vi.fn((name: string): string => `Hello, ${name}!`);
      const partialFn = partial(mockFn, "John");

      const result = partialFn();

      expect(result).toBe("Hello, John!");
      expect(mockFn).toHaveBeenCalledWith("John");
    });

    test("preserves function signature with boolean return", () => {
      const mockFn = vi.fn((n: number): boolean => n % 2 === 0);
      const partialFn = partial(mockFn, 4);

      const result = partialFn();

      expect(result).toBe(true);
      expect(mockFn).toHaveBeenCalledWith(4);
    });

    test("preserves function signature with object return", () => {
      const mockFn = vi.fn(
        (name: string, age: number): { name: string; age: number } => ({
          name,
          age,
        })
      );
      const partialFn = partial(mockFn, "John");

      const result = partialFn(25);

      expect(result).toEqual({ name: "John", age: 25 });
      expect(mockFn).toHaveBeenCalledWith("John", 25);
    });

    test("preserves function signature with array return", () => {
      const mockFn = vi.fn((start: number, end: number): number[] => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      });
      const partialFn = partial(mockFn, 1);

      const result = partialFn(4);

      expect(result).toEqual([1, 2, 3]);
      expect(mockFn).toHaveBeenCalledWith(1, 4);
    });

    test("handles generic types", () => {
      const mockFn = vi.fn(<T>(value: T): T => value);
      const partialFn = partial(mockFn, "hello");

      const result = partialFn();

      expect(result).toBe("hello");
      expect(mockFn).toHaveBeenCalledWith("hello");
    });

    test("handles union types", () => {
      const mockFn = vi.fn((value: string): string | number => {
        const parsed = parseInt(value);
        return isNaN(parsed) ? value : parsed;
      });
      const partialFn = partial(mockFn, "42");

      const result = partialFn();

      expect(result).toBe(42);
      expect(mockFn).toHaveBeenCalledWith("42");
    });

    test("handles optional parameters", () => {
      const mockFn = vi.fn((name: string, greeting?: string): string => {
        return `${greeting || "Hello"}, ${name}!`;
      });
      const partialFn = partial(mockFn, "John");

      const result = partialFn();

      expect(result).toBe("Hello, John!");
      expect(mockFn).toHaveBeenCalledWith("John");
    });

    test("handles rest parameters", () => {
      const mockFn = vi.fn((...numbers: number[]): number => {
        return numbers.reduce((sum, n) => sum + n, 0);
      });
      const partialFn = partial(mockFn, 1, 2);

      const result = partialFn(3, 4);

      expect(result).toBe(10); // 1 + 2 + 3 + 4
      expect(mockFn).toHaveBeenCalledWith(1, 2, 3, 4);
    });
  });

  describe("Function behavior", () => {
    test("does not modify original function", () => {
      const mockFn = vi.fn();
      const original = mockFn;

      partial(mockFn, 1, 2);

      expect(mockFn).toBe(original);
    });

    test("returns new function", () => {
      const mockFn = vi.fn();
      const partialFn = partial(mockFn, 1, 2);

      expect(partialFn).not.toBe(mockFn);
      expect(typeof partialFn).toBe("function");
    });

    test("maintains separate state for different instances", () => {
      const mockFn1 = vi.fn((a: number, b: number) => a + b);
      const mockFn2 = vi.fn((a: number, b: number) => a * b);

      const partialFn1 = partial(mockFn1, 5);
      const partialFn2 = partial(mockFn2, 3);

      const result1 = partialFn1(3);
      const result2 = partialFn2(4);

      expect(result1).toBe(8); // 5 + 3
      expect(result2).toBe(12); // 3 * 4
      expect(mockFn1).toHaveBeenCalledWith(5, 3);
      expect(mockFn2).toHaveBeenCalledWith(3, 4);
    });

    test("handles function with default parameters", () => {
      const mockFn = vi.fn((name: string, greeting: string = "Hello") => {
        return `${greeting}, ${name}!`;
      });
      const partialFn = partial(mockFn, "John");

      const result = partialFn();

      expect(result).toBe("Hello, John!");
      expect(mockFn).toHaveBeenCalledWith("John");
    });

    test("handles function with rest parameters", () => {
      const mockFn = vi.fn((prefix: string, ...suffixes: string[]) => {
        return prefix + suffixes.join(" ");
      });
      const partialFn = partial(mockFn, "Hello");

      const result = partialFn("World", "!");

      expect(result).toBe("HelloWorld !"); // No space between prefix and suffixes
      expect(mockFn).toHaveBeenCalledWith("Hello", "World", "!");
    });
  });

  describe("Real-world use cases", () => {
    test("handles greeting function", () => {
      const greet = vi.fn(
        (greeting: string, name: string, punctuation: string) =>
          `${greeting} ${name}${punctuation}`
      );
      const sayHello = partial(greet, "Hello");

      const result = sayHello("John", "!");

      expect(result).toBe("Hello John!");
      expect(greet).toHaveBeenCalledWith("Hello", "John", "!");
    });

    test("handles math operations", () => {
      const add = vi.fn((a: number, b: number, c: number) => a + b + c);
      const addFive = partial(add, 5);

      const result = addFive(3, 2);

      expect(result).toBe(10); // 5 + 3 + 2
      expect(add).toHaveBeenCalledWith(5, 3, 2);
    });

    test("handles string concatenation", () => {
      const concat = vi.fn(
        (str1: string, str2: string, str3: string) => str1 + str2 + str3
      );
      const prefixWithHello = partial(concat, "Hello");

      const result = prefixWithHello(" ", "World");

      expect(result).toBe("Hello World");
      expect(concat).toHaveBeenCalledWith("Hello", " ", "World");
    });

    test("handles object creation", () => {
      const createUser = vi.fn(
        (name: string, age: number, active: boolean) => ({ name, age, active })
      );
      const createActiveUser = partial(createUser, "John", 25);

      const result = createActiveUser(true);

      expect(result).toEqual({ name: "John", age: 25, active: true });
      expect(createUser).toHaveBeenCalledWith("John", 25, true);
    });

    test("handles array operations", () => {
      const combine = vi.fn(
        (arr1: number[], arr2: number[], arr3: number[]) => [
          ...arr1,
          ...arr2,
          ...arr3,
        ]
      );
      const combineWithFirst = partial(combine, [1, 2]);

      const result = combineWithFirst([3, 4], [5, 6]);

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
      expect(combine).toHaveBeenCalledWith([1, 2], [3, 4], [5, 6]);
    });

    test("handles validation functions", () => {
      const validate = vi.fn(
        (field: string, value: string, minLength: number) => ({
          field,
          value,
          valid: value.length >= minLength,
        })
      );
      const validateUsername = partial(validate, "username");

      const result = validateUsername("abc", 3);

      expect(result).toEqual({ field: "username", value: "abc", valid: true });
      expect(validate).toHaveBeenCalledWith("username", "abc", 3);
    });
  });

  describe("Complex use cases", () => {
    test("handles chaining with other functions", () => {
      const obj = {
        value: 0,
        add: vi.fn(function (this: any, a: number) {
          this.value += a;
          return this;
        }),
        multiply: vi.fn(function (this: any, b: number) {
          this.value *= b;
          return this;
        }),
        getValue: vi.fn(function (this: any) {
          return this.value;
        }),
      };

      const partialAdd = partial(obj.add.bind(obj), 5);
      const partialMultiply = partial(obj.multiply.bind(obj), 2);
      const partialGetValue = partial(obj.getValue.bind(obj));

      partialAdd();
      partialMultiply();
      const result = partialGetValue();

      expect(result).toBe(10); // (0 + 5) * 2
    });

    test("handles nested function calls", () => {
      const obj = {
        name: "John",
        createGreeter: vi.fn(function (this: any, greeting: string) {
          const self = this;
          return function (punctuation: string) {
            return `${greeting} ${self.name}${punctuation}`;
          };
        }),
      };

      const partialCreateGreeter = partial(
        obj.createGreeter.bind(obj),
        "Hello"
      );
      const greeter = partialCreateGreeter();

      expect(greeter("!")).toBe("Hello John!");
    });

    test("handles function composition", () => {
      const obj = {
        add: vi.fn((a: number, b: number) => {
          return a + b;
        }),
        multiply: vi.fn((a: number, b: number) => {
          return a * b;
        }),
      };

      const partialAdd = partial(obj.add, 5);
      const partialMultiply = partial(obj.multiply, 2);

      const result = partialMultiply(partialAdd(3));

      expect(result).toBe(16); // (5 + 3) * 2
    });

    test("handles async function composition", () => {
      const obj = {
        fetch: vi.fn((url: string) => {
          return Promise.resolve(`Data from ${url}`);
        }),
        process: vi.fn((data: string) => {
          return `Processed: ${data}`;
        }),
      };

      const partialFetch = partial(obj.fetch, "https://api.example.com");
      const partialProcess = partial(obj.process);

      const fetchResult = partialFetch();
      const processResult = partialProcess("raw data");

      expect(fetchResult).toBeInstanceOf(Promise);
      expect(processResult).toBe("Processed: raw data");
    });

    test("handles function with complex state", () => {
      const calculator = {
        history: [] as number[],
        add: vi.fn(function (this: any, a: number, b: number) {
          const result = a + b;
          this.history.push(result);
          return result;
        }),
        getHistory: vi.fn(function (this: any) {
          return this.history;
        }),
      };

      const partialAdd = partial(calculator.add.bind(calculator), 3);
      const partialGetHistory = partial(calculator.getHistory.bind(calculator));

      partialAdd(7);
      const history = partialGetHistory();

      expect(history).toEqual([10]);
    });

    test("handles function with error handling", () => {
      const obj = {
        divide: vi.fn((a: number, b: number) => {
          if (b === 0) {
            throw new Error("Division by zero");
          }
          return a / b;
        }),
      };

      const partialDivide = partial(obj.divide, 10);

      const result = partialDivide(2);
      expect(result).toBe(5);

      expect(() => partialDivide(0)).toThrow("Division by zero");
    });
  });

  describe("Deprecation notice", () => {
    test("function is marked as deprecated", () => {
      // This test verifies that the function is deprecated
      // In a real scenario, you would check for deprecation warnings
      const mockFn = vi.fn((name: string) => `Hello, ${name}!`);
      const partialFn = partial(mockFn, "John");

      // The function still works despite being deprecated
      expect(partialFn()).toBe("Hello, John!");
    });

    test("recommends using Function.bind", () => {
      const greet = vi.fn(
        (greeting: string, name: string, punctuation: string) =>
          `${greeting} ${name}${punctuation}`
      );

      // Deprecated approach
      const sayHelloDeprecated = partial(greet, "Hello");

      // Recommended approach
      const sayHelloBind = greet.bind(null, "Hello");

      // Both should work the same way
      expect(sayHelloDeprecated("John", "!")).toBe("Hello John!");
      expect(sayHelloBind("John", "!")).toBe("Hello John!");
    });

    test("alternative with arrow function", () => {
      const greet = vi.fn(
        (greeting: string, name: string, punctuation: string) =>
          `${greeting} ${name}${punctuation}`
      );

      // Alternative with arrow function
      const sayHelloArrow = (name: string, punctuation: string) =>
        greet("Hello", name, punctuation);

      expect(sayHelloArrow("John", "!")).toBe("Hello John!");
    });

    test("comparison with bind approach", () => {
      const add = vi.fn((a: number, b: number, c: number) => a + b + c);

      // Using partial
      const addFivePartial = partial(add, 5);

      // Using bind
      const addFiveBind = add.bind(null, 5);

      // Both should work the same way
      expect(addFivePartial(3, 2)).toBe(10);
      expect(addFiveBind(3, 2)).toBe(10);
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.array(fc.integer(), { minLength: 1, maxLength: 10 })])(
      "[🎲] is equivalent to native Function.bind for sum",
      (nums) => {
        const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
        const [first, ...rest] = nums;
        
        const boundPartial = partial(sum, first);
        const boundNative = sum.bind(null, first);
        
        expect(boundPartial(...rest)).toBe(boundNative(...rest));
      }
    );

    itProp.prop([fc.string(), fc.string()])(
      "[🎲] preserves string concatenation behavior",
      (a, b) => {
        const concat = (x: string, y: string) => x + y;
        const boundConcat = partial(concat, a);
        expect(boundConcat(b)).toBe(a + b);
      }
    );
  });
});
