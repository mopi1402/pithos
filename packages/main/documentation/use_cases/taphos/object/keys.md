## `keys` / `values` / `toPairs`

### **Get** object keys 📍

@keywords: keys, properties, names, object

Get all property names.

```typescript
Object.keys(obj);     // => ["a", "b", "c"]
Object.values(obj);   // => [1, 2, 3]
Object.entries(obj);  // => [["a", 1], ["b", 2], ["c", 3]]
```

### **Iterate** properties

@keywords: iterate, properties, entries, loop

Loop over object properties.

```typescript
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

### **Transform** object

@keywords: transform, map, entries, convert

Transform using entries.

```typescript
Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v * 2])
);
```
