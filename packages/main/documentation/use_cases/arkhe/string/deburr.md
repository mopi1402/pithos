## `deburr` 💎

> Removes accents and expands ligatures (e.g., "æ" → "ae"), enabling ASCII-safe comparisons and search indexing.


### **Sanitize** search queries 📍

@keywords: sanitize, search, queries, accents, normalize, international

Normalize user input for search indexing or comparison.
Essential for building resilient search features that handle international characters.

```typescript
const query = deburr('Crème Brûlée'); // 'Creme Brulee'
```

### **Generate** URL slugs from international text

@keywords: slug, URL, international, normalize, SEO, routing

Strip diacritics before generating URL-safe slugs.
Essential for multilingual apps where titles contain accented characters.

```typescript
const toSlug = (title: string) =>
  deburr(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

toSlug('Café résumé — été 2025');
// => 'cafe-resume-ete-2025'
```

### **Normalize** strings for fuzzy search matching

@keywords: fuzzy, search, normalize, accent, insensitive, filter

Remove accents before comparing strings so users can search without typing diacritics.

```typescript
const normalize = (s: string) => deburr(s).toLowerCase();

const products = ['Gruyère', 'Comté', 'Beaufort', 'Époisses'];
const query = 'comte';
const results = products.filter((p) => normalize(p).includes(normalize(query)));
// => ['Comté']
```
