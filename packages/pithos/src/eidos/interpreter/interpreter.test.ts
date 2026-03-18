import { describe, it, expect } from "vitest";
import { interpret } from "./interpreter";

describe("Interpreter Pattern (absorbed by language)", () => {
  describe("interpret (deprecated)", () => {
    it("is just function application with context", () => {
      type Expr = { type: "num"; value: number };
      type Context = Record<string, number>;

      const expr: Expr = { type: "num", value: 42 };
      const ctx: Context = {};
      const evaluator = (e: Expr, _c: Context) => e.value;

      // interpret(expr, ctx, fn) === fn(expr, ctx)
      expect(interpret(expr, ctx, evaluator)).toBe(42);
      expect(evaluator(expr, ctx)).toBe(42);
    });
  });

  describe("arithmetic expression interpreter", () => {
    type Expr =
      | { type: "num"; value: number }
      | { type: "var"; name: string }
      | { type: "add"; left: Expr; right: Expr }
      | { type: "mul"; left: Expr; right: Expr };

    type Context = Record<string, number>;

    const evaluate = (expr: Expr, ctx: Context): number => {
      switch (expr.type) {
        case "num": return expr.value;
        case "var": return ctx[expr.name] ?? 0;
        case "add": return evaluate(expr.left, ctx) + evaluate(expr.right, ctx);
        case "mul": return evaluate(expr.left, ctx) * evaluate(expr.right, ctx);
      }
    };

    it("evaluates literals", () => {
      expect(evaluate({ type: "num", value: 42 }, {})).toBe(42);
    });

    it("evaluates variables from context", () => {
      expect(evaluate({ type: "var", name: "x" }, { x: 10 })).toBe(10);
    });

    it("evaluates compound expressions", () => {
      // (x + 2) * y where x=3, y=4
      const expr: Expr = {
        type: "mul",
        left: {
          type: "add",
          left: { type: "var", name: "x" },
          right: { type: "num", value: 2 },
        },
        right: { type: "var", name: "y" },
      };

      expect(evaluate(expr, { x: 3, y: 4 })).toBe(20);
    });
  });

  describe("boolean expression interpreter", () => {
    type BoolExpr =
      | { type: "true" }
      | { type: "false" }
      | { type: "and"; left: BoolExpr; right: BoolExpr }
      | { type: "or"; left: BoolExpr; right: BoolExpr }
      | { type: "not"; expr: BoolExpr };

    const evalBool = (expr: BoolExpr): boolean => {
      switch (expr.type) {
        case "true": return true;
        case "false": return false;
        case "and": return evalBool(expr.left) && evalBool(expr.right);
        case "or": return evalBool(expr.left) || evalBool(expr.right);
        case "not": return !evalBool(expr.expr);
      }
    };

    it("evaluates boolean literals", () => {
      expect(evalBool({ type: "true" })).toBe(true);
      expect(evalBool({ type: "false" })).toBe(false);
    });

    it("evaluates boolean operations", () => {
      // not (true and false) = true
      const expr: BoolExpr = {
        type: "not",
        expr: {
          type: "and",
          left: { type: "true" },
          right: { type: "false" },
        },
      };

      expect(evalBool(expr)).toBe(true);
    });

    it("evaluates complex expressions", () => {
      // (true or false) and (not false) = true
      const expr: BoolExpr = {
        type: "and",
        left: {
          type: "or",
          left: { type: "true" },
          right: { type: "false" },
        },
        right: {
          type: "not",
          expr: { type: "false" },
        },
      };

      expect(evalBool(expr)).toBe(true);
    });
  });

  describe("string DSL interpreter", () => {
    type StrExpr =
      | { type: "lit"; value: string }
      | { type: "concat"; parts: StrExpr[] }
      | { type: "upper"; expr: StrExpr }
      | { type: "repeat"; expr: StrExpr; times: number };

    const evalStr = (expr: StrExpr): string => {
      switch (expr.type) {
        case "lit": return expr.value;
        case "concat": return expr.parts.map(evalStr).join("");
        case "upper": return evalStr(expr.expr).toUpperCase();
        case "repeat": return evalStr(expr.expr).repeat(expr.times);
      }
    };

    it("evaluates string DSL", () => {
      // upper(concat("hello", " ", repeat("!", 3))) = "HELLO !!!"
      const expr: StrExpr = {
        type: "upper",
        expr: {
          type: "concat",
          parts: [
            { type: "lit", value: "hello" },
            { type: "lit", value: " " },
            { type: "repeat", expr: { type: "lit", value: "!" }, times: 3 },
          ],
        },
      };

      expect(evalStr(expr)).toBe("HELLO !!!");
    });
  });
});
