import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { lazy } from "./lazy";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { array } from "../composites/array";
import { object } from "../composites/object";
import { optional } from "./optional";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { Schema } from "../../types/base";
import { cast } from "@arkhe/test/private-access";

describe("lazy", () => {
  describe("validation", () => {
    it("should accept valid value", () => {
      const schema = lazy(() => string());

      expect(parse(schema, "test").success).toBe(true);
      expect(parse(schema, "another").success).toBe(true);
    });

    it("should reject invalid value", () => {
      const schema = lazy(() => string());

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should evaluate schema only once", () => {
      let callCount = 0;
      const schema = lazy(() => {
        callCount++;
        return string();
      });

      parse(schema, "test");
      parse(schema, "another");
      parse(schema, "third");

      expect(callCount).toBe(1);
    });

    it("should cache schema after first evaluation", () => {
      let callCount = 0;
      const schema = lazy(() => {
        callCount++;
        return string();
      });

      expect(parse(schema, "test").success).toBe(true);
      expect(callCount).toBe(1);

      expect(parse(schema, "another").success).toBe(true);
      expect(callCount).toBe(1);
    });

    it("should work with number schema", () => {
      const schema = lazy(() => number());

      expect(parse(schema, 42).success).toBe(true);
      expect(parse(schema, "42").success).toBe(false);
    });

    it("should work with array schema", () => {
      const schema = lazy(() => array(string()));

      expect(parse(schema, ["a", "b"]).success).toBe(true);
      expect(parse(schema, [1, 2]).success).toBe(false);
    });

    it("should work with object schema", () => {
      const schema = lazy(() => object({ name: string() }));

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, { name: 123 }).success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Custom error";
      const schema = lazy(() => string(), customMessage);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = lazy(() => string());

      const result = parse(schema, "test");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("string");
        expect(result.data).toBe("test");
      }
    });
  });

  describe("recursive types", () => {
    it("should support recursive object types", () => {
      type TreeNode = {
        value: string;
        children?: TreeNode[];
      };

      // INTENTIONAL: cast required for recursive types due to TypeScript variance
      const treeSchema: Schema<TreeNode> = lazy<TreeNode>(
        () =>
          object({
            value: string(),
            children: optional(array(treeSchema)),
          }) as Schema<TreeNode>
      );

      const validTree = {
        value: "root",
        children: [
          { value: "child1" },
          { value: "child2", children: [{ value: "grandchild" }] },
        ],
      };

      const result = parse(treeSchema, validTree);
      expect(result.success).toBe(true);
    });

    it("should support self-referencing types", () => {
      type Node = {
        id: string;
        next?: Node;
      };

      // INTENTIONAL: cast required for recursive types due to TypeScript variance
      const nodeSchema: Schema<Node> = lazy<Node>(
        () =>
          object({
            id: string(),
            next: optional(nodeSchema),
          }) as Schema<Node>
      );

      const validNode = {
        id: "1",
        next: {
          id: "2",
          next: { id: "3" },
        },
      };

      const result = parse(nodeSchema, validNode);
      expect(result.success).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle getter that throws error", () => {
      const schema = lazy(() => {
        throw new Error("Getter error");
      });

      expect(() => parse(schema, "test")).toThrow("Getter error");
    });

    it("should handle getter that returns invalid schema", () => {
      const schema = lazy(() => cast<Schema<string>>(null));

      expect(() => parse(schema, "test")).toThrow();
    });

    it("should evaluate schema on first validation call", () => {
      let evaluated = false;
      const schema = lazy(() => {
        evaluated = true;
        return string();
      });

      expect(evaluated).toBe(false);
      parse(schema, "test");
      expect(evaluated).toBe(true);
    });

    it("should work with multiple lazy schemas", () => {
      const schema1 = lazy(() => string());
      const schema2 = lazy(() => number());

      expect(parse(schema1, "test").success).toBe(true);
      expect(parse(schema2, 42).success).toBe(true);
      expect(parse(schema1, 123).success).toBe(false);
      expect(parse(schema2, "test").success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("deferred evaluation", () => {
      it("[🎯] should not evaluate the getter immediately when lazy is called (Req 24.1)", () => {
        const getter = vi.fn(() => string());
        lazy(getter);

        // Getter should NOT be called at schema creation time
        expect(getter).not.toHaveBeenCalled();
      });

      it("[🎯] should only evaluate getter on first validation, not on schema creation (Req 24.1)", () => {
        let evaluationTime: "creation" | "validation" | null = null;

        const schema = lazy(() => {
          evaluationTime = "validation";
          return string();
        });

        // At this point, getter should not have been called
        expect(evaluationTime).toBe(null);

        // Now validate - this should trigger evaluation
        parse(schema, "test");
        expect(evaluationTime).toBe("validation");
      });
    });

    describe("caching", () => {
      it("[🎯] should cache the schema after first evaluation (Req 24.2)", () => {
        const getter = vi.fn(() => string());
        const schema = lazy(getter);

        // First validation triggers evaluation
        parse(schema, "test");
        expect(getter).toHaveBeenCalledTimes(1);

        // Second validation should use cached schema
        parse(schema, "another");
        expect(getter).toHaveBeenCalledTimes(1);
      });

      it("[🎯] should reuse the cached schema for multiple validations (Req 24.3)", () => {
        const innerSchema = string();
        const getter = vi.fn(() => innerSchema);
        const schema = lazy(getter);

        // Validate multiple times
        parse(schema, "first");
        parse(schema, "second");
        parse(schema, "third");
        parse(schema, "fourth");
        parse(schema, "fifth");

        // Getter should only be called once
        expect(getter).toHaveBeenCalledTimes(1);
      });

      it("[🎯] should return same validation results from cached schema (Req 24.3)", () => {
        const getter = vi.fn(() => string());
        const schema = lazy(getter);

        // All validations should work correctly with cached schema
        expect(parse(schema, "valid1").success).toBe(true);
        expect(parse(schema, "valid2").success).toBe(true);
        expect(parse(schema, 123).success).toBe(false);
        expect(parse(schema, null).success).toBe(false);

        // Still only one getter call
        expect(getter).toHaveBeenCalledTimes(1);
      });
    });

    describe("recursion", () => {
      it("[🎯] should handle circular references in recursive schemas (Req 24.4)", () => {
        // Define a recursive linked list type
        type LinkedList = {
          value: number;
          next?: LinkedList;
        };

        // INTENTIONAL: cast required for recursive types due to TypeScript variance
        const linkedListSchema: Schema<LinkedList> = lazy<LinkedList>(
          () =>
            object({
              value: number(),
              next: optional(linkedListSchema),
            }) as Schema<LinkedList>
        );

        // Test deeply nested structure (circular reference pattern)
        const deepList = {
          value: 1,
          next: {
            value: 2,
            next: {
              value: 3,
              next: {
                value: 4,
                next: {
                  value: 5,
                },
              },
            },
          },
        };

        const result = parse(linkedListSchema, deepList);
        expect(result.success).toBe(true);
      });

      it("[🎯] should handle recursive tree structures with multiple children (Req 24.4)", () => {
        type TreeNode = {
          id: string;
          children?: TreeNode[];
        };

        // INTENTIONAL: cast required for recursive types due to TypeScript variance
        const treeSchema: Schema<TreeNode> = lazy<TreeNode>(
          () =>
            object({
              id: string(),
              children: optional(array(treeSchema)),
            }) as Schema<TreeNode>
        );

        // Test tree with multiple levels and branches
        const tree = {
          id: "root",
          children: [
            {
              id: "child1",
              children: [{ id: "grandchild1a" }, { id: "grandchild1b" }],
            },
            {
              id: "child2",
              children: [
                {
                  id: "grandchild2a",
                  children: [{ id: "great-grandchild" }],
                },
              ],
            },
          ],
        };

        const result = parse(treeSchema, tree);
        expect(result.success).toBe(true);
      });

      it("[🎯] should reject invalid values in recursive structures (Req 24.4)", () => {
        type Node = {
          value: string;
          child?: Node;
        };

        // INTENTIONAL: cast required for recursive types due to TypeScript variance
        const nodeSchema: Schema<Node> = lazy<Node>(
          () =>
            object({
              value: string(),
              child: optional(nodeSchema),
            }) as Schema<Node>
        );

        // Invalid: nested value is wrong type
        const invalidNode = {
          value: "root",
          child: {
            value: 123, // Should be string
          },
        };

        const result = parse(nodeSchema, invalidNode);
        expect(result.success).toBe(false);
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    describe("string schema", () => {
      itProp.prop([fc.string()])("[🎲] should accept any string via lazy", (value) => {
        const schema = lazy(() => string());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });

      itProp.prop([fc.oneof(fc.integer(), fc.boolean(), fc.constant(null))])(
        "[🎲] should reject non-string values via lazy",
        (value) => {
          const schema = lazy(() => string());
          expect(parse(schema, value).success).toBe(false);
        }
      );
    });

    describe("number schema", () => {
      itProp.prop([fc.double({ noNaN: true })])("[🎲] should accept any number via lazy", (value) => {
        const schema = lazy(() => number());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });
    });

    describe("array schema", () => {
      itProp.prop([fc.array(fc.string())])("[🎲] should accept any string array via lazy", (value) => {
        const schema = lazy(() => array(string()));
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(value);
        }
      });
    });

    describe("object schema", () => {
      itProp.prop([fc.record({ name: fc.string(), age: fc.integer() })])(
        "[🎲] should accept valid objects via lazy",
        (value) => {
          const schema = lazy(() => object({ name: string(), age: number() }));
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toEqual(value);
          }
        }
      );
    });

    describe("caching behavior", () => {
      itProp.prop([fc.array(fc.string(), { minLength: 2, maxLength: 10 })])(
        "[🎲] should cache schema and reuse for multiple validations",
        (values) => {
          let callCount = 0;
          const schema = lazy(() => {
            callCount++;
            return string();
          });

          // Validate all values
          for (const value of values) {
            parse(schema, value);
          }

          // Getter should only be called once regardless of validation count
          expect(callCount).toBe(1);
        }
      );
    });
  });
});
