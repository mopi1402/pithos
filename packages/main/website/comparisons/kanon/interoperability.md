---
sidebar_label: "Interoperability"
sidebar_position: 3
title: "Kanon ↔ Zod Interoperability"
description: "Compare Kanon and Zod APIs: compatible features, missing features, additional features, and migration guide"
---

import { Accordion } from '@site/src/components/Accordion';
import { Code } from '@site/src/components/Code';

# Kanon ↔ Zod Interoperability

Real compatibility data. No guesswork. **Analyzed against Zod v4 Classic.**

:::info[Zod v4 Classic vs Mini]
Zod v4 offers two APIs:
- **Classic**: Method chaining (`.optional()`, `.nullable()`). This page covers Classic.
- **Mini**: Pure functions like Kanon's native API (`optional(schema)`, `nullable(schema)`)

If you use Zod Mini, consider using Kanon's [direct imports](./bundle-size.md#direct-imports) instead of the `z` shim: the syntax is nearly identical.
:::

## TL;DR

**Core API compatible.** Primitives, composites, unions, wrappers, coercion, refinements, and transforms work with the `z` shim.

| Metric | Value |
|--------|-------|
| **Primitives** | 14/14 (100%) |
| **Composites** | 6/6 (100%) |
| **Operators** | 3/3 (100%) |
| **Migration Effort** | Import changes only (for most schemas) |

:::tip[Bottom line]
If you use primitives, objects, arrays, unions, and basic wrappers, **you're covered**. Change your imports and you're done.
:::

## About this page

Kanon's native API is designed for **optimal tree-shaking**: pure functions, direct imports, no class overhead. We recommend using [direct imports for production apps](./bundle-size.md#direct-imports).

However, for **smooth migration from Zod**, Kanon provides a `z` shim with a 1:1 Zod-compatible API:

```typescript
// Just swap your import
import { z } from "pithos/kanon/v3/helpers/as-zod.shim";

// Your existing Zod code works as-is
const schema = z.object({
  name: z.string(),
  age: z.number().optional(),
});
```

**This page focuses on the `z` shim**: all compatibility tables below use the `z.` syntax. Once migrated, you can gradually refactor to direct imports for maximum bundle optimization.

## ✅ What Kanon handles the same

Click to expand each category and see the supported features:

<Accordion title="Primitives (100%)" badge="14/14">

<Code>z.string()</Code>, <Code>z.number()</Code>, <Code>z.boolean()</Code>, <Code>z.bigint()</Code>, <Code>z.date()</Code>, <Code>z.symbol()</Code>, <Code>z.undefined()</Code>, <Code>z.null()</Code>, <Code>z.void()</Code>, <Code>z.any()</Code>, <Code>z.unknown()</Code>, <Code>z.never()</Code>, <Code>z.literal()</Code>, <Code>z.enum()</Code>

</Accordion>

<Accordion title="Composites (100%)" badge="6/6">

<Code>z.object()</Code>, <Code>z.array()</Code>, <Code>z.tuple()</Code>, <Code>z.record()</Code>, <Code>z.map()</Code>, <Code>z.set()</Code>

</Accordion>

<Accordion title="Operators (100%)" badge="3/3">

<Code>z.union()</Code>, <Code>z.intersection()</Code>, <Code>z.discriminatedUnion()</Code>, <Code>.or()</Code>, <Code>.and()</Code>

</Accordion>

<Accordion title="Wrappers (100%)" badge="7/7">

<Code>.optional()</Code>, <Code>.nullable()</Code>, <Code>.nullish()</Code>, <Code>.default()</Code>, <Code>.readonly()</Code>, <Code>z.lazy()</Code>, <Code>.catch()</Code>

</Accordion>

<Accordion title="Object Transforms (100%)" badge="5/5">

<Code>.partial()</Code>, <Code>.required()</Code>, <Code>.pick()</Code>, <Code>.omit()</Code>, <Code>.keyof()</Code>

</Accordion>

<Accordion title="Coercion (100%)" badge="5/5">

<Code>z.coerce.string()</Code>, <Code>z.coerce.number()</Code>, <Code>z.coerce.boolean()</Code>, <Code>z.coerce.bigint()</Code>, <Code>z.coerce.date()</Code>

</Accordion>

<Accordion title="Refinements (100%)" badge="2/2">

<Code>.refine()</Code>, <Code>.superRefine()</Code>

</Accordion>

<Accordion title="Transforms (100%)" badge="2/2">

<Code>.transform()</Code>, <Code>.array()</Code>

</Accordion>

### Code Examples

With the `z` shim, your Zod code works as-is. Just change the import.

