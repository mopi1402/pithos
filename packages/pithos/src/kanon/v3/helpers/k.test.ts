import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { k, Infer, Schema, GenericSchema } from "./k";
import { unionOf } from "@kanon/v3/schemas/operators/union";
import { parse } from "@kanon/v3/core/parser";

describe("k namespace", () => {
  describe("exports all expected functions", () => {
    it("should export primitives", () => {
      expect(typeof k.string).toBe("function");
      expect(typeof k.number).toBe("function");
      expect(typeof k.boolean).toBe("function");
      expect(typeof k.date).toBe("function");
      expect(typeof k.bigint).toBe("function");
      expect(typeof k.symbol).toBe("function");
      expect(typeof k.int).toBe("function");
      expect(typeof k.null).toBe("function");
      expect(typeof k.undefined).toBe("function");
      expect(typeof k.void).toBe("function");
      expect(typeof k.never).toBe("function");
      expect(typeof k.any).toBe("function");
      expect(typeof k.unknown).toBe("function");
      expect(typeof k.literal).toBe("function");
      expect(typeof k.enum).toBe("function");
      expect(typeof k.numberEnum).toBe("function");
      expect(typeof k.booleanEnum).toBe("function");
      expect(typeof k.mixedEnum).toBe("function");
      expect(typeof k.nativeEnum).toBe("function");
    });

    it("should export composites", () => {
      expect(typeof k.object).toBe("function");
      expect(typeof k.strictObject).toBe("function");
      expect(typeof k.looseObject).toBe("function");
      expect(typeof k.array).toBe("function");
      expect(typeof k.tuple).toBe("function");
      expect(typeof k.tupleOf).toBe("function");
      expect(typeof k.tupleOf3).toBe("function");
      expect(typeof k.tupleOf4).toBe("function");
      expect(typeof k.tupleWithRest).toBe("function");
      expect(typeof k.record).toBe("function");
      expect(typeof k.map).toBe("function");
      expect(typeof k.set).toBe("function");
    });

    it("should export operators", () => {
      expect(typeof k.union).toBe("function");
      expect(typeof k.unionOf).toBe("function");
      expect(typeof k.unionOf3).toBe("function");
      expect(typeof k.unionOf4).toBe("function");
      expect(typeof k.intersection).toBe("function");
      expect(typeof k.intersection3).toBe("function");
    });

    it("should export transforms", () => {
      expect(typeof k.partial).toBe("function");
      expect(typeof k.required).toBe("function");
      expect(typeof k.pick).toBe("function");
      expect(typeof k.omit).toBe("function");
      expect(typeof k.keyof).toBe("function");
    });

    it("should export wrappers", () => {
      expect(typeof k.optional).toBe("function");
      expect(typeof k.nullable).toBe("function");
      expect(typeof k.default).toBe("function");
      expect(typeof k.readonly).toBe("function");
      expect(typeof k.lazy).toBe("function");
    });

    it("should export coerce namespace", () => {
      expect(typeof k.coerce).toBe("object");
      expect(typeof k.coerce.string).toBe("function");
      expect(typeof k.coerce.number).toBe("function");
      expect(typeof k.coerce.boolean).toBe("function");
      expect(typeof k.coerce.date).toBe("function");
      expect(typeof k.coerce.bigint).toBe("function");
    });

    it("should export core functions", () => {
      expect(typeof k.parse).toBe("function");
      expect(typeof k.parseBulk).toBe("function");
    });
  });

  describe("basic usage", () => {
    it("should create and parse a simple schema", () => {
      const schema = k.string();
      const result = k.parse(schema, "hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should work with object schemas", () => {
      const userSchema = k.object({
        name: k.string(),
        age: k.number(),
      });

      const result = k.parse(userSchema, { name: "John", age: 30 });
      expect(result.success).toBe(true);
    });

    it("should work with constraints", () => {
      const schema = k.string().minLength(3).email();
      const result = k.parse(schema, "test@example.com");
      expect(result.success).toBe(true);
    });

    it("should work with coerce", () => {
      const schema = k.coerce.number();
      const result = k.parse(schema, "42");
      expect(result.success).toBe(true);
    });

    it("should work with union", () => {
      const schema = k.union(k.string(), k.number());
      expect(k.parse(schema, "hello").success).toBe(true);
      expect(k.parse(schema, 42).success).toBe(true);
      expect(k.parse(schema, true).success).toBe(false);
    });

    it("should work with optional", () => {
      const schema = k.optional(k.string());
      expect(k.parse(schema, "hello").success).toBe(true);
      expect(k.parse(schema, undefined).success).toBe(true);
      expect(k.parse(schema, 42).success).toBe(false);
    });

    it("should work with nullable", () => {
      const schema = k.nullable(k.string());
      expect(k.parse(schema, "hello").success).toBe(true);
      expect(k.parse(schema, null).success).toBe(true);
      expect(k.parse(schema, 42).success).toBe(false);
    });
  });

  describe("type exports", () => {
    it("should export Infer type", () => {
      const schema = k.object({
        name: k.string(),
        age: k.number(),
      });

      type User = Infer<typeof schema>;

      const user: User = { name: "John", age: 30 };
      const result = k.parse(schema, user);
      expect(result.success).toBe(true);
      expect(user.name).toBe("John");
      expect(user.age).toBe(30);
    });

    it("should export Schema type", () => {
      const schema: Schema<string> = k.string();
      expect(schema.type).toBe("string");
    });

    it("should export GenericSchema type", () => {
      const schema: GenericSchema = k.string();
      expect(schema.type).toBe("string");
    });
  });
});


describe("[🎯] Specification Tests", () => {
  describe("k.string() returns StringConstraint", () => {
    it("[🎯] should return a StringConstraint with type 'string' (Requirement 26.1)", () => {
      const schema = k.string();
      expect(schema.type).toBe("string");
    });

    it("[🎯] should return a schema with constraint methods like minLength (Requirement 26.1)", () => {
      const schema = k.string();
      expect(typeof schema.minLength).toBe("function");
      expect(typeof schema.maxLength).toBe("function");
      expect(typeof schema.email).toBe("function");
      expect(typeof schema.pattern).toBe("function");
    });

    it("[🎯] should return a schema that validates strings (Requirement 26.1)", () => {
      const schema = k.string();
      expect(schema.validator("hello")).toBe(true);
      expect(typeof schema.validator(123)).toBe("string"); // error message
    });
  });

  describe("k.parse delegates to core parser", () => {
    it("[🎯] should delegate to core parser and return same result structure (Requirement 26.2)", () => {
      const schema = k.string();
      const kResult = k.parse(schema, "hello");
      const coreResult = parse(schema, "hello");
      
      expect(kResult).toEqual(coreResult);
    });

    it("[🎯] should delegate to core parser for failure cases (Requirement 26.2)", () => {
      const schema = k.string();
      const kResult = k.parse(schema, 123);
      const coreResult = parse(schema, 123);
      
      expect(kResult).toEqual(coreResult);
    });

    it("[🎯] should delegate to core parser for coercion cases (Requirement 26.2)", () => {
      const schema = k.coerce.number();
      const kResult = k.parse(schema, "42");
      const coreResult = parse(schema, "42");
      
      expect(kResult).toEqual(coreResult);
    });
  });

  describe("k.coerce.string returns coerce string schema", () => {
    it("[🎯] should return a schema with type 'string' (Requirement 26.3)", () => {
      const schema = k.coerce.string();
      expect(schema.type).toBe("string");
    });

    it("[🎯] should return a schema that coerces values to string (Requirement 26.3)", () => {
      const schema = k.coerce.string();
      const result = k.parse(schema, 123);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("123");
      }
    });

    it("[🎯] should coerce null to 'null' string (Requirement 26.3)", () => {
      const schema = k.coerce.string();
      const result = k.parse(schema, null);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("null");
      }
    });
  });

  describe("k.union is alias for unionOf", () => {
    it("[🎯] should be the same function reference as unionOf (Requirement 26.4)", () => {
      expect(k.union).toBe(unionOf);
    });

    it("[🎯] should produce identical schema structure as unionOf (Requirement 26.4)", () => {
      const kSchema = k.union(k.string(), k.number());
      const directSchema = unionOf(k.string(), k.number());
      
      expect(kSchema.type).toBe(directSchema.type);
      expect(kSchema.schemas.length).toBe(directSchema.schemas.length);
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  describe("k.string()", () => {
    itProp.prop([fc.string()])("[🎲] should accept any string", (value) => {
      const schema = k.string();
      const result = k.parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    itProp.prop([fc.oneof(fc.integer(), fc.boolean(), fc.constant(null))])(
      "[🎲] should reject non-string values",
      (value) => {
        const schema = k.string();
        expect(k.parse(schema, value).success).toBe(false);
      }
    );
  });

  describe("k.number()", () => {
    itProp.prop([fc.double({ noNaN: true })])("[🎲] should accept any number", (value) => {
      const schema = k.number();
      const result = k.parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    itProp.prop([fc.oneof(fc.string(), fc.boolean())])(
      "[🎲] should reject non-number values",
      (value) => {
        const schema = k.number();
        expect(k.parse(schema, value).success).toBe(false);
      }
    );
  });

  describe("k.boolean()", () => {
    itProp.prop([fc.boolean()])("[🎲] should accept any boolean", (value) => {
      const schema = k.boolean();
      const result = k.parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });
  });

  describe("k.coerce.string()", () => {
    itProp.prop([fc.oneof(fc.string(), fc.integer(), fc.boolean())])(
      "[🎲] should coerce any primitive to string",
      (value) => {
        const schema = k.coerce.string();
        const result = k.parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(typeof result.data).toBe("string");
        }
      }
    );
  });

  describe("k.coerce.number()", () => {
    itProp.prop([fc.stringMatching(/^-?\d+(\.\d+)?$/)])(
      "[🎲] should coerce numeric strings to number",
      (value) => {
        const schema = k.coerce.number();
        const result = k.parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(typeof result.data).toBe("number");
        }
      }
    );
  });

  describe("k.array()", () => {
    itProp.prop([fc.array(fc.string())])("[🎲] should accept any string array", (value) => {
      const schema = k.array(k.string());
      const result = k.parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(value);
      }
    });

    itProp.prop([fc.array(fc.integer())])("[🎲] should accept any number array", (value) => {
      const schema = k.array(k.number());
      const result = k.parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(value);
      }
    });
  });

  describe("k.object()", () => {
    itProp.prop([fc.record({ name: fc.string(), age: fc.integer() })])(
      "[🎲] should accept valid objects",
      (value) => {
        const schema = k.object({ name: k.string(), age: k.number() });
        const result = k.parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(value);
        }
      }
    );
  });

  describe("k.optional()", () => {
    itProp.prop([fc.oneof(fc.string(), fc.constant(undefined))])(
      "[🎲] should accept string or undefined",
      (value) => {
        const schema = k.optional(k.string());
        const result = k.parse(schema, value);
        expect(result.success).toBe(true);
      }
    );
  });

  describe("k.nullable()", () => {
    itProp.prop([fc.oneof(fc.string(), fc.constant(null))])(
      "[🎲] should accept string or null",
      (value) => {
        const schema = k.nullable(k.string());
        const result = k.parse(schema, value);
        expect(result.success).toBe(true);
      }
    );
  });

  describe("k.union()", () => {
    itProp.prop([fc.oneof(fc.string(), fc.integer())])(
      "[🎲] should accept string or number",
      (value) => {
        const schema = k.union(k.string(), k.number());
        const result = k.parse(schema, value);
        expect(result.success).toBe(true);
      }
    );
  });
});
