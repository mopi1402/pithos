## `isEmpty` ⭐

### **Check** for empty collections 📍

@keywords: check, empty, collections, validation, completeness, data

Verify if an array, object, string, or collection is empty.
Essential for validating data completeness before processing.

```typescript
if (isEmpty(data)) {
  return null; // Handle empty state
}
```

### **Validate** form inputs

@keywords: validate, forms, inputs, required, fields, user-input

Ensure required fields are not empty strings.
Critical for user input validation.

```typescript
if (isEmpty(username.trim())) {
  showError("Username is required");
}
```

### **Guard** against processing empty data

@keywords: guard, empty, processing, early-return, safety, validation

Early return when collections have no items to process.
Prevents unnecessary operations and potential errors.
```typescript
function sendNotifications(users: User[]) {
  if (isEmpty(users)) {
    console.log("No users to notify");
    return;
  }
  
  // Safe to process - we have users
  users.forEach(user => notify(user));
}
```
