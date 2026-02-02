## `delay`

### **Delay** execution 📍

@keywords: delay, timeout, wait, schedule

Execute function after specified time.

```typescript
setTimeout(() => {
  showNotification();
}, 2000);
```

### **Debounce** manually

@keywords: debounce, wait, timeout

Simple debounce pattern.

```typescript
let timer;
const delayed = () => {
  clearTimeout(timer);
  timer = setTimeout(action, 300);
};
```

### **Sequence** operations

@keywords: sequence, timing, animation

Chain timed operations.

```typescript
await new Promise(r => setTimeout(r, 1000));
nextStep();
```
