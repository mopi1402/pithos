import { describe, it, expect } from "vitest";
import { ensureAsync } from "./ensureAsync";
import { string, number, object } from "@kanon";

describe("ensureAsync", () => {
  const schema = object({
    name: string().minLength(1),
    age: number().min(0),
  });

  it("returns OkAsync with valid data", async () => {
    const result = await ensureAsync(schema, { name: "Alice", age: 30 });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ name: "Alice", age: 30 });
    }
  });

  it("returns ErrAsync with invalid data", async () => {
    const result = await ensureAsync(schema, { name: "", age: -1 });

    expect(result.isErr()).toBe(true);
  });

  it("returns ErrAsync with wrong type", async () => {
    const result = await ensureAsync(schema, "not an object");

    expect(result.isErr()).toBe(true);
  });

  it("is chainable with map", async () => {
    const result = await ensureAsync(schema, { name: "Alice", age: 30 })
      .map(user => user.name.toUpperCase());

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe("ALICE");
    }
  });

  it("is chainable with mapErr", async () => {
    const result = await ensureAsync(schema, "bad")
      .mapErr(error => `Validation failed: ${error}`);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toContain("Validation failed:");
    }
  });
});
