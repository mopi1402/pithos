import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { split } from "./split";

describe("split", () => {
  it("splits string by separator", () => {
    expect(split("a-b-c", "-")).toEqual(["a", "b", "c"]);
  });

  it("respects limit", () => {
    expect(split("a-b-c", "-", 2)).toEqual(["a", "b"]);
  });

  it("[🎯] handles null string", () => {
    expect(split(null, "-")).toEqual([""]);
  });

  it("handles regex separator", () => {
    expect(split("a1b2c", /\d/)).toEqual(["a", "b", "c"]);
  });

  itProp.prop([fc.array(fc.stringMatching(/^[a-zA-Z0-9]+$/), { minLength: 1, maxLength: 10 })])(
    "[🎲] split then join returns original (with unique separator)",
    (parts) => {
      const sep = "|||";
      const str = parts.join(sep);
      expect(split(str, sep)).toEqual(parts);
    }
  );

  itProp.prop([fc.string(), fc.string({ minLength: 1 })])(
    "[🎲] consistent with native String.prototype.split",
    (str, sep) => {
      expect(split(str, sep)).toEqual(str.split(sep));
    }
  );
});
