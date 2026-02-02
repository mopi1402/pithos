## `transform`

### **Accumulate** from object 📍

@keywords: transform, accumulate, reduce, object

Iterate and accumulate result.

```typescript
Object.entries(obj).reduce((acc, [key, value]) => {
  // transform logic
  return acc;
}, initialValue);
```

### **Group** by value

@keywords: group, invert, collect, values

Group keys by their values.

```typescript
const grouped = Object.entries({ a: 1, b: 2, c: 1 }).reduce(
  (acc, [k, v]) => {
    (acc[v] ||= []).push(k);
    return acc;
  },
  {} as Record<number, string[]>
);
// { 1: ['a', 'c'], 2: ['b'] }
```
