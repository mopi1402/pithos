## `defaults` 💎

> Safely applies default values only where properties are `undefined`.

### **Initialize** configuration options 📍

@keywords: initialize, configuration, defaults, options, settings, library, design system, presets

Apply default settings to a user-provided config object without overwriting explicit nulls.
Perfect for library initialization or function parameters.

```typescript
const config = defaults(userOptions, {
  timeout: 5000,
  retries: 3,
  verbose: true
});
```

### **Preserve** explicit nulls

@keywords: preserve, null, semantic, explicit, disable, API

Ensure that `null` values provided by the user are respected (not treated as missing).
Critical for APIs where `null` has a specific semantic meaning (e.g., "disable feature").

```typescript
const options = defaults({ cache: null }, { cache: true });
// options.cache is null (user disabled it)
```

### **Combine** multiple sources

@keywords: combine, merge, cascade, layering, sources, configuration

Layer multiple default objects to build a final configuration.
Useful for cascading settings (Global -> Project -> User).

```typescript
const final = defaults(userOpts, projectDefaults, globalDefaults);
```

### **Apply** overlay positioning defaults

@keywords: overlay, position, defaults, dialog, tooltip, design system

Merge user overlay options with sensible positioning defaults.
Essential for overlay/dialog systems with configurable but defaulted positioning.

```typescript
const overlayConfig = defaults(userOptions, {
  hasBackdrop: true,
  backdropClass: "overlay-backdrop",
  panelClass: "",
  width: "auto",
  height: "auto",
  minWidth: 200,
  maxWidth: "80vw",
  scrollStrategy: "block",
  positionStrategy: "global",
  direction: "ltr",
});

overlayService.create(overlayConfig);
```

### **Initialize** drag-and-drop configuration

@keywords: drag, drop, config, defaults, sortable, design system

Apply default drag-and-drop behavior with user overrides.
Perfect for CDK-style drag-and-drop directives with sensible defaults.

```typescript
const dragConfig = defaults(userDragOptions, {
  lockAxis: null,
  dragStartThreshold: 5,
  pointerDirectionChangeThreshold: 5,
  autoScrollDisabled: false,
  autoScrollStep: 2,
  boundaryElement: null,
  previewClass: "drag-preview",
  placeholderClass: "drag-placeholder",
});

initDragDrop(element, dragConfig);
```

### **Apply** chart rendering defaults

@keywords: chart, rendering, defaults, visualization, options, charts, design system

Merge user chart options with sensible defaults.
Essential for chart components that need consistent baseline configuration.

```typescript
const chartConfig = defaults(userOptions, {
  width: 600,
  height: 400,
  showGrid: true,
  showLegend: true,
  colors: ["#3b82f6", "#ef4444", "#22c55e"],
  animation: { duration: 300, easing: "ease-out" },
});

renderChart(data, chartConfig);
```

### **Initialize** PWA install prompt state

@keywords: PWA, install, prompt, state, defaults, offline, progressive

Set default state for the PWA install banner with user overrides.
Perfect for managing the "Add to Home Screen" prompt lifecycle.

```typescript
const installState = defaults(loadSavedState(), {
  dismissed: false,
  dismissedAt: null,
  installCount: 0,
  platform: "unknown",
});

if (!installState.dismissed) {
  showInstallBanner();
}
```
