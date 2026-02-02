import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { tuple, tupleOf, tupleOf3, tupleOf4, tupleWithRest } from "./tuple";
import { parse } from "../../core/parser";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { coerceBoolean } from "../coerce/boolean";
import { coerceNumber } from "../coerce/number";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("tuple", () => {
  it("should validate tuple with correct length and types", () => {
    const schema = tuple([string(), number()]);
    const value = ["hello", 42];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should validate tuple with multiple types", () => {
    const schema = tuple([string(), number(), boolean()]);
    const value = ["test", 123, true];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject non-array values", () => {
    const schema = tuple([string(), number()]);

    const invalidCases = [
      {},
      "string",
      42,
      null,
      undefined,
      new Map(),
      new Set(),
    ];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.tuple);
      }
    });
  });

  it("should reject array with wrong length", () => {
    const schema = tuple([string(), number()]);

    const invalidCases = [
      ["hello"],
      ["hello", 42, "extra"],
      [],
      ["hello", 42, "extra", "more"],
    ];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Expected tuple of length");
      }
    });
  });

  it("should reject tuple with invalid type at specific index", () => {
    const schema = tuple([string(), number()]);
    const value = ["hello", "invalid"];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Index 1:");
    }
  });

  it("should report correct index for invalid items", () => {
    const schema = tuple([string(), number(), boolean()]);
    const value = ["valid", "invalid", true];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Index 1:");
    }
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom tuple error";
    const schema = tuple([string(), number()], customMessage);
    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should use custom message for wrong length when provided", () => {
    const customMessage = "Custom length error";
    const schema = tuple([string(), number()], customMessage);
    const result = parse(schema, ["only one"]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should validate tuple with complex schemas", () => {
    const mockValidator1 = vi.fn().mockReturnValue(true);
    const mockValidator2 = vi.fn().mockReturnValue(true);
    const schema1 = {
      type: "string" as const,
      validator: mockValidator1,
    };
    const schema2 = {
      type: "object" as const,
      validator: mockValidator2,
    };
    const schema = tuple([schema1, schema2]);
    const value = ["test", { id: 1 }];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    expect(mockValidator1).toHaveBeenCalledWith("test");
    expect(mockValidator2).toHaveBeenCalledWith({ id: 1 });
  });

  it("should return schema with correct type", () => {
    const schema = tuple([string(), number()]);

    expect(schema.type).toBe("tuple");
    expect(schema.items).toHaveLength(2);
  });

  describe("coercion", () => {
    it("should coerce tuple elements", () => {
      const schema = tuple([coerceBoolean(), coerceNumber()]);
      const value = [1, "42"];

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0]).toBe(true);
        expect(result.data[1]).toBe(42);
      }
    });

    it("should coerce first element and copy subsequent valid elements", () => {
      // This tests the branch where coercedArray exists and a valid element is copied
      const schema = tuple([coerceBoolean(), boolean()]);
      const value = [1, true]; // 1 coerced to true, true is valid (copied to coercedArray)

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0]).toBe(true);
        expect(result.data[1]).toBe(true);
      }
    });
  });
});

describe("tupleOf", () => {
  it("should validate tuple of two elements", () => {
    const schema = tupleOf(string(), number());
    const value = ["hello", 42];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject tuple with wrong length", () => {
    const schema = tupleOf(string(), number());
    const value = ["hello"];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom tupleOf error";
    const schema = tupleOf(string(), number(), customMessage);
    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });
});

describe("tupleOf3", () => {
  it("should validate tuple of three elements", () => {
    const schema = tupleOf3(string(), number(), boolean());
    const value = ["hello", 42, true];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject tuple with wrong length", () => {
    const schema = tupleOf3(string(), number(), boolean());
    const value = ["hello", 42];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom tupleOf3 error";
    const schema = tupleOf3(string(), number(), boolean(), customMessage);
    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });
});

describe("tupleOf4", () => {
  it("should validate tuple of four elements", () => {
    const schema = tupleOf4(string(), number(), boolean(), string());
    const value = ["a", 1, true, "b"];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject tuple with wrong length", () => {
    const schema = tupleOf4(string(), number(), boolean(), string());
    const value = ["a", 1, true];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom tupleOf4 error";
    const schema = tupleOf4(string(), number(), boolean(), string(), customMessage);
    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });
});

