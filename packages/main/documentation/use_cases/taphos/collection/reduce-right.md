## `reduceRight`

### **Process** from right to left 📍

@keywords: reduce, right, reverse, accumulate

Reduce array starting from the last element.

```typescript
const chars = ["a", "b", "c"];
chars.reduceRight((acc, c) => acc + c, "");
// => "cba"
```

### **Build** right-associative structure

@keywords: build, right, associative, structure

Create structures where order matters right-to-left.

```typescript
const ops = [1, 2, 3];
ops.reduceRight((acc, n) => ({ value: n, next: acc }), null);
// => { value: 1, next: { value: 2, next: { value: 3, next: null } } }
```

### **Compose** functions right-to-left

@keywords: compose, functions, right, pipeline

Apply functions in reverse order.

```typescript
const fns = [x => x + 1, x => x * 2, x => x - 3];
fns.reduceRight((val, fn) => fn(val), 10);
// => (10 - 3) * 2 + 1 = 15
```
