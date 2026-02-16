## `pluck` 💎

> Extract a single property from every object in a collection — cleaner than map + accessor.

### **Extract** property from objects 📍

@keywords: extract, pluck, property, values

Get a specific property from each object in a collection.

```typescript
const users = [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }];
users.map(u => u.name);
// => ["Alice", "Bob", "Charlie"]
```

### **Get** IDs from collection

@keywords: get, IDs, collection, identifiers

Extract identifiers from a list of objects.

```typescript
const products = [{ id: 1 }, { id: 2 }, { id: 3 }];
products.map(p => p.id);
// => [1, 2, 3]
```

### **Collect** nested values

@keywords: collect, nested, values, paths

Extract deeply nested properties.

```typescript
const items = [{ meta: { score: 10 } }, { meta: { score: 20 } }];
items.map(i => i.meta.score);
// => [10, 20]
```
