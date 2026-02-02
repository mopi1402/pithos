## `parseInt` / `parseInteger`

### **Parse** integer 📍

@keywords: parse, integer, number, convert

Parse string to integer.

```typescript
parseInt("42", 10);     // => 42
parseInt("42px", 10);   // => 42
Number.parseInt("42");  // => 42
```

### **Always** use radix

@keywords: radix, base, decimal, explicit

Always specify base 10.

```typescript
parseInt(value, 10);  // Explicit decimal
```

### **Validate** result

@keywords: validate, NaN, check, parse

Check for valid parse.

```typescript
const n = parseInt(input, 10);
if (Number.isNaN(n)) throw new Error("Invalid number");
```
