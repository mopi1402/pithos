/**
 * GeneratorContext Tests
 */

import { describe, it, expect } from "vitest";
import {
  createGeneratorContext,
  nextVar,
  pushPath,
  popPath,
  addExternal,
  markVisited,
  hasVisited,
  increaseIndent,
  decreaseIndent,
  getIndent,
  formatPath,
} from "./context";
import { string } from "@kanon/schemas/primitives/string";
import type { GenericSchema } from "@kanon/types/base";

describe("GeneratorContext", () => {
  describe("createGeneratorContext", () => {
    it("should create context with default values", () => {
      const ctx = createGeneratorContext();

      expect(ctx.varCounter).toBe(0);
      expect(ctx.indent).toBe(0);
      expect(ctx.path).toEqual([]);
      expect(ctx.externals.size).toBe(0);
      expect(ctx.debug).toBe(false);
    });

    it("should create context with debug mode enabled", () => {
      const ctx = createGeneratorContext({ debug: true });

      expect(ctx.debug).toBe(true);
    });
  });

  describe("nextVar", () => {
    it("should generate sequential variable names", () => {
      const ctx = createGeneratorContext();

      const [var0, ctx1] = nextVar(ctx);
      expect(var0).toBe("v_0");
      expect(ctx1.varCounter).toBe(1);

      const [var1, ctx2] = nextVar(ctx1);
      expect(var1).toBe("v_1");
      expect(ctx2.varCounter).toBe(2);

      const [var2, ctx3] = nextVar(ctx2);
      expect(var2).toBe("v_2");
      expect(ctx3.varCounter).toBe(3);
    });

    it("should not mutate original context", () => {
      const ctx = createGeneratorContext();
      const [, newCtx] = nextVar(ctx);

      expect(ctx.varCounter).toBe(0);
      expect(newCtx.varCounter).toBe(1);
    });
  });

  describe("pushPath / popPath", () => {
    it("should push path segments", () => {
      let ctx = createGeneratorContext();

      ctx = pushPath(ctx, "user");
      expect(ctx.path).toEqual(["user"]);

      ctx = pushPath(ctx, "address");
      expect(ctx.path).toEqual(["user", "address"]);

      ctx = pushPath(ctx, "city");
      expect(ctx.path).toEqual(["user", "address", "city"]);
    });

    it("should pop path segments", () => {
      let ctx = createGeneratorContext();
      ctx = pushPath(ctx, "user");
      ctx = pushPath(ctx, "address");
      ctx = pushPath(ctx, "city");

      ctx = popPath(ctx);
      expect(ctx.path).toEqual(["user", "address"]);

      ctx = popPath(ctx);
      expect(ctx.path).toEqual(["user"]);

      ctx = popPath(ctx);
      expect(ctx.path).toEqual([]);
    });

    it("should handle pop on empty path", () => {
      const ctx = createGeneratorContext();
      const newCtx = popPath(ctx);

      expect(newCtx.path).toEqual([]);
    });

    it("should not mutate original context", () => {
      const ctx = createGeneratorContext();
      const ctx1 = pushPath(ctx, "user");
      const ctx2 = popPath(ctx1);

      expect(ctx.path).toEqual([]);
      expect(ctx1.path).toEqual(["user"]);
      expect(ctx2.path).toEqual([]);
    });
  });

  describe("addExternal", () => {
    it("should add external functions with sequential names", () => {
      const ctx = createGeneratorContext();
      const fn1 = (v: unknown) => typeof v === "string";
      const fn2 = (v: unknown) => typeof v === "number";

      const [ref1, ctx1] = addExternal(ctx, fn1);
      expect(ref1).toBe("ref_0");
      expect(ctx1.externals.get("ref_0")).toBe(fn1);

      const [ref2, ctx2] = addExternal(ctx1, fn2);
      expect(ref2).toBe("ref_1");
      expect(ctx2.externals.get("ref_1")).toBe(fn2);
    });

    it("should not mutate original context", () => {
      const ctx = createGeneratorContext();
      const fn = (v: unknown) => typeof v === "string";
      const [, newCtx] = addExternal(ctx, fn);

      expect(ctx.externals.size).toBe(0);
      expect(newCtx.externals.size).toBe(1);
    });
  });

  describe("markVisited / hasVisited", () => {
    it("should track visited schemas", () => {
      const schema = string("test") as GenericSchema;
      let ctx = createGeneratorContext();

      expect(hasVisited(ctx, schema)).toBe(false);

      ctx = markVisited(ctx, schema);
      expect(hasVisited(ctx, schema)).toBe(true);
    });

    it("should share visited set across context copies", () => {
      // Note: markVisited mutates the WeakSet because WeakSet is not iterable
      // This is acceptable because visited is only used during a single compilation pass
      const schema = string("test") as GenericSchema;
      const ctx = createGeneratorContext();
      const newCtx = markVisited(ctx, schema);

      // Both contexts share the same WeakSet
      expect(hasVisited(ctx, schema)).toBe(true);
      expect(hasVisited(newCtx, schema)).toBe(true);
    });
  });

  describe("increaseIndent / decreaseIndent", () => {
    it("should increase indent level", () => {
      let ctx = createGeneratorContext();

      ctx = increaseIndent(ctx);
      expect(ctx.indent).toBe(1);

      ctx = increaseIndent(ctx);
      expect(ctx.indent).toBe(2);
    });

    it("should decrease indent level", () => {
      let ctx = createGeneratorContext();
      ctx = increaseIndent(ctx);
      ctx = increaseIndent(ctx);

      ctx = decreaseIndent(ctx);
      expect(ctx.indent).toBe(1);

      ctx = decreaseIndent(ctx);
      expect(ctx.indent).toBe(0);
    });

    it("should not go below zero", () => {
      const ctx = createGeneratorContext();
      const newCtx = decreaseIndent(ctx);

      expect(newCtx.indent).toBe(0);
    });
  });

  describe("getIndent", () => {
    it("should return correct indentation string", () => {
      let ctx = createGeneratorContext();
      expect(getIndent(ctx)).toBe("");

      ctx = increaseIndent(ctx);
      expect(getIndent(ctx)).toBe("  ");

      ctx = increaseIndent(ctx);
      expect(getIndent(ctx)).toBe("    ");

      ctx = increaseIndent(ctx);
      expect(getIndent(ctx)).toBe("      ");
    });
  });

  describe("formatPath", () => {
    it("should return empty string for empty path", () => {
      const ctx = createGeneratorContext();
      expect(formatPath(ctx)).toBe("");
    });

    it("should format simple property path", () => {
      let ctx = createGeneratorContext();
      ctx = pushPath(ctx, "user");
      expect(formatPath(ctx)).toBe("user");

      ctx = pushPath(ctx, "name");
      expect(formatPath(ctx)).toBe("user.name");
    });

    it("should format array indices with brackets", () => {
      let ctx = createGeneratorContext();
      ctx = pushPath(ctx, "items");
      ctx = pushPath(ctx, "0");
      expect(formatPath(ctx)).toBe("items[0]");

      ctx = pushPath(ctx, "name");
      expect(formatPath(ctx)).toBe("items[0].name");
    });

    it("should handle mixed paths", () => {
      let ctx = createGeneratorContext();
      ctx = pushPath(ctx, "users");
      ctx = pushPath(ctx, "0");
      ctx = pushPath(ctx, "addresses");
      ctx = pushPath(ctx, "1");
      ctx = pushPath(ctx, "city");

      expect(formatPath(ctx)).toBe("users[0].addresses[1].city");
    });
  });
});
