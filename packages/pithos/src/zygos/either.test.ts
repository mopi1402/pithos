/**
 * Tests complets pour fp-ts Either - Fonctionnalités essentielles à conserver
 *
 * Ce fichier teste toutes les fonctionnalités qui doivent être présentes
 * dans une version allégée d'Either couvrant 90% des besoins utilisateurs.
 */

import { describe, it, expect } from "vitest";

import * as E from "@zygos/either"; // "fp-ts/Either" "@zygos/either"
import { pipe } from "@arkhe/function/pipe"; // "fp-ts/function" "@arkhe/function/pipe"

// ============================================================================
// 1. MODÈLE DE BASE (100% nécessaire)
// ============================================================================

describe("Modèle de base", () => {
  it("constructeurs left et right", () => {
    expect(E.left("error")).toEqual({ _tag: "Left", left: "error" });
    expect(E.right(42)).toEqual({ _tag: "Right", right: 42 });
    expect(E.right("hello")).toEqual({ _tag: "Right", right: "hello" });
  });

  it("type Either", () => {
    const either1: E.Either<string, number> = E.right(42);
    const either2: E.Either<string, number> = E.left("error");

    expect(either1._tag).toBe("Right");
    expect(either2._tag).toBe("Left");
  });

  it("types complexes", () => {
    type User = { name: string; age: number };
    type UserError = { code: string; message: string };

    const userEither: E.Either<UserError, User> = E.right({
      name: "John",
      age: 30,
    });
    const errorEither: E.Either<UserError, User> = E.left({
      code: "404",
      message: "Not found",
    });

    expect(userEither._tag).toBe("Right");
    expect(errorEither._tag).toBe("Left");

    if (E.isRight(userEither)) {
      expect(userEither.right.name).toBe("John");
      expect(userEither.right.age).toBe(30);
    }

    if (E.isLeft(errorEither)) {
      expect(errorEither.left.code).toBe("404");
      expect(errorEither.left.message).toBe("Not found");
    }
  });
});

// ============================================================================
// 2. REFINEMENTS (100% nécessaire)
// ============================================================================

describe("Refinements", () => {
  it("isLeft et isRight", () => {
    const leftValue = E.left("error");
    const rightValue = E.right(42);

    expect(E.isLeft(leftValue)).toBe(true);
    expect(E.isLeft(rightValue)).toBe(false);
    expect(E.isRight(rightValue)).toBe(true);
    expect(E.isRight(leftValue)).toBe(false);
  });

  it("type guards avec TypeScript", () => {
    const either: E.Either<string, number> = E.right(42);

    if (E.isRight(either)) {
      // TypeScript sait que either.right existe ici
      expect(either.right).toBe(42);
    }

    if (E.isLeft(either)) {
      // Ce bloc ne sera jamais exécuté dans ce test
      expect.fail("Ne devrait pas arriver");
    }
  });
});

// ============================================================================
// 3. PATTERN MATCHING (100% nécessaire)
// ============================================================================

describe("Pattern Matching", () => {
  it("match avec left et right", () => {
    const onLeft = (error: string) => `Error: ${error}`;
    const onRight = (value: number) => `Success: ${value}`;

    const leftResult = E.match(onLeft, onRight)(E.left("failure"));
    const rightResult = E.match(onLeft, onRight)(E.right(42));

    expect(leftResult).toBe("Error: failure");
    expect(rightResult).toBe("Success: 42");
  });

  it("fold alias de match", () => {
    const onLeft = (error: string) => `Error: ${error}`;
    const onRight = (value: number) => `Success: ${value}`;

    const leftResult = E.fold(onLeft, onRight)(E.left("failure"));
    const rightResult = E.fold(onLeft, onRight)(E.right(42));

    expect(leftResult).toBe("Error: failure");
    expect(rightResult).toBe("Success: 42");
  });

  it("matchW avec types différents", () => {
    const onLeft = (error: string) => error.length;
    const onRight = (value: number) => value.toString();

    const leftResult = E.matchW(onLeft, onRight)(E.left("error"));
    const rightResult = E.matchW(onLeft, onRight)(E.right(42));

    expect(leftResult).toBe(5); // "error".length
    expect(rightResult).toBe("42");
  });
});

// ============================================================================
// 4. GESTION D'ERREURS (100% nécessaire)
// ============================================================================

