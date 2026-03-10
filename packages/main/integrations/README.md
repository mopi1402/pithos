# Pithos / Integration Demos

This directory contains standalone demo applications that demonstrate how `@pithos/core` integrates natively into any TypeScript framework. No adapters, no plugins, no wrappers.

Each demo implements the same **Book Collection Manager** app: a form to add books (with validation, normalization, duplicate detection) and a page to browse the collection (grouped by genre, sorted by date). Same features, same Pithos modules, different framework.

The goal is simple: if it works the same way in Next.js, Nuxt, SvelteKit, and everywhere else, then Pithos is truly framework-agnostic.

Each demo deliberately uses every module to show all integration points at once. A real project would only pick the modules it needs, and apply stricter error handling only where it hurts most.

## Pithos modules covered

Every demo uses all 5 modules from the Pithos ecosystem:

| Module | What it does in the demo |
|---|---|
| **Kanon** | Shared validation schema (client + server) |
| **Zygos** | `Result<T, E>` via the `ensure` bridge |
| **Arkhe** | `titleCase`, `groupBy`, `orderBy`, `SimpleResult` type |
| **Sphalma** | Typed business errors (duplicate ISBN, not found, storage failure) |
| **Bridge ensure** | Kanon → Zygos: validates a schema, returns a `Result` |

## Demos

| Framework | Directory | Status | Highlights |
|---|---|---|---|
| Angular | `angular/` | 🔜 Planned | |
| Bun | `bun/` | 🔜 Planned | Server only |
| Express | `express/` | 🔜 Planned | Server only |
| [Hono](./hono/) | `hono/` | ✅ Complete | Server only (see below) |
| [Next.js](./nextjs/) | `nextjs/` | ✅ Complete | Client + Server (see below) |
| Nuxt | `nuxt/` | 🔜 Planned | |
| Preact | `preact/` | 🔜 Planned | |
| React | `react/` | 🔜 Planned | |
| SvelteKit | `sveltekit/` | 🔜 Planned | |

## General design choices

### Why Result types?

Using `Result<T, E>` after validation is less common in JS/TS but standard in Rust, Kotlin, and FP. It's an architectural choice like TDD or clean architecture - not mandatory, but it removes a class of unhandled-error bugs. Every module is independent, so you can use Kanon alone if that's all you need.

### Direct imports vs barrel

Every demo uses direct imports by default:

```ts
import { string } from '@pithos/core/kanon/schemas/primitives/string'
import { object } from '@pithos/core/kanon/schemas/composites/object'
```

Kanon also exposes a barrel at `@pithos/core/kanon` for a more compact DX:

```ts
import { string, object, optional, coerceDate } from '@pithos/core/kanon'
```

Both work. The barrel adds a few kilobytes of overhead from extra module wrappers and metadata that bundlers can't fully eliminate, even with tree-shaking. On lightweight frameworks like Svelte or Preact where every byte matters, direct imports are the way to go. On React/Next.js where the runtime already weighs hundreds of kilobytes, the difference is just noise.

Your call.

### Validate at boundaries, trust types inside

The demos validate data where it enters the system (user input in Server Actions, request body in Route Handlers), then trust TypeScript from that point on.

The `ensurePromise` pipeline in `lib/api/books.ts` also validates API **responses** - catching silent shape mismatches that TypeScript can't see at runtime. In a Next.js monolith where you control both sides, this is a deliberate choice. In practice, `ensurePromise` becomes essential when the frontend and backend are separate codebases and you can't trust what the server sends.

### SimpleResult vs Zygos Result

The demos use two different patterns for success/failure depending on context:

- **Zygos `Result<T, E>`** (via `ensure`): for validation flows where you need type-safe chaining (`.map()`, `.mapErr()`, `.isErr()`). This is the right tool when the result carries a typed value you want to transform.
- **Arkhe `SimpleResult`**: a plain `{ ok: true } | { ok: false, error: string }` type for simple operations like storage writes where you just need pass/fail with an error message. No chaining, no generics, no import overhead from Zygos.

Use `Result` when you need to chain or transform the outcome, `SimpleResult` when you just need pass/fail.

## What each demo showcases

### Next.js (client + server)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `add/_actions/add-book.ts`, `hooks/use-book-validation.ts` | `ensure` for form validation (server + client per-field) |
| **Kanon** | `lib/schemas/book.ts`, `lib/api/books.ts` | Schema definition, `.pattern()` for ISBN validation, shared client/server schemas |
| **Sphalma** | `api/books/route.ts` | `CodedError` thrown server-side (duplicate ISBN, not found, storage failure), serialized as structured JSON |
| **Zygos** | `lib/api/books.ts` | `ensurePromise` bridge: fetch → validate → `ResultAsync` pipeline |

The app also uses **Arkhe** for everyday data transforms: `groupBy` and `orderBy` in `hooks/use-grouped-books.ts`, `titleCase` in `add/_actions/add-book.ts`.

