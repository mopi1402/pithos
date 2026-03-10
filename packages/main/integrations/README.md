# Pithos / Integration Demos

This directory contains standalone demo applications that demonstrate how `@pithos/core` integrates natively into any TypeScript framework. No adapters, no plugins, no wrappers.

Each demo implements the same **Book Collection Manager** app: a form to add books (with validation, normalization, duplicate detection) and a page to browse the collection (grouped by genre, sorted by date). Same features, same Pithos modules, different framework.

The goal is simple: if it works the same way in Next.js, Nuxt, SvelteKit, and everywhere else, then Pithos is truly framework-agnostic.

Each demo deliberately uses every module to show all integration points at once. A real project would only pick the modules it needs, and apply stricter error handling only where it hurts most.

## Pithos modules covered

Each demo picks the modules that make sense for its architecture. The full ecosystem includes:

| Module | What it does in the demo |
|---|---|
| **Kanon** | Shared validation schema (client + server) |
| **Zygos** | `Result<T, E>` via the `ensure` bridge |
| **Arkhe** | `titleCase`, `groupBy`, `orderBy`, `SimpleResult` type |
| **Sphalma** | Typed business errors (duplicate ISBN, not found, storage failure) |
| **Bridge ensure** | Kanon → Zygos: validates a schema, returns a `Result` |
| **Bridge ensurePromise** | Kanon → Zygos: validates a promise, returns a `ResultAsync` |

Kanon, Zygos, Arkhe, and Bridge ensure are used everywhere. Sphalma is used where the framework lacks native structured error handling (Hono, Express, Preact, Angular). SvelteKit skips it because `fail()` and `error()` already fill that role. `ensurePromise` only appears in demos with a client-side API layer (Next.js, Preact, Angular).

## Demos

