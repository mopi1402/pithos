import { describe, it, expect } from "vitest";
import { visit } from "./visitor";

describe("Visitor Pattern (absorbed by language)", () => {
  // The pattern is fully absorbed by discriminated unions + switch.
  // These tests demonstrate idiomatic usage.

  type Shape =
    | { type: "circle"; radius: number }
    | { type: "rectangle"; width: number; height: number }
    | { type: "triangle"; base: number; height: number };

  describe("visit (deprecated)", () => {
    it("is just function application", () => {
      const shape: Shape = { type: "circle", radius: 5 };
      const area = (s: Shape): number => {
        switch (s.type) {
          case "circle": return Math.PI * s.radius ** 2;
          case "rectangle": return s.width * s.height;
          case "triangle": return (s.base * s.height) / 2;
        }
      };

      // visit(value, fn) === fn(value)
      expect(visit(shape, area)).toBeCloseTo(Math.PI * 25);
      expect(area(shape)).toBeCloseTo(Math.PI * 25);
    });
  });

  describe("discriminated union + switch", () => {
    it("dispatches based on type discriminant", () => {
      const area = (shape: Shape): number => {
        switch (shape.type) {
          case "circle": return Math.PI * shape.radius ** 2;
          case "rectangle": return shape.width * shape.height;
          case "triangle": return (shape.base * shape.height) / 2;
        }
      };

      expect(area({ type: "circle", radius: 1 })).toBeCloseTo(Math.PI);
      expect(area({ type: "rectangle", width: 3, height: 4 })).toBe(12);
      expect(area({ type: "triangle", base: 6, height: 4 })).toBe(12);
    });

    it("TypeScript narrows type in each case", () => {
      const describe = (shape: Shape): string => {
        switch (shape.type) {
          case "circle":
            // TypeScript knows shape.radius exists here
            return `Circle with radius ${shape.radius}`;
          case "rectangle":
            // TypeScript knows shape.width and shape.height exist here
            return `Rectangle ${shape.width}x${shape.height}`;
          case "triangle":
            return `Triangle base=${shape.base}`;
        }
      };

      expect(describe({ type: "circle", radius: 5 })).toBe("Circle with radius 5");
    });
  });

  describe("multiple visitors on same data", () => {
    it("different functions act as different visitors", () => {
      const areaVisitor = (shape: Shape): number => {
        switch (shape.type) {
          case "circle": return Math.PI * shape.radius ** 2;
          case "rectangle": return shape.width * shape.height;
          case "triangle": return (shape.base * shape.height) / 2;
        }
      };

      const perimeterVisitor = (shape: Shape): number => {
        switch (shape.type) {
          case "circle": return 2 * Math.PI * shape.radius;
          case "rectangle": return 2 * (shape.width + shape.height);
          case "triangle": {
            const hyp = Math.sqrt(shape.base ** 2 + shape.height ** 2);
            return shape.base + shape.height + hyp;
          }
        }
      };

      const shapes: Shape[] = [
        { type: "circle", radius: 1 },
        { type: "rectangle", width: 3, height: 4 },
      ];

      expect(shapes.map(areaVisitor)[0]).toBeCloseTo(Math.PI);
      expect(shapes.map(perimeterVisitor)[0]).toBeCloseTo(2 * Math.PI);
    });
  });

  describe("custom discriminant keys", () => {
    type Result =
      | { _tag: "ok"; value: number }
      | { _tag: "err"; error: string };

    it("works with _tag discriminant", () => {
      const describe = (result: Result): string => {
        switch (result._tag) {
          case "ok": return `Success: ${result.value}`;
          case "err": return `Error: ${result.error}`;
        }
      };

      expect(describe({ _tag: "ok", value: 42 })).toBe("Success: 42");
      expect(describe({ _tag: "err", error: "oops" })).toBe("Error: oops");
    });
  });

  describe("recursive types", () => {
    type Expr =
      | { type: "num"; value: number }
      | { type: "add"; left: Expr; right: Expr }
      | { type: "mul"; left: Expr; right: Expr };

    it("handles recursive evaluation", () => {
      const evaluate = (expr: Expr): number => {
        switch (expr.type) {
          case "num": return expr.value;
          case "add": return evaluate(expr.left) + evaluate(expr.right);
          case "mul": return evaluate(expr.left) * evaluate(expr.right);
        }
      };

      const expr: Expr = {
        type: "add",
        left: { type: "num", value: 1 },
        right: {
          type: "mul",
          left: { type: "num", value: 2 },
          right: { type: "num", value: 3 },
        },
      };

      expect(evaluate(expr)).toBe(7); // 1 + (2 * 3)
    });
  });
});
