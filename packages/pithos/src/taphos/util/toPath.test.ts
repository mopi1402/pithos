import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toPath } from "./toPath";

describe("toPath", () => {
  it("converts dot notation path", () => {
    expect(toPath("a.b.c")).toEqual(["a", "b", "c"]);
  });

  it("converts bracket notation", () => {
    expect(toPath("a[0].b.c")).toEqual(["a", "0", "b", "c"]);
  });

  it("handles mixed notation", () => {
    expect(toPath("a[0][1].b")).toEqual(["a", "0", "1", "b"]);
  });

  it("[🎯] returns empty array for null", () => {
    expect(toPath(null)).toEqual([]);
  });

  it("[🎯] returns empty array for empty string", () => {
    expect(toPath("")).toEqual([]);
  });

  itProp.prop([fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 1, maxLength: 5 })])(
    "[🎲] dot-joined path splits correctly",
    (parts) => {
      const path = parts.join(".");
      expect(toPath(path)).toEqual(parts);
    }
  );
});
