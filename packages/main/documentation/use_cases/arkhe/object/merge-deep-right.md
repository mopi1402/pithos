## `mergeDeepRight` ⭐

### **Merge** with override precedence 📍

@keywords: merge, override, precedence, right, configuration, patch, design system, presets

Merge objects recursively where the second object (right) overrides the first.
Essential for applying configuration overrides or patching state.

```typescript
const finalConfig = mergeDeepRight(defaultConfig, userConfig);
// userConfig overrides defaults
```

### **Patch** complex state

@keywords: patch, state, update, partial, reducer, deep

Apply a partial update to a deep state tree.
Critical for reducer logic in state management.

```typescript
const nextState = mergeDeepRight(currentState, {
  ui: { sidebar: { isOpen: true } } // Only updates isOpen, preserves other ui props
});
```

### **Combine** nested defaults

@keywords: combine, nested, defaults, layers, configuration, override

Merge layers of configuration where inner layers override outer ones.

```typescript
const effective = mergeDeepRight(globalProps, localProps);
```

### **Apply** user theme overrides to a design system

@keywords: theme, overrides, design system, customization, presets, colors

Merge user color preferences over the default design system theme.
Essential for white-label products and customizable design systems.

```typescript
const defaultTheme = {
  colors: { primary: "#3b82f6", secondary: "#6b7280", bg: "#fff", text: "#111" },
  fonts: { body: "Inter", heading: "Inter", mono: "Fira Code" },
  radii: { sm: "4px", md: "8px", lg: "16px" },
};

const brandOverrides = {
  colors: { primary: "#e11d48", secondary: "#be123c" },
  fonts: { heading: "Playfair Display" },
};

const brandTheme = mergeDeepRight(defaultTheme, brandOverrides);
// colors.bg = "#fff" (preserved), colors.primary = "#e11d48" (overridden)
// fonts.body = "Inter" (preserved), fonts.heading = "Playfair Display" (overridden)
```

### **Merge** CI/CD pipeline overrides per environment

@keywords: CI, CD, pipeline, environment, override, config, scripts, ci/cd

Apply environment-specific overrides to a base CI configuration.
Critical for multi-environment deployment pipelines.

```typescript
const basePipeline = {
  build: { command: "pnpm build", env: { NODE_ENV: "production" } },
  test: { command: "pnpm test", timeout: 60000 },
  deploy: { provider: "aws", region: "us-east-1", replicas: 2 },
};

const stagingOverrides = {
  deploy: { region: "eu-west-1", replicas: 1 },
  test: { timeout: 120000 },
};

const stagingPipeline = mergeDeepRight(basePipeline, stagingOverrides);
// deploy.provider = "aws" (preserved), deploy.region = "eu-west-1" (overridden)
```
