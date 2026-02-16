---
sidebar_label: "Overview"
sidebar_position: 1
title: "Pithos vs Lodash, Zod & Neverthrow - Comparison Overview"
description: "A quick guide to Pithos modules: Arkhe (utilities), Kanon (validation), and Zygos (error handling) - when to use each and how they compare to alternatives"
keyword_stuffing_ignore:
  - want
---

import { QuickComparisonTable } from '@site/src/components/comparisons/QuickComparisonTable';
import Muted from '@site/src/components/shared/Muted';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Pithos vs Lodash, Zod & Neverthrow

Pithos is organized into five modules. Each solves a specific problem with minimal bundle impact.

---

## Quick Comparison

<QuickComparisonTable />

---

## ✅ When to Use Each Module

### <span className="module-name-heading">Arkhe</span> - Utility Functions

**Use [Arkhe](/guide/modules/arkhe/) when:**
- You want smaller bundles than Lodash
- You're building a modern app
- You want better TypeScript inference
- You care about supply chain security

<Muted>

Use Lodash instead when:
- You need IE11 support
- Your codebase already uses it heavily

</Muted>

:::info Migration
Many Lodash functions have native equivalents now. See [Taphos](/api/taphos) for guidance on what to replace with native JS vs Arkhe.
:::

<DashedSeparator noMarginBottom />

### <span className="module-name-heading">Kanon</span> - Schema Validation

**Use [Kanon](/guide/modules/kanon/) when:**
- You want smaller bundles than Zod
- You need straightforward, type-safe validation without overhead
- You want JIT-compiled validators for maximum performance
- You want zero dependencies
- You're already using Pithos

<Muted>

Use Zod instead when:
- You need complex transforms (`.transform()`)
- You need async validation
- You need extensive built-in format validators (IP, JWT, CUID, ULID...)
- You're already using it

</Muted>

<DashedSeparator noMarginBottom />

### <span className="module-name-heading">Zygos</span> - Error Handling

**Use [Zygos](/guide/modules/zygos/) when:**
- You want smaller bundles
- You also need Option/Either/Task monads
- You're already using Pithos
- You want generator-based error handling (`safeTry`)
- You want a drop-in Neverthrow replacement

<Muted>

Use Neverthrow instead when:
- If Neverthrow is your only Pithos use case, the migration cost may not justify it
- You want the "original" implementation

Use fp-ts instead when:
- You want full functional programming
- You need Functor, Applicative, Monad abstractions
- You're comfortable with Haskell-style FP
- You need `pipe` with full type class hierarchy

</Muted>

<DashedSeparator noMarginBottom />

### <span className="module-name-heading">Sphalma</span> - Typed Error Factories

**Use [Sphalma](/guide/modules/sphalma/) when:**
- You need structured, typed errors with hex codes
- You want consistent error identification across your codebase
- You're using Zygos and want typed error channels

<Muted>

Sphalma has no direct competitor — it fills a gap that most projects solve with ad-hoc error classes or plain strings.

</Muted>

<DashedSeparator noMarginBottom />

### <span className="module-name-heading">Taphos</span> - Native Equivalence

**Use [Taphos](/guide/modules/taphos/) when:**
- You're migrating away from Lodash
- You want to know which Arkhe functions have native equivalents
- You want deprecation guidance before removing a dependency

---

## The Pithos Philosophy

<details>
<summary>💡 <strong>Why kilobytes matter</strong> - "it's just a few kB, who cares?"</summary>

Every dependency adds up. Validation adds 20 kB. Dates add 15 kB. Utils add 25 kB. State adds 30 kB... Before you know it: **500+ kB of JavaScript** that the browser has to download, parse, and execute.

This directly affects user experience. Every extra kilobyte of JavaScript increases parse and execution time, which may impact [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), particularly **LCP** (Largest Contentful Paint) and **INP** (Interaction to Next Paint). On mobile devices and slower connections, the difference is even more noticeable.

Less code also means a smaller attack surface: fewer lines to audit, fewer places for vulnerabilities to hide.

That's why every Pithos module is designed to ship only what you actually use.

</details>

We're not trying to replace everything. We're trying to:

1. <span style={{color: '#e67e22', fontWeight: 600}}>**Cover 80% of needs**</span> with minimal bundle impact
2. <span style={{color: '#e67e22', fontWeight: 600}}>**Stay compatible**</span> where it matters (Neverthrow API, Zod shim)
3. <span style={{color: '#e67e22', fontWeight: 600}}>**Point to native**</span> when JavaScript caught up (Taphos)
4. <span style={{color: '#e67e22', fontWeight: 600}}>**Stay honest**</span> about when other libs are better

Use what works for you. Mix and match if needed.

<RelatedLinks>
- [Arkhe vs Lodash — Full comparison](./arkhe/arkhe-vs-lodash.md)
- [Kanon vs Zod — Full comparison](./kanon/kanon-vs-zod.md)
- [Zygos vs Neverthrow — Full comparison](./zygos/zygos-vs-neverthrow.md)
- [Equivalence Table — All modules side by side](./equivalence-table.md)
- [Reproduce Our Data](./reproduce.md)
</RelatedLinks>
