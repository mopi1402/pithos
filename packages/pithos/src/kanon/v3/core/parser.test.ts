import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { parse, parseBulk, type ParseBulkOptions } from "./parser";
import type { Schema } from "../types/base";

describe("parse", () => {
  it("should return success with data when validator returns true", () => {
    const mockValidator = vi.fn().mockReturnValue(true);
    const schema: Schema<string> = {
      type: "string",
      validator: mockValidator,
    };
    const input = "test";

    const result = parse(schema, input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(input);
    }
    expect(mockValidator).toHaveBeenCalledWith(input);
    expect(mockValidator).toHaveBeenCalledTimes(1);
  });

  it("should return error when validator returns error string", () => {
    const errorMessage = "Validation failed";
    const mockValidator = vi.fn().mockReturnValue(errorMessage);
    const schema: Schema<string> = {
      type: "string",
      validator: mockValidator,
    };
    const input = "invalid";

    const result = parse(schema, input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(errorMessage);
    }
    expect(mockValidator).toHaveBeenCalledWith(input);
    expect(mockValidator).toHaveBeenCalledTimes(1);
  });

  it("should handle different input types", () => {
    const mockValidator = vi.fn().mockReturnValue(true);
    const schema: Schema<number> = {
      type: "number",
      validator: mockValidator,
    };

    const numberInput = 42;
    const result = parse(schema, numberInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(numberInput);
    }
  });

  it("should handle complex objects", () => {
    const mockValidator = vi.fn().mockReturnValue(true);
    const schema: Schema<{ name: string; age: number }> = {
      type: "object",
      validator: mockValidator,
    };
    const input = { name: "John", age: 30 };

    const result = parse(schema, input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(input);
    }
  });

  it("should handle null input", () => {
    const mockValidator = vi.fn().mockReturnValue(true);
    const schema: Schema<null> = {
      type: "null",
      validator: mockValidator,
    };

    const result = parse(schema, null);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(null);
    }
  });

  it("should handle undefined input", () => {
    const mockValidator = vi.fn().mockReturnValue("Expected value");
    const schema: Schema<string> = {
      type: "string",
      validator: mockValidator,
    };

    const result = parse(schema, undefined);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Expected value");
    }
  });

  it("should preserve input data without transformation", () => {
    const mockValidator = vi.fn().mockReturnValue(true);
    const schema: Schema<unknown> = {
      type: "any",
      validator: mockValidator,
    };
    const input = { nested: { deep: "value" } };

    const result = parse(schema, input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(input);
      expect(result.data).toEqual({ nested: { deep: "value" } });
    }
  });

  it("should return coerced value when validator returns CoercedResult", () => {
    const coercedValue = 42;
    const mockValidator = vi.fn().mockReturnValue({ coerced: coercedValue });
    const schema: Schema<number> = {
      type: "number",
      validator: mockValidator,
    };
    const input = "42";

    const result = parse(schema, input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(coercedValue);
    }
    expect(mockValidator).toHaveBeenCalledWith(input);
  });

  describe("[🎯] Specification Tests", () => {
    it("[🎯] should pass null to validator when input is null (Req 12.3)", () => {
      const mockValidator = vi.fn().mockReturnValue(true);
      const schema: Schema<null> = {
        type: "null",
        validator: mockValidator,
      };

      const result = parse(schema, null);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(null);
      }
      // Validator should receive null as input
      expect(mockValidator).toHaveBeenCalledWith(null);
      expect(mockValidator).toHaveBeenCalledTimes(1);
    });
  });
});

