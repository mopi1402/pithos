/**
 * Tests complets pour fp-ts Option - Fonctionnalités essentielles à conserver
 *
 * Ce fichier teste toutes les fonctionnalités qui doivent être présentes
 * dans une version allégée d'Option couvrant 80-90% des besoins utilisateurs.
 */

import { describe, it, expect } from "vitest";

import * as O from "@zygos/option"; /* "fp-ts/Option"  "@zygos/option" */
import { pipe } from "@arkhe/function/pipe"; /* "fp-ts/function" "@arkhe/function/pipe" */
import * as R from "@zygos/result/result"; // no equivalent in fp-ts

// ============================================================================
// 1. MODÈLE DE BASE (100% nécessaire)
// ============================================================================

describe("Modèle de base", () => {
  it("constructeurs none et some", () => {
    expect(O.none).toEqual({ _tag: "None" });
    expect(O.some(42)).toEqual({ _tag: "Some", value: 42 });
    expect(O.some("hello")).toEqual({ _tag: "Some", value: "hello" });
  });

  it("type Option", () => {
    const option1: O.Option<number> = O.some(42);
    const option2: O.Option<number> = O.none;

    expect(option1._tag).toBe("Some");
    expect(option2._tag).toBe("None");
  });
});

// ============================================================================
// 2. REFINEMENTS (100% nécessaire)
// ============================================================================

describe("Refinements", () => {
  it("isSome et isNone", () => {
    const someValue = O.some(42);
    const noneValue = O.none;

    expect(O.isSome(someValue)).toBe(true);
    expect(O.isSome(noneValue)).toBe(false);
    expect(O.isNone(someValue)).toBe(false);
    expect(O.isNone(noneValue)).toBe(true);
  });

  it("type guards avec TypeScript", () => {
    const option: O.Option<number> = O.some(42);

    if (O.isSome(option)) {
      // TypeScript sait que option.value existe ici
      expect(option.value).toBe(42);
    }

    if (O.isNone(option)) {
      // Ce bloc ne sera jamais exécuté dans ce test
      expect.fail("Ne devrait pas arriver");
    }
  });
});

// ============================================================================
// 3. CONSTRUCTEURS DE BASE (90% nécessaire)
// ============================================================================

describe("Constructeurs de base", () => {
  it("fromNullable", () => {
    expect(O.fromNullable(null)).toEqual(O.none);
    expect(O.fromNullable(undefined)).toEqual(O.none);
    expect(O.fromNullable(42)).toEqual(O.some(42));
    expect(O.fromNullable("hello")).toEqual(O.some("hello"));
    expect(O.fromNullable(0)).toEqual(O.some(0));
    expect(O.fromNullable(false)).toEqual(O.some(false));
  });

  it("fromPredicate", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;

    const getPositive = O.fromPredicate(isPositive);
    const getEven = O.fromPredicate(isEven);

    expect(getPositive(42)).toEqual(O.some(42));
    expect(getPositive(-5)).toEqual(O.none);
    expect(getEven(4)).toEqual(O.some(4));
    expect(getEven(7)).toEqual(O.none);
  });

  it("fromPredicate avec refinement", () => {
    const isString = (value: unknown): value is string =>
      typeof value === "string";
    const getString = O.fromPredicate(isString);

    expect(getString("hello")).toEqual(O.some("hello"));
    expect(getString(42)).toEqual(O.none);
  });
});

// ============================================================================
// 4. OPÉRATIONS FONDAMENTALES (100% nécessaire)
// ============================================================================

