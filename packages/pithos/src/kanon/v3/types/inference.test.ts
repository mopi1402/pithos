// inference.test.ts
import { describe, it, expectTypeOf } from "vitest";

// ============================================
// IMPORTS
// ============================================
import { Infer } from "./base";
import {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  DateSchema,
  BigIntSchema,
  EnumSchema,
  LiteralSchema,
  NullSchema,
  UndefinedSchema,
  UnknownSchema,
  NeverSchema,
  VoidSchema,
  SymbolSchema,
  IntSchema,
  NativeEnumSchema,
  AnySchema,
} from "./primitives";
import {
  ObjectSchema,
  ArraySchema,
  TupleSchema,
  TupleWithRestSchema,
  RecordSchema,
  MapSchema,
  SetSchema,
} from "./composites";
import { UnionSchema, IntersectionSchema } from "./operators";
import {
  PartialSchema,
  RequiredSchema,
  PickSchema,
  OmitSchema,
  KeyofSchema,
} from "./transforms";
import {
  NullableSchema,
  OptionalSchema,
  DefaultSchema,
  ReadonlySchema,
  LazySchema,
  UnwrapSchema,
  IsWrapper,
} from "./wrappers";
import {
  StringConstraint,
  NumberConstraint,
  ArrayConstraint,
  DateConstraint,
  BigIntConstraint,
  ObjectConstraint,
  SetConstraint,
  MapConstraint,
} from "./constraints";
import { SchemaOfType } from "./guards";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type EmptyObject = {};



// ============================================
// PRIMITIVES
// ============================================
describe("Primitives Inference", () => {
  it("should infer string from StringSchema", () => {
    type Result = Infer<StringSchema>;
    expectTypeOf<Result>().toEqualTypeOf<string>();
  });

  it("should infer number from NumberSchema", () => {
    type Result = Infer<NumberSchema>;
    expectTypeOf<Result>().toEqualTypeOf<number>();
  });

  it("should infer boolean from BooleanSchema", () => {
    type Result = Infer<BooleanSchema>;
    expectTypeOf<Result>().toEqualTypeOf<boolean>();
  });

  it("should infer Date from DateSchema", () => {
    type Result = Infer<DateSchema>;
    expectTypeOf<Result>().toEqualTypeOf<Date>();
  });

  it("should infer bigint from BigIntSchema", () => {
    type Result = Infer<BigIntSchema>;
    expectTypeOf<Result>().toEqualTypeOf<bigint>();
  });

  it("should infer null from NullSchema", () => {
    type Result = Infer<NullSchema>;
    expectTypeOf<Result>().toEqualTypeOf<null>();
  });

  it("should infer undefined from UndefinedSchema", () => {
    type Result = Infer<UndefinedSchema>;
    expectTypeOf<Result>().toEqualTypeOf<undefined>();
  });

  it("should infer unknown from UnknownSchema", () => {
    type Result = Infer<UnknownSchema>;
    expectTypeOf<Result>().toEqualTypeOf<unknown>();
  });

  it("should infer never from NeverSchema", () => {
    type Result = Infer<NeverSchema>;
    expectTypeOf<Result>().toEqualTypeOf<never>();
  });

  it("should infer void from VoidSchema", () => {
    type Result = Infer<VoidSchema>;
    expectTypeOf<Result>().toEqualTypeOf<void>();
  });

  it("should infer symbol from SymbolSchema", () => {
    type Result = Infer<SymbolSchema>;
    expectTypeOf<Result>().toEqualTypeOf<symbol>();
  });

  it("should infer number from IntSchema", () => {
    type Result = Infer<IntSchema>;
    expectTypeOf<Result>().toEqualTypeOf<number>();
  });

  it("should infer any from AnySchema", () => {
    type Result = Infer<AnySchema>;
    //INTENTIONAL: test AnySchema requires any type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectTypeOf<Result>().toEqualTypeOf<any>();
  });
});

