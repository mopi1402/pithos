## `stubArray`

### **Return** empty array 📍

@keywords: stub, array, empty, default

Return empty array as default.

```typescript
const getItems = () => [];
```

### **Default** factory

@keywords: default, factory, initialization

Use as default value factory.

```typescript
const cache = new Map<string, string[]>();
function getOrCreate(key: string) {
  if (!cache.has(key)) cache.set(key, []);
  return cache.get(key)!;
}
```
