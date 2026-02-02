## `tap`

### **Debug** in chain 📍

@keywords: tap, debug, chain, inspect

Inspect value in method chain.

```typescript
const result = data
  .filter(x => x > 0)
  .map(x => x * 2)
  .tap(console.log)  // Native: just inline
  // Use: .map(x => (console.log(x), x))
  .reduce((a, b) => a + b);
```

### **Side effect** in pipeline

@keywords: side effect, pipeline, log

Perform side effect without changing value.

```typescript
const withLog = arr
  .filter(Boolean)
  .map(x => { console.log(x); return x; });
```

### **Inline** inspection

@keywords: inline, inspect, debug, comma

Use comma operator for inline debugging.

```typescript
arr.map(x => (console.log(x), transform(x)));
```
