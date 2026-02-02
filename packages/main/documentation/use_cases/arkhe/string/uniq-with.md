## `uniqWith` 💎

> No native equivalent for character-level deduplication with custom logic. Useful for case-insensitive or locale-aware uniqueness.

### **Filter** unique characters 📍

@keywords: filter, unique, characters, deduplication, case-insensitive, custom

Remove duplicate characters based on custom logic (e.g., case-insensitive).
Useful for generating unique sets of symbols or cleaning input.
```typescript
const unique = uniqWith('aAaB', (a, b) => a.toLowerCase() === b.toLowerCase());
// 'aB'
```

### **Remove** consecutive duplicates

@keywords: remove, consecutive, duplicates, repeated, cleaning, filtering

Filter out repeated characters while preserving first occurrence.
```typescript
const clean = uniqWith('aaabbbccc', (a, b) => a === b);
// 'abc'
```
