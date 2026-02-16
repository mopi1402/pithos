# 📋 Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
