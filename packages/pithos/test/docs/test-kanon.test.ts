/**
 * Test file to verify Kanon validation works
 */

import { describe, it, expect } from "vitest";
import { validation } from "@kanon/v1/validation";

// Test basic validation
const ProductSchema = validation.object({
  id: validation.string(),
  name: validation.string(),
  price: validation.string(),
  stock: validation.number(),
  category: validation.string().optional(),
});

// Test data
const validData = {
  id: "123",
  name: "Test Product",
  price: "29.99",
  stock: 10,
  category: "electronics",
};

const invalidData = {
  id: "123",
  name: "Test Product",
  // Missing required fields
};

describe("Kanon validation", () => {
  it("should validate valid data successfully", () => {
    const result = ProductSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: "123",
        name: "Test Product",
        price: "29.99",
        stock: 10,
        category: "electronics",
      });
    }
  });

  it("should fail validation for invalid data", () => {
    const result = ProductSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
      // Just check that there's an error message, don't check specific content
      expect(result.error.message).toBeDefined();
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });

  it("should handle optional fields correctly", () => {
    const dataWithoutOptional = {
      id: "123",
      name: "Test Product",
      price: "29.99",
      stock: 10,
    };

    const result = ProductSchema.safeParse(dataWithoutOptional);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBeUndefined();
    }
  });
});
