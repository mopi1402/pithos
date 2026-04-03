# 📋 Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-04-03

### Added

- **Eidos** — `createLiteObservable` (`eidos/observer/observer-lite`) — lightweight variant of `createObservable` with only `subscribe`, `notify`, `clear`. Zero dependency on `@zygos/result`
- **Eidos** — `createLiteMachine` (`eidos/state/state-lite`) — lightweight variant of `createMachine` with `current`, `send`, `matches`, `onTransition`, `reset` (+ `context`). Zero dependency on `@zygos/option`

---

## [2.4.0] - 2026-03-30

### Added

- **Eidos** — 23 GoF design patterns en TypeScript fonctionnel (Strategy, Observer, Decorator, Adapter, Command, Chain of Responsibility, State, Iterator, Composite, Abstract Factory, Mediator, Memento, Builder, Template Method + re-exports Arkhe pour Proxy, Prototype, Singleton, Flyweight + deprecated pédagogiques pour Bridge, Factory Method, Facade, Visitor, Interpreter)

---

## [2.3.0] - 2026-03-11

### Fixed

- **Tooling** — Scoped `check:types`, `test` and `coverage` to `packages/pithos` only
- **Tooling** — Integration demos are now standalone projects, excluded from the workspace

### Added

- **Integrations** — 9 framework integration demos (frontend, fullstack, backend)
- **Documentation** — New Integrations page (EN + FR)

---

## [2.2.2] - 2026-03-08

### Fixed

- **Core** — Added `"type": "module"` to `package.json`, fixing compatibility with native Node.js ESM (`"type": "module"`) and Deno

---

## [2.2.1] - 2026-03-08

### Fixed

- **Kanon** — `parse`, `parseBulk`, `ensure`, `ensureAsync`, `ensurePromise`, `validation.parse`, `validation.safeParse`, `validation.parseAsync`, `validation.safeParseAsync` now accept unions of schemas via `GenericSchema` overloads (no more switch/case needed to narrow schema types)
- **Kanon** — `z.union()` guard relaxed from 2 to 1 minimum schema (aligns with Zod v4)
- **Kanon** — `z.pick()` no longer passes unknown keys to the underlying schema validator
- **Kanon** — Removed deprecated `passthrough()` from `ObjectAdapter` (use `z.looseObject()` instead)

### Added

- **Kanon** — `z.looseObject()` on the Zod shim (Zod v4 replacement for `z.object().passthrough()`)

---

## [2.2.0] - 2026-03-07

### Added

- **Kanon** — Barrel export `@pithos/core/kanon` for single-line imports
- **Arkhe** — `SimpleResult<E>` type in `arkhe/types/common` for lightweight success/failure outcomes without Zygos

### Improved

- **Tooling** — `generate-exports` now auto-detects `index.ts` barrels and adds explicit exports

---

## [2.1.1] - 2026-03-07

### Fixed

- **ESM** — Added `.js` extensions to internal imports in ESM build output

---

## [2.1.0] - 2026-03-04

### Added

- **Bridges** — `ensure()`, `ensureAsync()`, `ensurePromise()` bridge functions (Kanon → Zygos Result)

### Improved

- **Documentation** — Improved and translated to French (excluding API Reference and Use Cases)

---

## [2.0.0] - 2026-02-22

Complete ecosystem rewrite — first public release as a full ecosystem.

### Breaking Changes

- Complete API redesign
- New module structure
- The following modules from v1 have been removed from Pithos and will be available in dedicated packages (Talaria, Themelia) in a future release:
  - **Animations** — `AnimationController`, all easing functions (`easeInBack`, `easeOutBack`, `linear`, `getEasingFunction`, etc.), `AnimationOptions`, `AnimationState`, `TransitionConfig`, `TransitionableStyles`, `StylesInput`
  - **DOM** — Browser feature detection (`hasWebCodecs`, `hasWebGPU`, `hasViewTransitions`, `hasContainerQueries`, etc.), CSS utilities (`transitionFrom`, `transitionTo`, `applyStyles`, `removeStyles`, `extractClassNames`, `removeCSSProperties`, `getStyleValue`), `parseViewportMeta`
  - **Gestures** — `DragDetector`, `TouchGestureHandler`, `WheelGestureHandler`, `WheelGestureCallbacks`, `WheelGestureOptions`, `distance`, `getCenter`, `isPinchGesture`, `DragCallbacks`, `DragOptions`
  - **Timing** — `Debouncer`, `EventDebouncerManager`, `EventConfig`, `FrameScheduler`
  - **Data** — `LocalStorage`
  - **Types** — `Nullable`, `Optional`, `isNullish`, `isNonNullish`

### Added

- **Arkhe** — 70+ array/object/string/function utilities
- **Kanon** — Schema validation with JIT compilation
- **Zygos** — Result pattern & monads
- **Sphalma** — Error factories
- **Taphos** — Deprecated utilities with migration paths from Lodash

---

## [1.0.12] - 2025-08-29

Early development — added autocompletion helpers, CSS utilities, and reorganized timing modules.

## [1.0.0] - 2025-08-28

Initial release with animation controller, gesture handlers, math utilities, and modular exports.

## [0.1.0] - 2025-08-28

Initial prototype.
