## `eq` / `gt` / `gte` / `lt` / `lte`

### **Compare** values 📍

@keywords: compare, equality, greater, less

Standard comparison operators.

```typescript
a === b;  // eq
a > b;    // gt
a >= b;   // gte
a < b;    // lt
a <= b;   // lte
```

### **Sort** comparison

@keywords: sort, compare, order

Use in sort comparators.

```typescript
items.sort((a, b) => a.value - b.value);  // ascending
items.sort((a, b) => b.value - a.value);  // descending
```

### **Conditional** logic

@keywords: conditional, logic, if, check

Standard conditionals.

```typescript
if (age >= 18) { /* adult */ }
if (score > threshold) { /* pass */ }
```
