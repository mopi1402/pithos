## `defer`

### **Defer** execution 📍

@keywords: defer, async, next tick, delay

Execute function after current call stack.

```typescript
queueMicrotask(() => {
  console.log("Deferred");
});
```

### **Defer** to next tick

@keywords: defer, next, tick, async

Schedule for next event loop iteration.

```typescript
setTimeout(() => {
  updateUI();
}, 0);
```

### **Non-blocking** operation

@keywords: non-blocking, async, schedule

Allow current execution to complete first.

```typescript
Promise.resolve().then(() => {
  heavyComputation();
});
```
