## `deepCloneFull` 💎

> A comprehensive cloning utility that handles binary attributes (Buffers, TypedArrays) and special objects (Date, RegExp, Map, Set).

### **Clone** complex data structures 📍

@keywords: clone, complex, binary, Date, Map, Set, deep

Deep copy objects containing binary data, Dates, or Maps.
Critical for specialized applications dealing with rich data types.

```typescript
const message = {
  id: 1,
  payload: new Uint8Array([0x1, 0x2]),
  timestamp: new Date()
};
const clone = deepCloneFull(message);
```

### **Duplicate** Error objects

@keywords: duplicate, Error, exceptions, stack, logging, copy

Create a copy of an Error object, preserving stack and name.
Useful for logging or re-throwing errors with modifications.

```typescript
const error = new Error('Something failed');
const copy = deepCloneFull(error);
copy.message = 'New message'; // Original is untouched
```

### **Copy** Map/Set collections

@keywords: copy, Map, Set, collections, deep, structure

Deeply clone native collections while preserving their structure.
Essential for applications heavily using `Map` or `Set`.

```typescript
const map = new Map([['a', { v: 1 }]]);
const clone = deepCloneFull(map);
clone.get('a').v = 2; // Deep cloned, original { v: 1 } safe
```
