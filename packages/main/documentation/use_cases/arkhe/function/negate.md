## `negate`

### **Filter Inversion** for array operations 📍

@keywords: negate, filter, inversion, array, predicate

Invert predicates for filtering operations.
Essential for creating opposite filter conditions.

```typescript
import { negate } from "@pithos/core/arkhe/function/negate";

const isEven = (n: number) => n % 2 === 0;
const isOdd = negate(isEven);

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(numbers.filter(isEven)); // [2, 4, 6, 8, 10]
console.log(numbers.filter(isOdd));  // [1, 3, 5, 7, 9]
```

### **Validation Negation** for form checks 📍

@keywords: validation, negation, form, checks, conditions, a11y

Create opposite validation conditions.
Critical for form validation logic.

```typescript
import { negate } from "@pithos/core/arkhe/function/negate";

const isEmpty = (value: string) => value.trim().length === 0;
const isNotEmpty = negate(isEmpty);

const hasErrors = (errors: string[]) => errors.length > 0;
const isValid = negate(hasErrors);

// Use in form validation
const formFields = ["username", "email", "password"];
const values = { username: "john", email: "", password: "secret" };

const emptyFields = formFields.filter(field => isEmpty(values[field]));
const filledFields = formFields.filter(field => isNotEmpty(values[field]));

console.log(emptyFields);  // ["email"]
console.log(filledFields); // ["username", "password"]
```

### **Access Control** logic

@keywords: access control, permissions, authorization, security, roles, filters

Invert permission checks for access control.
Important for authorization systems.

```typescript
import { negate } from "@pithos/core/arkhe/function/negate";

interface User {
  id: string;
  role: string;
  suspended: boolean;
}

const isAdmin = (user: User) => user.role === "admin";
const isSuspended = (user: User) => user.suspended;

const isNotAdmin = negate(isAdmin);
const isActive = negate(isSuspended);

const users: User[] = [
  { id: "1", role: "admin", suspended: false },
  { id: "2", role: "user", suspended: true },
  { id: "3", role: "user", suspended: false },
];

// Find active non-admin users
const regularActiveUsers = users.filter(u => isNotAdmin(u) && isActive(u));
console.log(regularActiveUsers); // [{ id: "3", role: "user", suspended: false }]
```

### **Invert** tree node filter for "show all" toggle

@keywords: tree, filter, invert, show all, hidden, design system

Create an inverse filter to toggle between filtered and unfiltered tree views.
Perfect for file tree components with "show hidden files" toggles.

```typescript
const isNodeHidden = (node: TreeNode) =>
  node.name.startsWith(".") || node.name === "node_modules";
const isNodeVisible = negate(isNodeHidden);

// Default: show only visible nodes
const visibleNodes = treeData.filter(isNodeVisible);

// Toggle: show all including hidden
const displayNodes = showHidden ? treeData : treeData.filter(isNodeVisible);
renderTree(displayNodes);
```

### **Filter** visible items in a panel

@keywords: filter, visible, hidden, panel, toggle, panels, design system

Create an inverse filter to show or hide items based on a toggle.
Perfect for "show hidden items" toggles in file explorers and dashboards.

```typescript
const isHidden = (item: FileEntry) => item.name.startsWith(".");
const isVisible = negate(isHidden);

// Default: show only visible files
const visibleFiles = files.filter(isVisible);

// Toggle: show all including hidden
const allFiles = showHidden ? files : files.filter(isVisible);
```
