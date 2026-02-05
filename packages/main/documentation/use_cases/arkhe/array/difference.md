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

### **Detect missing permissions** for access control

@keywords: permissions, missing, access, control, authorization, RBAC, security

Compare required permissions against granted ones to identify gaps.
Essential for role-based access control and security audit systems.

```typescript
const requiredPermissions = ["read", "write", "deploy", "audit"];
const userPermissions = ["read", "write"];

const missingPermissions = difference(requiredPermissions, userPermissions);
// => ["deploy", "audit"]

if (missingPermissions.length > 0) {
  throw new Error(`Missing permissions: ${missingPermissions.join(", ")}`);
}
```

### **Find missing dependencies** in a project

@keywords: dependencies, missing, imports, tooling, package, audit, CI

Compare required packages against installed ones to detect missing dependencies.
Useful for CI pipelines, project scaffolding, and dependency audit tools.

```typescript
const requiredPackages = ["react", "react-dom", "typescript", "vitest", "eslint"];
const installedPackages = ["react", "react-dom", "typescript"];

const missingPackages = difference(requiredPackages, installedPackages);
// => ["vitest", "eslint"]

console.log(`Install missing: pnpm add -D ${missingPackages.join(" ")}`);
```
