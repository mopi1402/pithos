import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  arbitraryValueForSchema,
  arbitraryStringSchema,
  arbitraryNumberSchema,
  arbitraryBooleanSchema,
  arbitraryObjectSchema,
  arbitraryArraySchema,
  arbitraryUnionSchema,
  arbitrarySchema,
  arbitrarySchemaWithValue,
  arbitrarySchemaWithValidValue,
  arbitrarySchemaWithInvalidValue,
  type SchemaWithMeta,
} from "./arbitraries";

describe("arbitraries", () => {
  function assertValidValues(meta: SchemaWithMeta, count = 10): void {
    const values = fc.sample(meta.validValueArb, count);
    for (const value of values) {
      expect(
        meta.schema.validator(value),
        `Valid value rejected for ${meta.description}: ${JSON.stringify(value)}`
      ).toBe(true);
    }
  }

  function assertInvalidValues(meta: SchemaWithMeta, count = 10): void {
    const values = fc.sample(meta.invalidValueArb, count);
    for (const value of values) {
      expect(
        meta.schema.validator(value),
        `Invalid value accepted for ${meta.description}: ${JSON.stringify(value)}`
      ).not.toBe(true);
    }
  }

  describe("[👾] Schema Factory Coverage", () => {
    it("[👾] arbitraryStringSchema generates correct valid/invalid values", () => {
      const schemas = fc.sample(arbitraryStringSchema(), 50);
      for (const meta of schemas) {
        expect(meta.description).toBeTruthy();
        assertValidValues(meta);
        assertInvalidValues(meta);
      }
    });

    it("[👾] arbitraryNumberSchema generates correct valid/invalid values", () => {
      const schemas = fc.sample(arbitraryNumberSchema(), 100);
      for (const meta of schemas) {
        expect(meta.description).toBeTruthy();
        assertValidValues(meta);
        assertInvalidValues(meta);
      }
    });

    it("[👾] arbitraryBooleanSchema generates correct valid/invalid values", () => {
      const schemas = fc.sample(arbitraryBooleanSchema(), 5);
      for (const meta of schemas) {
        expect(meta.description).toBeTruthy();
        assertValidValues(meta);
        assertInvalidValues(meta);
      }
    });

    it("[👾] arbitraryObjectSchema generates correct valid/invalid values", () => {
      const schemas = fc.sample(arbitraryObjectSchema(), 50);
      for (const meta of schemas) {
        expect(meta.description).toBeTruthy();
        expect(meta.description).toMatch(/prop\d/);
        assertValidValues(meta);
        assertInvalidValues(meta);
      }
    });

    it("[👾] arbitraryArraySchema generates correct valid/invalid values", () => {
      const schemas = fc.sample(arbitraryArraySchema(), 30);
      for (const meta of schemas) {
        expect(meta.description).toBeTruthy();
        assertValidValues(meta);
        assertInvalidValues(meta);
      }
    });

    it("[👾] arbitraryUnionSchema generates correct valid/invalid values", () => {
      const schemas = fc.sample(arbitraryUnionSchema(), 50);
      for (const meta of schemas) {
        expect(meta.description).toBeTruthy();
        assertValidValues(meta);
        assertInvalidValues(meta);
      }
    });
  });

  describe("[🎯] Coverage Tests", () => {
    it("[🎯] arbitraryValueForSchema with validOnly=true generates only valid values", () => {
      const meta = fc.sample(arbitraryStringSchema(), 1)[0];
      const results = fc.sample(arbitraryValueForSchema(meta, true), 10);
      for (const r of results) {
        expect(r.shouldBeValid).toBe(true);
      }
    });
  });
});


describe("[👾] Mutation: combined arbitraries", () => {
  it("[👾] arbitrarySchema generates all schema types", () => {
    const schemas = fc.sample(arbitrarySchema(), 100);
    
    // Should generate various types
    const descriptions = schemas.map((s: SchemaWithMeta) => s.description);
    expect(descriptions.some((d: string) => d.includes("string"))).toBe(true);
    expect(descriptions.some((d: string) => d.includes("number"))).toBe(true);
    expect(descriptions.some((d: string) => d.includes("boolean"))).toBe(true);
    expect(descriptions.some((d: string) => d.includes("object"))).toBe(true);
    expect(descriptions.some((d: string) => d.includes("array"))).toBe(true);
    expect(descriptions.some((d: string) => d.includes("union"))).toBe(true);
  });

  it("[👾] arbitrarySchemaWithValue generates schema and value pairs", () => {
    const pairs = fc.sample(arbitrarySchemaWithValue(), 50);
    
    for (const pair of pairs) {
      expect(pair).toHaveProperty("schemaWithMeta");
      expect(pair).toHaveProperty("value");
      expect(pair).toHaveProperty("shouldBeValid");
      expect(typeof pair.shouldBeValid).toBe("boolean");
      
      // Verify the value matches the expected validity
      const result = pair.schemaWithMeta.schema.validator(pair.value);
      if (pair.shouldBeValid) {
        expect(result).toBe(true);
      } else {
        expect(result).not.toBe(true);
      }
    }
  });

  it("[👾] arbitrarySchemaWithValidValue generates only valid values", () => {
    const pairs = fc.sample(arbitrarySchemaWithValidValue(), 50);
    
    for (const pair of pairs) {
      expect(pair).toHaveProperty("schemaWithMeta");
      expect(pair).toHaveProperty("value");
      expect(pair).not.toHaveProperty("shouldBeValid");
      
      // All values should be valid
      const result = pair.schemaWithMeta.schema.validator(pair.value);
      expect(result).toBe(true);
    }
  });

  it("[👾] arbitrarySchemaWithInvalidValue generates only invalid values", () => {
    const pairs = fc.sample(arbitrarySchemaWithInvalidValue(), 50);
    
    for (const pair of pairs) {
      expect(pair).toHaveProperty("schemaWithMeta");
      expect(pair).toHaveProperty("value");
      expect(pair).not.toHaveProperty("shouldBeValid");
      
      // All values should be invalid
      const result = pair.schemaWithMeta.schema.validator(pair.value);
      expect(result).not.toBe(true);
    }
  });

  it("[👾] arbitraryValueForSchema with validOnly=false generates both valid and invalid", () => {
    const meta = fc.sample(arbitraryStringSchema(), 1)[0];
    const results = fc.sample(arbitraryValueForSchema(meta, false), 50);
    
    // Should have both valid and invalid values
    const hasValid = results.some(r => r.shouldBeValid === true);
    const hasInvalid = results.some(r => r.shouldBeValid === false);
    expect(hasValid).toBe(true);
    expect(hasInvalid).toBe(true);
  });

  it("[👾] arbitraryValueForSchema default (no validOnly param) generates both valid and invalid", () => {
    const meta = fc.sample(arbitraryStringSchema(), 1)[0];
    const results = fc.sample(arbitraryValueForSchema(meta), 50);
    
    // Default should be false, so should have both valid and invalid values
    const hasValid = results.some(r => r.shouldBeValid === true);
    const hasInvalid = results.some(r => r.shouldBeValid === false);
    expect(hasValid).toBe(true);
    expect(hasInvalid).toBe(true);
  });
});
