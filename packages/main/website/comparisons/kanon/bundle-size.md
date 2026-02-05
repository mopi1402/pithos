---
sidebar_label: "Bundle Size"
sidebar_position: 1
title: "Kanon Bundle Size"
description: "Compare Kanon bundle size with Zod, Valibot and other validation libraries"
---

import { BundleSizeComparisonTable, SingleLibraryTable, HelpersImpactTable, WhenToUseTable, ZodMiniComparisonTable, SummaryTable, DynamicSize, GeneratedDate, SavingsHighlight } from '@site/src/components/comparisons/BundleSizeTable';

# 📦 Kanon Bundle Size

Real numbers. No marketing fluff. **Data auto-generated on <GeneratedDate />.**

## TL;DR

For a complete app with all schema types: <SavingsHighlight test="full-app" />

## Real-World Use Cases

These are actual validation scenarios you'll encounter in production:

<BundleSizeComparisonTable
  variants={["kanon", "zod4-mini", "zod4-classic", "zod3"]}
  tests={["login-form", "user-profile", "api-response", "config-validation", "form-with-coercion", "full-app"]}
  category="real-world"
  showDiff={true}
  baseVariant="kanon"
  showDescription={true}
  stickySecondColumn={true}
/>

### What each test validates

| Use Case | What it validates |
|----------|-------------------|
| **Login Form** | Email + password with constraints |
| **User Profile** | UUID, email, optional age, roles array |
| **API Response** | Discriminated union (success/error) |
| **Config Validation** | URL, port range, enum, optional timeout |
| **Form + Coercion** | String→Number, String→Boolean, String→Date |
| **Full App** | Everything above + discriminatedUnion, record, etc. |

## Kanon Detailed Breakdown

<SingleLibraryTable variant="kanon" category="real-world" />

## Why Kanon is Smaller: True Tree-Shaking {#direct-imports}

**Kanon uses pure functions. Zod uses classes.** This architectural difference is why Kanon tree-shakes perfectly.

```typescript
// ✅ Kanon - each function is standalone
// Only string() and object() end up in your bundle
import { string, object, parse } from "pithos/kanon";

const loginSchema = object({
  email: string({ format: "email" }),
  password: string({ minLength: 8 }),
});
```

```typescript
// ⚠️ Zod - z is a namespace that carries ALL methods
// The entire Zod library ends up in your bundle
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Even `z.string().min(1)` pulls in **<DynamicSize variant="zod4-classic" />** because class methods are bundled together.

### Zod 4 Mini: A Partial Solution

Zod 4 introduced `zod/mini` which is smaller, but still can't fully tree-shake:

<ZodMiniComparisonTable />

Kanon's bundle **grows proportionally** with usage. Zod's is mostly fixed overhead.

## Convenience Helpers: `k`, `z` & `validation`

Kanon offers convenience helpers for different use cases, but they come with a trade-off:

<HelpersImpactTable />

## Measure It Yourself

The data on this page is generated automatically. Reproduce it:

```bash
# From the pithos repository
cd packages/main/website
npx tsx scripts/generate-bundle-data.ts
```

Or measure any import manually:

```bash
# Using esbuild
echo 'import { string, object, parse } from "pithos/kanon"' | \
  esbuild --bundle --minify | gzip -c | wc -c
```

## Summary

<SummaryTable />

:::tip[Bottom line]
**In production**: Use direct imports for the smallest bundle.  
**Prototyping**: Use `k` namespace for convenience.  
**Migrating from Zod**: Use `z` shim, then gradually switch to direct imports.
:::
