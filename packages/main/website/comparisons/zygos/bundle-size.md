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
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 📦 Zygos Bundle Size

Real numbers. No marketing fluff. **Data auto-generated on <ZygosGeneratedDate />.**

## TL;DR

<ZygosBundleSummary />

---

## Result Pattern (vs Neverthrow)

Individual module sizes, minified + gzipped. Zygos is the baseline.

<ZygosResultBundleTable />

<DashedSeparator />

Zygos is **100% API compatible** with Neverthrow, making migration seamless:

```typescript
// Change this:
import { ok, err, Result, ResultAsync } from "neverthrow";

// To this:
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Your code works unchanged
```

---

## FP Monads (vs fp-ts)

<ZygosFpBundleTable />

<DashedSeparator noMarginBottom />

### Philosophy Difference

While fp-ts relies on `pipe` and module-level functions, Zygos uses a fluent chainable API that feels more natural in TypeScript:

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
import { ok } from "pithos/zygos/result/result";

ok(5)
  .map(x => x * 2)
  .match(
    a => `Result: ${a}`,
    e => `Error: ${e}`
  );
```

---

## Combined Comparison

Full library bundles when importing all modules.

<ZygosCombinedBundleTable />

---

## Why the Difference?

**fp-ts** provides a complete functional programming toolkit with Functor, Applicative, Monad abstractions. If you only need Result/Either for error handling, you're shipping unused code.

**Neverthrow** is focused on the Result pattern but still carries some overhead from its class-based implementation. Importing any function pulls in the full library.

**Zygos** is designed from the ground up for tree-shaking. Each function is standalone, so you only ship what you use.

---

## Reproduce These Results

Want to verify these results? See [how to reproduce our data](../reproduce.md).

---

## Zero Dependencies

Every kilobyte you add from Pithos is pure Pithos code: there are no transitive dependencies and no hidden packages pulled into your node_modules. You can verify this yourself by inspecting the dependency tree:

```bash
# Pithos dependency tree
pithos (varies by import)
└── (nothing else)
```

This also means **zero supply chain risk** from third-party packages.

<ZygosVersionInfo />

---

<RelatedLinks>

- [Zygos vs Neverthrow](./zygos-vs-neverthrow.md) — Full comparison: philosophy, API, migration
- [Kanon — Bundle Size](../kanon/bundle-size.md) — Validation library size comparison
- [Arkhe — Bundle Size](../arkhe/bundle-size.md) — Utility function size comparison
- [Zygos Module Guide](/guide/modules/zygos/) — Full module documentation

</RelatedLinks>