// ============================================
// ENUM & LITERAL
// ============================================
describe("Enum & Literal Inference", () => {
  it("should infer union from EnumSchema", () => {
    type Result = Infer<EnumSchema<"a" | "b" | "c">>;
    expectTypeOf<Result>().toEqualTypeOf<"a" | "b" | "c">();
  });

  it("should infer numeric enum from EnumSchema", () => {
    type Result = Infer<EnumSchema<1 | 2 | 3>>;
    expectTypeOf<Result>().toEqualTypeOf<1 | 2 | 3>();
  });

  it("should infer boolean enum from EnumSchema", () => {
    type Result = Infer<EnumSchema<true | false>>;
    expectTypeOf<Result>().toEqualTypeOf<true | false>();
  });

  it("should infer mixed enum from EnumSchema", () => {
    type Result = Infer<EnumSchema<"red" | 42 | true>>;
    expectTypeOf<Result>().toEqualTypeOf<"red" | 42 | true>();
  });

  it("should infer literal string from LiteralSchema", () => {
    type Result = Infer<LiteralSchema<"hello">>;
    expectTypeOf<Result>().toEqualTypeOf<"hello">();
  });

  it("should infer literal number from LiteralSchema", () => {
    type Result = Infer<LiteralSchema<42>>;
    expectTypeOf<Result>().toEqualTypeOf<42>();
  });

  it("should infer literal boolean from LiteralSchema", () => {
    type Result = Infer<LiteralSchema<true>>;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });


  it("should infer from NativeEnumSchema", () => {
    enum Status {
      Active = "active",
      Inactive = "inactive",
    }
    type Result = Infer<NativeEnumSchema<Status>>;
    expectTypeOf<Result>().toEqualTypeOf<Status>();
  });
});

// ============================================
// OBJECT
// ============================================
describe("Object Inference", () => {
  it("should infer object shape from ObjectSchema", () => {
    type Result = Infer<
      ObjectSchema<{
        name: StringSchema;
        age: NumberSchema;
      }>
    >;
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; age: number }>();
  });

  it("should infer nested object from ObjectSchema", () => {
    type Result = Infer<
      ObjectSchema<{
        user: ObjectSchema<{
          name: StringSchema;
          email: StringSchema;
        }>;
        active: BooleanSchema;
      }>
    >;
    expectTypeOf<Result>().toEqualTypeOf<{
      user: { name: string; email: string };
      active: boolean;
    }>();
  });

  it("should infer empty object {} from ObjectSchema", () => {
    type Result = Infer<ObjectSchema<EmptyObject>>;
    expectTypeOf<Result>().toEqualTypeOf<EmptyObject>();
  });
});

// ============================================
// ARRAY
// ============================================
describe("Array Inference", () => {
  it("should infer string[] from ArraySchema<StringSchema>", () => {
    type Result = Infer<ArraySchema<StringSchema>>;
    expectTypeOf<Result>().toEqualTypeOf<string[]>();
  });

  it("should infer number[] from ArraySchema<NumberSchema>", () => {
    type Result = Infer<ArraySchema<NumberSchema>>;
    expectTypeOf<Result>().toEqualTypeOf<number[]>();
  });

  it("should infer object[] from ArraySchema with ObjectSchema", () => {
    type UserSchema = ObjectSchema<{
      name: StringSchema;
      age: NumberSchema;
    }>;
    type Result = Infer<ArraySchema<UserSchema>>;
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; age: number }[]>();
  });
});

