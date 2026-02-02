## `flattenDepth`

### **Flatten** to specific depth 📍

@keywords: flatten, depth, controlled, levels

Flatten arrays to a controlled depth.

```typescript
const nested = [1, [2, [3, [4]]]];
nested.flat(2);
// => [1, 2, 3, [4]]
```

### **Normalize** structured data

@keywords: normalize, structured, levels, hierarchy

Control how many levels of nesting to remove.

```typescript
const data = [[a], [[b], [[c]]]];
data.flat(2);
// => [a, [b], [c]]
```

### **Process** multi-level groups

@keywords: process, groups, levels, partial

Partially flatten grouped data.

```typescript
const groups = [[[item1, item2]], [[item3]]];
groups.flat(1);
// => [[item1, item2], [item3]]
```
