## `pullAt`

### **Extract** elements at indices 📍

@keywords: extract, indices, splice, remove

Remove and return elements at specific indices.

```typescript
const items = ["a", "b", "c", "d", "e"];
const indices = new Set([1, 3]);
const extracted = items.filter((_, i) => indices.has(i));
const remaining = items.filter((_, i) => !indices.has(i));
// extracted: ["b", "d"], remaining: ["a", "c", "e"]
```

### **Remove** by position

@keywords: remove, position, index, splice

Remove elements at known positions.

```typescript
const arr = [10, 20, 30, 40, 50];
const keep = arr.filter((_, i) => i !== 2);
// => [10, 20, 40, 50]
```

### **Extract** multiple positions

@keywords: extract, multiple, positions, batch

Get elements at multiple indices.

```typescript
const data = ["a", "b", "c", "d"];
[0, 2].map(i => data[i]);
// => ["a", "c"]
```
