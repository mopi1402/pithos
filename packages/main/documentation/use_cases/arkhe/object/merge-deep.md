## `mergeDeepLeft` / `mergeDeepRight`

### **Apply** user settings over defaults 📍

@keywords: settings, config, defaults, override, preferences, merge, design system

Merge user preferences with default configuration, controlling precedence.
Essential for application settings where users customize behavior.

```typescript
const defaults = {
  theme: { mode: 'light', fontSize: 14, colors: { primary: '#007bff' } },
  notifications: { email: true, push: false }
};

const userPrefs = {
  theme: { mode: 'dark', colors: { primary: '#ff6b6b' } }
};

// User prefs take precedence
const config = mergeDeepRight(defaults, userPrefs);
// {
//   theme: { mode: 'dark', fontSize: 14, colors: { primary: '#ff6b6b' } },
//   notifications: { email: true, push: false }
// }
```

### **Merge** overlay config with position overrides

@keywords: overlay, config, merge, position, dialog, design system

Deep merge base overlay configuration with position-specific overrides.
Essential for overlay systems where position strategies add nested config.

```typescript
const baseOverlayConfig = {
  position: { type: "global", centerHorizontally: true },
  scroll: { strategy: "block" },
  backdrop: { class: "overlay-backdrop", clickClose: true },
};

const bottomSheetOverrides = {
  position: { type: "global", bottom: "0", centerHorizontally: true },
  scroll: { strategy: "reposition" },
};

const bottomSheetConfig = mergeDeepRight(baseOverlayConfig, bottomSheetOverrides);
// => { position: { type: "global", bottom: "0", centerHorizontally: true },
//      scroll: { strategy: "reposition" },
//      backdrop: { class: "overlay-backdrop", clickClose: true } }
```

### **Layer** design system theme tokens

@keywords: theme, tokens, layer, override, design system, presets

Deep merge base theme tokens with variant-specific overrides.
Essential for design systems with theme variants (light, dark, high-contrast).

```typescript
const baseTheme = {
  colors: { primary: "#3b82f6", background: "#ffffff", text: "#111827" },
  spacing: { unit: 8, scale: [0, 4, 8, 16, 24, 32] },
  typography: { fontFamily: "Inter", baseFontSize: 16 },
};

const darkOverrides = {
  colors: { background: "#1a1a2e", text: "#e0e0e0" },
};

const darkTheme = mergeDeepRight(baseTheme, darkOverrides);
// => colors.primary preserved, background and text overridden
// => spacing and typography fully preserved
```

### **Layer** environment configurations

@keywords: environment, config, layer, override, production, development

Build configuration by layering environment-specific values over base config.
Perfect for multi-environment deployments.

```typescript
const baseConfig = {
  api: { timeout: 5000, retries: 3 },
  logging: { level: 'info', format: 'json' }
};

const prodOverrides = {
  api: { timeout: 10000 },
  logging: { level: 'warn' }
};

// Production values override base
const prodConfig = mergeDeepRight(baseConfig, prodOverrides);
// { api: { timeout: 10000, retries: 3 }, logging: { level: 'warn', format: 'json' } }
```

### **Preserve** original values with fallbacks

@keywords: preserve, fallback, defaults, immutable, safe-merge

Use mergeDeepLeft when the first object should take precedence.
Useful for applying fallbacks without overwriting existing values.

```typescript
const existingData = {
  user: { name: 'John', preferences: { theme: 'dark' } }
};

const fallbackData = {
  user: { name: 'Guest', preferences: { theme: 'light', language: 'en' } }
};

// Existing data preserved, fallbacks fill gaps
const result = mergeDeepLeft(existingData, fallbackData);
// { user: { name: 'John', preferences: { theme: 'dark', language: 'en' } } }
```

### **Combine** partial updates

@keywords: partial, update, patch, state, immutable, performance

Merge partial updates into existing state immutably.
Essential for Redux-style state management.

```typescript
interface AppState {
  user: { name: string; settings: { notifications: boolean } };
  ui: { sidebar: boolean };
}

function applyUpdate(state: AppState, update: Partial<AppState>): AppState {
  return mergeDeepRight(state, update) as AppState;
}

const state = { user: { name: 'John', settings: { notifications: true } }, ui: { sidebar: true } };
const updated = applyUpdate(state, { ui: { sidebar: false } });
// user unchanged, ui.sidebar now false
```
