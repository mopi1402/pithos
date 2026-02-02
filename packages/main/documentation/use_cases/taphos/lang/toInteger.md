## `toInteger`

### **Convert** to integer 📍

@keywords: integer, convert, truncate, number

Convert value to integer by truncating decimals.

```typescript
Math.trunc(3.7);   // 3
Math.trunc(-3.7);  // -3
```

### **Parse** user input

@keywords: parse, input, integer, form

Convert string input to integer.

```typescript
const quantity = Math.trunc(Number(input));
```

### **Index** calculation

@keywords: index, array, calculation

Ensure array index is integer.

```typescript
const index = Math.trunc(position * items.length);
const item = items[index];
```
