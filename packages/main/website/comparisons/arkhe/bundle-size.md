---
sidebar_label: "Bundle Size"
sidebar_position: 1
title: "Arkhe Bundle Size"
description: "Compare Pithos Arkhe bundle size with Lodash, es-toolkit, Remeda and Radashi"
---

import { ArkheBundleTable, GeneratedDate, TLDR, Legend } from '@site/src/components/ArkheBundleSizeTable';

# Arkhe Bundle Size

Real numbers. No marketing fluff. **Data auto-generated on <GeneratedDate />.**

## TL;DR

<TLDR module="arkhe" />

## Arkhe Utilities Comparison

Individual function sizes, minified + gzipped. Pithos is the baseline (gold). Green = smaller, gray = similar (±5%), red = larger.

<Legend />

<ArkheBundleTable module="arkhe" />

## Why Pithos is Competitive

**Modern JavaScript target.** Pithos targets ES2020+. No polyfills, no legacy compatibility layers.

**Pure functions.** Each utility is a standalone function. No classes, no prototypes, no hidden dependencies.

**True tree-shaking.** Import what you use, ship what you import:

```typescript
// Only chunk ends up in your bundle
import { chunk } from "pithos/arkhe/array/chunk";
```

## Lodash: The Elephant

Lodash was built for ES5 compatibility. Every function carries internal utilities and polyfills. Even simple functions like `isArray` pull in hundreds of bytes of overhead.

**Lodash is 10-50x larger** than Pithos for most utilities.

## es-toolkit: Close, But Not Quite

es-toolkit is a modern Lodash replacement with decent tree-shaking. But Pithos consistently edges it out — often by 10-30% smaller bundles.

**es-toolkit/compat** is their Lodash compatibility layer — significantly larger due to legacy API support.

## Measure It Yourself

```bash
# Using esbuild
echo 'import { chunk } from "pithos/arkhe/array/chunk"' | \
  esbuild --bundle --minify | gzip -c | wc -c

# Regenerate this data
pnpm doc:generate-arkhe-bundle-sizes
```
