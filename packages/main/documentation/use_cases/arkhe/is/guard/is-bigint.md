## `isBigInt`

### **Validate** large number values 📍

@keywords: bigint, validation, large numbers, type guard

Validate BigInt values for precise calculations.
Essential for handling large monetary values or IDs.

```typescript
if (isBigInt(value)) {
  return (value / 100n).toString(); // Safe BigInt operations
}
```

### **Handle API responses** with mixed types 📍

@keywords: API, response, type guard, parsing

Handle responses that may contain BigInt values.

```typescript
const id = isBigInt(response.id) 
  ? response.id.toString() 
  : String(response.id);
```

### **Type-safe arithmetic** operations

@keywords: arithmetic, type safety, calculations

Ensure type safety before BigInt operations.

```typescript
if (isBigInt(a) && isBigInt(b)) {
  return a / b; // TypeScript knows both are bigint
}
```
