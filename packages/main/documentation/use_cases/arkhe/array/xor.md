## `xor`

### **Find items unique** to each array 📍

@keywords: XOR, symmetric difference, unique, compare, discrepancies

Get elements that exist in one array but not both (symmetric difference).
Perfect for comparing lists and finding discrepancies.

```typescript
const listA = ["apple", "banana", "cherry"];
const listB = ["banana", "cherry", "date"];

const uniqueToEach = xor(listA, listB);
// => ["apple", "date"]
```

### **Detect changes** between snapshots

@keywords: changes, snapshots, diff, added, removed

Find what was added or removed between two states.
Useful for tracking modifications or generating changelogs.

```typescript
const before = ["user1", "user2", "user3"];
const after = ["user2", "user3", "user4"];

const changes = xor(before, after);
// => ["user1", "user4"] (user1 removed, user4 added)
```

### **Compare feature sets**

@keywords: features, compare, plans, versions, differences

Find features unique to each plan or version.
Essential for plan comparison or feature matrices.

```typescript
const basicPlan = ["storage", "email", "support"];
const proPlan = ["storage", "email", "analytics", "api"];

const differences = xor(basicPlan, proPlan);
// => ["support", "analytics", "api"]
```
