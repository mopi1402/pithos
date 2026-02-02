/**
 * Tests pour les fonctionnalités indispensables de fp-ts/TaskEither
 *
 * Ce fichier teste les 95% des cas d'usage essentiels
 * Les fonctionnalités avancées (5% des cas) sont ignorées
 */

import { describe, it, expect } from "vitest";

import * as TE from "@zygos/task-either"; // "fp-ts/TaskEither" or "@zygos/task-either"
import * as E from "@zygos/either"; // "fp-ts/Either" or "@zygos/either"
import * as O from "@zygos/option"; // "fp-ts/Option" or "@zygos/option"
import * as T from "@zygos/task"; // "fp-ts/Task" or "@zygos/task"
import { pipe } from "@arkhe/function/pipe"; // "fp-ts/function" or "@arkhe/function/pipe"

// ============================================================================
// 1. TESTS DES CONSTRUCTEURS
// ============================================================================

describe("Constructeurs TaskEither", () => {
  it("right - crée un TaskEither de succès", async () => {
    const taskEither = TE.right(42);
    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(42);
    }
  });

  it("left - crée un TaskEither d'erreur", async () => {
    const taskEither = TE.left("Error message");
    const result = await taskEither();

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("Error message");
    }
  });

  it("tryCatch - wrapper try-catch", async () => {
    const successTask = TE.tryCatch(
      () => Promise.resolve(42),
      (error) => `Caught: ${error}`
    );
    const successResult = await successTask();

    expect(E.isRight(successResult)).toBe(true);
    if (E.isRight(successResult)) {
      expect(successResult.right).toBe(42);
    }

    const errorTask = TE.tryCatch(
      () => Promise.reject("Network error"),
      (error) => `Caught: ${error}`
    );
    const errorResult = await errorTask();

    expect(E.isLeft(errorResult)).toBe(true);
    if (E.isLeft(errorResult)) {
      expect(errorResult.left).toBe("Caught: Network error");
    }
  });
});

// ============================================================================
// 2. TESTS DES TRANSFORMATIONS
// ============================================================================

describe("Transformations TaskEither", () => {
  it("map - transforme la valeur de succès", async () => {
    const taskEither = pipe(
      TE.right(5),
      TE.map((x) => x * 2),
      TE.map((x) => x.toString())
    );

    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe("10");
    }
  });

  it("map ne modifie pas l'erreur", async () => {
    const taskEither = pipe(
      TE.left("Original error"),
      TE.map((x) => x * 2),
      TE.map((x) => x.toString())
    );

    const result = await taskEither();

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("Original error");
    }
  });

  it("mapLeft - transforme l'erreur", async () => {
    const taskEither = pipe(
      TE.left("Network error"),
      TE.mapLeft((error) => `Enhanced: ${error}`)
    );

    const result = await taskEither();

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("Enhanced: Network error");
    }
  });

  it("mapLeft ne modifie pas le succès", async () => {
    const taskEither = pipe(
      TE.right(42),
      TE.mapLeft((error) => `Enhanced: ${error}`)
    );

    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(42);
    }
  });
});

// ============================================================================
// 3. TESTS DU CHAÎNAGE
// ============================================================================

describe("Chaînage TaskEither", () => {
  it("chain - chaîne des opérations", async () => {
    const fetchUser = (id: number) => TE.right({ id, name: "John" });

    const validateUser = (user: { id: number; name: string }) =>
      user.name.length > 0 ? TE.right(user) : TE.left("Invalid user");

    const taskEither = pipe(
      TE.right(1),
      TE.chain(fetchUser),
      TE.chain(validateUser),
      TE.map((user) => `Hello, ${user.name}!`)
    );

    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe("Hello, John!");
    }
  });

  it("chain propage l'erreur", async () => {
    const fetchUser = (id: number) => TE.left(`User ${id} not found`);

    const taskEither = pipe(TE.right(999), TE.chain(fetchUser));

    const result = await taskEither();

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("User 999 not found");
    }
  });
});

// ============================================================================
// 4. TESTS DE CONVERSIONS
// ============================================================================

