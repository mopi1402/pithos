## `isPrimitive`

### **Check** for simple values

@keywords: check, primitive, simple, values, serialization, cloning

Verify if a value is a string, number, boolean, null, undefined, symbol, or bigint.
Essential for deep cloning recursion or serialization logic.

```typescript
if (isPrimitive(value)) {
  return value; // Return as-is
}
```