describe("Gestion d'erreurs", () => {
  it("getOrElse avec valeur par défaut", () => {
    const defaultValue = 0;
    const onLeft = () => defaultValue;

    const leftResult = E.getOrElse(onLeft)(E.left("error"));
    const rightResult = E.getOrElse(onLeft)(E.right(42));

    expect(leftResult).toBe(0);
    expect(rightResult).toBe(42);
  });

  it("orElse pour récupération d'erreur", () => {
    const fallback = () => E.right(0); // Retourne le même type A (number)

    const leftResult = E.orElse(fallback)(E.left("original error"));
    const rightResult = E.orElse(fallback)(E.right(42));

    expect(E.isRight(leftResult)).toBe(true);
    if (E.isRight(leftResult)) {
      expect(leftResult.right).toBe(0);
    }
    expect(rightResult).toEqual(E.right(42));
  });

  it("orElseW avec types différents", () => {
    const fallback = () => E.right("fallback value"); // Retourne un type B différent

    const leftResult = E.orElseW(fallback)(E.left("original error"));
    const rightResult = E.orElseW(fallback)(E.right(42));

    expect(E.isRight(leftResult)).toBe(true);
    if (E.isRight(leftResult)) {
      expect(leftResult.right).toBe("fallback value");
    }
    expect(rightResult).toEqual(E.right(42));
  });
});

// ============================================================================
// 5. TRANSFORMATIONS DE BASE (100% nécessaire)
// ============================================================================

describe("Transformations de base", () => {
  it("map transforme la valeur de succès", () => {
    const double = (n: number) => n * 2;
    const toString = (n: number) => n.toString();

    const leftResult = E.map(double)(E.left("error"));
    const rightResult = E.map(double)(E.right(21));
    const stringResult = E.map(toString)(E.right(42));

    expect(leftResult).toEqual(E.left("error"));
    expect(rightResult).toEqual(E.right(42));
    expect(stringResult).toEqual(E.right("42"));
  });

  it("mapLeft transforme l'erreur", () => {
    const toUpperCase = (s: string) => s.toUpperCase();
    const addPrefix = (s: string) => `ERROR: ${s}`;

    const leftResult = E.mapLeft(toUpperCase)(E.left("error"));
    const rightResult = E.mapLeft(toUpperCase)(E.right(42));
    const prefixResult = E.mapLeft(addPrefix)(E.left("validation failed"));

    expect(leftResult).toEqual(E.left("ERROR"));
    expect(rightResult).toEqual(E.right(42));
    expect(prefixResult).toEqual(E.left("ERROR: validation failed"));
  });

  it("bimap transforme les deux côtés", () => {
    const transformError = (s: string) => s.toUpperCase();
    const transformValue = (n: number) => n * 2;

    const leftResult = E.bimap(transformError, transformValue)(E.left("error"));
    const rightResult = E.bimap(transformError, transformValue)(E.right(21));

    expect(leftResult).toEqual(E.left("ERROR"));
    expect(rightResult).toEqual(E.right(42));
  });
});

// ============================================================================
// 6. CHAÎNAGE ET SÉQUENÇAGE (100% nécessaire)
// ============================================================================

describe("Chaînage et séquençage", () => {
  it("flatMap pour chaînage monadique", () => {
    const divide = (n: number) => (d: number) =>
      d === 0 ? E.left("division by zero") : E.right(n / d);

    const leftResult = E.flatMap(divide(10))(E.left("first error"));
    const rightWithError = E.flatMap(divide(10))(E.right(0));
    const rightWithSuccess = E.flatMap(divide(10))(E.right(2));

    expect(leftResult).toEqual(E.left("first error"));
    expect(rightWithError).toEqual(E.left("division by zero"));
    expect(rightWithSuccess).toEqual(E.right(5));
  });

  it("tap exécute un effet sans changer la valeur", () => {
    let sideEffect = 0;
    const effect = (n: number) => {
      sideEffect += n;
      return E.right(undefined);
    };

    const leftResult = E.tap(E.left("error"), effect);
    const rightResult = E.tap(E.right(42), effect);

    expect(leftResult).toEqual(E.left("error"));
    expect(rightResult).toEqual(E.right(42));
    expect(sideEffect).toBe(42); // Seule la valeur Right déclenche l'effet
  });

  it("flatten aplatit un Either imbriqué", () => {
    const nestedRight = E.right(E.right(42));
    const nestedLeft = E.right(E.left("inner error"));
    const outerLeft = E.left("outer error");

    const flattenedRight = E.flatten(nestedRight);
    const flattenedLeft = E.flatten(nestedLeft);
    const flattenedOuter = E.flatten(outerLeft);

    expect(flattenedRight).toEqual(E.right(42));
    expect(flattenedLeft).toEqual(E.left("inner error"));
    expect(flattenedOuter).toEqual(E.left("outer error"));
  });
});