| Framework | Directory | Status | Highlights |
|---|---|---|---|
| [Angular](./angular/) | `angular/` | ✅ Complete | Client only ([details](#angular-client-only)) |
| [Bun](./bun/) | `bun/` | ✅ Complete | Server only ([details](#bun-server-only)) |
| [Express](./express/) | `express/` | ✅ Complete | Server only ([details](#express-server-only)) |
| [Hono](./hono/) | `hono/` | ✅ Complete | Server only ([details](#hono-server-only)) |
| [Next.js](./nextjs/) | `nextjs/` | ✅ Complete | Client + Server ([details](#nextjs-client--server)) |
| Nuxt | `nuxt/` | 🔜 Planned | |
| [Preact](./preact/) | `preact/` | ✅ Complete | Client only ([details](#preact-client-only)) |
| React | `react/` | 🔜 Planned | |
| [SvelteKit](./sveltekit/) | `sveltekit/` | ✅ Complete | Client + Server ([details](#sveltekit-client--server)) |

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

### Bun (server only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `src/routes/books.ts`, `src/routes/chaos.ts` | `ensure` for payload validation (bookSchema, chaosSchema) |
| **Kanon** | `src/lib/schemas.ts` | Schema definition, `.pattern()` for ISBN validation, `chaosSchema` for type-safe chaos payload |
| **Sphalma** | `src/lib/errors.ts`, `src/lib/error-handler.ts` | `CodedError` thrown in routes, serialized via centralized `try/catch` in the dispatcher |
| **Zygos** | `src/routes/books.ts`, `src/routes/chaos.ts` | `Result<T, E>` from `ensure` bridge for validation outcomes |

The app also uses **Arkhe** for data transforms: `titleCase` in `src/routes/books.ts`, `groupBy` and `orderBy` in `src/routes/collection.ts`.

#### Architecture

```
bun/src/
├── index.ts             ← Entry point (Bun.serve on port 3001)
├── app.ts               ← Hand-rolled router/dispatcher (no framework)
├── routes/
│   ├── books.ts         ← GET / POST / DELETE with Sphalma errors
│   ├── chaos.ts         ← Toggle simulated failures (Kanon-validated)
│   ├── collection.ts    ← Grouped collection (groupBy + orderBy)
│   └── seed.ts          ← Populate store with sample data
└── lib/
    ├── schemas.ts       ← Kanon schemas (book, storedBook, chaos)
    ├── errors.ts        ← Sphalma error factory + codes
    ├── error-handler.ts ← Centralized error handler (CodedError → Response)
    ├── store.ts         ← In-memory storage (module-level, no globalThis)
    └── fixtures.ts      ← Sample book data for seeding
```

#### Key differences from Hono

- **No framework**: Uses `Bun.serve()` with a hand-rolled dispatcher instead of Hono's router. The route table is a plain `Record<string, Partial<Record<string, RouteHandler>>>` mapping paths and methods to handler functions.
- **Direct `Response` construction**: Handlers return `Response.json(data, { status })` and `new Response(null, { status: 204 })` directly instead of using Hono's `c.json()` context.
- **Manual CORS**: CORS headers are added by the dispatcher on every response instead of using Hono's built-in `cors()` middleware.
- **`try/catch` in dispatcher**: Error handling wraps each handler call in the dispatcher's `try/catch` instead of using Hono's `app.onError()` hook.
- **Zero TypeScript casts**: No `as` assertions in production code (except `as const`). All types flow from Kanon schemas via `Infer<>` and `ensure`.
- **Same lib modules**: `schemas.ts`, `errors.ts`, `store.ts`, `fixtures.ts` are identical to the Hono demo — only route handlers and the error handler differ.

#### Commands

```bash
cd packages/main/integrations/bun
bun install
bun dev         # http://localhost:3001
bun test        # vitest (unit + property-based tests)
```

### Express (server only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `src/routes/books.ts`, `src/routes/chaos.ts` | `ensure` for payload validation (bookSchema, chaosSchema) |
| **Kanon** | `src/lib/schemas.ts` | Schema definition, `.pattern()` for ISBN validation, `chaosSchema` for type-safe chaos payload |
| **Sphalma** | `src/lib/errors.ts`, `src/lib/error-handler.ts` | `CodedError` thrown in routes, serialized via centralized ErrorMiddleware |
| **Zygos** | `src/routes/books.ts`, `src/routes/chaos.ts` | `Result<T, E>` from `ensure` bridge for validation outcomes |

The app also uses **Arkhe** for data transforms: `titleCase` in `src/routes/books.ts`, `groupBy` and `orderBy` in `src/routes/collection.ts`.

#### Architecture

```
express/src/
├── index.ts             ← Entry point (starts server on port 3001)
├── app.ts               ← Express app, middleware, route mounting
├── routes/
│   ├── books.ts         ← GET / POST / DELETE with Sphalma errors
│   ├── chaos.ts         ← Toggle simulated failures (Kanon-validated)
│   ├── collection.ts    ← Grouped collection (groupBy + orderBy)
│   └── seed.ts          ← Populate store with sample data
└── lib/
    ├── schemas.ts       ← Kanon schemas (book, storedBook, chaos)
    ├── errors.ts        ← Sphalma error factory + codes
    ├── error-handler.ts ← Centralized ErrorMiddleware (4-argument)
    ├── store.ts         ← In-memory storage (module-level, no globalThis)
    └── fixtures.ts      ← Sample book data for seeding
```

#### Key differences from Hono

- **ErrorMiddleware**: Uses Express's 4-argument `(err, req, res, next)` middleware pattern instead of Hono's `app.onError`
- **Router()**: Uses Express `Router()` for sub-routers instead of Hono sub-apps
- **express.json()**: Explicit JSON parsing middleware (Hono parses JSON on demand via `c.req.json()`)
- **cors npm package**: External `cors` package instead of Hono's built-in `cors()` middleware
- **supertest**: Uses `supertest` for HTTP testing instead of Hono's `app.request()`
- **Express 5**: Native async error handling — no `asyncHandler` wrapper needed

#### Commands

```bash
cd packages/main/integrations/express
pnpm install
pnpm dev        # http://localhost:3001
pnpm test       # vitest (unit + property-based tests)
```

### Preact (client only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `components/add-form.tsx`, `hooks/use-book-validation.ts` | `ensure` for form validation (sync, per-field + submit) |
| **Kanon** | `lib/schemas.ts`, `lib/errors.ts` | Schema definition, `.pattern()` for ISBN, `errorBodySchema` for API error parsing |
| **Sphalma** | `lib/errors.ts` | Typed error codes (duplicate ISBN, not found, storage failure) with user-facing messages |
| **Zygos** | `lib/api.ts`, `hooks/use-books.ts`, `hooks/use-chaos.ts` | Full `ResultAsync` pipeline: `safeFetch` → `checkResponse` → `ensurePromise` → `.andThen()` / `.map()` / `.mapErr()` |

The app also uses **Arkhe** for data transforms: `groupBy` and `orderBy` in `hooks/use-grouped-books.ts`, `titleCase` in `components/add-form.tsx`.

#### Architecture

```
preact/src/
├── index.tsx            ← Entry point, routing (preact-iso)
├── components/
│   ├── add-form.tsx     ← Book form (ensure + postBook ResultAsync)
│   ├── form-field.tsx   ← Typed field component (no e.target casts)
│   ├── book-list.tsx    ← Grouped collection display
│   ├── book-card.tsx    ← Single book card
│   ├── error-banner.tsx ← Error/success banner
│   ├── connection-error.tsx ← Backend unreachable state
│   ├── empty-state.tsx  ← Empty collection + seed button
│   ├── nav-bar.tsx      ← Navigation + chaos toggle
│   └── chaos-toggle.tsx ← Chaos mode switch
├── hooks/
│   ├── use-books.ts     ← CRUD via ResultAsync (.match/.map/.mapErr)
│   ├── use-book-validation.ts ← Per-field validation via ensure
│   ├── use-chaos.ts     ← Chaos toggle via ResultAsync
│   └── use-grouped-books.ts ← groupBy + orderBy (Arkhe)
└── lib/
    ├── api.ts           ← ResultAsync pipeline (safeFetch → checkResponse → ensurePromise)
    ├── errors.ts        ← Error extraction with ensurePromise + Sphalma codes
    ├── schemas.ts       ← Kanon schemas (book, storedBook, chaos)
    └── constants.ts     ← API URL, genres
```

#### Key differences from Next.js

- **Zero try/catch in application code**: The API layer returns `ResultAsync` end-to-end. Hooks consume results with `.match()`, `.map()`, `.mapErr()` — no throw/catch cycle. The only `try/catch` is in `extractError` for parsing unknown JSON from error responses.
- **No server actions**: Pure client-side SPA that talks directly to the Hono, Express or Bun backend (port 3001) via `fetch()`.
- **`ResultAsync` pipeline**: `safeFetch` wraps `fetch` in `ResultAsync.fromPromise`, then chains `checkResponse` → `ensurePromise`. The `Result` flows from API to hook to component without being unwrapped and re-wrapped.
- **Typed `FormField` component**: Uses `e.currentTarget.value` instead of casting `e.target`. Props typed with `keyof typeof bookFields`.
- **`ensure` for form validation**: Same pattern as Next.js — raw `FormData` goes through `ensure(bookSchema, data)` instead of manual `FormData.get() as string` casts.

#### Chaos mode

Same as Next.js: click the toggle in the nav bar to simulate backend failures. POST and DELETE return `STORAGE_FAILURE` (HTTP 503). The error propagates through the `ResultAsync` pipeline to the UI without any try/catch.

#### Commands

```bash
cd packages/main/integrations/preact
npm install
npm run dev     # http://localhost:5173
npm test        # vitest (22 property-based tests)
```

### SvelteKit (client + server)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `routes/add/+page.server.ts`, `routes/add/+page.svelte` | `ensure` for server-side validation + client-side per-field validation (onblur) |
| **Kanon** | `lib/schemas/book.ts` | Schema definition, `.pattern()` for ISBN validation, `bookFields` for per-field client validation |
| **Zygos** | `routes/add/+page.server.ts`, `routes/api/books/+server.ts` | `Result<T, E>` from `ensure` bridge for validation outcomes |

The app also uses **Arkhe** for data transforms: `titleCase` in `routes/add/+page.server.ts` and `routes/api/books/+server.ts`, `groupBy` and `orderBy` in `routes/collection/+page.server.ts`.

> **Why no Sphalma?** SvelteKit provides native `fail()` (form actions) and `error()` (API routes) for structured error handling with HTTP status codes. Pithos fills gaps — it doesn't replace what already exists.

#### Architecture

```
sveltekit/src/
├── routes/
│   ├── +layout.svelte         ← Nav bar + chaos toggle
│   ├── +page.server.ts        ← Root redirect → /collection
│   ├── add/
│   │   ├── +page.server.ts    ← Form action (ensure + titleCase + store)
│   │   └── +page.svelte       ← Add form with per-field validation (onblur/oninput)
│   ├── collection/
│   │   ├── +page.server.ts    ← Load (groupBy + orderBy) + seed/clear/remove actions
│   │   └── +page.svelte       ← Grouped collection + empty state
│   └── api/books/
│       ├── +server.ts         ← GET / POST / DELETE
│       ├── chaos/+server.ts   ← Toggle simulated failures
│       └── seed/+server.ts    ← Populate store with sample data
└── lib/
    ├── schemas/book.ts        ← Kanon schemas (bookSchema + bookFields)
    ├── server/store.ts        ← In-memory storage (module-level)
    ├── styles/variables.css   ← CSS custom properties (design tokens)
    ├── constants.ts           ← Genres list
    ├── fixtures.ts            ← Sample book data for seeding
    └── types.ts               ← StoredBook, AddBookState types
```

#### Key differences from Next.js

- **Form actions instead of Server Actions**: SvelteKit uses `export const actions` with `use:enhance` for progressive enhancement. No `"use server"` directive.
- **No Sphalma**: SvelteKit's `fail()` and `error()` handle structured errors natively with HTTP status codes.
- **Scoped CSS with design tokens**: CSS custom properties in `variables.css` instead of Tailwind. Styles are scoped per component via Svelte's `<style>` blocks.
- **Svelte 5 runes**: Uses `$state`, `$props` instead of React's `useState`, `useActionState`.
- **Server-side collection grouping**: `groupBy` + `orderBy` runs in `+page.server.ts` load function (in Next.js, this is done client-side in a React hook).

#### Chaos mode

Same as Next.js: click the toggle in the nav bar to simulate backend failures. When enabled, form actions and POST/DELETE API routes return 503. GET is excluded so the collection page always renders.

#### Commands

```bash
cd packages/main/integrations/sveltekit
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # vitest (13 property-based tests)
```

### Angular (client only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `services/api-client.service.ts`, `components/add-form.ts` | `ensure` for form validation (per-field on blur + submit), `ensurePromise` for API response validation |
| **Kanon** | `lib/schemas.ts` | Schema definition, `.pattern()` for ISBN validation, `bookFields` for per-field client validation |
| **Sphalma** | `lib/errors.ts` | Typed error codes (duplicate ISBN, not found, storage failure) with user-facing messages |
| **Zygos** | `services/api-client.service.ts`, `services/book.service.ts`, `services/chaos.service.ts` | Full `ResultAsync` pipeline: `HttpClient` → `firstValueFrom` → `ResultAsync.fromPromise` → `ensurePromise` → `.match()` / `.map()` / `.mapErr()` |

The app also uses **Arkhe** for data transforms: `groupBy` and `orderBy` in `components/book-list.ts`, `titleCase` in `components/add-form.ts`.

#### Architecture

```
angular/src/
├── main.ts                          ← Standalone bootstrap (no NgModule)
├── styles.scss                      ← Global reset + variables import
├── styles/variables.css             ← CSS custom properties (design tokens)
├── app/
│   ├── app.ts                       ← Root component (NavBar + RouterOutlet)
│   ├── app.config.ts                ← provideRouter + provideHttpClient
│   ├── app.routes.ts                ← Lazy-loaded routes: /add, /collection, / → redirect
│   ├── components/
│   │   ├── add-form.ts + .html + .scss
│   │   ├── book-card.ts + .html + .scss
│   │   ├── book-list.ts + .html + .scss
│   │   ├── chaos-toggle.ts + .html + .scss
│   │   ├── connection-error.ts + .html + .scss
│   │   ├── empty-state.ts + .html + .scss
│   │   ├── error-banner.ts + .html + .scss
│   │   ├── form-field.ts + .html + .scss
│   │   └── nav-bar.ts + .html + .scss
│   ├── services/
│   │   ├── api-client.service.ts    ← HttpClient → firstValueFrom → ResultAsync → ensurePromise
│   │   ├── book.service.ts          ← CRUD via signals + ResultAsync
│   │   └── chaos.service.ts         ← Chaos state via signals + ResultAsync
│   └── lib/
│       ├── constants.ts             ← GENRES, API_URL
│       ├── errors.ts                ← extractErrorFromBody (sync), USER_MESSAGES, Sphalma codes
│       └── schemas.ts               ← Kanon schemas (bookSchema, storedBookSchema, etc.)
└── __tests__/
    ├── schemas.test.ts              ← PBT: field validation, ISBN, addedAt
    ├── api.test.ts                  ← PBT: round-trip ensurePromise
    ├── errors.test.ts               ← PBT: error extraction
    ├── collection.test.ts           ← PBT: groupBy + orderBy
    └── title-case.test.ts           ← PBT: idempotence + capitalization
```

#### Key differences from Preact

- **Services instead of hooks**: Angular services are injectable singletons that persist across navigations. Preact hooks are tied to component lifecycle. `BookService` and `ChaosService` hold state in signals and expose readonly accessors — the Angular equivalent of `useBooks()` and `useChaos()`.
- **Signals instead of `useState`/`useEffect`**: Angular 21 signals (`signal()`, `computed()`) replace React-style state hooks. Signals are synchronous, fine-grained, and don't require dependency arrays.
- **`HttpClient` instead of `fetch`**: Pithos fills gaps — it doesn't replace what already exists. Just like SvelteKit skips Sphalma because `fail()` and `error()` already fill that role, Angular has `HttpClient` as its standard HTTP idiom. `HttpClient` is converted to `ResultAsync` via `firstValueFrom()` + `ResultAsync.fromPromise()` — the Pithos validation pipeline stays intact.
- **Synchronous `extractErrorFromBody`**: Preact's `extractError(res: Response)` is async because it calls `res.json()`. Angular's `HttpClient` parses JSON automatically — the error body is available in `HttpErrorResponse.error`. So `extractErrorFromBody` is synchronous with zero try/catch.
- **Zero try/catch in application code**: The Preact demo has one try/catch in `extractError` for parsing unknown JSON. The Angular demo has none — `HttpClient` handles JSON parsing, and the entire error flow is synchronous.
- **Reactive Forms**: Uses `FormGroup`/`FormControl` with programmatic validation via `ensure(bookFields[name], value)` on blur, instead of raw `FormData` manipulation.
- **`inject()` instead of constructor injection**: Modern Angular pattern that simplifies code and enables injection in functions.
- **Scoped SCSS with design tokens**: CSS custom properties in `variables.css` (same tokens as SvelteKit) with per-component `.scss` files, instead of Tailwind utility classes.

#### Chaos mode

Same as Preact: click the toggle in the nav bar to simulate backend failures. POST and DELETE return `STORAGE_FAILURE` (HTTP 503). The error propagates through the `ResultAsync` pipeline to the UI without any try/catch.

#### Commands

```bash
cd packages/main/integrations/angular
pnpm install
pnpm start      # http://localhost:4200
pnpm test       # vitest (17 property-based tests)
```

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
