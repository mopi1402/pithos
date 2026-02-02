## `pull` / `pullAll`

### **Remove** values in place 📍

@keywords: pull, remove, mutate, filter

Remove specific values from an array (mutating).

```typescript
const items = [1, 2, 3, 4, 5];
const toRemove = new Set([2, 4]);
const result = items.filter(x => !toRemove.has(x));
// => [1, 3, 5]
```

### **Remove** single value

@keywords: remove, single, filter, exclude

Filter out a specific value.

```typescript
const tags = ["js", "ts", "css", "js"];
tags.filter(t => t !== "js");
// => ["ts", "css"]
```

### **Remove** multiple values

@keywords: remove, multiple, batch, set

Exclude multiple values using a Set.

```typescript
const nums = [1, 2, 3, 2, 4, 2, 5];
const exclude = new Set([2, 4]);
nums.filter(n => !exclude.has(n));
// => [1, 3, 5]
```