// ============================================================================
// 7. CRÉATION DEPUIS DES VALEURS (90% nécessaire)
// ============================================================================

describe("Création depuis des valeurs", () => {
  it("fromPredicate avec prédicat simple", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;

    const positiveEither = E.fromPredicate(isPositive, () => "not positive");
    const evenEither = E.fromPredicate(isEven, () => "not even");

    expect(positiveEither(42)).toEqual(E.right(42));
    expect(positiveEither(-5)).toEqual(E.left("not positive"));
    expect(evenEither(4)).toEqual(E.right(4));
    expect(evenEither(7)).toEqual(E.left("not even"));
  });

  it("fromPredicate avec refinement", () => {
    const isString = (value: unknown): value is string =>
      typeof value === "string";
    const stringEither = E.fromPredicate(isString, () => "not a string");

    expect(stringEither("hello")).toEqual(E.right("hello"));
    expect(stringEither(42)).toEqual(E.left("not a string"));
  });

  it("fromNullable avec valeurs nullables", () => {
    const parseNumber = E.fromNullable("null value");

    expect(parseNumber(42)).toEqual(E.right(42));
    expect(parseNumber(null)).toEqual(E.left("null value"));
    expect(parseNumber(undefined)).toEqual(E.left("null value"));
    expect(parseNumber(0)).toEqual(E.right(0));
    expect(parseNumber(false)).toEqual(E.right(false));
  });

  it("tryCatch avec fonctions qui peuvent lever des exceptions", () => {
    const unsafeDivide = (a: number, b: number) => {
      if (b === 0) throw new Error("division by zero");
      return a / b;
    };

    const safeDivide = (a: number, b: number) =>
      E.tryCatch(
        () => unsafeDivide(a, b),
        (e) => (e instanceof Error ? e.message : "unknown error")
      );

    expect(safeDivide(10, 2)).toEqual(E.right(5));
    expect(safeDivide(10, 0)).toEqual(E.left("division by zero"));
  });

  it("tryCatchK avec fonctions curryfiées", () => {
    const unsafeParse = (str: string) => {
      const num = parseInt(str, 10);
      if (isNaN(num)) throw new Error("invalid number");
      return num;
    };

    const safeParse = E.tryCatchK(unsafeParse, (e) =>
      e instanceof Error ? e.message : "unknown error"
    );

    expect(safeParse("42")).toEqual(E.right(42));
    expect(safeParse("abc")).toEqual(E.left("invalid number"));
  });
});

// ============================================================================
// 8. CONVERSIONS (90% nécessaire)
// ============================================================================

describe("Conversions", () => {
  it("fromOption depuis Option", () => {
    const someOption = { _tag: "Some" as const, value: 42 };
    const noneOption = { _tag: "None" as const };

    const fromSome = E.fromOption(() => "no value")(someOption);
    const fromNone = E.fromOption(() => "no value")(noneOption);

    expect(fromSome).toEqual(E.right(42));
    expect(fromNone).toEqual(E.left("no value"));
  });

  it("toUnion extrait la valeur ou l'erreur", () => {
    const leftEither = E.left("error");
    const rightEither = E.right(42);

    const leftUnion = E.toUnion(leftEither);
    const rightUnion = E.toUnion(rightEither);

    expect(leftUnion).toBe("error");
    expect(rightUnion).toBe(42);
  });
});

// ============================================================================
// 9. UTILITAIRES DE BASE (90% nécessaire)
// ============================================================================

