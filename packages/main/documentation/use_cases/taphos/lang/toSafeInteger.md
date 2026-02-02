## `toSafeInteger`

### **Convert** to safe integer 📍

@keywords: safe, integer, convert, clamp

Convert to integer within safe range.

```typescript
const safe = Math.max(
  Number.MIN_SAFE_INTEGER,
  Math.min(Number.MAX_SAFE_INTEGER, Math.trunc(Number(value)))
);
```

### **Clamp** large numbers

@keywords: clamp, large, number, precision

Ensure number stays within safe precision.

```typescript
function safeId(id: number): number {
  const int = Math.trunc(id);
  return Math.max(
    Number.MIN_SAFE_INTEGER,
    Math.min(Number.MAX_SAFE_INTEGER, int)
  );
}
```
