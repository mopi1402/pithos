## `without`

### **Remove** specific values 📍

@keywords: remove, exclude, filter, values

Filter out specific values from an array.

```typescript
const items = [1, 2, 3, 4, 5];
items.filter(x => x !== 3);
// => [1, 2, 4, 5]
```

### **Exclude** multiple values

@keywords: exclude, multiple, filter, set

Remove several values at once.

```typescript
const all = [1, 2, 3, 4, 5];
const exclude = new Set([2, 4]);
all.filter(x => !exclude.has(x));
// => [1, 3, 5]
```

### **Remove** from selection

@keywords: remove, selection, toggle, UI

Remove items from a multi-select.

```typescript
const selected = ["a", "b", "c", "d"];
selected.filter(x => x !== "b");
// => ["a", "c", "d"]
```
