## `pullAllBy` / `pullAllWith`

### **Remove** by property 📍

@keywords: pull, remove, property, iteratee

Remove objects matching a property value.

```typescript
const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
const toRemove = new Set([1, 3]);
users.filter(u => !toRemove.has(u.id));
// => [{ id: 2 }]
```

### **Remove** with custom comparator

@keywords: remove, comparator, custom, match

Remove using a custom comparison function.

```typescript
const items = [{ x: 1 }, { x: 2 }, { x: 3 }];
const exclude = [{ x: 2 }];
items.filter(a => !exclude.some(b => a.x === b.x));
// => [{ x: 1 }, { x: 3 }]
```

### **Filter** by transformed value

@keywords: filter, transform, map, exclude

Exclude items based on a derived value.

```typescript
const words = ["hello", "WORLD", "foo"];
const excludeLower = new Set(["hello", "foo"]);
words.filter(w => !excludeLower.has(w.toLowerCase()));
// => ["WORLD"]
```
