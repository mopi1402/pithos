## `flatMapDepth`

### **Map** and flatten to depth 📍

@keywords: flatMap, depth, controlled, levels

Transform and flatten to a specific depth.

```typescript
const data = [{ items: [["a"], ["b"]] }];
data.flatMap(d => d.items).flat(1);
// => ["a", "b"]
```

### **Control** flattening level

@keywords: control, level, depth, partial

Flatten only a certain number of levels.

```typescript
const nested = [[[[1]], [[2]]]];
nested.flat(2);
// => [[1], [2]]
```

### **Partial** flatten

@keywords: partial, flatten, preserve, structure

Keep some nesting while flattening others.

```typescript
const groups = [[[a, b]], [[c, d]]];
groups.flat(1);
// => [[a, b], [c, d]]
```
