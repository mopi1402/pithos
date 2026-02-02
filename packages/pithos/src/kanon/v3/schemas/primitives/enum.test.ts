import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { enum_, numberEnum, booleanEnum, mixedEnum } from "./enum";
import { parse } from "../../core/parser";

describe("enum_", () => {
  describe("string enum", () => {
    it("should accept values in enum", () => {
      const schema = enum_(["red", "green", "blue"] as const);

      expect(parse(schema, "red").success).toBe(true);
      expect(parse(schema, "green").success).toBe(true);
      expect(parse(schema, "blue").success).toBe(true);
    });

    it("should reject values not in enum", () => {
      const schema = enum_(["red", "green", "blue"] as const);

      expect(parse(schema, "yellow").success).toBe(false);
      expect(parse(schema, "RED").success).toBe(false);
      expect(parse(schema, "red ").success).toBe(false);
      expect(parse(schema, " red").success).toBe(false);
    });

    it("should reject non-string types", () => {
      const schema = enum_(["red", "green", "blue"] as const);

      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should handle single value enum", () => {
      const schema = enum_(["only"] as const);

      expect(parse(schema, "only").success).toBe(true);
      expect(parse(schema, "other").success).toBe(false);
    });

    it("should handle empty string in enum", () => {
      const schema = enum_(["", "value"] as const);

      expect(parse(schema, "").success).toBe(true);
      expect(parse(schema, "value").success).toBe(true);
      expect(parse(schema, " ").success).toBe(false);
    });
  });

  describe("numberEnum", () => {
    it("should accept values in enum", () => {
      const schema = numberEnum([1, 2, 3] as const);

      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, 2).success).toBe(true);
      expect(parse(schema, 3).success).toBe(true);
    });

    it("should reject values not in enum", () => {
      const schema = numberEnum([1, 2, 3] as const);

      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, 4).success).toBe(false);
      expect(parse(schema, -1).success).toBe(false);
    });

    it("should reject non-number types", () => {
      const schema = numberEnum([1, 2, 3] as const);

      expect(parse(schema, "1").success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should handle negative numbers", () => {
      const schema = numberEnum([-1, 0, 1] as const);

      expect(parse(schema, -1).success).toBe(true);
      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, 2).success).toBe(false);
    });

    it("should handle floating point numbers", () => {
      const schema = numberEnum([1.5, 2.5, 3.5] as const);

      expect(parse(schema, 1.5).success).toBe(true);
      expect(parse(schema, 2.5).success).toBe(true);
      expect(parse(schema, 1.6).success).toBe(false);
    });
  });

  describe("booleanEnum", () => {
    it("should accept values in enum", () => {
      const schema = booleanEnum([true, false] as const);

      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, false).success).toBe(true);
    });

    it("should handle single boolean enum", () => {
      const schema = booleanEnum([true] as const);

      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, false).success).toBe(false);
    });

    it("should reject non-boolean types", () => {
      const schema = booleanEnum([true, false] as const);

      expect(parse(schema, "true").success).toBe(false);
      expect(parse(schema, 1).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });
  });

  describe("mixedEnum", () => {
    it("should accept values in mixed enum", () => {
      const schema = mixedEnum(["red", 42, true] as const);

      expect(parse(schema, "red").success).toBe(true);
      expect(parse(schema, 42).success).toBe(true);
      expect(parse(schema, true).success).toBe(true);
    });

    it("should reject values not in mixed enum", () => {
      const schema = mixedEnum(["red", 42, true] as const);

      expect(parse(schema, "blue").success).toBe(false);
      expect(parse(schema, 43).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
    });

    it("should reject types not in mixed enum", () => {
      const schema = mixedEnum(["red", 42, true] as const);

      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });
  });

  describe("error messages", () => {
    it("should return correct error message for invalid values", () => {
      const schema = enum_(["red", "green", "blue"] as const);

      const result = parse(schema, "yellow");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("red");
        expect(result.error).toContain("green");
        expect(result.error).toContain("blue");
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be red, green, or blue";
      const schema = enum_(["red", "green", "blue"] as const, customMessage);

      const result = parse(schema, "yellow");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle case-sensitive string enums", () => {
      const schema = enum_(["Red", "Green", "Blue"] as const);

      expect(parse(schema, "Red").success).toBe(true);
      expect(parse(schema, "red").success).toBe(false);
      expect(parse(schema, "RED").success).toBe(false);
    });

    it("should handle large number enums", () => {
      const schema = numberEnum([100, 200, 300] as const);

      expect(parse(schema, 100).success).toBe(true);
      expect(parse(schema, 200).success).toBe(true);
      expect(parse(schema, 150).success).toBe(false);
    });

    it("should handle NaN in number enum", () => {
      const schema = numberEnum([1, 2, 3] as const);

      expect(parse(schema, Number.NaN).success).toBe(false);
    });

    it("should handle Infinity in number enum", () => {
      const schema = numberEnum([1, 2, Infinity] as const);

      expect(parse(schema, Infinity).success).toBe(true);
      expect(parse(schema, -Infinity).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("enum boundary conditions", () => {
      it("[🎯] should only accept single value when enum_ is called with single value (Req 14.1)", () => {
        const schema = enum_(["only"] as const);

        // Should accept the single value
        expect(parse(schema, "only").success).toBe(true);

        // Should reject any other value
        expect(parse(schema, "other").success).toBe(false);
        expect(parse(schema, "").success).toBe(false);
        expect(parse(schema, "ONLY").success).toBe(false);
      });

      it("[🎯] should accept 0 when numberEnum is called with 0 (Req 14.2)", () => {
        const schema = numberEnum([0] as const);

        // Should accept zero
        expect(parse(schema, 0).success).toBe(true);

        // Should also accept -0 (same as 0 in JavaScript)
        expect(parse(schema, -0).success).toBe(true);

        // Should reject other numbers
        expect(parse(schema, 1).success).toBe(false);
        expect(parse(schema, -1).success).toBe(false);
      });

      it("[🎯] should accept negative numbers when numberEnum is called with negative values (Req 14.3)", () => {
        const schema = numberEnum([-5, -3, -1] as const);

        // Should accept all negative values in enum
        expect(parse(schema, -5).success).toBe(true);
        expect(parse(schema, -3).success).toBe(true);
        expect(parse(schema, -1).success).toBe(true);

        // Should reject values not in enum
        expect(parse(schema, -4).success).toBe(false);
        expect(parse(schema, -2).success).toBe(false);
        expect(parse(schema, 0).success).toBe(false);
        expect(parse(schema, 1).success).toBe(false);
      });

      it("[🎯] should reject false when booleanEnum is called with [true] (Req 14.4)", () => {
        const schema = booleanEnum([true] as const);

        // Should accept true
        expect(parse(schema, true).success).toBe(true);

        // Should reject false
        expect(parse(schema, false).success).toBe(false);

        // Should reject truthy/falsy values that are not booleans
        expect(parse(schema, 1).success).toBe(false);
        expect(parse(schema, 0).success).toBe(false);
        expect(parse(schema, "true").success).toBe(false);
      });
    });

    describe("mixedEnum edge cases", () => {
      it("[🎯] should accept all specified types when mixedEnum is called with mixed types (Req 14.6)", () => {
        const schema = mixedEnum(["hello", 42, true, "world", 0, false] as const);

        // Should accept all string values in enum
        expect(parse(schema, "hello").success).toBe(true);
        expect(parse(schema, "world").success).toBe(true);

        // Should accept all number values in enum
        expect(parse(schema, 42).success).toBe(true);
        expect(parse(schema, 0).success).toBe(true);

        // Should accept all boolean values in enum
        expect(parse(schema, true).success).toBe(true);
        expect(parse(schema, false).success).toBe(true);

        // Should reject values not in enum (even if same type)
        expect(parse(schema, "other").success).toBe(false);
        expect(parse(schema, 43).success).toBe(false);
        expect(parse(schema, 1).success).toBe(false);

        // Should reject null and undefined
        expect(parse(schema, null).success).toBe(false);
        expect(parse(schema, undefined).success).toBe(false);
      });

      it("[🎯] should distinguish between types in mixedEnum (Req 14.6)", () => {
        // Enum with string "1" and number 1
        const schema = mixedEnum(["1", 1] as const);

        // Should accept string "1"
        expect(parse(schema, "1").success).toBe(true);

        // Should accept number 1
        expect(parse(schema, 1).success).toBe(true);

        // Should reject string "2" and number 2
        expect(parse(schema, "2").success).toBe(false);
        expect(parse(schema, 2).success).toBe(false);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.constantFrom("red", "green", "blue")])(
    "[🎲] should accept any value in string enum",
    (value) => {
      const schema = enum_(["red", "green", "blue"] as const);
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.string().filter((s) => !["red", "green", "blue"].includes(s))])(
    "[🎲] should reject any string not in enum",
    (value) => {
      const schema = enum_(["red", "green", "blue"] as const);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.constantFrom(1, 2, 3)])(
    "[🎲] should accept any value in number enum",
    (value) => {
      const schema = numberEnum([1, 2, 3] as const);
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.integer().filter((n) => ![1, 2, 3].includes(n))])(
    "[🎲] should reject any integer not in number enum",
    (value) => {
      const schema = numberEnum([1, 2, 3] as const);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should accept any boolean in boolean enum",
    (value) => {
      const schema = booleanEnum([true, false] as const);
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.constantFrom("hello", 42, true)])(
    "[🎲] should accept any value in mixed enum",
    (value) => {
      const schema = mixedEnum(["hello", 42, true] as const);
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );
});
