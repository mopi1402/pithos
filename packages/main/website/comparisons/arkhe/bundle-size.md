---
sidebar_label: "Bundle Size"
sidebar_position: 1
title: "Arkhe vs Lodash, es-toolkit, Remeda & Radashi - Bundle Size Comparison"
description: "Compare Pithos Arkhe bundle size with Lodash, es-toolkit, Remeda and Radashi"
---

import { ArkheBundleTable, GeneratedDate, TLDR, Legend } from '@site/src/components/comparisons/arkhe/BundleSizeTable';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 📦 Arkhe Bundle Size

Real numbers. No marketing fluff. **Data auto-generated on <GeneratedDate />.**

## TL;DR

<TLDR module="arkhe" />

--- 

## Arkhe Utilities Comparison

Individual function sizes, minified + gzipped.

<Legend />

<ArkheBundleTable module="arkhe" />

---

## Why Pithos is Competitive

**Modern JavaScript target.** Pithos targets ES2020+. No polyfills, no legacy compatibility layers.

**Pure functions.** Each utility is a standalone function. No classes, no prototypes, no hidden dependencies.

**True tree-shaking.** Import what you use, ship what you import:

```typescript
// Only chunk ends up in your bundle
import { chunk } from "pithos/arkhe/array/chunk";
```

---

## Why Lodash is Larger

Lodash pioneered the JavaScript utility ecosystem and remains widely used. Its larger bundle size comes from a deliberate choice: broad compatibility across environments, including ES5 and older runtimes. Every function carries internal utilities and polyfills to ensure consistent behavior everywhere.

That legacy support has a cost. **Lodash is 10-50x larger** than Pithos for most utilities. Not because it's poorly written, but because it solves a different problem: universal compatibility vs. modern-first.

---

## es-toolkit

es-toolkit is a modern Lodash replacement with good tree-shaking. Pithos is generally 10-30% smaller on individual functions.

**es-toolkit/compat** is their Lodash compatibility layer, significantly larger due to legacy API support.

---

## Reproduce These Results

Want to verify these results? See [how to reproduce our data](../reproduce.md).

--- 

<RelatedLinks>

- [Arkhe vs Lodash](./arkhe-vs-lodash.md) — Full comparison: philosophy, API, migration
- [Taphos — Bundle Size](../taphos/bundle-size.md) — Deprecated utilities size comparison
- [Equivalence Table](/comparisons/equivalence-table/) — Full library equivalence across all modules
- [Comparison Overview](/comparisons/overview/) — When to use each Pithos module

</RelatedLinks>
