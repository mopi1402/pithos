## `parseCommaSeparated`

### **Parse** environment variables 📍

@keywords: parse, environment, variables, comma-separated, config, arrays

Split comma-separated config values into arrays.
Essential for parsing `ALLOWED_ORIGINS` or `FEATURE_FLAGS` from env files.
```typescript
const origins = parseCommaSeparated(process.env.ALLOWED_ORIGINS, (s) => s.trim());
// ['https://app.com', 'https://api.com', 'http://localhost:3000']
```

### **Handle** user input lists

@keywords: handle, user-input, lists, tags, recipients, forms

Parse user-submitted tags or recipients from form inputs.
```typescript
const recipients = parseCommaSeparated('alice@co.com, bob@co.com, charlie@co.com', (e) => e.trim().toLowerCase());
// ['alice@co.com', 'bob@co.com', 'charlie@co.com']
```

### **Transform** values during parsing

@keywords: transform, parsing, values, conversion, mapping, single-pass

Apply transformations to each parsed value in a single pass.
```typescript
const ids = parseCommaSeparated('1, 2, 3, 4', (s) => parseInt(s.trim(), 10));
// [1, 2, 3, 4]
```
