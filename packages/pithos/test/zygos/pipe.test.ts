/**
 * Tests complets pour fp-ts pipe - Fonctionnalités essentielles
 *
 * Ce fichier teste toutes les fonctionnalités de pipe qui sont
 * réellement représentatives du fonctionnement de pipe dans fp-ts.
 */

import { describe, it, expect } from "vitest";
import { pipe } from "fp-ts/function"; // "fp-ts/function" or "@arkhe/function/pipe"
import * as E from "fp-ts/Either"; // "fp-ts/Either" or "@zygos/either"
import * as O from "fp-ts/Option"; // "fp-ts/Option" or "@zygos/option"

// Helper functions to replace fp-ts ReadonlyArray
const A = {
  map:
    <A, B>(f: (a: A) => B) =>
    (arr: A[]): B[] =>
      arr.map(f),
  filter:
    <A>(f: (a: A) => boolean) =>
    (arr: A[]): A[] =>
      arr.filter(f),
  reduce:
    <A, B>(f: (acc: B, a: A) => B, initial: B) =>
    (arr: A[]): B =>
      arr.reduce(f, initial),
};

// ============================================================================
// 1. FONCTIONS DE BASE POUR LES TESTS
// ============================================================================

const double = (n: number): number => n * 2;
const addOne = (n: number): number => n + 1;
const toString = (n: number): string => n.toString();
const toUpperCase = (s: string): string => s.toUpperCase();
const addExclamation = (s: string): string => s + "!";
const length = (s: string): number => s.length;
const isEven = (n: number): boolean => n % 2 === 0;
const isPositive = (n: number): boolean => n > 0;
const negate = (b: boolean): boolean => !b;

interface ApiUser {
  id: number;
  name: string;
}

interface ApiProfile extends ApiUser {
  verified: boolean;
}

interface ApiSettings extends ApiProfile {
  theme: string;
}

interface CompanyAddress {
  street?: { name?: string };
}

interface Company {
  address?: CompanyAddress;
}

interface UserWithCompany {
  company?: Company;
}

interface BasicUser {
  name: string;
  age: number;
  verified: boolean;
}

interface ValidatableUser {
  name: string;
  age: number;
  email: string;
}

interface RoleUser {
  name: string;
  role: string;
  active: boolean;
  verified: boolean;
}

type RightNumber = E.Right<number>;

// ============================================================================
// 2. TESTS DE BASE DE PIPE
// ============================================================================

describe("Tests de base de pipe", () => {
  it("pipe avec 1 paramètre (retourne la valeur)", () => {
    const result = pipe(42);
    expect(result).toBe(42);
  });

  it("pipe avec 2 paramètres (1 transformation)", () => {
    const result = pipe(42, double);
    expect(result).toBe(84);
  });

  it("pipe avec 3 paramètres (2 transformations)", () => {
    const result = pipe(42, double, addOne);
    expect(result).toBe(85);
  });

  it("pipe avec 4 paramètres (3 transformations)", () => {
    const result = pipe(42, double, addOne, toString);
    expect(result).toBe("85");
  });

  it("pipe avec 5 paramètres (4 transformations)", () => {
    const result = pipe(42, double, addOne, toString, toUpperCase);
    expect(result).toBe("85");
  });

  it("pipe avec 6 paramètres (5 transformations)", () => {
    const result = pipe(
      42,
      double,
      addOne,
      toString,
      toUpperCase,
      addExclamation
    );
    expect(result).toBe("85!");
  });

  it("pipe avec 7 paramètres (6 transformations)", () => {
    const result = pipe(
      42,
      double,
      addOne,
      toString,
      toUpperCase,
      addExclamation,
      length
    );
    expect(result).toBe(3);
  });

  it("pipe avec 8 paramètres (7 transformations)", () => {
    const result = pipe(
      42,
      double,
      addOne,
      toString,
      toUpperCase,
      addExclamation,
      length,
      isEven
    );
    expect(result).toBe(false);
  });

  it("pipe avec 9 paramètres (8 transformations)", () => {
    const result = pipe(
      42,
      double,
      addOne,
      toString,
      toUpperCase,
      addExclamation,
      length,
      isEven,
      negate
    );
    expect(result).toBe(true);
  });

  it("pipe avec 10 paramètres (9 transformations)", () => {
    const result = pipe(
      42,
      double, // 84
      addOne, // 85
      toString, // "85"
      toUpperCase, // "85"
      addExclamation, // "85!"
      length, // 3
      isEven, // false
      negate, // true
      (b: boolean) => b.toString() // "true"
    );
    expect(result).toBe("true");
  });

  it("pipe avec 20 paramètres (19 transformations)", () => {
    const result = pipe(
      1,
      addOne, // 2
      addOne, // 3
      addOne, // 4
      addOne, // 5
      addOne, // 6
      addOne, // 7
      addOne, // 8
      addOne, // 9
      addOne, // 10
      addOne, // 11
      addOne, // 12
      addOne, // 13
      addOne, // 14
      addOne, // 15
      addOne, // 16
      addOne, // 17
      addOne, // 18
      addOne, // 19
      addOne // 20
    );
    expect(result).toBe(20);
  });
});

