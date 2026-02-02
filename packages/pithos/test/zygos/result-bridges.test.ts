/**
 * Tests pour les fonctions de conversion bridges dans Result
 *
 * Ce fichier teste les ponts entre Result, Option et Either
 */

import { describe, it, expect } from "vitest";

import * as R from "@zygos/result/result";
import * as O from "@zygos/option";
import * as E from "@zygos/either";

// ============================================================================
// 1. TESTS DE CONVERSION OPTION → RESULT
// ============================================================================

describe("Conversion Option → Result", () => {
  it("fromOption avec Some", () => {
    const option = O.some(42);
    const result = R.fromOption(() => "No value")(option);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  it("fromOption avec None", () => {
    const option = O.none;
    const result = R.fromOption(() => "No value")(option);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("No value");
    }
  });

  it("fromOption avec message d'erreur personnalisé", () => {
    const option = O.none;
    const result = R.fromOption(() => "User not found")(option);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("User not found");
    }
  });

  it("fromOption avec types complexes", () => {
    const user = { id: 1, name: "John" };
    const option = O.some(user);
    const result = R.fromOption(() => "No user")(option);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(user);
    }
  });
});

// ============================================================================
// 2. TESTS DE CONVERSION EITHER → RESULT
// ============================================================================

describe("Conversion Either → Result", () => {
  it("fromEither avec Right", () => {
    const either = E.right(42);
    const result = R.fromEither(either);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  it("fromEither avec Left", () => {
    const either = E.left("Error message");
    const result = R.fromEither(either);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("Error message");
    }
  });

  it("fromEither avec types complexes", () => {
    const user = { id: 1, name: "John" };
    const either = E.right(user);
    const result = R.fromEither(either);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(user);
    }
  });

  it("fromEither avec erreur complexe", () => {
    const error = { code: 404, message: "Not found" };
    const either = E.left(error);
    const result = R.fromEither(either);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toEqual(error);
    }
  });
});

// ============================================================================
// 3. TESTS DE CONVERSION RESULT → EITHER
// ============================================================================

describe("Conversion Result → Either", () => {
  it("toEither avec Ok", () => {
    const result = R.ok(42);
    const either = R.toEither(result);

    expect(either._tag).toBe("Right");
    if (either._tag === "Right") {
      expect(either.right).toBe(42);
    }
  });

  it("toEither avec Err", () => {
    const result = R.err("Error message");
    const either = R.toEither(result);

    expect(either._tag).toBe("Left");
    if (either._tag === "Left") {
      expect(either.left).toBe("Error message");
    }
  });

  it("toEither avec types complexes", () => {
    const user = { id: 1, name: "John" };
    const result = R.ok(user);
    const either = R.toEither(result);

    expect(either._tag).toBe("Right");
    if (either._tag === "Right") {
      expect(either.right).toEqual(user);
    }
  });

  it("toEither avec erreur complexe", () => {
    const error = { code: 404, message: "Not found" };
    const result = R.err(error);
    const either = R.toEither(result);

    expect(either._tag).toBe("Left");
    if (either._tag === "Left") {
      expect(either.left).toEqual(error);
    }
  });
});

// ============================================================================
// 4. TESTS DE ROUND-TRIP (ALLER-RETOUR)
// ============================================================================

describe("Tests de round-trip (aller-retour)", () => {
  it("Option → Result → Option", () => {
    const originalOption = O.some(42);
    const result = R.fromOption(() => "No value")(originalOption);
    const backToOption = O.fromEither(R.toEither(result));

    expect(backToOption).toEqual(originalOption);
  });

  it("Either → Result → Either", () => {
    const originalEither = E.right(42);
    const result = R.fromEither(originalEither);
    const backToEither = R.toEither(result);

    expect(backToEither).toEqual(originalEither);
  });

  it("Result → Either → Result", () => {
    const originalResult = R.ok(42);
    const either = R.toEither(originalResult);
    const backToResult = R.fromEither(either);

    expect(backToResult.isOk()).toBe(originalResult.isOk());
    if (backToResult.isOk() && originalResult.isOk()) {
      expect(backToResult.value).toBe(originalResult.value);
    }
  });
});

// ============================================================================
// 5. TESTS DE CAS D'USAGE RÉELS
// ============================================================================

describe("Cas d'usage réels", () => {
  it("Service qui renvoie Option → conversion vers Result", () => {
    // Simulation d'un service qui renvoie Option
    const userService = {
      findUser: (id: number): O.Option<{ id: number; name: string }> => {
        if (id === 1) return O.some({ id: 1, name: "John" });
        return O.none;
      },
    };

    // Cas de succès
    const userOption = userService.findUser(1);
    const userResult = R.fromOption(() => "User not found")(userOption);

    expect(userResult.isOk()).toBe(true);
    if (userResult.isOk()) {
      expect(userResult.value).toEqual({ id: 1, name: "John" });
    }

    // Cas d'erreur
    const noUserOption = userService.findUser(999);
    const noUserResult = R.fromOption(() => "User not found")(noUserOption);

    expect(noUserResult.isErr()).toBe(true);
    if (noUserResult.isErr()) {
      expect(noUserResult.error).toBe("User not found");
    }
  });

  it("Validation avec Either → conversion vers Result", () => {
    // Validation avec Either (fp-ts style)
    const validateEmail = (email: string): E.Either<string, string> => {
      if (email.includes("@")) return E.right(email);
      return E.left("Invalid email format");
    };

    // Conversion vers Result pour gestion d'erreur métier
    const validEmail = validateEmail("john@example.com");
    const validResult = R.fromEither(validEmail);

    expect(validResult.isOk()).toBe(true);
    if (validResult.isOk()) {
      expect(validResult.value).toBe("john@example.com");
    }

    const invalidEmail = validateEmail("invalid-email");
    const invalidResult = R.fromEither(invalidEmail);

    expect(invalidResult.isErr()).toBe(true);
    if (invalidResult.isErr()) {
      expect(invalidResult.error).toBe("Invalid email format");
    }
  });

  it("Gestion d'erreur avec Result → conversion vers Either", () => {
    // Gestion d'erreur avec Result (Neverthrow style)
    const processPayment = (amount: number): R.Result<string, string> => {
      if (amount > 1000) return R.err("Amount too high");
      return R.ok(`Payment processed: $${amount}`);
    };

    // Conversion vers Either pour validation fp-ts
    const successResult = processPayment(500);
    const successEither = R.toEither(successResult);

    expect(successEither._tag).toBe("Right");
    if (successEither._tag === "Right") {
      expect(successEither.right).toBe("Payment processed: $500");
    }

    const errorResult = processPayment(1500);
    const errorEither = R.toEither(errorResult);

    expect(errorEither._tag).toBe("Left");
    if (errorEither._tag === "Left") {
      expect(errorEither.left).toBe("Amount too high");
    }
  });
});

// ============================================================================
// 6. TESTS DE PERFORMANCE ET COMPORTEMENT
// ============================================================================

describe("Performance et comportement", () => {
  it("Conversion rapide avec fromOption", () => {
    const option = O.some(42);
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      R.fromOption(() => "No value")(option);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(30); // Moins de 30ms pour 1000 conversions
  });

  it("Conversion rapide avec fromEither", () => {
    const either = E.right(42);
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      R.fromEither(either);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(30); // Moins de 30ms pour 1000 conversions
  });

  it("Conversion rapide avec toEither", () => {
    const result = R.ok(42);
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      R.toEither(result);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(30); // Moins de 30ms pour 1000 conversions
  });
});
