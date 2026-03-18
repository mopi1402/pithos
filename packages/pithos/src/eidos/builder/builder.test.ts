import { describe, it, expect } from "vitest";
import {
  createBuilder,
  createValidatedBuilder,
  type Director,
} from "./builder";

// --- createBuilder ---

describe("createBuilder", () => {
  const carBuilder = createBuilder({ engine: "", wheels: 0, color: "white" })
    .step("engine", (s, engine: string) => ({ ...s, engine }))
    .step("wheels", (s, wheels: number) => ({ ...s, wheels }))
    .step("color", (s, color: string) => ({ ...s, color }))
    .done();

  it("builds a product step by step", () => {
    const car = carBuilder()
      .engine("V8")
      .wheels(4)
      .color("red")
      .build();

    expect(car).toEqual({ engine: "V8", wheels: 4, color: "red" });
  });

  it("returns initial state when no steps called", () => {
    const car = carBuilder().build();

    expect(car).toEqual({ engine: "", wheels: 0, color: "white" });
  });

  it("is immutable - each step returns a new builder", () => {
    const b1 = carBuilder();
    const b2 = b1.engine("V6");
    const b3 = b2.wheels(4);

    expect(b1.build().engine).toBe("");
    expect(b2.build().engine).toBe("V6");
    expect(b2.build().wheels).toBe(0);
    expect(b3.build().wheels).toBe(4);
  });

  it("current() returns state without finalizing", () => {
    const b = carBuilder().engine("V8").wheels(4);

    expect(b.current()).toEqual({ engine: "V8", wheels: 4, color: "white" });
    expect(b.build()).toEqual(b.current());
  });

  it("steps can accumulate (e.g., array push)", () => {
    const queryBuilder = createBuilder({ clauses: [] as string[] })
      .step("where", (s, clause: string) => ({ ...s, clauses: [...s.clauses, clause] }))
      .done();

    const q = queryBuilder()
      .where("a = 1")
      .where("b = 2")
      .where("c = 3")
      .build();

    expect(q.clauses).toEqual(["a = 1", "b = 2", "c = 3"]);
  });

  it("factory creates independent builders", () => {
    const b1 = carBuilder().engine("V6");
    const b2 = carBuilder().engine("V8");

    expect(b1.build().engine).toBe("V6");
    expect(b2.build().engine).toBe("V8");
  });
});


// --- createValidatedBuilder ---

describe("createValidatedBuilder", () => {
  const configBuilder = createValidatedBuilder({ host: "", port: 0 })
    .step("host", (s, host: string) => ({ ...s, host }))
    .step("port", (s, port: number) => ({ ...s, port }))
    .done((s) => (s.host ? true : "host is required"));

  it("returns Ok when validation passes", () => {
    const result = configBuilder().host("localhost").port(8080).build();

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ host: "localhost", port: 8080 });
    }
  });

  it("returns Err when validation fails", () => {
    const result = configBuilder().port(8080).build();

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("host is required");
    }
  });

  it("current() returns state without validation", () => {
    const b = configBuilder().port(8080);

    expect(b.current()).toEqual({ host: "", port: 8080 });
  });

  it("is chainable like regular builder", () => {
    const result = configBuilder()
      .host("example.com")
      .port(443)
      .host("override.com")
      .build();

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.host).toBe("override.com");
    }
  });
});


// --- Director pattern ---

describe("Director pattern", () => {
  type Car = { engine: string; wheels: number; color: string };

  const carBuilder = createBuilder({ engine: "", wheels: 0, color: "white" } as Car)
    .step("engine", (s, engine: string) => ({ ...s, engine }))
    .step("wheels", (s, wheels: number) => ({ ...s, wheels }))
    .step("color", (s, color: string) => ({ ...s, color }))
    .done();

  it("director orchestrates steps in sequence", () => {
    type CarBuilder = ReturnType<typeof carBuilder>;
    
    const buildSportsCar: Director<CarBuilder, Car> = (b) =>
      b.engine("V8").wheels(4).color("red");

    const buildEcoCar: Director<CarBuilder, Car> = (b) =>
      b.engine("Electric").wheels(4).color("green");

    expect(buildSportsCar(carBuilder()).build()).toEqual({
      engine: "V8",
      wheels: 4,
      color: "red",
    });

    expect(buildEcoCar(carBuilder()).build()).toEqual({
      engine: "Electric",
      wheels: 4,
      color: "green",
    });
  });

  it("client can use builder directly without director", () => {
    const custom = carBuilder().engine("Hybrid").wheels(3).build();

    expect(custom).toEqual({ engine: "Hybrid", wheels: 3, color: "white" });
  });
});


// --- Mutation tests ---

describe("mutation tests", () => {
  it("[👾] createValidatedBuilder returns a working builder factory", () => {
    const builder = createValidatedBuilder({ value: 0 })
      .step("set", (s, v: number) => ({ ...s, value: v }))
      .done(() => true);

    const result = builder().set(42).build();
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ value: 42 });
    }
  });

  it("[👾] createValidatedBuilder step() adds methods to builder", () => {
    const builder = createValidatedBuilder({ a: 0, b: 0 })
      .step("setA", (s, a: number) => ({ ...s, a }))
      .step("setB", (s, b: number) => ({ ...s, b }))
      .done(() => true);

    const result = builder().setA(1).setB(2).build();
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ a: 1, b: 2 });
    }
  });

  it("[👾] createValidatedBuilder done() returns a factory function", () => {
    const factory = createValidatedBuilder({ x: 0 })
      .step("setX", (s, x: number) => ({ ...s, x }))
      .done(() => true);

    // Factory should be callable and return a builder
    const b1 = factory().setX(10);
    const b2 = factory().setX(20);

    const r1 = b1.build();
    const r2 = b2.build();

    expect(r1.isOk()).toBe(true);
    expect(r2.isOk()).toBe(true);
    if (r1.isOk()) expect(r1.value).toEqual({ x: 10 });
    if (r2.isOk()) expect(r2.value).toEqual({ x: 20 });
  });
});