describe("parseBulk", () => {
  describe("with earlyAbort = false (default)", () => {
    it("should return success with all data when all validations pass", () => {
      const mockValidator = vi.fn().mockReturnValue(true);
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const values = ["value1", "value2", "value3"];

      const result = parseBulk(schema, values);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(values);
        expect(result.data).toHaveLength(3);
      }
      expect(mockValidator).toHaveBeenCalledTimes(3);
    });

    it("should collect all errors when some validations fail", () => {
      const mockValidator = vi
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce("Error at index 1")
        .mockReturnValueOnce("Error at index 2");
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const values = ["valid", "invalid1", "invalid2"];

      const result = parseBulk(schema, values);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(2);
        expect(result.errors[0]).toBe("Index 1: Error at index 1");
        expect(result.errors[1]).toBe("Index 2: Error at index 2");
      }
      expect(mockValidator).toHaveBeenCalledTimes(3);
    });

    it("should handle empty array", () => {
      const mockValidator = vi.fn();
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };

      const result = parseBulk(schema, []);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
      expect(mockValidator).not.toHaveBeenCalled();
    });

    it("should handle single item array", () => {
      const mockValidator = vi.fn().mockReturnValue(true);
      const schema: Schema<number> = {
        type: "number",
        validator: mockValidator,
      };
      const values = [42];

      const result = parseBulk(schema, values);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([42]);
      }
    });

    it("should handle coerced values", () => {
      const mockValidator = vi
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce({ coerced: 42 })
        .mockReturnValueOnce(true);
      const schema: Schema<number> = {
        type: "number",
        validator: mockValidator,
      };
      const values = [1, "42", 3];

      const result = parseBulk(schema, values);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([1, 42, 3]);
      }
      expect(mockValidator).toHaveBeenCalledTimes(3);
    });

    it("should handle all items failing", () => {
      const mockValidator = vi
        .fn()
        .mockReturnValueOnce("Error 1")
        .mockReturnValueOnce("Error 2")
        .mockReturnValueOnce("Error 3");
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const values = ["invalid1", "invalid2", "invalid3"];

      const result = parseBulk(schema, values);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(3);
        expect(result.errors[0]).toBe("Index 0: Error 1");
        expect(result.errors[1]).toBe("Index 1: Error 2");
        expect(result.errors[2]).toBe("Index 2: Error 3");
      }
    });

    it("should preserve data order in results", () => {
      const mockValidator = vi.fn().mockReturnValue(true);
      const schema: Schema<number> = {
        type: "number",
        validator: mockValidator,
      };
      const values = [1, 2, 3, 4, 5];

      const result = parseBulk(schema, values);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([1, 2, 3, 4, 5]);
      }
    });
  });

  describe("with earlyAbort = true", () => {
    it("should return success with all data when all validations pass", () => {
      const mockValidator = vi.fn().mockReturnValue(true);
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const values = ["value1", "value2", "value3"];
      const options: ParseBulkOptions = { earlyAbort: true };

      const result = parseBulk(schema, values, options);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(values);
      }
      expect(mockValidator).toHaveBeenCalledTimes(3);
    });

    it("should stop at first validation failure", () => {
      const mockValidator = vi
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce("First error")
        .mockReturnValueOnce("Should not be called");
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const values = ["valid", "invalid1", "invalid2"];
      const options: ParseBulkOptions = { earlyAbort: true };

      const result = parseBulk(schema, values, options);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toBe("Index 1: First error");
      }
      expect(mockValidator).toHaveBeenCalledTimes(2);
    });

    it("should stop immediately if first item fails", () => {
      const mockValidator = vi
        .fn()
        .mockReturnValueOnce("First error")
        .mockReturnValueOnce("Should not be called");
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const values = ["invalid1", "invalid2"];
      const options: ParseBulkOptions = { earlyAbort: true };

      const result = parseBulk(schema, values, options);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toBe("Index 0: First error");
      }
      expect(mockValidator).toHaveBeenCalledTimes(1);
    });

    it("should handle empty array", () => {
      const mockValidator = vi.fn();
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const options: ParseBulkOptions = { earlyAbort: true };

      const result = parseBulk(schema, [], options);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
      expect(mockValidator).not.toHaveBeenCalled();
    });

    it("should handle single item array", () => {
      const mockValidator = vi.fn().mockReturnValue(true);
      const schema: Schema<number> = {
        type: "number",
        validator: mockValidator,
      };
      const values = [42];
      const options: ParseBulkOptions = { earlyAbort: true };

      const result = parseBulk(schema, values, options);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([42]);
      }
    });

    it("should handle coerced values without mutating input array", () => {
      const mockValidator = vi
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce({ coerced: 42 })
        .mockReturnValueOnce(true);
      const schema: Schema<number> = {
        type: "number",
        validator: mockValidator,
      };
      const values: unknown[] = [1, "42", 3];
      const originalValues = [...values]; // Copy to verify immutability
      const options: ParseBulkOptions = { earlyAbort: true };

      const result = parseBulk(schema, values, options);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([1, 42, 3]);
        // In earlyAbort mode, the original array is NOT mutated
        expect(values).toEqual(originalValues);
        expect(values[1]).toBe("42"); // Original value preserved
      }
      expect(mockValidator).toHaveBeenCalledTimes(3);
    });
  });

  describe("with options undefined", () => {
    it("should default to earlyAbort = false", () => {
      const mockValidator = vi
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce("Error 1")
        .mockReturnValueOnce("Error 2");
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const values = ["valid", "invalid1", "invalid2"];

      const result = parseBulk(schema, values, undefined);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(2);
      }
      expect(mockValidator).toHaveBeenCalledTimes(3);
    });
  });

  describe("edge cases", () => {
    it("should handle large arrays", () => {
      const mockValidator = vi.fn().mockReturnValue(true);
      const schema: Schema<number> = {
        type: "number",
        validator: mockValidator,
      };
      const values = Array.from({ length: 1000 }, (_, i) => i);

      const result = parseBulk(schema, values);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1000);
      }
      expect(mockValidator).toHaveBeenCalledTimes(1000);
    });

    it("should handle mixed success and failure with earlyAbort = false", () => {
      const mockValidator = vi
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce("Error")
        .mockReturnValueOnce(true)
        .mockReturnValueOnce("Error")
        .mockReturnValueOnce(true);
      const schema: Schema<string> = {
        type: "string",
        validator: mockValidator,
      };
      const values = ["valid1", "invalid1", "valid2", "invalid2", "valid3"];

      const result = parseBulk(schema, values);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(2);
        expect(result.errors[0]).toBe("Index 1: Error");
        expect(result.errors[1]).toBe("Index 3: Error");
      }
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("parseBulk boundary conditions", () => {
      it("[🎯] should return success with empty data when called with empty array (Req 12.1)", () => {
        const mockValidator = vi.fn();
        const schema: Schema<string> = {
          type: "string",
          validator: mockValidator,
        };

        const result = parseBulk(schema, []);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual([]);
          expect(result.data).toHaveLength(0);
        }
        // Validator should never be called for empty array
        expect(mockValidator).not.toHaveBeenCalled();
      });

      it("[🎯] should validate single element when called with single element array (Req 12.2)", () => {
        const mockValidator = vi.fn().mockReturnValue(true);
        const schema: Schema<number> = {
          type: "number",
          validator: mockValidator,
        };
        const singleValue = 42;

        const result = parseBulk(schema, [singleValue]);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual([singleValue]);
          expect(result.data).toHaveLength(1);
        }
        // Validator should be called exactly once with the single element
        expect(mockValidator).toHaveBeenCalledTimes(1);
        expect(mockValidator).toHaveBeenCalledWith(singleValue);
      });

      it("[🎯] should return immediately with single error when earlyAbort=true encounters first error (Req 12.4)", () => {
        const mockValidator = vi
          .fn()
          .mockReturnValueOnce(true)
          .mockReturnValueOnce("Validation failed")
          .mockReturnValueOnce("Should not be called");
        const schema: Schema<string> = {
          type: "string",
          validator: mockValidator,
        };
        const values = ["valid", "invalid", "also-invalid"];

        const result = parseBulk(schema, values, { earlyAbort: true });

        expect(result.success).toBe(false);
        if (!result.success) {
          // Should have exactly one error (early abort)
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0]).toBe("Index 1: Validation failed");
        }
        // Validator should stop after second call (first error)
        expect(mockValidator).toHaveBeenCalledTimes(2);
      });

      it("[🎯] should collect all errors when earlyAbort=false encounters errors (Req 12.5)", () => {
        const mockValidator = vi
          .fn()
          .mockReturnValueOnce(true)
          .mockReturnValueOnce("Error at 1")
          .mockReturnValueOnce(true)
          .mockReturnValueOnce("Error at 3");
        const schema: Schema<string> = {
          type: "string",
          validator: mockValidator,
        };
        const values = ["valid1", "invalid1", "valid2", "invalid2"];

        const result = parseBulk(schema, values, { earlyAbort: false });

        expect(result.success).toBe(false);
        if (!result.success) {
          // Should collect all errors
          expect(result.errors).toHaveLength(2);
          expect(result.errors[0]).toBe("Index 1: Error at 1");
          expect(result.errors[1]).toBe("Index 3: Error at 3");
        }
        // Validator should be called for all elements
        expect(mockValidator).toHaveBeenCalledTimes(4);
      });

      it("[🎯] should return original array reference when all values are valid and no coercion (Req 12.6)", () => {
        const mockValidator = vi.fn().mockReturnValue(true);
        const schema: Schema<string> = {
          type: "string",
          validator: mockValidator,
        };
        const values = ["a", "b", "c"];

        const result = parseBulk(schema, values, { earlyAbort: true });

        expect(result.success).toBe(true);
        if (result.success) {
          // In earlyAbort mode without coercion, should return same array reference
          expect(result.data).toBe(values);
        }
      });
    });
  });
});


