# Pithos / Integration Demos

Standalone demo apps showing how `@pithos/core` integrates natively into any TypeScript framework. No adapters, no plugins, no wrappers.

Each demo implements the same **Book Collection Manager**: a form to add books (with validation, normalization, duplicate detection) and a page to browse the collection (grouped by genre, sorted by date). Same features, same Pithos modules, different framework.

## Pithos modules covered

| Module | What it does in the demo |
|---|---|
| **Kanon** | Shared validation schema (client + server) |
| **Zygos** | `Result<T, E>` via the `ensure` bridge |
| **Arkhe** | `titleCase`, `groupBy`, `orderBy`, `SimpleResult` type |
| **Sphalma** | Typed business errors (duplicate ISBN, not found, storage failure) |
| **Bridge ensure** | Kanon → Zygos: validates a schema, returns a `Result` |
| **Bridge ensurePromise** | Kanon → Zygos: validates a promise, returns a `ResultAsync` |

Kanon, Zygos, Arkhe, and Bridge ensure are used everywhere. Sphalma is used where the framework lacks native structured error handling. SvelteKit skips it because `fail()` and `error()` already fill that role. `ensurePromise` only appears in demos with a client-side API layer.

## Demos

| Framework | Directory | Highlights |
|---|---|---|
| [Angular](./angular/) | `angular/` | Client only ([details](#angular-client-only)) |
| [Bun](./bun/) | `bun/` | Server only ([details](#bun-server-only)) |
| [Express](./express/) | `express/` | Server only ([details](#express-server-only)) |
| [Hono](./hono/) | `hono/` | Server only ([details](#hono-server-only)) |
| [Next.js](./nextjs/) | `nextjs/` | Client + Server ([details](#nextjs-client--server)) |
| [Nuxt](./nuxt/) | `nuxt/` | Client + Server ([details](#nuxt-client--server)) |
| [Preact](./preact/) | `preact/` | Client only ([details](#preact-client-only)) |
| [React](./react/) | `react/` | Client only ([details](#react-client-only)) |
| [SvelteKit](./sveltekit/) | `sveltekit/` | Client + Server ([details](#sveltekit-client--server)) |

## Chaos mode

Every demo includes a "Chaos mode" toggle in the nav bar. When enabled, POST and DELETE requests fail with a `STORAGE_FAILURE` CodedError (HTTP 503). GET is excluded so the collection page always renders. This shows how errors propagate from the backend through the API layer to the UI.

## General design choices

**Direct imports vs barrel** — Every demo uses direct imports by default (`@pithos/core/kanon/schemas/primitives/string`). Kanon also exposes a barrel at `@pithos/core/kanon`. The barrel adds a few KB of overhead. On lightweight frameworks (Svelte, Preact), direct imports matter. On React/Next.js, the difference is noise.

**Validate at boundaries, trust types inside** — Demos validate data where it enters the system (user input, request body), then trust TypeScript from that point on. `ensurePromise` also validates API responses — essential when frontend and backend are separate codebases.

**SimpleResult vs Zygos Result** — Use `Result<T, E>` (via `ensure`) when you need type-safe chaining. Use Arkhe's `SimpleResult` (`{ ok: true } | { ok: false, error: string }`) for simple pass/fail operations.

## What each demo showcases

### Next.js (client + server)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `add/_actions/add-book.ts`, `hooks/use-book-validation.ts` | `ensure` for form validation (server + client per-field) |
| **Kanon** | `lib/schemas/book.ts`, `lib/api/books.ts` | Schema definition, `.pattern()` for ISBN, shared client/server schemas |
| **Sphalma** | `api/books/route.ts` | `CodedError` thrown server-side, serialized as structured JSON |
| **Zygos** | `lib/api/books.ts` | `ensurePromise` bridge: fetch → validate → `ResultAsync` pipeline |

Also uses **Arkhe**: `groupBy`/`orderBy` in `hooks/use-grouped-books.ts`, `titleCase` in `add/_actions/add-book.ts`.

#### Architecture

```
nextjs/app/
├── api/books/           ← Route Handlers (GET / POST / DELETE + Sphalma errors)
│   ├── store.ts         ← In-memory storage
│   ├── chaos/route.ts   ← Toggle simulated failures
│   └── seed/route.ts    ← Populate store with sample data
├── add/                 ← Add book page (Server Action + form components)
├── collection/          ← Collection page (remove / clear / seed actions)
├── hooks/               ← Client hooks (validation, grouping, server action)
├── lib/
│   ├── api/             ← API client (ensurePromise pipeline) + base URL helper
│   ├── errors/          ← Sphalma error factory + codes
│   ├── schemas/         ← Kanon schemas (shared client/server)
│   ├── fixtures.ts      ← Sample book data
│   └── types.ts         ← Discriminated union types
└── _components/         ← Chaos mode toggle
```

```bash
cd packages/main/integrations/nextjs
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # vitest (17 property-based tests)
```

### Nuxt (client + server)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `server/api/books/index.post.ts`, `composables/useBookValidation.ts` | `ensure` for server-side validation, `ensurePromise` for API response validation |
| **Kanon** | `lib/schemas/book.ts`, `lib/api/books.ts` | Schema definition, `.pattern()` for ISBN, shared client/server schemas |
| **Sphalma** | `lib/errors/book-errors.ts`, `server/api/books/index.post.ts` | `CodedError` thrown server-side, serialized as structured JSON |
| **Zygos** | `lib/api/books.ts` | `ensurePromise` bridge: `$fetch` → validate → `ResultAsync` pipeline |

Also uses **Arkhe**: `groupBy`/`orderBy` in `composables/useGroupedBooks.ts`, `titleCase` in `server/api/books/index.post.ts`.

#### Architecture

```
nuxt/
├── app/
│   ├── app.vue                ← Root layout (NavBar + NuxtPage)
│   ├── pages/                 ← index, add (form), collection (useFetch + refresh)
│   ├── components/            ← AlertBanner, BookList, ChaosToggle, FormField, etc.
│   ├── composables/           ← useAsyncAction, useBookValidation, useGroupedBooks
│   ├── lib/
│   │   ├── api/books.ts       ← API client ($fetch + ensurePromise pipeline)
│   │   ├── errors/            ← Sphalma error factory + extractError
│   │   ├── schemas/book.ts    ← Kanon schemas (shared client/server)
│   │   ├── constants.ts       ← Genres list
│   │   ├── fixtures.ts        ← Sample book data
│   │   └── types.ts           ← Book, StoredBook, ActionResult types
│   └── assets/css/main.css    ← Tailwind CSS v4
└── server/
    ├── api/books/             ← File-based routes (index.get/post/delete, seed, chaos)
    └── utils/store.ts         ← In-memory storage (globalThis for HMR)
```

#### Key differences from Next.js

- File-based API routes (one file per method) instead of a single `route.ts`
- `$fetch` (ofetch) auto-resolves URLs — no `base-url.ts` needed
- `useFetch` + `refresh()` instead of React Server Components + `revalidatePath`
- Vue composables (`ref`, `computed`) instead of React hooks (`useState`, `useMemo`)
- Auto-imports for Vue APIs, composables, and components

```bash
cd packages/main/integrations/nuxt
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # vitest (17 property-based tests)
```

### Hono (server only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `src/routes/books.ts`, `src/routes/chaos.ts` | `ensure` for payload validation |
| **Kanon** | `src/lib/schemas.ts` | Schema definition, `.pattern()` for ISBN, `chaosSchema` |
| **Sphalma** | `src/lib/errors.ts`, `src/lib/error-handler.ts` | `CodedError` serialized via centralized `app.onError` |
| **Zygos** | `src/routes/books.ts`, `src/routes/chaos.ts` | `Result<T, E>` from `ensure` bridge |

Also uses **Arkhe**: `titleCase` in routes, `groupBy`/`orderBy` in collection route.

#### Architecture

```
hono/src/
├── index.ts             ← Entry point (port 3001)
├── app.ts               ← Hono app, error handler, route mounting
├── routes/              ← books, chaos, collection, seed
└── lib/                 ← schemas, errors, error-handler, store, fixtures
```

#### Key differences from Next.js

- Centralized `app.onError` with declarative code→status mapping
- Module-level state (no `globalThis` — Hono has no HMR)
- Server-side collection grouping (`groupBy` + `orderBy` runs server-side)

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
| **Bridges** | `src/routes/books.ts`, `src/routes/chaos.ts` | `ensure` for payload validation |
| **Kanon** | `src/lib/schemas.ts` | Schema definition, `.pattern()` for ISBN, `chaosSchema` |
| **Sphalma** | `src/lib/errors.ts`, `src/lib/error-handler.ts` | `CodedError` serialized via centralized `try/catch` |
| **Zygos** | `src/routes/books.ts`, `src/routes/chaos.ts` | `Result<T, E>` from `ensure` bridge |

Also uses **Arkhe**: `titleCase` in routes, `groupBy`/`orderBy` in collection route.

#### Architecture

```
bun/src/
├── index.ts             ← Entry point (Bun.serve on port 3001)
├── app.ts               ← Declarative routes + CORS/error wrapper
├── routes/              ← books, chaos, collection, seed
└── lib/                 ← schemas, errors, error-handler, store, fixtures
```

#### Key differences from Hono

- No framework — uses `Bun.serve()` with native declarative `routes` API (Bun 1.2+)
- `withCorsAndErrors` HOF wraps handlers instead of middleware
- Direct `Response` construction instead of Hono's `c.json()` context
- Uses `bun:test` instead of vitest — zero external test dependencies

```bash
cd packages/main/integrations/bun
bun install
bun dev         # http://localhost:3001
bun test        # bun:test (unit + property-based tests)
```

### Express (server only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `src/routes/books.ts`, `src/routes/chaos.ts` | `ensure` for payload validation |
| **Kanon** | `src/lib/schemas.ts` | Schema definition, `.pattern()` for ISBN, `chaosSchema` |
| **Sphalma** | `src/lib/errors.ts`, `src/lib/error-handler.ts` | `CodedError` serialized via centralized ErrorMiddleware |
| **Zygos** | `src/routes/books.ts`, `src/routes/chaos.ts` | `Result<T, E>` from `ensure` bridge |

Also uses **Arkhe**: `titleCase` in routes, `groupBy`/`orderBy` in collection route.

#### Architecture

```
express/src/
├── index.ts             ← Entry point (port 3001)
├── app.ts               ← Express app, middleware, route mounting
├── routes/              ← books, chaos, collection, seed
└── lib/                 ← schemas, errors, error-handler, store, fixtures
```

#### Key differences from Hono

- Express 4-argument `(err, req, res, next)` ErrorMiddleware
- `express.json()` for explicit JSON parsing
- `supertest` for HTTP testing
- Express 5 with native async error handling

```bash
cd packages/main/integrations/express
pnpm install
pnpm dev        # http://localhost:3001
pnpm test       # vitest (unit + property-based tests)
```

### Preact (client only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `components/add-form.tsx`, `hooks/use-book-validation.ts` | `ensure` for form validation (per-field + submit) |
| **Kanon** | `lib/schemas.ts`, `lib/errors.ts` | Schema definition, `.pattern()` for ISBN, `errorBodySchema` for API error parsing |
| **Sphalma** | `lib/errors.ts` | Typed error codes with user-facing messages |
| **Zygos** | `lib/api.ts`, `hooks/use-books.ts`, `hooks/use-chaos.ts` | Full `ResultAsync` pipeline: `safeFetch` → `checkResponse` → `ensurePromise` |

Also uses **Arkhe**: `groupBy`/`orderBy` in `hooks/use-grouped-books.ts`, `titleCase` in `components/add-form.tsx`.

#### Architecture

```
preact/src/
├── index.tsx            ← Entry point, routing (preact-iso)
├── components/          ← add-form, form-field, book-list, book-card, nav-bar, chaos-toggle, etc.
├── hooks/               ← use-books, use-book-validation, use-chaos, use-grouped-books
└── lib/                 ← api (ResultAsync pipeline), errors, schemas, constants
```

#### Key differences from Next.js

- Zero try/catch — API layer returns `ResultAsync` end-to-end, hooks consume with `.match()`/`.map()`/`.mapErr()`
- Pure client-side SPA talking to Hono/Express/Bun backend (port 3001)
- `safeFetch` → `checkResponse` → `ensurePromise` pipeline without unwrap/re-wrap

```bash
cd packages/main/integrations/preact
npm install
npm run dev     # http://localhost:5173
npm test        # vitest (22 property-based tests)
```

### React (client only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `components/add-form.tsx`, `hooks/use-book-validation.ts` | `ensure` for form validation (per-field + submit) |
| **Kanon** | `lib/schemas.ts`, `lib/errors.ts` | Schema definition, `.pattern()` for ISBN, `errorBodySchema` for API error parsing |
| **Sphalma** | `lib/errors.ts` | Typed error codes with user-facing messages |
| **Zygos** | `lib/api.ts`, `hooks/use-books.ts`, `hooks/use-chaos.ts` | Full `ResultAsync` pipeline: `safeFetch` → `checkResponse` → `ensurePromise` |

Also uses **Arkhe**: `groupBy`/`orderBy` in `hooks/use-grouped-books.ts`, `titleCase` in `components/add-form.tsx`.

#### Architecture

```
react/src/
├── App.tsx              ← Root component (NavBar + Routes)
├── main.tsx             ← ReactDOM.createRoot entry point
├── pages/               ← add-page, collection-page
├── components/          ← add-form, form-field, book-list, book-card, nav-bar, chaos-toggle, etc.
├── hooks/               ← use-books, use-book-validation, use-chaos, use-grouped-books
└── lib/                 ← api (ResultAsync pipeline), errors, schemas, constants
```

#### Key differences from Preact

- `react-router` instead of `preact-iso`
- `className`/`htmlFor`/`onChange` (standard React DOM attributes)
- Barrel import `@pithos/core/kanon` (React's runtime is heavy enough that barrel overhead is noise)
- Pages extracted into `src/pages/`

```bash
cd packages/main/integrations/react
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # vitest (20 property-based tests)
```

### SvelteKit (client + server)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `routes/add/+page.server.ts`, `routes/add/+page.svelte` | `ensure` for server-side + client-side per-field validation |
| **Kanon** | `lib/schemas/book.ts` | Schema definition, `.pattern()` for ISBN, `bookFields` for per-field validation |
| **Zygos** | `routes/add/+page.server.ts`, `routes/api/books/+server.ts` | `Result<T, E>` from `ensure` bridge |

Also uses **Arkhe**: `titleCase` in server files, `groupBy`/`orderBy` in `routes/collection/+page.server.ts`.

> **Why no Sphalma?** SvelteKit's `fail()` and `error()` handle structured errors natively. Pithos fills gaps — it doesn't replace what already exists.

#### Architecture

```
sveltekit/src/
├── routes/
│   ├── +layout.svelte         ← Nav bar + chaos toggle
│   ├── add/                   ← Form action (ensure + titleCase) + add form
│   ├── collection/            ← Load (groupBy + orderBy) + seed/clear/remove actions
│   └── api/books/             ← GET / POST / DELETE, chaos, seed
└── lib/                       ← schemas, server/store, styles, constants, fixtures, types
```

#### Key differences from Next.js

- Form actions (`export const actions` + `use:enhance`) instead of Server Actions
- No Sphalma — `fail()` and `error()` handle structured errors natively
- Scoped CSS with design tokens instead of Tailwind
- Svelte 5 runes (`$state`, `$props`) instead of React hooks
- Server-side collection grouping in `+page.server.ts` load function

```bash
cd packages/main/integrations/sveltekit
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # vitest (13 property-based tests)
```

### Angular (client only)

| Pithos module | Where | Usage |
|---|---|---|
| **Bridges** | `services/api-client.service.ts`, `components/add-form.ts` | `ensure` for form validation, `ensurePromise` for API response validation |
| **Kanon** | `lib/schemas.ts` | Schema definition, `.pattern()` for ISBN, `bookFields` for per-field validation |
| **Sphalma** | `lib/errors.ts` | Typed error codes with user-facing messages |
| **Zygos** | `services/api-client.service.ts`, `services/book.service.ts`, `services/chaos.service.ts` | Full `ResultAsync` pipeline: `HttpClient` → `firstValueFrom` → `ResultAsync.fromPromise` → `ensurePromise` |

Also uses **Arkhe**: `groupBy`/`orderBy` in `components/book-list.ts`, `titleCase` in `components/add-form.ts`.

#### Architecture

```
angular/src/
├── main.ts                    ← Standalone bootstrap (no NgModule)
├── styles/variables.css       ← CSS custom properties (design tokens)
├── app/
│   ├── app.ts                 ← Root component (NavBar + RouterOutlet)
│   ├── app.config.ts          ← provideRouter + provideHttpClient
│   ├── app.routes.ts          ← Lazy-loaded routes
│   ├── components/            ← add-form, book-list, book-card, form-field, nav-bar, etc.
│   ├── services/              ← api-client, book, chaos (signals + ResultAsync)
│   └── lib/                   ← constants, errors, schemas
└── __tests__/                 ← PBT: schemas, api, errors, collection, title-case
```

#### Key differences from Preact

- Injectable services (`BookService`, `ChaosService`) instead of hooks — singletons that persist across navigations
- Angular signals (`signal()`, `computed()`) instead of `useState`/`useEffect`
- `HttpClient` → `firstValueFrom` → `ResultAsync` (Pithos fills gaps, doesn't replace `HttpClient`)
- Synchronous `extractErrorFromBody` — `HttpClient` parses JSON automatically, zero try/catch
- Reactive Forms (`FormGroup`/`FormControl`) with `ensure` on blur
- Scoped SCSS with design tokens instead of Tailwind

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

1. Create a new directory under `integrations/`
2. Scaffold the framework's starter project
3. Implement the Book Collection Manager using the same Pithos modules
4. Update the tables and sections above