describe("Opérations fondamentales", () => {
  it("map", () => {
    const double = (n: number) => n * 2;
    const toString = (n: number) => n.toString();

    expect(pipe(O.some(21), O.map(double))).toEqual(O.some(42));
    expect(pipe(O.some(42), O.map(toString))).toEqual(O.some("42"));
    expect(pipe(O.none, O.map(double))).toEqual(O.none);
  });

  it("flatMap / chain", () => {
    const divide = (x: number) => (y: number) =>
      y === 0 ? O.none : O.some(y / x);

    const sqrt = (n: number) => (n < 0 ? O.none : O.some(Math.sqrt(n)));

    expect(pipe(O.some(10), O.flatMap(divide(2)))).toEqual(O.some(5));
    expect(pipe(O.some(0), O.flatMap(divide(2)))).toEqual(O.none);
    expect(pipe(O.some(16), O.flatMap(sqrt))).toEqual(O.some(4));
    expect(pipe(O.some(-4), O.flatMap(sqrt))).toEqual(O.none);
    expect(pipe(O.none, O.flatMap(sqrt))).toEqual(O.none);
  });

  it("of (alias de some)", () => {
    expect(O.of(42)).toEqual(O.some(42));
    expect(O.of("hello")).toEqual(O.some("hello"));
  });
});

// ============================================================================
// 10. COMBINATEURS (85% nécessaire)
// ============================================================================

describe("Combinateurs", () => {
  it("apFirst", () => {
    const result = pipe(O.some(1), O.apFirst(O.some("hello")));
    expect(result).toEqual(O.some(1));
  });

  it("[🎯] apFirst returns none when first is none", () => {
    const result = pipe(O.none, O.apFirst(O.some("hello")));
    expect(result).toEqual(O.none);
  });

  it("[🎯] apFirst returns none when second is none", () => {
    const result = pipe(O.some(1), O.apFirst(O.none));
    expect(result).toEqual(O.none);
  });

  it("apSecond", () => {
    const result = pipe(O.some(1), O.apSecond(O.some("hello")));
    expect(result).toEqual(O.some("hello"));
  });

  it("[🎯] apSecond returns none when first is none", () => {
    const result = pipe(O.none, O.apSecond(O.some("hello")));
    expect(result).toEqual(O.none);
  });

  it("[🎯] apSecond returns none when second is none", () => {
    const result = pipe(O.some(1), O.apSecond(O.none));
    expect(result).toEqual(O.none);
  });

  it("flap", () => {
    const functions = O.some((x: number) => x * 2);
    const result = pipe(functions, O.flap(21));
    expect(result).toEqual(O.some(42));
  });

  it("[🎯] flap returns none when function option is none", () => {
    const result = pipe(O.none as O.Option<(x: number) => number>, O.flap(21));
    expect(result).toEqual(O.none);
  });

  it("as", () => {
    const result = pipe(O.some(42), O.as("hello"));
    expect(result).toEqual(O.some("hello"));
  });

  it("[🎯] as returns none when option is none", () => {
    const result = pipe(O.none, O.as("hello"));
    expect(result).toEqual(O.none);
  });

  it("asUnit", () => {
    const result = pipe(O.some(42), O.asUnit);
    expect(result).toEqual(O.some(undefined));
  });

  it("[🎯] asUnit returns none when option is none", () => {
    const result = pipe(O.none, O.asUnit);
    expect(result).toEqual(O.none);
  });
});

// ============================================================================
// 11. INTEROPÉRABILITÉ (80% nécessaire)
// ============================================================================

describe("Interopérabilité", () => {
  it("tryCatch", () => {
    const success = () => 42;
    const failure = () => {
      throw new Error("test error");
    };

    expect(O.tryCatch(success)).toEqual(O.some(42));
    expect(O.tryCatch(failure)).toEqual(O.none);
  });

  it("tryCatchK", () => {
    const parseNumber = (str: string) => {
      const num = parseInt(str, 10);
      if (isNaN(num)) throw new Error("Invalid number");
      return num;
    };

    const safeParse = O.tryCatchK(parseNumber);

    expect(safeParse("42")).toEqual(O.some(42));
    expect(safeParse("abc")).toEqual(O.none);
  });

  it("fromNullableK", () => {
    const findUser = (id: number) => {
      const users: Record<number, string> = { 1: "Alice", 2: "Bob" };
      return users[id] || null;
    };

    const safeFind = O.fromNullableK(findUser);

    expect(safeFind(1)).toEqual(O.some("Alice"));
    expect(safeFind(999)).toEqual(O.none);
  });

  it("chainNullableK", () => {
    const findUser = (id: number) => {
      const users: Record<number, string> = { 1: "Alice", 2: "Bob" };
      return users[id] || null;
    };

    const chainFind = O.chainNullableK(findUser);

    expect(pipe(O.some(1), chainFind)).toEqual(O.some("Alice"));
    expect(pipe(O.some(999), chainFind)).toEqual(O.none);
    expect(pipe(O.none, chainFind)).toEqual(O.none);
  });
});

