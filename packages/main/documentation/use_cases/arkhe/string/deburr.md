## `deburr` 💎

> Removes accents and expands ligatures (e.g., "æ" → "ae"), enabling ASCII-safe comparisons and search indexing.


### **Sanitize** search queries 📍

@keywords: sanitize, search, queries, accents, normalize, international

Normalize user input for search indexing or comparison.
Essential for building resilient search features that handle international characters.

```typescript
const query = deburr('Crème Brûlée'); // 'Creme Brulee'
```
