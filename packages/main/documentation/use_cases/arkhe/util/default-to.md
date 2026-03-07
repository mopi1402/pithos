## `defaultTo`

### **Handle NaN** from calculations 📍

@keywords: NaN, calculations, fallback, math, parsing

Provide fallback values when calculations might produce NaN.
Unlike `??`, handles NaN which is a common edge case.

```typescript
defaultTo(parseInt('invalid'), 0); // => 0 (NaN falls back)
parseInt('invalid') ?? 0;          // => NaN (?? doesn't handle NaN)
```

### **Safe division** with fallback 📍

@keywords: division, safe, fallback, zero, math

Handle division edge cases where both operands are zero (`0/0 = NaN`).

```typescript
defaultTo(0 / 0, 0);             // => 0 (NaN falls back)
defaultTo(sum / nums.length, 0); // => 0 for empty array (0/0 = NaN)
```

### **Resolve** text direction with fallback

@keywords: RTL, LTR, direction, fallback, i18n, design system

Resolve the document direction with a fallback when the attribute is missing.
Essential for bidirectional text support in design systems.

```typescript
const getDirection = (element: HTMLElement) =>
  defaultTo(element.getAttribute("dir"), "ltr");

// Returns "rtl" if set, "ltr" as fallback
const dir = getDirection(document.documentElement);
applyDirectionalStyles(dir);
```

### **Fallback** overlay z-index when not specified

@keywords: overlay, z-index, fallback, default, design system

Provide a default z-index for overlays when none is configured.
Perfect for overlay systems with optional z-index configuration.

```typescript
const overlayZIndex = defaultTo(config.zIndex, 1000);
overlay.style.zIndex = String(overlayZIndex);
```

### **Config value resolution** with nullish fallback

@keywords: config, resolution, fallback, nullish, settings

Resolve configuration values handling null, undefined, and NaN.

```typescript
defaultTo(config.timeout, 5000);   // => 5000 if undefined
defaultTo(config.threshold, 0.5);  // => 0.5 if NaN
```
