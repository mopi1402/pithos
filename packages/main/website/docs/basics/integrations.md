---
sidebar_position: 4.2
title: "Integrations"
description: "Pithos integrates seamlessly into your stack: React, Angular, Preact, Next.js, Nuxt, SvelteKit, Express, Hono or Bun."
slug: integrations
---

import ResponsiveMermaid from "@site/src/components/shared/ResponsiveMermaid";
import ModuleName from "@site/src/components/shared/badges/ModuleName";
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';

# 🔌 Integrations

Pithos is **framework-agnostic**. One package, zero adapters, zero plugins. You import what you need, and it works, regardless of your stack.

Because every technology serves a different purpose, we wrote several Pithos integrations with the most common stacks to show how it can fit in without friction. These pages are here to help you understand how to use it in harmony with your favorite tech.

No need to convince you that Pithos is framework-agnostic... these integrations speak for themselves.

:::tip[Philosophy]
Pithos **fills the gaps, it does not replace what already exists**. When a framework already handles a feature natively, we use it. For example:
- **Angular**: we use `HttpClient` for network calls, then wrap the result in `ResultAsync` for validation
- **SvelteKit**: we use native `fail()` and `error()` for error handling, Sphalma is not needed
- **Nuxt**: we rely on `createError` and native server routes

The goal is never to reinvent the wheel, but to integrate in the most natural way possible.
:::

---

## Frontend (SPA)

Client-only applications that communicate with a backend via `fetch`.

| Tech | Pithos | Native |
|------|--------|--------|
| **[React](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/react)** | Validation, async pipeline, sorting and grouping | State management, routing, rendering |
| **[Angular](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/angular)** | API response validation, data normalization | `HttpClient`, Signals, Reactive Forms, DI |
| **[Preact](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/preact)** | Same pipeline as React, minimal bundle (~3 KB) | Hooks, rendering |

## Fullstack (SSR)

Frameworks with server-side rendering. The Kanon schema is shared between client and server, a single source of truth.

| Tech | Pithos | Native |
|------|--------|--------|
| **[Next.js](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/nextjs)** | Validation in Server Actions, normalization | App Router, Server Components, `useActionState` |
| **[Nuxt](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/nuxt)** | Validation in server routes, sorting composables | Auto-imports, `createError`, `defineEventHandler` |
| **[SvelteKit](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/sveltekit)** | Validation in form actions, load functions | `fail()`, `error()`, Svelte 5 runes |

## Backend

Pure API servers. Pithos handles input validation and normalization.

| Tech | Pithos | Native |
|------|--------|--------|
| **[Express](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/express)** | Validation, normalization, structured business errors (`CodedError`) | Routing, middleware, `ErrorRequestHandler` |
| **[Hono](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/hono)** | Same pipeline as Express | `app.onError`, routing |
| **[Bun](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/bun)** | Same pipeline, zero framework | `Bun.serve()`, Web Standards API |

---

## The common pattern

Regardless of the framework, the pipeline stays the same:

1. **Validate** inputs with <ModuleName name="Kanon" to="/guide/modules/kanon/" /> via [`ensure`](/api/bridges/ensure/) or [`ensurePromise`](/api/bridges/ensurePromise/)
2. **Normalize** data with <ModuleName name="Arkhe" to="/guide/modules/arkhe/" /> ([`capitalize`](/api/arkhe/string/capitalize), [`titleCase`](/api/arkhe/string/titlecase), [`groupBy`](/api/arkhe/array/groupBy), [`orderBy`](/api/arkhe/array/orderBy))
3. **Handle errors** with <ModuleName name="Zygos" to="/guide/modules/zygos/" /> ([`Result`](/api/zygos/result/), [`ResultAsync`](/api/zygos/result/ResultAsync)) or the framework's native mechanisms
4. **Structure business errors** with <ModuleName name="Sphalma" to="/guide/modules/sphalma/" /> when the framework has no built-in equivalent

<DashedSeparator noMarginBottom />
<br />

<ResponsiveMermaid
  desktop={`graph LR
    A[User input] --> B["ensure
    (schema, data)"]
    B -->|Error| C["capitalize,\ntitleCase"]
    C --> D[Storage]
    B -->|Success| E[Error message]
    D --> F["groupBy\n + orderBy"]
    F --> G[Display]
    linkStyle 1 stroke:#16a34a
    linkStyle 3 stroke:#dc2626
    style C fill:#dcfce7,stroke:#16a34a,color:#166534
    style D fill:#dcfce7,stroke:#16a34a,color:#166534
    style F fill:#dcfce7,stroke:#16a34a,color:#166534
    style G fill:#dcfce7,stroke:#16a34a,color:#166534
    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b`}
/>

<DashedSeparator noMarginBottom />
<br />

:::info[Full source code]
Each integration is a fully functional app with tests. The frontend and backend demos are interchangeable: you can combine any frontend (React, Angular, Preact) with any backend (Express, Hono, Bun), they share the same API contract. Explore the code in [`packages/main/integrations/`](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations).
:::
