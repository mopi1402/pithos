## `spread`

### **Spread** array as arguments 📍

@keywords: spread, array, arguments, apply

Apply array elements as function arguments.

```typescript
const add = (a, b, c) => a + b + c;
const nums = [1, 2, 3];
add(...nums); // => 6
```

### **Call** with array

@keywords: call, apply, array

Use array as function parameters.

```typescript
Math.max(...[1, 5, 3, 9, 2]);
// => 9
```

### **Merge** arrays

@keywords: merge, combine, concat

Combine arrays using spread.

```typescript
const all = [...arr1, ...arr2, ...arr3];
```
