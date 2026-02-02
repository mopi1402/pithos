import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { capitalize } from "./capitalize";

describe("capitalize", () => {
  it("capitalizes first letter and lowercases rest", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("lowercases uppercase string", () => {
    expect(capitalize("HELLO")).toBe("Hello");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("handles empty string", () => {
    const empty = "";
    const result = capitalize(empty);
    expect(result).toBe("");
    // Verify early return (same reference)
    expect(result).toBe(empty);
  });

  it("handles already capitalized", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("handles mixed case", () => {
    expect(capitalize("hELLo WoRLD")).toBe("Hello world");
  });

  it("[🎯] handles Unicode characters", () => {
    expect(capitalize("été")).toBe("Été");
    expect(capitalize("москва")).toBe("Москва");
    expect(capitalize("ñoño")).toBe("Ñoño");
  });

  itProp.prop([fc.string()])(
    "[🎲] always returns same length string",
    (str) => {
      expect(capitalize(str)).toHaveLength(str.length);
    }
  );

  itProp.prop([fc.string({ minLength: 1 })])(
    "[🎲] first character is uppercase if alphabetic",
    (str) => {
      const result = capitalize(str);
      const firstChar = result[0];
      if (/[a-zà-ÿ]/i.test(firstChar)) {
        expect(firstChar).toBe(firstChar.toUpperCase());
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] idempotent: capitalize(capitalize(x)) === capitalize(x)",
    (str) => {
      const once = capitalize(str);
      const twice = capitalize(once);
      expect(twice).toBe(once);
    }
  );
});