describe("Utilitaires de base", () => {
  it("swap inverse Left et Right", () => {
    const leftEither = E.left("error");
    const rightEither = E.right(42);

    const swappedLeft = E.swap(leftEither);
    const swappedRight = E.swap(rightEither);

    expect(swappedLeft).toEqual(E.right("error"));
    expect(swappedRight).toEqual(E.left(42));
  });

  it("exists vérifie un prédicat sur la valeur de succès", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;

    const leftEither = E.left("error");
    const rightPositive = E.right(42);
    const rightNegative = E.right(-5);

    expect(E.exists(isPositive)(leftEither)).toBe(false);
    expect(E.exists(isPositive)(rightPositive)).toBe(true);
    expect(E.exists(isPositive)(rightNegative)).toBe(false);
    expect(E.exists(isEven)(rightPositive)).toBe(true);
    expect(E.exists(isEven)(rightNegative)).toBe(false);
  });

  it("elem vérifie l'égalité avec une valeur", () => {
    const numberEq = {
      equals: (a: number, b: number) => a === b,
    };

    const leftEither = E.left("error");
    const rightEither = E.right(42);

    expect(E.elem(numberEq)(42)(leftEither)).toBe(false);
    expect(E.elem(numberEq)(42)(rightEither)).toBe(true);
    expect(E.elem(numberEq)(100)(rightEither)).toBe(false);
  });
});

// ============================================================================
// 10. FILTRAGE ET VALIDATION (80% nécessaire)
// ============================================================================

describe("Filtrage et validation", () => {
  it("filterOrElse filtre avec un prédicat", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;

    const positiveFilter = E.filterOrElse(isPositive, () => "not positive");
    const evenFilter = E.filterOrElse(isEven, () => "not even");

    const leftEither = E.left("original error");
    const rightPositive = E.right(42);
    const rightNegative = E.right(-5);

    expect(positiveFilter(leftEither)).toEqual(E.left("original error"));
    expect(positiveFilter(rightPositive)).toEqual(E.right(42));
    expect(positiveFilter(rightNegative)).toEqual(E.left("not positive"));

    expect(evenFilter(rightPositive)).toEqual(E.right(42));
    expect(evenFilter(E.right(7))).toEqual(E.left("not even"));
  });

  it("filterOrElse avec refinement", () => {
    const isString = (value: unknown): value is string =>
      typeof value === "string";
    const stringFilter = E.filterOrElse(isString, () => "not a string");

    const leftEither = E.left("original error");
    const rightString = E.right("hello");
    const rightNumber = E.right(42);

    expect(stringFilter(leftEither)).toEqual(E.left("original error"));
    expect(stringFilter(rightString)).toEqual(E.right("hello"));
    expect(stringFilter(rightNumber)).toEqual(E.left("not a string"));
  });
});

// ============================================================================
// 11. LIFTING ET FLATMAP AVANCÉS (80% nécessaire)
// ============================================================================

describe("Lifting et flatMap avancés", () => {
  it("liftNullable convertit des fonctions nullable", () => {
    const parseNumber = (str: string) => {
      const num = parseInt(str, 10);
      return isNaN(num) ? null : num;
    };

    const safeParseNumber = E.liftNullable(parseNumber, () => "invalid number");

    expect(safeParseNumber("42")).toEqual(E.right(42));
    expect(safeParseNumber("abc")).toEqual(E.left("invalid number"));
  });

  it("liftOption convertit des fonctions retournant Option", () => {
    const findUser = (id: number) => {
      if (id === 1)
        return { _tag: "Some" as const, value: { id: 1, name: "John" } };
      return { _tag: "None" as const };
    };

    const safeFindUser = E.liftOption(findUser, () => "user not found");

    expect(safeFindUser(1)).toEqual(E.right({ id: 1, name: "John" }));
    expect(safeFindUser(999)).toEqual(E.left("user not found"));
  });

  it("flatMapNullable chaîne avec des fonctions nullable", () => {
    const parseNumber = (str: string) => {
      const num = parseInt(str, 10);
      return isNaN(num) ? null : num;
    };

    const safeParseNumber = E.flatMapNullable(
      parseNumber,
      () => "invalid number"
    );

    const leftEither = E.left("original error");
    const rightString = E.right("42");
    const rightInvalid = E.right("abc");

    expect(safeParseNumber(leftEither)).toEqual(E.left("original error"));
    expect(safeParseNumber(rightString)).toEqual(E.right(42));
    expect(safeParseNumber(rightInvalid)).toEqual(E.left("invalid number"));
  });

  it("flatMapOption chaîne avec des fonctions retournant Option", () => {
    const findUser = (id: number) => {
      if (id === 1)
        return { _tag: "Some" as const, value: { id: 1, name: "John" } };
      return { _tag: "None" as const };
    };

    const safeFindUser = E.flatMapOption(findUser, () => "user not found");

    const leftEither = E.left("original error");
    const rightValidId = E.right(1);
    const rightInvalidId = E.right(999);

    expect(safeFindUser(leftEither)).toEqual(E.left("original error"));
    expect(safeFindUser(rightValidId)).toEqual(
      E.right({ id: 1, name: "John" })
    );
    expect(safeFindUser(rightInvalidId)).toEqual(E.left("user not found"));
  });
});