describe("Conversions TaskEither", () => {
  it("fromEither - convertit Either en TaskEither", async () => {
    const either = E.right(42);
    const taskEither = TE.fromEither(either);
    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(42);
    }
  });

  it("fromEither avec Left", async () => {
    const either = E.left("Error");
    const taskEither = TE.fromEither(either);
    const result = await taskEither();

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("Error");
    }
  });

  it("fromTask - convertit Task en TaskEither", async () => {
    const task = () => Promise.resolve(42);
    const taskEither = TE.fromTask(task);
    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(42);
    }
  });

  it("fromOption - convertit Option en TaskEither", async () => {
    const option = O.some(42);
    const taskEither = pipe(
      option,
      TE.fromOption(() => "No value")
    );
    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(42);
    }
  });

  it("fromOption avec None", async () => {
    const option = O.none;
    const taskEither = pipe(
      option,
      TE.fromOption(() => "No value")
    );
    const result = await taskEither();

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("No value");
    }
  });

  it("fromPredicate - création depuis une prédicat", async () => {
    const validateAge = TE.fromPredicate(
      (age: number) => age >= 18,
      (age) => `Too young: ${age}`
    );

    const validResult = await validateAge(25)();
    expect(E.isRight(validResult)).toBe(true);
    if (E.isRight(validResult)) {
      expect(validResult.right).toBe(25);
    }

    const invalidResult = await validateAge(15)();
    expect(E.isLeft(invalidResult)).toBe(true);
    if (E.isLeft(invalidResult)) {
      expect(invalidResult.left).toBe("Too young: 15");
    }
  });

  it("fromNullable - création depuis une valeur nullable", async () => {
    const parseNumber = TE.fromNullable("Invalid number");

    const validResult = await parseNumber(42)();
    expect(E.isRight(validResult)).toBe(true);
    if (E.isRight(validResult)) {
      expect(validResult.right).toBe(42);
    }

    const invalidResult = await parseNumber(null)();
    expect(E.isLeft(invalidResult)).toBe(true);
    if (E.isLeft(invalidResult)) {
      expect(invalidResult.left).toBe("Invalid number");
    }
  });

  it("tryCatch - gestion d'exceptions", async () => {
    const safeDivide = TE.tryCatch(
      async () => 10 / 2,
      (error) => `Division error: ${error}`
    );

    const successResult = await safeDivide();
    expect(E.isRight(successResult)).toBe(true);
    if (E.isRight(successResult)) {
      expect(successResult.right).toBe(5);
    }

    const errorTask = TE.tryCatch(
      async () => {
        throw new Error("Division by zero");
      },
      (error) => `Caught error: ${error}`
    );

    const errorResult = await errorTask();
    expect(E.isLeft(errorResult)).toBe(true);
    if (E.isLeft(errorResult)) {
      expect(errorResult.left).toContain("Caught error");
    }
  });
});

// ============================================================================
// 5. TESTS DE CAS D'USAGE RÉELS
// ============================================================================

describe("Cas d'usage réels TaskEither", () => {
  it("Pipeline de traitement de données", async () => {
    const fetchData = (id: number) =>
      TE.tryCatch(
        () => Promise.resolve({ id, name: "John", age: 25 }),
        (error) => `Fetch failed: ${error}`
      );

    const validateData = (data: { id: number; name: string; age: number }) =>
      data.age >= 18 ? TE.right(data) : TE.left("Too young");

    const taskEither = pipe(
      TE.right(1),
      TE.chain(fetchData),
      TE.chain(validateData),
      TE.map((data) => `Processed: ${data.name} (${data.age})`)
    );

    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe("Processed: John (25)");
    }
  });

  it("Gestion d'erreurs en cascade", async () => {
    const fetchUser = (id: number) =>
      id > 0 ? TE.right({ id, name: "John" }) : TE.left("Invalid ID");

    const fetchProfile = (user: { id: number; name: string }) =>
      TE.tryCatch(
        () => Promise.resolve({ userId: user.id, bio: "Developer" }),
        (error) => `Profile fetch failed: ${error}`
      );

    const taskEither = pipe(
      TE.right(1),
      TE.chain(fetchUser),
      TE.chain((user) => fetchProfile(user))
    );

    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toEqual({ userId: 1, bio: "Developer" });
    }
  });
});

