## `toFinite`

### **Convert** to finite 📍

@keywords: finite, convert, number, clamp

Convert value to finite number, clamping infinities.

```typescript
const n = Number(value);
const finite = Number.isFinite(n) 
  ? n 
  : (n > 0 ? Number.MAX_VALUE : (n < 0 ? -Number.MAX_VALUE : 0));
```

### **Safe** division result

@keywords: division, safe, infinity, fallback

Handle division that might produce infinity.

```typescript
function safeDivide(a: number, b: number): number {
  const result = a / b;
  if (!Number.isFinite(result)) {
    return result > 0 ? Number.MAX_VALUE : -Number.MAX_VALUE;
  }
  return result;
}
```