// ============================================================================
// 12. COMBINATEURS ET SÉQUENÇAGE AVANCÉS (70% nécessaire)
// ============================================================================

describe("Combinateurs et séquençage avancés", () => {
  it("apFirst garde le résultat du premier", () => {
    const first = E.right("first");
    const second = E.right("second");

    const result = E.apFirst(second)(first);
    expect(result).toEqual(E.right("first"));
  });

  it("apSecond garde le résultat du second", () => {
    const first = E.right("first");
    const second = E.right("second");

    const result = E.apSecond(second)(first);
    expect(result).toEqual(E.right("second"));
  });

  it("apFirst et apSecond avec erreurs", () => {
    const first = E.right("first");
    const second = E.left("second error");

    const firstResult = E.apFirst(second)(first);
    const secondResult = E.apSecond(second)(first);

    expect(firstResult).toEqual(E.left("second error"));
    expect(secondResult).toEqual(E.left("second error"));
  });

  it("[🎯] apFirst returns first error when first is Left", () => {
    const first = E.left("first error");
    const second = E.right("second");

    const result = E.apFirst(second)(first);
    expect(result).toEqual(E.left("first error"));
  });

  it("[🎯] apSecond returns first error when first is Left", () => {
    const first = E.left("first error");
    const second = E.right("second");

    const result = E.apSecond(second)(first);
    expect(result).toEqual(E.left("first error"));
  });

  it("ap applique une fonction dans un Either à une valeur dans un Either", () => {
    const double = (n: number) => n * 2;
    const add = (x: number) => (y: number) => x + y;

    const value = E.right<string, number>(5);
    const functionEither = E.right<string, (a: number) => number>(double);
    const addFunction = E.right<string, (a: number) => number>(add(10));

    const doubleResult = E.ap(value)(functionEither);
    const addResult = E.ap(value)(addFunction);

    expect(doubleResult).toEqual(E.right(10));
    expect(addResult).toEqual(E.right(15));
  });

  it("ap retourne Left si la fonction est Left", () => {
    const value = E.right<string, number>(5);
    const functionError = E.left<string, (a: number) => number>(
      "function error"
    );

    const result = E.ap(value)(functionError);

    expect(result).toEqual(E.left("function error"));
  });

  it("ap retourne Left si la valeur est Left", () => {
    const valueError = E.left<string, number>("value error");
    const functionEither = E.right<string, (a: number) => number>(
      (n: number) => n * 2
    );

    const result = E.ap(valueError)(functionEither);

    expect(result).toEqual(E.left("value error"));
  });

  it("ap avec fonctions complexes", () => {
    const createUser = (name: string) => (age: number) => ({ name, age });
    const nameEither = E.right("John");
    const ageEither = E.right(30);
    const functionEither = E.right(createUser);

    const partialResult = E.ap(nameEither)(functionEither);
    const result = E.ap(ageEither)(partialResult);

    expect(result).toEqual(E.right({ name: "John", age: 30 }));
  });

  it("bindTo crée un objet avec une propriété nommée", () => {
    const value = E.right(42);
    const result = E.bindTo("count")(value);

    expect(result).toEqual(E.right({ count: 42 }));
  });

  it("bindTo avec erreur", () => {
    const error = E.left("error");
    const result = E.bindTo("count")(error);

    expect(result).toEqual(E.left("error"));
  });

  it("bindTo avec différents types", () => {
    const stringValue = E.right("hello");
    const numberValue = E.right(42);
    const objectValue = E.right({ x: 1 });

    const stringResult = E.bindTo("message")(stringValue);
    const numberResult = E.bindTo("value")(numberValue);
    const objectResult = E.bindTo("data")(objectValue);

    expect(stringResult).toEqual(E.right({ message: "hello" }));
    expect(numberResult).toEqual(E.right({ value: 42 }));
    expect(objectResult).toEqual(E.right({ data: { x: 1 } }));
  });

  it("bind ajoute une propriété à un objet existant", () => {
    const initial = E.right({ name: "John" });
    const addAge = E.bind<"age", { name: string }, string, number>("age", () =>
      E.right<string, number>(30)
    )(initial);

    expect(addAge).toEqual(E.right({ name: "John", age: 30 }));
  });

  it("bind avec fonction qui retourne une erreur", () => {
    const initial = E.right({ name: "John" });
    const addAge = E.bind<"age", { name: string }, string, number>("age", () =>
      E.left<string, number>("age validation failed")
    )(initial);

    expect(addAge).toEqual(E.left("age validation failed"));
  });

  it("bind avec objet initial en erreur", () => {
    const initial = E.left<string, { name: string }>("initial error");
    const addAge = E.bind<"age", { name: string }, string, number>("age", () =>
      E.right<string, number>(30)
    )(initial);

    expect(addAge).toEqual(E.left("initial error"));
  });

  it("bind chaîne plusieurs propriétés", () => {
    const initial = E.right({ name: "John" });
    const result = pipe(
      initial,
      E.bind("age", () => E.right(30)),
      E.bind("email", (user: { name: string; age: number }) =>
        E.right(`${user.name.toLowerCase()}@example.com`)
      )
    );

    expect(result).toEqual(
      E.right({
        name: "John",
        age: 30,
        email: "john@example.com",
      })
    );
  });

  it("bind avec validation conditionnelle", () => {
    const initial = E.right({ id: 1 });
    const addStatus = E.bind("status", (user: { id: number }) =>
      user.id > 0 ? E.right("active") : E.left("invalid id")
    )(initial);

    expect(addStatus).toEqual(E.right({ id: 1, status: "active" }));

    const invalidInitial = E.right({ id: -1 });
    const invalidStatus = E.bind("status", (user: { id: number }) =>
      user.id > 0 ? E.right("active") : E.left("invalid id")
    )(invalidInitial);

    expect(invalidStatus).toEqual(E.left("invalid id"));
  });

  it("bind combine avec bindTo", () => {
    const result = pipe(
      E.right(42),
      E.bindTo("count"),
      E.bind("doubled", (obj: { count: number }) => E.right(obj.count * 2)),
      E.bind("squared", (obj: { count: number; doubled: number }) =>
        E.right(obj.count * obj.count)
      )
    );

    expect(result).toEqual(
      E.right({
        count: 42,
        doubled: 84,
        squared: 1764,
      })
    );
  });
});