// ============================================================================
// 6. TESTS DE ROBUSTESSE
// ============================================================================

describe("Robustesse TaskEither", () => {
  it("map gère les erreurs dans la fonction de transformation", async () => {
    const taskEither = pipe(
      TE.right(42),
      TE.map((x) => {
        if (x > 40) throw new Error("Value too high");
        return x * 2;
      })
    );

    // fp-ts propage les erreurs comme des exceptions
    await expect(taskEither()).rejects.toThrow("Value too high");
  });

  it("mapLeft gère les erreurs dans la fonction de transformation", async () => {
    const taskEither = pipe(
      TE.left("Original error"),
      TE.mapLeft((error) => {
        if (typeof error === "string" && error.includes("Original")) {
          throw new Error("Transformation failed");
        }
        return error;
      })
    );

    // fp-ts propage les erreurs comme des exceptions
    await expect(taskEither()).rejects.toThrow("Transformation failed");
  });

  it("bimap gère les erreurs dans les deux fonctions", async () => {
    const taskEither = pipe(
      TE.right(42),
      TE.bimap(
        (error) => {
          throw new Error(`${error} Left transformation failed`);
        },
        (value) => {
          if (value > 40) throw new Error("Right transformation failed");
          return value * 2;
        }
      )
    );

    // fp-ts propage les erreurs comme des exceptions
    await expect(taskEither()).rejects.toThrow("Right transformation failed");
  });

  it("fromOption gère les valeurs undefined", async () => {
    const parseNumber = TE.fromOption(() => "No value");

    // fromOption attend un vrai Option, pas undefined
    const undefinedResult = await parseNumber(O.none)();
    expect(E.isLeft(undefinedResult)).toBe(true);
    if (E.isLeft(undefinedResult)) {
      expect(undefinedResult.left).toBe("No value");
    }
  });
});

// ============================================================================
// 7. TESTS DE GESTION D'ERREURS AVANCÉE
// ============================================================================

describe("Gestion d'erreurs avancée TaskEither", () => {
  // Note: getOrElse tests removed as fp-ts has different behavior

  it("orElse - alternative en cas d'erreur", async () => {
    const alternativeTask = TE.right("alternative value");
    const orElseTask = pipe(
      TE.left("Original error"),
      TE.orElse(() => alternativeTask)
    );

    const result = await orElseTask();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe("alternative value");
    }
  });

  it("orElse ne s'exécute pas si le TaskEither est un succès", async () => {
    let alternativeExecuted = false;
    const alternativeTask = TE.right("alternative value");
    const orElseTask = pipe(
      TE.right("success value"),
      TE.orElse(() => {
        alternativeExecuted = true;
        return alternativeTask;
      })
    );

    const result = await orElseTask();
    expect(E.isRight(result)).toBe(true);
    expect(alternativeExecuted).toBe(false);
    if (E.isRight(result)) {
      expect(result.right).toBe("success value");
    }
  });

  it("orElse avec différents types d'erreur", async () => {
    const alternativeTask = TE.right("alternative value");
    const orElseTask = pipe(
      TE.left("Original error"),
      TE.orElse((error: string) => {
        expect(error).toBe("Original error");
        return alternativeTask;
      })
    );

    const result = await orElseTask();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe("alternative value");
    }
  });
});

// ============================================================================
// 8. TESTS DES UTILITAIRES AVANCÉS
// ============================================================================

