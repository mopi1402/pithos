## `flatMap`

### **Map** and flatten in one step 📍

@keywords: flatMap, map, flatten, transform

Transform elements and flatten the result.

```typescript
const users = [{ tags: ["a", "b"] }, { tags: ["c"] }];
users.flatMap(u => u.tags);
// => ["a", "b", "c"]
```

### **Expand** items

@keywords: expand, duplicate, generate

Generate multiple items from each source item.

```typescript
const nums = [1, 2, 3];
nums.flatMap(n => [n, n * 10]);
// => [1, 10, 2, 20, 3, 30]
```

### **Filter** and transform

@keywords: filter, transform, combined

Combine filtering and mapping.

```typescript
const items = [1, 2, 3, 4, 5];
items.flatMap(n => n > 2 ? [n * 2] : []);
// => [6, 8, 10]
```

### **Extract** all tags from a collection of articles

@keywords: extract, tags, articles, CMS, blog, categories, aggregate

Collect all tags across multiple articles into a single flat array.
Common pattern for building tag clouds, filters, or category indexes in CMS/blog systems.

```typescript
const articles = [
  { title: "Intro to TS", tags: ["typescript", "javascript", "tutorial"] },
  { title: "React Hooks", tags: ["react", "javascript", "hooks"] },
  { title: "Node.js API", tags: ["nodejs", "javascript", "backend"] },
];

const allTags = flatMap(articles, (a) => a.tags);
// => ["typescript", "javascript", "tutorial", "react", "javascript", "hooks", "nodejs", "javascript", "backend"]

// Combine with uniq for unique tags
const uniqueTags = uniq(allTags);
// => ["typescript", "javascript", "tutorial", "react", "hooks", "nodejs", "backend"]
```