// ============================================================================
// 13. SCÉNARIOS D'USAGE RÉELS (100% nécessaire)
// ============================================================================

describe("Scénarios d'usage réels", () => {
  it("validation de formulaire", () => {
    const validateName = (name: string) =>
      name.length > 0 ? E.right(name) : E.left("name is required");

    const validateAge = (age: number) =>
      age >= 0 && age <= 150 ? E.right(age) : E.left("invalid age");

    const validateUser = (name: string, age: number) =>
      pipe(
        E.Do,
        E.apS("name", validateName(name)),
        E.apS("age", validateAge(age))
      );

    const validUser = validateUser("John", 30);
    const invalidUser = validateUser("", -5);

    expect(E.isRight(validUser)).toBe(true);
    if (E.isRight(validUser)) {
      expect(validUser.right.name).toBe("John");
      expect(validUser.right.age).toBe(30);
    }

    expect(E.isLeft(invalidUser)).toBe(true);
    if (E.isLeft(invalidUser)) {
      expect(invalidUser.left).toBe("name is required");
    }
  });

  it("chaînage de parsers", () => {
    const parseString = (value: unknown) =>
      typeof value === "string" ? E.right(value) : E.left("not a string");

    const parseNumber = (value: unknown) => {
      const num = parseInt(value as string, 10);
      return isNaN(num) ? E.left("not a valid number") : E.right(num);
    };

    const parseUser = (input: unknown) =>
      pipe(
        parseString(input),
        E.flatMap(parseNumber),
        E.map((num) => ({ id: num, name: `User${num}` }))
      );

    const validInput = "42";
    const invalidInput = "abc";

    const validResult = parseUser(validInput);
    const invalidResult = parseUser(invalidInput);

    expect(E.isRight(validResult)).toBe(true);
    if (E.isRight(validResult)) {
      expect(validResult.right).toEqual({ id: 42, name: "User42" });
    }

    expect(E.isLeft(invalidResult)).toBe(true);
    if (E.isLeft(invalidResult)) {
      expect(invalidResult.left).toBe("not a valid number");
    }
  });

  it("gestion d'erreurs avec récupération", () => {
    const fetchUser = (id: number) =>
      id === 1 ? E.right({ id: 1, name: "John" }) : E.left("user not found");

    const fetchUserWithFallback = (id: number) =>
      pipe(
        fetchUser(id),
        E.orElse(() => E.right({ id: 0, name: "Anonymous" }))
      );

    const existingUser = fetchUserWithFallback(1);
    const fallbackUser = fetchUserWithFallback(999);

    expect(E.isRight(existingUser)).toBe(true);
    if (E.isRight(existingUser)) {
      expect(existingUser.right.name).toBe("John");
    }

    expect(E.isRight(fallbackUser)).toBe(true);
    if (E.isRight(fallbackUser)) {
      expect(fallbackUser.right.name).toBe("Anonymous");
    }
  });

  it("traitement d'erreurs avec tryCatch", () => {
    const unsafeApiCall = (id: number) => {
      if (id === 0) throw new Error("invalid id");
      return { id, data: `data for ${id}` };
    };

    const safeApiCall = (id: number) =>
      E.tryCatch(
        () => unsafeApiCall(id),
        (e) => (e instanceof Error ? e.message : "unknown error")
      );

    const validResult = safeApiCall(1);
    const invalidResult = safeApiCall(0);

    expect(E.isRight(validResult)).toBe(true);
    expect(E.isLeft(invalidResult)).toBe(true);
    if (E.isLeft(invalidResult)) {
      expect(invalidResult.left).toBe("invalid id");
    }
  });
});

