## `flattenDeep`

### **Flatten** deeply nested structures 📍

@keywords: flatten, deep, nested, recursive

Flatten all levels of nesting in arrays.

```typescript
const nested = [1, [2, [3, [4, [5]]]]];
nested.flat(Infinity);
// => [1, 2, 3, 4, 5]
```

### **Normalize** tree data

@keywords: normalize, tree, data, hierarchy

Extract all items from a tree structure.

```typescript
const tree = [node1, [node2, [node3, node4]]];
tree.flat(Infinity);
// => [node1, node2, node3, node4]
```

### **Collect** all leaf values

@keywords: collect, leaf, values, recursive

Get all leaf values from nested data.

```typescript
const data = [[a, [b, c]], [[d], e]];
data.flat(Infinity);
// => [a, b, c, d, e]
```
