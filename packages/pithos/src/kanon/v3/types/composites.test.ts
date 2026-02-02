import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { hasTupleRest } from "./composites";
import { tuple, tupleWithRest } from "../schemas/composites/tuple";
import { string, number, boolean } from "../index";

describe("hasTupleRest", () => {
  it("should return false for TupleSchema", () => {
    const schema = tuple([string(), number()]);
    expect(hasTupleRest(schema)).toBe(false);
  });

  it("should return true for TupleWithRestSchema", () => {
    const schema = tupleWithRest([string(), number()], boolean());
    expect(hasTupleRest(schema)).toBe(true);
  });

  it("should return false for empty TupleSchema", () => {
    const schema = tuple([]);
    expect(hasTupleRest(schema)).toBe(false);
  });

  it("should return true for TupleWithRestSchema with empty items", () => {
    const schema = tupleWithRest([], string());
    expect(hasTupleRest(schema)).toBe(true);
  });

  describe("[🎲] Property-Based Tests", () => {
    // Generate random primitive schemas for tuple items
    const primitiveSchemaArb = fc.constantFrom(string(), number(), boolean());

    itProp.prop([fc.array(primitiveSchemaArb, { minLength: 0, maxLength: 5 })])(
      "[🎲] should return false for any TupleSchema regardless of items",
      (items) => {
        const schema = tuple(items);
        expect(hasTupleRest(schema)).toBe(false);
      }
    );

    itProp.prop([fc.array(primitiveSchemaArb, { minLength: 0, maxLength: 5 }), primitiveSchemaArb])(
      "[🎲] should return true for any TupleWithRestSchema regardless of items and rest type",
      (items, restSchema) => {
        const schema = tupleWithRest(items, restSchema);
        expect(hasTupleRest(schema)).toBe(true);
      }
    );
  });
});
