## `mergeDeepLeft`

### **Merge** with default precedence 📍

@keywords: merge, defaults, precedence, left, preserve, recursive

Merge objects recursively where the first object (left) keeps its values if conflicts occur.
Useful for preserving original state while filling in gaps.

```typescript
const result = mergeDeepLeft(defaults, overrides);
// defaults are kept, overrides only add new keys
```

### **Preserve** initialization data

@keywords: preserve, initialization, refuse, overwrite, fill, empty

Merge new data into an object, but refuse to overwrite any existing values.
Useful for "fill only if empty" logic.

```typescript
const session = { id: 123 };
const newInfo = { id: 456, name: 'Guest' };
const result = mergeDeepLeft(session, newInfo);
// { id: 123, name: 'Guest' } - id preserved
```

### **Fill** missing data

@keywords: fill, missing, sparse, template, restore, backup

Populate a sparse object with data from a complete template.
Useful for restoring partial backups or checking schema compliance.

```typescript
const complete = mergeDeepLeft(template, partialData);
```
