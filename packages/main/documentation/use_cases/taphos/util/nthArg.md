## `nthArg`

### **Extract** specific argument 📍

@keywords: argument, extract, nth, function

Create function that returns nth argument.

```typescript
const getSecond = (...args: unknown[]) => args[1];
getSecond('a', 'b', 'c');  // 'b'
```

### **Callback** adapter

@keywords: callback, adapter, argument, select

Adapt callback to use specific argument.

```typescript
// Get just the index from map callback
const getIndex = (_: unknown, i: number) => i;
['a', 'b', 'c'].map(getIndex);  // [0, 1, 2]
```