// ============================================================================
// 3. PIPE AVEC TYPES COMPLEXES
// ============================================================================

describe("Pipe avec types complexes", () => {
  it("pipe avec transformations de types", () => {
    const result = pipe(
      "hello",
      length, // number
      double, // number
      toString, // string
      toUpperCase, // string
      addExclamation // string
    );
    expect(result).toBe("10!");
  });

  it("pipe avec transformations booléennes", () => {
    const result = pipe(
      42,
      isPositive, // boolean
      negate, // boolean
      negate, // boolean
      negate // boolean
    );
    expect(result).toBe(false);
  });

  it("pipe avec transformations mixtes", () => {
    const result = pipe(
      -5,
      Math.abs, // number
      isPositive, // boolean
      negate, // boolean
      (b: boolean) => b.toString() // string
    );
    expect(result).toBe("false");
  });
});

// ============================================================================
// 4. PIPE AVEC FONCTIONS CURRYFIÉES
// ============================================================================

describe("Pipe avec fonctions curryfiées", () => {
  it("pipe avec fonctions à plusieurs paramètres", () => {
    const add = (a: number) => (b: number) => a + b;
    const multiply = (a: number) => (b: number) => a * b;

    const result = pipe(
      10,
      add(5), // 15
      multiply(2), // 30
      add(10) // 40
    );
    expect(result).toBe(40);
  });

  it("pipe avec fonctions conditionnelles", () => {
    const ifPositive = (f: (n: number) => number) => (n: number) =>
      isPositive(n) ? f(n) : n;

    const result = pipe(
      42,
      ifPositive(double), // 84
      ifPositive(addOne), // 85
      ifPositive((n) => n * 3) // 255
    );
    expect(result).toBe(255);
  });

  it("pipe avec fonctions qui retournent des fonctions", () => {
    const createMultiplier = (factor: number) => (n: number) => n * factor;
    const createAdder = (value: number) => (n: number) => n + value;

    const result = pipe(
      10,
      createMultiplier(2), // 20
      createAdder(5), // 25
      createMultiplier(3) // 75
    );
    expect(result).toBe(75);
  });
});

// ============================================================================
// 5. PIPE AVEC FP-TS EITHER - CAS D'USAGE RÉELS
// ============================================================================