describe("tupleWithRest", () => {
  it("should validate tuple with rest elements", () => {
    const schema = tupleWithRest([string(), number()], boolean());
    const value = ["hello", 42, true, false, true];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should validate tuple with exact fixed length (no rest)", () => {
    const schema = tupleWithRest([string(), number()], boolean());
    const value = ["hello", 42];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject tuple shorter than fixed schemas", () => {
    const schema = tupleWithRest([string(), number()], boolean());
    const value = ["hello"];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Expected tuple of at least length");
    }
  });

  it("should reject non-array values", () => {
    const schema = tupleWithRest([string(), number()], boolean());
    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.tuple);
    }
  });

  it("should reject tuple with invalid fixed element", () => {
    const schema = tupleWithRest([string(), number()], boolean());
    const value = ["hello", "invalid", true];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Index 1:");
    }
  });

  it("should reject tuple with invalid rest element", () => {
    const schema = tupleWithRest([string(), number()], boolean());
    const value = ["hello", 42, "invalid"];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Index 2:");
    }
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom tupleWithRest error";
    const schema = tupleWithRest(
      [string(), number()],
      boolean(),
      customMessage
    );
    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should use custom message for too short tuple when provided", () => {
    const customMessage = "Custom length error";
    const schema = tupleWithRest(
      [string(), number()],
      boolean(),
      customMessage
    );
    const result = parse(schema, ["only one"]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should validate tuple with many rest elements", () => {
    const schema = tupleWithRest([string()], number());
    const value = ["hello", 1, 2, 3, 4, 5];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  describe("coercion", () => {
    it("should coerce fixed elements", () => {
      const schema = tupleWithRest([coerceBoolean(), coerceNumber()], boolean());
      const value = [1, "42", true];

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0]).toBe(true);
        expect(result.data[1]).toBe(42);
        expect(result.data[2]).toBe(true);
      }
    });

    it("should coerce rest elements", () => {
      const schema = tupleWithRest([string()], coerceBoolean());
      const value = ["hello", 1, 0, "yes"];

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0]).toBe("hello");
        expect(result.data[1]).toBe(true);
        expect(result.data[2]).toBe(false);
        expect(result.data[3]).toBe(true);
      }
    });

    it("should coerce first fixed element and copy subsequent valid fixed elements", () => {
      // This tests the branch where coercedArray exists and a valid fixed element is copied
      const schema = tupleWithRest([coerceBoolean(), boolean()], boolean());
      const value = [1, true, false]; // 1 coerced, true valid (copied), false is rest

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0]).toBe(true);
        expect(result.data[1]).toBe(true);
        expect(result.data[2]).toBe(false);
      }
    });

    it("should coerce first rest element and copy subsequent valid rest elements", () => {
      // This tests the branch where coercedArray exists and a valid rest element is copied
      const schema = tupleWithRest([string()], coerceBoolean());
      const value = ["hello", 1, true]; // "hello" valid, 1 coerced, true valid (copied)

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0]).toBe("hello");
        expect(result.data[1]).toBe(true);
        expect(result.data[2]).toBe(true);
      }
    });

    it("should handle coercion starting in rest elements", () => {
      // Fixed elements are valid, coercion starts in rest
      const schema = tupleWithRest([string(), number()], coerceBoolean());
      const value = ["hello", 42, 1, 0];

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0]).toBe("hello");
        expect(result.data[1]).toBe(42);
        expect(result.data[2]).toBe(true);
        expect(result.data[3]).toBe(false);
      }
    });
  });
});

