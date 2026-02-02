## `negate`

### **Filter Inversion** for array operations 📍

@keywords: negate, filter, inversion, array, predicate

Invert predicates for filtering operations.
Essential for creating opposite filter conditions.

```typescript
import { negate } from "pithos/arkhe/function/negate";

const isEven = (n: number) => n % 2 === 0;
const isOdd = negate(isEven);

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(numbers.filter(isEven)); // [2, 4, 6, 8, 10]
console.log(numbers.filter(isOdd));  // [1, 3, 5, 7, 9]
```

### **Validation Negation** for form checks 📍

@keywords: validation, negation, form, checks, conditions

Create opposite validation conditions.
Critical for form validation logic.

```typescript
import { negate } from "pithos/arkhe/function/negate";

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

@keywords: access control, permissions, authorization, security, roles

Invert permission checks for access control.
Important for authorization systems.

```typescript
import { negate } from "pithos/arkhe/function/negate";

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
