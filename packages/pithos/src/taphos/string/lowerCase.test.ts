import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { lowerCase } from "./lowerCase";

describe("lowerCase", () => {
  it("converts to lower case with spaces", () => {
    expect(lowerCase("--Foo-Bar--")).toBe("foo bar");
  });

  it("handles camelCase", () => {
    expect(lowerCase("fooBar")).toBe("foo bar");
  });

  it("handles snake_case", () => {
    expect(lowerCase("__FOO_BAR__")).toBe("foo bar");
  });

  it("handles string starting with uppercase", () => {
    expect(lowerCase("Foo")).toBe("foo");
    expect(lowerCase("FooBar")).toBe("foo bar");
  });

  it("[🎯] returns empty string for null", () => {
    expect(lowerCase(null)).toBe("");
  });

  it("[🎯] returns empty string for undefined", () => {
    expect(lowerCase(undefined)).toBe("");
  });

  itProp.prop([fc.string()])("[🎲] result contains only lowercase letters", (str) => {
    const result = lowerCase(str);
    expect(result).toBe(result.toLowerCase());
  });

  itProp.prop([fc.string()])("[🎲] idempotent - applying twice gives same result", (str) => {
    const once = lowerCase(str);
    const twice = lowerCase(once);
    expect(once).toBe(twice);
  });
});
