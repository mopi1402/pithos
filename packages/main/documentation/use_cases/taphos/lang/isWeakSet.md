## `isWeakSet`

### **Check** WeakSet 📍

@keywords: weakset, set, check, instanceof

Check if value is a WeakSet.

```typescript
new WeakSet() instanceof WeakSet;  // true
new Set() instanceof WeakSet;      // false
```

### **Type** detection

@keywords: type, detection, collection

Identify collection type for serialization.

```typescript
function getCollectionType(value: unknown) {
  if (value instanceof WeakSet) return 'WeakSet';
  if (value instanceof Set) return 'Set';
  if (Array.isArray(value)) return 'Array';
  return 'unknown';
}
```
