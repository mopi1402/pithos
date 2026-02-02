## `castMapping` ⭐

### **Property access** simplification 📍

@keywords: property, access, mapping, transformation, simplification, boilerplate

Convert string property names to property accessor functions automatically.
Essential for reducing boilerplate in data transformation.

```typescript
const users = [{ id: 1 }, { id: 2 }];
const ids = users.map(castMapping("id")); 
// [1, 2]
```

### **Flexible API** design

@keywords: flexible, API, design, intuitive, polymorphic, overloading

Create functions that accept either property names or mapping functions.
Essential for building intuitive, flexible APIs.

```typescript
function extract(items, mapper) {
  const fn = castMapping(mapper);
  return items.map(fn);
}

extract(users, "id"); // [1, 2]
extract(users, (u) => u.id * 2); // [2, 4]
```
