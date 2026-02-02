## `mockPerformance`

### **Control** timing 📍

@keywords: control, timing, performance, deterministic, timestamps, testing

Mock `performance.now()` to return deterministic timestamps.
Critical for testing animations, timeouts, or performance markers.
```typescript
const { restore } = mockPerformance({
  now: () => 1000
});
const time = performance.now(); // Always 1000
restore();
```

### **Test** duration calculations

@keywords: test, duration, elapsed, time, calculations, predictable

Verify elapsed time logic with predictable values.
```typescript
let time = 0;
const { restore } = mockPerformance({
  now: () => time
});

const start = performance.now();
time = 500;
const elapsed = performance.now() - start;

expect(elapsed).toBe(500);
restore();
```
