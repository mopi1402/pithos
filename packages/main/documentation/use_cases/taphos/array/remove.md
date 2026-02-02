## `remove`

### **Remove** matching elements 📍

@keywords: remove, filter, predicate, mutate

Remove elements that match a condition.

```typescript
const items = [1, 2, 3, 4, 5, 6];
items.filter(n => n % 2 !== 0);
// => [1, 3, 5] (odd numbers only)
```

### **Extract** and remove

@keywords: extract, partition, split

Separate matching and non-matching elements.

```typescript
const users = [{ active: true }, { active: false }, { active: true }];
const active = users.filter(u => u.active);
const inactive = users.filter(u => !u.active);
```

### **Remove** by condition

@keywords: remove, condition, filter, clean

Clean array by removing unwanted items.

```typescript
const data = [null, 1, undefined, 2, "", 3];
data.filter(x => x != null && x !== "");
// => [1, 2, 3]
```
