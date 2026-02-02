## `flatMapDeep`

### **Map** and deeply flatten 📍

@keywords: flatMap, deep, flatten, recursive

Transform and flatten all nesting levels.

```typescript
const data = [{ nested: [[1, 2], [3]] }, { nested: [[4]] }];
data.flatMap(d => d.nested).flat(Infinity);
// => [1, 2, 3, 4]
```

### **Extract** deeply nested

@keywords: extract, nested, deep, collect

Collect all values from deep structures.

```typescript
const tree = [{ children: [[a], [[b, c]]] }];
tree.flatMap(n => n.children).flat(Infinity);
```

### **Flatten** recursive structure

@keywords: flatten, recursive, tree, hierarchy

Process hierarchical data into flat list.

```typescript
const items = [{ sub: [[1], [[2, 3]]] }];
items.map(i => i.sub).flat(Infinity);
// => [1, 2, 3]
```
