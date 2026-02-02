import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { nativeEnum } from "./nativeEnum";
import { parse } from "../../core/parser";

describe("nativeEnum", () => {
  describe("string enum", () => {
    enum StringEnum {
      Red = "red",
      Green = "green",
      Blue = "blue",
    }

    it("should accept valid enum values", () => {
      const schema = nativeEnum(StringEnum);

      expect(parse(schema, StringEnum.Red).success).toBe(true);
      expect(parse(schema, StringEnum.Green).success).toBe(true);
      expect(parse(schema, StringEnum.Blue).success).toBe(true);
      expect(parse(schema, "red").success).toBe(true);
      expect(parse(schema, "green").success).toBe(true);
      expect(parse(schema, "blue").success).toBe(true);
    });

    it("should reject invalid enum values", () => {
      const schema = nativeEnum(StringEnum);

      expect(parse(schema, "yellow").success).toBe(false);
      expect(parse(schema, "RED").success).toBe(false);
      expect(parse(schema, "red ").success).toBe(false);
    });

    it("should reject non-string types", () => {
      const schema = nativeEnum(StringEnum);

      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });
  });

  describe("number enum", () => {
    enum NumberEnum {
      Zero = 0,
      One = 1,
      Two = 2,
    }

    it("should accept valid enum values", () => {
      const schema = nativeEnum(NumberEnum);

      expect(parse(schema, NumberEnum.Zero).success).toBe(true);
      expect(parse(schema, NumberEnum.One).success).toBe(true);
      expect(parse(schema, NumberEnum.Two).success).toBe(true);
      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, 2).success).toBe(true);
    });

    it("should reject invalid enum values", () => {
      const schema = nativeEnum(NumberEnum);

      expect(parse(schema, 3).success).toBe(false);
      expect(parse(schema, -1).success).toBe(false);
      expect(parse(schema, 1.5).success).toBe(false);
    });

    it("should reject non-number types", () => {
      const schema = nativeEnum(NumberEnum);

      expect(parse(schema, "0").success).toBe(false);
      expect(parse(schema, "1").success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });
  });

  describe("mixed enum (string and number)", () => {
    enum MixedEnum {
      A = "a",
      B = 1,
      C = "c",
      D = 2,
    }

    it("should accept valid enum values", () => {
      const schema = nativeEnum(MixedEnum);

      expect(parse(schema, MixedEnum.A).success).toBe(true);
      expect(parse(schema, MixedEnum.B).success).toBe(true);
      expect(parse(schema, MixedEnum.C).success).toBe(true);
      expect(parse(schema, MixedEnum.D).success).toBe(true);
      expect(parse(schema, "a").success).toBe(true);
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, "c").success).toBe(true);
      expect(parse(schema, 2).success).toBe(true);
    });

    it("should reject invalid enum values", () => {
      const schema = nativeEnum(MixedEnum);

      expect(parse(schema, "b").success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, 3).success).toBe(false);
    });
  });

  describe("error messages", () => {
    enum TestEnum {
      A = "a",
      B = "b",
    }

    it("should return correct error message for invalid values", () => {
      const schema = nativeEnum(TestEnum);

      const result = parse(schema, "c");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Expected one of");
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be A or B";
      const schema = nativeEnum(TestEnum, customMessage);

      const result = parse(schema, "c");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle enum with single value", () => {
      enum SingleEnum {
        Only = "only",
      }

      const schema = nativeEnum(SingleEnum);
      expect(parse(schema, "only").success).toBe(true);
      expect(parse(schema, "other").success).toBe(false);
    });

    it("should handle enum with zero", () => {
      enum ZeroEnum {
        Zero = 0,
        One = 1,
      }

      const schema = nativeEnum(ZeroEnum);
      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, -0).success).toBe(true);
    });

    it("should handle enum with negative numbers", () => {
      enum NegativeEnum {
        MinusOne = -1,
        Zero = 0,
        One = 1,
      }

      const schema = nativeEnum(NegativeEnum);
      expect(parse(schema, -1).success).toBe(true);
      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, -2).success).toBe(false);
    });

    it("should filter out reverse mappings for number enums", () => {
      enum NumberEnum {
        Zero = 0,
        One = 1,
      }

      const schema = nativeEnum(NumberEnum);
      // Number enums have reverse mappings (0 -> "Zero", "Zero" -> 0)
      // The validator should only accept the numeric values
      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, "Zero").success).toBe(false);
      expect(parse(schema, "One").success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("nativeEnum edge cases", () => {
      it("[🎯] should filter reverse mappings for numeric enums (Req 14.5)", () => {
        enum NumericEnum {
          First = 0,
          Second = 1,
          Third = 2,
        }

        const schema = nativeEnum(NumericEnum);

        // Should accept numeric values
        expect(parse(schema, 0).success).toBe(true);
        expect(parse(schema, 1).success).toBe(true);
        expect(parse(schema, 2).success).toBe(true);

        // Should reject reverse mapping keys (string names)
        // TypeScript numeric enums create bidirectional mappings:
        // { First: 0, Second: 1, Third: 2, "0": "First", "1": "Second", "2": "Third" }
        expect(parse(schema, "First").success).toBe(false);
        expect(parse(schema, "Second").success).toBe(false);
        expect(parse(schema, "Third").success).toBe(false);

        // Should reject string representations of numbers
        expect(parse(schema, "0").success).toBe(false);
        expect(parse(schema, "1").success).toBe(false);
        expect(parse(schema, "2").success).toBe(false);
      });

      it("[🎯] should not filter reverse mappings for string enums (Req 14.5)", () => {
        enum StringEnum {
          Red = "red",
          Green = "green",
          Blue = "blue",
        }

        const schema = nativeEnum(StringEnum);

        // Should accept string values
        expect(parse(schema, "red").success).toBe(true);
        expect(parse(schema, "green").success).toBe(true);
        expect(parse(schema, "blue").success).toBe(true);

        // String enums don't have reverse mappings, so keys should be rejected
        expect(parse(schema, "Red").success).toBe(false);
        expect(parse(schema, "Green").success).toBe(false);
        expect(parse(schema, "Blue").success).toBe(false);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  enum StringEnum {
    Red = "red",
    Green = "green",
    Blue = "blue",
  }

  enum NumberEnum {
    Zero = 0,
    One = 1,
    Two = 2,
  }

  itProp.prop([fc.constantFrom("red", "green", "blue")])(
    "[🎲] should accept any value in string native enum",
    (value) => {
      const schema = nativeEnum(StringEnum);
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.string().filter((s) => !["red", "green", "blue"].includes(s))])(
    "[🎲] should reject any string not in native enum",
    (value) => {
      const schema = nativeEnum(StringEnum);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.constantFrom(0, 1, 2)])(
    "[🎲] should accept any value in number native enum",
    (value) => {
      const schema = nativeEnum(NumberEnum);
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.integer().filter((n) => ![0, 1, 2].includes(n))])(
    "[🎲] should reject any integer not in number native enum",
    (value) => {
      const schema = nativeEnum(NumberEnum);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
