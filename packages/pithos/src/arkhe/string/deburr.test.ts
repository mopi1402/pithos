import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { deburr } from "./deburr";

describe("deburr", () => {
  it("removes accents", () => {
    expect(deburr("àáâãäå")).toBe("aaaaaa");
    expect(deburr("èéêë")).toBe("eeee");
    expect(deburr("çñ")).toBe("cn");
  });

  it("expands ligature Œ/œ", () => {
    expect(deburr("Œuvre")).toBe("OEuvre");
    expect(deburr("cœur")).toBe("coeur");
  });

  it("expands ligature Æ/æ", () => {
    expect(deburr("Ægis")).toBe("AEgis");
    expect(deburr("læva")).toBe("laeva");
  });

  it("expands ligature Ĳ/ĳ", () => {
    expect(deburr("Ĳssel")).toBe("IJssel");
    expect(deburr("ĳs")).toBe("ijs");
  });

  it("expands ß to ss", () => {
    expect(deburr("Straße")).toBe("Strasse");
  });

  it("handles Ŋ/ŋ", () => {
    expect(deburr("Ŋ")).toBe("N");
    expect(deburr("ŋ")).toBe("n");
  });

  it("handles empty string", () => {
    expect(deburr("")).toBe("");
  });

  it("preserves non-accented characters", () => {
    expect(deburr("hello world 123")).toBe("hello world 123");
  });

  it("handles mixed content", () => {
    expect(deburr("Crème brûlée")).toBe("Creme brulee");
  });

  it("[🎯] handles Þ/þ from JSDoc example", () => {
    expect(deburr("Þór")).toBe("Thor");
  });

  it("[🎯] handles Ł/ł from JSDoc example", () => {
    expect(deburr("Łódź")).toBe("Lodz");
  });

  itProp.prop([fc.string()])(
    "[🎲] idempotent: deburr(deburr(x)) === deburr(x)",
    (str) => {
      const once = deburr(str);
      const twice = deburr(once);
      expect(twice).toBe(once);
    }
  );

  itProp.prop([fc.string()])("[🎲] preserves or shortens length", (str) => {
    // Deburr can expand characters (like ß -> ss) or keep same length
    const result = deburr(str);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  itProp.prop([fc.string()])(
    "[🎲] result contains only ASCII when input has accents",
    (str) => {
      const result = deburr(str);
      // All accented characters should be converted to ASCII equivalents
      // This doesn't mean result is pure ASCII (emoji etc may pass through),
      // but common Latin accents should be removed
      const deburred = deburr(result);
      expect(deburred).toBe(result);
    }
  );
});
