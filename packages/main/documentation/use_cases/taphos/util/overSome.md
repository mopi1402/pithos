## `overSome`

### **Combine** predicates with OR 📍

@keywords: predicates, some, any, combine, or

Check if any predicate passes.

```typescript
const predicates = [
  (n: number) => n > 0,
  (n: number) => n % 2 === 0
];
const isPositiveOrEven = (n: number) => predicates.some(fn => fn(n));
isPositiveOrEven(-2);  // true (even)
isPositiveOrEven(-3);  // false
```

### **Match** any condition

@keywords: match, condition, any, filter

Filter items matching any condition.

```typescript
const matchers = [
  (s: string) => s.startsWith('error'),
  (s: string) => s.includes('fail')
];
const isError = (s: string) => matchers.some(m => m(s));
logs.filter(isError);
```
