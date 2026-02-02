## `uniq`

### **Remove** duplicate values 📍

@keywords: unique, dedupe, distinct, remove duplicates

Get unique values from an array.

```typescript
const items = [1, 2, 2, 3, 3, 3, 4];
[...new Set(items)];
// => [1, 2, 3, 4]
```

### **Dedupe** string list

@keywords: dedupe, strings, unique, list

Remove duplicate strings from a list.

```typescript
const tags = ["js", "ts", "js", "react", "ts"];
[...new Set(tags)];
// => ["js", "ts", "react"]
```

### **Get** unique IDs

@keywords: unique, IDs, identifiers, set

Extract unique identifiers from objects.

```typescript
const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
[...new Set(items.map(i => i.id))];
// => [1, 2]
```
