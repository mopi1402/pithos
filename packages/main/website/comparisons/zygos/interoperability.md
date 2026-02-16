---
sidebar_label: "Interoperability"
sidebar_position: 3
title: "Zygos ↔ Neverthrow Interoperability"
description: "Compare Zygos Result and Neverthrow APIs: 100% compatible, drop-in replacement, with additional features"
---

import { Accordion } from '@site/src/components/shared/Accordion';
import { Code } from '@site/src/components/shared/Code';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';


# ⛓️‍💥 Zygos ↔ Neverthrow Interoperability

Real compatibility data. No guesswork. **Analyzed against Neverthrow 8.2.0.**

## TL;DR

**100% API compatible.** Zygos Result is a drop-in replacement for Neverthrow with identical API and behavior.

| Metric | Value |
|--------|-------|
| **Result API** | 100% compatible |
| **ResultAsync API** | 100% compatible |
| **Bundle Size** | <ZygosSizeHighlight type="full" /> |
| **Migration Effort** | Import change only |

:::tip[Bottom line]
Change your import from `neverthrow` to `pithos/zygos/result/result` and you're done. **Zero code changes required.**
:::

---

## About Zygos Result

Zygos Result is a micro implementation of Neverthrow's Result type that is:
- **<ZygosSizeHighlight type="full" />** than Neverthrow 8.2.0
- **100% API compatible** - can be seamlessly replaced without code changes
- **Zero `any` types** for better type safety

```typescript
// Just swap your import
// Before
import { ok, err, Result, ResultAsync } from "neverthrow";

// After
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Your existing code works as-is
```

---

## ✅ Full API Compatibility

Click to expand each category and see the supported features:

<Accordion title="Result Constructors (100%)" badge="2/2">

<Code>ok(value)</Code>, <Code>err(error)</Code>

```typescript
import { ok, err, Result } from "pithos/zygos/result/result";

const success: Result<number, string> = ok(42);
const failure: Result<number, string> = err("Something went wrong");
```

</Accordion>

<Accordion title="Result Methods (100%)" badge="7/7">

<Code>.isOk()</Code>, <Code>.isErr()</Code>, <Code>.map()</Code>, <Code>.mapErr()</Code>, <Code>.andThen()</Code>, <Code>.unwrapOr()</Code>, <Code>.match()</Code>

```typescript
const result = ok(5)
  .map(x => x * 2)           // Transform success value
  .mapErr(e => `Error: ${e}`) // Transform error value
  .andThen(x => x > 0 ? ok(x) : err("negative")); // Chain operations

const value = result.unwrapOr(0); // Get value or default

const message = result.match(
  value => `Success: ${value}`,
  error => `Error: ${error}`
);
```

</Accordion>

<Accordion title="Result Static Methods (100%)" badge="2/2">

<Code>Result.fromThrowable()</Code>, <Code>Result.combine()</Code>

```typescript
// Wrap throwing functions
const safeParse = Result.fromThrowable(
  JSON.parse,
  (error) => `Parse error: ${error}`
);

const result = safeParse('{"valid": "json"}'); // Ok({valid: "json"})
const error = safeParse('invalid'); // Err("Parse error: ...")

// Combine multiple Results
const combined = Result.combine([ok(1), ok(2), ok(3)]); // Ok([1, 2, 3])
const withError = Result.combine([ok(1), err("fail"), ok(3)]); // Err("fail")
```

</Accordion>

<Accordion title="ResultAsync Constructors (100%)" badge="2/2">

<Code>okAsync()</Code>, <Code>errAsync()</Code>

```typescript
import { okAsync, errAsync, ResultAsync } from "pithos/zygos/result/result-async";

const asyncSuccess = okAsync(Promise.resolve(42));
const asyncError = errAsync("network error");
```

</Accordion>

<Accordion title="ResultAsync Methods (100%)" badge="7/7">

<Code>.map()</Code>, <Code>.mapErr()</Code>, <Code>.andThen()</Code>, <Code>.unwrapOr()</Code>, <Code>.match()</Code>, <Code>.orElse()</Code>, <Code>.then()</Code>

```typescript
const result = await okAsync(Promise.resolve(5))
  .map(x => x * 2)
  .andThen(x => okAsync(Promise.resolve(x.toString())));

// Pattern matching
const message = await result.match(
  value => `Success: ${value}`,
  error => `Error: ${error}`
);

// Fallback on error
const withFallback = await errAsync("error")
  .orElse(() => okAsync("fallback"));
```

</Accordion>

<Accordion title="ResultAsync Static Methods (100%)" badge="4/4">

<Code>ResultAsync.fromPromise()</Code>, <Code>ResultAsync.fromSafePromise()</Code>, <Code>ResultAsync.fromThrowable()</Code>, <Code>ResultAsync.combine()</Code>

