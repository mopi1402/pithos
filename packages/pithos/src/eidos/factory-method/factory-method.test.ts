import { describe, it, expect } from "vitest";
import {
  createFactoryMethod,
  type Factory,
  type ParameterizedFactory,
} from "./factory-method";

describe("Factory Method Pattern", () => {
  // The pattern is absorbed — these tests demonstrate idiomatic usage

  type Product = { operation: () => string };

  it("factory as parameter replaces abstract factory method", () => {
    // This IS the Factory Method pattern in functional style
    const businessLogic = (createProduct: Factory<Product>) => {
      const product = createProduct();
      return `Working with ${product.operation()}`;
    };

    const createA: Factory<Product> = () => ({ operation: () => "A" });
    const createB: Factory<Product> = () => ({ operation: () => "B" });

    expect(businessLogic(createA)).toBe("Working with A");
    expect(businessLogic(createB)).toBe("Working with B");
  });

  it("parameterized factory for configured products", () => {
    type Config = { prefix: string };

    const createProduct: ParameterizedFactory<Config, Product> = (cfg) => ({
      operation: () => `${cfg.prefix}-product`,
    });

    const product = createProduct({ prefix: "custom" });
    expect(product.operation()).toBe("custom-product");
  });

  it("createFactoryMethod is identity (deprecated)", () => {
    const factory: Factory<Product> = () => ({ operation: () => "test" });
    const wrapped = createFactoryMethod(factory);

    // It's literally the same function
    expect(wrapped).toBe(factory);
    expect(wrapped().operation()).toBe("test");
  });

  it("real-world example: logger injection", () => {
    type Logger = { log: (msg: string) => void };

    const processData = (createLogger: Factory<Logger>) => (data: string) => {
      const logger = createLogger();
      logger.log(`Processing: ${data}`);
      return data.toUpperCase();
    };

    const logs: string[] = [];
    const createConsoleLogger: Factory<Logger> = () => ({
      log: (msg) => logs.push(msg),
    });

    const process = processData(createConsoleLogger);
    const result = process("hello");

    expect(result).toBe("HELLO");
    expect(logs).toEqual(["Processing: hello"]);
  });
});