describe("[👾] Mutation Tests", () => {
  it("[👾] should reuse coercedValues array for subsequent coercions (kills: if (!coercedValues) → if (true))", () => {
    // If mutated to `if (true)`, a new array would be created on EVERY coercion,
    // losing previously coerced values. This test verifies that multiple coercions
    // in the same array preserve all coerced values.
    let coercionCount = 0;
    const mockValidator = vi.fn().mockImplementation((value) => {
      if (typeof value === "string" && value.startsWith("coerce")) {
        coercionCount++;
        return { coerced: `COERCED_${coercionCount}` };
      }
      return true;
    });
    const schema: Schema<string> = {
      type: "string",
      validator: mockValidator,
    };
    
    // Multiple coercions: at indices 1 and 3
    // With correct code: coercedValues created at index 1, reused at index 3
    // With mutation: new array created at index 3, losing COERCED_1
    const values = ["a", "coerce1", "b", "coerce2", "c"];
    const result = parseBulk(schema, values, { earlyAbort: true });

    expect(result.success).toBe(true);
    if (result.success) {
      // Critical: BOTH coerced values must be present
      // If mutation applied, COERCED_1 would be lost when new array created at index 3
      expect(result.data[0]).toBe("a");
      expect(result.data[1]).toBe("COERCED_1");
      expect(result.data[2]).toBe("b");
      expect(result.data[3]).toBe("COERCED_2");
      expect(result.data[4]).toBe("c");
    }
  });
});