```typescript
// From potentially failing Promise
const result = ResultAsync.fromPromise(
  fetch('/api/data'),
  (error) => `Fetch failed: ${error}`
);

// From safe Promise (won't reject)
const safe = ResultAsync.fromSafePromise(Promise.resolve(42));

// Wrap async throwing functions
const safeFetch = ResultAsync.fromThrowable(
  async (url: string) => {
    const res = await fetch(url);
    return res.json();
  },
  (error) => `Request failed: ${error}`
);

// Combine multiple async Results
const combined = ResultAsync.combine([
  okAsync(1),
  okAsync(2),
  okAsync(3)
]); // Ok([1, 2, 3])
```

</Accordion>

<Accordion title="safeTry (100%)" badge="1/1">

<Code>safeTry()</Code>

```typescript
import { safeTry, ok, err } from "pithos/zygos/result/result";

// With generator function
const result = safeTry(function* () {
  yield err("validation failed");
  return ok(42);
});

// With direct function
const direct = safeTry(() => ok(42));
```

</Accordion>

---

## ✨ What Zygos adds

Beyond Neverthrow compatibility, Zygos brings unique features:

<TableConfig noEllipsis>

| Feature | Description |
|---------|-------------|
| 📦 **<ZygosSizeHighlight type="ratio" />** | <ZygosSizeHighlight type="sizes" /> |
| 🔒 **Zero `any` Types** | Better type safety with `unknown` types |
| 🔄 **fp-ts Bridges** | Convert to/from Option and Either |
| ⚡️ **safeAsyncTry** | Simplified async error handling |
| 🎯 **combineWithAllErrors** | Collect all errors instead of stopping at first |

</TableConfig>

<DashedSeparator noMarginBottom />

### fp-ts Interoperability

Zygos provides bridges to convert between Result and fp-ts types:

```typescript
import { 
  fromOption, 
  fromEither, 
  toEither,
  ok, 
  err 
} from "pithos/zygos/result/result";

// Option → Result
const someOption = { _tag: "Some", value: 42 };
const noneOption = { _tag: "None" };

const fromSome = fromOption(() => "No value")(someOption); // Ok(42)
const fromNone = fromOption(() => "No value")(noneOption); // Err("No value")

// Either → Result
const rightEither = { _tag: "Right", right: 42 };
const leftEither = { _tag: "Left", left: "error" };

const fromRight = fromEither(rightEither); // Ok(42)
const fromLeft = fromEither(leftEither);   // Err("error")

// Result → Either
const okResult = ok(42);
const errResult = err("error");

const toRight = toEither(okResult); // { _tag: "Right", right: 42 }
const toLeft = toEither(errResult); // { _tag: "Left", left: "error" }
```

<DashedSeparator noMarginBottom />

### safeAsyncTry

Simplified async error handling without generators:

```typescript
import { safeAsyncTry } from "pithos/zygos/result/result";

const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

const result = await safeAsyncTry(() => fetchUser("123"));

if (result.isOk()) {
  console.log(result.value); // User data
} else {
  console.log(result.error); // Error details
}
```

<DashedSeparator noMarginBottom />

### combineWithAllErrors

Collect all errors instead of stopping at the first one:

```typescript
import { ResultAsync, okAsync, errAsync } from "pithos/zygos/result/result-async";

const results = [
  okAsync(1),
  errAsync("error1"),
  okAsync(3),
  errAsync("error2")
];

const combined = ResultAsync.combineWithAllErrors(results);
const resolved = await combined;
// Err(["error1", "error2"]) - collects ALL errors
```

<MigrationCTA module="Zygos" guideLink="/guide/modules/zygos/#migrating-from-neverthrow-or-fp-ts" guideDescription="install, swap imports, and start using additional features" />

---

## Why choose Zygos over Neverthrow?

| Aspect | Zygos | Neverthrow |
|--------|-------|------------|
| **Bundle Size** | <ZygosSizeHighlight type="zygos-size" /> (<ZygosSizeHighlight type="ratio" />) | <ZygosSizeHighlight type="nev-size" /> |
| **Type Safety** | Zero `any` types | Uses `any` in some places |
| **fp-ts Bridges** | ✅ fromOption, fromEither, toEither | ❌ |
| **safeAsyncTry** | ✅ Simplified async handling | ❌ |
| **combineWithAllErrors** | ✅ | ✅ |
| **API Compatibility** | 100% drop-in replacement | - |

:::tip[Recommendation]
If you're already using Neverthrow, switching to Zygos is straightforward: same API, smaller bundle, better types, and additional features. Just change your imports.
:::

---

<RelatedLinks>

- [Zygos vs Neverthrow](./zygos-vs-neverthrow.md) — Full comparison: philosophy, API, migration
- [Kanon ↔ Zod Interoperability](../kanon/interoperability.md) — Another migration compatibility story
- [Equivalence Table](/comparisons/equivalence-table/) — Full library equivalence across all modules
- [Zygos Module Guide](/guide/modules/zygos/) — Full module documentation

</RelatedLinks>