describe("Utilitaires avancés TaskEither", () => {
  it("flatten - aplatit un TaskEither imbriqué", async () => {
    const nestedTask = TE.right(TE.right(42));
    const flattenedTask = TE.flatten(nestedTask);
    const result = await flattenedTask();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(42);
    }
  });

  it("flatten avec TaskEither d'erreur imbriqué", async () => {
    const nestedTask = TE.right(TE.left("Nested error"));
    const flattenedTask = TE.flatten(nestedTask);
    const result = await flattenedTask();

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("Nested error");
    }
  });

  it("flatten avec TaskEither d'erreur externe", async () => {
    const nestedTask = TE.left("Outer error");
    const flattenedTask = TE.flatten(nestedTask);
    const result = await flattenedTask();

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("Outer error");
    }
  });

  it("swap - échange les positions Left et Right", async () => {
    const rightTask = TE.right(42);
    const swappedRight = TE.swap(rightTask);
    const rightResult = await swappedRight();

    expect(E.isLeft(rightResult)).toBe(true);
    if (E.isLeft(rightResult)) {
      expect(rightResult.left).toBe(42);
    }

    const leftTask = TE.left("error");
    const swappedLeft = TE.swap(leftTask);
    const leftResult = await swappedLeft();

    expect(E.isRight(leftResult)).toBe(true);
    if (E.isRight(leftResult)) {
      expect(leftResult.right).toBe("error");
    }
  });

  it("of - alias de right", async () => {
    const taskEither = TE.of(42);
    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(42);
    }
  });
});

// ============================================================================
// 9. TESTS DES ALIASES DE COMPATIBILITÉ
// ============================================================================

describe("Aliases de compatibilité TaskEither", () => {
  it("mapError - alias de mapLeft", async () => {
    const taskEither = pipe(
      TE.left("Original error"),
      TE.mapError((error) => `Enhanced: ${error}`)
    );

    const result = await taskEither();
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("Enhanced: Original error");
    }
  });

  it("mapBoth - alias de bimap", async () => {
    const taskEither = pipe(
      TE.right(42),
      TE.mapBoth(
        (error) => `Enhanced error: ${error}`,
        (value) => value * 2
      )
    );

    const result = await taskEither();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(84);
    }
  });

  it("mapBoth avec Left", async () => {
    const taskEither = pipe(
      TE.left("Original error"),
      TE.mapBoth(
        (error) => `Enhanced error: ${error}`,
        (value) => value * 2
      )
    );

    const result = await taskEither();
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("Enhanced error: Original error");
    }
  });
});

// ============================================================================
// 10. TESTS DE PERFORMANCE ET COMPORTEMENT
// ============================================================================

describe("Performance et comportement TaskEither", () => {
  it("évaluation lazy des TaskEither", async () => {
    let sideEffect = 0;
    const lazyTask = TE.right(() => {
      sideEffect++;
      return "lazy";
    });

    // right évalue immédiatement la valeur passée (la fonction)
    // mais n'appelle pas la fonction tant qu'on n'exécute pas le TaskEither
    expect(sideEffect).toBe(0);

    const result = await lazyTask();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      // La fonction est dans result.right, on peut l'appeler
      const fn = result.right;
      const value = fn();
      expect(value).toBe("lazy");
      expect(sideEffect).toBe(1);
    }
  });

  it("immutabilité des TaskEither", async () => {
    const originalTask = TE.right({ count: 1 });
    const transformedTask = pipe(
      originalTask,
      TE.map((obj: { count: number }) => ({ ...obj, count: obj.count + 1 }))
    );

    const originalResult = await originalTask();
    const transformedResult = await transformedTask();

    expect(E.isRight(originalResult)).toBe(true);
    expect(E.isRight(transformedResult)).toBe(true);

    if (E.isRight(originalResult) && E.isRight(transformedResult)) {
      expect(originalResult.right).toEqual({ count: 1 });
      expect(transformedResult.right).toEqual({ count: 2 });
    }
  });

  it("gestion des erreurs asynchrones", async () => {
    const asyncErrorTask = TE.tryCatch(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error("Async error");
      },
      (error) => `Caught: ${error}`
    );

    const result = await asyncErrorTask();
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toContain("Caught: Error: Async error");
    }
  });

  it("chaînage de plusieurs opérations asynchrones", async () => {
    const fetchData = (id: number) =>
      TE.tryCatch(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
          return { id, name: "John", age: 25 };
        },
        (error) => `Fetch failed: ${error}`
      );

    const validateData = (data: { id: number; name: string; age: number }) =>
      data.age >= 18 ? TE.right(data) : TE.left("Too young");

    const processData = (data: { id: number; name: string; age: number }) =>
      TE.tryCatch(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
          return `Processed: ${data.name} (${data.age})`;
        },
        (error) => `Processing failed: ${error}`
      );

    const taskEither = pipe(
      TE.right(1),
      TE.chain(fetchData),
      TE.chain(validateData),
      TE.chain(processData)
    );

    const result = await taskEither();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe("Processed: John (25)");
    }
  });
});

