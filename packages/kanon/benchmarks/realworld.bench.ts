import { describe } from "vitest";
import * as z from "zod";
import * as v from "valibot";
import * as s from "superstruct";
import Validator from "fastest-validator";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { parse as parseV3 } from "@kanon/v3/core/parser.js";
import { string as stringV3 } from "@kanon/v3/schemas/primitives/string";
import { number as numberV3 } from "@kanon/v3/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/v3/schemas/primitives/boolean";
import { object as objectV3 } from "@kanon/v3/schemas/composites/object";
import { array as arrayV3 } from "@kanon/v3/schemas/composites/array";
import { optional as optionalV3 } from "@kanon/v3/schemas/wrappers/optional";
import { nullable as nullableV3 } from "@kanon/v3/schemas/wrappers/nullable";
import { discriminatedUnion as discriminatedUnionV3 } from "@kanon/v3/schemas/operators/union";
import { literal as literalV3 } from "@kanon/v3/schemas/primitives/literal";
import { enum_ as enumV3 } from "@kanon/v3/schemas/primitives/enum";
import { refineObject as refineObjectV3 } from "@kanon/v3/schemas/constraints/refine/object";
import { coerceNumber as coerceNumberV3 } from "@kanon/v3/schemas/coerce/number";
import { coerceBoolean as coerceBooleanV3 } from "@kanon/v3/schemas/coerce/boolean";
import { compile as compileJIT } from "@kanon/v3/jit/compiler";
import { GenericSchema } from "@kanon/v3/types/base";
// Kanon V1 imports
import { PithosString } from "@kanon/v1/schemas/primitives/string";
import { PithosNumber } from "@kanon/v1/schemas/primitives/number";
import { PithosBoolean } from "@kanon/v1/schemas/primitives/boolean";
import { PithosObject } from "@kanon/v1/schemas/composites/object";
import { PithosArray } from "@kanon/v1/schemas/composites/array";
import { PithosUnion } from "@kanon/v1/schemas/composites/union";
import { PithosLiteral } from "@kanon/v1/schemas/concepts/literal";
import { PithosEnum } from "@kanon/v1/schemas/concepts/enum/string-enum";
import { PithosCoerceNumber } from "@kanon/v1/schemas/concepts/coerce/number";
import { PithosCoerceBoolean } from "@kanon/v1/schemas/concepts/coerce/boolean";
// Kanon V2 imports
import { safeParse as safeParseV2 } from "@kanon/v2/core/parser.js";
import { string as stringV2 } from "@kanon/v2/schemas/primitives/string";
import { number as numberV2 } from "@kanon/v2/schemas/primitives/number";
import { boolean as booleanV2 } from "@kanon/v2/schemas/primitives/boolean";
import { object as objectV2 } from "@kanon/v2/schemas/composites/object";
import { union as unionV2 } from "@kanon/v2/schemas/composites/union";
import { literal as literalV2 } from "@kanon/v2/schemas/primitives/literal";
import { enum_ as enumV2 } from "@kanon/v2/schemas/primitives/enum";
import { coerceNumber as coerceNumberV2 } from "@kanon/v2/schemas/coerce/number";
import { coerceBoolean as coerceBooleanV2 } from "@kanon/v2/schemas/coerce/boolean";
import { array as arrayV2 } from "@kanon/v2/schemas/composites/array";
import { nullable as nullableV2 } from "@kanon/v2/schemas/wrappers/nullable";
import { optional as optionalV2 } from "@kanon/v2/schemas/wrappers/optional";
import { minLength as minLengthV2, maxLength as maxLengthV2, email as emailV2, pattern as patternV2, url as urlV2 } from "@kanon/v2/schemas/constraints/string";
import { min as minV2, max as maxV2 } from "@kanon/v2/schemas/constraints/number";
import { refine as refineV2 } from "@kanon/v2/schemas/constraints/refine";
import { minLength as arrayMinLengthV2, maxLength as arrayMaxLengthV2 } from "@kanon/v2/schemas/constraints/array-length";

import { POOL_SIZE, LibName } from "./dataset/config";
import * as poolHelpers from "./helpers/pool_helpers";

// Validators instances
const fv = new Validator();
const ajv = new Ajv();
addFormats(ajv);

