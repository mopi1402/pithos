## `difference` ⭐

### **Filter out unwanted items** from a list 📍

@keywords: filter, remove, exclude, blacklist, unwanted, elements

Remove specific elements from an array efficiently.
Perfect for excluding blacklisted items, removing duplicates, or filtering selections.

```typescript
const allFruits = ["apple", "banana", "orange", "grape", "mango"];
const dislikedFruits = ["banana", "grape"];

const favoriteFruits = difference(allFruits, dislikedFruits);
// => ["apple", "orange", "mango"]
```

### **Sync available options** after user selection 📍

@keywords: sync, options, selection, choices, available, multi-select

Update available choices by removing already selected items from the pool.
Perfect for multi-select forms, shopping carts, or team member assignments.

```typescript
const allPermissions = ["read", "write", "delete", "admin", "export"];
const alreadyGranted = ["read", "write"];

const availablePermissions = difference(allPermissions, alreadyGranted);
// => ["delete", "admin", "export"]
```

### **Detect new entries** in a dataset

@keywords: detect, new, entries, compare, snapshots, changes, tracking

Compare two snapshots to find newly added elements.
Perfect for tracking new users, detecting file changes, or monitoring inventory updates.

```typescript
const previousUsers = ["alice", "bob", "charlie"];
const currentUsers = ["alice", "bob", "charlie", "david", "emma"];

const newUsers = difference(currentUsers, previousUsers);
// => ["david", "emma"]
```