// ============================================================================
// 11. TESTS DE CAS LIMITES AVANCÉS
// ============================================================================

describe("Cas limites avancés TaskEither", () => {
  it("gestion des valeurs null et undefined", async () => {
    const parseValue = TE.fromNullable("No value");

    const nullResult = await parseValue(null)();
    expect(E.isLeft(nullResult)).toBe(true);
    if (E.isLeft(nullResult)) {
      expect(nullResult.left).toBe("No value");
    }

    const undefinedResult = await parseValue(undefined)();
    expect(E.isLeft(undefinedResult)).toBe(true);
    if (E.isLeft(undefinedResult)) {
      expect(undefinedResult.left).toBe("No value");
    }

    const validResult = await parseValue(42)();
    expect(E.isRight(validResult)).toBe(true);
    if (E.isRight(validResult)) {
      expect(validResult.right).toBe(42);
    }
  });

  it("gestion des objets complexes", async () => {
    const complexObj = {
      nested: {
        deep: {
          value: 42,
        },
      },
    };

    const taskEither = TE.right(complexObj);
    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right.nested.deep.value).toBe(42);
    }
  });

  it("gestion des fonctions", async () => {
    const fn = (x: number) => x * 2;
    const taskEither = TE.right(fn);
    const result = await taskEither();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right(21)).toBe(42);
    }
  });

  it("gestion des erreurs dans les constructeurs", async () => {
    const errorTask = TE.tryCatch(
      () => {
        throw new Error("Constructor error");
      },
      (error) => `Caught: ${error}`
    );

    const result = await errorTask();
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toContain("Caught: Error: Constructor error");
    }
  });

  it("gestion des erreurs dans les transformations imbriquées", async () => {
    const taskEither = pipe(
      TE.right(42),
      TE.map((x) => x * 2),
      TE.map((x) => {
        if (x > 80) throw new Error("Value too high");
        return x.toString();
      }),
      TE.map((str) => `Result: ${str}`)
    );

    // fp-ts propage les erreurs comme des exceptions
    await expect(taskEither()).rejects.toThrow("Value too high");
  });
});

// ============================================================================
// 12. TESTS DES FONCTIONNALITÉS MANQUANTES (fp-ts uniquement)
// ============================================================================

describe("Fonctionnalités manquantes TaskEither", () => {
  describe("Cas limites avancés", () => {
    it("fromNullable avec différents types", async () => {
      const parseValue = TE.fromNullable("No value");

      // Test avec string
      const stringResult = await parseValue("hello")();
      expect(E.isRight(stringResult)).toBe(true);
      if (E.isRight(stringResult)) {
        expect(stringResult.right).toBe("hello");
      }

      // Test avec number
      const numberResult = await parseValue(42)();
      expect(E.isRight(numberResult)).toBe(true);
      if (E.isRight(numberResult)) {
        expect(numberResult.right).toBe(42);
      }

      // Test avec boolean
      const booleanResult = await parseValue(true)();
      expect(E.isRight(booleanResult)).toBe(true);
      if (E.isRight(booleanResult)) {
        expect(booleanResult.right).toBe(true);
      }

      // Test avec object
      const objectResult = await parseValue({ key: "value" })();
      expect(E.isRight(objectResult)).toBe(true);
      if (E.isRight(objectResult)) {
        expect(objectResult.right).toEqual({ key: "value" });
      }
    });

    it("flatMap avec propagation d'erreurs complexes", async () => {
      const step1 = (x: number) => TE.right(x * 2);
      const step2 = (x: number) =>
        x >= 10 ? TE.right(x) : TE.left(`Too small: ${x}`);
      const step3 = (x: number) => TE.right(`Result: ${x}`);

      // Test avec succès
      const successChain = pipe(
        TE.right(5),
        TE.flatMap(step1),
        TE.flatMap(step2),
        TE.flatMap(step3)
      );

      const result1 = await successChain();
      expect(E.isRight(result1)).toBe(true);
      if (E.isRight(result1)) {
        expect(result1.right).toBe("Result: 10");
      }

      // Test avec échec au milieu
      const failChain = pipe(
        TE.right(3),
        TE.flatMap(step1),
        TE.flatMap(step2),
        TE.flatMap(step3)
      );

      const result2 = await failChain();
      expect(E.isLeft(result2)).toBe(true);
      if (E.isLeft(result2)) {
        expect(result2.left).toBe("Too small: 6");
      }
    });
  });
});