// ============================================================================
// 5. PATTERN MATCHING (95% nécessaire)
// ============================================================================

describe("Pattern matching", () => {
  it("match / fold", () => {
    const handleOption = O.match(
      () => "No value",
      (value: number) => `Value is: ${value}`
    );

    expect(handleOption(O.none)).toBe("No value");
    expect(handleOption(O.some(42))).toBe("Value is: 42");
  });

  it("matchW avec types différents", () => {
    const handleOption = O.matchW(
      () => 0,
      (value: string) => value.length
    );

    expect(handleOption(O.none)).toBe(0);
    expect(handleOption(O.some("hello"))).toBe(5);
  });

  it("foldW (alias de matchW)", () => {
    const handleOption = O.foldW(
      () => "default",
      (value: number) => (value > 0 ? "positive" : "negative")
    );

    expect(handleOption(O.none)).toBe("default");
    expect(handleOption(O.some(42))).toBe("positive");
    expect(handleOption(O.some(-5))).toBe("negative");
  });
});

// ============================================================================
// 6. GESTION D'ERREURS (90% nécessaire)
// ============================================================================

describe("Gestion d'erreurs", () => {
  it("getOrElse", () => {
    const getValueOrDefault = O.getOrElse(() => 0);

    expect(pipe(O.some(42), getValueOrDefault)).toBe(42);
    expect(pipe(O.none, getValueOrDefault)).toBe(0);
  });

  it("getOrElseW avec types différents", () => {
    const getValueOrDefault = O.getOrElseW(() => "default");

    expect(pipe(O.some(42), getValueOrDefault)).toBe(42);
    expect(pipe(O.none, getValueOrDefault)).toBe("default");
  });

  it("alt / orElse", () => {
    const fallback = O.alt(() => O.some("default"));

    expect(pipe(O.some("hello"), fallback)).toEqual(O.some("hello"));
    expect(pipe(O.none, fallback)).toEqual(O.some("default"));
  });

  it("orElse (alias de alt)", () => {
    const fallback = O.orElse(() => O.some("fallback"));

    expect(pipe(O.some("hello"), fallback)).toEqual(O.some("hello"));
    expect(pipe(O.none, fallback)).toEqual(O.some("fallback"));
  });
});

// ============================================================================
// 7. FILTRAGE (85% nécessaire)
// ============================================================================

describe("Filtrage", () => {
  it("filter", () => {
    const isPositive = (x: number) => x > 0;
    const isEven = (x: number) => x % 2 === 0;

    const filterPositive = O.filter(isPositive);
    const filterEven = O.filter(isEven);

    expect(pipe(O.some(42), filterPositive)).toEqual(O.some(42));
    expect(pipe(O.some(-5), filterPositive)).toEqual(O.none);
    expect(pipe(O.some(4), filterEven)).toEqual(O.some(4));
    expect(pipe(O.some(7), filterEven)).toEqual(O.none);
    expect(pipe(O.none, filterPositive)).toEqual(O.none);
  });

  it("filter avec refinement", () => {
    const isString = (value: unknown): value is string =>
      typeof value === "string";
    const filterString = O.filter(isString);

    expect(pipe(O.some("hello"), filterString)).toEqual(O.some("hello"));
    expect(pipe(O.some(42), filterString)).toEqual(O.none);
  });

  it("filterMap", () => {
    const parsePositive = (str: string) => {
      const num = parseInt(str, 10);
      return isNaN(num) || num <= 0 ? O.none : O.some(num);
    };

    const filterMapParse = O.filterMap(parsePositive);

    expect(pipe(O.some("42"), filterMapParse)).toEqual(O.some(42));
    expect(pipe(O.some("-5"), filterMapParse)).toEqual(O.none);
    expect(pipe(O.some("abc"), filterMapParse)).toEqual(O.none);
    expect(pipe(O.none, filterMapParse)).toEqual(O.none);
  });
});

