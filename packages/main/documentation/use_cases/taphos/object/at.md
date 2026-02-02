## `at`

### **Get** values at paths 📍

@keywords: at, paths, values, get, multiple

Get values at multiple paths.

```typescript
import { get } from '@pithos/arkhe';
const paths = ['a.b', 'c.d'];
const values = paths.map(p => get(obj, p));
```

### **Extract** specific fields

@keywords: extract, fields, pick, paths

Extract specific nested values.

```typescript
import { get } from '@pithos/arkhe';
const fields = ['user.name', 'user.email'];
const data = fields.map(f => get(response, f));
```
