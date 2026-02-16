## `update` 💎

> Apply a transformation to a deeply nested value without touching the rest.

### **Update** nested value 📍

@keywords: update, nested, transform, immutable

Update value at path with function.

```typescript
import { get, set } from '@pithos/arkhe';
const updated = set(obj, 'a.b.c', get(obj, 'a.b.c') * 2);
```

### **Increment** counter

@keywords: increment, counter, update, state

Update nested counter.

```typescript
import { get, set } from '@pithos/arkhe';
const path = 'stats.views';
const newState = set(state, path, (get(state, path) as number) + 1);
```
