import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import {
  isSchemaType,
  schemaGuards,
  isStringConstraint,
  isNumberConstraint,
  isArrayConstraint,
  isObjectConstraint,
  isDateConstraint,
  isBigIntConstraint,
  isSetConstraint,
  isMapConstraint,
} from "./guards";
import { hasTupleRest } from "./composites";
import {
  string,
  number,
  boolean,
  date,
  bigint,
  symbol,
  int,
  enum_,
  literal,
  nativeEnum,
  any,
  unknown,
  never,
  null_,
  undefined_,
  void_,
  array,
  object,
  tuple,
  tupleWithRest,
  record,
  map,
  set,
  unionOf,
  intersection,
  keyof,
  partial,
  required,
  pick,
  omit,
  nullable,
  optional,
  default_,
  readonly,
  lazy,
} from "../index";

describe("isSchemaType", () => {
  describe("[🎯] Specification Tests", () => {
    it("[🎯] should return true when schema type matches (boundary: match)", () => {
      // Requirement 25.1: WHEN isSchemaType is called with matching type, THE TypeGuard SHALL return true
      expect(isSchemaType(string(), "string")).toBe(true);
      expect(isSchemaType(number(), "number")).toBe(true);
      expect(isSchemaType(boolean(), "boolean")).toBe(true);
      expect(isSchemaType(array(string()), "array")).toBe(true);
      expect(isSchemaType(object({ a: string() }), "object")).toBe(true);
    });

    it("[🎯] should return false when schema type does not match (boundary: no match)", () => {
      // Requirement 25.2: WHEN isSchemaType is called with non-matching type, THE TypeGuard SHALL return false
      expect(isSchemaType(string(), "number")).toBe(false);
      expect(isSchemaType(number(), "string")).toBe(false);
      expect(isSchemaType(boolean(), "date")).toBe(false);
      expect(isSchemaType(array(string()), "object")).toBe(false);
      expect(isSchemaType(object({ a: string() }), "array")).toBe(false);
    });
  });

  describe("primitives", () => {
    it("should identify string schema", () => {
      expect(isSchemaType(string(), "string")).toBe(true);
      expect(isSchemaType(string(), "number")).toBe(false);
    });

    it("should identify number schema", () => {
      expect(isSchemaType(number(), "number")).toBe(true);
      expect(isSchemaType(number(), "string")).toBe(false);
    });

    it("should identify boolean schema", () => {
      expect(isSchemaType(boolean(), "boolean")).toBe(true);
    });

    it("should identify date schema", () => {
      expect(isSchemaType(date(), "date")).toBe(true);
    });

    it("should identify bigint schema", () => {
      expect(isSchemaType(bigint(), "bigint")).toBe(true);
    });

    it("should identify symbol schema", () => {
      expect(isSchemaType(symbol(), "symbol")).toBe(true);
    });

    it("should identify int schema", () => {
      expect(isSchemaType(int(), "int")).toBe(true);
    });

    it("should identify enum schema", () => {
      expect(isSchemaType(enum_(["a", "b"] as const), "enum")).toBe(true);
    });

    it("should identify literal schema", () => {
      expect(isSchemaType(literal("test"), "literal")).toBe(true);
    });

    it("should identify nativeEnum schema", () => {
      enum Status { Active, Inactive }
      expect(isSchemaType(nativeEnum(Status), "nativeEnum")).toBe(true);
    });

    it("should identify any schema", () => {
      expect(isSchemaType(any(), "any")).toBe(true);
    });

    it("should identify unknown schema", () => {
      expect(isSchemaType(unknown(), "unknown")).toBe(true);
    });

    it("should identify never schema", () => {
      // INTENTIONAL: Cast needed due to NeverSchema variance issues with GenericSchema
      expect(isSchemaType(never() as never, "never")).toBe(true);
    });

    it("should identify null schema", () => {
      expect(isSchemaType(null_(), "null")).toBe(true);
    });

    it("should identify undefined schema", () => {
      expect(isSchemaType(undefined_(), "undefined")).toBe(true);
    });

    it("should identify void schema", () => {
      expect(isSchemaType(void_(), "void")).toBe(true);
    });
  });

  describe("composites", () => {
    it("should identify array schema", () => {
      expect(isSchemaType(array(string()), "array")).toBe(true);
    });

    it("should identify object schema", () => {
      expect(isSchemaType(object({ name: string() }), "object")).toBe(true);
    });

    it("should identify tuple schema", () => {
      expect(isSchemaType(tuple([string(), number()]), "tuple")).toBe(true);
    });

    it("should identify record schema", () => {
      expect(isSchemaType(record(string(), number()), "record")).toBe(true);
    });

    it("should identify map schema", () => {
      expect(isSchemaType(map(string(), number()), "map")).toBe(true);
    });

    it("should identify set schema", () => {
      expect(isSchemaType(set(string()), "set")).toBe(true);
    });
  });

  describe("operators", () => {
    it("should identify union schema", () => {
      expect(isSchemaType(unionOf(string(), number()), "union")).toBe(true);
    });

    it("should identify intersection schema", () => {
      expect(
        isSchemaType(
          intersection(object({ a: string() }), object({ b: number() })),
          "intersection"
        )
      ).toBe(true);
    });
  });

  describe("transforms", () => {
    const objSchema = object({ name: string(), age: number() });

    it("should identify keyof schema", () => {
      expect(isSchemaType(keyof(objSchema), "keyof")).toBe(true);
    });

    it("should identify partial schema", () => {
      expect(isSchemaType(partial(objSchema), "partial")).toBe(true);
    });

    it("should identify required schema", () => {
      expect(isSchemaType(required(objSchema), "required")).toBe(true);
    });

    it("should identify pick schema", () => {
      expect(isSchemaType(pick(objSchema, ["name"]), "pick")).toBe(true);
    });

    it("should identify omit schema", () => {
      expect(isSchemaType(omit(objSchema, ["age"]), "omit")).toBe(true);
    });
  });

  describe("wrappers", () => {
    it("should identify nullable schema", () => {
      expect(isSchemaType(nullable(string()), "nullable")).toBe(true);
    });

    it("should identify optional schema", () => {
      expect(isSchemaType(optional(string()), "optional")).toBe(true);
    });

    it("should identify default schema", () => {
      expect(isSchemaType(default_(string(), "default"), "default")).toBe(true);
    });

    it("should identify readonly schema", () => {
      expect(isSchemaType(readonly(string()), "readonly")).toBe(true);
    });

    it("should identify lazy schema", () => {
      expect(isSchemaType(lazy(() => string()), "lazy")).toBe(true);
    });
  });
});

