## `max` / `min`

### **Find** extremes 📍

@keywords: max, min, extreme, largest, smallest

Find largest or smallest value.

```typescript
Math.max(1, 5, 3);  // => 5
Math.min(1, 5, 3);  // => 1
```

### **From** array

@keywords: array, spread, max, min

Find extreme in array.

```typescript
Math.max(...numbers);
Math.min(...numbers);
```

### **Clamp** value

@keywords: clamp, bounds, range, limit

Limit value to range.

```typescript
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
clamp(15, 0, 10);  // => 10
```
