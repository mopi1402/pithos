## `isRegExp`

### **Validate** user-provided patterns 📍

@keywords: validate, regex, pattern, user-input, security, sanitize

Check if a value is a valid RegExp before using it for matching.
Essential for search features accepting user-defined patterns.

```typescript
function createSearchFilter(pattern: unknown) {
  if (isRegExp(pattern)) {
    return (text: string) => pattern.test(text);
  }
  // Fallback to string includes
  return (text: string) => text.includes(String(pattern));
}

const filter = createSearchFilter(/error/i);
const logs = ['Error: failed', 'Success', 'ERROR: timeout'];
const errors = logs.filter(filter); // ['Error: failed', 'ERROR: timeout']
```

### **Type-guard** in generic utilities

@keywords: type-guard, generic, utility, narrowing, typescript

Narrow unknown values to RegExp in type-safe utility functions.
Perfect for building flexible validation or transformation pipelines.

```typescript
function matchAny(value: unknown, patterns: unknown[]): boolean {
  return patterns.some(pattern => {
    if (isRegExp(pattern)) {
      return pattern.test(String(value));
    }
    return String(value) === String(pattern);
  });
}

matchAny('hello world', [/^hello/, 'goodbye']); // true
matchAny('test', [/^hello/, 'goodbye']);        // false
```

### **Serialize** configuration objects

@keywords: serialize, config, json, regex, storage, persistence

Identify RegExp values when serializing configs that may contain patterns.
Useful for storing user preferences with custom regex filters.

```typescript
function serializeConfig(config: Record<string, unknown>) {
  return JSON.stringify(config, (key, value) => {
    if (isRegExp(value)) {
      return { __type: 'RegExp', source: value.source, flags: value.flags };
    }
    return value;
  });
}

const config = { filter: /error|warn/i, maxLines: 100 };
serializeConfig(config);
// '{"filter":{"__type":"RegExp","source":"error|warn","flags":"i"},"maxLines":100}'
```