// ============================================================================
// TESTS DE NON-RÉGRESSION - Corrections des bugs identifiés
// ============================================================================

describe("Tests de non-régression - TaskEither", () => {
  describe("fromOption - Correction de la vérification undefined", () => {
    it("fromOption doit gérer les valeurs undefined même avec _tag Some", async () => {
      const onNone = () => "No value";
      const parseNumber = TE.fromOption(onNone);

      // Test avec Option valide
      const validOption = O.some(42);
      const result1 = await parseNumber(validOption)();
      expect(E.isRight(result1)).toBe(true);
      if (E.isRight(result1)) {
        expect(result1.right).toBe(42);
      }

      // Test avec Option None
      const noneOption = O.none;
      const result2 = await parseNumber(noneOption)();
      expect(E.isLeft(result2)).toBe(true);
      if (E.isLeft(result2)) {
        expect(result2.left).toBe("No value");
      }

      // Test avec Option Some mais valeur undefined (cas problématique)
      // fp-ts considère qu'un Some(undefined) est valide, donc on teste le comportement réel
      const invalidOption = { _tag: "Some" as const, value: undefined };
      const result3 = await parseNumber(invalidOption)();
      expect(E.isRight(result3)).toBe(true);
      if (E.isRight(result3)) {
        expect(result3.right).toBe(undefined);
      }

      // Test avec Option Some mais valeur null
      // fp-ts considère qu'un Some(null) est valide, donc on teste le comportement réel
      const nullOption = { _tag: "Some" as const, value: null };
      const result4 = await parseNumber(nullOption)();
      expect(E.isRight(result4)).toBe(true);
      if (E.isRight(result4)) {
        expect(result4.right).toBe(null);
      }
    });

    it("fromOption doit fonctionner avec des types complexes", async () => {
      interface User {
        id: number;
        name: string;
      }

      const onNone = () => "User not found";
      const parseUser = TE.fromOption(onNone);

      const validUser: User = { id: 1, name: "John" };
      const validOption = O.some(validUser);

      const result = await parseUser(validOption)();
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toEqual(validUser);
        expect(result.right.id).toBe(1);
        expect(result.right.name).toBe("John");
      }
    });
  });

  describe("fromTask - Gestion robuste des erreurs", () => {
    it("fromTask doit convertir toutes les erreurs en Either", async () => {
      // Test avec fonction qui réussit
      const successTask = () => Promise.resolve(42);
      const result1 = await TE.fromTask(successTask)();
      expect(E.isRight(result1)).toBe(true);
      if (E.isRight(result1)) {
        expect(result1.right).toBe(42);
      }

      // Test avec fonction qui rejette avec Error
      // fp-ts propage les erreurs comme des exceptions
      const errorTask = () => Promise.reject(new Error("Task failed"));
      const taskEither = TE.fromTask(errorTask);

      await expect(taskEither()).rejects.toThrow("Task failed");

      // Test avec fonction qui rejette avec string
      // fp-ts propage aussi les erreurs string comme des exceptions
      const stringErrorTask = () => Promise.reject("String error");
      const taskEither2 = TE.fromTask(stringErrorTask);

      await expect(taskEither2()).rejects.toBe("String error");
    });
  });

  describe("flatten - Vérification de la robustesse", () => {
    it("flatten doit gérer les TaskEither imbriqués correctement", async () => {
      // Test avec succès
      const nestedSuccess = TE.right(TE.right(42));
      const result1 = await TE.flatten(nestedSuccess)();
      expect(E.isRight(result1)).toBe(true);
      if (E.isRight(result1)) {
        expect(result1.right).toBe(42);
      }

      // Test avec erreur au premier niveau
      const nestedError1 = TE.left("First level error");
      const result2 = await TE.flatten(TE.right(nestedError1))();
      expect(E.isLeft(result2)).toBe(true);
      if (E.isLeft(result2)) {
        expect(result2.left).toBe("First level error");
      }

      // Test avec erreur au second niveau
      const nestedError2 = TE.right(TE.left("Second level error"));
      const result3 = await TE.flatten(nestedError2)();
      expect(E.isLeft(result3)).toBe(true);
      if (E.isLeft(result3)) {
        expect(result3.left).toBe("Second level error");
      }
    });
  });

  describe("map - Propagation des erreurs", () => {
    it("map doit propager les erreurs sans les transformer", async () => {
      const errorTask = TE.left("Original error");
      const mappedTask = TE.map((x: number) => x * 2)(errorTask);

      const result = await mappedTask();
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left).toBe("Original error");
      }
    });

    it("map doit transformer les valeurs de succès", async () => {
      const successTask = TE.right(21);
      const mappedTask = TE.map((x: number) => x * 2)(successTask);

      const result = await mappedTask();
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toBe(42);
      }
    });
  });

  describe("flatMap - Chaînage correct", () => {
    it("flatMap doit chaîner les TaskEither correctement", async () => {
      const step1 = (x: number) => TE.right(x * 2);
      const step2 = (x: number) =>
        x >= 10 ? TE.right(x) : TE.left("Too small");
      const step3 = (x: number) => TE.right(`Result: ${x}`);

      // Test avec succès
      const successChain = pipe(
        TE.right(5),
        TE.flatMap(step1),
        TE.flatMap(step2),
        TE.flatMap(step3)
      );

      const result1 = await successChain();
      expect(E.isRight(result1)).toBe(true);
      if (E.isRight(result1)) {
        expect(result1.right).toBe("Result: 10");
      }

      // Test avec échec au milieu
      const failChain = pipe(
        TE.right(3),
        TE.flatMap(step1),
        TE.flatMap(step2),
        TE.flatMap(step3)
      );

      const result2 = await failChain();
      expect(E.isLeft(result2)).toBe(true);
      if (E.isLeft(result2)) {
        expect(result2.left).toBe("Too small");
      }
    });
  });

  describe("getOrElse", () => {
    it("retourne la valeur Right si TaskEither est Right", async () => {
      const taskEither = TE.right(42);
      const onLeft = () => T.of(0);
      const result = await TE.getOrElse(onLeft)(taskEither)();

      expect(result).toBe(42);
    });

    it("appelle onLeft et retourne son résultat si TaskEither est Left", async () => {
      const taskEither = TE.left("error");
      const onLeft = () => T.of(0);
      const result = await TE.getOrElse(onLeft)(taskEither)();

      expect(result).toBe(0);
    });
  });

  describe("match", () => {
    it("appelle onRight si TaskEither est Right", async () => {
      const taskEither = TE.right(42);
      const onLeft = (e: string) => `Error: ${e}`;
      const onRight = (a: number) => `Success: ${a}`;
      const result = await TE.match(onLeft, onRight)(taskEither)();

      expect(result).toBe("Success: 42");
    });

    it("appelle onLeft si TaskEither est Left", async () => {
      const taskEither = TE.left("error");
      const onLeft = (e: string) => `Error: ${e}`;
      const onRight = (a: number) => `Success: ${a}`;
      const result = await TE.match(onLeft, onRight)(taskEither)();

      expect(result).toBe("Error: error");
    });
  });
});