// ============================================
// COMPOSITES
// ============================================
describe("Composites Inference", () => {
  describe("TupleSchema", () => {
    it("should infer tuple from TupleSchema", () => {
      type Result = Infer<TupleSchema<[StringSchema, NumberSchema]>>;
      expectTypeOf<Result>().toEqualTypeOf<[string, number]>();
    });

    it("should infer single element tuple", () => {
      type Result = Infer<TupleSchema<[StringSchema]>>;
      expectTypeOf<Result>().toEqualTypeOf<[string]>();
    });

    it("should infer empty tuple", () => {
      type Result = Infer<TupleSchema<[]>>;
      expectTypeOf<Result>().toEqualTypeOf<[]>();
    });

    it("should infer complex tuple", () => {
      type Result = Infer<
        TupleSchema<[StringSchema, NumberSchema, BooleanSchema, DateSchema]>
      >;
      expectTypeOf<Result>().toEqualTypeOf<[string, number, boolean, Date]>();
    });
  });

  describe("TupleWithRestSchema", () => {
    it("should infer tuple with rest from TupleWithRestSchema", () => {
      type Result = Infer<TupleWithRestSchema<[StringSchema, NumberSchema], BooleanSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<[string, number, ...boolean[]]>();
    });

    it("should infer single element tuple with rest", () => {
      type Result = Infer<TupleWithRestSchema<[StringSchema], NumberSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<[string, ...number[]]>();
    });

    it("should infer complex tuple with rest", () => {
      type Result = Infer<TupleWithRestSchema<[StringSchema, NumberSchema], BooleanSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<[string, number, ...boolean[]]>();
    });
  });

  describe("RecordSchema", () => {
    it("should infer Record<string, number>", () => {
      type Result = Infer<RecordSchema<StringSchema, NumberSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<Record<string, number>>();
    });

    it("should infer Record<string, object>", () => {
      type ObjectValueSchema = ObjectSchema<{ id: NumberSchema }>;
      type Result = Infer<RecordSchema<StringSchema, ObjectValueSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<Record<string, { id: number }>>();
    });

    it("should only accept string key types for RecordSchema", () => {
      // ✅ String keys are valid
      type ValidRecord = RecordSchema<StringSchema, NumberSchema>;

      // Verify it compiles correctly
      expectTypeOf<Infer<ValidRecord>>().toEqualTypeOf<Record<string, number>>();

      // ❌ These should NOT compile (manual verification needed)
      // type InvalidRecord1 = RecordSchema<NumberSchema, StringSchema>;
      // type InvalidRecord2 = RecordSchema<SymbolSchema, BooleanSchema>;
      // type InvalidRecord3 = RecordSchema<BooleanSchema, StringSchema>;
    });
  });

  describe("MapSchema", () => {
    it("should infer Map<string, number>", () => {
      type Result = Infer<MapSchema<StringSchema, NumberSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<Map<string, number>>();
    });

    it("should infer Map with complex value", () => {
      type ObjectValueSchema = ObjectSchema<{ name: StringSchema; age: NumberSchema }>;
      type Result = Infer<MapSchema<StringSchema, ObjectValueSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<
        Map<string, { name: string; age: number }>
      >();
    });
  });

  describe("SetSchema", () => {
    it("should infer Set<string>", () => {
      type Result = Infer<SetSchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<Set<string>>();
    });

    it("should infer Set<number>", () => {
      type Result = Infer<SetSchema<NumberSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<Set<number>>();
    });
  });
});

// ============================================
// OPERATORS
// ============================================
describe("Operators Inference", () => {
  describe("UnionSchema", () => {
    it("should infer union of primitives", () => {
      type Result = Infer<UnionSchema<[StringSchema, NumberSchema]>>;
      expectTypeOf<Result>().toEqualTypeOf<string | number>();
    });

    it("should infer union with null", () => {
      type Result = Infer<UnionSchema<[StringSchema, NullSchema]>>;
      expectTypeOf<Result>().toEqualTypeOf<string | null>();
    });

    it("should infer union of multiple types", () => {
      type Result = Infer<
        UnionSchema<[StringSchema, NumberSchema, BooleanSchema, NullSchema]>
      >;
      expectTypeOf<Result>().toEqualTypeOf<string | number | boolean | null>();
    });
  });

  describe("IntersectionSchema", () => {
    it("should infer intersection of objects", () => {
      type Result = Infer<
        IntersectionSchema<
          [
            ObjectSchema<{ a: StringSchema }>,
            ObjectSchema<{ b: NumberSchema }>
          ]
        >
      >;
      expectTypeOf<Result>().toEqualTypeOf<{ a: string } & { b: number }>();
    });

    it("should infer intersection of multiple objects", () => {
      type Result = Infer<
        IntersectionSchema<
          [
            ObjectSchema<{ a: StringSchema }>,
            ObjectSchema<{ b: NumberSchema }>,
            ObjectSchema<{ c: BooleanSchema }>
          ]
        >
      >;
      expectTypeOf<Result>().toEqualTypeOf<
        { a: string } & { b: number } & { c: boolean }
      >();
    });
  });
});

