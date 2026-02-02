## `parsePath` ⭐

> Powers `get()` and `set()` under the hood. Handles both dot notation and bracket syntax in a single pass.

### **Resolve** object paths 📍

@keywords: resolve, paths, notation, dot, bracket, keys

Convert dot or bracket notation strings into an array of keys.
Critical for implementing safe deep property access.
```typescript
const keys = parsePath('users[0].details.name');
// ['users', '0', 'details', 'name']
```

### **Support** dynamic form bindings

@keywords: support, forms, bindings, dynamic, state, paths

Parse field paths for form libraries or state management.
```typescript
const path = parsePath('order.items[2].quantity');
// ['order', 'items', '2', 'quantity']

// Use with get/set
const value = get(formState, path);
```

### **Handle** edge cases gracefully

@keywords: handle, edge-cases, mixed, notation, parsing, robust

Parse paths with mixed notation styles consistently.
```typescript
parsePath('data["special-key"].items[0]');
// ['data', 'special-key', 'items', '0']

parsePath('simple');
// ['simple']

parsePath('[0][1][2]');
// ['0', '1', '2']
```
