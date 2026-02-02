## `omit`

### **Exclude** specific properties 📍

@keywords: exclude, omit, remove, properties, sensitive, sanitize

Create a shallow copy of an object excluding specified keys.
Essential for efficient shallow removals or removing sensitive data.

```typescript
const publicUser = omit(user, ['password', 'secretToken']);
sendToClient(publicUser);
```

### **Sanitize** internal fields

@keywords: sanitize, internal, fields, ORM, serialization, cleanup

Remove framework-specific or internal properties before serialization.
Useful for cleaning ORM entities or decorated objects.

```typescript
const cleanEntity = omit(dbRecord, ['_id', '__v', 'createdAt']);
return JSON.stringify(cleanEntity);
```

### **Filter** invalid keys

@keywords: filter, invalid, deprecated, cleanup, parameters, keys

Remove known invalid or deprecated keys from an object hash.

```typescript
const cleanParams = omit(params, ['legacyParam1', 'unused_flag']);
```
