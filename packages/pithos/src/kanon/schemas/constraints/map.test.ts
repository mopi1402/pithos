import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { map } from "../composites/map";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { unknown } from "../primitives/unknown";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("addMapConstraints", () => {
  describe("minSize", () => {
    it("should accept map with size >= min", () => {
      const schema = map(string(), number()).minSize(2);

      expect(
        parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
          ])
        ).success
      ).toBe(true);
      expect(
        parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ])
        ).success
      ).toBe(true);
    });

    it("should reject map with size < min", () => {
      const schema = map(string(), number()).minSize(2);

      const result = parse(schema, new Map([["a", 1]]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.mapMinSize(2));
      }
    });

    it("should use custom error message", () => {
      const customMessage = "Need at least 2 entries";
      const schema = map(string(), number()).minSize(2, customMessage);

      const result = parse(schema, new Map([["a", 1]]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should handle empty map", () => {
      const schema = map(string(), number()).minSize(1);

      const result = parse(schema, new Map());
      expect(result.success).toBe(false);
    });
  });

  describe("maxSize", () => {
    it("should accept map with size <= max", () => {
      const schema = map(string(), number()).maxSize(3);

      expect(parse(schema, new Map([["a", 1]])).success).toBe(true);
      expect(
        parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ])
        ).success
      ).toBe(true);
    });

    it("should reject map with size > max", () => {
      const schema = map(string(), number()).maxSize(2);

      const result = parse(
        schema,
        new Map([
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ])
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.mapMaxSize(2));
      }
    });

    it("should use custom error message", () => {
      const customMessage = "Too many entries";
      const schema = map(string(), number()).maxSize(2, customMessage);

      const result = parse(
        schema,
        new Map([
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ])
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });
  });

  describe("chaining", () => {
    it("should chain minSize and maxSize", () => {
      const schema = map(string(), number()).minSize(2).maxSize(4);

      expect(parse(schema, new Map([["a", 1]])).success).toBe(false);
      expect(
        parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
          ])
        ).success
      ).toBe(true);
      expect(
        parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
            ["d", 4],
          ])
        ).success
      ).toBe(true);
      expect(
        parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
            ["d", 4],
            ["e", 5],
          ])
        ).success
      ).toBe(false);
    });

    it("should validate key and value types with constraints", () => {
      const schema = map(string(), number()).minSize(1);

      expect(parse(schema, new Map([["valid", 42]])).success).toBe(true);
      expect(parse(schema, new Map([[123, 42]])).success).toBe(false);
      expect(parse(schema, new Map([["valid", "invalid"]])).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("minSize/maxSize boundary conditions", () => {
      it("[🎯] should accept empty map when minSize(0) - boundary: exact limit", () => {
        const schema = map(unknown(), unknown()).minSize(0);

        const result = parse(schema, new Map());
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(0);
        }
      });

      it("[🎯] should only accept empty map when maxSize(0) - boundary: exact limit", () => {
        const schema = map(unknown(), unknown()).maxSize(0);

        // Empty map should be accepted
        const emptyResult = parse(schema, new Map());
        expect(emptyResult.success).toBe(true);
        if (emptyResult.success) {
          expect(emptyResult.data.size).toBe(0);
        }

        // Non-empty map should be rejected
        const nonEmptyResult = parse(schema, new Map([["a", 1]]));
        expect(nonEmptyResult.success).toBe(false);
        if (!nonEmptyResult.success) {
          expect(nonEmptyResult.error).toBe(
            ERROR_MESSAGES_COMPOSITION.mapMaxSize(0)
          );
        }
      });

      it("[🎯] should accept map with exactly n entries when minSize(n) - boundary: exact limit", () => {
        const n = 3;
        const schema = map(unknown(), unknown()).minSize(n);

        const result = parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ])
        );
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(n);
        }
      });

      it("[🎯] should reject map with n-1 entries when minSize(n) - boundary: just below", () => {
        const n = 3;
        const schema = map(unknown(), unknown()).minSize(n);

        const result = parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
          ])
        ); // n-1 = 2 entries
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.mapMinSize(n));
        }
      });

      it("[🎯] should accept map with exactly n entries when maxSize(n) - boundary: exact limit", () => {
        const n = 3;
        const schema = map(unknown(), unknown()).maxSize(n);

        const result = parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ])
        );
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(n);
        }
      });

      it("[🎯] should reject map with n+1 entries when maxSize(n) - boundary: just above", () => {
        const n = 3;
        const schema = map(unknown(), unknown()).maxSize(n);

        const result = parse(
          schema,
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
            ["d", 4],
          ])
        ); // n+1 = 4 entries
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.mapMaxSize(n));
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer())), fc.nat()])(
      "[🎲] minSize accepts maps with size >= min",
      (entries, min) => {
        const value = new Map(entries);
        const adjustedMin = Math.min(min, value.size);
        const schema = map(string(), number()).minSize(adjustedMin);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer())), fc.nat()])(
      "[🎲] maxSize accepts maps with size <= max",
      (entries, extra) => {
        const value = new Map(entries);
        const max = value.size + extra;
        const schema = map(string(), number()).maxSize(max);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer()))])(
      "[🎲] does not mutate original Map",
      (entries) => {
        const value = new Map(entries);
        const originalSize = value.size;
        const schema = map(string(), number()).minSize(0);
        parse(schema, value);
        expect(value.size).toBe(originalSize);
      }
    );
  });
});