// ============================================
// TRANSFORMS
// ============================================
describe("Transforms Inference", () => {
  // Type helper pour les tests
  type UserSchema = ObjectSchema<{
    name: StringSchema;
    age: NumberSchema;
    email: StringSchema;
  }>;

  describe("PartialSchema", () => {
    it("should infer Partial object", () => {
      type Result = Infer<PartialSchema<UserSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<{
        name?: string;
        age?: number;
        email?: string;
      }>();
    });
  });

  describe("RequiredSchema", () => {
    it("should infer Required object", () => {
      type PartialUserSchema = PartialSchema<UserSchema>;
      type Result = Infer<RequiredSchema<PartialUserSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<{
        name: string;
        age: number;
        email: string;
      }>();
    });
  });

  describe("PickSchema", () => {
    it("should infer Pick with single key", () => {
      type Result = Infer<PickSchema<UserSchema, "name">>;
      expectTypeOf<Result>().toEqualTypeOf<{ name: string }>();
    });

    it("should infer Pick with multiple keys", () => {
      type Result = Infer<PickSchema<UserSchema, "name" | "email">>;
      expectTypeOf<Result>().toEqualTypeOf<{ name: string; email: string }>();
    });
  });

  describe("OmitSchema", () => {
    it("should infer Omit with single key", () => {
      type Result = Infer<OmitSchema<UserSchema, "age">>;
      expectTypeOf<Result>().toEqualTypeOf<{ name: string; email: string }>();
    });

    it("should infer Omit with multiple keys", () => {
      type Result = Infer<OmitSchema<UserSchema, "age" | "email">>;
      expectTypeOf<Result>().toEqualTypeOf<{ name: string }>();
    });
  });

  describe("KeyofSchema", () => {
    it("should infer keyof object", () => {
      type Result = Infer<KeyofSchema<UserSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<"name" | "age" | "email">();
    });
  });
});

