## `times` ⭐

### **Repeat** operations 📍

@keywords: repeat, operations, loop, invoke, collect, functional

Invoke a function `n` times and collect the results.
Cleaner than `for` loops or `Array.from({ length: n })`.
```typescript
const ids = times(5, (index) => `id-${index}`);
// ['id-0', 'id-1', 'id-2', 'id-3', 'id-4']
```

### **Generate** test fixtures

@keywords: generate, fixtures, testing, mocks, data, objects

Create multiple mock objects for testing.
```typescript
const mockUsers = times(10, (index) => ({
  id: index,
  name: `User ${index}`,
  email: `user${index}@test.com`
}));
```

### **Initialize** grid data

@keywords: initialize, grid, matrix, data, structures, populate

Populate matrices or grid structures.
```typescript
const grid = times(rows, (row) =>
  times(cols, (col) => ({ row, col, value: null }))
);
```
