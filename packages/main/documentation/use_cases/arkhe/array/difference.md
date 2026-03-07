## `difference` ⭐

### **Filter out unwanted items** from a list 📍

@keywords: filter, remove, exclude, blacklist, unwanted, elements, filters

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

@keywords: detect, new, entries, compare, snapshots, changes, tracking, ci/cd

Compare two snapshots to find newly added elements.
Perfect for tracking new users, detecting file changes, or monitoring inventory updates.

```typescript
const previousUsers = ["alice", "bob", "charlie"];
const currentUsers = ["alice", "bob", "charlie", "david", "emma"];

const newUsers = difference(currentUsers, previousUsers);
// => ["david", "emma"]
```

### **Detect missing permissions** for access control

@keywords: permissions, missing, access, control, authorization, RBAC, security, a11y

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

@keywords: dependencies, missing, imports, tooling, package, audit, CI, ci/cd, scripts

Compare required packages against installed ones to detect missing dependencies.
Useful for CI pipelines, project scaffolding, and dependency audit tools.

```typescript
const requiredPackages = ["react", "react-dom", "typescript", "vitest", "eslint"];
const installedPackages = ["react", "react-dom", "typescript"];

const missingPackages = difference(requiredPackages, installedPackages);
// => ["vitest", "eslint"]

console.log(`Install missing: pnpm add -D ${missingPackages.join(" ")}`);
```

### **Implement** "Deselect All" by removing category items

@keywords: deselect, selection, model, checkbox, table, design system, a11y

Remove all items from a category from the current selection.
Essential for "Deselect All" in data tables and multi-select components.

```typescript
const currentSelection = ["item-1", "item-2", "item-3", "item-4", "item-5"];
const categoryItems = ["item-2", "item-3", "item-4"];

// Deselect category: remove category items from selection
const afterDeselect = difference(currentSelection, categoryItems);
// => ["item-1", "item-5"]

updateSelectionState(afterDeselect);
```

### **Compute** hidden columns in a data table

@keywords: columns, hidden, visible, table, data, design system, panels

Find which columns are hidden by comparing all columns against visible ones.
Essential for column visibility toggles in data table components.

```typescript
const allColumns = ["name", "email", "role", "status", "lastLogin", "createdAt"];
const visibleColumns = ["name", "email", "status"];

const hiddenColumns = difference(allColumns, visibleColumns);
// => ["role", "lastLogin", "createdAt"]

renderColumnToggle(allColumns, hiddenColumns);
```

### **Find** unread notifications

@keywords: unread, notifications, read, tracking, inbox, design system

Identify notifications the user hasn't seen yet.
Essential for notification badges and unread indicators.

```typescript
const allNotificationIds = ["n1", "n2", "n3", "n4", "n5"];
const readIds = ["n1", "n3"];

const unreadIds = difference(allNotificationIds, readIds);
// => ["n2", "n4", "n5"]

setBadgeCount(unreadIds.length); // Show "3" on bell icon
```

### **Detect** removed items between config versions

@keywords: removed, config, diff, migration, scripts, ci/cd, observability

Compare two config versions to find removed keys for migration warnings.
Perfect for CLI tools, config validators, and upgrade scripts.

```typescript
const previousKeys = ["apiUrl", "timeout", "retries", "legacyMode", "debugLevel"];
const currentKeys = ["apiUrl", "timeout", "retries", "logLevel"];

const removedKeys = difference(previousKeys, currentKeys);
// => ["legacyMode", "debugLevel"]

if (removedKeys.length > 0) {
  console.warn(`Deprecated config keys detected: ${removedKeys.join(", ")}`);
}
```