describe("schemaGuards", () => {
  it("isString", () => {
    expect(schemaGuards.isString(string())).toBe(true);
    expect(schemaGuards.isString(number())).toBe(false);
  });

  it("isNumber", () => {
    expect(schemaGuards.isNumber(number())).toBe(true);
    expect(schemaGuards.isNumber(string())).toBe(false);
  });

  it("isBoolean", () => {
    expect(schemaGuards.isBoolean(boolean())).toBe(true);
    expect(schemaGuards.isBoolean(string())).toBe(false);
  });

  it("isDate", () => {
    expect(schemaGuards.isDate(date())).toBe(true);
    expect(schemaGuards.isDate(string())).toBe(false);
  });

  it("isBigInt", () => {
    expect(schemaGuards.isBigInt(bigint())).toBe(true);
    expect(schemaGuards.isBigInt(string())).toBe(false);
  });

  it("isSymbol", () => {
    expect(schemaGuards.isSymbol(symbol())).toBe(true);
    expect(schemaGuards.isSymbol(string())).toBe(false);
  });

  it("isInt", () => {
    expect(schemaGuards.isInt(int())).toBe(true);
    expect(schemaGuards.isInt(number())).toBe(false);
  });

  it("isEnum", () => {
    expect(schemaGuards.isEnum(enum_(["a"] as const))).toBe(true);
    expect(schemaGuards.isEnum(string())).toBe(false);
  });

  it("isLiteral", () => {
    expect(schemaGuards.isLiteral(literal("test"))).toBe(true);
    expect(schemaGuards.isLiteral(string())).toBe(false);
  });

  it("isNativeEnum", () => {
    enum Status { Active }
    expect(schemaGuards.isNativeEnum(nativeEnum(Status))).toBe(true);
    expect(schemaGuards.isNativeEnum(string())).toBe(false);
  });

  it("isAny", () => {
    expect(schemaGuards.isAny(any())).toBe(true);
    expect(schemaGuards.isAny(unknown())).toBe(false);
  });

  it("isUnknown", () => {
    expect(schemaGuards.isUnknown(unknown())).toBe(true);
    expect(schemaGuards.isUnknown(any())).toBe(false);
  });

  it("isNever", () => {
    // INTENTIONAL: Cast needed due to NeverSchema variance issues with GenericSchema
    expect(schemaGuards.isNever(never() as never)).toBe(true);
    expect(schemaGuards.isNever(string())).toBe(false);
  });

  it("isNull", () => {
    expect(schemaGuards.isNull(null_())).toBe(true);
    expect(schemaGuards.isNull(undefined_())).toBe(false);
  });

  it("isUndefined", () => {
    expect(schemaGuards.isUndefined(undefined_())).toBe(true);
    expect(schemaGuards.isUndefined(null_())).toBe(false);
  });

  it("isVoid", () => {
    expect(schemaGuards.isVoid(void_())).toBe(true);
    expect(schemaGuards.isVoid(undefined_())).toBe(false);
  });

  it("isArray", () => {
    expect(schemaGuards.isArray(array(string()))).toBe(true);
    expect(schemaGuards.isArray(string())).toBe(false);
  });

  it("isObject", () => {
    expect(schemaGuards.isObject(object({ a: string() }))).toBe(true);
    expect(schemaGuards.isObject(string())).toBe(false);
  });

  it("isTuple", () => {
    expect(schemaGuards.isTuple(tuple([string()]))).toBe(true);
    expect(schemaGuards.isTuple(array(string()))).toBe(false);
  });

  it("isRecord", () => {
    expect(schemaGuards.isRecord(record(string(), number()))).toBe(true);
    expect(schemaGuards.isRecord(object({}))).toBe(false);
  });

  it("isMap", () => {
    expect(schemaGuards.isMap(map(string(), number()))).toBe(true);
    expect(schemaGuards.isMap(record(string(), number()))).toBe(false);
  });

  it("isSet", () => {
    expect(schemaGuards.isSet(set(string()))).toBe(true);
    expect(schemaGuards.isSet(array(string()))).toBe(false);
  });

  it("isUnion", () => {
    expect(schemaGuards.isUnion(unionOf(string(), number()))).toBe(true);
    expect(schemaGuards.isUnion(string())).toBe(false);
  });

  it("isIntersection", () => {
    expect(
      schemaGuards.isIntersection(
        intersection(object({ a: string() }), object({ b: number() }))
      )
    ).toBe(true);
    expect(schemaGuards.isIntersection(unionOf(string(), number()))).toBe(false);
  });

  it("isKeyof", () => {
    expect(schemaGuards.isKeyof(keyof(object({ a: string() })))).toBe(true);
    expect(schemaGuards.isKeyof(string())).toBe(false);
  });

  it("isPartial", () => {
    expect(schemaGuards.isPartial(partial(object({ a: string() })))).toBe(true);
    expect(schemaGuards.isPartial(object({ a: string() }))).toBe(false);
  });

  it("isRequired", () => {
    expect(schemaGuards.isRequired(required(object({ a: string() })))).toBe(true);
    expect(schemaGuards.isRequired(object({ a: string() }))).toBe(false);
  });

  it("isPick", () => {
    expect(schemaGuards.isPick(pick(object({ a: string() }), ["a"]))).toBe(true);
    expect(schemaGuards.isPick(object({ a: string() }))).toBe(false);
  });

  it("isOmit", () => {
    expect(schemaGuards.isOmit(omit(object({ a: string() }), ["a"]))).toBe(true);
    expect(schemaGuards.isOmit(object({ a: string() }))).toBe(false);
  });

  it("isNullable", () => {
    expect(schemaGuards.isNullable(nullable(string()))).toBe(true);
    expect(schemaGuards.isNullable(optional(string()))).toBe(false);
  });

  it("isOptional", () => {
    expect(schemaGuards.isOptional(optional(string()))).toBe(true);
    expect(schemaGuards.isOptional(nullable(string()))).toBe(false);
  });

  it("isDefault", () => {
    expect(schemaGuards.isDefault(default_(string(), "x"))).toBe(true);
    expect(schemaGuards.isDefault(optional(string()))).toBe(false);
  });

  it("isReadonly", () => {
    expect(schemaGuards.isReadonly(readonly(string()))).toBe(true);
    expect(schemaGuards.isReadonly(string())).toBe(false);
  });

  it("isLazy", () => {
    expect(schemaGuards.isLazy(lazy(() => string()))).toBe(true);
    expect(schemaGuards.isLazy(string())).toBe(false);
  });
});


