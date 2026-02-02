## `isWeakMap` / `isWeakSet`

### **Check** weak collection 📍

@keywords: WeakMap, WeakSet, check, collection

Check for weak collection types.

```typescript
value instanceof WeakMap;
value instanceof WeakSet;
```

### **Validate** collection type

@keywords: validate, collection, type, weak

Ensure correct collection type.

```typescript
if (cache instanceof WeakMap) {
  return cache.get(key);
}
```

### **Type** narrowing

@keywords: type, narrow, guard, instance

TypeScript type guard.

```typescript
const isWeakMap = (v: unknown): v is WeakMap<object, unknown> =>
  v instanceof WeakMap;
```
