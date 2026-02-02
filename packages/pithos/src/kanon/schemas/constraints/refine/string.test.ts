import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { refineString } from "./string";
import { string } from "../../primitives/string";
import { parse } from "../../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";
import type { StringSchema } from "@kanon/types/primitives";
import type { StringConstraint } from "@kanon/types/constraints";

// AI_OK : Code Review by Claude Opus 4.5, 2025-12-06
describe("refineString", () => {
  describe("[🎯] Specification Tests", () => {
    describe("first refinement creation (Requirement 21.1)", () => {
      it("[🎯] should create a new refinements array when schema has no refinements", () => {
        const baseSchema = string();
        expect(baseSchema.refinements).toBeUndefined();

        const refinedSchema = refineString(baseSchema, () => true);
        expect(refinedSchema.refinements).toBeDefined();
        expect(refinedSchema.refinements).toHaveLength(1);
      });
    });

    describe("chained refinements (Requirement 21.2)", () => {
      it("[🎯] should append to existing refinements array when schema has refinements", () => {
        const baseSchema = string();
        const firstRefined = refineString(baseSchema, () => true);
        expect(firstRefined.refinements).toHaveLength(1);

        const secondRefined = refineString(firstRefined, () => true);
        expect(secondRefined.refinements).toHaveLength(2);

        const thirdRefined = refineString(secondRefined, () => true);
        expect(thirdRefined.refinements).toHaveLength(3);
      });
    });

    describe("refinement short-circuit (Requirements 21.3, 21.4)", () => {
      it("[🎯] should stop at first failing refinement and return its error message", () => {
        // Track which refinements were called
        const callOrder: number[] = [];

        let schema: StringSchema | StringConstraint = string();
        schema = refineString(schema, () => {
          callOrder.push(1);
          return "First refinement failed";
        });
        schema = refineString(schema, () => {
          callOrder.push(2);
          return "Second refinement failed";
        });
        schema = refineString(schema, () => {
          callOrder.push(3);
          return "Third refinement failed";
        });

        const result = parse(schema, "test");

        // Should only call the first refinement
        expect(callOrder).toEqual([1]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("First refinement failed");
        }
      });

      it("[🎯] should stop at second refinement when first passes but second fails", () => {
        const callOrder: number[] = [];

        let schema: StringSchema | StringConstraint = string();
        schema = refineString(schema, () => {
          callOrder.push(1);
          return true;
        });
        schema = refineString(schema, () => {
          callOrder.push(2);
          return "Second refinement failed";
        });
        schema = refineString(schema, () => {
          callOrder.push(3);
          return "Third refinement failed";
        });

        const result = parse(schema, "test");

        // Should call first and second refinements only
        expect(callOrder).toEqual([1, 2]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("Second refinement failed");
        }
      });

      it("[🎯] should execute all refinements in order when all pass and return true", () => {
        const callOrder: number[] = [];

        let schema: StringSchema | StringConstraint = string();
        schema = refineString(schema, () => {
          callOrder.push(1);
          return true;
        });
        schema = refineString(schema, () => {
          callOrder.push(2);
          return true;
        });
        schema = refineString(schema, () => {
          callOrder.push(3);
          return true;
        });

        const result = parse(schema, "test");

        // Should call all refinements in order
        expect(callOrder).toEqual([1, 2, 3]);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe("test");
        }
      });
    });
  });

  describe("validation", () => {
    it("should accept valid string that passes refinement", () => {
      const schema = refineString(string(), (value) => {
        if (value.length > 5) return true;
        return "String must be longer than 5 characters";
      });

      expect(parse(schema, "long string").success).toBe(true);
      expect(parse(schema, "very long string").success).toBe(true);
    });

    it("should reject valid string that fails refinement", () => {
      const schema = refineString(string(), (value) => {
        if (value.length > 5) return true;
        return "String must be longer than 5 characters";
      });

      const result = parse(schema, "short");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("String must be longer than 5 characters");
      }
    });

    it("should reject non-string values", () => {
      const schema = refineString(string(), () => true);

      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should return correct error message for non-string values", () => {
      const schema = refineString(string(), () => true);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should use custom error message from base schema for non-string values", () => {
      const customMessage = "Must be a string";
      const schema = refineString(string(customMessage), () => true);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should chain multiple refinements", () => {
      const schema1 = refineString(string(), (value) => {
        if (value.length > 3) return true;
        return "Too short";
      });

      const schema2 = refineString(schema1, (value) => {
        if (value.includes("@")) return true;
        return "Must contain @";
      });

      expect(parse(schema2, "test@example").success).toBe(true);
      expect(parse(schema2, "test").success).toBe(false);
      expect(parse(schema2, "@").success).toBe(false);
    });

    it("should return first failing refinement error", () => {
      const schema1 = refineString(string(), (value) => {
        if (value.length > 3) return true;
        return "First error";
      });

      const schema2 = refineString(schema1, (value) => {
        if (value.includes("@")) return true;
        return "Second error";
      });

      const result = parse(schema2, "ab");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("First error");
      }
    });

    it("should return second refinement error if first passes", () => {
      const schema1 = refineString(string(), (value) => {
        if (value.length > 3) return true;
        return "First error";
      });

      const schema2 = refineString(schema1, (value) => {
        if (value.includes("@")) return true;
        return "Second error";
      });

      const result = parse(schema2, "test");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Second error");
      }
    });

    it("should preserve base schema message when refinement passes", () => {
      const customMessage = "Custom base message";
      const schema = refineString(string(customMessage), () => true);

      const result = parse(schema, "valid");
      expect(result.success).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const schema = refineString(string(), (value) => {
        if (value.length === 0) return "Empty string not allowed";
        return true;
      });

      const result = parse(schema, "");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Empty string not allowed");
      }
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(10000);
      const schema = refineString(string(), (value) => {
        if (value.length > 1000) return true;
        return "Too short";
      });

      expect(parse(schema, longString).success).toBe(true);
    });

    it("should handle strings with special characters", () => {
      const schema = refineString(string(), (value) => {
        if (value.includes("特殊字符")) return true;
        return "Must contain special characters";
      });

      expect(parse(schema, "test特殊字符").success).toBe(true);
      expect(parse(schema, "test").success).toBe(false);
    });

    it("should handle unicode strings", () => {
      const schema = refineString(string(), (value) => {
        if (value.includes("émoji")) return true;
        return "Must contain émoji";
      });

      expect(parse(schema, "test émoji").success).toBe(true);
      expect(parse(schema, "test").success).toBe(false);
    });

    it("should handle refinement that always returns true", () => {
      const schema = refineString(string(), () => true);

      expect(parse(schema, "any string").success).toBe(true);
      expect(parse(schema, "").success).toBe(true);
      expect(parse(schema, "123").success).toBe(true);
    });

    it("should handle refinement that always returns error", () => {
      const schema = refineString(string(), () => "Always fails");

      const result = parse(schema, "any string");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Always fails");
      }
    });

    it("should handle multiple chained refinements", () => {
      let schema: StringSchema | StringConstraint = string();
      schema = refineString(schema, (v) => (v.length > 2 ? true : "Error 1"));
      schema = refineString(schema, (v) =>
        v.includes("a") ? true : "Error 2"
      );
      schema = refineString(schema, (v) =>
        v.includes("b") ? true : "Error 3"
      );

      expect(parse(schema, "abc").success).toBe(true);
      expect(parse(schema, "ab").success).toBe(false);
      expect(parse(schema, "ac").success).toBe(false);
      expect(parse(schema, "a").success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = refineString(string(), () => true);

      const result = parse(schema, "test");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("string");
        expect(result.data).toBe("test");
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.string()])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (str) => {
        const schema = refineString(string(), () => true);
        const result1 = parse(schema, str);
        if (result1.success) {
          const result2 = parse(schema, result1.data);
          expect(result2.success).toBe(true);
          if (result2.success) {
            expect(result2.data).toBe(result1.data);
          }
        }
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should not mutate input string",
      (str) => {
        const schema = refineString(string(), () => true);
        const original = str;
        parse(schema, str);
        expect(str).toBe(original);
      }
    );

    itProp.prop([fc.string(), fc.integer({ min: 0, max: 100 })])(
      "[🎲] refinement with length constraint - consistent behavior",
      (str, minLen) => {
        const schema = refineString(string(), (v) =>
          v.length >= minLen ? true : "Too short"
        );
        const result = parse(schema, str);
        expect(result.success).toBe(str.length >= minLen);
      }
    );

    itProp.prop([fc.string({ minLength: 1, maxLength: 10 }), fc.string()])(
      "[🎲] refinement with includes constraint - accepts strings containing substring",
      (needle, prefix) => {
        const schema = refineString(string(), (v) =>
          v.includes(needle) ? true : "Missing substring"
        );
        const haystack = prefix + needle;
        const result = parse(schema, haystack);
        expect(result.success).toBe(true);
      }
    );
  });
});