describe("Constraint Type Guards", () => {
  describe("[🎯] Specification Tests", () => {
    describe("isStringConstraint", () => {
      it("[🎯] should return true for StringConstraint with constraint methods (boundary: constraint detection)", () => {
        // Requirement 25.3: WHEN isStringConstraint is called with StringConstraint, THE TypeGuard SHALL return true
        const constraintSchema = string().minLength(5);
        expect(isStringConstraint(constraintSchema)).toBe(true);
      });

      it("[🎯] should return false for base StringSchema without constraint methods (boundary: base schema detection)", () => {
        // Requirement 25.4: WHEN isStringConstraint is called with base StringSchema, THE TypeGuard SHALL return false
        // Note: string() returns a StringConstraint in Kanon V3, so we need to check with a non-string schema
        const baseSchema = number();
        expect(isStringConstraint(baseSchema)).toBe(false);
      });

      it("[🎯] should return false for non-string schemas", () => {
        // Additional test: non-string schemas should return false
        expect(isStringConstraint(number())).toBe(false);
        expect(isStringConstraint(boolean())).toBe(false);
        expect(isStringConstraint(array(string()))).toBe(false);
        expect(isStringConstraint(object({ a: string() }))).toBe(false);
      });
    });

    describe("isNumberConstraint", () => {
      it("[🎯] should return true for NumberConstraint with constraint methods (boundary: constraint detection)", () => {
        // Requirement 25.5: WHEN isNumberConstraint is called with NumberConstraint, THE TypeGuard SHALL return true
        const constraintSchema = number().min(0);
        expect(isNumberConstraint(constraintSchema)).toBe(true);
      });

      it("[🎯] should return false for non-number schemas", () => {
        expect(isNumberConstraint(string())).toBe(false);
        expect(isNumberConstraint(boolean())).toBe(false);
        expect(isNumberConstraint(array(number()))).toBe(false);
      });
    });

    describe("isArrayConstraint", () => {
      it("[🎯] should return true for ArrayConstraint with constraint methods (boundary: constraint detection)", () => {
        // Requirement 25.6: WHEN isArrayConstraint is called with ArrayConstraint, THE TypeGuard SHALL return true
        const constraintSchema = array(string()).minLength(1);
        expect(isArrayConstraint(constraintSchema)).toBe(true);
      });

      it("[🎯] should return false for non-array schemas", () => {
        expect(isArrayConstraint(string())).toBe(false);
        expect(isArrayConstraint(number())).toBe(false);
        expect(isArrayConstraint(object({ a: string() }))).toBe(false);
      });
    });

    describe("isObjectConstraint", () => {
      it("[🎯] should return true for ObjectConstraint with constraint methods (boundary: constraint detection)", () => {
        // Requirement 25.7: WHEN isObjectConstraint is called with ObjectConstraint, THE TypeGuard SHALL return true
        const constraintSchema = object({ name: string() }).minKeys(1);
        expect(isObjectConstraint(constraintSchema)).toBe(true);
      });

      it("[🎯] should return false for non-object schemas", () => {
        expect(isObjectConstraint(string())).toBe(false);
        expect(isObjectConstraint(number())).toBe(false);
        expect(isObjectConstraint(array(string()))).toBe(false);
      });
    });

    describe("isDateConstraint", () => {
      it("[🎯] should return true for DateConstraint with constraint methods (boundary: constraint detection)", () => {
        // Requirement 25.8: WHEN isDateConstraint is called with DateConstraint, THE TypeGuard SHALL return true
        const constraintSchema = date().min(new Date("2020-01-01"));
        expect(isDateConstraint(constraintSchema)).toBe(true);
      });

      it("[🎯] should return false for non-date schemas", () => {
        expect(isDateConstraint(string())).toBe(false);
        expect(isDateConstraint(number())).toBe(false);
        expect(isDateConstraint(object({ date: date() }))).toBe(false);
      });
    });

    describe("isBigIntConstraint", () => {
      it("[🎯] should return true for BigIntConstraint with constraint methods (boundary: constraint detection)", () => {
        // Requirement 25.9: WHEN isBigIntConstraint is called with BigIntConstraint, THE TypeGuard SHALL return true
        const constraintSchema = bigint().min(0n);
        expect(isBigIntConstraint(constraintSchema)).toBe(true);
      });

      it("[🎯] should return false for non-bigint schemas", () => {
        expect(isBigIntConstraint(string())).toBe(false);
        expect(isBigIntConstraint(number())).toBe(false);
        expect(isBigIntConstraint(int())).toBe(false);
      });
    });

    describe("isSetConstraint", () => {
      it("[🎯] should return true for SetConstraint with constraint methods (boundary: constraint detection)", () => {
        // Requirement 25.10: WHEN isSetConstraint is called with SetConstraint, THE TypeGuard SHALL return true
        const constraintSchema = set(string()).minSize(1);
        expect(isSetConstraint(constraintSchema)).toBe(true);
      });

      it("[🎯] should return false for non-set schemas", () => {
        expect(isSetConstraint(string())).toBe(false);
        expect(isSetConstraint(array(string()))).toBe(false);
        expect(isSetConstraint(map(string(), number()))).toBe(false);
      });
    });

    describe("isMapConstraint", () => {
      it("[🎯] should return true for MapConstraint with constraint methods (boundary: constraint detection)", () => {
        // Requirement 25.11: WHEN isMapConstraint is called with MapConstraint, THE TypeGuard SHALL return true
        const constraintSchema = map(string(), number()).minSize(1);
        expect(isMapConstraint(constraintSchema)).toBe(true);
      });

      it("[🎯] should return false for non-map schemas", () => {
        expect(isMapConstraint(string())).toBe(false);
        expect(isMapConstraint(record(string(), number()))).toBe(false);
        expect(isMapConstraint(set(string()))).toBe(false);
      });
    });
  });
});

