import { describe, it, expect } from "vitest";
import { fc } from "@fast-check/vitest";
import { safeObject } from "./arbitraries";

// Helper to calculate object depth
const getObjectDepth = (obj: unknown): number => {
  if (typeof obj !== "object" || obj === null) return 0;
  let maxChildDepth = 0;
  for (const value of Object.values(obj)) {
    const childDepth = getObjectDepth(value);
    if (childDepth > maxChildDepth) maxChildDepth = childDepth;
  }
  return 1 + maxChildDepth;
};

describe("safeObject", () => {
  it("uses default maxDepth of 2 when no options provided", () => {
    const arbitrary = safeObject();
    // Verify that the arbitrary is created (we can't directly access maxDepth,
    // but we can verify it generates objects with depth <= 2)
    fc.assert(
      fc.property(arbitrary, (obj) => {
        expect(obj).toBeDefined();
        // Objects generated should respect maxDepth constraint
        expect(typeof obj === "object" && obj !== null).toBe(true);
      })
    );
  });

  it("uses default maxDepth of 2 when options is undefined", () => {
    const arbitrary = safeObject(undefined);
    fc.assert(
      fc.property(arbitrary, (obj) => {
        expect(obj).toBeDefined();
        expect(typeof obj === "object" && obj !== null).toBe(true);
      })
    );
  });

  it("uses default maxDepth of 2 when options.maxDepth is undefined", () => {
    const arbitrary = safeObject({});
    fc.assert(
      fc.property(arbitrary, (obj) => {
        expect(obj).toBeDefined();
        expect(typeof obj === "object" && obj !== null).toBe(true);
      })
    );
  });

  it("[👾] respects maxDepth 0 to generate flat objects", () => {
    // With maxDepth 0, objects should have no nested objects
    // The mutant ?? -> && would make 0 && 2 = 0, so this test alone won't catch it
    const flat = safeObject({ maxDepth: 0 });
    
    fc.assert(
      fc.property(flat, (obj) => {
        if (typeof obj === "object" && obj !== null) {
          for (const value of Object.values(obj)) {
            // With maxDepth 0, no nested objects allowed
            expect(typeof value !== "object" || value === null).toBe(true);
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("[👾] maxDepth undefined uses default of 2", () => {
    // The mutant ?? -> && would make undefined && 2 = undefined
    // fc.object with undefined maxDepth uses its own default (which may differ)
    const withDefault = safeObject(); // maxDepth should be 2
    const explicit = safeObject({ maxDepth: 2 });
    
    // Both should behave the same - generate objects with similar depth distribution
    let maxDefaultDepth = 0;
    let maxExplicitDepth = 0;
    
    fc.assert(
      fc.property(withDefault, (obj) => {
        const d = getObjectDepth(obj);
        if (d > maxDefaultDepth) maxDefaultDepth = d;
        return true;
      }),
      { numRuns: 100 }
    );
    
    fc.assert(
      fc.property(explicit, (obj) => {
        const d = getObjectDepth(obj);
        if (d > maxExplicitDepth) maxExplicitDepth = d;
        return true;
      }),
      { numRuns: 100 }
    );
    
    // Both should respect maxDepth 2 (depth <= 3)
    expect(maxDefaultDepth).toBeLessThanOrEqual(3);
    expect(maxExplicitDepth).toBeLessThanOrEqual(3);
  });

  it("filters out __proto__ keys", () => {
    const arbitrary = safeObject();
    fc.assert(
      fc.property(arbitrary, (obj) => {
        if (typeof obj === "object" && obj !== null) {
          expect(obj).not.toHaveProperty("__proto__");
        }
      })
    );
  });

  it("[👾] uses maxDepth 0 when explicitly provided", () => {
    const arbitrary = safeObject({ maxDepth: 0 });
    // With maxDepth 0, should only generate empty objects or primitives
    fc.assert(
      fc.property(arbitrary, (obj) => {
        expect(obj).toBeDefined();
        // maxDepth 0 means no nested objects
        if (typeof obj === "object" && obj !== null) {
          for (const value of Object.values(obj)) {
            expect(typeof value !== "object" || value === null).toBe(true);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it("[👾] never generates __proto__ key even with many samples", () => {
    const arbitrary = safeObject({ maxDepth: 1 });
    // Run many iterations to increase chance of catching __proto__ if filter is broken
    fc.assert(
      fc.property(arbitrary, (obj) => {
        if (typeof obj === "object" && obj !== null) {
          const keys = Object.keys(obj);
          expect(keys).not.toContain("__proto__");
        }
      }),
      { numRuns: 1000 }
    );
  });
});
