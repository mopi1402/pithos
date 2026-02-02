import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { ERROR_MESSAGES_COMPOSITION } from "./messages";
import { parse } from "../parser";
import { string } from "../../schemas/primitives/string";
import { number } from "../../schemas/primitives/number";
import { object } from "../../schemas/composites/object";
import { array } from "../../schemas/composites/array";
import { literal } from "../../schemas/primitives/literal";
import { discriminatedUnion, unionOf } from "../../schemas/operators/union";

describe("ERROR_MESSAGES_COMPOSITION", () => {
  describe("[🎯] Specification Tests", () => {
    describe("default error messages consistency", () => {
      // Requirements 32.1, 32.2, 32.5, 32.6
      it("[🎯] should have consistent string message", () => {
        expect(ERROR_MESSAGES_COMPOSITION.string).toBe("Expected string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.string).toBe("string");
      });

      it("[🎯] should have consistent number message", () => {
        expect(ERROR_MESSAGES_COMPOSITION.number).toBe("Expected number");
        expect(typeof ERROR_MESSAGES_COMPOSITION.number).toBe("string");
      });

      it("[🎯] should have consistent union message", () => {
        expect(ERROR_MESSAGES_COMPOSITION.union).toBe(
          "Value does not match any of the expected types"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.union).toBe("string");
      });

      it("[🎯] should have consistent object message", () => {
        expect(ERROR_MESSAGES_COMPOSITION.object).toBe("Expected object");
        expect(typeof ERROR_MESSAGES_COMPOSITION.object).toBe("string");
      });
    });

    describe("parameterized error messages", () => {
      // Requirement 32.3
      it("[🎯] should include n in minLength(n) message", () => {
        const message5 = ERROR_MESSAGES_COMPOSITION.minLength(5);
        expect(message5).toContain("5");
        expect(message5).toBe("String must be at least 5 characters long");

        const message0 = ERROR_MESSAGES_COMPOSITION.minLength(0);
        expect(message0).toContain("0");
        expect(message0).toBe("String must be at least 0 characters long");

        const message100 = ERROR_MESSAGES_COMPOSITION.minLength(100);
        expect(message100).toContain("100");
        expect(message100).toBe("String must be at least 100 characters long");
      });

      // Requirement 32.4
      it("[🎯] should include regex source in pattern(regex) message", () => {
        const simpleRegex = /^test$/;
        const simpleMessage = ERROR_MESSAGES_COMPOSITION.pattern(simpleRegex);
        expect(simpleMessage).toContain("^test$");
        expect(simpleMessage).toBe("String must match pattern ^test$");

        const emailRegex = /^[a-z]+@[a-z]+\.[a-z]+$/;
        const emailMessage = ERROR_MESSAGES_COMPOSITION.pattern(emailRegex);
        expect(emailMessage).toContain("^[a-z]+@[a-z]+\\.[a-z]+$");

        const emptyRegex = /(?:)/;
        const emptyMessage = ERROR_MESSAGES_COMPOSITION.pattern(emptyRegex);
        expect(emptyMessage).toContain("(?:)");
      });
    });

    describe("all static messages are strings", () => {
      it("[🎯] should have all primitive type messages as strings", () => {
        expect(typeof ERROR_MESSAGES_COMPOSITION.boolean).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.array).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.map).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.set).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.record).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.null).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.undefined).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.date).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.bigint).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.symbol).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.never).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.void).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.tuple).toBe("string");
      });

      it("[🎯] should have all constraint messages as strings", () => {
        expect(typeof ERROR_MESSAGES_COMPOSITION.int).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.positive).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.negative).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.email).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.url).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.uuid).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.arrayUnique).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.bigintPositive).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.bigintNegative).toBe("string");
      });

      it("[🎯] should have all coerce messages as strings", () => {
        expect(typeof ERROR_MESSAGES_COMPOSITION.coerceNumber).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.coerceDate).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.coerceBigInt).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.coerceInvalidDate).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.coerceNullToBigInt).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.coerceUndefinedToBigInt).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.coerceNullToDate).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.coerceUndefinedToDate).toBe(
          "string"
        );
      });
    });

    describe("all function messages return strings", () => {
      it("[🎯] should return strings from all parameterized message functions", () => {
        // String constraints
        expect(typeof ERROR_MESSAGES_COMPOSITION.minLength(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.maxLength(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.length(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.pattern(/test/)).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.includes("test")).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.startsWith("test")).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.endsWith("test")).toBe(
          "string"
        );

        // Number constraints
        expect(typeof ERROR_MESSAGES_COMPOSITION.min(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.max(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.lt(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.lte(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.gt(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.gte(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.multipleOf(1)).toBe("string");

        // Array constraints
        expect(typeof ERROR_MESSAGES_COMPOSITION.arrayMinLength(1)).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.arrayMaxLength(1)).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.arrayLength(1)).toBe("string");

        // Object constraints
        expect(typeof ERROR_MESSAGES_COMPOSITION.objectMinKeys(1)).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.objectMaxKeys(1)).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.objectStrict("key")).toBe(
          "string"
        );

        // Set/Map constraints
        expect(typeof ERROR_MESSAGES_COMPOSITION.setMinSize(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.setMaxSize(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.mapMinSize(1)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.mapMaxSize(1)).toBe("string");

        // Date constraints
        expect(typeof ERROR_MESSAGES_COMPOSITION.dateMin(new Date())).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.dateMax(new Date())).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.dateBefore(new Date())).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.dateAfter(new Date())).toBe(
          "string"
        );

        // BigInt constraints
        expect(typeof ERROR_MESSAGES_COMPOSITION.bigintMin(1n)).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.bigintMax(1n)).toBe("string");

        // Tuple messages
        expect(typeof ERROR_MESSAGES_COMPOSITION.tupleLength(1, 2)).toBe(
          "string"
        );
        expect(typeof ERROR_MESSAGES_COMPOSITION.tupleMinLength(1, 2)).toBe(
          "string"
        );

        // Enum messages
        expect(typeof ERROR_MESSAGES_COMPOSITION.enum(["a"], "string")).toBe(
          "string"
        );
        expect(
          typeof ERROR_MESSAGES_COMPOSITION.nativeEnum(["a"], "string")
        ).toBe("string");

        // Literal message
        expect(typeof ERROR_MESSAGES_COMPOSITION.literal("a", "string")).toBe(
          "string"
        );

        // Transform messages
        expect(typeof ERROR_MESSAGES_COMPOSITION.missingField("field")).toBe(
          "string"
        );
        expect(
          typeof ERROR_MESSAGES_COMPOSITION.propertyError("field", "error")
        ).toBe("string");
        expect(typeof ERROR_MESSAGES_COMPOSITION.keyofExpectedOneOf("a")).toBe(
          "string"
        );
      });
    });
  });

  describe("string messages", () => {
    it("should contain string error messages", () => {
      expect(ERROR_MESSAGES_COMPOSITION.string).toBe("Expected string");
      expect(ERROR_MESSAGES_COMPOSITION.number).toBe("Expected number");
      expect(ERROR_MESSAGES_COMPOSITION.boolean).toBe("Expected boolean");
    });
  });

  describe("function messages", () => {
    it("should format minLength message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.minLength(5);
      expect(message).toBe("String must be at least 5 characters long");
    });

    it("should format maxLength message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.maxLength(10);
      expect(message).toBe("String must be at most 10 characters long");
    });

    it("should format min message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.min(0);
      expect(message).toBe("Number must be at least 0");
    });

    it("should format max message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.max(100);
      expect(message).toBe("Number must be at most 100");
    });

    it("should format pattern message correctly", () => {
      const regex = /^test$/;
      const message = ERROR_MESSAGES_COMPOSITION.pattern(regex);
      expect(message).toBe("String must match pattern ^test$");
    });

    it("should format length message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.length(8);
      expect(message).toBe("String must be exactly 8 characters long");
    });

    it("should format includes message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.includes("test");
      expect(message).toBe('String must include "test"');
    });

    it("should format startsWith message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.startsWith("prefix");
      expect(message).toBe('String must start with "prefix"');
    });

    it("should format endsWith message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.endsWith("suffix");
      expect(message).toBe('String must end with "suffix"');
    });

    it("should format comparison messages correctly", () => {
      expect(ERROR_MESSAGES_COMPOSITION.lt(10)).toBe(
        "Number must be less than 10"
      );
      expect(ERROR_MESSAGES_COMPOSITION.lte(10)).toBe(
        "Number must be less than or equal to 10"
      );
      expect(ERROR_MESSAGES_COMPOSITION.gt(5)).toBe(
        "Number must be greater than 5"
      );
      expect(ERROR_MESSAGES_COMPOSITION.gte(5)).toBe(
        "Number must be greater than or equal to 5"
      );
    });

    it("should format multipleOf message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.multipleOf(3);
      expect(message).toBe("Number must be a multiple of 3");
    });

    it("should format array messages correctly", () => {
      expect(ERROR_MESSAGES_COMPOSITION.arrayMinLength(2)).toBe(
        "Array must have at least 2 items"
      );
      expect(ERROR_MESSAGES_COMPOSITION.arrayMaxLength(10)).toBe(
        "Array must have at most 10 items"
      );
      expect(ERROR_MESSAGES_COMPOSITION.arrayLength(5)).toBe(
        "Array must have exactly 5 items"
      );
    });

    it("should format object messages correctly", () => {
      expect(ERROR_MESSAGES_COMPOSITION.objectMinKeys(1)).toBe(
        "Object must have at least 1 keys"
      );
      expect(ERROR_MESSAGES_COMPOSITION.objectMaxKeys(5)).toBe(
        "Object must have at most 5 keys"
      );
    });

    it("should format date messages correctly", () => {
      const date = new Date("2023-01-01");
      expect(ERROR_MESSAGES_COMPOSITION.dateMin(date)).toContain(
        "Date must be at least"
      );
      expect(ERROR_MESSAGES_COMPOSITION.dateMax(date)).toContain(
        "Date must be at most"
      );
      expect(ERROR_MESSAGES_COMPOSITION.dateBefore(date)).toContain(
        "Date must be before"
      );
      expect(ERROR_MESSAGES_COMPOSITION.dateAfter(date)).toContain(
        "Date must be after"
      );
    });

    it("should format bigint messages correctly", () => {
      expect(ERROR_MESSAGES_COMPOSITION.bigintMin(100n)).toContain(
        "BigInt must be at least"
      );
      expect(ERROR_MESSAGES_COMPOSITION.bigintMax(1000n)).toContain(
        "BigInt must be at most"
      );
    });

    it("should format literal message correctly", () => {
      const message = ERROR_MESSAGES_COMPOSITION.literal("expected", "string");
      expect(message).toContain("Expected literal value");
      expect(message).toContain("expected");
      expect(message).toContain("string");
    });

    it("should format tuple messages correctly", () => {
      expect(ERROR_MESSAGES_COMPOSITION.tupleLength(3, 2)).toBe(
        "Expected tuple of length 3, got 2"
      );
      expect(ERROR_MESSAGES_COMPOSITION.tupleMinLength(2, 1)).toBe(
        "Expected tuple of at least length 2, got 1"
      );
    });

    it("should format enum message correctly", () => {
      const values = ["a", "b", "c"] as const;
      const message = ERROR_MESSAGES_COMPOSITION.enum(values, "string");
      expect(message).toContain("Expected one of");
      expect(message).toContain("a");
      expect(message).toContain("b");
      expect(message).toContain("c");
    });

    it("should format transform messages correctly", () => {
      expect(ERROR_MESSAGES_COMPOSITION.missingField("name")).toBe(
        "Missing required field: name"
      );
      expect(ERROR_MESSAGES_COMPOSITION.propertyError("age", "invalid")).toBe(
        "Property 'age': invalid"
      );
      expect(ERROR_MESSAGES_COMPOSITION.keyofExpectedOneOf("a, b")).toBe(
        "Expected one of: a, b"
      );
    });
  });

  describe("[🎯] Custom Error Messages Specification Tests", () => {
    describe("custom message propagation", () => {
      // Requirement 19.1: WHEN a schema with custom message fails,
      // THE Schema SHALL return the custom message (boundary: custom message)
      it("[🎯] should return custom message when string schema fails", () => {
        const customMessage = "Custom string error";
        const schema = string(customMessage);
        const result = parse(schema, 123);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when number schema fails", () => {
        const customMessage = "Custom number error";
        const schema = number(customMessage);
        const result = parse(schema, "not a number");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when object schema fails", () => {
        const customMessage = "Custom object error";
        const schema = object({ name: string() }, customMessage);
        const result = parse(schema, null);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when array schema fails", () => {
        const customMessage = "Custom array error";
        const schema = array(string(), customMessage);
        const result = parse(schema, "not an array");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });
    });

    describe("nested error path", () => {
      // Requirement 19.2: WHEN a nested schema fails,
      // THE Parent Schema SHALL include the nested error path (boundary: error path)
      it("[🎯] should include property name in nested error path", () => {
        const schema = object({
          name: string(),
          age: number(),
        });
        const result = parse(schema, { name: "John", age: "invalid" });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain("Property 'age':");
          expect(result.error).toContain(ERROR_MESSAGES_COMPOSITION.number);
        }
      });

      it("[🎯] should include first failing property in error path", () => {
        const schema = object({
          name: string(),
          email: string(),
        });
        const result = parse(schema, { name: 123, email: "test@test.com" });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain("Property 'name':");
        }
      });

      it("[🎯] should include nested object property in error path", () => {
        const schema = object({
          user: object({
            name: string(),
          }),
        });
        const result = parse(schema, { user: { name: 123 } });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain("Property 'user':");
          expect(result.error).toContain("Property 'name':");
        }
      });

      it("[🎯] should include array item error in nested path", () => {
        const schema = object({
          items: array(string()),
        });
        const result = parse(schema, { items: ["valid", 123] });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain("Property 'items':");
        }
      });
    });

    describe("constraint custom message", () => {
      // Requirement 19.3: WHEN a constraint with custom message fails,
      // THE Constraint SHALL return the custom message (boundary: constraint message)
      it("[🎯] should return custom message when minLength constraint fails", () => {
        const customMessage = "Name too short";
        const schema = string().minLength(5, customMessage);
        const result = parse(schema, "hi");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when maxLength constraint fails", () => {
        const customMessage = "Name too long";
        const schema = string().maxLength(5, customMessage);
        const result = parse(schema, "hello world");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when email constraint fails", () => {
        const customMessage = "Invalid email address";
        const schema = string().email(customMessage);
        const result = parse(schema, "not-an-email");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when pattern constraint fails", () => {
        const customMessage = "Must be uppercase";
        const schema = string().pattern(/^[A-Z]+$/, customMessage);
        const result = parse(schema, "lowercase");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when number min constraint fails", () => {
        const customMessage = "Value too small";
        const schema = number().min(10, customMessage);
        const result = parse(schema, 5);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when number max constraint fails", () => {
        const customMessage = "Value too large";
        const schema = number().max(10, customMessage);
        const result = parse(schema, 15);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });
    });

    describe("union custom message", () => {
      // Requirement 19.4: WHEN discriminatedUnion with custom message fails,
      // THE DiscriminatedUnion SHALL return the custom message (boundary: union message)
      it("[🎯] should return custom message when unionOf fails", () => {
        const customMessage = "Must be string or number";
        const schema = unionOf(string(), number(), customMessage);
        const result = parse(schema, true);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when discriminatedUnion fails with invalid discriminator", () => {
        const customMessage = "Invalid response type";
        const schema = discriminatedUnion(
          "type",
          [
            object({ type: literal("success"), data: string() }),
            object({ type: literal("error"), message: string() }),
          ],
          customMessage
        );
        const result = parse(schema, { type: "unknown" });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when discriminatedUnion fails with missing discriminator", () => {
        const customMessage = "Invalid response type";
        const schema = discriminatedUnion(
          "type",
          [
            object({ type: literal("success"), data: string() }),
            object({ type: literal("error"), message: string() }),
          ],
          customMessage
        );
        const result = parse(schema, { data: "test" });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return custom message when discriminatedUnion receives non-object", () => {
        const customMessage = "Must be a valid response object";
        const schema = discriminatedUnion(
          "type",
          [
            object({ type: literal("success"), data: string() }),
          ],
          customMessage
        );
        const result = parse(schema, "not an object");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });
    });

    describe("default message fallback", () => {
      it("[🎯] should use default message when no custom message provided", () => {
        const schema = string();
        const result = parse(schema, 123);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
        }
      });

      it("[🎯] should use default constraint message when no custom message provided", () => {
        const schema = string().minLength(5);
        const result = parse(schema, "hi");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.minLength(5));
        }
      });

      it("[🎯] should use default union message when no custom message provided", () => {
        const schema = unionOf(string(), number());
        const result = parse(schema, true);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.union);
        }
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  describe("parameterized message functions", () => {
    itProp.prop([fc.integer({ min: 0, max: 10000 })])(
      "[🎲] should format minLength message with any non-negative integer",
      (n) => {
        const message = ERROR_MESSAGES_COMPOSITION.minLength(n);
        expect(typeof message).toBe("string");
        expect(message).toContain(String(n));
        expect(message).toContain("at least");
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 10000 })])(
      "[🎲] should format maxLength message with any non-negative integer",
      (n) => {
        const message = ERROR_MESSAGES_COMPOSITION.maxLength(n);
        expect(typeof message).toBe("string");
        expect(message).toContain(String(n));
        expect(message).toContain("at most");
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 10000 })])(
      "[🎲] should format length message with any non-negative integer",
      (n) => {
        const message = ERROR_MESSAGES_COMPOSITION.length(n);
        expect(typeof message).toBe("string");
        expect(message).toContain(String(n));
        expect(message).toContain("exactly");
      }
    );

    itProp.prop([fc.double({ noNaN: true, min: -1e10, max: 1e10 })])(
      "[🎲] should format min message with any number",
      (n) => {
        const message = ERROR_MESSAGES_COMPOSITION.min(n);
        expect(typeof message).toBe("string");
        expect(message).toContain("at least");
      }
    );

    itProp.prop([fc.double({ noNaN: true, min: -1e10, max: 1e10 })])(
      "[🎲] should format max message with any number",
      (n) => {
        const message = ERROR_MESSAGES_COMPOSITION.max(n);
        expect(typeof message).toBe("string");
        expect(message).toContain("at most");
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should format includes message with any string",
      (s) => {
        const message = ERROR_MESSAGES_COMPOSITION.includes(s);
        expect(typeof message).toBe("string");
        expect(message).toContain("include");
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should format startsWith message with any string",
      (s) => {
        const message = ERROR_MESSAGES_COMPOSITION.startsWith(s);
        expect(typeof message).toBe("string");
        expect(message).toContain("start with");
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should format endsWith message with any string",
      (s) => {
        const message = ERROR_MESSAGES_COMPOSITION.endsWith(s);
        expect(typeof message).toBe("string");
        expect(message).toContain("end with");
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 10000 })])(
      "[🎲] should format arrayMinLength message with any non-negative integer",
      (n) => {
        const message = ERROR_MESSAGES_COMPOSITION.arrayMinLength(n);
        expect(typeof message).toBe("string");
        expect(message).toContain(String(n));
        expect(message).toContain("at least");
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 10000 })])(
      "[🎲] should format arrayMaxLength message with any non-negative integer",
      (n) => {
        const message = ERROR_MESSAGES_COMPOSITION.arrayMaxLength(n);
        expect(typeof message).toBe("string");
        expect(message).toContain(String(n));
        expect(message).toContain("at most");
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 10000 }), fc.integer({ min: 0, max: 10000 })])(
      "[🎲] should format tupleLength message with expected and actual lengths",
      (expected, actual) => {
        const message = ERROR_MESSAGES_COMPOSITION.tupleLength(expected, actual);
        expect(typeof message).toBe("string");
        expect(message).toContain(String(expected));
        expect(message).toContain(String(actual));
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should format missingField message with any field name",
      (field) => {
        const message = ERROR_MESSAGES_COMPOSITION.missingField(field);
        expect(typeof message).toBe("string");
        expect(message).toContain(field);
        expect(message).toContain("Missing");
      }
    );

    itProp.prop([fc.string(), fc.string()])(
      "[🎲] should format propertyError message with field and error",
      (field, error) => {
        const message = ERROR_MESSAGES_COMPOSITION.propertyError(field, error);
        expect(typeof message).toBe("string");
        expect(message).toContain(field);
        expect(message).toContain(error);
      }
    );
  });
});
