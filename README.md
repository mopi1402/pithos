[![npm version](https://badge.fury.io/js/pithos.svg)](https://www.npmjs.com/package/pithos)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()

# 🏺 Pithos — Utilities Ecosystem

**Open the box to unleash the power**

All-in-one utilities ecosystem that provides solutions for most modern web development challenges.  
**A synergistic utilities ecosystem where modules are designed to work together — more than the sum of their parts.**

## ✨ Key Features

- **🛡️ Zero Dependencies** - Complete supply chain security with no external vulnerabilities
- **🔄 Interchangeable APIs** - 100% API compatible with Neverthrow and fp-ts
- **⚡️ Ultra-Performance** - High-speed execution with perfect tree-shaking and minimal bundle impact
- **🛠️ Production-Ready** - Battle-tested utilities with comprehensive error handling
- **🏛️ Type it once, infer it everywhere** - Full TypeScript inference, no manual generics, no `any` leaks

Tired of rewriting the same utilities across projects? Whether you're building web apps, libraries, or complex interfaces, Pithos provides the building blocks you need...

Something missing? Let's build it together—reach out or open a PR!

## 🤔 Why this project?

**Born from personal frustration:**

- 🔍 "Where did I put that utility again?"
- 🔄 Rewriting the same logic because it's faster than searching
- 🧩 Best code scattered across projects, never improving
- 📈 Great utilities stuck in old codebases
- 💪 **Missing the compound effect:** Code that becomes more reliable through repeated use

**The solution:** Centralize, evolve, and battle-test in one place.

**Plus:** A single package that handles all major web development needs (validation, error handling, data parsing, etc.) in one cohesive bundle with zero dependencies, avoiding supply chain security issues.

If you've felt the same frustration, Pithos might be exactly what you need.

## 📖 The Pithos Story

Like Pandora's pithos that contained both problems and solutions, this utilities ecosystem tackles common development pain points while providing the tools you need.
By the way, Pandora's "box" was actually a large jar : "Pithos" in Greek 😉.  
Each module draws from Greek mythology:

- Arkhe (ἀρχή - "origin") → Core utilities, the foundation
- Kanon (κανών - "rule/measure") → Validation schemas
- Zygos (ζυγός - "balance/yoke") → Functional programming patterns with Result and Either types
- Sphalma (σφάλμα - "error/fault") → Error handling and error factories
- Taphos (τάφος - "tomb") → Legacy utilities & deprecated functions

## 🚀 Installation

```bash
pnpm install pithos
```

## 📦 Usage

**Import, use, done!** No more time wasted on rewriting utilities or figuring out how to implement them:

```typescript
import { Arrayable, Nullable } from "pithos/arkhe/types/common";
import { validation } from "pithos/kanon/validation";
import { ok, err } from "pithos/zygos/result";
```

**That's it!** Start building immediately instead of reinventing the wheel.

## 💡 Some usecases

### 🏷️ **Utility Types** - Even the basics matter

```typescript
import { Nullable, Arrayable } from "pithos/arkhe/types/common";
import { PartialKeys } from "pithos/arkhe/types/utilities";

type User = {
  name: string;
  emails: Arrayable<string>; // string | string[] - single or multiple emails
  nickname: Nullable<string>; // null | string - clear intent: can be null
};

// Simplified user for forms (only name required)
type UserForm = PartialKeys<User, "emails" | "nickname">;
```

### 🛡️ **Result Pattern** - Error handling made simple

**Lightweight alternative to Neverthrow 8.2.0 (3x smaller, 100% compatible)**

```typescript
// Standard try/catch - can crash your app
try {
  const user = await fetch(`/api/users/123`);
  if (!user.ok) throw new Error(`HTTP ${user.status}`);
} catch (error) {
  console.error("Failed:", error.message); // App might crash!
}

// Result to the rescue - always safe
const safeFetch = ResultAsync.fromThrowable(
  fetch,
  (error) => `Network error: ${error}`
);

const result = await safeFetch("/api/users/123");
if (result.isOk()) {
  console.log("User:", result.value); // Safe access
} else {
  console.error("Error:", result.error); // Safe error handling
}
```

### 🛠️ **Useful Utilities** - Data manipulation made easy

```typescript
import { chunk } from "pithos/arkhe/array/chunk";

// Divide array into groups of 3
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const groups = chunk(numbers, 3);
console.log(groups); // [[1, 2, 3], [4, 5, 6], [7, 8]]

// Process data in batches
const users = ["user1", "user2", "user3", "user4", "user5"];
const batches = chunk(users, 2);
batches.forEach((batch) => processBatch(batch));
```

### 🚀 **Complete Workflow** - Validation + Parsing + Safe Fetch

Real-world example combining Kanon validation, safe parsing, and error handling with ResultAsync:

```typescript
import { parseFloatDef } from "pithos/arkhe/number/parsers/parseFloatDef";
import {
  ResultAsync,
  errAsync,
  okAsync,
} from "pithos/zygos/result/result-async";
import { validation } from "pithos/kanon/validation";

// Validation schema — familiar Zod-like API
const ProductSchema = validation.object({
  id: validation.string(),
  name: validation.string(),
  price: validation.string(),
  stock: validation.string(),
  category: validation.string().optional(),
});

async function loadProduct(productId: string) {
  const safeFetch = ResultAsync.fromThrowable(
    fetch,
    (error) => `Network error: ${error}`
  );

  return safeFetch(`/api/products/${productId}`)
    .andThen((response) => {
      const safeJson = ResultAsync.fromThrowable(
        () => response.json(),
        (error) => `JSON parse error: ${error}`
      );
      return safeJson();
    })
    .andThen((data) => {
      // Kanon validation
      const validationResult = ProductSchema.safeParse(data);

      if (!validationResult.success) {
        return errAsync(`Validation failed: ${validationResult.error.message}`);
      }

      return okAsync({
        ...validationResult.data,
        price: parseFloatDef(validationResult.data.price, 0), // String → Number
        stock: parseFloatDef(validationResult.data.stock, 0), // String → Number
      });
    });
}

// Usage
const result = await loadProduct("123");
if (result.isOk()) {
  console.log("Product loaded:", result.value);
} else {
  console.error("Error:", result.error);
}
```

### 🔄 **Smooth Migration** - Deprecated functions with clear guidance

Pithos provides deprecated functions with clear migration paths to native APIs:

```typescript
import { fromPairs } from "pithos/taphos/array/fromPairs";

const pairs = [
  ["a", 1],
  ["b", 2],
  ["c", 3],
];

// ❌ Deprecated approach - still works but marked for removal
const obj = fromPairs(pairs);
console.log(obj); // { a: 1, b: 2, c: 3 }

// ✅ Recommended approach - use native Object.fromEntries()
const objNative = Object.fromEntries(pairs);
console.log(objNative); // { a: 1, b: 2, c: 3 }
```

**Benefits of this approach:**

- **Zero breaking changes** - deprecated functions still work
- **Clear migration path** - examples show exactly what to use instead
- **Future-proof** - migrate at your own pace without pressure
- **Bundle optimization** - native APIs are often more performant

## 🛠️ Available modules

### **🏺 Arkhe** - Core utilities & data manipulation

_The modern "lodash/underscore" - Data manipulation utilities with modern approaches documented but ES2020 compatibility prioritized_

- **data** : Array, collection, function, language, number, object, string utilities
- **types** : TypeScript types and guards

### **🎯 Kanon** - Schema validation

_Lightweight and interchangeable alternative to Zod with simplified API and optimized performance_

- **core** : Core validation primitives and composites
- **schemas** : Pre-built validation schemas
- **validation** : Validation engine and error handling

### **⚡️ Zygos** - Functional programming

_Lightweight and interchangeable alternative to Neverthrow/fp-ts with functional monads for robust error handling_

- **result** : Result pattern implementation (lightweight Neverthrow alternative)
- **option** : Option/Maybe monad
- **either** : Either monad
- **task-either** : Async Either monad

### **🔧 Sphalma** - Error handling & error factories

_Error handling utilities and error factory patterns for consistent error management_

- **error-factory** : Error factory for creating typed, coded errors with consistent structure

### **⚰️ Taphos** - Legacy utilities & deprecated functions

_The resting place of utilities - Deprecated functions with clear migration paths to native APIs_

- **array** : Deprecated array utilities (fromPairs, flattenDepth, nth, tail, head)
- **object** : Deprecated object utilities (keys, values, extend, toPairs)
- **string** : Deprecated string utilities (startsWith, endsWith, padStart, padEnd, repeat, toLower, toUpper, trim)
- **function** : Deprecated function utilities (partial)

## 📖 Documentation

Full documentation coming soon at [pithos.dev](https://pithos.dev)

For now, explore the source code and TSDoc comments — every function is fully documented.

## 🔧 Most useful scripts

```bash
# Development
pnpm run build                   # Build once
pnpm run build:watch             # Build in watch mode
pnpm run test                    # Run all tests
pnpm run coverage                # Run tests with coverage report
pnpm run lint                    # Lint code
pnpm run lint:fix                # Lint and auto-fix issues
pnpm run check:types             # Type-check without emitting files
pnpm run check:all               # Run all checks (lint + types + tsdoc)

# Analysis
pnpm run analyze:bundle          # Analyze bundle size
pnpm run benchmark:kanon        # Run benchmarks (supports filtering: pnpm run benchmark:kanon kanon,zod)
```

## ⚠️ Project Status

**Pithos is production-ready** for most modules, with **100% test coverage**.

| Module   | Status          | Notes                                          |
| -------- | --------------- | ---------------------------------------------- |
| Arkhe    | ✅ Stable       | Core utilities, fully tested                   |
| Kanon    | ✅ Stable       | Schema validation                              |
| Zygos    | ✅ Stable       | Result/Either/Option patterns                  |
| Sphalma  | ✅ Stable       | Error handling                                 |
| Taphos   | ✅ Stable       | Deprecated utilities with migration paths      |

**Philosophy**: Quality over quantity. Each utility is carefully crafted and optimized before being added.

## 🌳 Tree Shaking

Pithos is optimized for tree shaking. Use direct imports for optimal bundle size:

```typescript
// ✅ Good - only specific utilities included
import { chunk } from "pithos/arkhe/array/chunk";
import { debounce } from "pithos/arkhe/function/debounce";

// ❌ Less optimal - entire module included
import * as Arkhe from "pithos/arkhe";
import { chunk } from "pithos";
```

## 📚 Complementary Libraries

Pithos is designed to provide the most useful and reusable utilities possible, but it is **not intended to replace popular and specialized libraries** that already excel at their specific domains.

**In some cases**, certain implementations have been developed for simplicity and to achieve lighter bundles, but for more robust requirements, specialized libraries remain the recommended approach.

**Practical example**: Pithos offers lightweight validation with Kanon, but for complex form handling with UI frameworks, you might complement it with specialized form libraries like React Hook Form or Formik.

### 📚 Recommended Libraries

#### **🧮 Functional Programming**

- **Pithos Zygos** for Either and Task monads (interchangeable with fp-ts)
- **[fp-ts](https://github.com/gcanti/fp-ts)** for advanced features (functors, composition tools, and more)

#### **✅ Result Pattern**

- **Pithos Result** for lightweight error handling (~6KB, 100% API compatible with neverthrow)
- **[neverthrow](https://github.com/supermacro/neverthrow)** for advanced Result features

#### **🔍 Data Validation & Parsing**

- **Pithos Kanon** for schema validation (lightweight, zero dependencies)
- **[Zod](https://zod.dev/)** for complex data transformations

#### **📅 Date Management**

- **Temporal** - Modern and standardized JavaScript API for date and time manipulation, built into the language with excellent TypeScript support

#### **🎬 Advanced Animations**

- **[GSAP](https://greensock.com/gsap/)** - Professional and ultra-performant animation library for complex requirements, featuring timeline management, morphing capabilities, and comprehensive browser support

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements, every contribution helps make Pithos better.

### How to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development setup:

```bash
git clone https://github.com/mopi1402/pithos.git
cd pithos
pnpm install
pnpm run build:watch
```

### Code style:

- Follow the existing TypeScript/ESLint configuration
- Write clear, documented code
- Add tests for new features
- Update documentation as needed

**Questions?** Open an issue or start a discussion!

## 📝 License

[MIT](LICENSE)
