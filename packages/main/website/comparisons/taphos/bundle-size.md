---
sidebar_label: "Bundle Size"
sidebar_position: 1
title: "Taphos Bundle Size"
description: "Compare Pithos Taphos bundle size with Lodash, es-toolkit, Remeda and Radashi"
---

import { ArkheBundleTable, GeneratedDate, TLDR, Legend } from '@site/src/components/comparisons/arkhe/BundleSizeTable';

# 📦 Taphos Bundle Size

Real numbers. No marketing fluff. **Data auto-generated on <GeneratedDate />.**

## TL;DR

<TLDR module="taphos" />

## Taphos Utilities Comparison

Individual function sizes, minified + gzipped. Pithos is the baseline (gold). Green = smaller, gray = similar (±5%), red = larger.

<Legend />

<ArkheBundleTable module="taphos" />

## Why Pithos is Competitive

**Modern JavaScript target.** Pithos targets ES2020+. No polyfills, no legacy compatibility layers.

**Pure functions.** Each utility is a standalone function. No classes, no prototypes, no hidden dependencies.

**True tree-shaking.** Import what you use, ship what you import:

```typescript
// Only flatten ends up in your bundle
import { flatten } from "pithos/taphos/array/flatten";
```

## Why Lodash is Larger

Lodash pioneered the JavaScript utility ecosystem and remains widely used. Its larger bundle size comes from a deliberate choice: broad compatibility across environments, including ES5 and older runtimes. Every function carries internal utilities and polyfills to ensure consistent behavior everywhere.

That legacy support has a cost. **Lodash is 10-50x larger** than Pithos for most utilities. Not because it's poorly written, but because it solves a different problem: universal compatibility vs. modern-first.

## es-toolkit

es-toolkit is a modern Lodash replacement with good tree-shaking. Pithos is generally 10-30% smaller on individual functions.

**es-toolkit/compat** is their Lodash compatibility layer — significantly larger due to legacy API support.

## Measure It Yourself

```bash
# Using esbuild
echo 'import { flatten } from "pithos/taphos/array/flatten"' | \
  esbuild --bundle --minify | gzip -c | wc -c

# Regenerate this data
pnpm doc:generate-arkhe-bundle-sizes
```
