## `deburr` 💎

> Removes accents and expands ligatures (e.g., "æ" → "ae"), enabling ASCII-safe comparisons and search indexing.


### **Sanitize** search queries 📍

@keywords: sanitize, search, queries, accents, normalize, international, i18n

Normalize user input for search indexing or comparison.
Essential for building resilient search features that handle international characters.

```typescript
const query = deburr('Crème Brûlée'); // 'Creme Brulee'
```

### **Generate** URL slugs from international text

@keywords: slug, URL, international, normalize, SEO, routing, i18n, seo

Strip diacritics before generating URL-safe slugs.
Essential for multilingual apps where titles contain accented characters.

```typescript
const toSlug = (title: string) =>
  deburr(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

toSlug('Café résumé — été 2025');
// => 'cafe-resume-ete-2025'
```

### **Normalize** strings for fuzzy search matching

@keywords: fuzzy, search, normalize, accent, insensitive, filter, i18n

Remove accents before comparing strings so users can search without typing diacritics.

```typescript
const normalize = (s: string) => deburr(s).toLowerCase();

const products = ['Gruyère', 'Comté', 'Beaufort', 'Époisses'];
const query = 'comte';
const results = products.filter((p) => normalize(p).includes(normalize(query)));
// => ['Comté']
```

### **Normalize** user names for avatar initials

@keywords: avatar, initials, normalize, display, design system, a11y

Strip accents before extracting initials for avatar placeholders.
Essential for design systems with initial-based avatar components.

```typescript
const getInitials = (name: string) =>
  deburr(name)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

getInitials("Rene Descartes"); // => "RD"
getInitials("Jose Garcia");    // => "JG"
```

### **Build** search index entries

@keywords: search, index, build, catalog, normalize, seo, performance

Deburr product names and descriptions before indexing for search.
Critical for e-commerce search engines handling multilingual catalogs.

```typescript
const buildSearchEntry = (product) => ({
  id: product.id,
  searchText: deburr(`${product.name} ${product.description} ${product.category}`).toLowerCase(),
  original: product,
});

const searchIndex = products.map(buildSearchEntry);

// Search matches "creme" even if product is "Creme"
const results = searchIndex.filter((entry) =>
  entry.searchText.includes(deburr(query).toLowerCase())
);
```
