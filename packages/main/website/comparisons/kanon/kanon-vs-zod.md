---
sidebar_label: "Kanon vs Zod"
sidebar_position: 4
title: "Kanon vs Zod: TypeScript Schema Validation Comparison"
description: "Compare Kanon and Zod for TypeScript validation. Bundle size, performance benchmarks, API compatibility, JIT compilation, and migration guide."
keywords:
  - kanon vs zod
  - zod alternative typescript
  - typescript schema validation comparison
  - zod replacement
  - lightweight validation library
  - zod bundle size
  - runtime validation typescript
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ArticleSchema
  headline="Kanon vs Zod: TypeScript Schema Validation Comparison"
  description="Compare Kanon and Zod for TypeScript validation. Bundle size, performance benchmarks, API compatibility, JIT compilation, and migration guide."
  datePublished="2026-02-16"
/>

# Kanon vs Zod: Which Validation Library for TypeScript?

Zod is the most popular [TypeScript](https://www.typescriptlang.org/) schema validation library. It offers a fluent API, built-in transformations, and a large ecosystem. But its class-based architecture means every import pulls in the entire library, and its bundle size reflects that.

<ModuleName name="Kanon" /> takes a different approach: pure functions, granular imports, and an optional JIT compiler for high-throughput scenarios. It covers the core validation use cases while staying significantly smaller. This page compares both libraries across the dimensions that matter in production.

---

## At a Glance

| Aspect | Kanon | Zod v4 Classic |
|--------|-------|----------------|
| **Architecture** | Pure functions | Class-based |
| **Tree-shaking** | Per-function imports | Limited (class methods bundled together) |
| **JIT compilation** | Yes (2-10x faster) | No |
| **Transformations** | Separate concern | Built-in (`.transform()`) |
| **Dependencies** | Zero | Zero |
| **API compatibility** | `z` shim for drop-in migration | — |
| **Bundle (login form)** | ~0.5 KB | ~12 KB |

---

## Bundle Size

The architectural difference drives the bundle gap. Zod uses classes: importing `z.string()` pulls in every method on the `ZodString` class. Kanon uses standalone functions: you import only what you validate.

For detailed per-scenario comparisons with auto-generated data, see the [Kanon bundle size comparison](./bundle-size.md).

```typescript
// Kanon: only string() and object() end up in your bundle
import { string, object, parse } from "pithos/kanon";

const loginSchema = object({
  email: string({ format: "email" }),
  password: string({ minLength: 8 }),
});
```

```typescript
// Zod: the entire library ends up in your bundle
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Kanon's bundle **grows proportionally** with usage. Zod's is mostly fixed overhead.

---

## Performance

Kanon offers two validation modes: a standard interpreter and a JIT compiler that generates optimized JavaScript validators at runtime.

For detailed benchmark results with auto-generated data, see the [Kanon performance benchmarks](./performances.md).

| Mode | Throughput | CSP Compatible |
|------|-----------|----------------|
| Kanon Standard | ~12.6M ops/s | Yes |
| Kanon JIT | ~23.6M ops/s | Needs `unsafe-eval` |
| Zod v4 | Varies by schema | Yes |

The JIT compiler analyzes your schema structure and emits a specialized validation function, avoiding the overhead of walking the schema tree on every call. For high-throughput scenarios (API servers, batch processing), this makes a measurable difference.

---

## API Compatibility

Kanon provides a `z` shim that mirrors Zod's API for smooth migration:

```typescript
// Just swap the import
import { z } from "pithos/kanon/helpers/as-zod.shim";

// Your existing Zod code works unchanged
const userSchema = z.object({
  name: z.string().min(1),
  age: z.number().int(),
  email: z.string().email(),
});

userSchema.parse(data);
userSchema.safeParse(data);
```

For a complete compatibility matrix, see the [Kanon ↔ Zod interoperability page](./interoperability.md).

**Coverage summary**:
- Primitives: 15/15 (100%)
- Composites: 6/6 (100%)
- Operators: 3/3 (100%)
- Wrappers, refinements, coercion: 100%

---

## Key Design Difference: No Built-in Transforms

Kanon validates but does not transform data. This is deliberate: validation and transformation are separate concerns:

```typescript
// Kanon: pure validation
parse(string(), "  hello  "); // ✅ Returns "  hello  " as-is

// Zod: validation + transformation
z.string().trim().parse("  hello  "); // Returns "hello"
```

Keeping them separate makes each step easier to test, debug, and compose. If you need to reshape data, handle it explicitly after validation.

---

## Migration Guide

<MigrationCTA module="Kanon" guideLink="/guide/modules/kanon/#migrating-from-zod" guideDescription="install, swap imports, handle edge cases, and optimize with direct imports" />

--- 

<RelatedLinks title="Further Reading">

- [Kanon bundle size comparison](./bundle-size.md): auto-generated per-scenario size data
- [Kanon performance benchmarks](./performances.md): auto-generated benchmark results
- [Kanon ↔ Zod interoperability](./interoperability.md): full API compatibility matrix
- [Kanon module documentation](/guide/modules/kanon/): API overview and usage guide
- [Kanon API reference](/api/kanon/): complete schema reference

</RelatedLinks>
