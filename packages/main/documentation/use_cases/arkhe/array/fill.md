## `fill`

### **Initialize game board** or grid 📍

@keywords: initialize, board, grid, array, static, immutable

Create an array filled with a static initial value.
Immutable alternative to `new Array(n).fill(v)`.

```typescript
// Create a row of empty slots
const emptyRow = fill(new Array(5), "empty");
// => ["empty", "empty", "empty", "empty", "empty"]
```

### **Reset status flags**

@keywords: reset, status, flags, range, bulk, update

Reset a specific range of values within an array without mutating the original.
Useful for bulk updates or resetting state.

```typescript
const steps = ["done", "done", "error", "pending"];

// Reset steps 1 and 2 (indices 1 to 3) to "retry"
const retrying = fill(steps, "retry", 1, 3);
// => ["done", "retry", "retry", "pending"]
```
