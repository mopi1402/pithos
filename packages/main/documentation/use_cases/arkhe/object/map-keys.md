## `mapKeys`

### **Rename** object keys 📍

@keywords: rename, keys, transform, casing, camelCase, snake_case

Transform all keys of an object using a function.
Useful for standardizing casing (e.g., snake_case to camelCase).

```typescript
const camelCased = mapKeys(snakeObj, (_, key) => toCamelCase(key));
```

### **Normalize** HTTP headers

@keywords: normalize, headers, HTTP, lowercase, case-insensitive, standardize

Convert all header names to lowercase for consistent case-insensitive lookup.

```typescript
const headers = { 'Content-Type': 'json', 'X-Auth': 'token' };
const normalized = mapKeys(headers, (_, k) => k.toLowerCase());
// { 'content-type': 'json', 'x-auth': 'token' }
```

### **Prefix** keys

@keywords: prefix, keys, namespace, environment, variables, merging

Add a namespace prefix to all keys in an object.
Useful for merging data into flat structures like environment variables.

```typescript
const env = mapKeys(config, (_, key) => `APP_${key.toUpperCase()}`);
// { APP_HOST: 'localhost', APP_PORT: 3000 }
```
