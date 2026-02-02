## `isFinite`

### **Check** finite number 📍

@keywords: finite, number, validate, check

Verify a number is finite (not Infinity or NaN).

```typescript
Number.isFinite(42);       // => true
Number.isFinite(Infinity); // => false
Number.isFinite(NaN);      // => false
```

### **Validate** calculation result

@keywords: validate, calculation, overflow

Ensure calculation didn't overflow.

```typescript
const result = 1 / x;
if (Number.isFinite(result)) {
  // Safe to use
}
```

### **Filter** valid numbers

@keywords: filter, valid, numbers

Remove infinite values.

```typescript
const nums = [1, Infinity, 3, -Infinity, 5];
nums.filter(Number.isFinite);
// => [1, 3, 5]
```
