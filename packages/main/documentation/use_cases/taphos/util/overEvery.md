## `overEvery`

### **Combine** predicates with AND 📍

@keywords: predicates, every, all, combine, and

Check if all predicates pass.

```typescript
const predicates = [
  (n: number) => n > 0,
  (n: number) => n % 2 === 0
];
const isPositiveEven = (n: number) => predicates.every(fn => fn(n));
isPositiveEven(4);   // true
isPositiveEven(-2);  // false
```

### **Validate** multiple rules

@keywords: validate, rules, multiple, all

Ensure value passes all validation rules.

```typescript
const rules = [
  (s: string) => s.length >= 8,
  (s: string) => /[A-Z]/.test(s),
  (s: string) => /[0-9]/.test(s)
];
const isValidPassword = (s: string) => rules.every(r => r(s));
```
