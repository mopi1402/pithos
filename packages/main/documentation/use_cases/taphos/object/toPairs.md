## `toPairs`

### **Convert** to entries 📍

@keywords: entries, pairs, object, array

Convert object to array of key-value pairs.

```typescript
Object.entries({ a: 1, b: 2 });
// [['a', 1], ['b', 2]]
```

### **Transform** and rebuild

@keywords: transform, map, rebuild, object

Transform object via entries.

```typescript
const doubled = Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v * 2])
);
```
