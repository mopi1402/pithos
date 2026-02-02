## `toFinite` / `toInteger` / `toNumber` / `toSafeInteger`

### **Convert** to number 📍

@keywords: convert, number, parse, coerce

Convert values to numbers.

```typescript
Number(value);      // toNumber
parseInt(value, 10); // toInteger
Math.trunc(Number(value)); // toInteger
```

### **Safe** integer conversion

@keywords: safe, integer, bounds, clamp

Convert to safe integer range.

```typescript
const n = Number(value);
Math.min(Math.max(Math.trunc(n), Number.MIN_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
```

### **Handle** edge cases

@keywords: handle, edge, NaN, Infinity

Handle non-numeric values.

```typescript
const n = Number(value);
Number.isFinite(n) ? n : 0;
```
