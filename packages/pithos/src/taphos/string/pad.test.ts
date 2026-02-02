import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { pad } from "./pad";

describe("pad", () => {
  it("pads string on both sides", () => {
    expect(pad("abc", 8)).toBe("  abc   ");
  });

  it("uses custom padding chars", () => {
    expect(pad("abc", 8, "_-")).toBe("_-abc_-_");
  });

  it("returns original if length is sufficient", () => {
    expect(pad("abc", 3)).toBe("abc");
  });

  it("[🎯] handles null string", () => {
    expect(pad(null, 4)).toBe("    ");
  });

  it("[🎯] handles undefined length", () => {
    expect(pad("abc", undefined)).toBe("abc");
  });

  it("[🎯] uses default space when chars is empty string", () => {
    expect(pad("abc", 8, "")).toBe("  abc   ");
  });

  it("[🎯] uses default space when chars is null", () => {
    expect(pad("abc", 8, null as unknown as string)).toBe("  abc   ");
  });

  itProp.prop([fc.string(), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result length is at least target length or original length",
    (str, length) => {
      const result = pad(str, length);
      expect(result.length).toBeGreaterThanOrEqual(Math.max(str.length, length));
    }
  );

  itProp.prop([fc.string(), fc.integer({ min: 0, max: 100 })])(
    "[🎲] original string is contained in result",
    (str, length) => {
      const result = pad(str, length);
      expect(result).toContain(str);
    }
  );
});
