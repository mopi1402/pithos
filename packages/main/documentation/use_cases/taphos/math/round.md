## `ceil` / `floor` / `round`

### **Round** numbers 📍

@keywords: round, ceil, floor, math

Round numbers to integers.

```typescript
Math.ceil(4.3);   // => 5
Math.floor(4.7);  // => 4
Math.round(4.5);  // => 5
```

### **Round** to decimals

@keywords: round, decimals, precision

Round to specific decimal places.

```typescript
const round2 = (n) => Math.round(n * 100) / 100;
round2(4.567);  // => 4.57
```

### **Pagination** math

@keywords: pagination, pages, ceil

Calculate page count.

```typescript
const totalPages = Math.ceil(totalItems / pageSize);
```
