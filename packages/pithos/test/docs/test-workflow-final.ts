/**
 * Test du workflow complet avec Kanon validation
 */

import { describe, it, expect, vi } from "vitest";
import { parseFloatDef } from "@arkhe/number/parsers/parse-float-def";
import { ResultAsync, errAsync, okAsync } from "@zygos/result/result-async";
import { validation } from "@kanon/v1/validation";

// Mock fetch
const mockFetch = vi.fn(async (url: string) => {
  if (url.includes("invalid")) {
    throw new Error("Network error: 404 Not Found");
  }

  if (url.includes("malformed")) {
    return {
      json: async () => {
        throw new Error("Invalid JSON");
      },
    };
  }

  if (url.includes("missing-fields")) {
    return {
      json: async () => ({
        id: "123",
        name: "Test Product",
        // Missing required fields: price, stock
      }),
    };
  }

  return {
    json: async () => ({
      id: "123",
      name: "Test Product",
      price: "29.99",
      stock: "10",
      category: "electronics",
    }),
  };
});

// Schema de validation Kanon
const ProductSchema = validation.object({
  id: validation.string(),
  name: validation.string(),
  price: validation.string(),
  stock: validation.string(),
  category: validation.string().optional(),
});

async function loadProduct(productId: string) {
  const safeFetch = ResultAsync.fromThrowable(
    mockFetch,
    (error: unknown) => `Network error: ${error}`
  );

  return safeFetch(`/api/products/${productId}`)
    .andThen((response: any) => {
      const safeJson = ResultAsync.fromThrowable(
        () => response.json(),
        (error: unknown) => `JSON parse error: ${error}`
      );
      return safeJson();
    })
    .andThen((data: any) => {
      // Validation avec Kanon
      const validationResult = ProductSchema.safeParse(data);

      if (!validationResult.success) {
        return errAsync(`Validation failed: ${validationResult.error.message}`);
      }

      return okAsync({
        ...validationResult.data,
        price: parseFloatDef(validationResult.data.price, 0),
        stock: parseFloatDef(validationResult.data.stock, 0),
      });
    });
}

describe("Complete workflow with Kanon validation", () => {
  it("should load a valid product successfully", async () => {
    const result = await loadProduct("123");

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({
        id: "123",
        name: "Test Product",
        price: 29.99,
        stock: 10,
        category: "electronics",
      });
    }
  });

  it("should fail validation when required fields are missing", async () => {
    const result = await loadProduct("missing-fields");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toContain("Validation failed");
    }
  });

  it("should handle network errors", async () => {
    const result = await loadProduct("invalid");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toContain("Network error");
    }
  });

  it("should handle malformed JSON", async () => {
    const result = await loadProduct("malformed");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toContain("JSON parse error");
    }
  });
});
