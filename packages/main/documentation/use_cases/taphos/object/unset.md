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
