## `isFinite`

### **Validate** finite number 📍

@keywords: finite, number, validate, infinity

Check if value is a finite number.

```typescript
Number.isFinite(42);        // true
Number.isFinite(Infinity);  // false
Number.isFinite(NaN);       // false
```

### **Guard** calculations

@keywords: guard, calculation, safe, division

Ensure calculation results are valid.

```typescript
const result = a / b;
if (Number.isFinite(result)) {
  return result;
}
return 0;  // fallback for Infinity/NaN
```
