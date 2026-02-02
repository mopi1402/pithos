## `parsePath`

### **Access** nested properties dynamically 📍

@keywords: nested, property, access, dynamic, path, get, set

Parse path strings for use with get/set utilities.
Essential for form libraries and data binding.

```typescript
const user = {
  profile: {
    addresses: [
      { city: 'Paris', zip: '75001' }
    ]
  }
};

const path = parsePath('profile.addresses[0].city');
// ['profile', 'addresses', 0, 'city']

// Use with get utility
let current: unknown = user;
for (const key of path) {
  current = (current as Record<string, unknown>)[key];
}
console.log(current); // 'Paris'
```

### **Build** form field bindings

@keywords: form, field, binding, input, name, nested

Convert form field names to property paths for nested form data.
Perfect for dynamic form generators.

```typescript
function getFieldValue(formData: Record<string, unknown>, fieldName: string) {
  const keys = parsePath(fieldName);
  let value: unknown = formData;
  for (const key of keys) {
    if (value == null) return undefined;
    value = (value as Record<string | number, unknown>)[key];
  }
  return value;
}

const formData = {
  user: { contacts: [{ email: 'john@example.com' }] }
};

getFieldValue(formData, 'user.contacts[0].email'); // 'john@example.com'
```

### **Handle** bracket notation with quotes

@keywords: bracket, notation, quotes, special-characters, keys

Parse paths with special characters in keys using quoted bracket notation.
Useful for APIs with non-standard property names.

```typescript
const data = {
  'user-data': {
    'first.name': 'John'
  }
};

const path = parsePath('["user-data"]["first.name"]');
// ['user-data', 'first.name']

// Access the value
let result: unknown = data;
for (const key of path) {
  result = (result as Record<string, unknown>)[key];
}
console.log(result); // 'John'
```

### **Validate** path syntax

@keywords: validate, syntax, path, parsing, error-handling

Use parsePath to validate and normalize user-provided paths.
Essential for configuration systems accepting path expressions.

```typescript
function isValidPath(input: string): boolean {
  const parsed = parsePath(input);
  return parsed.length > 0 && parsed.every(key => 
    typeof key === 'number' || (typeof key === 'string' && key.length > 0)
  );
}

isValidPath('user.name');           // true
isValidPath('items[0].value');      // true
isValidPath('data["key"].nested');  // true
isValidPath('');                    // false
```
