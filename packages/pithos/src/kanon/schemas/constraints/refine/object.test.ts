import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { refineObject } from "./object";
import { object } from "../../composites/object";
import { string } from "../../primitives/string";
import { number } from "../../primitives/number";
import { coerceBoolean } from "../../coerce/boolean";
import { coerceNumber } from "../../coerce/number";
import { parse } from "../../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";
import type { ObjectSchema } from "@kanon/types/composites";
import type { ObjectConstraint, StringConstraint } from "@kanon/types/constraints";

// AI_OK : Code Review by Claude Opus 4.5, 2025-12-06
describe("refineObject", () => {
  describe("[🎯] Specification Tests", () => {
    describe("first refinement creation (Requirement 21.9)", () => {
      it("[🎯] should create a new refinements array when schema has no refinements", () => {
        const baseSchema = object({ name: string() });
        expect(baseSchema.refinements).toBeUndefined();

        const refinedSchema = refineObject(baseSchema, () => true);
        expect(refinedSchema.refinements).toBeDefined();
        expect(refinedSchema.refinements).toHaveLength(1);
      });
    });
  });
  describe("validation", () => {
    it("should accept valid object that passes refinement", () => {
      const schema = refineObject(object({ name: string() }), (value) => {
        if (Object.keys(value).length > 0) return true;
        return "Object must have at least one key";
      });

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
    });

    it("should reject valid object that fails refinement", () => {
      const schema = refineObject(object({ name: string() }), (value) => {
        if (Object.keys(value).length > 1) return true;
        return "Object must have more than one key";
      });

      const result = parse(schema, { name: "John" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Object must have more than one key");
      }
    });

    it("should reject non-object values", () => {
      const schema = refineObject(object({ name: string() }), () => true);

      expect(parse(schema, "not object").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
    });

    it("should reject arrays", () => {
      const schema = refineObject(object({ name: string() }), () => true);

      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
    });

    it("should return correct error message for non-object values", () => {
      const schema = refineObject(object({ name: string() }), () => true);

      const result = parse(schema, "not object");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }
    });

    it("should use custom error message from base schema for non-object values", () => {
      const customMessage = "Must be an object";
      const schema = refineObject(
        object({ name: string() }, customMessage),
        () => true
      );

      const result = parse(schema, "not object");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should apply refinement after type validation", () => {
      const schema = refineObject(
        object({ name: string(), age: number() }),
        (value) => {
          if (Object.keys(value).length > 1) return true;
          return "Must have more than one property";
        }
      );

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
      expect(parse(schema, { name: "John" }).success).toBe(false);
    });

    it("should chain multiple refinements", () => {
      const schema1 = refineObject(object({ name: string() }), (value) => {
        if (Object.keys(value).length > 0) return true;
        return "Must not be empty";
      });

      const schema2 = refineObject(schema1, (value) => {
        if (Object.keys(value).length < 10) return true;
        return "Must have less than 10 keys";
      });

      expect(parse(schema2, { name: "John" }).success).toBe(true);
      expect(parse(schema2, {}).success).toBe(false);
    });

    it("should return first failing refinement error", () => {
      const schema1 = refineObject(object({ name: string() }), (value) => {
        if (Object.keys(value).length > 1) return true;
        return "First error";
      });

      const schema2 = refineObject(schema1, (value) => {
        if (Object.keys(value).length < 10) return true;
        return "Second error";
      });

      const result = parse(schema2, { name: "John" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("First error");
      }
    });

    it("should return second refinement error if first passes", () => {
      const schema1 = refineObject(object({ name: string() }), (value) => {
        if (Object.keys(value).length > 0) return true;
        return "First error";
      });

      const schema2 = refineObject(schema1, (value) => {
        if (Object.keys(value).length < 10) return true;
        return "Second error";
      });

      const largeObject: Record<string, unknown> = { name: "John" };
      for (let i = 0; i < 10; i++) {
        largeObject[`key${i}`] = "value";
      }

      const result = parse(schema2, largeObject);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Second error");
      }
    });

    it("should handle empty object", () => {
      const schema = refineObject(object({}), (value) => {
        if (Object.keys(value).length === 0) return "Empty object not allowed";
        return true;
      });

      const result = parse(schema, {});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Empty object not allowed");
      }
    });

    it("should handle object with specific property validation", () => {
      const schema = refineObject(
        object({ name: string(), age: number() }),
        (value) => {
          if ("name" in value && "age" in value) return true;
          return "Must have both name and age";
        }
      );

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
    });

    it("should handle object with nested validation", () => {
      const schema = refineObject(
        object({ name: string(), age: number() }),
        (value) => {
          if (value.age > 18) return true;
          return "Age must be greater than 18";
        }
      );

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
      expect(parse(schema, { name: "John", age: 15 }).success).toBe(false);
    });

    it("should handle refinement that always returns true", () => {
      const schema = refineObject(object({ name: string() }), () => true);

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, { name: "John", extra: "value" }).success).toBe(
        true
      );
    });

    it("should handle refinement that always returns error", () => {
      const schema = refineObject(
        object({ name: string() }),
        () => "Always fails"
      );

      const result = parse(schema, { name: "John" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Always fails");
      }
    });

    it("should handle multiple chained refinements", () => {
      type Entries = { name: StringConstraint };
      let schema: ObjectSchema<Entries> | ObjectConstraint<Entries> = object({ name: string() });
      schema = refineObject(schema, (v) =>
        Object.keys(v).length > 0 ? true : "Error 1"
      );
      schema = refineObject(schema, (v) =>
        Object.keys(v).length < 10 ? true : "Error 2"
      );
      schema = refineObject(schema, (v) => ("name" in v ? true : "Error 3"));

      expect(parse(schema, { name: "John" }).success).toBe(true);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = refineObject(object({ name: string() }), () => true);
      const testObject = { name: "John" };

      const result = parse(schema, testObject);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("object");
        expect(result.data).toEqual(testObject);
      }
    });

    it("should reject object with invalid property values", () => {
      const schema = refineObject(
        object({ name: string(), age: number() }),
        () => true
      );

      expect(parse(schema, { name: 123, age: 30 }).success).toBe(false);
      expect(parse(schema, { name: "John", age: "thirty" }).success).toBe(
        false
      );
    });
  });

  describe("coercion", () => {
    it("should coerce object properties and apply refinement", () => {
      const schema = refineObject(
        object({ active: coerceBoolean(), count: coerceNumber() }),
        (value) => {
          if (value.active && value.count > 0) return true;
          return "Must be active with positive count";
        }
      );

      const result = parse(schema, { active: 1, count: "42" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.active).toBe(true);
        expect(result.data.count).toBe(42);
      }
    });

    it("should coerce first property and copy subsequent valid properties", () => {
      // Tests the branch where coercedObj exists and a valid property is copied
      const schema = refineObject(
        object({ active: coerceBoolean(), name: string() }),
        () => true
      );
      const value = { active: 1, name: "test" }; // active coerced, name valid (copied)

      const result = parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.active).toBe(true);
        expect(result.data.name).toBe("test");
      }
    });

    it("should apply refinement to coerced object", () => {
      const schema = refineObject(
        object({ value: coerceNumber() }),
        (obj) => {
          if (obj.value > 10) return true;
          return "Value must be greater than 10";
        }
      );

      expect(parse(schema, { value: "42" }).success).toBe(true);
      expect(parse(schema, { value: "5" }).success).toBe(false);
    });

    it("should return coerced object when refinement passes", () => {
      const schema = refineObject(
        object({ active: coerceBoolean() }),
        () => true
      );
      const result = parse(schema, { active: 1 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.active).toBe(true);
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.string()])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (name) => {
        const schema = refineObject(object({ name: string() }), () => true);
        const obj = { name };
        const result1 = parse(schema, obj);
        if (result1.success) {
          const result2 = parse(schema, result1.data);
          expect(result2.success).toBe(true);
          if (result2.success) {
            expect(result2.data).toEqual(result1.data);
          }
        }
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should not mutate input object",
      (name) => {
        const schema = refineObject(object({ name: string() }), () => true);
        const obj = { name };
        const originalName = obj.name;
        parse(schema, obj);
        expect(obj.name).toBe(originalName);
      }
    );

    itProp.prop([fc.string(), fc.integer()])(
      "[🎲] refinement with property constraint - consistent behavior",
      (name, age) => {
        const minAge = 18;
        const schema = refineObject(
          object({ name: string(), age: number() }),
          (v) => (v.age >= minAge ? true : "Too young")
        );
        const result = parse(schema, { name, age });
        expect(result.success).toBe(age >= minAge);
      }
    );

    itProp.prop([fc.dictionary(fc.string(), fc.string())])(
      "[🎲] refinement with key count constraint - consistent behavior",
      (obj) => {
        const minKeys = 2;
        const schema = refineObject(object({}), (v) =>
          Object.keys(v).length >= minKeys ? true : "Not enough keys"
        );
        const result = parse(schema, obj);
        expect(result.success).toBe(Object.keys(obj).length >= minKeys);
      }
    );
  });
});
