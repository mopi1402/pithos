## `invert`

### **Build** reverse enum lookups 📍

@keywords: build, reverse, enum, lookup, bidirectional, mapping

Create a reverse mapping from enum-like objects for bidirectional access.
Essential for converting between display names and internal codes.
```typescript
const StatusCode = { PENDING: 'P', APPROVED: 'A', REJECTED: 'R' };
const StatusLabel = invert(StatusCode);
// { 'P': 'PENDING', 'A': 'APPROVED', 'R': 'REJECTED' }

const label = StatusLabel[record.status]; // 'P' → 'PENDING'
```

### **Swap** keys and values

@keywords: swap, keys, values, reverse, mapping, bidirectional

Create a reverse lookup map from an object.
Useful for bidirectional mapping (e.g., ID to Name and Name to ID).
```typescript
const idMap = { admin: 1, user: 2 };
const roleMap = invert(idMap); // { '1': 'admin', '2': 'user' }
```

### **Index** by value

@keywords: index, value, lookup, search, find, key

Quickly find the key associated with a specific value.
```typescript
const colors = { red: '#ff0000', blue: '#0000ff' };
const colorName = invert(colors)['#ff0000']; // 'red'
```
