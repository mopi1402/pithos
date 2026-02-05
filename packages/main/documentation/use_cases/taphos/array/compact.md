## `compact` 💎

> The most elegant idiom for cleaning arrays of falsy values.

### **Clean** API responses with missing data 📍

@keywords: clean, API, responses, missing, null, undefined

Remove null and undefined values from API responses.

```typescript
const apiUsers = [user1, null, user2, undefined, user3];
const validUsers = apiUsers.filter(Boolean);
// => [user1, user2, user3]
```

### **Filter** optional form fields before submission

@keywords: filter, forms, optional, fields, empty

Remove empty or undefined values from form data.

```typescript
const formValues = ["john@example.com", "", "John Doe", null];
formValues.filter(Boolean);
// => ["john@example.com", "John Doe"]
```

### **Clean** Promise.allSettled results

@keywords: Promise, allSettled, results, batch, parallel

Filter out rejected promises to get only successful values.

```typescript
const values = results.map(r => r.status === "fulfilled" ? r.value : null);
values.filter(Boolean);
// => [user1, user3]
```

### **Build** conditional CSS class lists

@keywords: CSS, classes, conditional, classNames, React, UI, styling

Construct a class string from conditional values, removing falsy entries.
The classic `classNames` pattern used in virtually every React/Vue project.

```typescript
const isActive = true;
const isDisabled = false;
const hasError = true;

const classes = compact([
  "btn",
  isActive && "btn-active",
  isDisabled && "btn-disabled",
  hasError && "btn-error",
]).join(" ");
// => "btn btn-active btn-error"
```
