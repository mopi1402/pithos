import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { refineMap } from "./map";
import { map } from "../../composites/map";
import { string } from "../../primitives/string";
import { number } from "../../primitives/number";
import { coerceBoolean } from "../../coerce/boolean";
import { coerceString } from "../../coerce/string";
import { parse } from "../../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";
import type { MapSchema } from "@kanon/v3/types/composites";
import type { MapConstraint, StringConstraint, NumberConstraint } from "@kanon/v3/types/constraints";

describe("refineMap", () => {
  describe("[🎯] Specification Tests", () => {
    describe("first refinement creation (Requirement 21.11)", () => {
      it("[🎯] should create a new refinements array when schema has no refinements", () => {
        const baseSchema = map(string(), number());
        expect(baseSchema.refinements).toBeUndefined();

        const refinedSchema = refineMap(baseSchema, () => true);
        expect(refinedSchema.refinements).toBeDefined();
        expect(refinedSchema.refinements).toHaveLength(1);
      });
    });
  });

  describe("validation", () => {
    it("should accept valid map that passes refinement", () => {
      const schema = refineMap(map(string(), number()), (value) => {
        if (value.size > 0) return true;
        return "Map must not be empty";
      });

      expect(parse(schema, new Map([["a", 1]])).success).toBe(true);
    });

    it("should reject valid map that fails refinement", () => {
      const schema = refineMap(map(string(), number()), (value) => {
        if (value.size > 2) return true;
        return "Map must have more than 2 entries";
      });

      const result = parse(
        schema,
        new Map([
          ["a", 1],
          ["b", 2],
        ])
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Map must have more than 2 entries");
      }
    });

    it("should reject non-map values", () => {
      const schema = refineMap(map(string(), number()), () => true);

      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, "test").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
    });

    it("should return correct error message for non-map values", () => {
      const schema = refineMap(map(string(), number()), () => true);

      const result = parse(schema, []);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.map);
      }
    });

    it("should validate keys before refinement", () => {
      const schema = refineMap(map(string(), number()), () => true);

      const result = parse(schema, new Map([[123, 456]]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Key:");
      }
    });

    it("should validate values before refinement", () => {
      const schema = refineMap(map(string(), number()), () => true);

      const result = parse(schema, new Map([["key", "not a number"]]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Value:");
      }
    });
  });

  describe("chaining", () => {
    it("should chain multiple refinements", () => {
      const schema1 = refineMap(map(string(), number()), (value) => {
        if (value.size >= 1) return true;
        return "Error 1";
      });

      const schema2 = refineMap(schema1, (value) => {
        if (value.size <= 5) return true;
        return "Error 2";
      });

      expect(parse(schema2, new Map([["a", 1]])).success).toBe(true);
      expect(parse(schema2, new Map()).success).toBe(false);
      expect(
        parse(
          schema2,
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
            ["d", 4],
            ["e", 5],
            ["f", 6],
          ])
        ).success
      ).toBe(false);
    });

    it("should return first failing refinement error", () => {
      const schema1 = refineMap(map(string(), number()), (value) => {
        if (value.size >= 2) return true;
        return "First error";
      });

      const schema2 = refineMap(schema1, () => "Second error");

      const result = parse(schema2, new Map([["a", 1]]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("First error");
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty map", () => {
      const schema = refineMap(map(string(), number()), (value) => {
        if (value.size === 0) return "Empty map not allowed";
        return true;
      });

      const result = parse(schema, new Map());
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Empty map not allowed");
      }
    });

    it("should handle multiple chained refinements", () => {
      let schema: MapSchema<StringConstraint, NumberConstraint> | MapConstraint<StringConstraint, NumberConstraint> = map(string(), number());
      schema = refineMap(schema, (v) => (v.size > 0 ? true : "Error 1"));
      schema = refineMap(schema, (v) => (v.size < 10 ? true : "Error 2"));
      schema = refineMap(schema, (v) => (v.has("test") ? true : "Error 3"));

      expect(parse(schema, new Map([["test", 42]])).success).toBe(true);
      expect(parse(schema, new Map()).success).toBe(false);
      expect(parse(schema, new Map([["other", 42]])).success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = refineMap(map(string(), number()), () => true);
      const testMap = new Map([
        ["a", 1],
        ["b", 2],
      ]);

      const result = parse(schema, testMap);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data instanceof Map).toBe(true);
        expect(result.data).toEqual(testMap);
      }
    });
  });

  describe("coercion", () => {
    it("should coerce map values and apply refinement", () => {
      const schema = refineMap(map(string(), coerceBoolean()), (value) => {
        if (value.size > 0) return true;
        return "Map must not be empty";
      });

      const result = parse(schema, new Map([["a", 1], ["b", 0]]));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("a")).toBe(true);
        expect(result.data.get("b")).toBe(false);
      }
    });

    it("should coerce map keys and apply refinement", () => {
      const schema = refineMap(map(coerceString(), number()), (value) => {
        if (value.has("42")) return true;
        return "Map must have key '42'";
      });

      const result = parse(schema, new Map<unknown, number>([[42, 1]]));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("42")).toBe(1);
      }
    });

    it("should coerce key when coercedMap already exists from value coercion", () => {
      // First entry: valid key, coerced value -> creates coercedMap
      // Second entry: coerced key -> enters isCoerced(keyResult) with coercedMap already existing
      const schema = refineMap(map(coerceString(), coerceBoolean()), () => true);
      const value = new Map<unknown, unknown>([
        ["first", 1],  // key valid, value coerced
        [42, true],    // key coerced, value valid
      ]);

      const result = parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("first")).toBe(true);
        expect(result.data.get("42")).toBe(true);
      }
    });

    it("should coerce key without coercing value", () => {
      // Tests the branch where key is coerced but value is valid
      const schema = refineMap(map(coerceString(), number()), () => true);
      const value = new Map<unknown, number>([[42, 1]]);

      const result = parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("42")).toBe(1);
      }
    });

    it("should return coerced map when refinement passes", () => {
      const schema = refineMap(map(string(), coerceBoolean()), () => true);
      const result = parse(schema, new Map([["a", 1]]));

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("a")).toBe(true);
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer()))])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (entries) => {
        const schema = refineMap(map(string(), number()), () => true);
        const input = new Map(entries);
        const result1 = parse(schema, input);
        if (result1.success) {
          const result2 = parse(schema, result1.data);
          expect(result2.success).toBe(true);
          if (result2.success) {
            expect(result2.data).toEqual(result1.data);
          }
        }
      }
    );

    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer()))])(
      "[🎲] should not mutate input map",
      (entries) => {
        const schema = refineMap(map(string(), number()), () => true);
        const input = new Map(entries);
        const originalSize = input.size;
        const originalEntries = [...input.entries()];
        parse(schema, input);
        expect(input.size).toBe(originalSize);
        expect([...input.entries()]).toEqual(originalEntries);
      }
    );

    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer())), fc.integer({ min: 0, max: 10 })])(
      "[🎲] refinement with size constraint - consistent behavior",
      (entries, minSize) => {
        const schema = refineMap(map(string(), number()), (v) =>
          v.size >= minSize ? true : "Too small"
        );
        const input = new Map(entries);
        const result = parse(schema, input);
        expect(result.success).toBe(input.size >= minSize);
      }
    );

    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer()), { minLength: 1 })])(
      "[🎲] refinement with has constraint - consistent behavior",
      (entries) => {
        const targetKey = entries[0][0];
        const schema = refineMap(map(string(), number()), (v) =>
          v.has(targetKey) ? true : "Missing key"
        );
        const input = new Map(entries);
        const result = parse(schema, input);
        expect(result.success).toBe(true);
      }
    );
  });
});
