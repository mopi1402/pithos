## `castComparator` ⭐

### **Sort arrays** by property 📍

@keywords: sort, arrays, property, comparator, ordering, reusable

Create reusable comparators for Array.sort() with property names.
Essential for clean, readable sorting code.

```typescript
const users = [
  { name: "John", age: 25 }, 
  { name: "Jane", age: 30 }
];

users.sort(castComparator("age"));
// [{ name: "John", age: 25 }, { name: "Jane", age: 30 }]
```

### **Sort arrays** by computed values

@keywords: sort, computed, values, transformation, custom, comparison

Sort by computed values, custom comparison functions, and reverse order.
Essential for complex sorting requirements.

```typescript
const files = ["report.pdf", "image.png", "data.json"];

// Sort by extension length
files.sort(castComparator((f) => f.split(".").pop()?.length));
```

### **Sort in** reverse order

@keywords: sort, reverse, descending, order, direction, flip

Sort arrays in descending order with simple parameter.
Essential for common reverse sorting needs.

```typescript
users.sort(castComparator("age", { reverse: true }));
// [{ name: "Jane", age: 30 }, { name: "John", age: 25 }]
```
