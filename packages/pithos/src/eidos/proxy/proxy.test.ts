import { describe, it, expect } from "vitest";
import { lazy, guarded } from "./proxy";

// --- lazy ---

describe("lazy", () => {
  it("defers factory call until first invocation", () => {
    let factoryCalls = 0;
    const query = lazy(() => {
      factoryCalls++;
      return (sql: string) => `result:${sql}`;
    });

    expect(factoryCalls).toBe(0);

    query("SELECT 1");
    expect(factoryCalls).toBe(1);
  });

  it("calls factory only once", () => {
    let factoryCalls = 0;
    const query = lazy(() => {
      factoryCalls++;
      return (sql: string) => `result:${sql}`;
    });

    query("SELECT 1");
    query("SELECT 2");
    query("SELECT 3");

    expect(factoryCalls).toBe(1);
  });

  it("returns the result of the created function", () => {
    const double = lazy(() => (n: number) => n * 2);

    expect(double(5)).toBe(10);
    expect(double(21)).toBe(42);
  });
});

// --- guarded ---

describe("guarded", () => {
  it("returns Ok when check passes", () => {
    const deleteUser = guarded(
      (id: string) => `deleted:${id}`,
      () => true,
    );

    const result = deleteUser("user-1");

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe("deleted:user-1");
    }
  });

  it("returns Err with reason when check fails", () => {
    const deleteUser = guarded(
      (id: string) => `deleted:${id}`,
      (id) => (id !== "admin" ? true : "Cannot delete admin user"),
    );

    const result = deleteUser("admin");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("Cannot delete admin user");
    }
  });

  it("does not call the function when check fails", () => {
    let called = false;
    const fn = guarded(
      (_id: string) => {
        called = true;
        return "done";
      },
      () => "access denied",
    );

    fn("anything");

    expect(called).toBe(false);
  });

  it("passes the input to the check function", () => {
    const fn = guarded(
      (n: number) => n * 2,
      (n) => (n > 0 ? true : "Must be positive"),
    );

    expect(fn(5).isOk()).toBe(true);

    const result = fn(-1);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("Must be positive");
    }
  });
});