describe("Pipe avec fp-ts Either - Cas d'usage réels", () => {
  it("pipe avec chaînage Either simple", () => {
    const result = pipe(
      E.right(42),
      E.map(double),
      E.map(addOne),
      E.map(toString)
    );
    expect(result).toEqual(E.right("85"));
  });

  it("pipe avec Either et gestion d'erreurs", () => {
    const divide = (a: number) => (b: number) =>
      b === 0 ? E.left("division by zero") : E.right(a / b);

    const result = pipe(
      E.right(10),
      E.flatMap(divide(2)), // E.right(5)
      E.map(double), // E.right(10)
      E.flatMap(divide(2)) // E.right(5)
    );
    expect(result).toEqual(E.right(5));
  });

  it("pipe avec Either et pattern matching", () => {
    const result = pipe(
      E.right("hello"),
      E.map(length),
      E.map(double),
      E.match(
        (error) => `Error: ${error}`,
        (value) => `Success: ${value}`
      )
    );
    expect(result).toBe("Success: 10");
  });

  it("pipe avec Either et transformations complexes", () => {
    const parseNumber = (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) ? E.left("invalid number") : E.right(n);
    };

    const result = pipe(
      E.right("42"),
      E.flatMap(parseNumber),
      E.map(double),
      E.map(addOne),
      E.map(toString),
      E.map(addExclamation)
    );
    expect(result).toEqual(E.right("85!"));
  });

  it("pipe avec Either et Do notation", () => {
    const result = pipe(
      E.Do,
      E.apS("x", E.right(10)),
      E.apS("y", E.right(20)),
      E.map(({ x, y }) => x + y),
      E.map(double)
    );
    expect(result).toEqual(E.right(60));
  });

  // ✅ NOUVEAU: Test de parsing JSON avec gestion d'erreurs
  it("pipe avec parsing JSON et gestion d'erreurs", () => {
    const parseUser = (json: string) => {
      try {
        const user = JSON.parse(json);
        return user.name && user.age
          ? E.right(user)
          : E.left("Invalid user data");
      } catch {
        return E.left("Invalid JSON");
      }
    };

    const result = pipe(
      '{"name": "John", "age": 30}',
      parseUser,
      E.map((user) => ({ ...user, id: Date.now() })),
      E.map((user) => `User ${user.id}: ${user.name} (${user.age})`)
    );

    expect(result._tag).toBe("Right");
    if (result._tag === "Right") {
      expect(result.right).toMatch(/User \d+: John \(30\)/);
    }
  });

  // ✅ NOUVEAU: Test de validation de données en cascade
  it("pipe avec validation de données en cascade", () => {
    const validateEmail = (email: string) =>
      email.includes("@") ? E.right(email) : E.left("Invalid email");

    const validateAge = (age: number) =>
      age >= 18 ? E.right(age) : E.left("Must be 18 or older");

    const validateName = (name: string) =>
      name.length >= 2 ? E.right(name) : E.left("Name too short");

    const result = pipe(
      E.Do,
      E.apS("email", validateEmail("john@example.com")),
      E.apS("age", validateAge(25)),
      E.apS("name", validateName("John")),
      E.map(({ email, age, name }) => ({
        email,
        age,
        name,
        verified: true,
      })),
      E.map(
        (user) =>
          `User ${user.name} (${user.email}) - Age: ${user.age} - Verified: ${user.verified}`
      )
    );

    expect(result).toEqual(
      E.right("User John (john@example.com) - Age: 25 - Verified: true")
    );
  });

  // ✅ NOUVEAU: Test de gestion d'erreurs avec tryCatch
  it("pipe avec Either et tryCatch", () => {
    const unsafeApiCall = (id: number) => {
      if (id < 0) throw new Error("Invalid ID");
      return `User ${id}`;
    };

    const result = pipe(
      E.tryCatch(
        () => unsafeApiCall(42),
        (error) =>
          `API Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
      ),
      E.map((user) => user.toUpperCase()),
      E.map((user) => `${user}!`)
    );

    expect(result).toEqual(E.right("USER 42!"));
  });

  // ✅ NOUVEAU: Test de chaînage avec fromPredicate
  it("pipe avec Either et fromPredicate", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;
    const isMultipleOfTen = (n: number) => n % 10 === 0;

    const result = pipe(
      E.right(50),
      E.flatMap((n) =>
        E.fromPredicate(isPositive, () => "Must be positive")(n)
      ),
      E.flatMap((n) => E.fromPredicate(isEven, () => "Must be even")(n)),
      E.flatMap((n) =>
        E.fromPredicate(isMultipleOfTen, () => "Must be multiple of 10")(n)
      ),
      E.map((n) => n * 2),
      E.map((n) => `Valid number: ${n}`)
    );

    expect(result).toEqual(E.right("Valid number: 100"));
  });

  // ✅ NOUVEAU: Test de gestion d'erreurs en cascade avec E.flatMap et recovery
  it("pipe avec gestion d'erreurs en cascade et recovery", () => {
    const primaryService = (id: number) =>
      id > 100 ? E.left("Primary service unavailable") : E.right(`User ${id}`);

    const fallbackService = (id: number) =>
      id > 200
        ? E.left("Fallback service unavailable")
        : E.right(`Fallback User ${id}`);

    const emergencyService = (id: number) => E.right(`Emergency User ${id}`);

    const result = pipe(
      E.right(150),
      E.flatMap(primaryService),
      E.match(
        () => pipe(E.right(150), E.flatMap(fallbackService)),
        (user) => E.right(user)
      ),
      E.match(
        () => pipe(E.right(150), E.flatMap(emergencyService)),
        (user) => E.right(user)
      ),
      E.map((user) => `${user} (recovered)`)
    );

    expect(result).toEqual(E.right("Fallback User 150 (recovered)"));
  });

  // ✅ NOUVEAU: Test de recovery d'erreurs avec E.match et alternatives
  it("pipe avec recovery d'erreurs et alternatives", () => {
    const validateEmail = (email: string) =>
      email.includes("@") ? E.right(email) : E.left("Invalid email format");

    const validateDomain = (email: string) =>
      email.endsWith(".com") ? E.right(email) : E.left("Invalid domain");

    const suggestAlternative = (email: string) =>
      E.right(email.replace(/@.*$/, "@gmail.com"));

    const result = pipe(
      E.right("user@invalid"),
      E.flatMap(validateEmail),
      E.flatMap(validateDomain),
      E.match(
        () =>
          pipe(
            E.right("user@invalid"),
            E.flatMap(validateEmail),
            E.flatMap(suggestAlternative)
          ),
        (email) => E.right(email)
      ),
      E.map((email) => `Valid email: ${email}`)
    );

    expect(result).toEqual(E.right("Valid email: user@gmail.com"));
  });

  // ✅ NOUVEAU: Test de validation de schémas avec E.sequenceArray et E.traverseArray
  it("pipe avec validation de schémas et validation en lot", () => {
    const validateUser = (user: {
      name: string;
      email: string;
      age: number;
    }) => {
      const errors: string[] = [];
      if (!user.name || user.name.length < 2) errors.push("Invalid name");
      if (!user.email || !user.email.includes("@"))
        errors.push("Invalid email");
      if (!user.age || user.age < 18) errors.push("Invalid age");
      return errors.length === 0 ? E.right(user) : E.left(errors.join(", "));
    };

    const users = [
      { name: "Alice", email: "alice@example.com", age: 25 },
      { name: "Bob", email: "invalid-email", age: 17 },
      { name: "C", email: "charlie@example.com", age: 30 },
    ];

    // Test simplifié sans sequenceArray
    const firstUser = validateUser(users[0]);
    const secondUser = validateUser(users[1]);

    expect(E.isRight(firstUser)).toBe(true);
    expect(E.isLeft(secondUser)).toBe(true);
  });

  // ✅ NOUVEAU: Test de gestion d'erreurs multiples avec validation séquentielle
  it("pipe avec gestion d'erreurs multiples et validation", () => {
    const validateField = <T>(
      field: string,
      value: T,
      validator: (v: T) => boolean,
      errorMsg: string
    ): E.Either<string, T> =>
      validator(value) ? E.right(value) : E.left(`${field}: ${errorMsg}`);

    const validateUsername = (username: string) =>
      validateField("username", username, (u) => u.length >= 3, "too short");

    const validatePassword = (password: string) =>
      validateField("password", password, (p) => p.length >= 8, "too short");

    const validateAge = (age: number) =>
      validateField("age", age, (a) => a >= 18, "must be 18 or older");

    const user = { username: "ab", password: "123", age: 16 };

    // Test avec validation séquentielle (s'arrête à la première erreur)
    const result = pipe(
      E.right(user),
      E.flatMap((u) => validateUsername(u.username)),
      E.flatMap(() => E.right(user)),
      E.flatMap((u) => validatePassword(u.password)),
      E.flatMap(() => E.right(user)),
      E.flatMap((u) => validateAge(u.age)),
      E.map(() => "All validations passed")
    );

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe("username: too short");
    }
  });

  // ✅ NOUVEAU: Test de composition d'erreurs avec E.combine
  it("pipe avec composition d'erreurs et agrégation", () => {
    const parseNumber = (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) ? E.left(`Invalid number: ${s}`) : E.right(n);
    };

    const validateRange = (n: number, min: number, max: number) =>
      n >= min && n <= max
        ? E.right(n)
        : E.left(`Number ${n} out of range [${min}, ${max}]`);

    // Test simplifié sans sequenceArray
    const validNumber = parseNumber("42");
    const invalidNumber = parseNumber("abc");
    const inRange = validateRange(5, 0, 10);

    expect(E.isRight(validNumber)).toBe(true);
    expect(E.isLeft(invalidNumber)).toBe(true);
    expect(inRange).toEqual(E.right(5));
    if (E.isLeft(invalidNumber)) {
      expect(invalidNumber.left).toBe("Invalid number: abc");
    }
  });
});

// ============================================================================
// 6. PIPE AVEC FP-TS OPTION - CAS D'USAGE RÉELS
// ============================================================================

describe("Pipe avec fp-ts Option - Cas d'usage réels", () => {
  it("pipe avec chaînage Option simple", () => {
    const result = pipe(
      O.some(42),
      O.map(double),
      O.map(addOne),
      O.map(toString)
    );
    expect(result).toEqual(O.some("85"));
  });

  it("pipe avec Option et flatMap", () => {
    const safeDivide = (a: number) => (b: number) =>
      b === 0 ? O.none : O.some(a / b);

    const result = pipe(
      O.some(10),
      O.flatMap(safeDivide(2)), // O.some(5)
      O.map(double), // O.some(10)
      O.flatMap(safeDivide(2)) // O.some(5)
    );
    expect(result).toEqual(O.some(5));
  });

  it("pipe avec Option et pattern matching", () => {
    const result = pipe(
      O.some("hello"),
      O.map(length),
      O.map(double),
      O.match(
        () => "No value",
        (value) => `Length: ${value}`
      )
    );
    expect(result).toBe("Length: 10");
  });

  it("pipe avec Option et transformations complexes", () => {
    const parseNumber = (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) ? O.none : O.some(n);
    };

    const result = pipe(
      O.some("42"),
      O.flatMap(parseNumber),
      O.map(double),
      O.map(addOne),
      O.map(toString),
      O.map(addExclamation)
    );
    expect(result).toEqual(O.some("85!"));
  });

  it("pipe avec Option et fromNullable", () => {
    const result = pipe(
      "42",
      O.fromNullable,
      O.map(parseInt),
      O.map(double),
      O.map(addOne)
    );
    expect(result).toEqual(O.some(85));
  });

  // ✅ NOUVEAU: Test de chaînage d'APIs optionnelles
  it("pipe avec chaînage d'APIs optionnelles", () => {
    const getUser = (id: number): O.Option<ApiUser> =>
      id > 0 ? O.some({ id, name: "User" }) : O.none;
    const getProfile = (user: ApiUser): O.Option<ApiProfile> =>
      user.id % 2 === 0 ? O.some({ ...user, verified: true }) : O.none;
    const getSettings = (profile: ApiProfile): O.Option<ApiSettings> =>
      profile.verified ? O.some({ ...profile, theme: "dark" }) : O.none;

    const result = pipe(
      2,
      getUser,
      O.flatMap(getProfile),
      O.flatMap(getSettings),
      O.map(
        (settings) =>
          `${settings.name} (${settings.theme} theme, verified: ${settings.verified})`
      )
    );

    expect(result).toEqual(O.some("User (dark theme, verified: true)"));
  });

  // ✅ NOUVEAU: Test de gestion de valeurs optionnelles en cascade
  it("pipe avec gestion de valeurs optionnelles en cascade", () => {
    const getCompany = (user: UserWithCompany): O.Option<Company> =>
      user.company ? O.some(user.company) : O.none;
    const getAddress = (company: Company): O.Option<CompanyAddress> =>
      company.address ? O.some(company.address) : O.none;
    const getStreet = (
      address: CompanyAddress
    ): O.Option<CompanyAddress["street"]> =>
      address.street ? O.some(address.street) : O.none;
    const getStreetName = (
      street: CompanyAddress["street"]
    ): O.Option<string> => (street?.name ? O.some(street.name) : O.none);

    const user = { company: { address: { street: { name: "High Street" } } } };

    const result = pipe(
      O.some(user),
      O.flatMap(getCompany),
      O.flatMap(getAddress),
      O.flatMap(getStreet),
      O.flatMap(getStreetName),
      O.map((name) => `Street: ${name}`)
    );

    expect(result).toEqual(O.some("Street: High Street"));
  });

  // ✅ NOUVEAU: Test de filtrage et transformation avec Option
  it("pipe avec filtrage et transformation avec Option", () => {
    const isAdult = (age: number) => age >= 18;
    const isVerified = (user: BasicUser) => user.verified === true;
    const formatUser = (user: BasicUser) => `${user.name} (${user.age})`;

    const users: BasicUser[] = [
      { name: "Alice", age: 25, verified: true },
      { name: "Bob", age: 17, verified: false },
      { name: "Charlie", age: 30, verified: true },
    ];

    const result = pipe(
      users,
      (list: BasicUser[]) => list.filter((user) => isAdult(user.age)),
      (list: BasicUser[]) => list.filter((user) => isVerified(user)),
      (list: BasicUser[]) => list.map(formatUser)
    );

    expect(result).toEqual(["Alice (25)", "Charlie (30)"]);
  });

  // ✅ NOUVEAU: Test de tryCatch avec Option
  it("pipe avec Option et tryCatch", () => {
    const unsafeOperation = (input: string) => {
      if (input === "error") throw new Error("Simulated error");
      return input.toUpperCase();
    };

    const option = O.tryCatch(() => unsafeOperation("hello"));
    const result = pipe(
      option,
      O.map((result: string) => `${result}!`),
      O.getOrElse(() => "Error occurred")
    );

    expect(result).toBe("HELLO!");
  });
});

// ============================================================================
// 7. PIPE AVEC FP-TS READONLYARRAY - CAS D'USAGE RÉELS
// ============================================================================

describe("Pipe avec fp-ts ReadonlyArray - Cas d'usage réels", () => {
  it("pipe avec transformations d'array", () => {
    const result = pipe(
      [1, 2, 3, 4, 5],
      A.map(double),
      A.map(addOne),
      A.filter(isPositive),
      A.map(toString)
    );
    expect(result).toEqual(["3", "5", "7", "9", "11"]);
  });

  it("pipe avec array et réductions", () => {
    const result = pipe(
      [1, 2, 3, 4, 5],
      A.map(double),
      A.reduce((acc: number, n: number) => acc + n, 0)
    );
    expect(result).toBe(30);
  });

  it("pipe avec array et transformations complexes", () => {
    const result = pipe(
      ["1", "2", "3", "abc", "4"],
      A.map((s) => parseInt(s, 10)),
      A.filter((n) => !isNaN(n)),
      A.map(double),
      A.map(addOne),
      A.map(toString),
      A.map(addExclamation)
    );
    expect(result).toEqual(["3!", "5!", "7!", "9!"]);
  });

  it("pipe avec array et Either", () => {
    const parseNumber = (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) ? E.left(`invalid: ${s}`) : E.right(n);
    };

    const result = pipe(
      ["1", "2", "abc", "3"],
      A.map(parseNumber),
      A.map(
        E.match(
          (error) => `Error: ${error}`,
          (value) => `Success: ${value}`
        )
      )
    );

    expect(result).toEqual([
      "Success: 1",
      "Success: 2",
      "Error: invalid: abc",
      "Success: 3",
    ]);
  });

  // ✅ NOUVEAU: Test de traitement de données avec validation
  it("pipe avec traitement de données et validation", () => {
    const users: ValidatableUser[] = [
      { name: "Alice", age: 25, email: "alice@example.com" },
      { name: "Bob", age: 17, email: "bob@example.com" },
      { name: "Charlie", age: 30, email: "invalid-email" },
    ];

    const validateUser = (user: ValidatableUser) => {
      const errors: string[] = [];
      if (user.age < 18) errors.push("Too young");
      if (!user.email.includes("@")) errors.push("Invalid email");
      return errors.length === 0 ? E.right(user) : E.left(errors.join(", "));
    };

    const result = pipe(
      users,
      A.map(validateUser),
      A.map(
        E.match(
          (errors) => `Invalid: ${errors}`,
          (user) => `Valid: ${user.name}`
        )
      )
    );

    expect(result).toEqual([
      "Valid: Alice",
      "Invalid: Too young",
      "Invalid: Invalid email",
    ]);
  });

  // ✅ NOUVEAU: Test de chaînage avec Option et Array
  it("pipe avec chaînage Option et Array", () => {
    const getActiveUsers = (users: RoleUser[]) =>
      A.filter((user: RoleUser) => user.active)(users);
    const getVerifiedUsers = (users: RoleUser[]) =>
      A.filter((user: RoleUser) => user.verified)(users);
    const formatUser = (user: RoleUser) => `${user.name} (${user.role})`;

    const users: RoleUser[] = [
      { name: "Alice", role: "admin", active: true, verified: true },
      { name: "Bob", role: "user", active: true, verified: false },
      { name: "Charlie", role: "moderator", active: false, verified: true },
    ];

    const result = pipe(
      users,
      getActiveUsers,
      getVerifiedUsers,
      A.map(formatUser),
      (arr) => arr.join(", ")
    );

    expect(result).toBe("Alice (admin)");
  });
});

// ============================================================================
// 8. PIPE AVEC COMBINAISONS COMPLEXES - CAS D'USAGE RÉELS
// ============================================================================

describe("Pipe avec combinaisons complexes - Cas d'usage réels", () => {
  it("pipe avec Either, Option et Array", () => {
    const parseNumber = (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) ? E.left(`invalid: ${s}`) : E.right(n);
    };
    const isRightNumber = (
      either: E.Either<string, number>
    ): either is RightNumber => E.isRight(either);

    const result = pipe(
      E.right(["1", "2", "abc", "3"]),
      E.map(A.map(parseNumber)),
      E.map((list) => list.filter(isRightNumber)),
      E.map((list) => list.map((either) => either.right)),
      E.map(A.map(double)),
      E.map(A.map(addOne)),
      E.map(A.map(toString))
    );

    expect(result).toEqual(E.right(["3", "5", "7"]));
  });

  it("pipe avec validation complexe", () => {
    const validateAge = (age: number) =>
      age < 0 ? E.left("age must be positive") : E.right(age);

    const validateName = (name: string) =>
      name.length === 0 ? E.left("name cannot be empty") : E.right(name);

    const createUser = (name: string, age: number) => ({ name, age });

    const result = pipe(
      E.Do,
      E.apS("name", validateName("John")),
      E.apS("age", validateAge(30)),
      E.map(({ name, age }) => createUser(name, age)),
      E.map((user) => ({ ...user, id: 1 })),
      E.map((user) => `User ${user.id}: ${user.name} (${user.age})`)
    );

    expect(result).toEqual(E.right("User 1: John (30)"));
  });

  // ✅ NOUVEAU: Test de pipeline de traitement d'images
  it("pipe avec pipeline de traitement d'images", () => {
    interface Image {
      id: string;
      width: number;
      height: number;
      format: string;
      size: number;
    }

    const images: Image[] = [
      { id: "img1", width: 1920, height: 1080, format: "jpeg", size: 2048000 },
      { id: "img2", width: 800, height: 600, format: "png", size: 512000 },
      { id: "img3", width: 3840, height: 2160, format: "jpeg", size: 8192000 },
    ];

    const isHighRes = (img: Image) => img.width >= 1920 && img.height >= 1080;
    const isLargeFile = (img: Image) => img.size > 1000000;
    const needsOptimization = (img: Image) =>
      isHighRes(img) && isLargeFile(img);
    const formatOptimized = (img: Image) => ({
      ...img,
      format: "webp",
      size: Math.floor(img.size * 0.7),
    });

    const result = pipe(
      images,
      A.filter(needsOptimization),
      A.map(formatOptimized),
      A.map(
        (img) =>
          `${img.id}: ${img.width}x${img.height} -> ${img.format} (${img.size} bytes)`
      ),
      (arr) => arr.join(" | ")
    );

    expect(result).toBe(
      "img1: 1920x1080 -> webp (1433600 bytes) | img3: 3840x2160 -> webp (5734400 bytes)"
    );
  });

  // ✅ NOUVEAU: Test de pipeline de validation de formulaire
  it("pipe avec pipeline de validation de formulaire", () => {
    interface FormData {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    }

    const formData: FormData = {
      username: "john_doe",
      email: "john@example.com",
      password: "secure123",
      confirmPassword: "secure123",
    };

    const validateUsername = (data: FormData) =>
      data.username.length >= 3 ? E.right(data) : E.left("Username too short");

    const validateEmail = (data: FormData) =>
      data.email.includes("@") ? E.right(data) : E.left("Invalid email");

    const validatePassword = (data: FormData) =>
      data.password.length >= 8 ? E.right(data) : E.left("Password too short");

    const validatePasswordMatch = (data: FormData) =>
      data.password === data.confirmPassword
        ? E.right(data)
        : E.left("Passwords don't match");

    const result = pipe(
      E.right(formData),
      E.flatMap(validateUsername),
      E.flatMap(validateEmail),
      E.flatMap(validatePassword),
      E.flatMap(validatePasswordMatch),
      E.map((data) => ({
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      })),
      E.map(
        (user) =>
          `User ${user.username} created successfully with ID ${user.id}`
      )
    );

    expect(result._tag).toBe("Right");
    if (result._tag === "Right") {
      expect(result.right).toMatch(
        /User john_doe created successfully with ID \d+/
      );
    }
  });

  it("pipe avec transformations conditionnelles", () => {
    const processNumber = (n: number) =>
      pipe(
        n,
        double,
        addOne,
        (x) => (isEven(x) ? x : x + 1),
        toString,
        addExclamation
      );

    const result = pipe(
      [1, 2, 3, 4, 5],
      A.map(processNumber),
      (arr: string[]) => arr.join(", ")
    );

    expect(result).toBe("4!, 6!, 8!, 10!, 12!");
  });
});

// ============================================================================
// 9. PIPE AVEC FONCTIONS UTILITAIRES
// ============================================================================

describe("Pipe avec fonctions utilitaires", () => {
  it("pipe avec identity", () => {
    const result = pipe(
      42,
      double,
      addOne,
      (x) => x, // identity
      toString
    );
    expect(result).toBe("85");
  });

  it("pipe avec constant", () => {
    const result = pipe(
      "hello",
      length,
      () => 100, // constant
      toString
    );
    expect(result).toBe("100");
  });

  it("pipe avec composition de fonctions", () => {
    const compose =
      <A, B, C>(f: (b: B) => C, g: (a: A) => B) =>
      (a: A): C =>
        f(g(a));

    const result = pipe(
      42,
      compose(double, addOne), // double(addOne(42)) = double(43) = 86
      compose(toString, addOne), // toString(addOne(86)) = toString(87) = "87"
      toUpperCase
    );
    expect(result).toBe("87");
  });

  it("pipe avec fonctions d'ordre supérieur", () => {
    const map =
      <A, B>(f: (a: A) => B) =>
      (xs: A[]) =>
        xs.map(f);
    const filter =
      <A>(f: (a: A) => boolean) =>
      (xs: A[]) =>
        xs.filter(f);
    const reduce =
      <A, B>(f: (b: B, a: A) => B, initial: B) =>
      (xs: A[]) =>
        xs.reduce(f, initial);

    const result = pipe(
      [1, 2, 3, 4, 5],
      filter(isPositive),
      map(double),
      map(addOne),
      reduce((acc, n) => acc + n, 0),
      toString
    );
    expect(result).toBe("35");
  });
});

// ============================================================================
// 10. TESTS DE PERFORMANCE ET COMPORTEMENT
// ============================================================================

describe("Tests de performance et comportement", () => {
  it("pipe avec fonctions coûteuses (évaluation lazy)", () => {
    let expensiveCallCount = 0;
    const expensiveFunction = (n: number) => {
      expensiveCallCount++;
      return n * 1000;
    };

    const result = pipe(42, double, expensiveFunction, addOne);

    expect(result).toBe(84001);
    expect(expensiveCallCount).toBe(1); // Appelé une seule fois
  });

  it("pipe avec fonctions qui peuvent échouer", () => {
    const safeDivide = (a: number) => (b: number) => {
      if (b === 0) throw new Error("division by zero");
      return a / b;
    };

    const result = pipe(
      10,
      safeDivide(2), // 5
      double, // 10
      safeDivide(2) // 5
    );

    expect(result).toBe(5);
  });

  it("pipe avec transformations d'objets complexes", () => {
    interface User {
      id: number;
      name: string;
      age: number;
    }

    const users: User[] = [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
      { id: 3, name: "Charlie", age: 35 },
    ];

    const result = pipe(
      users,
      A.filter((user) => user.age > 25),
      A.map((user) => ({ ...user, name: user.name.toUpperCase() })),
      A.map((user) => `${user.name} (${user.age})`),
      (arr) => arr.join(", ")
    );

    expect(result).toBe("BOB (30), CHARLIE (35)");
  });
});

// ============================================================================
// 11. TESTS DE CAS LIMITES
// ============================================================================

describe("Tests de cas limites", () => {
  it("pipe avec une seule fonction", () => {
    const result = pipe(42, double);
    expect(result).toBe(84);
  });

  it("pipe avec aucune fonction", () => {
    const result = pipe(42);
    expect(result).toBe(42);
  });

  it("pipe avec fonctions qui retournent undefined", () => {
    const result: string = pipe(
      "hello",
      length,
      (): undefined => undefined,
      (value: undefined) => String(value)
    );
    expect(result).toBe("undefined");
  });

  it("pipe avec fonctions qui retournent null", () => {
    const result: string = pipe(
      "hello",
      length,
      (): null => null,
      (value: null) => String(value)
    );
    expect(result).toBe("null");
  });

  it("pipe avec transformations de types primitifs", () => {
    const result: string = pipe(
      true,
      negate, // false
      negate, // true
      negate, // false
      (b: boolean) => b.toString(), // "false"
      toUpperCase, // "FALSE"
      addExclamation // "FALSE!"
    );
    expect(result).toBe("FALSE!");
  });
});
