## `pullAllWith`

### **Remove** with custom comparator 📍

@keywords: remove, filter, comparator, custom, objects

Remove values using custom equality comparison.

```typescript
const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
const toRemove = [{ id: 2 }];
const result = users.filter(u => 
  !toRemove.some(r => r.id === u.id)
);
// [{ id: 1 }, { id: 3 }]
```

### **Filter** by property

@keywords: filter, property, match, objects

Remove objects matching specific criteria.

```typescript
const products = [
  { sku: 'A1', stock: 0 },
  { sku: 'B2', stock: 5 },
  { sku: 'C3', stock: 0 }
];
const outOfStock = products.filter(p => p.stock > 0);
// [{ sku: 'B2', stock: 5 }]
```