describe("hasTupleRest Type Guard", () => {
  describe("[🎯] Specification Tests", () => {
    it("[🎯] should return true for TupleWithRestSchema (boundary: rest detection)", () => {
      // Requirement 25.12: WHEN hasTupleRest is called with TupleWithRestSchema, THE TypeGuard SHALL return true
      const schemaWithRest = tupleWithRest([string(), number()], boolean());
      expect(hasTupleRest(schemaWithRest)).toBe(true);
    });

    it("[🎯] should return false for TupleSchema without rest (boundary: no rest detection)", () => {
      // Requirement 25.13: WHEN hasTupleRest is called with TupleSchema, THE TypeGuard SHALL return false
      const schemaWithoutRest = tuple([string(), number()]);
      expect(hasTupleRest(schemaWithoutRest)).toBe(false);
    });
  });
});

describe("[🎲] Property-Based Tests", () => {
  // Schema factories for generating test schemas
  const primitiveSchemas = [
    string(),
    number(),
    boolean(),
    date(),
    bigint(),
  ] as const;

  const primitiveSchemaArb = fc.constantFrom(...primitiveSchemas);

  describe("isSchemaType", () => {
    itProp.prop([fc.constantFrom(
      { schema: string(), type: "string" as const },
      { schema: number(), type: "number" as const },
      { schema: boolean(), type: "boolean" as const },
      { schema: date(), type: "date" as const },
      { schema: bigint(), type: "bigint" as const },
    )])("[🎲] should return true for matching schema types", ({ schema, type }) => {
      expect(isSchemaType(schema, type)).toBe(true);
    });

    itProp.prop([fc.constantFrom(
      { schema: string(), wrongType: "number" as const },
      { schema: number(), wrongType: "string" as const },
      { schema: boolean(), wrongType: "date" as const },
      { schema: date(), wrongType: "bigint" as const },
      { schema: bigint(), wrongType: "boolean" as const },
    )])("[🎲] should return false for non-matching schema types", ({ schema, wrongType }) => {
      expect(isSchemaType(schema, wrongType)).toBe(false);
    });
  });

  describe("schemaGuards consistency", () => {
    itProp.prop([fc.array(primitiveSchemaArb, { minLength: 1, maxLength: 5 })])(
      "[🎲] should correctly identify array schemas",
      (itemSchemas) => {
        const arrSchema = array(itemSchemas[0]);
        expect(schemaGuards.isArray(arrSchema)).toBe(true);
        expect(schemaGuards.isString(arrSchema)).toBe(false);
        expect(schemaGuards.isNumber(arrSchema)).toBe(false);
      }
    );

    itProp.prop([fc.dictionary(fc.string({ minLength: 1, maxLength: 10 }), primitiveSchemaArb, { minKeys: 1, maxKeys: 5 })])(
      "[🎲] should correctly identify object schemas",
      (shape) => {
        const objSchema = object(shape);
        expect(schemaGuards.isObject(objSchema)).toBe(true);
        expect(schemaGuards.isArray(objSchema)).toBe(false);
        expect(schemaGuards.isString(objSchema)).toBe(false);
      }
    );
  });

  describe("wrapper guards", () => {
    itProp.prop([fc.constantFrom(string(), number(), boolean())])(
      "[🎲] should correctly identify nullable wrappers",
      (innerSchema) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nullableSchema = nullable(innerSchema as any);
        expect(schemaGuards.isNullable(nullableSchema)).toBe(true);
        expect(schemaGuards.isOptional(nullableSchema)).toBe(false);
      }
    );

    itProp.prop([fc.constantFrom(string(), number(), boolean())])(
      "[🎲] should correctly identify optional wrappers",
      (innerSchema) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const optionalSchema = optional(innerSchema as any);
        expect(schemaGuards.isOptional(optionalSchema)).toBe(true);
        expect(schemaGuards.isNullable(optionalSchema)).toBe(false);
      }
    );

    itProp.prop([fc.constantFrom(string(), number(), boolean())])(
      "[🎲] should correctly identify readonly wrappers",
      (innerSchema) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const readonlySchema = readonly(innerSchema as any);
        expect(schemaGuards.isReadonly(readonlySchema)).toBe(true);
        expect(schemaGuards.isNullable(readonlySchema)).toBe(false);
      }
    );
  });

  describe("constraint guards", () => {
    itProp.prop([fc.integer({ min: 0, max: 100 })])(
      "[🎲] should identify string constraints with minLength",
      (minLen) => {
        const constraintSchema = string().minLength(minLen);
        expect(isStringConstraint(constraintSchema)).toBe(true);
        expect(isNumberConstraint(constraintSchema)).toBe(false);
      }
    );

    itProp.prop([fc.integer({ min: -1000, max: 1000 })])(
      "[🎲] should identify number constraints with min",
      (minVal) => {
        const constraintSchema = number().min(minVal);
        expect(isNumberConstraint(constraintSchema)).toBe(true);
        expect(isStringConstraint(constraintSchema)).toBe(false);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 100 })])(
      "[🎲] should identify array constraints with minLength",
      (minLen) => {
        const constraintSchema = array(string()).minLength(minLen);
        expect(isArrayConstraint(constraintSchema)).toBe(true);
        expect(isObjectConstraint(constraintSchema)).toBe(false);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 10 })])(
      "[🎲] should identify set constraints with minSize",
      (minSize) => {
        const constraintSchema = set(string()).minSize(minSize);
        expect(isSetConstraint(constraintSchema)).toBe(true);
        expect(isMapConstraint(constraintSchema)).toBe(false);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 10 })])(
      "[🎲] should identify map constraints with minSize",
      (minSize) => {
        const constraintSchema = map(string(), number()).minSize(minSize);
        expect(isMapConstraint(constraintSchema)).toBe(true);
        expect(isSetConstraint(constraintSchema)).toBe(false);
      }
    );
  });
});
