## `isPlainObject` 💎

> Distinguishes true dictionaries from arrays, null, or class instances.

### **Identify** configuration objects 📍

@keywords: identify, configuration, dictionary, plain, objects, JSON

Ensure a value is a simple dictionary `{}` and not a complex object instance.
Perfect for merging configs or validating JSON payloads.

```typescript
if (isPlainObject(config)) {
  // Safe to merge or spread
  const merged = { ...defaultConfig, ...config };
}
```

### **Deep clone** decision logic

@keywords: clone, deep, recursion, copying, serialization, logic

Determine if a value needs recursive cloning or can be copied by reference.
```typescript
function deepClone(value: unknown): unknown {
  if (!isPlainObject(value)) {
    return value; // Primitives, arrays handled elsewhere, class instances kept as-is
  }
  
  const result: Record<string, unknown> = {};
  for (const key in value) {
    result[key] = deepClone(value[key]);
  }
  return result;
}
```
