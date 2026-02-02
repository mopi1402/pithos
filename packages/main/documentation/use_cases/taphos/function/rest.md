## `rest`

### **Collect** remaining arguments 📍

@keywords: rest, spread, arguments, variadic

Collect remaining arguments into array.

```typescript
const log = (first, ...rest) => {
  console.log(first, rest);
};
log(1, 2, 3, 4); // => 1, [2, 3, 4]
```

### **Forward** arguments

@keywords: forward, proxy, wrapper

Pass through all but first arguments.

```typescript
const wrapper = (fn, ...args) => fn(...args);
```

### **Variadic** functions

@keywords: variadic, multiple, arguments

Accept any number of arguments.

```typescript
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
sum(1, 2, 3, 4); // => 10
```
