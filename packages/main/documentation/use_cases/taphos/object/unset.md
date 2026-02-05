## `unset`

### **Remove** nested property 📍

@keywords: unset, remove, delete, property

Remove property at path immutably.

```typescript
// For shallow properties
const { propToRemove, ...rest } = obj;

// For nested, use omit or destructuring
import { omit } from '@pithos/arkhe';
```

### **Clean** object

@keywords: clean, remove, property, immutable

Remove unwanted properties.

```typescript
const { password, ...safeUser } = user;
```

### **Remove** nested state property immutably

@keywords: remove, nested, state, immutable, Redux, Zustand, store, update

Delete a deeply nested property in a state tree without mutating the original.
Essential pattern for Redux/Zustand reducers handling deletion actions.

```typescript
const state = {
  users: {
    "u-1": { name: "Alice", preferences: { theme: "dark", notifications: true } },
    "u-2": { name: "Bob", preferences: { theme: "light" } },
  },
};

// Remove a specific user's notification preference
const newState = unset(state, "users.u-1.preferences.notifications");
// state.users["u-1"].preferences.notifications still exists (original untouched)
// newState.users["u-1"].preferences => { theme: "dark" }
```