describe("[🎲] Property-Based Tests", () => {
  describe("parse", () => {
    itProp.prop([fc.anything()])("[🎲] should return success with data when validator returns true", (input) => {
      const mockValidator = vi.fn().mockReturnValue(true);
      const schema: Schema<unknown> = {
        type: "any",
        validator: mockValidator,
      };

      const result = parse(schema, input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(input);
      }
      expect(mockValidator).toHaveBeenCalledWith(input);
    });

    itProp.prop([fc.anything(), fc.string({ minLength: 1 })])(
      "[🎲] should return error when validator returns error string",
      (input, errorMessage) => {
        const mockValidator = vi.fn().mockReturnValue(errorMessage);
        const schema: Schema<unknown> = {
          type: "any",
          validator: mockValidator,
        };

        const result = parse(schema, input);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(errorMessage);
        }
      }
    );

    itProp.prop([fc.anything(), fc.anything()])(
      "[🎲] should return coerced value when validator returns CoercedResult",
      (input, coercedValue) => {
        const mockValidator = vi.fn().mockReturnValue({ coerced: coercedValue });
        const schema: Schema<unknown> = {
          type: "any",
          validator: mockValidator,
        };

        const result = parse(schema, input);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(coercedValue);
        }
      }
    );
  });

  describe("parseBulk", () => {
    itProp.prop([fc.array(fc.anything(), { minLength: 0, maxLength: 20 })])(
      "[🎲] should return success with all data when all validations pass",
      (values) => {
        const mockValidator = vi.fn().mockReturnValue(true);
        const schema: Schema<unknown> = {
          type: "any",
          validator: mockValidator,
        };

        const result = parseBulk(schema, values);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toHaveLength(values.length);
        }
        expect(mockValidator).toHaveBeenCalledTimes(values.length);
      }
    );

    itProp.prop([fc.array(fc.anything(), { minLength: 1, maxLength: 20 }), fc.integer({ min: 0, max: 19 })])(
      "[🎲] should stop at first error with earlyAbort=true",
      (values, failIndex) => {
        const actualFailIndex = Math.min(failIndex, values.length - 1);
        const mockValidator = vi.fn().mockImplementation((_) => {
          // Use call count to determine when to fail
          const callCount = mockValidator.mock.calls.length;
          if (callCount === actualFailIndex + 1) {
            return "Error";
          }
          return true;
        });
        const schema: Schema<unknown> = {
          type: "any",
          validator: mockValidator,
        };

        const result = parseBulk(schema, values, { earlyAbort: true });

        if (actualFailIndex < values.length) {
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.errors).toHaveLength(1);
          }
          // Should stop after the failing index
          expect(mockValidator).toHaveBeenCalledTimes(actualFailIndex + 1);
        }
      }
    );

    itProp.prop([fc.array(fc.anything(), { minLength: 0, maxLength: 10 }), fc.array(fc.anything(), { minLength: 0, maxLength: 10 })])(
      "[🎲] should handle coerced values correctly",
      (originalValues, coercedValues) => {
        const values = originalValues.slice(0, Math.min(originalValues.length, coercedValues.length));
        const coerced = coercedValues.slice(0, values.length);
        
        let callIndex = 0;
        const mockValidator = vi.fn().mockImplementation(() => {
          const result = { coerced: coerced[callIndex] };
          callIndex++;
          return result;
        });
        const schema: Schema<unknown> = {
          type: "any",
          validator: mockValidator,
        };

        const result = parseBulk(schema, values);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toHaveLength(values.length);
          for (let i = 0; i < values.length; i++) {
            expect(result.data[i]).toBe(coerced[i]);
          }
        }
      }
    );
  });
});