describe("[🎯] Specification Tests", () => {
  describe("tuple boundary conditions", () => {
    // Requirements 8.1, 8.6: Empty tuple
    it("[🎯] should only accept empty array when tuple([]) is called", () => {
      const schema = tuple([]);
      
      // Empty array should be accepted
      const emptyResult = parse(schema, []);
      expect(emptyResult.success).toBe(true);
      
      // Non-empty array should be rejected
      const nonEmptyResult = parse(schema, [1]);
      expect(nonEmptyResult.success).toBe(false);
      if (!nonEmptyResult.success) {
        expect(nonEmptyResult.error).toContain("Expected tuple of length 0");
      }
    });

    // Requirement 8.2: Extra elements
    it("[🎯] should reject array with extra elements beyond tuple length", () => {
      const schema = tuple([string(), number()]);
      const value = ["hello", 42, "extra"];

      const result = parse(schema, value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Expected tuple of length 2");
      }
    });

    // Requirement 8.3: Fewer elements
    it("[🎯] should reject array with fewer elements than tuple length", () => {
      const schema = tuple([string(), number(), boolean()]);
      const value = ["hello", 42];

      const result = parse(schema, value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Expected tuple of length 3");
      }
    });
  });

  describe("tupleWithRest boundary conditions", () => {
    // Requirement 8.4: Exact fixed length
    it("[🎯] should accept array with exactly the fixed length (no rest elements)", () => {
      const schema = tupleWithRest([string(), number()], boolean());
      const value = ["hello", 42];

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(["hello", 42]);
      }
    });

    // Requirement 8.5: Shorter than fixed length
    it("[🎯] should reject array shorter than fixed length", () => {
      const schema = tupleWithRest([string(), number(), boolean()], string());
      const value = ["hello", 42];

      const result = parse(schema, value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Expected tuple of at least length 3");
      }
    });
  });

  describe("tupleOf variants", () => {
    // Requirement 33.1: tupleOf with 2 elements
    it("[🎯] should create a 2-element tuple with tupleOf", () => {
      const schema = tupleOf(string(), number());
      
      // Valid 2-element tuple
      const validResult = parse(schema, ["hello", 42]);
      expect(validResult.success).toBe(true);
      
      // Wrong length should fail
      const wrongLengthResult = parse(schema, ["hello"]);
      expect(wrongLengthResult.success).toBe(false);
      
      const tooManyResult = parse(schema, ["hello", 42, true]);
      expect(tooManyResult.success).toBe(false);
    });

    // Requirement 33.2: tupleOf3 with 3 elements
    it("[🎯] should create a 3-element tuple with tupleOf3", () => {
      const schema = tupleOf3(string(), number(), boolean());
      
      // Valid 3-element tuple
      const validResult = parse(schema, ["hello", 42, true]);
      expect(validResult.success).toBe(true);
      
      // Wrong length should fail
      const wrongLengthResult = parse(schema, ["hello", 42]);
      expect(wrongLengthResult.success).toBe(false);
      
      const tooManyResult = parse(schema, ["hello", 42, true, "extra"]);
      expect(tooManyResult.success).toBe(false);
    });

    // Requirement 33.3: tupleOf4 with 4 elements
    it("[🎯] should create a 4-element tuple with tupleOf4", () => {
      const schema = tupleOf4(string(), number(), boolean(), string());
      
      // Valid 4-element tuple
      const validResult = parse(schema, ["hello", 42, true, "world"]);
      expect(validResult.success).toBe(true);
      
      // Wrong length should fail
      const wrongLengthResult = parse(schema, ["hello", 42, true]);
      expect(wrongLengthResult.success).toBe(false);
      
      const tooManyResult = parse(schema, ["hello", 42, true, "world", 5]);
      expect(tooManyResult.success).toBe(false);
    });

    // Requirement 33.4: tupleWithRest validates rest elements
    it("[🎯] should validate rest elements when more elements than fixed are provided", () => {
      const schema = tupleWithRest([string()], number());
      
      // Valid: fixed + rest elements
      const validResult = parse(schema, ["hello", 1, 2, 3]);
      expect(validResult.success).toBe(true);
      if (validResult.success) {
        expect(validResult.data).toEqual(["hello", 1, 2, 3]);
      }
    });

    // Requirement 33.5: tupleWithRest rejects invalid rest element
    it("[🎯] should reject when rest element is invalid", () => {
      const schema = tupleWithRest([string()], number());
      
      // Invalid: rest element is not a number
      const invalidResult = parse(schema, ["hello", 1, "invalid", 3]);
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.error).toContain("Index 2:");
      }
    });
  });
});

describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.string(), fc.integer()])(
    "[🎲] accepts any [string, number] tuple",
    (str, num) => {
      const schema = tuple([string(), number()]);
      const result = parse(schema, [str, num]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([str, num]);
      }
    }
  );

  itProp.prop([fc.string(), fc.integer(), fc.boolean()])(
    "[🎲] accepts any [string, number, boolean] tuple",
    (str, num, bool) => {
      const schema = tuple([string(), number(), boolean()]);
      const result = parse(schema, [str, num, bool]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([str, num, bool]);
      }
    }
  );

  itProp.prop([fc.string(), fc.integer()])(
    "[🎲] does not mutate original tuple array",
    (str, num) => {
      const value = [str, num];
      const original = [...value];
      const schema = tuple([string(), number()]);
      parse(schema, value);
      expect(value).toEqual(original);
    }
  );

  itProp.prop([fc.string(), fc.array(fc.integer())])(
    "[🎲] tupleWithRest accepts fixed + any number of rest elements",
    (str, nums) => {
      const schema = tupleWithRest([string()], number());
      const value = [str, ...nums];
      const result = parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBe(value.length);
      }
    }
  );

  itProp.prop([fc.anything(), fc.anything()])(
    "[🎲] coercion preserves tuple length",
    (a, b) => {
      const schema = tuple([coerceBoolean(), coerceNumber()]);
      const value = [a, b];
      const result = parse(schema, value);
      // coerceNumber may fail for non-coercible values
      if (result.success) {
        expect(result.data.length).toBe(2);
      }
    }
  );
});
