---
sidebar_label: "Native Equivalence"
sidebar_position: 3
title: "Taphos — Native Equivalence"
description: "Native equivalence levels for each Taphos utility function: direct native API, composition of native APIs, or custom reimplementation"
---

import { NativeEquivalenceList } from '@site/src/components/comparisons/taphos/NativeEquivalence';

# 🟰 Native Equivalence

Every Taphos function is `@deprecated` by design: The goal is to migrate to native JavaScript. But not all functions have a direct native equivalent. This page classifies each function by its **native equivalence level**.

## Equivalence Levels

| Level | Meaning |
|-------|---------|
| 🟢 **Native API** | A direct native equivalent exists. You can replace the function with a single native call. |
| 🟡 **Composition** | No single native call, but achievable by composing a few native APIs together. |
| 🔴 **Custom** | No real native equivalent. The function implements logic that doesn't exist natively. |

## Behavioral Differences

Some functions marked 🟢 or 🟡 have a native equivalent, but with **subtle behavioral differences** between taphos/lodash and the native implementation. These are marked with ⚠️. Click on them to see the details.

These differences are intentional. Taphos aligns with modern JavaScript semantics rather than replicating every Lodash edge case. If Lodash returns `true` for `isNaN(new Number(NaN))` but `Number.isNaN` doesn't, that's not a bug, that's the web moving forward.

:::tip
In most real-world code, these differences don't matter. The ⚠️ is there so you can make an informed decision, not to scare you away from migrating.
:::

## Functions by Level

<NativeEquivalenceList />