// ============================================================================
// 14. TESTS DE PERFORMANCE ET COMPORTEMENT (80% nécessaire)
// ============================================================================

describe("Performance et comportement", () => {
  it("évaluation lazy avec orElse", () => {
    let sideEffectCalled = false;
    const expensiveFallback = () => {
      sideEffectCalled = true;
      return E.right("fallback");
    };

    const rightEither = E.right("success");
    const result = E.orElse(expensiveFallback)(rightEither);

    expect(result).toEqual(E.right("success"));
    expect(sideEffectCalled).toBe(false); // Lazy evaluation
  });

  it("chaînage de multiples opérations", () => {
    const addOne = (n: number) => E.right(n + 1);
    const multiplyByTwo = (n: number) => E.right(n * 2);
    const subtractThree = (n: number) => E.right(n - 3);

    const result = pipe(
      E.right(10),
      E.flatMap(addOne),
      E.flatMap(multiplyByTwo),
      E.flatMap(subtractThree)
    );

    expect(result).toEqual(E.right(19)); // (10 + 1) * 2 - 3 = 19
  });

  it("gestion d'erreurs en cascade", () => {
    const step1 = (input: number) =>
      input > 0 ? E.right(input) : E.left("step1: input must be positive");

    const step2 = (input: number) => {
      const doubled = input * 2;
      return doubled < 100
        ? E.right(doubled)
        : E.left("step2: result too large");
    };

    const step3 = (input: number) =>
      input % 2 === 0
        ? E.right(input / 2)
        : E.left("step3: input must be even");

    const pipeline = (input: number) =>
      pipe(step1(input), E.flatMap(step2), E.flatMap(step3));

    const validResult = pipeline(25);
    const invalidResult1 = pipeline(-5);
    const invalidResult2 = pipeline(60); // 60 * 2 = 120, qui est > 100

    expect(E.isRight(validResult)).toBe(true);
    if (E.isRight(validResult)) {
      expect(validResult.right).toBe(25); // (25 * 2) / 2 = 25
    }

    expect(E.isLeft(invalidResult1)).toBe(true);
    if (E.isLeft(invalidResult1)) {
      expect(invalidResult1.left).toBe("step1: input must be positive");
    }

    expect(E.isLeft(invalidResult2)).toBe(true);
    if (E.isLeft(invalidResult2)) {
      expect(invalidResult2.left).toBe("step2: result too large");
    }
  });
});
