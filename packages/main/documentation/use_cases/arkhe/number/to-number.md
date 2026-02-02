## `toNumber` ⭐

### **Convert** inputs safely 📍

@keywords: convert, parse, number, inputs, safe, validation

Transform various input types to a number, handling `NaN` and failures gracefully.
Critical for processing user input, query parameters, or API response data.

```typescript
const page = toNumber(params.page, 1);
const limit = toNumber(params.limit, 20);
```

### **Normalize** mixed data types

@keywords: normalize, mixed, types, conversion, legacy, migration

Convert booleans or numeric strings from legacy data sources.
Useful for data migration or standardization scripts.

```typescript
const count = toNumber(data.count); // Handles "10", 10, true (1), or null (0)
```