#### Basic Schema

```typescript
// Zod
import { z } from "zod";

// Kanon (just change the import!)
import { z } from "pithos/kanon/v3/helpers/as-zod.shim";

// Same code works in both
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  active: z.boolean(),
});
```

#### With Constraints

```typescript
import { z } from "pithos/kanon/v3/helpers/as-zod.shim";

const productSchema = z.object({
  sku: z.string().min(3).max(10),
  price: z.number().positive().max(9999),
  email: z.string().email(),
});
```

#### With Optional/Nullable

```typescript
import { z } from "pithos/kanon/v3/helpers/as-zod.shim";

const profileSchema = z.object({
  username: z.string(),
  bio: z.string().optional(),
  avatar: z.string().nullable(),
  nickname: z.string().nullish(),
});
```

#### Union Types

```typescript
import { z } from "pithos/kanon/v3/helpers/as-zod.shim";

const statusSchema = z.union([
  z.literal("pending"),
  z.literal("approved"),
  z.literal("rejected"),
]);

const responseSchema = z.object({
  data: z.union([z.string(), z.number()]),
});
```

## ⚠️ What Kanon doesn't support

The `z` shim focuses on core validation. Some Zod features are not available and likely never will be.

### Not in the `z` shim

| Feature | Workaround |
|---------|------------|
| `.pipe()` | Chain schemas manually |
| `.brand()` | Use type assertions |
| `z.instanceof()` | Use `.refine(v => v instanceof Class)` |
| `z.preprocess()` | Use `.transform()` before validation |
| `z.custom()` | Use `.refine()` or `.superRefine()` |

### String format validators (Zod v4)

| Feature | Workaround |
|---------|------------|
| `z.email()`, `z.uuid()`, `z.url()` | Use `z.string().email()`, etc. |
| `z.jwt()`, `z.ipv4()`, `z.base64()` | Use `z.string().regex()` |

<Accordion title="Why Kanon doesn't cover 100% of Zod">

**Kanon deliberately focuses on essential features**: the ones you actually use in 90%+ of projects.

**100% covered:**
- Primitives, objects, arrays, tuples, unions, intersections
- Optional, nullable, default, transforms, refinements
- String constraints (min, max, regex, email, url...)

**Not included by design:**
- Specialized ID formats (CUID, ULID, KSUID, XID, NanoID...)
- Network validators (CIDR ranges, E.164 phone numbers...)
- Hash validators (MD5, SHA256, SHA512 in hex/base64...)
- ISO 8601 duration parsing, extended datetime formats...

These are edge cases. Zod bundles them by default, which adds weight even if you never use them. Kanon doesn't. If you need one of these, `z.string().regex()` works perfectly.

</Accordion>

## ✨ What Kanon adds

Beyond Zod compatibility, Kanon brings unique features:

| Feature | Description |
|---------|-------------|
| ✨ **JIT Compilation** | Automatic compilation to optimized validators (2-10x faster) |
| 📦 **Perfect Tree-Shaking** | Pure functions, no class overhead, smallest possible bundle |
| 🎯 **`strictObject()` / `looseObject()`** | Explicit object validation modes |
| ⚡ **`parseBulk()`** | Optimized batch validation for arrays |
| 📥 **Direct imports** | Import only what you use for maximum tree-shaking |

:::tip[After migration]
Once you've migrated with the `z` shim, you can gradually refactor to direct imports for even smaller bundles. See the [API documentation](/docs/kanon/v3) for the native Kanon API.
:::

<Accordion title="Migration Guide">

### Step 1: Install

```bash
npm install pithos
```

### Step 2: Update imports

```typescript
// Before
import { z } from "zod";

// After
import { z } from "pithos/kanon/v3/helpers/as-zod.shim";
```

### Step 3: Run your tests

Most schemas work as-is. If something fails, check the next step.

### Step 4: Handle edge cases

If you use a Zod feature that Kanon doesn't provide, here's what to do:

**Specialized string formats** (jwt, cuid, ulid, cidr, e164...):
```typescript
// Zod
z.string().jwt()

// Kanon: use regex
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
z.string().regex(jwtRegex, "Invalid JWT")
```

**Object manipulation** (pick, omit, partial, required):
```typescript
// Zod
const partial = userSchema.partial()

// Kanon: use native functions
import { partial } from "pithos/kanon/v3";
const partialUser = partial(userSchema._schema());
```

**Pipe / brand**:
```typescript
// Zod
z.string().pipe(z.coerce.number()).brand<"UserId">()

// Kanon: chain transforms manually, use type assertions for branding
z.string().transform(Number)
```

</Accordion>
