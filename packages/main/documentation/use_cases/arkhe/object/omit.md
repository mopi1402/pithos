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

### **Strip** undefined values before API call

@keywords: strip, undefined, null, cleanup, API, payload, form, partial

Remove undefined or null fields from a partial form before sending to an API.
Very common with optional form fields where you don't want to send empty values.

```typescript
const formData = { name: "Alice", bio: undefined, avatar: null, email: "alice@example.com" };

const cleanPayload = omit(formData, ["bio", "avatar"]);
// => { name: "Alice", email: "alice@example.com" }
await api.updateProfile(cleanPayload);
```

### **Remove** non-DOM props before spreading in React

@keywords: React, props, spread, DOM, component, forward, HTML

Strip custom props that shouldn't be forwarded to the underlying HTML element.
Essential pattern for React wrapper components using spread props.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
  isLoading: boolean;
}

function Button({ variant, isLoading, ...rest }: ButtonProps) {
  // variant and isLoading are already destructured,
  // but for components that forward all props:
  const domProps = omit(props, ["variant", "isLoading", "onAnalyticsClick"]);
  return <button {...domProps} />;
}
```