describe("🎯 Real-World Scenarios Benchmark", () => {
  console.log("🔥 Running REAL-WORLD scenarios only");
  console.log("These tests simulate actual production use cases\n");

  // =====================================================
  // SCENARIO 1: Login Form
  // =====================================================
  const loginFormPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    email: `user${i}@example.com`,
    password: `SecureP@ss${i}!`,
    rememberMe: i % 2 === 0,
  }));
  let loginIndex = 0;
  const getLoginForm = () => loginFormPool[loginIndex++ % loginFormPool.length];

  // Kanon V1
  const kanonV1LoginSchema = new PithosObject({
    email: new PithosString().email(),
    password: new PithosString().min(8),
    rememberMe: new PithosBoolean(),
  });

  // Kanon V2 (with constraints)
  const kanonV2LoginSchema = objectV2({
    email: emailV2(stringV2()),
    password: minLengthV2(stringV2(), 8),
    rememberMe: booleanV2(),
  });

  // Kanon V3
  const kanonLoginSchema = objectV3({
    email: stringV3().email(),
    password: stringV3().minLength(8),
    rememberMe: booleanV3(),
  });

  // Kanon JIT (compiled from V3)
  const jitLoginSchema = compileJIT(objectV3({
    email: stringV3().email(),
    password: stringV3().minLength(8),
    rememberMe: booleanV3(),
  }) as GenericSchema);

  // Zod
  const zodLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    rememberMe: z.boolean(),
  });

  // Valibot
  const valibotLoginSchema = v.object({
    email: v.pipe(v.string(), v.email()),
    password: v.pipe(v.string(), v.minLength(8)),
    rememberMe: v.boolean(),
  });

  // Superstruct
  const superstructLoginSchema = s.object({
    email: s.refine(s.string(), "email", (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)),
    password: s.refine(s.string(), "minLength", (val) => val.length >= 8),
    rememberMe: s.boolean(),
  });

  // Fast-Validator
  const fvLoginSchema = fv.compile({
    email: { type: "email" },
    password: { type: "string", min: 8 },
    rememberMe: { type: "boolean" },
  });

  // TypeBox
  const typeboxLoginSchema = Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
    rememberMe: Type.Boolean(),
  });

  // AJV
  const ajvLoginSchema = ajv.compile({
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      rememberMe: { type: "boolean" },
    },
    required: ["email", "password", "rememberMe"],
    additionalProperties: false,
  });

  poolHelpers.runBenchmarkSuite("🔐 Login Form Validation", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1LoginSchema.safeParse(getLoginForm()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2LoginSchema, getLoginForm()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonLoginSchema, getLoginForm()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitLoginSchema(getLoginForm()) },
    { name: "Zod" as LibName, fn: () => zodLoginSchema.safeParse(getLoginForm()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotLoginSchema, getLoginForm()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getLoginForm(), superstructLoginSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvLoginSchema(getLoginForm()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxLoginSchema, getLoginForm()) },
    { name: "AJV" as LibName, fn: () => ajvLoginSchema(getLoginForm()) },
  ]);


  // =====================================================
  // SCENARIO 2: User Registration (with password confirm)
  // =====================================================
  const registrationPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    username: `user_${i}`,
    email: `user${i}@example.com`,
    password: `SecureP@ss${i}!`,
    confirmPassword: `SecureP@ss${i}!`,
    age: 18 + (i % 60),
    acceptTerms: true,
  }));
  let regIndex = 0;
  const getRegistration = () => registrationPool[regIndex++ % registrationPool.length];

  // Kanon V1
  const kanonV1RegSchema = new PithosObject({
    username: new PithosString().min(3).max(20),
    email: new PithosString().email(),
    password: new PithosString().min(8),
    confirmPassword: new PithosString(),
    age: new PithosNumber().min(13).max(120),
    acceptTerms: new PithosBoolean(),
  }).refine((data) => data.password === data.confirmPassword, "Passwords don't match");

  // Kanon V2 (with constraints and refine)
  const kanonV2RegSchema = refineV2(
    objectV2({
      username: maxLengthV2(minLengthV2(stringV2(), 3), 20),
      email: emailV2(stringV2()),
      password: minLengthV2(stringV2(), 8),
      confirmPassword: stringV2(),
      age: maxV2(minV2(numberV2(), 13), 120),
      acceptTerms: booleanV2(),
    }),
    (data) => data.password === data.confirmPassword || "Passwords don't match"
  );

  // Kanon V3
  const kanonRegSchema = refineObjectV3(
    objectV3({
      username: stringV3().minLength(3).maxLength(20),
      email: stringV3().email(),
      password: stringV3().minLength(8),
      confirmPassword: stringV3(),
      age: numberV3().min(13).max(120),
      acceptTerms: booleanV3(),
    }),
    (data) => data.password === data.confirmPassword || "Passwords don't match"
  );

  // Kanon JIT (compiled from V3) - Note: refinements are called as external functions
  const jitRegSchema = compileJIT(refineObjectV3(
    objectV3({
      username: stringV3().minLength(3).maxLength(20),
      email: stringV3().email(),
      password: stringV3().minLength(8),
      confirmPassword: stringV3(),
      age: numberV3().min(13).max(120),
      acceptTerms: booleanV3(),
    }),
    (data) => data.password === data.confirmPassword || "Passwords don't match"
  ) as GenericSchema);

  // Zod
  const zodRegSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    age: z.number().min(13).max(120),
    acceptTerms: z.boolean(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

  // Valibot
  const valibotRegSchema = v.pipe(
    v.object({
      username: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
      email: v.pipe(v.string(), v.email()),
      password: v.pipe(v.string(), v.minLength(8)),
      confirmPassword: v.string(),
      age: v.pipe(v.number(), v.minValue(13), v.maxValue(120)),
      acceptTerms: v.boolean(),
    }),
    v.check((data) => data.password === data.confirmPassword, "Passwords don't match")
  );

  // Superstruct
  const superstructRegSchema = s.refine(
    s.object({
      username: s.size(s.string(), 3, 20),
      email: s.refine(s.string(), "email", (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)),
      password: s.refine(s.string(), "minLength", (val) => val.length >= 8),
      confirmPassword: s.string(),
      age: s.refine(s.number(), "range", (val) => val >= 13 && val <= 120),
      acceptTerms: s.boolean(),
    }),
    "passwordMatch",
    (data) => data.password === data.confirmPassword
  );

  // Fast-Validator
  const fvRegSchema = fv.compile({
    username: { type: "string", min: 3, max: 20 },
    email: { type: "email" },
    password: { type: "string", min: 8 },
    confirmPassword: { type: "string" },
    age: { type: "number", min: 13, max: 120 },
    acceptTerms: { type: "boolean" },
    $$strict: true,
  });

  // TypeBox
  const typeboxRegSchema = Type.Object({
    username: Type.String({ minLength: 3, maxLength: 20 }),
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
    confirmPassword: Type.String(),
    age: Type.Number({ minimum: 13, maximum: 120 }),
    acceptTerms: Type.Boolean(),
  });

  // AJV
  const ajvRegSchema = ajv.compile({
    type: "object",
    properties: {
      username: { type: "string", minLength: 3, maxLength: 20 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      confirmPassword: { type: "string" },
      age: { type: "number", minimum: 13, maximum: 120 },
      acceptTerms: { type: "boolean" },
    },
    required: ["username", "email", "password", "confirmPassword", "age", "acceptTerms"],
    additionalProperties: false,
  });

  poolHelpers.runBenchmarkSuite("📝 User Registration (with password confirm)", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1RegSchema.safeParse(getRegistration()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2RegSchema, getRegistration()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonRegSchema, getRegistration()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitRegSchema(getRegistration()) },
    { name: "Zod" as LibName, fn: () => zodRegSchema.safeParse(getRegistration()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotRegSchema, getRegistration()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getRegistration(), superstructRegSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvRegSchema(getRegistration()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxRegSchema, getRegistration()) },
    { name: "AJV" as LibName, fn: () => ajvRegSchema(getRegistration()) },
  ]);


  // =====================================================
  // SCENARIO 3: API Response (success/error union)
  // =====================================================
  const apiResponsePool = Array.from({ length: POOL_SIZE }, (_, i) => {
    if (i % 3 === 0) {
      return { status: "error" as const, error: { code: 400 + (i % 100), message: `Error ${i}` } };
    }
    return {
      status: "success" as const,
      data: { id: i, name: `Item ${i}`, createdAt: new Date().toISOString() },
    };
  });
  let apiIndex = 0;
  const getApiResponse = () => apiResponsePool[apiIndex++ % apiResponsePool.length];

  // Kanon V1 (using union - tries each variant in order)
  const kanonV1ApiSchema = new PithosUnion([
    new PithosObject({
      status: new PithosLiteral("success"),
      data: new PithosObject({
        id: new PithosNumber(),
        name: new PithosString(),
        createdAt: new PithosString(),
      }),
    }),
    new PithosObject({
      status: new PithosLiteral("error"),
      error: new PithosObject({
        code: new PithosNumber(),
        message: new PithosString(),
      }),
    }),
  ]);

  // Kanon V2 (using union - tries each variant in order)
  const kanonV2ApiSchema = unionV2([
    objectV2({
      status: literalV2("success"),
      data: objectV2({
        id: numberV2(),
        name: stringV2(),
        createdAt: stringV2(),
      }),
    }),
    objectV2({
      status: literalV2("error"),
      error: objectV2({
        code: numberV2(),
        message: stringV2(),
      }),
    }),
  ]);

  // Kanon V3
  const kanonApiSchema = discriminatedUnionV3("status", [
    objectV3({
      status: literalV3("success"),
      data: objectV3({
        id: numberV3(),
        name: stringV3(),
        createdAt: stringV3(),
      }),
    }),
    objectV3({
      status: literalV3("error"),
      error: objectV3({
        code: numberV3(),
        message: stringV3(),
      }),
    }),
  ]);

  // Kanon JIT (compiled from V3)
  const jitApiSchema = compileJIT(discriminatedUnionV3("status", [
    objectV3({
      status: literalV3("success"),
      data: objectV3({
        id: numberV3(),
        name: stringV3(),
        createdAt: stringV3(),
      }),
    }),
    objectV3({
      status: literalV3("error"),
      error: objectV3({
        code: numberV3(),
        message: stringV3(),
      }),
    }),
  ]) as GenericSchema);

  // Zod
  const zodApiSchema = z.discriminatedUnion("status", [
    z.object({
      status: z.literal("success"),
      data: z.object({ id: z.number(), name: z.string(), createdAt: z.string() }),
    }),
    z.object({
      status: z.literal("error"),
      error: z.object({ code: z.number(), message: z.string() }),
    }),
  ]);

  // Valibot
  const valibotApiSchema = v.variant("status", [
    v.object({
      status: v.literal("success"),
      data: v.object({ id: v.number(), name: v.string(), createdAt: v.string() }),
    }),
    v.object({
      status: v.literal("error"),
      error: v.object({ code: v.number(), message: v.string() }),
    }),
  ]);

  // Superstruct - union approach
  const superstructApiSchema = s.union([
    s.object({
      status: s.literal("success"),
      data: s.object({ id: s.number(), name: s.string(), createdAt: s.string() }),
    }),
    s.object({
      status: s.literal("error"),
      error: s.object({ code: s.number(), message: s.string() }),
    }),
  ]);

  // Fast-Validator - using custom validator
  const fvApiSuccessSchema = fv.compile({
    status: { type: "equal", value: "success" },
    data: {
      type: "object",
      props: { id: { type: "number" }, name: { type: "string" }, createdAt: { type: "string" } },
    },
  });
  const fvApiErrorSchema = fv.compile({
    status: { type: "equal", value: "error" },
    error: {
      type: "object",
      props: { code: { type: "number" }, message: { type: "string" } },
    },
  });
  const fvApiValidate = (data: unknown) => {
    const d = data as { status: string };
    return d.status === "success" ? fvApiSuccessSchema(data) : fvApiErrorSchema(data);
  };

  // TypeBox
  const typeboxApiSchema = Type.Union([
    Type.Object({
      status: Type.Literal("success"),
      data: Type.Object({ id: Type.Number(), name: Type.String(), createdAt: Type.String() }),
    }),
    Type.Object({
      status: Type.Literal("error"),
      error: Type.Object({ code: Type.Number(), message: Type.String() }),
    }),
  ]);

  // AJV
  const ajvApiSchema = ajv.compile({
    oneOf: [
      {
        type: "object",
        properties: {
          status: { const: "success" },
          data: {
            type: "object",
            properties: { id: { type: "number" }, name: { type: "string" }, createdAt: { type: "string" } },
            required: ["id", "name", "createdAt"],
          },
        },
        required: ["status", "data"],
      },
      {
        type: "object",
        properties: {
          status: { const: "error" },
          error: {
            type: "object",
            properties: { code: { type: "number" }, message: { type: "string" } },
            required: ["code", "message"],
          },
        },
        required: ["status", "error"],
      },
    ],
  });

  poolHelpers.runBenchmarkSuite("📡 API Response (discriminated union)", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1ApiSchema.safeParse(getApiResponse()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2ApiSchema, getApiResponse()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonApiSchema, getApiResponse()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitApiSchema(getApiResponse()) },
    { name: "Zod" as LibName, fn: () => zodApiSchema.safeParse(getApiResponse()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotApiSchema, getApiResponse()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getApiResponse(), superstructApiSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvApiValidate(getApiResponse()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxApiSchema, getApiResponse()) },
    { name: "AJV" as LibName, fn: () => ajvApiSchema(getApiResponse()) },
  ]);


  // =====================================================
  // SCENARIO 4: E-commerce Product
  // =====================================================
  const productPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    id: `prod_${i}`,
    name: `Product ${i}`,
    description: i % 2 === 0 ? `Description for product ${i}` : null,
    price: 9.99 + (i % 1000),
    currency: "USD",
    stock: i % 100,
    categories: [`cat_${i % 5}`, `cat_${(i + 1) % 5}`],
    isActive: i % 10 !== 0,
    metadata: i % 3 === 0 ? { featured: true, rank: i } : undefined,
  }));
  let productIndex = 0;
  const getProduct = () => productPool[productIndex++ % productPool.length];

  // Kanon V1
  const kanonV1ProductSchema = new PithosObject({
    id: new PithosString(),
    name: new PithosString().min(1).max(200),
    description: new PithosString().nullable(),
    price: new PithosNumber().min(0),
    currency: new PithosString(), // V1 enum requires different syntax, using string
    stock: new PithosNumber().min(0),
    categories: new PithosArray(new PithosString()),
    isActive: new PithosBoolean(),
    metadata: new PithosObject({
      featured: new PithosBoolean(),
      rank: new PithosNumber(),
    }).optional(),
  });

  // Kanon V2 (with constraints)
  const kanonV2ProductSchema = objectV2({
    id: stringV2(),
    name: maxLengthV2(minLengthV2(stringV2(), 1), 200),
    description: nullableV2(stringV2()),
    price: minV2(numberV2(), 0),
    currency: enumV2(["USD", "EUR", "GBP"]),
    stock: minV2(numberV2(), 0),
    categories: arrayV2(stringV2()),
    isActive: booleanV2(),
    metadata: optionalV2(objectV2({
      featured: booleanV2(),
      rank: numberV2(),
    })),
  });

  // Kanon V3
  const kanonProductSchema = objectV3({
    id: stringV3(),
    name: stringV3().minLength(1).maxLength(200),
    description: nullableV3(stringV3()),
    price: numberV3().min(0),
    currency: enumV3(["USD", "EUR", "GBP"]),
    stock: numberV3().min(0),
    categories: arrayV3(stringV3()),
    isActive: booleanV3(),
    metadata: optionalV3(objectV3({
      featured: booleanV3(),
      rank: numberV3(),
    })),
  });

  // Kanon JIT (compiled from V3)
  const jitProductSchema = compileJIT(objectV3({
    id: stringV3(),
    name: stringV3().minLength(1).maxLength(200),
    description: nullableV3(stringV3()),
    price: numberV3().min(0),
    currency: enumV3(["USD", "EUR", "GBP"]),
    stock: numberV3().min(0),
    categories: arrayV3(stringV3()),
    isActive: booleanV3(),
    metadata: optionalV3(objectV3({
      featured: booleanV3(),
      rank: numberV3(),
    })),
  }) as GenericSchema);

  // Zod
  const zodProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(200),
    description: z.string().nullable(),
    price: z.number().min(0),
    currency: z.enum(["USD", "EUR", "GBP"]),
    stock: z.number().int().min(0),
    categories: z.array(z.string()),
    isActive: z.boolean(),
    metadata: z.object({
      featured: z.boolean(),
      rank: z.number(),
    }).optional(),
  });

  // Valibot
  const valibotProductSchema = v.object({
    id: v.string(),
    name: v.pipe(v.string(), v.minLength(1), v.maxLength(200)),
    description: v.nullable(v.string()),
    price: v.pipe(v.number(), v.minValue(0)),
    currency: v.picklist(["USD", "EUR", "GBP"]),
    stock: v.pipe(v.number(), v.integer(), v.minValue(0)),
    categories: v.array(v.string()),
    isActive: v.boolean(),
    metadata: v.optional(v.object({
      featured: v.boolean(),
      rank: v.number(),
    })),
  });

  // Superstruct
  const superstructProductSchema = s.object({
    id: s.string(),
    name: s.size(s.string(), 1, 200),
    description: s.nullable(s.string()),
    price: s.min(s.number(), 0),
    currency: s.enums(["USD", "EUR", "GBP"]),
    stock: s.min(s.integer(), 0),
    categories: s.array(s.string()),
    isActive: s.boolean(),
    metadata: s.optional(s.object({
      featured: s.boolean(),
      rank: s.number(),
    })),
  });

  // Fast-Validator
  const fvProductSchema = fv.compile({
    id: { type: "string" },
    name: { type: "string", min: 1, max: 200 },
    description: { type: "string", nullable: true },
    price: { type: "number", min: 0 },
    currency: { type: "enum", values: ["USD", "EUR", "GBP"] },
    stock: { type: "number", integer: true, min: 0 },
    categories: { type: "array", items: { type: "string" } },
    isActive: { type: "boolean" },
    metadata: {
      type: "object",
      optional: true,
      props: {
        featured: { type: "boolean" },
        rank: { type: "number" },
      },
    },
  });

  // TypeBox
  const typeboxProductSchema = Type.Object({
    id: Type.String(),
    name: Type.String({ minLength: 1, maxLength: 200 }),
    description: Type.Union([Type.String(), Type.Null()]),
    price: Type.Number({ minimum: 0 }),
    currency: Type.Union([Type.Literal("USD"), Type.Literal("EUR"), Type.Literal("GBP")]),
    stock: Type.Integer({ minimum: 0 }),
    categories: Type.Array(Type.String()),
    isActive: Type.Boolean(),
    metadata: Type.Optional(Type.Object({
      featured: Type.Boolean(),
      rank: Type.Number(),
    })),
  });

  // AJV
  const ajvProductSchema = ajv.compile({
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string", minLength: 1, maxLength: 200 },
      description: { type: ["string", "null"] },
      price: { type: "number", minimum: 0 },
      currency: { enum: ["USD", "EUR", "GBP"] },
      stock: { type: "integer", minimum: 0 },
      categories: { type: "array", items: { type: "string" } },
      isActive: { type: "boolean" },
      metadata: {
        type: "object",
        properties: {
          featured: { type: "boolean" },
          rank: { type: "number" },
        },
        required: ["featured", "rank"],
      },
    },
    required: ["id", "name", "description", "price", "currency", "stock", "categories", "isActive"],
  });

  poolHelpers.runBenchmarkSuite("🛒 E-commerce Product", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1ProductSchema.safeParse(getProduct()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2ProductSchema, getProduct()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonProductSchema, getProduct()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitProductSchema(getProduct()) },
    { name: "Zod" as LibName, fn: () => zodProductSchema.safeParse(getProduct()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotProductSchema, getProduct()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getProduct(), superstructProductSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvProductSchema(getProduct()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxProductSchema, getProduct()) },
    { name: "AJV" as LibName, fn: () => ajvProductSchema(getProduct()) },
  ]);


  // =====================================================
  // SCENARIO 5: Blog Post with Comments
  // =====================================================
  const blogPostPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    id: i,
    title: `Blog Post Title ${i}`,
    slug: `blog-post-${i}`,
    content: `This is the content of blog post ${i}. `.repeat(10),
    author: {
      id: i % 100,
      name: `Author ${i % 100}`,
      email: `author${i % 100}@blog.com`,
    },
    tags: [`tag${i % 5}`, `tag${(i + 1) % 5}`, `tag${(i + 2) % 5}`],
    publishedAt: i % 5 === 0 ? null : new Date(2023, i % 12, (i % 28) + 1).toISOString(),
    comments: Array.from({ length: i % 5 }, (_, j) => ({
      id: j,
      author: `Commenter ${j}`,
      text: `Comment ${j} on post ${i}`,
      createdAt: new Date().toISOString(),
    })),
  }));
  let blogIndex = 0;
  const getBlogPost = () => blogPostPool[blogIndex++ % blogPostPool.length];

  // Kanon V1
  const kanonV1BlogSchema = new PithosObject({
    id: new PithosNumber(),
    title: new PithosString().min(1).max(200),
    slug: new PithosString().regex(/^[a-z0-9-]+$/),
    content: new PithosString(),
    author: new PithosObject({
      id: new PithosNumber(),
      name: new PithosString(),
      email: new PithosString().email(),
    }),
    tags: new PithosArray(new PithosString()),
    publishedAt: new PithosString().nullable(),
    comments: new PithosArray(new PithosObject({
      id: new PithosNumber(),
      author: new PithosString(),
      text: new PithosString(),
      createdAt: new PithosString(),
    })),
  });

  // Kanon V2 (with constraints)
  const kanonV2BlogSchema = objectV2({
    id: numberV2(),
    title: maxLengthV2(minLengthV2(stringV2(), 1), 200),
    slug: patternV2(stringV2(), /^[a-z0-9-]+$/),
    content: stringV2(),
    author: objectV2({
      id: numberV2(),
      name: stringV2(),
      email: emailV2(stringV2()),
    }),
    tags: arrayV2(stringV2()),
    publishedAt: nullableV2(stringV2()),
    comments: arrayV2(objectV2({
      id: numberV2(),
      author: stringV2(),
      text: stringV2(),
      createdAt: stringV2(),
    })),
  });

  // Kanon V3
  const kanonBlogSchema = objectV3({
    id: numberV3(),
    title: stringV3().minLength(1).maxLength(200),
    slug: stringV3().pattern(/^[a-z0-9-]+$/),
    content: stringV3(),
    author: objectV3({
      id: numberV3(),
      name: stringV3(),
      email: stringV3().email(),
    }),
    tags: arrayV3(stringV3()),
    publishedAt: nullableV3(stringV3()),
    comments: arrayV3(objectV3({
      id: numberV3(),
      author: stringV3(),
      text: stringV3(),
      createdAt: stringV3(),
    })),
  });

  // Kanon JIT (compiled from V3)
  const jitBlogSchema = compileJIT(objectV3({
    id: numberV3(),
    title: stringV3().minLength(1).maxLength(200),
    slug: stringV3().pattern(/^[a-z0-9-]+$/),
    content: stringV3(),
    author: objectV3({
      id: numberV3(),
      name: stringV3(),
      email: stringV3().email(),
    }),
    tags: arrayV3(stringV3()),
    publishedAt: nullableV3(stringV3()),
    comments: arrayV3(objectV3({
      id: numberV3(),
      author: stringV3(),
      text: stringV3(),
      createdAt: stringV3(),
    })),
  }) as GenericSchema);

  // Zod
  const zodBlogSchema = z.object({
    id: z.number(),
    title: z.string().min(1).max(200),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    content: z.string(),
    author: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
    }),
    tags: z.array(z.string()),
    publishedAt: z.string().nullable(),
    comments: z.array(z.object({
      id: z.number(),
      author: z.string(),
      text: z.string(),
      createdAt: z.string(),
    })),
  });

  // Valibot
  const valibotBlogSchema = v.object({
    id: v.number(),
    title: v.pipe(v.string(), v.minLength(1), v.maxLength(200)),
    slug: v.pipe(v.string(), v.regex(/^[a-z0-9-]+$/)),
    content: v.string(),
    author: v.object({
      id: v.number(),
      name: v.string(),
      email: v.pipe(v.string(), v.email()),
    }),
    tags: v.array(v.string()),
    publishedAt: v.nullable(v.string()),
    comments: v.array(v.object({
      id: v.number(),
      author: v.string(),
      text: v.string(),
      createdAt: v.string(),
    })),
  });

  // Superstruct
  const superstructBlogSchema = s.object({
    id: s.number(),
    title: s.size(s.string(), 1, 200),
    slug: s.pattern(s.string(), /^[a-z0-9-]+$/),
    content: s.string(),
    author: s.object({
      id: s.number(),
      name: s.string(),
      email: s.refine(s.string(), "email", (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)),
    }),
    tags: s.array(s.string()),
    publishedAt: s.nullable(s.string()),
    comments: s.array(s.object({
      id: s.number(),
      author: s.string(),
      text: s.string(),
      createdAt: s.string(),
    })),
  });

  // Fast-Validator
  const fvBlogSchema = fv.compile({
    id: { type: "number" },
    title: { type: "string", min: 1, max: 200 },
    slug: { type: "string", pattern: /^[a-z0-9-]+$/ },
    content: { type: "string" },
    author: {
      type: "object",
      props: {
        id: { type: "number" },
        name: { type: "string" },
        email: { type: "email" },
      },
    },
    tags: { type: "array", items: { type: "string" } },
    publishedAt: { type: "string", nullable: true },
    comments: {
      type: "array",
      items: {
        type: "object",
        props: {
          id: { type: "number" },
          author: { type: "string" },
          text: { type: "string" },
          createdAt: { type: "string" },
        },
      },
    },
  });

  // TypeBox
  const typeboxBlogSchema = Type.Object({
    id: Type.Number(),
    title: Type.String({ minLength: 1, maxLength: 200 }),
    slug: Type.String({ pattern: "^[a-z0-9-]+$" }),
    content: Type.String(),
    author: Type.Object({
      id: Type.Number(),
      name: Type.String(),
      email: Type.String({ format: "email" }),
    }),
    tags: Type.Array(Type.String()),
    publishedAt: Type.Union([Type.String(), Type.Null()]),
    comments: Type.Array(Type.Object({
      id: Type.Number(),
      author: Type.String(),
      text: Type.String(),
      createdAt: Type.String(),
    })),
  });

  // AJV
  const ajvBlogSchema = ajv.compile({
    type: "object",
    properties: {
      id: { type: "number" },
      title: { type: "string", minLength: 1, maxLength: 200 },
      slug: { type: "string", pattern: "^[a-z0-9-]+$" },
      content: { type: "string" },
      author: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
        required: ["id", "name", "email"],
      },
      tags: { type: "array", items: { type: "string" } },
      publishedAt: { type: ["string", "null"] },
      comments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            author: { type: "string" },
            text: { type: "string" },
            createdAt: { type: "string" },
          },
          required: ["id", "author", "text", "createdAt"],
        },
      },
    },
    required: ["id", "title", "slug", "content", "author", "tags", "publishedAt", "comments"],
  });

  poolHelpers.runBenchmarkSuite("📰 Blog Post with Comments", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1BlogSchema.safeParse(getBlogPost()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2BlogSchema, getBlogPost()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonBlogSchema, getBlogPost()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitBlogSchema(getBlogPost()) },
    { name: "Zod" as LibName, fn: () => zodBlogSchema.safeParse(getBlogPost()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotBlogSchema, getBlogPost()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getBlogPost(), superstructBlogSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvBlogSchema(getBlogPost()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxBlogSchema, getBlogPost()) },
    { name: "AJV" as LibName, fn: () => ajvBlogSchema(getBlogPost()) },
  ]);


  // =====================================================
  // SCENARIO 6: Form with Coercion (Query Params / Form Data)
  // =====================================================
  const searchParamsPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    q: `search term ${i}`,
    page: `${1 + (i % 50)}`,
    limit: `${10 + (i % 40)}`,
    sortBy: i % 2 === 0 ? "date" : "relevance",
    includeArchived: i % 3 === 0 ? "true" : "false",
  }));
  let searchIndex = 0;
  const getSearchParams = () => searchParamsPool[searchIndex++ % searchParamsPool.length];

  // Kanon V1 (with coercion support)
  const kanonV1SearchSchema = new PithosObject({
    q: new PithosString(),
    page: new PithosCoerceNumber(),
    limit: new PithosCoerceNumber(),
    sortBy: new PithosEnum(["date", "relevance", "popularity"] as const),
    includeArchived: new PithosCoerceBoolean(),
  });

  // Kanon V2 (with coercion and enum)
  const kanonV2SearchSchema = objectV2({
    q: stringV2(),
    page: coerceNumberV2(),
    limit: coerceNumberV2(),
    sortBy: enumV2(["date", "relevance", "popularity"]),
    includeArchived: coerceBooleanV2(),
  });

  // Kanon V3
  const kanonSearchSchema = objectV3({
    q: stringV3(),
    page: coerceNumberV3(),
    limit: coerceNumberV3(),
    sortBy: enumV3(["date", "relevance", "popularity"]),
    includeArchived: coerceBooleanV3(),
  });

  // Kanon JIT (compiled from V3) - Note: coercion is supported
  const jitSearchSchema = compileJIT(objectV3({
    q: stringV3(),
    page: coerceNumberV3(),
    limit: coerceNumberV3(),
    sortBy: enumV3(["date", "relevance", "popularity"]),
    includeArchived: coerceBooleanV3(),
  }) as GenericSchema);

  // Zod
  const zodSearchSchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1),
    limit: z.coerce.number().min(1).max(100),
    sortBy: z.enum(["date", "relevance", "popularity"]),
    includeArchived: z.coerce.boolean(),
  });

  // Valibot
  const valibotSearchSchema = v.object({
    q: v.string(),
    page: v.pipe(v.unknown(), v.transform(Number), v.number(), v.minValue(1)),
    limit: v.pipe(v.unknown(), v.transform(Number), v.number(), v.minValue(1), v.maxValue(100)),
    sortBy: v.picklist(["date", "relevance", "popularity"]),
    includeArchived: v.pipe(v.unknown(), v.transform((val) => val === "true" || val === true), v.boolean()),
  });

  // Superstruct - coercion via custom
  const superstructSearchSchema = s.object({
    q: s.string(),
    page: s.coerce(s.min(s.number(), 1), s.string(), (val) => Number(val)),
    limit: s.coerce(s.refine(s.number(), "range", (n) => n >= 1 && n <= 100), s.string(), (val) => Number(val)),
    sortBy: s.enums(["date", "relevance", "popularity"]),
    includeArchived: s.coerce(s.boolean(), s.string(), (val) => val === "true"),
  });

  // Fast-Validator - no native coercion, validate as-is
  const fvSearchSchema = fv.compile({
    q: { type: "string" },
    page: { type: "string" },
    limit: { type: "string" },
    sortBy: { type: "enum", values: ["date", "relevance", "popularity"] },
    includeArchived: { type: "string" },
  });

  // TypeBox - no native coercion
  const typeboxSearchSchema = Type.Object({
    q: Type.String(),
    page: Type.String(),
    limit: Type.String(),
    sortBy: Type.Union([Type.Literal("date"), Type.Literal("relevance"), Type.Literal("popularity")]),
    includeArchived: Type.String(),
  });

  // AJV - no native coercion
  const ajvSearchSchema = ajv.compile({
    type: "object",
    properties: {
      q: { type: "string" },
      page: { type: "string" },
      limit: { type: "string" },
      sortBy: { enum: ["date", "relevance", "popularity"] },
      includeArchived: { type: "string" },
    },
    required: ["q", "page", "limit", "sortBy", "includeArchived"],
  });

  poolHelpers.runBenchmarkSuite("🔍 Search Params (with coercion)", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1SearchSchema.safeParse(getSearchParams()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2SearchSchema, getSearchParams()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonSearchSchema, getSearchParams()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitSearchSchema(getSearchParams()) },
    { name: "Zod" as LibName, fn: () => zodSearchSchema.safeParse(getSearchParams()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotSearchSchema, getSearchParams()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getSearchParams(), superstructSearchSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvSearchSchema(getSearchParams()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxSearchSchema, getSearchParams()) },
    { name: "AJV" as LibName, fn: () => ajvSearchSchema(getSearchParams()) },
  ]);


  // =====================================================
  // SCENARIO 7: User Profile Update (Partial)
  // =====================================================
  const profileUpdatePool = Array.from({ length: POOL_SIZE }, (_, i) => {
    const updates: Record<string, unknown> = {};
    if (i % 2 === 0) updates.displayName = `User ${i}`;
    if (i % 3 === 0) updates.bio = `Bio for user ${i}`;
    if (i % 4 === 0) updates.website = `https://user${i}.com`;
    if (i % 5 === 0) updates.location = `City ${i}`;
    return updates;
  });
  let profileIndex = 0;
  const getProfileUpdate = () => profileUpdatePool[profileIndex++ % profileUpdatePool.length];

  // Kanon V1
  const kanonV1ProfileSchema = new PithosObject({
    displayName: new PithosString().min(1).max(50).optional(),
    bio: new PithosString().max(500).optional(),
    website: new PithosString().url().optional(),
    location: new PithosString().max(100).optional(),
  });

  // Kanon V2 (with constraints)
  const kanonV2ProfileSchema = objectV2({
    displayName: optionalV2(maxLengthV2(minLengthV2(stringV2(), 1), 50)),
    bio: optionalV2(maxLengthV2(stringV2(), 500)),
    website: optionalV2(urlV2(stringV2())),
    location: optionalV2(maxLengthV2(stringV2(), 100)),
  });

  // Kanon V3
  const kanonProfileSchema = objectV3({
    displayName: optionalV3(stringV3().minLength(1).maxLength(50)),
    bio: optionalV3(stringV3().maxLength(500)),
    website: optionalV3(stringV3().url()),
    location: optionalV3(stringV3().maxLength(100)),
  });

  // Kanon JIT (compiled from V3)
  const jitProfileSchema = compileJIT(objectV3({
    displayName: optionalV3(stringV3().minLength(1).maxLength(50)),
    bio: optionalV3(stringV3().maxLength(500)),
    website: optionalV3(stringV3().url()),
    location: optionalV3(stringV3().maxLength(100)),
  }) as GenericSchema);

  // Zod
  const zodProfileSchema = z.object({
    displayName: z.string().min(1).max(50).optional(),
    bio: z.string().max(500).optional(),
    website: z.string().url().optional(),
    location: z.string().max(100).optional(),
  });

  // Valibot
  const valibotProfileSchema = v.object({
    displayName: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(50))),
    bio: v.optional(v.pipe(v.string(), v.maxLength(500))),
    website: v.optional(v.pipe(v.string(), v.url())),
    location: v.optional(v.pipe(v.string(), v.maxLength(100))),
  });

  // Superstruct
  const superstructProfileSchema = s.object({
    displayName: s.optional(s.size(s.string(), 1, 50)),
    bio: s.optional(s.size(s.string(), 0, 500)),
    website: s.optional(s.refine(s.string(), "url", (val) => {
      try { new URL(val); return true; } catch { return false; }
    })),
    location: s.optional(s.size(s.string(), 0, 100)),
  });

  // Fast-Validator
  const fvProfileSchema = fv.compile({
    displayName: { type: "string", min: 1, max: 50, optional: true },
    bio: { type: "string", max: 500, optional: true },
    website: { type: "url", optional: true },
    location: { type: "string", max: 100, optional: true },
  });

  // TypeBox
  const typeboxProfileSchema = Type.Object({
    displayName: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
    bio: Type.Optional(Type.String({ maxLength: 500 })),
    website: Type.Optional(Type.String({ format: "uri" })),
    location: Type.Optional(Type.String({ maxLength: 100 })),
  });

  // AJV
  const ajvProfileSchema = ajv.compile({
    type: "object",
    properties: {
      displayName: { type: "string", minLength: 1, maxLength: 50 },
      bio: { type: "string", maxLength: 500 },
      website: { type: "string", format: "uri" },
      location: { type: "string", maxLength: 100 },
    },
  });

  poolHelpers.runBenchmarkSuite("👤 User Profile Update (optional fields)", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1ProfileSchema.safeParse(getProfileUpdate()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2ProfileSchema, getProfileUpdate()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonProfileSchema, getProfileUpdate()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitProfileSchema(getProfileUpdate()) },
    { name: "Zod" as LibName, fn: () => zodProfileSchema.safeParse(getProfileUpdate()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotProfileSchema, getProfileUpdate()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getProfileUpdate(), superstructProfileSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvProfileSchema(getProfileUpdate()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxProfileSchema, getProfileUpdate()) },
    { name: "AJV" as LibName, fn: () => ajvProfileSchema(getProfileUpdate()) },
  ]);


  // =====================================================
  // SCENARIO 8: Payment Form (conditional validation)
  // =====================================================
  const paymentPool = Array.from({ length: POOL_SIZE }, (_, i) => {
    const method = i % 3 === 0 ? "card" : i % 3 === 1 ? "paypal" : "bank";
    return {
      amount: 10 + (i % 1000),
      currency: "USD",
      method,
      cardNumber: method === "card" ? `4111111111111${String(i % 10000).padStart(4, "0")}` : undefined,
      cardExpiry: method === "card" ? `${String((i % 12) + 1).padStart(2, "0")}/${25 + (i % 5)}` : undefined,
      paypalEmail: method === "paypal" ? `user${i}@paypal.com` : undefined,
      bankAccount: method === "bank" ? `IBAN${i}` : undefined,
    };
  });
  let paymentIndex = 0;
  const getPayment = () => paymentPool[paymentIndex++ % paymentPool.length];

  // Kanon V1
  const kanonV1PaymentSchema = new PithosObject({
    amount: new PithosNumber().min(1),
    currency: new PithosString(), // V1: no enum, use string
    method: new PithosString(), // V1: no enum, use string
    cardNumber: new PithosString().optional(),
    cardExpiry: new PithosString().optional(),
    paypalEmail: new PithosString().email().optional(),
    bankAccount: new PithosString().optional(),
  }).refine((data) => {
    if (data.method === "card" && (!data.cardNumber || !data.cardExpiry)) return false;
    if (data.method === "paypal" && !data.paypalEmail) return false;
    if (data.method === "bank" && !data.bankAccount) return false;
    return true;
  }, "Payment details required");

  // Kanon V2 (with enum, min, and refine)
  const kanonV2PaymentSchema = refineV2(
    objectV2({
      amount: minV2(numberV2(), 1),
      currency: enumV2(["USD", "EUR", "GBP"]),
      method: enumV2(["card", "paypal", "bank"]),
      cardNumber: optionalV2(stringV2()),
      cardExpiry: optionalV2(stringV2()),
      paypalEmail: optionalV2(emailV2(stringV2())),
      bankAccount: optionalV2(stringV2()),
    }),
    (data) => {
      if (data.method === "card" && (!data.cardNumber || !data.cardExpiry)) {
        return "Card details required";
      }
      if (data.method === "paypal" && !data.paypalEmail) {
        return "PayPal email required";
      }
      if (data.method === "bank" && !data.bankAccount) {
        return "Bank account required";
      }
      return true;
    }
  );

  // Kanon V3
  const kanonPaymentSchema = refineObjectV3(
    objectV3({
      amount: numberV3().min(1),
      currency: enumV3(["USD", "EUR", "GBP"]),
      method: enumV3(["card", "paypal", "bank"]),
      cardNumber: optionalV3(stringV3()),
      cardExpiry: optionalV3(stringV3()),
      paypalEmail: optionalV3(stringV3().email()),
      bankAccount: optionalV3(stringV3()),
    }),
    (data) => {
      if (data.method === "card" && (!data.cardNumber || !data.cardExpiry)) {
        return "Card details required";
      }
      if (data.method === "paypal" && !data.paypalEmail) {
        return "PayPal email required";
      }
      if (data.method === "bank" && !data.bankAccount) {
        return "Bank account required";
      }
      return true;
    }
  );

  // Kanon JIT (compiled from V3) - Note: refinements are called as external functions
  const jitPaymentSchema = compileJIT(refineObjectV3(
    objectV3({
      amount: numberV3().min(1),
      currency: enumV3(["USD", "EUR", "GBP"]),
      method: enumV3(["card", "paypal", "bank"]),
      cardNumber: optionalV3(stringV3()),
      cardExpiry: optionalV3(stringV3()),
      paypalEmail: optionalV3(stringV3().email()),
      bankAccount: optionalV3(stringV3()),
    }),
    (data) => {
      if (data.method === "card" && (!data.cardNumber || !data.cardExpiry)) {
        return "Card details required";
      }
      if (data.method === "paypal" && !data.paypalEmail) {
        return "PayPal email required";
      }
      if (data.method === "bank" && !data.bankAccount) {
        return "Bank account required";
      }
      return true;
    }
  ) as GenericSchema);

  // Zod
  const zodPaymentSchema = z.object({
    amount: z.number().min(1),
    currency: z.enum(["USD", "EUR", "GBP"]),
    method: z.enum(["card", "paypal", "bank"]),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    paypalEmail: z.string().email().optional(),
    bankAccount: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.method === "card" && (!data.cardNumber || !data.cardExpiry)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Card details required" });
    }
    if (data.method === "paypal" && !data.paypalEmail) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "PayPal email required" });
    }
    if (data.method === "bank" && !data.bankAccount) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank account required" });
    }
  });

  // Valibot
  const valibotPaymentSchema = v.pipe(
    v.object({
      amount: v.pipe(v.number(), v.minValue(1)),
      currency: v.picklist(["USD", "EUR", "GBP"]),
      method: v.picklist(["card", "paypal", "bank"]),
      cardNumber: v.optional(v.string()),
      cardExpiry: v.optional(v.string()),
      paypalEmail: v.optional(v.pipe(v.string(), v.email())),
      bankAccount: v.optional(v.string()),
    }),
    v.check((data) => {
      if (data.method === "card" && (!data.cardNumber || !data.cardExpiry)) return false;
      if (data.method === "paypal" && !data.paypalEmail) return false;
      if (data.method === "bank" && !data.bankAccount) return false;
      return true;
    }, "Payment details required")
  );

  // Superstruct
  const superstructPaymentSchema = s.refine(
    s.object({
      amount: s.min(s.number(), 1),
      currency: s.enums(["USD", "EUR", "GBP"]),
      method: s.enums(["card", "paypal", "bank"]),
      cardNumber: s.optional(s.string()),
      cardExpiry: s.optional(s.string()),
      paypalEmail: s.optional(s.refine(s.string(), "email", (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))),
      bankAccount: s.optional(s.string()),
    }),
    "paymentDetails",
    (data) => {
      if (data.method === "card" && (!data.cardNumber || !data.cardExpiry)) return false;
      if (data.method === "paypal" && !data.paypalEmail) return false;
      if (data.method === "bank" && !data.bankAccount) return false;
      return true;
    }
  );

  // Fast-Validator - basic validation only
  const fvPaymentSchema = fv.compile({
    amount: { type: "number", min: 1 },
    currency: { type: "enum", values: ["USD", "EUR", "GBP"] },
    method: { type: "enum", values: ["card", "paypal", "bank"] },
    cardNumber: { type: "string", optional: true },
    cardExpiry: { type: "string", optional: true },
    paypalEmail: { type: "email", optional: true },
    bankAccount: { type: "string", optional: true },
  });

  // TypeBox - basic validation only
  const typeboxPaymentSchema = Type.Object({
    amount: Type.Number({ minimum: 1 }),
    currency: Type.Union([Type.Literal("USD"), Type.Literal("EUR"), Type.Literal("GBP")]),
    method: Type.Union([Type.Literal("card"), Type.Literal("paypal"), Type.Literal("bank")]),
    cardNumber: Type.Optional(Type.String()),
    cardExpiry: Type.Optional(Type.String()),
    paypalEmail: Type.Optional(Type.String({ format: "email" })),
    bankAccount: Type.Optional(Type.String()),
  });

  // AJV - basic validation only
  const ajvPaymentSchema = ajv.compile({
    type: "object",
    properties: {
      amount: { type: "number", minimum: 1 },
      currency: { enum: ["USD", "EUR", "GBP"] },
      method: { enum: ["card", "paypal", "bank"] },
      cardNumber: { type: "string" },
      cardExpiry: { type: "string" },
      paypalEmail: { type: "string", format: "email" },
      bankAccount: { type: "string" },
    },
    required: ["amount", "currency", "method"],
  });

  poolHelpers.runBenchmarkSuite("💳 Payment Form (conditional validation)", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1PaymentSchema.safeParse(getPayment()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2PaymentSchema, getPayment()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonPaymentSchema, getPayment()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitPaymentSchema(getPayment()) },
    { name: "Zod" as LibName, fn: () => zodPaymentSchema.safeParse(getPayment()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotPaymentSchema, getPayment()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getPayment(), superstructPaymentSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvPaymentSchema(getPayment()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxPaymentSchema, getPayment()) },
    { name: "AJV" as LibName, fn: () => ajvPaymentSchema(getPayment()) },
  ]);


  // =====================================================
  // SCENARIO 9: Event Booking
  // =====================================================
  const bookingPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    eventId: `evt_${i}`,
    attendees: Array.from({ length: 1 + (i % 5) }, (_, j) => ({
      name: `Attendee ${j}`,
      email: `attendee${j}_${i}@example.com`,
      dietaryRequirements: j % 3 === 0 ? "vegetarian" : j % 3 === 1 ? "vegan" : null,
    })),
    date: new Date(2024, (i % 12), (i % 28) + 1).toISOString(),
    specialRequests: i % 4 === 0 ? `Special request ${i}` : undefined,
    totalPrice: 50 + (i % 200),
  }));
  let bookingIndex = 0;
  const getBooking = () => bookingPool[bookingIndex++ % bookingPool.length];

  // Kanon V1
  const kanonV1BookingSchema = new PithosObject({
    eventId: new PithosString(),
    attendees: new PithosArray(new PithosObject({
      name: new PithosString().min(1),
      email: new PithosString().email(),
      dietaryRequirements: new PithosString().nullable(), // V1: no enum, use string
    })),
    date: new PithosString(),
    specialRequests: new PithosString().max(500).optional(),
    totalPrice: new PithosNumber().min(0),
  });

  // Kanon V2 (with all constraints matching V3)
  const kanonV2BookingSchema = objectV2({
    eventId: stringV2(),
    attendees: refineV2(
      arrayV2(objectV2({
        name: minLengthV2(stringV2(), 1),
        email: emailV2(stringV2()),
        dietaryRequirements: nullableV2(enumV2(["vegetarian", "vegan", "gluten-free", "halal", "kosher"])),
      })),
      (arr) => arr.length >= 1 && arr.length <= 10 || "Attendees must be between 1 and 10"
    ),
    date: stringV2(),
    specialRequests: optionalV2(maxLengthV2(stringV2(), 500)),
    totalPrice: minV2(numberV2(), 0),
  });

  // Kanon V3
  const kanonBookingSchema = objectV3({
    eventId: stringV3(),
    attendees: arrayV3(objectV3({
      name: stringV3().minLength(1),
      email: stringV3().email(),
      dietaryRequirements: nullableV3(enumV3(["vegetarian", "vegan", "gluten-free", "halal", "kosher"])),
    })).minLength(1).maxLength(10),
    date: stringV3(),
    specialRequests: optionalV3(stringV3().maxLength(500)),
    totalPrice: numberV3().min(0),
  });

  // Kanon JIT (compiled from V3)
  const jitBookingSchema = compileJIT(objectV3({
    eventId: stringV3(),
    attendees: arrayV3(objectV3({
      name: stringV3().minLength(1),
      email: stringV3().email(),
      dietaryRequirements: nullableV3(enumV3(["vegetarian", "vegan", "gluten-free", "halal", "kosher"])),
    })).minLength(1).maxLength(10),
    date: stringV3(),
    specialRequests: optionalV3(stringV3().maxLength(500)),
    totalPrice: numberV3().min(0),
  }) as GenericSchema);

  // Zod
  const zodBookingSchema = z.object({
    eventId: z.string(),
    attendees: z.array(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      dietaryRequirements: z.enum(["vegetarian", "vegan", "gluten-free", "halal", "kosher"]).nullable(),
    })).min(1).max(10),
    date: z.string(),
    specialRequests: z.string().max(500).optional(),
    totalPrice: z.number().min(0),
  });

  // Valibot
  const valibotBookingSchema = v.object({
    eventId: v.string(),
    attendees: v.pipe(
      v.array(v.object({
        name: v.pipe(v.string(), v.minLength(1)),
        email: v.pipe(v.string(), v.email()),
        dietaryRequirements: v.nullable(v.picklist(["vegetarian", "vegan", "gluten-free", "halal", "kosher"])),
      })),
      v.minLength(1),
      v.maxLength(10)
    ),
    date: v.string(),
    specialRequests: v.optional(v.pipe(v.string(), v.maxLength(500))),
    totalPrice: v.pipe(v.number(), v.minValue(0)),
  });

  // Superstruct
  const superstructBookingSchema = s.object({
    eventId: s.string(),
    attendees: s.size(s.array(s.object({
      name: s.refine(s.string(), "minLength", (val) => val.length >= 1),
      email: s.refine(s.string(), "email", (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)),
      dietaryRequirements: s.nullable(s.enums(["vegetarian", "vegan", "gluten-free", "halal", "kosher"])),
    })), 1, 10),
    date: s.string(),
    specialRequests: s.optional(s.size(s.string(), 0, 500)),
    totalPrice: s.min(s.number(), 0),
  });

  // Fast-Validator
  const fvBookingSchema = fv.compile({
    eventId: { type: "string" },
    attendees: {
      type: "array",
      min: 1,
      max: 10,
      items: {
        type: "object",
        props: {
          name: { type: "string", min: 1 },
          email: { type: "email" },
          dietaryRequirements: { type: "enum", values: ["vegetarian", "vegan", "gluten-free", "halal", "kosher"], nullable: true },
        },
      },
    },
    date: { type: "string" },
    specialRequests: { type: "string", max: 500, optional: true },
    totalPrice: { type: "number", min: 0 },
  });

  // TypeBox
  const typeboxBookingSchema = Type.Object({
    eventId: Type.String(),
    attendees: Type.Array(Type.Object({
      name: Type.String({ minLength: 1 }),
      email: Type.String({ format: "email" }),
      dietaryRequirements: Type.Union([
        Type.Union([Type.Literal("vegetarian"), Type.Literal("vegan"), Type.Literal("gluten-free"), Type.Literal("halal"), Type.Literal("kosher")]),
        Type.Null(),
      ]),
    }), { minItems: 1, maxItems: 10 }),
    date: Type.String(),
    specialRequests: Type.Optional(Type.String({ maxLength: 500 })),
    totalPrice: Type.Number({ minimum: 0 }),
  });

  // AJV
  const ajvBookingSchema = ajv.compile({
    type: "object",
    properties: {
      eventId: { type: "string" },
      attendees: {
        type: "array",
        minItems: 1,
        maxItems: 10,
        items: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1 },
            email: { type: "string", format: "email" },
            dietaryRequirements: { enum: ["vegetarian", "vegan", "gluten-free", "halal", "kosher", null] },
          },
          required: ["name", "email", "dietaryRequirements"],
        },
      },
      date: { type: "string" },
      specialRequests: { type: "string", maxLength: 500 },
      totalPrice: { type: "number", minimum: 0 },
    },
    required: ["eventId", "attendees", "date", "totalPrice"],
  });

  poolHelpers.runBenchmarkSuite("🎫 Event Booking", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1BookingSchema.safeParse(getBooking()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2BookingSchema, getBooking()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonBookingSchema, getBooking()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitBookingSchema(getBooking()) },
    { name: "Zod" as LibName, fn: () => zodBookingSchema.safeParse(getBooking()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotBookingSchema, getBooking()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getBooking(), superstructBookingSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvBookingSchema(getBooking()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxBookingSchema, getBooking()) },
    { name: "AJV" as LibName, fn: () => ajvBookingSchema(getBooking()) },
  ]);


  // =====================================================
  // SCENARIO 10: Error Case - Invalid Login
  // =====================================================
  const invalidLoginPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    email: i % 2 === 0 ? "not-an-email" : `user${i}@example.com`,
    password: i % 3 === 0 ? "short" : `SecureP@ss${i}!`,
    rememberMe: i % 4 === 0 ? "yes" : true, // Invalid type sometimes
  }));
  let invalidLoginIndex = 0;
  const getInvalidLogin = () => invalidLoginPool[invalidLoginIndex++ % invalidLoginPool.length];

  poolHelpers.runBenchmarkSuite("❌ Invalid Login (error handling)", [
    { name: "@kanon/V1" as LibName, fn: () => kanonV1LoginSchema.safeParse(getInvalidLogin()) },
    { name: "@kanon/V2" as LibName, fn: () => safeParseV2(kanonV2LoginSchema, getInvalidLogin()) },
    { name: "@kanon/V3.0" as LibName, fn: () => parseV3(kanonLoginSchema, getInvalidLogin()) },
    { name: "@kanon/JIT" as LibName, fn: () => jitLoginSchema(getInvalidLogin()) },
    { name: "Zod" as LibName, fn: () => zodLoginSchema.safeParse(getInvalidLogin()) },
    { name: "Valibot" as LibName, fn: () => v.safeParse(valibotLoginSchema, getInvalidLogin()) },
    { name: "Superstruct" as LibName, fn: () => s.validate(getInvalidLogin(), superstructLoginSchema) },
    { name: "Fast-Validator" as LibName, fn: () => fvLoginSchema(getInvalidLogin()) },
    { name: "TypeBox" as LibName, fn: () => Value.Check(typeboxLoginSchema, getInvalidLogin()) },
    { name: "AJV" as LibName, fn: () => ajvLoginSchema(getInvalidLogin()) },
  ]);
});
