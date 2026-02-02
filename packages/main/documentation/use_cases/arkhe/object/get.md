## `get` ⭐

### **Access** nested data safely 📍

@keywords: access, nested, safe, path, deep, optional-chaining

Retrieve a deeply nested value without throwing "cannot read property of undefined".
Critical for accessing API response data.

```typescript
// Safe access: returns undefined if path doesn't exist
const city = get(user, 'address.shipping.city');
```

### **Provide** default fallback

@keywords: provide, default, fallback, undefined, null, UI

Return a default value if the resolved path is `undefined` or null.
Essential for UI rendering to prevent blank states.

```typescript
const theme = get(config, 'ui.theme.color', 'blue');
```

### **Access** array elements

@keywords: access, arrays, elements, notation, path, indexing

Retrieve items from nested arrays using dot notation.
Useful for parsing JSON structures with lists.

```typescript
const firstTag = get(post, 'tags[0].name');
```
