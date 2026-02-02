## `cloneDeep`

### **Deep** copy object 📍

@keywords: clone, deep, copy, duplicate

Create deep copy of object.

```typescript
structuredClone(obj);
// or
JSON.parse(JSON.stringify(obj));
```

### **Immutable** updates

@keywords: immutable, update, state, copy

Clone before modifying.

```typescript
const newState = structuredClone(state);
newState.user.name = "New Name";
```

### **Isolate** data

@keywords: isolate, data, independent, copy

Create independent copy.

```typescript
const copy = structuredClone(original);
// Modifications don't affect original
```
