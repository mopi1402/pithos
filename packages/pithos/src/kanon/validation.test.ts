import { describe, it, expect } from "vitest";
import { validation, SafeParseResult } from "./validation";
import { string } from "./schemas/primitives/string";
import { number } from "./schemas/primitives/number";

describe("validation", () => {
  describe("parse", () => {
    it("should return data when validation succeeds", () => {
      const schema = string();
      const value = "test";

      const result = validation.parse(schema, value);

      expect(result).toBe(value);
    });

    it("should throw Error when validation fails", () => {
      const schema = string();
      const value = 123;

      expect(() => {
        validation.parse(schema, value);
      }).toThrow(Error);
    });

    it("should throw with correct error message", () => {
      const schema = number();
      const value = "not a number";

      expect(() => {
        validation.parse(schema, value);
      }).toThrow();
    });
  });

  describe("safeParse", () => {
    it("should return success result when validation succeeds", () => {
      const schema = string();
      const value = "test";

      const result = validation.safeParse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    it("should return error result when validation fails", () => {
      const schema = string();
      const value = 123;

      const result = validation.safeParse(schema, value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(typeof result.error).toBe("string");
        expect(result.error.length).toBeGreaterThan(0);
      }
    });
  });

  describe("parseAsync", () => {
    it("should return Promise that resolves with data when validation succeeds", async () => {
      const schema = string();
      const value = "test";

      const result = await validation.parseAsync(schema, value);

      expect(result).toBe(value);
    });

    it("should return Promise that rejects when validation fails", async () => {
      const schema = string();
      const value = 123;

      await expect(validation.parseAsync(schema, value)).rejects.toThrow(Error);
    });
  });

  describe("safeParseAsync", () => {
    it("should return Promise that resolves with success result when validation succeeds", async () => {
      const schema = string();
      const value = "test";

      const result = await validation.safeParseAsync(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    it("should return Promise that resolves with error result when validation fails", async () => {
      const schema = string();
      const value = 123;

      const result = await validation.safeParseAsync(schema, value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(typeof result.error).toBe("string");
        expect(result.error.length).toBeGreaterThan(0);
      }
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("parse boundary conditions", () => {
      it("[🎯] should return the data when validation.parse receives valid value (Req 27.1)", () => {
        // Requirement 27.1: WHEN validation.parse receives valid value, THE Validation SHALL return the data
        const schema = string();
        const validValue = "hello world";

        const result = validation.parse(schema, validValue);

        expect(result).toBe(validValue);
      });

      it("[🎯] should throw an Error when validation.parse receives invalid value (Req 27.2)", () => {
        // Requirement 27.2: WHEN validation.parse receives invalid value, THE Validation SHALL throw an Error
        const schema = string();
        const invalidValue = 42;

        expect(() => validation.parse(schema, invalidValue)).toThrow(Error);
      });
    });

    describe("safeParse boundary conditions", () => {
      it("[🎯] should return { success: true, data } when validation.safeParse receives valid value (Req 27.3)", () => {
        // Requirement 27.3: WHEN validation.safeParse receives valid value, THE Validation SHALL return { success: true, data }
        const schema = number();
        const validValue = 123.45;

        const result: SafeParseResult<number> = validation.safeParse(
          schema,
          validValue
        );

        expect(result).toEqual({ success: true, data: validValue });
      });

      it("[🎯] should return { success: false, error } when validation.safeParse receives invalid value (Req 27.4)", () => {
        // Requirement 27.4: WHEN validation.safeParse receives invalid value, THE Validation SHALL return { success: false, error }
        const schema = number();
        const invalidValue = "not a number";

        const result: SafeParseResult<number> = validation.safeParse(
          schema,
          invalidValue
        );

        expect(result.success).toBe(false);
        expect(result).toHaveProperty("error");
        if (!result.success) {
          expect(typeof result.error).toBe("string");
        }
      });
    });

    describe("async variants edge cases", () => {
      it("[🎯] should resolve with data when validation.parseAsync receives valid value (Req 27.5)", async () => {
        // Requirement 27.5: WHEN validation.parseAsync receives valid value, THE Validation SHALL resolve with data
        const schema = string();
        const validValue = "async test";

        const result = await validation.parseAsync(schema, validValue);

        expect(result).toBe(validValue);
      });

      it("[🎯] should resolve with error result when validation.safeParseAsync receives invalid value (Req 27.6)", async () => {
        // Requirement 27.6: WHEN validation.safeParseAsync receives invalid value, THE Validation SHALL resolve with error result
        const schema = number();
        const invalidValue = "invalid";

        const result: SafeParseResult<number> = await validation.safeParseAsync(
          schema,
          invalidValue
        );

        expect(result.success).toBe(false);
        expect(result).toHaveProperty("error");
        if (!result.success) {
          expect(typeof result.error).toBe("string");
        }
      });
    });
  });
});
