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
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Kanon"
  description="Runtime schema validation for TypeScript. Type-safe, composable, and zero dependencies. A modern Zod alternative with excellent performance."
  url="https://pithos.dev/guide/modules/kanon"
/>

# 🅺 <ModuleName name="Kanon" />

_κανών - "rule"_

Lightweight alternative to Zod. Schema validation with TypeScript inference, coercion, and schema composition.

Kanon is a runtime schema validation library designed for [TypeScript](https://www.typescriptlang.org/) projects that need fast, type-safe data validation. It infers TypeScript types directly from your schema definitions, so you define your data shape once and get both validation and type safety. Kanon supports type coercion (`coerceString`, `coerceNumber`...), schema transforms (`partial`, `pick`, `omit`...), and offers an [`asZod`](/api/kanon/helpers/asZod) wrapper for progressive migration from Zod.

**Bundle size**:

<SavingsHighlight test="full-app" />

---

## Quick Example

Define a schema using composable primitives, then validate incoming data with [`parse`](/api/kanon/core/parse). The result is a discriminated union: either a typed success value or a structured error, so you always know what you're working with:

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,optional:/api/kanon/schemas/wrappers/optional,parse:/api/kanon/core/parse"
import { object, string, number, optional, parse } from "@pithos/core/kanon";

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

<TableConfig noEllipsis columns={{ "CSP Compatible": { width: "240px" } }}>

| Mode | Speed | CSP Compatible | Use Case |
|------|-------|----------------|----------|
| **V3 Standard** | 12.6M ops/s | ✅ Yes | Default, works everywhere |
| **V3 JIT** | 23.6M ops/s | ❌ Needs `unsafe-eval` | High-throughput scenarios |

</TableConfig>

```typescript links="parse:/api/kanon/core/parse,compile:/api/kanon/jit/compile"
import { parse } from "@pithos/core/kanon";              // Standard
import { compile } from "@pithos/core/kanon/jit/compiler"; // JIT

// JIT: compile once, validate many
const validator = compile(schema);
validator(data); // 2x faster
```

The JIT compiler analyzes your schema structure and emits a specialized validation function. This avoids the overhead of walking the schema tree on every call. If your environment blocks `new Function()` via Content Security Policy, Kanon falls back to the standard interpreter automatically.

---

## Key Difference with Zod

Kanon separates **validation** and **transformation**. The native API does not offer chained `.transform()` pipelines like Zod: you validate first, then transform explicitly in your code.

Coercion (`coerceString`, `coerceNumber`...) is the only built-in transformation: it converts the input type before validation (e.g. `42` → `"42"`).

:::info
The `asZod()` wrapper supports `.transform()` and `.preprocess()` to ease migration from Zod. But in Kanon's native API, prefer handling transformations explicitly after validation.
:::

See also: [Kanon vs Zod](/comparisons/kanon/kanon-vs-zod/#key-design-difference-validation-and-transformation-are-separate).

---

## Helpers

### `z` - Drop-in Replacement for Zod

**Migrate from Zod with a single line change.** The `z` namespace mirrors Zod's API, so your existing schemas and validation calls work without modification. Just swap the import:

```typescript
// Before (Zod)
import { z } from "zod";

// After (Kanon): only change the import
import { z } from "@pithos/core/kanon/helpers/as-zod.shim";

// Your existing code works unchanged in most cases
```

:::tip Migration
Search & replace `from "zod"` → `from "@pithos/core/kanon/helpers/as-zod.shim"` in your codebase. Done.
:::

For the full list of supported Zod features and edge cases, see the [Kanon ↔ Zod interoperability matrix](/comparisons/kanon/interoperability/).

### `k` - Namespace object

The `k` namespace provides the same API as `z`, using Kanon's own naming conventions. It groups all schema constructors under a single object for convenience:

```typescript links="k:/api/kanon/helpers/k"
import { k } from "@pithos/core/kanon/helpers/k";

const schema = k.object({
  name: k.string(),
  age: k.number().min(0),
});

k.parse(schema, data);
```

:::warning
Lighter than `asZod`, but not tree-shakable: imports all schemas. Prefer direct imports for optimal bundle size.
:::

### `asZod()` - Wrap individual schemas

Wraps any Kanon schema with Zod-like methods. This is useful when you want tree-shakable imports but still need Zod's fluent API for specific schemas:

```typescript links="asZod:/api/kanon/helpers/asZod,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,object:/api/kanon/schemas/composites/object"
import { asZod } from "@pithos/core/kanon/helpers/as-zod";
import { string, number, object } from "@pithos/core/kanon";

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
import { z } from "@pithos/core/kanon/helpers/as-zod.shim";
```

### Step 3: Run your tests

Most schemas work as-is. The `z` shim covers primitives, objects, arrays, unions, intersections, wrappers, coercion, and refinements.

### Step 4: Handle edge cases

Some Zod features (`.pipe()`, `.brand()`, `z.instanceof()`, specialized string formats like JWT/CUID) are not directly available in Kanon. Workarounds exist for all of them — see the [interoperability matrix](/comparisons/kanon/interoperability/).

### Step 5 (optional): Switch to direct imports

For maximum bundle optimization, gradually replace the `z` shim with direct imports:

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,parse:/api/kanon/core/parse"
// z shim (convenient, slightly larger)
import { z } from "@pithos/core/kanon/helpers/as-zod.shim";
const schema = z.object({ name: z.string() });

// Direct imports (smallest possible bundle)
import { object, string, parse } from "@pithos/core/kanon";
const schema = object({ name: string() });
```

Kanon pairs well with [Zygos Result types for typed error handling](./zygos.md): validate with Kanon, then wrap failures in typed `Err` values for explicit error propagation. See the [practical example](/guide/basics/practical-example/).

---

<RelatedLinks title="Related Resources">

- [When to use Kanon](/comparisons/overview/) — Compare Kanon with alternatives and find when it's the right choice
- [Kanon bundle size & performance](/comparisons/kanon/bundle-size/) — Detailed bundle size comparison with Zod
- [Kanon API Reference](/api/kanon) — Complete API documentation for all Kanon schemas and validators

</RelatedLinks>
