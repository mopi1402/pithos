---
sidebar_label: "Bundle Size"
sidebar_position: 1
title: "Zygos Bundle Size Comparison"
description: "Compare Pithos Zygos bundle size with Neverthrow, fp-ts and other Result/Either libraries"
---

import {
  ZygosResultBundleTable,
  ZygosFpBundleTable,
  ZygosCombinedBundleTable,
  ZygosBundleSummary,
  ZygosGeneratedDate,
  ZygosVersionInfo,
} from '@site/src/components/comparisons/zygos/BundleSizeTable';

# 📦 Zygos Bundle Size

Real numbers. No marketing fluff. **Data auto-generated on <ZygosGeneratedDate />.**

## TL;DR

<ZygosBundleSummary />

## Result Pattern (vs Neverthrow)

Individual module sizes, minified + gzipped. Zygos is the baseline (gold).

<ZygosResultBundleTable />

Zygos is **100% API compatible** with Neverthrow, making migration seamless:

```typescript
// Change this:
import { ok, err, Result, ResultAsync } from "neverthrow";

// To this:
import { ok, err, Result, ResultAsync } from "pithos/zygos/result";

// Your code works unchanged
```

## FP Monads (vs fp-ts)

<ZygosFpBundleTable />

### Philosophy Difference

```typescript
// fp-ts style
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

pipe(
  E.right(5),
  E.map(x => x * 2),
  E.fold(
    e => `Error: ${e}`,
    a => `Result: ${a}`
  )
);

// Zygos style
import { ok } from "pithos/zygos/result";

ok(5)
  .map(x => x * 2)
  .match(
    a => `Result: ${a}`,
    e => `Error: ${e}`
  );
```

## Combined Comparison

Full library bundles when importing all modules.

<ZygosCombinedBundleTable />

## Why the Difference?

**fp-ts** provides a complete functional programming toolkit with Functor, Applicative, Monad abstractions. If you only need Result/Either for error handling, you're shipping unused code.

**Neverthrow** is focused on the Result pattern but still carries some overhead from its class-based implementation. Importing any function pulls in the full library.

**Zygos** is designed from the ground up for tree-shaking. Each function is standalone, so you only ship what you use.

## Measure It Yourself

```bash
# Using esbuild
echo 'import { ok, err } from "pithos/zygos/result"' | \
  esbuild --bundle --minify | gzip -c | wc -c

# Regenerate this data
pnpm doc:generate-zygos-bundle-sizes
```

## Zero Dependencies

Every KB you add from Pithos is Pithos code. No transitive dependencies, no surprises:

```bash
# Pithos dependency tree
pithos (varies by import)
└── (nothing else)
```

This also means **zero supply chain risk** from third-party packages.

<ZygosVersionInfo />
