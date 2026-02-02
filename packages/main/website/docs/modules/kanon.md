---
sidebar_position: 2
title: Kanon
---

import { SavingsHighlight } from '@site/src/components/BundleSizeTable';

# Kanon

_κανών - "rule"_

Lightweight alternative to Zod. Schema validation with TypeScript inference — pure validation, no transformations.

**Bundle size**: <SavingsHighlight test="full-app" />

## Quick Example

```typescript
import { object, string, number, optional, parse } from "pithos/kanon/v3";

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
⚡️ **Optimized variants** — These functions are more performant than their nested alternatives (e.g., `unionOf3(a, b, c)` is faster than `unionOf(unionOf(a, b), c)`). They create a single schema with direct validation instead of nested objects.
:::

**Refinements** : `.min()`, `.max()`, `.minLength()`, `.maxLength()`, `.email()`, `.url()`, `.regex()`, `.int()`, ...

## V3 vs JIT

Kanon v3 offers two validation modes:

| Mode | Speed | CSP Compatible | Use Case |
|------|-------|----------------|----------|
| **V3 Standard** | 12.6M ops/s | ✅ Yes | Default, works everywhere |
| **V3 JIT** | 23.6M ops/s | ❌ Needs `unsafe-eval` | High-throughput scenarios |

```typescript
import { parse } from "pithos/kanon/v3";              // Standard
import { compile } from "pithos/kanon/v3/jit/compiler"; // JIT

// JIT: compile once, validate many
const validator = compile(schema);
validator(data); // 2x faster
```

JIT compiles schemas to optimized JavaScript at runtime. Falls back to standard if CSP blocks `new Function()`.

## Key Difference with Zod

Kanon **validates** but does **not transform** data.

```typescript
// Kanon: pure validation only
parse(string(), "  hello  "); // ✅ Returns "  hello  " as-is

// Zod: validation + transformation
z.string().trim().parse("  hello  "); // Returns "hello"
```

**Why no transformations?**

Validation and transformation are two different concerns. Kanon focuses on validation only — if you need transformations, handle them separately in your application logic.

```typescript
// Kanon approach: separate concerns
const result = parse(string(), input);
if (result.success) {
  const transformed = result.data.trim(); // Transform after validation
}
```

:::info
The `asZod()` helper provides Zod-compatible API for migration purposes, but transformations (`.transform()`, `.preprocess()`, etc.) are not a core feature of Kanon.
:::

## Helpers

### `z` - Drop-in Replacement for Zod

**Migrate from Zod with a single line change.** Just replace the import:

```typescript
// Before (Zod)
import { z } from "zod";

// After (Kanon) — only change the import, code stays IDENTICAL
import { z } from "pithos/kanon/v3/helpers/as-zod.shim";

// Your existing code works unchanged
const userSchema = z.object({
  name: z.string().min(1),
  age: z.number().int(),
  email: z.string().email(),
});

userSchema.parse(data);
userSchema.safeParse(data);
```

:::tip Migration
Search & replace `from "zod"` → `from "pithos/kanon/v3/helpers/as-zod.shim"` in your codebase. Done.
:::

### `k` - Namespace object

Same API as `z`, but using Kanon naming.

```typescript
import { k } from "pithos/kanon/v3/helpers/k";

const schema = k.object({
  name: k.string(),
  age: k.number().min(0),
});

k.parse(schema, data);
```

:::warning
Not tree-shakeable — imports all schemas. Prefer direct imports for optimal bundle size.
:::

### `asZod()` - Wrap individual schemas

Wraps any Kanon schema with Zod-like methods.

```typescript
import { asZod } from "pithos/kanon/v3/helpers/as-zod";
import { string, number, object } from "pithos/kanon/v3";

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

## When NOT to Use

| Need | Use Instead |
|------|-------------|
| Complex transformations | Zod native |
| Data utilities | [Arkhe](./arkhe.md) |
| Error handling (Result) | [Zygos](./zygos.md) |

## API Reference

[Browse all Kanon schemas →](/api/kanon)
