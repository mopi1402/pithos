import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { lt } from "./lt";

describe("lt", () => {
  it("returns true when first value is lesser", () => {
    expect(lt(1, 3)).toBe(true);
  });

  it("[🎯] returns false when values are equal", () => {
    expect(lt(3, 3)).toBe(false);
  });

  it("returns false when first value is greater", () => {
    expect(lt(3, 1)).toBe(false);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is equivalent to < operator",
    (a, b) => {
      expect(lt(a, b)).toBe(a < b);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] n is never less than itself",
    (n) => {
      expect(lt(n, n)).toBe(false);
    }
  );
});
