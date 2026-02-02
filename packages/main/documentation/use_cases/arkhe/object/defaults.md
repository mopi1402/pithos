## `defaults` 💎

> Safely applies default values only where properties are `undefined`.

### **Initialize** configuration options 📍

@keywords: initialize, configuration, defaults, options, settings, library

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
