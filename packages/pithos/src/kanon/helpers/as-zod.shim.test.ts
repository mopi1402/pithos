/**
 * Tests for as-zod.shim.ts - the Zod-compatible namespace
 * Tests the z.* constructors and Zod API compatibility
 * 
 * IMPORTANT: All tests here should pass with both imports:
 *   - import { z } from "./as-zod.shim"
 *   - import { z } from "zod"
 * This ensures the shim is a drop-in replacement for Zod's API.
 */

import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { z } from "./as-zod.shim"

// Helper functions that work with both Zod and the shim
const tupleWithRest = <
  T extends [z.ZodTypeAny, ...z.ZodTypeAny[]],
  R extends z.ZodTypeAny
>(
  items: T,
  rest: R
) => z.tuple(items).rest(rest);

const strictObject = <S extends z.ZodRawShape>(shape: S) =>
  z.object(shape).strict();

const looseObject = <S extends z.ZodRawShape>(shape: S) =>
  z.object(shape).passthrough();

describe("z namespace - Zod compatibility", () => {
  describe("primitives", () => {
    it("z.string()", () => {
      expect(z.string().parse("hello")).toBe("hello");
    });

    it("z.number()", () => {
      expect(z.number().parse(42)).toBe(42);
    });

    it("z.number().int()", () => {
      expect(z.number().int().parse(3)).toBe(3);
    });

    it("z.boolean()", () => {
      expect(z.boolean().parse(true)).toBe(true);
    });

    it("z.bigint()", () => {
      expect(z.bigint().parse(5n)).toBe(5n);
    });

    it("z.date()", () => {
      const d = new Date("2024-01-01");
      expect(z.date().parse(d)).toEqual(d);
    });

    it("z.symbol()", () => {
      const s = Symbol("test");
      expect(typeof z.symbol().parse(s)).toBe("symbol");
    });

    it("z.any()", () => {
      expect(z.any().parse("anything")).toBe("anything");
    });

    it("z.unknown()", () => {
      expect(z.unknown().parse({ a: 1 })).toEqual({ a: 1 });
    });

    it("z.never()", () => {
      expect(z.never().safeParse("x").success).toBe(false);
    });

    it("z.void()", () => {
      expect(z.void().parse(undefined)).toBeUndefined();
    });

    it("z.undefined()", () => {
      expect(z.undefined().parse(undefined)).toBeUndefined();
    });

    it("z.null()", () => {
      expect(z.null().parse(null)).toBeNull();
    });
  });

  describe("literals and enums", () => {
    it("z.literal() string", () => {
      expect(z.literal("a").parse("a")).toBe("a");
    });

    it("z.literal() number", () => {
      expect(z.literal(7).parse(7)).toBe(7);
    });

    it("z.literal() boolean", () => {
      expect(z.literal(true).parse(true)).toBe(true);
    });

    it("z.enum()", () => {
      expect(z.enum(["a", "b"]).parse("a")).toBe("a");
    });

    it("z.nativeEnum()", () => {
      enum TestEnum { ONE = "one", TWO = "two" }
      expect(z.nativeEnum(TestEnum).parse(TestEnum.ONE)).toBe("one");
    });

    it("mixed literal union (string, number, boolean)", () => {
      // Pattern Zod: union de littéraux mixtes
      const mixed = z.union([z.literal("x"), z.literal(1), z.literal(true)]);
      expect(mixed.parse("x")).toBe("x");
      expect(mixed.parse(1)).toBe(1);
      expect(mixed.parse(true)).toBe(true);
    });
  });

  describe("objects", () => {
    it("z.object()", () => {
      const schema = z.object({ a: z.string(), b: z.number() });
      expect(schema.parse({ a: "x", b: 2 })).toEqual({ a: "x", b: 2 });
    });

    it("z.object().strict()", () => {
      const schema = strictObject({ a: z.string() });
      expect(schema.safeParse({ a: "x" }).success).toBe(true);
      expect(schema.safeParse({ a: "x", b: 1 }).success).toBe(false);
    });

    it("z.object().passthrough()", () => {
      const schema = looseObject({ a: z.string() });
      expect(schema.safeParse({ a: "x", b: 1 }).success).toBe(true);
    });

    it("z.record()", () => {
      const schema = z.record(z.string(), z.number());
      expect(schema.parse({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
    });
  });

  describe("arrays and collections", () => {
    it("z.array()", () => {
      expect(z.array(z.number()).parse([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("z.tuple()", () => {
      const t = z.tuple([z.string(), z.number()]);
      expect(t.parse(["x", 2])).toEqual(["x", 2]);
    });

    it("z.tuple().rest()", () => {
      const t = tupleWithRest([z.string(), z.number()], z.boolean());
      const v = t.parse(["a", 1, true, false]);
      expect(v.slice(2)).toEqual([true, false]);
    });

    it("z.map()", () => {
      const schema = z.map(z.string(), z.number());
      const m = schema.parse(new Map([["a", 1]]));
      expect(m.get("a")).toBe(1);
    });

    it("z.set()", () => {
      const schema = z.set(z.number());
      const s = schema.parse(new Set([1, 2]));
      expect(s.has(2)).toBe(true);
    });
  });

  describe("unions and intersections", () => {
    it("z.union() with array", () => {
      const schema = z.union([z.string(), z.number()]);
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(42)).toBe(42);
    });

    it("z.union() with multiple types", () => {
      const u3 = z.union([z.string(), z.number(), z.boolean()]);
      expect(u3.parse(true)).toBe(true);
    });

    it("z.union() fails when no schema matches", () => {
      const schema = z.union([z.string(), z.number()]);
      const result = schema.safeParse(true);
      expect(result.success).toBe(false);
    });

    it("z.intersection()", () => {
      const schema = z.intersection(
        z.object({ a: z.string() }),
        z.object({ b: z.number() })
      );
      expect(schema.parse({ a: "x", b: 1 })).toEqual({ a: "x", b: 1 });
    });

    it("z.discriminatedUnion() - basic", () => {
      const schema = z.discriminatedUnion("type", [
        z.object({ type: z.literal("success"), data: z.string() }),
        z.object({ type: z.literal("error"), message: z.string() }),
      ]);
      expect(schema.parse({ type: "success", data: "hello" })).toEqual({ type: "success", data: "hello" });
      expect(schema.parse({ type: "error", message: "oops" })).toEqual({ type: "error", message: "oops" });
    });

    it("z.discriminatedUnion() - invalid discriminator", () => {
      const schema = z.discriminatedUnion("type", [
        z.object({ type: z.literal("a"), value: z.string() }),
        z.object({ type: z.literal("b"), value: z.number() }),
      ]);
      expect(schema.safeParse({ type: "c", value: "x" }).success).toBe(false);
    });

    it("z.discriminatedUnion() - number discriminator", () => {
      const schema = z.discriminatedUnion("code", [
        z.object({ code: z.literal(200), data: z.string() }),
        z.object({ code: z.literal(404), error: z.string() }),
      ]);
      expect(schema.parse({ code: 200, data: "ok" })).toEqual({ code: 200, data: "ok" });
      expect(schema.parse({ code: 404, error: "not found" })).toEqual({ code: 404, error: "not found" });
    });
  });

  describe("coercion", () => {
    it("z.coerce.string()", () => {
      expect(z.coerce.string().parse(123)).toBe("123");
    });

    it("z.coerce.number()", () => {
      expect(z.coerce.number().parse("12")).toBe(12);
    });

    it("z.coerce.boolean()", () => {
      expect(z.coerce.boolean().parse("true")).toBe(true);
    });

    it("z.coerce.bigint()", () => {
      expect(z.coerce.bigint().parse("5")).toBe(5n);
    });

    it("z.coerce.date()", () => {
      const d = z.coerce.date().parse("2024-01-01");
      expect(d instanceof Date).toBe(true);
    });
  });

  describe("lazy", () => {
    it("z.lazy() for recursive types", () => {
      type Tree = { value: string; children: Tree[] };
      const TreeSchema: z.ZodType<Tree> = z.lazy(() =>
        z.object({
          value: z.string(),
          children: z.array(TreeSchema),
        })
      );
      const node: Tree = {
        value: "root",
        children: [{ value: "leaf", children: [] }],
      };
      expect(TreeSchema.parse(node)).toEqual(node);
    });
  });

  describe("promise", () => {
    it("z.promise() wraps schema for promise validation", async () => {
      const schema = z.promise(z.number());
      const result = await schema.parseAsync(Promise.resolve(42));
      expect(result).toBe(42);
    });

    it("z.promise() rejects invalid resolved value", async () => {
      const schema = z.promise(z.number());
      const result = await schema.safeParseAsync(Promise.resolve("not a number"));
      expect(result.success).toBe(false);
    });
  });
});


describe("[🌍] Real World Workarounds", () => {
  describe("instanceof workaround", () => {
    it("validates class instances using refine", () => {
      class User {
        constructor(public name: string) {}
      }
      
      const schema = z.unknown().refine(
        (v): v is User => v instanceof User,
        "Must be a User instance"
      );
      
      const user = new User("Alice");
      expect(schema.parse(user)).toBe(user);
      expect(schema.safeParse({ name: "Bob" }).success).toBe(false);
    });

    it("validates Date instances", () => {
      const schema = z.unknown().refine(
        (v): v is Date => v instanceof Date,
        "Must be a Date"
      );
      
      expect(schema.parse(new Date())).toBeInstanceOf(Date);
      expect(schema.safeParse("2024-01-01").success).toBe(false);
    });
  });

  describe("preprocess workaround", () => {
    it("transforms input before validation using transform", () => {
      // Preprocess: trim whitespace before validating
      const schema = z.string().transform((s) => s.trim());
      
      expect(schema.parse("  hello  ")).toBe("hello");
      expect(schema.parse("world")).toBe("world");
    });

    it("coerces string to number then validates", () => {
      // Preprocess: convert string to number
      const schema = z.coerce.number().refine((n) => n > 0, "Must be positive");
      
      expect(schema.parse("42")).toBe(42);
      expect(schema.safeParse("-5").success).toBe(false);
    });
  });

  describe("custom schema workaround", () => {
    it("creates custom validation using refine", () => {
      // Custom: validate hex color
      const hexColor = z.string().refine(
        (s) => /^#[0-9A-Fa-f]{6}$/.test(s),
        "Invalid hex color"
      );
      
      expect(hexColor.parse("#FF0000")).toBe("#FF0000");
      expect(hexColor.safeParse("red").success).toBe(false);
      expect(hexColor.safeParse("#GGG").success).toBe(false);
    });

    it("creates custom validation using superRefine for detailed errors", () => {
      // Custom: validate password strength
      const strongPassword = z.string().superRefine((val, ctx) => {
        if (val.length < 8) {
          ctx.addIssue({ code: "custom", message: "At least 8 characters", path: [] });
        }
        if (!/[A-Z]/.test(val)) {
          ctx.addIssue({ code: "custom", message: "At least one uppercase", path: [] });
        }
        if (!/[0-9]/.test(val)) {
          ctx.addIssue({ code: "custom", message: "At least one number", path: [] });
        }
      });
      
      expect(strongPassword.parse("Password1")).toBe("Password1");
      expect(strongPassword.safeParse("weak").success).toBe(false);
    });
  });

  describe("pipe workaround", () => {
    it("chains transforms manually instead of pipe", () => {
      // Zod: z.string().pipe(z.coerce.number()).pipe(z.number().positive())
      // Kanon: chain transforms
      const schema = z.string()
        .transform((s) => Number(s))
        .refine((n) => !isNaN(n), "Must be a valid number")
        .refine((n) => n > 0, "Must be positive");
      
      expect(schema.parse("42")).toBe(42);
      expect(schema.safeParse("abc").success).toBe(false);
      expect(schema.safeParse("-5").success).toBe(false);
    });
  });

  describe("brand workaround", () => {
    it("uses type assertions for branded types", () => {
      // Zod: z.string().brand<"UserId">()
      // Kanon: use type assertion after validation
      type UserId = string & { readonly __brand: "UserId" };
      
      const userIdSchema = z.string().refine(
        (s) => s.startsWith("user_"),
        "Must start with user_"
      );
      
      const parseUserId = (input: unknown): UserId => {
        return userIdSchema.parse(input) as UserId;
      };
      
      const id: UserId = parseUserId("user_123");
      expect(id).toBe("user_123");
      expect(() => parseUserId("invalid")).toThrow();
    });
  });
});


describe("[📖] Documentation Examples Verification", () => {
  describe("Basic Schema (from doc)", () => {
    it("validates user schema from documentation", () => {
      const userSchema = z.object({
        id: z.number(),
        name: z.string(),
        active: z.boolean(),
      });

      expect(userSchema.parse({ id: 1, name: "Alice", active: true })).toEqual({
        id: 1,
        name: "Alice",
        active: true,
      });
      expect(userSchema.safeParse({ id: "1", name: "Alice", active: true }).success).toBe(false);
    });
  });

  describe("With Optional/Nullable (from doc)", () => {
    it("validates profile schema from documentation", () => {
      const profileSchema = z.object({
        username: z.string(),
        bio: z.string().optional(),
        avatar: z.string().nullable(),
        nickname: z.string().nullish(),
      });

      // All fields provided
      expect(profileSchema.parse({
        username: "alice",
        bio: "Hello",
        avatar: "https://example.com/avatar.png",
        nickname: "Ali",
      })).toEqual({
        username: "alice",
        bio: "Hello",
        avatar: "https://example.com/avatar.png",
        nickname: "Ali",
      });

      // Optional fields missing
      expect(profileSchema.parse({
        username: "bob",
        avatar: null,
      })).toEqual({
        username: "bob",
        avatar: null,
      });

      // Nullish accepts null, undefined, or value
      expect(profileSchema.parse({ username: "charlie", avatar: null, nickname: null })).toBeDefined();
      expect(profileSchema.parse({ username: "dave", avatar: null, nickname: undefined })).toBeDefined();
    });
  });

  describe("Union Types (from doc)", () => {
    it("validates status schema from documentation", () => {
      const statusSchema = z.union([
        z.literal("pending"),
        z.literal("approved"),
        z.literal("rejected"),
      ]);

      expect(statusSchema.parse("pending")).toBe("pending");
      expect(statusSchema.parse("approved")).toBe("approved");
      expect(statusSchema.parse("rejected")).toBe("rejected");
      expect(statusSchema.safeParse("unknown").success).toBe(false);
    });

    it("validates response schema from documentation", () => {
      const responseSchema = z.object({
        data: z.union([z.string(), z.number()]),
      });

      expect(responseSchema.parse({ data: "hello" })).toEqual({ data: "hello" });
      expect(responseSchema.parse({ data: 42 })).toEqual({ data: 42 });
      expect(responseSchema.safeParse({ data: true }).success).toBe(false);
    });
  });

  describe("Coercion (from doc)", () => {
    it("z.coerce.string() converts to string", () => {
      expect(z.coerce.string().parse(123)).toBe("123");
      expect(z.coerce.string().parse(true)).toBe("true");
    });

    it("z.coerce.number() converts to number", () => {
      expect(z.coerce.number().parse("42")).toBe(42);
      expect(z.coerce.number().parse("3.14")).toBe(3.14);
    });

    it("z.coerce.boolean() converts to boolean", () => {
      // Note: Boolean("false") === true in JS (non-empty string is truthy)
      expect(z.coerce.boolean().parse("true")).toBe(true);
      expect(z.coerce.boolean().parse("")).toBe(false);
      expect(z.coerce.boolean().parse(1)).toBe(true);
      expect(z.coerce.boolean().parse(0)).toBe(false);
    });

    it("z.coerce.bigint() converts to bigint", () => {
      expect(z.coerce.bigint().parse("123")).toBe(123n);
    });

    it("z.coerce.date() converts to Date", () => {
      const result = z.coerce.date().parse("2024-01-01");
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe("Refinements (from doc)", () => {
    it(".refine() adds custom validation", () => {
      const positiveNumber = z.number().refine((n) => n > 0, "Must be positive");
      
      expect(positiveNumber.parse(5)).toBe(5);
      expect(positiveNumber.safeParse(-1).success).toBe(false);
    });

    it(".superRefine() adds detailed custom validation", () => {
      const schema = z.string().superRefine((val, ctx) => {
        if (val.length < 3) {
          ctx.addIssue({ code: "custom", message: "Too short", path: [] });
        }
      });

      expect(schema.parse("hello")).toBe("hello");
      expect(schema.safeParse("ab").success).toBe(false);
    });
  });

  describe("Transforms (from doc)", () => {
    it(".transform() modifies the output", () => {
      const schema = z.string().transform((s) => s.toUpperCase());
      expect(schema.parse("hello")).toBe("HELLO");
    });

    it(".array() wraps schema in array", () => {
      const schema = z.string().array();
      expect(schema.parse(["a", "b", "c"])).toEqual(["a", "b", "c"]);
    });
  });

  describe("Operators (from doc)", () => {
    it("z.union() accepts any of the schemas", () => {
      const schema = z.union([z.string(), z.number()]);
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(42)).toBe(42);
    });

    it("z.intersection() requires both schemas", () => {
      const schema = z.intersection(
        z.object({ a: z.string() }),
        z.object({ b: z.number() })
      );
      expect(schema.parse({ a: "x", b: 1 })).toEqual({ a: "x", b: 1 });
    });

    it("z.discriminatedUnion() uses discriminator field", () => {
      const schema = z.discriminatedUnion("type", [
        z.object({ type: z.literal("success"), data: z.string() }),
        z.object({ type: z.literal("error"), message: z.string() }),
      ]);

      expect(schema.parse({ type: "success", data: "ok" })).toEqual({ type: "success", data: "ok" });
      expect(schema.parse({ type: "error", message: "fail" })).toEqual({ type: "error", message: "fail" });
    });

    it(".or() is alias for union", () => {
      const schema = z.string().or(z.number());
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(42)).toBe(42);
    });

    it(".and() is alias for intersection", () => {
      const schema = z.object({ a: z.string() }).and(z.object({ b: z.number() }));
      expect(schema.parse({ a: "x", b: 1 })).toEqual({ a: "x", b: 1 });
    });
  });

  describe("Wrappers (from doc)", () => {
    it(".optional() accepts undefined", () => {
      const schema = z.string().optional();
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(undefined)).toBeUndefined();
    });

    it(".nullable() accepts null", () => {
      const schema = z.string().nullable();
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(null)).toBeNull();
    });

    it(".nullish() accepts null or undefined", () => {
      const schema = z.string().nullish();
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeUndefined();
    });

    it(".default() provides fallback value", () => {
      const schema = z.string().default("fallback");
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(undefined)).toBe("fallback");
    });

    it(".readonly() marks as readonly", () => {
      const schema = z.string().readonly();
      expect(schema.parse("hello")).toBe("hello");
    });

    it("z.lazy() enables recursive schemas", () => {
      type Node = { value: string; children: Node[] };
      const nodeSchema: z.ZodType<Node> = z.lazy(() =>
        z.object({
          value: z.string(),
          children: z.array(nodeSchema),
        })
      );

      const tree: Node = {
        value: "root",
        children: [
          { value: "child1", children: [] },
          { value: "child2", children: [{ value: "grandchild", children: [] }] },
        ],
      };
      expect(nodeSchema.parse(tree)).toEqual(tree);
    });

    it(".catch() provides fallback on error", () => {
      const schema = z.string().catch("default");
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(123)).toBe("default");
    });
  });

  describe("Composites (from doc)", () => {
    it("z.object() validates object shape", () => {
      const schema = z.object({ name: z.string(), age: z.number() });
      expect(schema.parse({ name: "Alice", age: 30 })).toEqual({ name: "Alice", age: 30 });
    });

    it("z.array() validates arrays", () => {
      const schema = z.array(z.number());
      expect(schema.parse([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("z.tuple() validates fixed-length arrays", () => {
      const schema = z.tuple([z.string(), z.number()]);
      expect(schema.parse(["hello", 42])).toEqual(["hello", 42]);
    });

    it("z.record() validates key-value pairs", () => {
      const schema = z.record(z.string(), z.number());
      expect(schema.parse({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it("z.map() validates Map objects", () => {
      const schema = z.map(z.string(), z.number());
      const map = new Map([["a", 1], ["b", 2]]);
      expect(schema.parse(map)).toEqual(map);
    });

    it("z.set() validates Set objects", () => {
      const schema = z.set(z.number());
      const set = new Set([1, 2, 3]);
      expect(schema.parse(set)).toEqual(set);
    });
  });

  describe("Primitives (from doc)", () => {
    it("z.string()", () => expect(z.string().parse("hello")).toBe("hello"));
    it("z.number()", () => expect(z.number().parse(42)).toBe(42));
    it("z.boolean()", () => expect(z.boolean().parse(true)).toBe(true));
    it("z.bigint()", () => expect(z.bigint().parse(123n)).toBe(123n));
    it("z.date()", () => {
      const d = new Date();
      expect(z.date().parse(d)).toEqual(d);
    });
    it("z.symbol()", () => {
      const s = Symbol("test");
      expect(typeof z.symbol().parse(s)).toBe("symbol");
    });
    it("z.undefined()", () => expect(z.undefined().parse(undefined)).toBeUndefined());
    it("z.null()", () => expect(z.null().parse(null)).toBeNull());
    it("z.void()", () => expect(z.void().parse(undefined)).toBeUndefined());
    it("z.any()", () => expect(z.any().parse("anything")).toBe("anything"));
    it("z.unknown()", () => expect(z.unknown().parse({ x: 1 })).toEqual({ x: 1 }));
    it("z.never()", () => expect(z.never().safeParse("x").success).toBe(false));
    it("z.literal()", () => expect(z.literal("hello").parse("hello")).toBe("hello"));
    it("z.enum()", () => expect(z.enum(["a", "b", "c"]).parse("b")).toBe("b"));
  });

  describe("Migration Guide Examples (from doc)", () => {
    it("JWT regex workaround", () => {
      const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
      const jwtSchema = z.string().refine(
        (s) => jwtRegex.test(s),
        "Invalid JWT"
      );

      const validJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
      expect(jwtSchema.parse(validJwt)).toBe(validJwt);
      expect(jwtSchema.safeParse("not-a-jwt").success).toBe(false);
    });

    it("pipe workaround with transform", () => {
      // Zod: z.string().pipe(z.coerce.number()).brand<"UserId">()
      // Kanon: chain transforms manually
      const schema = z.string().transform(Number);
      
      expect(schema.parse("42")).toBe(42);
    });
  });

  describe("Object modes (Kanon extras)", () => {
    it("z.object().strict() rejects extra keys", () => {
      const schema = strictObject({ name: z.string() });
      
      expect(schema.parse({ name: "Alice" })).toEqual({ name: "Alice" });
      expect(schema.safeParse({ name: "Alice", extra: "field" }).success).toBe(false);
    });

    it("z.object().passthrough() allows extra keys", () => {
      const schema = looseObject({ name: z.string() });
      
      expect(schema.safeParse({ name: "Alice", extra: "field" }).success).toBe(true);
    });
  });

  describe("Promise support", () => {
    it("z.promise() validates resolved value", async () => {
      const schema = z.promise(z.number());
      
      const result = await schema.parseAsync(Promise.resolve(42));
      expect(result).toBe(42);
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  describe("z.string()", () => {
    itProp.prop([fc.string()])("[🎲] should parse any string", (value) => {
      expect(z.string().parse(value)).toBe(value);
    });

    itProp.prop([fc.oneof(fc.integer(), fc.boolean())])(
      "[🎲] should fail for non-string values",
      (value) => {
        expect(z.string().safeParse(value).success).toBe(false);
      }
    );
  });

  describe("z.number()", () => {
    itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])("[🎲] should parse any number", (value) => {
      expect(z.number().parse(value)).toBe(value);
    });

    itProp.prop([fc.oneof(fc.string(), fc.boolean())])(
      "[🎲] should fail for non-number values",
      (value) => {
        expect(z.number().safeParse(value).success).toBe(false);
      }
    );
  });

  describe("z.boolean()", () => {
    itProp.prop([fc.boolean()])("[🎲] should parse any boolean", (value) => {
      expect(z.boolean().parse(value)).toBe(value);
    });
  });

  describe("z.array()", () => {
    itProp.prop([fc.array(fc.string())])("[🎲] should parse any string array", (value) => {
      expect(z.array(z.string()).parse(value)).toEqual(value);
    });

    itProp.prop([fc.array(fc.integer())])("[🎲] should parse any number array", (value) => {
      expect(z.array(z.number()).parse(value)).toEqual(value);
    });
  });

  describe("z.object()", () => {
    itProp.prop([fc.record({ name: fc.string(), age: fc.integer() })])(
      "[🎲] should parse valid objects",
      (value) => {
        const schema = z.object({ name: z.string(), age: z.number() });
        expect(schema.parse(value)).toEqual(value);
      }
    );
  });

  describe("z.union()", () => {
    itProp.prop([fc.oneof(fc.string(), fc.integer())])(
      "[🎲] should accept string or number",
      (value) => {
        const schema = z.union([z.string(), z.number()]);
        expect(schema.safeParse(value).success).toBe(true);
      }
    );
  });

  describe("z.coerce.string()", () => {
    itProp.prop([fc.oneof(fc.string(), fc.integer(), fc.boolean())])(
      "[🎲] should coerce any primitive to string",
      (value) => {
        const result = z.coerce.string().parse(value);
        expect(typeof result).toBe("string");
      }
    );
  });

  describe("z.coerce.number()", () => {
    itProp.prop([fc.stringMatching(/^-?\d+$/)])(
      "[🎲] should coerce numeric strings to number",
      (value) => {
        const result = z.coerce.number().parse(value);
        expect(typeof result).toBe("number");
      }
    );
  });

  describe("z.literal()", () => {
    itProp.prop([fc.constantFrom("a", "b", "c")])(
      "[🎲] should parse matching literal values",
      (value) => {
        const schema = z.literal(value);
        expect(schema.parse(value)).toBe(value);
      }
    );
  });

  describe("z.tuple()", () => {
    itProp.prop([fc.tuple(fc.string(), fc.integer())])(
      "[🎲] should parse valid tuples",
      (value) => {
        const schema = z.tuple([z.string(), z.number()]);
        expect(schema.parse(value)).toEqual(value);
      }
    );
  });
});

describe("[👾] Mutation Tests", () => {
  describe("z.union() validation", () => {
    it("[👾] throws when given empty array", () => {
      expect(() => z.union([] as unknown as [z.ZodTypeAny, z.ZodTypeAny])).toThrow(
        "z.union requires an array of at least 2 schemas"
      );
    });

    it("[👾] throws when given single schema", () => {
      expect(() => z.union([z.string()] as unknown as [z.ZodTypeAny, z.ZodTypeAny])).toThrow(
        "z.union requires an array of at least 2 schemas"
      );
    });

    it("[👾] throws when given non-array", () => {
      expect(() => z.union("not an array" as unknown as [z.ZodTypeAny, z.ZodTypeAny])).toThrow(
        "z.union requires an array of at least 2 schemas"
      );
    });
  });

  describe("z.object() transforms use entries", () => {
    it("[👾] partial() uses schemaWithEntries correctly", () => {
      const schema = z.object({ name: z.string(), age: z.number() });
      const partialSchema = schema.partial();
      
      // Should accept object with missing fields
      expect(partialSchema.parse({ name: "Alice" })).toEqual({ name: "Alice" });
      expect(partialSchema.parse({ age: 30 })).toEqual({ age: 30 });
      expect(partialSchema.parse({})).toEqual({});
    });

    it("[👾] required() uses schemaWithEntries correctly", () => {
      const schema = z.object({ 
        name: z.string(), 
        age: z.number().optional() 
      });
      const requiredSchema = schema.required();
      
      // Should require all fields including previously optional ones
      expect(requiredSchema.parse({ name: "Alice", age: 30 })).toEqual({ name: "Alice", age: 30 });
      expect(requiredSchema.safeParse({ name: "Alice" }).success).toBe(false);
    });

    it("[👾] pick() uses schemaWithEntries correctly", () => {
      const schema = z.object({ name: z.string(), age: z.number(), email: z.string() });
      const pickedSchema = schema.pick({ name: true, email: true });
      
      // Should only validate picked fields
      expect(pickedSchema.parse({ name: "Alice", email: "alice@example.com" })).toEqual({ 
        name: "Alice", 
        email: "alice@example.com" 
      });
      // Should not require omitted fields
      expect(pickedSchema.safeParse({ name: "Alice", email: "alice@example.com", age: 30 }).success).toBe(true);
    });

    it("[👾] omit() uses schemaWithEntries correctly", () => {
      const schema = z.object({ name: z.string(), age: z.number(), email: z.string() });
      const omittedSchema = schema.omit({ age: true });
      
      // Should validate without omitted fields
      expect(omittedSchema.parse({ name: "Alice", email: "alice@example.com" })).toEqual({ 
        name: "Alice", 
        email: "alice@example.com" 
      });
    });

    it("[👾] keyof() uses schemaWithEntries correctly", () => {
      const schema = z.object({ name: z.string(), age: z.number() });
      const keyofSchema = schema.keyof();
      
      // Should validate keys of the object
      expect(keyofSchema.parse("name")).toBe("name");
      expect(keyofSchema.parse("age")).toBe("age");
      expect(keyofSchema.safeParse("unknown").success).toBe(false);
    });

    it("[🎯] pick() ignores keys not in shape", () => {
      const schema = z.object({ name: z.string(), age: z.number() });
      // Pick a key that doesn't exist in the shape — the false branch of "key in currentEntries"
      const picked = schema.pick({ name: true, nonExistent: true } as Record<string, true>);
      // nonExistent is picked but has no entry, so only name is validated
      expect(picked.safeParse({ name: "Alice", nonExistent: "x" }).success).toBe(true);
    });
  });

  describe("z.promise() edge cases", () => {
    it("[🎯] parseAsync with non-Promise value", async () => {
      const schema = z.promise(z.number());
      const result = await schema.parseAsync(42);
      expect(result).toBe(42);
    });

    it("[🎯] safeParseAsync with non-Promise value", async () => {
      const schema = z.promise(z.string());
      const result = await schema.safeParseAsync("hello");
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe("hello");
    });
  });
});
