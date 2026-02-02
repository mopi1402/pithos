## `isSafeInteger`

### **Validate** safe integer 📍

@keywords: safe, integer, precision, validate

Check if value is a safe integer (within IEEE-754 precision).

```typescript
Number.isSafeInteger(42);                 // true
Number.isSafeInteger(9007199254740991);   // true (MAX_SAFE_INTEGER)
Number.isSafeInteger(9007199254740992);   // false
```

### **Guard** ID operations

@keywords: id, precision, database, bigint

Ensure IDs don't lose precision.

```typescript
function processId(id: number) {
  if (!Number.isSafeInteger(id)) {
    throw new Error('ID too large, use BigInt');
  }
  return fetchRecord(id);
}
```
