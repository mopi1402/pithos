import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { addObjectConstraints } from "./object";
import { refineObject } from "@kanon/v3/schemas/constraints/refine/object";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import type { ObjectSchema } from "@kanon/v3/types/composites";

type RefineObjectPredicate = (value: Record<string, unknown>) => true | string;

function getLastPredicate(): RefineObjectPredicate {
  const calls = vi.mocked(refineObject).mock.calls;
  const lastCall = calls[calls.length - 1];
  return lastCall[1] as RefineObjectPredicate;
}

vi.mock("@kanon/v3/schemas/constraints/refine/object", () => ({
  refineObject: vi.fn((schema, predicate) => ({ schema, predicate })),
}));

describe("addObjectConstraints", () => {
  const createMockSchema = (
    entries: Record<string, unknown> = {}
  ): ObjectSchema =>
    ({
      type: "object",
      entries,
      parse: vi.fn(),
    } as unknown as ObjectSchema);

  describe("structure", () => {
    it("préserve les propriétés du schéma de base", () => {
      const baseSchema = createMockSchema({ name: {}, age: {} });
      const result = addObjectConstraints(baseSchema);

      expect(result.type).toBe("object");
      expect(result.entries).toBe(baseSchema.entries);
      expect(result.validator).toBe(baseSchema.validator);
    });

    it("expose les trois méthodes de contrainte", () => {
      const result = addObjectConstraints(createMockSchema());

      expect(typeof result.minKeys).toBe("function");
      expect(typeof result.maxKeys).toBe("function");
      expect(typeof result.strict).toBe("function");
    });
  });

  describe("minKeys", () => {
    it("valide quand le nombre de clés est égal au minimum", () => {
      const result = addObjectConstraints(createMockSchema());
      result.minKeys(2);

      const predicate = getLastPredicate();
      expect(predicate({ a: 1, b: 2 })).toBe(true);
    });

    it("valide quand le nombre de clés dépasse le minimum", () => {
      const result = addObjectConstraints(createMockSchema());
      result.minKeys(1);

      const predicate = getLastPredicate();
      expect(predicate({ a: 1, b: 2, c: 3 })).toBe(true);
    });

    it("retourne le message d'erreur par défaut si insuffisant", () => {
      const result = addObjectConstraints(createMockSchema());
      result.minKeys(3);

      const predicate = getLastPredicate();
      expect(predicate({ a: 1 })).toBe(
        ERROR_MESSAGES_COMPOSITION.objectMinKeys(3)
      );
    });

    it("retourne le message d'erreur personnalisé si fourni", () => {
      const result = addObjectConstraints(createMockSchema());
      result.minKeys(2, "Pas assez de propriétés");

      const predicate = getLastPredicate();
      expect(predicate({ a: 1 })).toBe("Pas assez de propriétés");
    });

    it("gère un objet vide avec min=0", () => {
      const result = addObjectConstraints(createMockSchema());
      result.minKeys(0);

      const predicate = getLastPredicate();
      expect(predicate({})).toBe(true);
    });
  });

  describe("maxKeys", () => {
    it("valide quand le nombre de clés est égal au maximum", () => {
      const result = addObjectConstraints(createMockSchema());
      result.maxKeys(2);

      const predicate = getLastPredicate();
      expect(predicate({ a: 1, b: 2 })).toBe(true);
    });

    it("valide quand le nombre de clés est inférieur au maximum", () => {
      const result = addObjectConstraints(createMockSchema());
      result.maxKeys(5);

      const predicate = getLastPredicate();
      expect(predicate({ a: 1 })).toBe(true);
    });

    it("retourne le message d'erreur par défaut si dépassé", () => {
      const result = addObjectConstraints(createMockSchema());
      result.maxKeys(1);

      const predicate = getLastPredicate();
      expect(predicate({ a: 1, b: 2, c: 3 })).toBe(
        ERROR_MESSAGES_COMPOSITION.objectMaxKeys(1)
      );
    });

    it("retourne le message d'erreur personnalisé si fourni", () => {
      const result = addObjectConstraints(createMockSchema());
      result.maxKeys(1, "Trop de propriétés");

      const predicate = getLastPredicate();
      expect(predicate({ a: 1, b: 2 })).toBe("Trop de propriétés");
    });

    it("gère max=0 avec objet vide", () => {
      const result = addObjectConstraints(createMockSchema());
      result.maxKeys(0);

      const predicate = getLastPredicate();
      expect(predicate({})).toBe(true);
    });
  });

  describe("strict", () => {
    it("valide quand toutes les clés sont définies dans le schéma", () => {
      const result = addObjectConstraints(
        createMockSchema({ name: {}, age: {} })
      );
      result.strict();

      const predicate = getLastPredicate();
      expect(predicate({ name: "John", age: 30 })).toBe(true);
    });

    it("valide avec un sous-ensemble des clés définies", () => {
      const result = addObjectConstraints(
        createMockSchema({ name: {}, age: {}, email: {} })
      );
      result.strict();

      const predicate = getLastPredicate();
      expect(predicate({ name: "John" })).toBe(true);
    });

    it("valide un objet vide", () => {
      const result = addObjectConstraints(createMockSchema({ name: {} }));
      result.strict();

      const predicate = getLastPredicate();
      expect(predicate({})).toBe(true);
    });

    it("retourne le message d'erreur par défaut avec la clé invalide", () => {
      const result = addObjectConstraints(createMockSchema({ name: {} }));
      result.strict();

      const predicate = getLastPredicate();
      expect(predicate({ name: "John", extra: "oops" })).toBe(
        ERROR_MESSAGES_COMPOSITION.objectStrict("extra")
      );
    });

    it("retourne le message d'erreur personnalisé si fourni", () => {
      const result = addObjectConstraints(createMockSchema({ name: {} }));
      result.strict("Propriété non autorisée");

      const predicate = getLastPredicate();
      expect(predicate({ unknown: "value" })).toBe("Propriété non autorisée");
    });

    it("détecte la première clé invalide parmi plusieurs", () => {
      const result = addObjectConstraints(createMockSchema({ a: {} }));
      result.strict();

      const predicate = getLastPredicate();
      const errorMsg = predicate({ a: 1, b: 2, c: 3 });

      // Vérifie qu'une erreur est retournée (l'ordre des clés n'est pas garanti)
      expect(typeof errorMsg).toBe("string");
      expect(errorMsg).not.toBe(true);
    });
  });

  describe("intégration avec refineObject", () => {
    it("passe le schéma de base à refineObject", () => {
      const baseSchema = createMockSchema({ id: {} });
      const result = addObjectConstraints(baseSchema);

      result.minKeys(1);

      expect(refineObject).toHaveBeenCalledWith(
        baseSchema,
        expect.any(Function)
      );
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.integer({ min: 0, max: 5 }), fc.integer({ min: 0, max: 5 })])(
      "[🎲] minKeys - accepts objects with key count >= min",
      (minKeys, extraKeys) => {
        const result = addObjectConstraints(createMockSchema());
        result.minKeys(minKeys);

        const predicate = getLastPredicate();
        const obj = Object.fromEntries(
          Array.from({ length: minKeys + extraKeys }, (_, i) => [`key${i}`, i])
        );
        expect(predicate(obj)).toBe(true);
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 5 }), fc.integer({ min: 1, max: 5 })])(
      "[🎲] maxKeys - rejects objects with key count > max",
      (maxKeys, extraKeys) => {
        const result = addObjectConstraints(createMockSchema());
        result.maxKeys(maxKeys);

        const predicate = getLastPredicate();
        const obj = Object.fromEntries(
          Array.from({ length: maxKeys + extraKeys }, (_, i) => [`key${i}`, i])
        );
        expect(predicate(obj)).toBe(
          ERROR_MESSAGES_COMPOSITION.objectMaxKeys(maxKeys)
        );
      }
    );

    itProp.prop([fc.uniqueArray(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 5 })])(
      "[🎲] strict - accepts objects with only defined keys",
      (keys) => {
        const entries = Object.fromEntries(keys.map((k) => [k, {}]));
        const result = addObjectConstraints(createMockSchema(entries));
        result.strict();

        const predicate = getLastPredicate();
        const obj = Object.fromEntries(keys.map((k) => [k, "value"]));
        expect(predicate(obj)).toBe(true);
      }
    );

    itProp.prop([
      fc.uniqueArray(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 3 }),
      fc.string({ minLength: 1, maxLength: 10 }),
    ])(
      "[🎲] strict - rejects objects with extra keys",
      (schemaKeys, extraKey) => {
        // Ensure extraKey is not in schemaKeys
        const safeExtraKey = schemaKeys.includes(extraKey)
          ? extraKey + "_extra"
          : extraKey;

        const entries = Object.fromEntries(schemaKeys.map((k) => [k, {}]));
        const result = addObjectConstraints(createMockSchema(entries));
        result.strict();

        const predicate = getLastPredicate();
        const obj = Object.fromEntries([
          ...schemaKeys.map((k) => [k, "value"]),
          [safeExtraKey, "extra"],
        ]);
        const predicateResult = predicate(obj);
        expect(typeof predicateResult).toBe("string");
        expect(predicateResult).not.toBe(true);
      }
    );
  });

  describe("[🎯] Specification Tests", () => {
    describe("minKeys boundary conditions", () => {
      it("[🎯] should accept empty object when minKeys(0) - boundary: exact limit", () => {
        const result = addObjectConstraints(createMockSchema());
        result.minKeys(0);

        const predicate = getLastPredicate();
        expect(predicate({})).toBe(true);
      });

      it("[🎯] should accept object with exactly n keys when minKeys(n) - boundary: exact limit", () => {
        const result = addObjectConstraints(createMockSchema());
        const n = 3;
        result.minKeys(n);

        const predicate = getLastPredicate();
        expect(predicate({ a: 1, b: 2, c: 3 })).toBe(true);
      });

      it("[🎯] should reject object with n-1 keys when minKeys(n) - boundary: just below", () => {
        const result = addObjectConstraints(createMockSchema());
        const n = 3;
        result.minKeys(n);

        const predicate = getLastPredicate();
        expect(predicate({ a: 1, b: 2 })).toBe(
          ERROR_MESSAGES_COMPOSITION.objectMinKeys(n)
        );
      });
    });

    describe("maxKeys boundary conditions", () => {
      it("[🎯] should only accept empty object when maxKeys(0) - boundary: exact limit", () => {
        const result = addObjectConstraints(createMockSchema());
        result.maxKeys(0);

        const predicate = getLastPredicate();
        expect(predicate({})).toBe(true);
        expect(predicate({ a: 1 })).toBe(
          ERROR_MESSAGES_COMPOSITION.objectMaxKeys(0)
        );
      });

      it("[🎯] should accept object with exactly n keys when maxKeys(n) - boundary: exact limit", () => {
        const result = addObjectConstraints(createMockSchema());
        const n = 3;
        result.maxKeys(n);

        const predicate = getLastPredicate();
        expect(predicate({ a: 1, b: 2, c: 3 })).toBe(true);
      });

      it("[🎯] should reject object with n+1 keys when maxKeys(n) - boundary: just above", () => {
        const result = addObjectConstraints(createMockSchema());
        const n = 3;
        result.maxKeys(n);

        const predicate = getLastPredicate();
        expect(predicate({ a: 1, b: 2, c: 3, d: 4 })).toBe(
          ERROR_MESSAGES_COMPOSITION.objectMaxKeys(n)
        );
      });
    });

    describe("strict edge cases", () => {
      it("[🎯] should reject any object with properties when strict() on empty schema - edge case: empty strict", () => {
        const result = addObjectConstraints(createMockSchema({}));
        result.strict();

        const predicate = getLastPredicate();
        expect(predicate({})).toBe(true);
        expect(predicate({ any: "property" })).toBe(
          ERROR_MESSAGES_COMPOSITION.objectStrict("any")
        );
      });
    });
  });
});
