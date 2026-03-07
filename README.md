[![npm version](https://img.shields.io/npm/v/@pithos/core.svg)](https://www.npmjs.com/package/@pithos/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-First-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()
[![Mutation](https://img.shields.io/badge/mutation-100%25-blueviolet.svg)]()
[![Tree-shakable](https://img.shields.io/badge/tree--shakable-✅-brightgreen.svg)]()
[![ES2020+](https://img.shields.io/badge/ES2020+-modern-orange.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

# [🏺 Pithos - Utilities Ecosystem](https://pithos.dev)

**Open the box to unleash the power**

All-in-one utilities ecosystem for modern web development.
Zero dependencies. 100% TypeScript. Modules designed to work together, more than the sum of their parts.

## ✨ Key Features

- **🛡️ Production-Ready** - 100% test coverage, 100% mutation score, integration demos
- **🔄 Interchangeable APIs** - 100% compatible with Neverthrow and fp-ts
- **⚡️ Ultra-Performance** - High-speed execution with perfect tree-shaking
- **🏛️ Type it once, infer it everywhere** - Full TypeScript inference, no manual generics, no `any` leaks

## 🚀 Quick Start

```bash
pnpm install @pithos/core
```

```typescript
import { ensure } from "@pithos/core/bridges/ensure";
import { string, object, optional, coerceDate } from "@pithos/core/kanon";

// Kanon validates, Zygos wraps - one function, two modules
const userSchema = object({
  name: string(),
  email: string(),
  birthdate: optional(coerceDate()),
});

const result = ensure(userSchema, formData);

if (result.isOk()) {
  save(result.value); // fully typed, validated, coerced
} else {
  showError(result.error); // validation error as string
}

// Or chain with map/mapErr - it's a full Zygos Result
ensure(userSchema, formData)
  .map(user => ({ ...user, name: user.name.trim() }))
  .mapErr(error => `Validation failed: ${error}`);
```

No manual try/catch, no `.safeParse()` + `if (!result.success)` boilerplate. That's the point of having an ecosystem.

## 📦 Modules

| Module | Role | Alternative to |
|---|---|---|
| **Arkhe** (ἀρχή - origin) | Core utilities & data manipulation | Lodash, Underscore, Ramda |
| **Kanon** (κανών - rule) | Schema validation | Zod, Yup, Joi |
| **Zygos** (ζυγός - balance) | Result/Either/Option patterns | Neverthrow, fp-ts |
| **Sphalma** (σφάλμα - error) | Typed error factories | - |
| **Taphos** (τάφος - tomb) | Deprecated utils with migration paths | "You Don't Need Lodash" |

All modules are **stable** and **production-ready** with 100% test coverage.

> Like Pandora's pithos that contained both problems and solutions, this ecosystem tackles common development pain points while providing the tools you need. By the way, Pandora's "box" was actually a large jar - *pithos* in Greek 😉

## 🌳 Tree Shaking

Direct imports for optimal bundle size:

```typescript
// ✅ Only what you use
import { chunk } from "@pithos/core/arkhe/array/chunk";
import { debounce } from "@pithos/core/arkhe/function/debounce";
```

Modules with cohesive APIs (Kanon, Zygos, Sphalma) also expose barrels:

```typescript
// ✅ Also fine - negligible overhead with modern bundlers
import { string, object, optional } from "@pithos/core/kanon";
```

## 🔧 Development

```bash
pnpm run dev                # Build in watch mode
pnpm cli                    # Interactive CLI for tests, benchmarks, docs, and more
```

## 📖 Documentation

Full documentation, use cases, benchmarks, and migration guides at **[pithos.dev](https://pithos.dev)**

## 🤝 Contributing

Contributions welcome! See the [contribution guide](https://pithos.dev/guide/contribution/) for setup and guidelines.

## 📝 License

[MIT](LICENSE)
