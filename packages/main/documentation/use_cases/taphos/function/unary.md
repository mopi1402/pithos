## `unary` 💎

> Restrict a function to its first argument — the classic fix for `['1','2','3'].map(parseInt)`.

### **Limit** to one argument 📍

@keywords: unary, single, argument, limit

Create function that only accepts one argument.

```typescript
const toInt = s => parseInt(s, 10);
["1", "2", "3"].map(toInt);
// => [1, 2, 3]
```

### **Fix** map callback

@keywords: fix, map, callback, parseInt

Prevent extra arguments from affecting result.

```typescript
// Problem: parseInt gets index as radix
["1", "2", "3"].map(parseInt); // => [1, NaN, NaN]

// Solution: wrap to use only first arg
["1", "2", "3"].map(s => parseInt(s, 10)); // => [1, 2, 3]
```

### **Ignore** extra arguments

@keywords: ignore, extra, arguments, adapter

Adapter to ignore additional parameters.

```typescript
const first = (a) => a;
[1, 2, 3].map(first); // Only uses value, ignores index
```
