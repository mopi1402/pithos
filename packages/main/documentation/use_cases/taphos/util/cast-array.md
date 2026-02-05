## `castArray`

### **Ensure** array 📍

@keywords: cast, array, ensure, wrap

Ensure value is an array.

```typescript
const ensureArray = (v) => Array.isArray(v) ? v : [v];

ensureArray([1, 2]);  // => [1, 2]
ensureArray(1);       // => [1]
```

### **Normalize** input

@keywords: normalize, input, single, multiple

Accept single or multiple values.

```typescript
const ids = Array.isArray(input) ? input : [input];
ids.forEach(process);
```

### **Handle** optional array

@keywords: handle, optional, array, param

Process parameter that might be array.

```typescript
const tags = [].concat(tagOrTags);
```

### **Normalize** component props that accept single or array

@keywords: normalize, props, component, React, single, array, API, flexible

Handle component or function parameters that accept both `T` and `T[]`.
Very common pattern in React components and library APIs for flexible interfaces.

```typescript
interface NotifyOptions {
  recipients: string | string[];
  message: string;
}

function notify(options: NotifyOptions) {
  const recipients = castArray(options.recipients);
  // Always an array, whether user passed "alice" or ["alice", "bob"]
  recipients.forEach((r) => sendEmail(r, options.message));
}

notify({ recipients: "alice@example.com", message: "Hello" });
notify({ recipients: ["alice@example.com", "bob@example.com"], message: "Hello" });
```
