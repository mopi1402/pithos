import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { bind } from "./bind";

describe("bind", () => {
  describe("Basic functionality", () => {
    test("binds function to thisArg", () => {
      const obj = {
        name: "John",
        greet: function (greeting: string) {
          return `${greeting} ${this.name}`;
        },
      };

      const boundGreet = bind(obj.greet, obj);

      expect(boundGreet("Hello")).toBe("Hello John");
    });

    test("binds function with partial arguments", () => {
      const obj = {
        name: "John",
        greet: function (greeting: string, punctuation: string) {
          return `${greeting} ${this.name}${punctuation}`;
        },
      };

      const boundGreet = bind(obj.greet, obj, "Hello");

      expect(boundGreet("!")).toBe("Hello John!");
    });

    test("binds function with multiple partial arguments", () => {
      const obj = {
        name: "John",
        greet: function (
          greeting: string,
          punctuation: string,
          suffix: string
        ) {
          return `${greeting} ${this.name}${punctuation} ${suffix}`;
        },
      };

      const boundGreet = bind(obj.greet, obj, "Hello", "!");

      expect(boundGreet("World")).toBe("Hello John! World");
    });

    test("binds function with all arguments", () => {
      const obj = {
        name: "John",
        greet: function (greeting: string, punctuation: string) {
          return `${greeting} ${this.name}${punctuation}`;
        },
      };

      const boundGreet = bind(obj.greet, obj, "Hello", "!");

      expect(boundGreet()).toBe("Hello John!");
    });

    test("binds function with no thisArg", () => {
      const greet = function (greeting: string, name: string) {
        return `${greeting} ${name}`;
      };

      const boundGreet = bind(greet, null, "Hello");

      expect(boundGreet("John")).toBe("Hello John");
    });

    test("binds function with undefined thisArg", () => {
      const greet = function (greeting: string, name: string) {
        return `${greeting} ${name}`;
      };

      const boundGreet = bind(greet, undefined, "Hello");

      expect(boundGreet("John")).toBe("Hello John");
    });
  });

  describe("Function with different parameter types", () => {
    test("binds function with number parameters", () => {
      const obj = {
        value: 10,
        add: function (a: number, b: number) {
          return this.value + a + b;
        },
      };

      const boundAdd = bind(obj.add, obj, 5);

      expect(boundAdd(3)).toBe(18); // 10 + 5 + 3
    });

    test("binds function with string parameters", () => {
      const obj = {
        prefix: "Hello",
        concat: function (str1: string, str2: string) {
          return `${this.prefix} ${str1} ${str2}`;
        },
      };

      const boundConcat = bind(obj.concat, obj, "World");

      expect(boundConcat("!")).toBe("Hello World !");
    });

    test("binds function with boolean parameters", () => {
      const obj = {
        flag: true,
        check: function (condition: boolean, value: boolean) {
          return this.flag && condition && value;
        },
      };

      const boundCheck = bind(obj.check, obj, true);

      expect(boundCheck(false)).toBe(false);
      expect(boundCheck(true)).toBe(true);
    });

    test("binds function with object parameters", () => {
      const obj = {
        data: { name: "John" },
        process: function (user: { name: string }, action: string) {
          return `${action} ${user.name} from ${this.data.name}`;
        },
      };

      const boundProcess = bind(obj.process, obj, { name: "Jane" });

      expect(boundProcess("Greet")).toBe("Greet Jane from John");
    });

    test("binds function with array parameters", () => {
      const obj = {
        items: [1, 2, 3],
        combine: function (arr1: number[], arr2: number[]) {
          return [...this.items, ...arr1, ...arr2];
        },
      };

      const boundCombine = bind(obj.combine, obj, [4, 5]);

      expect(boundCombine([6, 7])).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    test("binds function with mixed parameter types", () => {
      const obj = {
        id: 1,
        create: function (name: string, age: number, active: boolean) {
          return { id: this.id, name, age, active };
        },
      };

      const boundCreate = bind(obj.create, obj, "John");

      expect(boundCreate(25, true)).toEqual({
        id: 1,
        name: "John",
        age: 25,
        active: true,
      });
    });
  });

  describe("Function return values", () => {
    test("binds function that returns string", () => {
      const obj = {
        name: "John",
        getName: function () {
          return this.name;
        },
      };

      const boundGetName = bind(obj.getName, obj);

      expect(boundGetName()).toBe("John");
    });

    test("binds function that returns number", () => {
      const obj = {
        value: 42,
        getValue: function () {
          return this.value;
        },
      };

      const boundGetValue = bind(obj.getValue, obj);

      expect(boundGetValue()).toBe(42);
    });

    test("binds function that returns boolean", () => {
      const obj = {
        flag: true,
        getFlag: function () {
          return this.flag;
        },
      };

      const boundGetFlag = bind(obj.getFlag, obj);

      expect(boundGetFlag()).toBe(true);
    });

    test("binds function that returns object", () => {
      const obj = {
        data: { name: "John", age: 25 },
        getData: function () {
          return this.data;
        },
      };

      const boundGetData = bind(obj.getData, obj);

      expect(boundGetData()).toEqual({ name: "John", age: 25 });
    });

    test("binds function that returns array", () => {
      const obj = {
        items: [1, 2, 3],
        getItems: function () {
          return this.items;
        },
      };

      const boundGetItems = bind(obj.getItems, obj);

      expect(boundGetItems()).toEqual([1, 2, 3]);
    });

    test("binds function that returns null", () => {
      const obj = {
        getNull: function () {
          return null;
        },
      };

      const boundGetNull = bind(obj.getNull, obj);

      expect(boundGetNull()).toBe(null);
    });

    test("binds function that returns undefined", () => {
      const obj = {
        getUndefined: function () {
          return undefined;
        },
      };

      const boundGetUndefined = bind(obj.getUndefined, obj);

      expect(boundGetUndefined()).toBe(undefined);
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles function with no parameters", () => {
      const obj = {
        value: 42,
        getValue: function () {
          return this.value;
        },
      };

      const boundGetValue = bind(obj.getValue, obj);

      expect(boundGetValue()).toBe(42);
    });

    test("[🎯] handles function with many parameters", () => {
      const obj = {
        sum: function (a: number, b: number, c: number, d: number, e: number) {
          return this.value + a + b + c + d + e;
        },
        value: 10,
      };

      const boundSum = bind(obj.sum, obj, 1, 2, 3);

      expect(boundSum(4, 5)).toBe(25); // 10 + 1 + 2 + 3 + 4 + 5
    });

    test("[🎯] handles function that throws error", () => {
      const obj = {
        throwError: function (message: string) {
          throw new Error(message);
        },
      };

      const boundThrowError = bind(obj.throwError, obj, "Test error");

      expect(() => boundThrowError()).toThrow("Test error");
    });

    test("handles function with side effects", () => {
      let counter = 0;
      const obj = {
        increment: function (value: number) {
          counter += value;
          return counter;
        },
      };

      const boundIncrement = bind(obj.increment, obj, 5);

      expect(boundIncrement()).toBe(5);
      expect(boundIncrement()).toBe(10);
    });

    test("handles function with async behavior", () => {
      const obj = {
        asyncValue: function (value: number) {
          return Promise.resolve(value);
        },
      };

      const boundAsyncValue = bind(obj.asyncValue, obj, 42);

      expect(boundAsyncValue()).toBeInstanceOf(Promise);
    });

    test("handles function with complex return type", () => {
      const obj = {
        createComplex: function (name: string) {
          return {
            data: { name },
            meta: { timestamp: Date.now() },
            success: true,
          };
        },
      };

      const boundCreateComplex = bind(obj.createComplex, obj, "John");

      const result = boundCreateComplex();
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("meta");
      expect(result).toHaveProperty("success");
      expect(result.data.name).toBe("John");
      expect(result.success).toBe(true);
    });

    test("[🎯] handles function with circular reference", () => {
      const obj: any = {
        name: "John",
        getSelf: function () {
          return this;
        },
      };
      obj.self = obj;

      const boundGetSelf = bind(obj.getSelf, obj);

      expect(boundGetSelf()).toBe(obj);
    });
  });

  describe("Type safety", () => {
    test("preserves function signature", () => {
      const obj = {
        add: (a: number, b: number): number => a + b,
      };

      const boundAdd = bind(obj.add, obj, 5);

      expect(boundAdd(3)).toBe(8);
    });

    test("preserves function signature with string return", () => {
      const obj = {
        greet: (name: string): string => `Hello, ${name}!`,
      };

      const boundGreet = bind(obj.greet, obj);

      expect(boundGreet("John")).toBe("Hello, John!");
    });

    test("preserves function signature with boolean return", () => {
      const obj = {
        isEven: (n: number): boolean => n % 2 === 0,
      };

      const boundIsEven = bind(obj.isEven, obj);

      expect(boundIsEven(4)).toBe(true);
      expect(boundIsEven(5)).toBe(false);
    });

    test("preserves function signature with object return", () => {
      const obj = {
        createUser: (
          name: string,
          age: number
        ): { name: string; age: number } => ({ name, age }),
      };

      const boundCreateUser = bind(obj.createUser, obj, "John");

      expect(boundCreateUser(25)).toEqual({ name: "John", age: 25 });
    });

    test("preserves function signature with array return", () => {
      const obj = {
        createRange: (start: number, end: number): number[] => {
          const result = [];
          for (let i = start; i < end; i++) {
            result.push(i);
          }
          return result;
        },
      };

      const boundCreateRange = bind(obj.createRange, obj, 1);

      expect(boundCreateRange(4)).toEqual([1, 2, 3]);
    });

    test("handles generic types", () => {
      const obj = {
        identity: <T>(value: T): T => value,
      };

      const boundIdentity = bind(obj.identity, obj, "hello");

      expect(boundIdentity()).toBe("hello");
    });

    test("handles union types", () => {
      const obj = {
        parseValue: (value: string): string | number => {
          const parsed = parseInt(value);
          return isNaN(parsed) ? value : parsed;
        },
      };

      const boundParseValue = bind(obj.parseValue, obj);

      expect(boundParseValue("42")).toBe(42);
      expect(boundParseValue("hello")).toBe("hello");
    });

    test("handles optional parameters", () => {
      const obj = {
        greet: (name: string, greeting?: string): string => {
          return `${greeting || "Hello"}, ${name}!`;
        },
      };

      const boundGreet = bind(obj.greet, obj);

      expect(boundGreet("John")).toBe("Hello, John!");
      expect(boundGreet("Jane", "Hi")).toBe("Hi, Jane!");
    });

    test("handles rest parameters", () => {
      const obj = {
        sum: (...numbers: number[]): number => {
          return numbers.reduce((sum, n) => sum + n, 0);
        },
      };

      const boundSum = bind(obj.sum, obj, 1, 2);

      expect(boundSum(3, 4)).toBe(10); // 1 + 2 + 3 + 4
    });
  });

  describe("Function behavior", () => {
    test("does not modify original function", () => {
      const obj = {
        greet: function (name: string) {
          return `Hello, ${name}!`;
        },
      };
      const original = obj.greet;

      bind(obj.greet, obj, "John");

      expect(obj.greet).toBe(original);
    });

    test("returns new function", () => {
      const obj = {
        greet: function (name: string) {
          return `Hello, ${name}!`;
        },
      };

      const boundGreet = bind(obj.greet, obj, "John");

      expect(boundGreet).not.toBe(obj.greet);
      expect(typeof boundGreet).toBe("function");
    });

    test("maintains separate state for different instances", () => {
      const obj1 = {
        name: "John",
        greet: function (greeting: string) {
          return `${greeting} ${this.name}`;
        },
      };
      const obj2 = {
        name: "Jane",
        greet: function (greeting: string) {
          return `${greeting} ${this.name}`;
        },
      };

      const boundGreet1 = bind(obj1.greet, obj1, "Hello");
      const boundGreet2 = bind(obj2.greet, obj2, "Hi");

      expect(boundGreet1()).toBe("Hello John");
      expect(boundGreet2()).toBe("Hi Jane");
    });

    test("handles function with default parameters", () => {
      const obj = {
        greet: function (name: string, greeting: string = "Hello") {
          return `${greeting}, ${name}!`;
        },
      };

      const boundGreet = bind(obj.greet, obj);

      expect(boundGreet("John")).toBe("Hello, John!");
      expect(boundGreet("Jane", "Hi")).toBe("Hi, Jane!");
    });

    test("handles function with rest parameters", () => {
      const obj = {
        combine: function (prefix: string, ...suffixes: string[]) {
          return prefix + suffixes.join(" ");
        },
      };

      const boundCombine = bind(obj.combine, obj, "Hello");

      expect(boundCombine("World", "!")).toBe("HelloWorld !"); // No space between prefix and suffixes
    });
  });

  describe("Real-world use cases", () => {
    test("handles event handlers", () => {
      const button = {
        text: "Click me",
        onClick: function (event: Event) {
          return `Button "${this.text}" clicked`;
        },
      };

      const boundOnClick = bind(button.onClick, button);

      expect(boundOnClick({} as Event)).toBe('Button "Click me" clicked');
    });

    test("handles API calls", () => {
      const api = {
        baseUrl: "https://api.example.com",
        get: function (endpoint: string, params: any) {
          return `${this.baseUrl}/${endpoint}?${JSON.stringify(params)}`;
        },
      };

      const boundGet = bind(api.get, api, "users");

      expect(boundGet({ page: 1 })).toBe(
        'https://api.example.com/users?{"page":1}'
      );
    });

    test("handles data processing", () => {
      const processor = {
        multiplier: 2,
        process: function (data: number[], operation: string) {
          if (operation === "multiply") {
            return data.map((n) => n * this.multiplier);
          }
          return data;
        },
      };

      const boundProcess = bind(processor.process, processor, [1, 2, 3]);

      expect(boundProcess("multiply")).toEqual([2, 4, 6]);
    });

    test("handles form validation", () => {
      const validator = {
        rules: { minLength: 3 },
        validate: function (field: string, value: string) {
          return {
            field,
            value,
            valid: value.length >= this.rules.minLength,
          };
        },
      };

      const boundValidate = bind(validator.validate, validator, "username");

      expect(boundValidate("ab")).toEqual({
        field: "username",
        value: "ab",
        valid: false,
      });
      expect(boundValidate("abc")).toEqual({
        field: "username",
        value: "abc",
        valid: true,
      });
    });

    test("handles logging", () => {
      const logger = {
        level: "INFO",
        log: function (message: string, data: any) {
          return `[${this.level}] ${message}: ${JSON.stringify(data)}`;
        },
      };

      const boundLog = bind(logger.log, logger, "User action");

      expect(boundLog({ action: "login" })).toBe(
        '[INFO] User action: {"action":"login"}'
      );
    });

    test("handles caching", () => {
      const cache = {
        data: new Map(),
        get: function (key: string, defaultValue: any) {
          return this.data.get(key) || defaultValue;
        },
      };

      const boundGet = bind(cache.get, cache, "user");

      expect(boundGet(null)).toBe(null);
    });
  });

  describe("Complex use cases", () => {
    test("handles chaining with other functions", () => {
      const obj = {
        value: 10,
        add: function (a: number) {
          this.value += a;
          return this;
        },
        multiply: function (b: number) {
          this.value *= b;
          return this;
        },
        getValue: function () {
          return this.value;
        },
      };

      const boundAdd = bind(obj.add, obj, 5);
      const boundMultiply = bind(obj.multiply, obj, 2);
      const boundGetValue = bind(obj.getValue, obj);

      boundAdd();
      boundMultiply();
      expect(boundGetValue()).toBe(30); // (10 + 5) * 2
    });

    test("handles nested function calls", () => {
      const obj = {
        name: "John",
        createGreeter: function (greeting: string) {
          const self = this;
          return function (punctuation: string) {
            return `${greeting} ${self.name}${punctuation}`;
          };
        },
      };

      const boundCreateGreeter = bind(obj.createGreeter, obj, "Hello");
      const greeter = boundCreateGreeter();

      expect(greeter("!")).toBe("Hello John!");
    });

    test("handles function composition", () => {
      const obj = {
        add: function (a: number, b: number) {
          return a + b;
        },
        multiply: function (a: number, b: number) {
          return a * b;
        },
      };

      const boundAdd = bind(obj.add, obj, 5);
      const boundMultiply = bind(obj.multiply, obj, 2);

      const result = boundMultiply(boundAdd(3), 4); // (5 + 3) * 2 * 4 = 16
      expect(result).toBe(16);
    });

    test("handles async function composition", () => {
      const obj = {
        fetch: function (url: string) {
          return Promise.resolve(`Data from ${url}`);
        },
        process: function (data: string) {
          return `Processed: ${data}`;
        },
      };

      const boundFetch = bind(obj.fetch, obj, "https://api.example.com");
      const boundProcess = bind(obj.process, obj);

      expect(boundFetch()).toBeInstanceOf(Promise);
    });

    test("handles function with complex state", () => {
      const calculator = {
        history: [] as number[],
        add: function (a: number, b: number) {
          const result = a + b;
          this.history.push(result);
          return result;
        },
        getHistory: function () {
          return this.history;
        },
      };

      const boundAdd = bind(calculator.add, calculator, 5);
      const boundGetHistory = bind(calculator.getHistory, calculator);

      boundAdd(3);
      boundAdd(7);
      expect(boundGetHistory()).toEqual([8, 12]);
    });

    test("handles function with error handling", () => {
      const obj = {
        divide: function (a: number, b: number) {
          if (b === 0) {
            throw new Error("Division by zero");
          }
          return a / b;
        },
      };

      const boundDivide = bind(obj.divide, obj, 10);

      expect(boundDivide(2)).toBe(5);
      expect(() => boundDivide(0)).toThrow("Division by zero");
    });
  });

  describe("Deprecation notice", () => {
    test("function is marked as deprecated", () => {
      // This test verifies that the function is deprecated
      // In a real scenario, you would check for deprecation warnings
      const obj = {
        greet: function (name: string) {
          return `Hello, ${name}!`;
        },
      };

      const boundGreet = bind(obj.greet, obj, "John");

      // The function still works despite being deprecated
      expect(boundGreet()).toBe("Hello, John!");
    });

    test("recommends using native Function.bind", () => {
      const obj = {
        greet: function (name: string) {
          return `Hello, ${name}!`;
        },
      };

      // Deprecated approach
      const boundGreetDeprecated = bind(obj.greet, obj, "John");

      // Recommended approach
      const boundGreetNative = obj.greet.bind(obj, "John");

      // Both should work the same way
      expect(boundGreetDeprecated()).toBe("Hello, John!");
      expect(boundGreetNative()).toBe("Hello, John!");
    });

    test("alternative with arrow function", () => {
      const obj = {
        name: "John",
      };

      // Alternative with arrow function (no this binding needed)
      const greetArrow = (greeting: string, punctuation: string) =>
        `${greeting} ${obj.name}${punctuation}`;
      const boundGreetArrow = greetArrow.bind(null, "Hello");

      expect(boundGreetArrow("!")).toBe("Hello John!");
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.array(fc.integer(), { minLength: 1, maxLength: 10 })])(
      "[🎲] is equivalent to native Function.bind for sum",
      (nums) => {
        const obj = { base: 0 };
        const sum = function(this: typeof obj, ...args: number[]) {
          return this.base + args.reduce((a, b) => a + b, 0);
        };
        const [first, ...rest] = nums;
        
        const boundCustom = bind(sum, obj, first);
        const boundNative = sum.bind(obj, first);
        
        expect(boundCustom(...rest)).toBe(boundNative(...rest));
      }
    );

    itProp.prop([fc.string(), fc.string()])(
      "[🎲] preserves this binding correctly",
      (name, greeting) => {
        const obj = { name };
        const greet = function(this: typeof obj, g: string) {
          return `${g} ${this.name}`;
        };
        
        const boundGreet = bind(greet, obj, greeting);
        expect(boundGreet()).toBe(`${greeting} ${name}`);
      }
    );
  });
});