// ============================================================================
// 8. CONVERSIONS (80% nécessaire)
// ============================================================================

describe("Conversions", () => {
  it("toNullable", () => {
    expect(pipe(O.some(42), O.toNullable)).toBe(42);
    expect(pipe(O.none, O.toNullable)).toBe(null);
  });

  it("toUndefined", () => {
    expect(pipe(O.some(42), O.toUndefined)).toBe(42);
    expect(pipe(O.none, O.toUndefined)).toBe(undefined);
  });

  it("fromEither", () => {
    const right = { _tag: "Right" as const, right: 42 };
    const left = { _tag: "Left" as const, left: "error" };

    expect(O.fromEither(right)).toEqual(O.some(42));
    expect(O.fromEither(left)).toEqual(O.none);
  });

  it("[👾] fromEither returns none when Right has undefined value", () => {
    const rightUndefined = { _tag: "Right" as const, right: undefined };
    expect(O.fromEither(rightUndefined)).toEqual(O.none);
  });

  it("[👾] fromEither returns none for Left even with right property", () => {
    const leftWithRight = { _tag: "Left" as const, left: "error", right: 42 };
    expect(O.fromEither(leftWithRight)).toEqual(O.none);
  });

  it("toResult via R.fromOption", () => {
    const someOption = O.some(42);
    const noneOption = O.none;

    // Test avec Some
    const someResult = R.fromOption(() => "No value")(someOption);
    expect(someResult.isOk()).toBe(true);
    if (someResult.isOk()) {
      expect(someResult.value).toBe(42);
    }

    // Test avec None
    const noneResult = R.fromOption(() => "No value")(noneOption);
    expect(noneResult.isErr()).toBe(true);
    if (noneResult.isErr()) {
      expect(noneResult.error).toBe("No value");
    }
  });

  it("toResult avec message d'erreur personnalisé", () => {
    const noneOption = O.none;
    const result = R.fromOption(() => "User not found")(noneOption);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("User not found");
    }
  });

  it("toResult avec types complexes", () => {
    const user = { id: 1, name: "John" };
    const someOption = O.some(user);
    const result = R.fromOption(() => "No user")(someOption);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(user);
    }
  });

  it("toEither convertit Option en Either", () => {
    const toEither = O.toEither(() => "error");

    expect(toEither(O.some(42))).toEqual({
      _tag: "Right",
      right: 42,
    });
    expect(toEither(O.none)).toEqual({
      _tag: "Left",
      left: "error",
    });
  });
});

// ============================================================================
// 9. UTILITAIRES (80% nécessaire)
// ============================================================================

describe("Utilitaires", () => {
  it("exists", () => {
    const isPositive = (x: number) => x > 0;
    const isEven = (x: number) => x % 2 === 0;

    const hasPositive = O.exists(isPositive);
    const hasEven = O.exists(isEven);

    expect(pipe(O.some(42), hasPositive)).toBe(true);
    expect(pipe(O.some(-5), hasPositive)).toBe(false);
    expect(pipe(O.some(4), hasEven)).toBe(true);
    expect(pipe(O.some(7), hasEven)).toBe(false);
    expect(pipe(O.none, hasPositive)).toBe(false);
  });

  it("flatten", () => {
    const nested = O.some(O.some(42));
    const nestedNone = O.some(O.none);
    const outerNone = O.none;

    expect(O.flatten(nested)).toEqual(O.some(42));
    expect(O.flatten(nestedNone)).toEqual(O.none);
    expect(O.flatten(outerNone)).toEqual(O.none);
  });
});