#### Architecture

```
nextjs/app/
├── api/books/           ← Route Handlers (backend)
│   ├── route.ts         ← GET / POST / DELETE with Sphalma errors
│   ├── store.ts         ← In-memory storage
│   ├── chaos/route.ts   ← Toggle simulated failures
│   └── seed/route.ts    ← Populate store with sample data
├── add/                 ← Add book page
│   ├── _actions/        ← Server Action (ensure + postBook)
│   └── _components/     ← Form + field components
├── collection/          ← Collection page
│   ├── _actions/        ← Remove / clear / seed Server Actions
│   └── _components/     ← Book list, remove, clear & seed buttons
├── hooks/               ← Client hooks (validation, grouping, server action)
├── lib/
│   ├── api/             ← API client (ensurePromise pipeline) + base URL helper
│   ├── errors/          ← Sphalma error factory + codes
│   ├── fixtures.ts      ← Sample book data for seeding
│   ├── schemas/         ← Kanon schemas (shared client/server)
│   └── types.ts         ← Discriminated union types
└── _components/         ← Chaos mode toggle
```

#### Why `COLLECTION_LIMIT` only exists here

The Next.js demo originally stored books in a browser cookie. Cookies are capped at ~4 KB, so a `COLLECTION_LIMIT` CodedError (`0x9002`) was needed to reject writes before the cookie overflowed. Server-only demos (Hono, Express, Bun) use an in-memory store with no practical size limit, so this error code doesn't apply there.

#### Chaos mode

Click the "Chaos mode" button in the nav bar to simulate an unreliable backend. When enabled, POST and DELETE requests will fail with a `STORAGE_FAILURE` CodedError (HTTP 503). GET is intentionally excluded so the collection page always renders cleanly. This lets you see how Sphalma errors propagate from the Route Handler through the API client to the UI without Next.js showing an error screen.

#### Commands

```bash
cd packages/main/integrations/nextjs
pnpm install
pnpm dev        # http://localhost:3000
```

### Hono (server only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `src/routes/books.ts`, `src/routes/chaos.ts` | `ensure` for payload validation (bookSchema, chaosSchema) |
| **Kanon** | `src/lib/schemas.ts` | Schema definition, `.pattern()` for ISBN validation, `chaosSchema` for type-safe chaos payload |
| **Sphalma** | `src/lib/errors.ts`, `src/lib/error-handler.ts` | `CodedError` thrown in routes, serialized via centralized `app.onError` handler |
| **Zygos** | `src/routes/books.ts`, `src/routes/chaos.ts` | `Result<T, E>` from `ensure` bridge for validation outcomes |

The app also uses **Arkhe** for data transforms: `titleCase` in `src/routes/books.ts`, `groupBy` and `orderBy` in `src/routes/collection.ts`.

#### Architecture

```
hono/src/
├── index.ts             ← Entry point (starts server on port 3001)
├── app.ts               ← Hono app, error handler, route mounting
├── routes/
│   ├── books.ts         ← GET / POST / DELETE with Sphalma errors
│   ├── chaos.ts         ← Toggle simulated failures (Kanon-validated)
│   ├── collection.ts    ← Grouped collection (groupBy + orderBy)
│   └── seed.ts          ← Populate store with sample data
└── lib/
    ├── schemas.ts       ← Kanon schemas (book, storedBook, chaos)
    ├── errors.ts        ← Sphalma error factory + codes
    ├── error-handler.ts ← Centralized app.onError handler
    ├── store.ts         ← In-memory storage (module-level, no globalThis)
    └── fixtures.ts      ← Sample book data for seeding
```

#### Key differences from Next.js

- **Centralized error handling**: Uses Hono's `app.onError` with a declarative code→status mapping instead of try/catch in each route
- **No globalThis hack**: Module-level state (Hono has no HMR, so no need for the `globalThis as unknown as ...` pattern)
- **Type-safe chaos validation**: Uses `ensure(chaosSchema, body)` instead of manual `typeof` checks with `as` casts
- **Server-side collection grouping**: `groupBy` + `orderBy` runs server-side (in Next.js, this is done client-side in a React hook)

#### Commands

```bash
cd packages/main/integrations/hono
pnpm install
pnpm dev        # http://localhost:3001
pnpm test       # vitest (unit + property-based tests)
pnpm test:api   # starts the server, runs 22 curl checks, stops the server
```

### Express / Bun (planned, server only)

- Same validation, normalization, and error handling as Next.js server-side
- No client code: useful if you only need Pithos in an API layer

## Running a demo

Each demo is a self-contained project with its own `package.json`. From any demo directory:

```bash
pnpm install
pnpm dev
```

The only runtime dependency beyond the framework itself is `@pithos/core`.

## Adding a new demo

1. Create a new directory under `integrations/` (e.g. `nuxt/`)
2. Scaffold the framework's starter project
3. Implement the Book Collection Manager using the same Pithos modules
4. Update the tables and sections above
