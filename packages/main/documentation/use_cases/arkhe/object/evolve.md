## `evolve` 💎

> A distinctively declarative way to transform object properties using functions.

### **Transform** specific fields 📍

@keywords: transform, fields, declarative, normalization, API, mapping, design system

Apply different transformation functions to specific keys in an object.
Perfect for normalizing data from API responses.

```typescript
const user = evolve(apiResponse, {
  name: (s) => s.trim(),
  age: (n) => Number(n),
});
```

### **Apply** nested transformations

@keywords: apply, nested, transformations, deep, state, declarative

Declaratively transform deeply nested properties.
Essential for modifying complex state trees.

```typescript
const state = evolve(appState, {
  settings: {
    theme: (t) => t.toLowerCase(),
    notifications: (n) => !n // Toggle boolean
  }
});
```

### **Sanitize** data conditionally

@keywords: sanitize, cleaning, conditional, validation, pipeline, data

Apply transformation logic that adapts to values.
Useful for data cleaning pipelines.

```typescript
const cleaned = evolve(data, {
  score: (n) => (n < 0 ? 0 : n), // Clamp to 0
  tags: (arr) => arr.filter(t => t.length > 0) // Remove empty tags
});
```

### **Normalize** i18n translation entries

@keywords: normalize, i18n, translation, trim, lowercase, internationalization

Clean up translation strings loaded from external sources.
Essential for i18n pipelines where translations may have inconsistent formatting.

```typescript
const rawTranslation = {
  greeting: "  Hello, World!  ",
  farewell: "  Goodbye  ",
  error: "  SOMETHING WENT WRONG  ",
};

const cleaned = evolve(rawTranslation, {
  greeting: (s) => s.trim(),
  farewell: (s) => s.trim(),
  error: (s) => s.trim().toLowerCase(),
});
// => { greeting: "Hello, World!", farewell: "Goodbye", error: "something went wrong" }
```

### **Transform** tree node properties for rendering

@keywords: tree, node, transform, render, icon, label, design system

Transform raw tree data into renderable node objects declaratively.
Essential for tree components that need computed display properties.

```typescript
const rawNode = {
  name: "components",
  childCount: 12,
  type: "directory",
  depth: 2,
};

const renderNode = evolve(rawNode, {
  name: (n) => `📁 ${n}`,
  childCount: (c) => `(${c} items)`,
  depth: (d) => d * 24, // Convert to pixel indentation
});
// => { name: "📁 components", childCount: "(12 items)", type: "directory", depth: 48 }
```

### **Adapt** overlay position for RTL layouts

@keywords: overlay, position, RTL, LTR, bidirectional, i18n, design system

Transform overlay position properties when switching between LTR and RTL.
Critical for design systems supporting bidirectional text.

```typescript
const ltrPosition = {
  left: 100,
  right: "auto",
  transformOrigin: "top left",
};

const toRTL = evolve(ltrPosition, {
  left: () => "auto",
  right: (r) => (r === "auto" ? 100 : r),
  transformOrigin: (o) => o.replace("left", "right"),
});
// => { left: "auto", right: 100, transformOrigin: "top right" }
```

### **Transform** design tokens for CSS output

@keywords: design, tokens, CSS, transform, variables, design system, presets

Convert raw design token values into CSS-ready formats.
Perfect for design system build pipelines generating CSS custom properties.

```typescript
const tokens = {
  spacing: 8,
  fontSize: 16,
  borderRadius: 4,
  opacity: 0.85,
};

const cssTokens = evolve(tokens, {
  spacing: (n) => `${n}px`,
  fontSize: (n) => `${n}px`,
  borderRadius: (n) => `${n}px`,
  opacity: (n) => String(n),
});
// => { spacing: "8px", fontSize: "16px", borderRadius: "4px", opacity: "0.85" }
```
