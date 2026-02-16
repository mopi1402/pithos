---
sidebar_label: "Bundle Size"
sidebar_position: 1
title: "Taphos vs Lodash, es-toolkit, Remeda & Radashi - Bundle Size Comparison"
description: "Compare Pithos Taphos bundle size with Lodash, es-toolkit, Remeda and Radashi"
---

import { ArkheBundleTable, GeneratedDate, TLDR, Legend } from '@site/src/components/comparisons/arkhe/BundleSizeTable';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 📦 Taphos Bundle Size

Real numbers. No marketing fluff. **Data auto-generated on <GeneratedDate />.**


## TL;DR

<TLDR module="taphos" />

---

## Taphos Utilities Comparison

Individual function sizes, minified + gzipped.

<Legend />

<ArkheBundleTable module="taphos" />

---

## Why Pithos is Competitive

Taphos utilities share the same architecture as Arkhe: pure functions, ES2020+ target, and per-function entry points. For a detailed explanation of why Pithos bundles are smaller, see [Arkhe bundle size analysis](../arkhe/bundle-size.md).

:::tip[These functions are deprecated]
Taphos functions exist as migration helpers. Most have a smaller Arkhe equivalent or a native JavaScript replacement. Check each function's TSDoc for the recommended migration path. You'll likely end up with an even smaller bundle.
:::

---

## Reproduce These Results

Want to verify these results? See [how to reproduce our data](../reproduce.md).

---

<RelatedLinks>

- [Arkhe — Bundle Size](../arkhe/bundle-size.md) — Non-deprecated utility sizes (same libraries)
- [Taphos — Native Equivalence](./native-equivalence.md) — When native JS is enough
- [Taphos Module Guide](/guide/modules/taphos/) — Migration guide and burial types

</RelatedLinks>