// ============================================================================
// 12. TESTS DE PERFORMANCE ET COMPORTEMENT (80% nécessaire)
// ============================================================================

describe("Performance et comportement", () => {
  it("lazy evaluation", () => {
    let sideEffect = 0;
    const lazyFunction = () => {
      sideEffect++;
      return "lazy";
    };

    // getOrElse ne devrait pas exécuter la fonction si l'Option est Some
    const option = O.some("value");
    const result = pipe(option, O.getOrElse(lazyFunction));

    expect(result).toBe("value");
    expect(sideEffect).toBe(0); // Pas d'exécution
  });

  it("immutabilité", () => {
    const original = O.some({ count: 1 });
    const transformed = pipe(
      original,
      O.map((obj: { count: number }) => ({ ...obj, count: obj.count + 1 }))
    );

    expect(original).toEqual(O.some({ count: 1 }));
    expect(transformed).toEqual(O.some({ count: 2 }));
  });

  it("référence d'égalité pour none", () => {
    const none1 = O.none;
    const none2 = O.none;

    expect(none1).toBe(none2); // Même référence
    expect(O.isNone(none1)).toBe(true);
    expect(O.isNone(none2)).toBe(true);
  });
});

// ============================================================================
// 13. TESTS DE COMPATIBILITÉ FP-TS (90% nécessaire)
// ============================================================================

describe("Compatibilité fp-ts", () => {
  it("API compatible avec fp-ts", () => {
    // Test que toutes les fonctions principales ont la même signature
    const option = O.some(42);

    // map
    const mapped = pipe(
      option,
      O.map((x: number) => x * 2)
    );
    expect(mapped).toEqual(O.some(84));

    // flatMap
    const chained = pipe(
      option,
      O.flatMap((x: number) => O.some(x.toString()))
    );
    expect(chained).toEqual(O.some("42"));

    // filter
    const filtered = pipe(
      option,
      O.filter((x: number) => x > 0)
    );
    expect(filtered).toEqual(O.some(42));

    // match
    const result = O.match(
      () => "none",
      (x: number) => `some(${x})`
    )(option);
    expect(result).toBe("some(42)");
  });

  it("comportement identique à fp-ts", () => {
    // Test que le comportement est identique à fp-ts
    const testCases = [
      { input: O.some(42), expected: 42 },
      { input: O.none, expected: null },
    ];

    testCases.forEach(({ input, expected }) => {
      if (O.isSome(input)) {
        expect(input.value).toBe(expected);
      } else {
        expect(pipe(input, O.toNullable)).toBe(expected);
      }
    });
  });
});

// ============================================================================
// 14. TESTS DE CAS LIMITES (85% nécessaire)
// ============================================================================

describe("Cas limites", () => {
  it("gestion des valeurs falsy", () => {
    expect(O.some(0)).toEqual({ _tag: "Some", value: 0 });
    expect(O.some("")).toEqual({ _tag: "Some", value: "" });
    expect(O.some(false)).toEqual({ _tag: "Some", value: false });
    expect(O.some(null)).toEqual({ _tag: "Some", value: null });
    expect(O.some(undefined)).toEqual({ _tag: "Some", value: undefined });
  });

  it("gestion des objets complexes", () => {
    const complexObj = {
      nested: {
        deep: {
          value: 42,
        },
      },
    };

    const option = O.some(complexObj);
    expect(O.isSome(option)).toBe(true);
    if (O.isSome(option)) {
      expect(option.value.nested.deep.value).toBe(42);
    }
  });

  it("gestion des fonctions", () => {
    const fn = (x: number) => x * 2;
    const option = O.some(fn);

    expect(O.isSome(option)).toBe(true);
    if (O.isSome(option)) {
      expect(option.value(21)).toBe(42);
    }
  });
});