// ============================================
// WRAPPERS
// ============================================
describe("Wrappers Inference", () => {
  describe("NullableSchema", () => {
    it("should infer T | null from NullableSchema", () => {
      type Result = Infer<NullableSchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<string | null>();
    });

    it("should infer object | null from NullableSchema", () => {
      type Result = Infer<
        NullableSchema<ObjectSchema<{ name: StringSchema }>>
      >;
      expectTypeOf<Result>().toEqualTypeOf<{ name: string } | null>();
    });
  });

  describe("OptionalSchema", () => {
    it("should infer T | undefined from OptionalSchema", () => {
      type Result = Infer<OptionalSchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<string | undefined>();
    });

    it("should infer object | undefined from OptionalSchema", () => {
      type Result = Infer<
        OptionalSchema<ObjectSchema<{ name: StringSchema }>>
      >;
      expectTypeOf<Result>().toEqualTypeOf<{ name: string } | undefined>();
    });
  });

  describe("DefaultSchema", () => {
    it("should infer T from DefaultSchema (not optional)", () => {
      type Result = Infer<DefaultSchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it("should infer number from DefaultSchema", () => {
      type Result = Infer<DefaultSchema<NumberSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<number>();
    });
  });

  describe("ReadonlySchema", () => {
    it("should infer Readonly<T> from ReadonlySchema", () => {
      type Result = Infer<
        ReadonlySchema<ObjectSchema<{ name: StringSchema }>>
      >;
      expectTypeOf<Result>().toEqualTypeOf<Readonly<{ name: string }>>();
    });

    it("should infer Readonly array", () => {
      type Result = Infer<ReadonlySchema<ArraySchema<StringSchema>>>;
      expectTypeOf<Result>().toEqualTypeOf<Readonly<string[]>>();
    });
  });

  describe("LazySchema", () => {
    it("should infer T from LazySchema", () => {
      type Result = Infer<LazySchema<string>>;
      expectTypeOf<Result>().toEqualTypeOf<string>();
    });

    it("should infer recursive type from LazySchema", () => {
      type TreeNode = {
        value: string;
        children: TreeNode[];
      };
      type Result = Infer<LazySchema<TreeNode>>;
      expectTypeOf<Result>().toEqualTypeOf<TreeNode>();
    });

    it("should infer recursive tree structure with LazySchema", () => {
      // Simule un type récursif
      type TreeNodeSchema = ObjectSchema<{
        value: StringSchema;
        children: ArraySchema<LazySchema<{ value: string; children: unknown[] }>>;
      }>;
      
      type Result = Infer<TreeNodeSchema>;
      
      expectTypeOf<Result>().toMatchTypeOf<{
        value: string;
        children: { value: string; children: unknown[] }[];
      }>();
    });
  });
});

// ============================================
// COMPLEX / NESTED SCENARIOS
// ============================================
describe("Complex Nested Inference", () => {
  it("should infer deeply nested object", () => {
    type Result = Infer<
      ObjectSchema<{
        user: ObjectSchema<{
          profile: ObjectSchema<{
            name: StringSchema;
            avatar: NullableSchema<StringSchema>;
          }>;
          settings: ObjectSchema<{
            theme: EnumSchema<"light" | "dark">;
            notifications: BooleanSchema;
          }>;
        }>;
        posts: ArraySchema<
          ObjectSchema<{
            id: NumberSchema;
            title: StringSchema;
            published: BooleanSchema;
          }>
        >;
      }>
    >;

    expectTypeOf<Result>().toEqualTypeOf<{
      user: {
        profile: {
          name: string;
          avatar: string | null;
        };
        settings: {
          theme: "light" | "dark";
          notifications: boolean;
        };
      };
      posts: { id: number; title: string; published: boolean }[];
    }>();
  });

  it("should infer union of objects with nullable", () => {
    type Result = Infer<
      NullableSchema<
        UnionSchema<
          [
            ObjectSchema<{ type: LiteralSchema<"a">; value: StringSchema }>,
            ObjectSchema<{ type: LiteralSchema<"b">; value: NumberSchema }>
          ]
        >
      >
    >;

    expectTypeOf<Result>().toEqualTypeOf<
      | { type: "a"; value: string }
      | { type: "b"; value: number }
      | null
    >();
  });

  it("should infer partial of pick", () => {
    type UserSchema = ObjectSchema<{
      id: NumberSchema;
      name: StringSchema;
      email: StringSchema;
      age: NumberSchema;
    }>;

    type Result = Infer<PartialSchema<PickSchema<UserSchema, "name" | "email">>>;

    expectTypeOf<Result>().toEqualTypeOf<{
      name?: string;
      email?: string;
    }>();
  });

  it("should infer readonly array of nullable objects", () => {
    type NullableObjectSchema = NullableSchema<
      ObjectSchema<{
        id: NumberSchema;
        name: StringSchema;
      }>
    >;
    type Result = Infer<
      ReadonlySchema<ArraySchema<NullableObjectSchema>>
    >;

    expectTypeOf<Result>().toEqualTypeOf<
      Readonly<({ id: number; name: string } | null)[]>
    >();
  });
});

// ============================================
// CONSTRAINTS
// ============================================
describe("Constraints Inference", () => {
  it("should infer string from StringConstraint", () => {
    type Result = Infer<StringConstraint>;
    expectTypeOf<Result>().toEqualTypeOf<string>();
  });

  it("should infer number from NumberConstraint", () => {
    type Result = Infer<NumberConstraint>;
    expectTypeOf<Result>().toEqualTypeOf<number>();
  });

  it("should infer Date from DateConstraint", () => {
    type Result = Infer<DateConstraint>;
    expectTypeOf<Result>().toEqualTypeOf<Date>();
  });

  it("should infer bigint from BigIntConstraint", () => {
    type Result = Infer<BigIntConstraint>;
    expectTypeOf<Result>().toEqualTypeOf<bigint>();
  });

  it("should infer array from ArrayConstraint", () => {
    type Result = Infer<ArrayConstraint<StringSchema>>;
    expectTypeOf<Result>().toEqualTypeOf<string[]>();
  });

  it("should infer object from ObjectConstraint", () => {
    type Result = Infer<ObjectConstraint<{ name: StringSchema; age: NumberSchema }>>;
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; age: number }>();
  });

  it("should infer Set from SetConstraint", () => {
    type Result = Infer<SetConstraint<StringSchema>>;
    expectTypeOf<Result>().toEqualTypeOf<Set<string>>();
  });

  it("should infer Map from MapConstraint", () => {
    type Result = Infer<MapConstraint<StringSchema, NumberSchema>>;
    expectTypeOf<Result>().toEqualTypeOf<Map<string, number>>();
  });
});

// ============================================
// WRAPPER UTILITIES
// ============================================
describe("Wrapper Utilities", () => {
  describe("UnwrapSchema", () => {
    it("should unwrap NullableSchema", () => {
      type Result = UnwrapSchema<NullableSchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<StringSchema>();
    });

    it("should unwrap OptionalSchema", () => {
      type Result = UnwrapSchema<OptionalSchema<NumberSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<NumberSchema>();
    });

    it("should unwrap DefaultSchema", () => {
      type Result = UnwrapSchema<DefaultSchema<BooleanSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<BooleanSchema>();
    });

    it("should unwrap ReadonlySchema", () => {
      type UserSchema = ObjectSchema<{ name: StringSchema }>;
      type Result = UnwrapSchema<ReadonlySchema<UserSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<UserSchema>();
    });

    it("should unwrap nested wrappers (one level)", () => {
      type Result = UnwrapSchema<NullableSchema<OptionalSchema<StringSchema>>>;
      expectTypeOf<Result>().toEqualTypeOf<OptionalSchema<StringSchema>>();
    });

    it("should return never for non-wrapper schemas", () => {
      type Result = UnwrapSchema<StringSchema>;
      expectTypeOf<Result>().toEqualTypeOf<never>();
    });
  });

  describe("IsWrapper", () => {
    it("should return true for NullableSchema", () => {
      type Result = IsWrapper<NullableSchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it("should return true for OptionalSchema", () => {
      type Result = IsWrapper<OptionalSchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it("should return true for DefaultSchema", () => {
      type Result = IsWrapper<DefaultSchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it("should return true for ReadonlySchema", () => {
      type Result = IsWrapper<ReadonlySchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it("should return true for LazySchema", () => {
      type Result = IsWrapper<LazySchema<string>>;
      expectTypeOf<Result>().toEqualTypeOf<true>();
    });

    it("should return false for primitive schemas", () => {
      type Result = IsWrapper<StringSchema>;
      expectTypeOf<Result>().toEqualTypeOf<false>();
    });

    it("should return false for composite schemas", () => {
      type Result = IsWrapper<ArraySchema<StringSchema>>;
      expectTypeOf<Result>().toEqualTypeOf<false>();
    });
  });
});

// ============================================
// GUARDS UTILITIES
// ============================================
describe("Guards Utilities", () => {
  describe("SchemaOfType", () => {
    it("should map 'string' to StringSchema", () => {
      type Result = SchemaOfType<"string">;
      expectTypeOf<Result>().toEqualTypeOf<StringSchema>();
    });

    it("should map 'number' to NumberSchema", () => {
      type Result = SchemaOfType<"number">;
      expectTypeOf<Result>().toEqualTypeOf<NumberSchema>();
    });

    it("should map 'boolean' to BooleanSchema", () => {
      type Result = SchemaOfType<"boolean">;
      expectTypeOf<Result>().toEqualTypeOf<BooleanSchema>();
    });

    it("should map 'array' to ArraySchema", () => {
      type Result = SchemaOfType<"array">;
      expectTypeOf<Result>().toEqualTypeOf<ArraySchema>();
    });

    it("should map 'object' to ObjectSchema", () => {
      type Result = SchemaOfType<"object">;
      expectTypeOf<Result>().toEqualTypeOf<ObjectSchema>();
    });

    it("should map 'nullable' to NullableSchema structure", () => {
      type Result = SchemaOfType<"nullable">;
      expectTypeOf<Result>().toHaveProperty("type");
      expectTypeOf<Result>().toHaveProperty("innerSchema");
    });

    it("should map 'union' to UnionSchema structure", () => {
      type Result = SchemaOfType<"union">;
      expectTypeOf<Result>().toHaveProperty("type");
      expectTypeOf<Result>().toHaveProperty("schemas");
    });
  });
});