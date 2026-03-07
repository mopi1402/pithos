## `capitalize`

### **Format** user names 📍

@keywords: format, names, capitalize, display, profiles, users, i18n

Ensure proper capitalization of names.
Useful for display logic on profile pages.
```typescript
const name = capitalize('john'); // 'John'
```

### **Normalize** input labels

@keywords: normalize, labels, forms, buttons, standardize, text, design system

Standardize form field labels or button text.
```typescript
const label = capitalize('submit'); // 'Submit'
const button = capitalize('CANCEL'); // 'Cancel' (if it lowercases first)
```

### **Display** enum values as readable text

@keywords: enum, display, readable, status, constant, format, design system

Convert constant-style enum values into human-readable labels for UI display.

```typescript
const statuses = ['PENDING_REVIEW', 'IN_PROGRESS', 'COMPLETED'];
const labels = statuses.map((s) =>
  capitalize(s.toLowerCase().replace(/_/g, ' '))
);
// ['Pending review', 'In progress', 'Completed']
```
