## `invoke`

### **Call** method at path 📍

@keywords: invoke, method, call, path

Invoke method at nested path.

```typescript
import { get } from '@pithos/arkhe';
const method = get(obj, 'a.b.greet');
const result = typeof method === 'function' ? method('World') : undefined;
```

### **Optional** method call

@keywords: optional, method, safe, call

Safely call method if exists.

```typescript
obj.a?.b?.greet?.('World');
```
