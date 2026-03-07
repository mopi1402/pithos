## `has`

### **Check** property existence 📍

@keywords: check, property, existence, validation, own, hasOwnProperty

Safely check if an object has a property as its own key (not inherited).
Essential for robust validation against prototypes.

```typescript
if (has(data, 'result')) {
  process(data.result);
}
```

### **Detect** explicit `undefined`

@keywords: detect, undefined, explicit, missing, differentiate, validation

Distinguish between a property that exists but is `undefined` vs a missing property.
`get()` returns `undefined` in both cases, `has()` differentiates.

```typescript
const obj = { start: undefined };
has(obj, 'start'); // true
has(obj, 'end');   // false
```

### **Validate** dynamic keys

@keywords: validate, dynamic, keys, variable, cache, lookup, performance

Check for the presence of a key when the key name is variable.
Useful in loops or dynamic logic.

```typescript
const key = getCurrentKey();
if (!has(cache, key)) {
  loadData(key);
}
```

### **Detect** high contrast mode for accessible rendering

@keywords: high contrast, forced colors, a11y, accessibility, design system, browser permissions

Check if the browser is in high contrast / forced colors mode.
Essential for design systems that need to adapt visuals for accessibility.

```typescript
const hasHighContrast = has(window, "matchMedia") &&
  window.matchMedia("(forced-colors: active)").matches;

if (hasHighContrast) {
  // Use system colors instead of custom palette
  applyHighContrastTheme();
}
```

### **Check** for Resize Observer support before observing

@keywords: resize, observer, support, polyfill, design system, browser permissions

Verify ResizeObserver exists before using it for responsive components.
Critical for CDK-style observers that adapt to container size changes.

```typescript
const canObserveResize = has(window, "ResizeObserver");

if (canObserveResize) {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      updateComponentSize(entry.contentRect);
    }
  });
  observer.observe(containerElement);
} else {
  // Fallback: listen to window resize
  window.addEventListener("resize", () => updateComponentSize(containerElement.getBoundingClientRect()));
}
```

### **Check** feature support before using browser APIs

@keywords: feature, detection, browser, API, progressive, browser permissions, PWA

Verify a browser API exists before calling it.
Essential for progressive enhancement and cross-browser compatibility.

```typescript
const canShare = has(navigator, "share");
const canVibrate = has(navigator, "vibrate");

if (canShare) {
  navigator.share({ title: "Check this out", url: window.location.href });
} else {
  showCopyLinkFallback();
}
```
