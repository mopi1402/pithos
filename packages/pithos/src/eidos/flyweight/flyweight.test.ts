import { describe, it, expect } from "vitest";
import { memoize } from "./flyweight";

describe("Flyweight Pattern (re-exports from Arkhe)", () => {
  describe("memoize as flyweight factory", () => {
    it("reuses objects with same intrinsic state", () => {
      let createCount = 0;

      // Flyweight factory with custom key resolver for multiple args
      const getCarConfig = memoize(
        (brand: string, model: string, color: string) => {
          createCount++;
          return { brand, model, color };
        },
        (brand, model, color) => `${brand}_${model}_${color}`,
      );

      // Create multiple cars with same intrinsic state
      const config1 = getCarConfig("BMW", "M5", "red");
      const config2 = getCarConfig("BMW", "M5", "red");
      const config3 = getCarConfig("BMW", "X6", "white");

      // Same intrinsic state → same object (flyweight)
      expect(config1).toBe(config2);
      // Different intrinsic state → different object
      expect(config1).not.toBe(config3);
      // Factory only called twice (not three times)
      expect(createCount).toBe(2);
    });

    it("separates intrinsic and extrinsic state", () => {
      // Intrinsic: shared car configuration
      const getCarConfig = memoize(
        (brand: string, model: string) => ({
          brand,
          model,
          specs: { /* expensive computed data */ },
        }),
        (brand, model) => `${brand}_${model}`,
      );

      // Extrinsic: unique per car instance
      type Car = {
        config: ReturnType<typeof getCarConfig>;
        plates: string;
        owner: string;
      };

      const car1: Car = {
        config: getCarConfig("Tesla", "Model3"),
        plates: "ABC123",
        owner: "Alice",
      };

      const car2: Car = {
        config: getCarConfig("Tesla", "Model3"),
        plates: "XYZ789",
        owner: "Bob",
      };

      // Shared intrinsic state
      expect(car1.config).toBe(car2.config);
      // Unique extrinsic state
      expect(car1.plates).not.toBe(car2.plates);
      expect(car1.owner).not.toBe(car2.owner);
    });

    it("reduces memory for large datasets", () => {
      const getTreeType = memoize(
        (name: string, color: string, texture: string) => ({
          name,
          color,
          texture,
        }),
        (name, color, texture) => `${name}_${color}_${texture}`,
      );

      // Forest with 1000 trees but only a few types
      const trees = Array.from({ length: 1000 }, (_, i) => ({
        type: getTreeType(
          i % 3 === 0 ? "Oak" : i % 3 === 1 ? "Pine" : "Birch",
          i % 2 === 0 ? "green" : "dark-green",
          "bark",
        ),
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      }));

      // Only 6 unique tree types created (3 names × 2 colors)
      const uniqueTypes = new Set(trees.map((t) => t.type));
      expect(uniqueTypes.size).toBe(6);
    });
  });
});
