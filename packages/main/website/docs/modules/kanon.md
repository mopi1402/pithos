---
sidebar_position: 2
sidebar_label: "Kanon"
title: "Kanon - TypeScript Schema Validation | Zod Alternative"
description: "Runtime schema validation for TypeScript. Type-safe, composable, and zero dependencies. A modern Zod alternative with excellent performance."
keywords:
  - schema validation typescript
  - zod alternative
  - runtime validation
  - typescript validation
  - type-safe validation
image: /img/social/kanon-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { InstallTabs } from "@site/src/components/shared/InstallTabs";
import { SavingsHighlight } from '@site/src/components/comparisons/BundleSizeTable';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Kanon"
  description="Runtime schema validation for TypeScript. Type-safe, composable, and zero dependencies. A modern Zod alternative with excellent performance."
  url="https://pithos.dev/guide/modules/kanon"
/>

# 🅺 <ModuleName name="Kanon" />

_κανών - "rule"_

Lightweight alternative to Zod. Schema validation with TypeScript inference: pure validation, no transformations.

Kanon is a runtime schema validation library designed for [TypeScript](https://www.typescriptlang.org/) projects that need fast, type-safe data validation without the overhead of transformation pipelines. It infers TypeScript types directly from your schema definitions, so you define your data shape once and get both validation and type safety.

**Bundle size**: <SavingsHighlight test="full-app" />

---

## Quick Example

Define a schema using composable primitives, then validate incoming data with `parse`. The result is a discriminated union: either a typed success value or a structured error, so you always know what you're working with:

```typescript
import { object, string, number, optional, parse } from "pithos/kanon";

const userSchema = object({
  name: string().minLength(1),
  age: number().min(0).int(),
  email: string().email(),
  phone: optional(string()),
});

const result = parse(userSchema, data);

if (result.success) {
  console.log(result.data); // Typed as { name: string, age: number, ... }
} else {
  console.error(result.error);
}
```

---

## Supported Types

| Category | Types |
|----------|-------|
| **Primitives** | `string`, `number`, `int`, `boolean`, `date`, `bigint`, `symbol`, `null_`, `undefined_`<br/>`any`, `unknown`, `never`, `void_` |
| **Literals & Enums** | `literal`, `enum_`, `nativeEnum`, `⁠numberEnum⠀⚡️`, `booleanEnum⠀⚡️`, `mixedEnum⠀⚡️` |
| **Composites** | `object`, `strictObject`, `looseObject`, `array`, `tuple`, `record`, `map`, `set`<br/>`tupleOf⠀⚡️`, `tupleOf3⠀⚡️`, `tupleOf4⠀⚡️`, `tupleWithRest` |
| **Operators** | `unionOf`, `unionOf3⠀⚡️`, `unionOf4⠀⚡️`, `intersection`, `intersection3⠀⚡️` |
| **Wrappers** | `optional`, `nullable`, `default_`, `readonly`, `lazy` |
| **Coerce** | `coerceString`, `coerceNumber`, `coerceBoolean`, `coerceDate`, `coerceBigInt` |

:::tip Performance
⚡️ **Optimized variants**: these functions are more performant than their nested alternatives (e.g., `unionOf3(a, b, c)` is faster than `unionOf(unionOf(a, b), c)`). They create a single schema with direct validation instead of nested objects.
:::

**Refinements** : `.min()`, `.max()`, `.minLength()`, `.maxLength()`, `.email()`, `.url()`, `.regex()`, `.int()`, ...

---

## V3 vs JIT

Kanon v3 offers two validation modes. The standard mode works in any environment, while the JIT compiler generates optimized JavaScript validators at runtime for higher throughput:

| Mode | Speed | CSP Compatible | Use Case |
|------|-------|----------------|----------|
| **V3 Standard** | 12.6M ops/s | ✅ Yes | Default, works everywhere |
| **V3 JIT** | 23.6M ops/s | ❌ Needs `unsafe-eval` | High-throughput scenarios |

```typescript
import { parse } from "pithos/kanon";              // Standard
import { compile } from "pithos/kanon/jit/compiler"; // JIT

// JIT: compile once, validate many
const validator = compile(schema);
validator(data); // 2x faster
```

The JIT compiler analyzes your schema structure and emits a specialized validation function. This avoids the overhead of walking the schema tree on every call. If your environment blocks `new Function()` via Content Security Policy, Kanon falls back to the standard interpreter automatically.

---

## Key Difference with Zod

Kanon **validates** but does **not transform** data. This is a deliberate design choice: validation and transformation are separate concerns, and mixing them in a single pipeline can make data flow harder to reason about.

Keeping validation and transformation separate makes each step easier to test, debug, and compose. If you need to clean or reshape data, handle it explicitly after validation.

:::info
The `asZod()` helper provides Zod-compatible API for migration purposes.  
While it supports `.transform()` and `.preprocess()` for compatibility, transformations are not a core feature of Kanon : Prefer handling them explicitly after validation.
:::

For a detailed side-by-side comparison with code examples, see [Kanon vs Zod — Key Design Difference](/comparisons/kanon/kanon-vs-zod/#key-design-difference-no-built-in-transforms).

---

## Helpers

### `z` - Drop-in Replacement for Zod

**Migrate from Zod with a single line change.** The `z` namespace mirrors Zod's API, so your existing schemas and validation calls work without modification. Just swap the import:

```typescript
// Before (Zod)
import { z } from "zod";

// After (Kanon): only change the import
import { z } from "pithos/kanon/helpers/as-zod.shim";

// Your existing code works unchanged
```

:::tip Migration
Search & replace `from "zod"` → `from "pithos/kanon/helpers/as-zod.shim"` in your codebase. Done.
:::

For the full list of supported Zod features and edge cases, see the [Kanon ↔ Zod interoperability matrix](/comparisons/kanon/interoperability/).

### `k` - Namespace object

The `k` namespace provides the same API as `z`, using Kanon's own naming conventions. It groups all schema constructors under a single object for convenience:

```typescript
import { k } from "pithos/kanon/helpers/k";

const schema = k.object({
  name: k.string(),
  age: k.number().min(0),
});

k.parse(schema, data);
```

:::warning
Not tree-shakable: imports all schemas. Prefer direct imports for optimal bundle size.
:::

### `asZod()` - Wrap individual schemas

Wraps any Kanon schema with Zod-like methods. This is useful when you want tree-shakable imports but still need Zod's fluent API for specific schemas:

```typescript
import { asZod } from "pithos/kanon/helpers/as-zod";
import { string, number, object } from "pithos/kanon";

const schema = asZod(object({
  name: string(),
  age: number(),
}));

// Parsing methods
schema.parse(data);              // throws on error
schema.safeParse(data);          // { success, data/error }
schema.parseAsync(data);         // async parse
schema.safeParseAsync(data);     // async safeParse

// Refinements & transformations
schema.refine(val => val.age >= 18, "Must be adult");
schema.superRefine((val, ctx) => {
  if (val.age < 18) ctx.addIssue({ message: "Too young" });
});
schema.transform(val => ({ ...val, fullName: val.name }));

// Wrappers
schema.optional();               // T | undefined
schema.nullable();               // T | null
schema.default({ name: "Anonymous", age: 0 });
schema.catch({ name: "Fallback", age: 0 });
schema.readonly();               // Readonly<T>
schema.promise();                // Promise<T>

// Operators
schema.array();                  // T[]
schema.union(otherSchema);       // T | U (alias: .or())
schema.intersection(otherSchema); // T & U (alias: .and())
```
---

## When NOT to Use

Kanon is designed for straightforward data validation. For use cases that go beyond checking data shapes, consider these alternatives:

| Need | Use Instead |
|------|-------------|
| Data utilities | [Arkhe](./arkhe.md) |
| Error handling (Result) | [Zygos](./zygos.md) |
| Complex transformations | Custom logic or Zod |

---

## Migrating from Zod

### Step 1: Install Pithos

Add Pithos to your project using your preferred package manager:

<InstallTabs />

### Step 2: Swap the import

```typescript
// Before
import { z } from "zod";

// After
import { z } from "pithos/kanon/helpers/as-zod.shim";
```

### Step 3: Run your tests

Most schemas work as-is. The `z` shim covers primitives, objects, arrays, unions, intersections, wrappers, coercion, and refinements.

### Step 4: Handle edge cases

Some Zod features (`.pipe()`, `.brand()`, `z.instanceof()`, specialized string formats like JWT/CUID) are not directly available in Kanon. Workarounds exist for all of them.

See the [Kanon ↔ Zod interoperability matrix](/comparisons/kanon/interoperability/) for the complete list of supported features, missing features, and their workarounds.

### Step 5 (optional): Switch to direct imports

For maximum bundle optimization, gradually replace the `z` shim with direct imports:

```typescript
// z shim (convenient, slightly larger)
import { z } from "pithos/kanon/helpers/as-zod.shim";
const schema = z.object({ name: z.string() });

// Direct imports (smallest possible bundle)
import { object, string, parse } from "pithos/kanon";
const schema = object({ name: string() });
```

For a complete mapping of supported Zod features, see the [Kanon ↔ Zod interoperability matrix](/comparisons/kanon/interoperability/) which covers primitives, composites, operators, and refinements.

Kanon pairs well with [Zygos Result types for typed error handling](./zygos.md): validate with Kanon, then wrap failures in typed `Err` values for explicit error propagation.

---

<RelatedLinks title="Related Resources">

- [When to use Kanon](/comparisons/overview/) — Compare Kanon with alternatives and find when it's the right choice
- [Kanon bundle size & performance](/comparisons/kanon/bundle-size/) — Detailed bundle size comparison with Zod
- [Kanon API Reference](/api/kanon) — Complete API documentation for all Kanon schemas and validators

</RelatedLinks>
