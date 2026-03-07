## `mapKeys`

### **Rename** object keys 📍

@keywords: rename, keys, transform, casing, camelCase, snake_case

Transform all keys of an object using a function.
Useful for standardizing casing (e.g., snake_case to camelCase).

```typescript
const camelCased = mapKeys(snakeObj, (_, key) => toCamelCase(key));
```

### **Normalize** HTTP headers

@keywords: normalize, headers, HTTP, lowercase, case-insensitive, standardize, i18n

Convert all header names to lowercase for consistent case-insensitive lookup.

```typescript
const headers = { 'Content-Type': 'json', 'X-Auth': 'token' };
const normalized = mapKeys(headers, (_, k) => k.toLowerCase());
// { 'content-type': 'json', 'x-auth': 'token' }
```

### **Prefix** keys

@keywords: prefix, keys, namespace, environment, variables, merging, scripts, ci/cd

Add a namespace prefix to all keys in an object.
Useful for merging data into flat structures like environment variables.

```typescript
const env = mapKeys(config, (_, key) => `APP_${key.toUpperCase()}`);
// { APP_HOST: 'localhost', APP_PORT: 3000 }
```

### **Convert** API response keys for frontend consumption

@keywords: convert, API, response, keys, camelCase, snake_case, i18n, scripts

Transform snake_case API response keys to camelCase for frontend use.
Essential for any app consuming REST APIs with different naming conventions.

```typescript
const apiResponse = { user_name: "Alice", created_at: "2025-01-15", is_active: true };

const frontendData = mapKeys(apiResponse, (_, key) => camelCase(key));
// => { userName: "Alice", createdAt: "2025-01-15", isActive: true }
```

### **Namespace** CSS custom properties from design tokens

@keywords: CSS, custom properties, namespace, design system, tokens, variables

Prefix design token keys to generate CSS custom property names.
Perfect for design system build tools generating CSS variables.

```typescript
const tokens = { primary: "#3b82f6", secondary: "#6b7280", spacing: "16px" };

const cssVars = mapKeys(tokens, (_, key) => `--ds-${kebabCase(key)}`);
// => { "--ds-primary": "#3b82f6", "--ds-secondary": "#6b7280", "--ds-spacing": "16px" }

// Apply to root element
Object.entries(cssVars).forEach(([prop, value]) => {
  document.documentElement.style.setProperty(prop, value);
});
```
