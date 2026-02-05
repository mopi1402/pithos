## `uniq` ⭐

### **Remove duplicate values** from a collection 📍

@keywords: deduplicate, unique, remove duplicates, distinct, primitives

Remove repeated values from an array, keeping only the first occurrence.
Essential for cleaning up lists of IDs, tags, or any primitive values.

```typescript
const selectedIds = [3, 7, 3, 12, 7, 5, 12];

const uniqueIds = uniq(selectedIds);
// => [3, 7, 12, 5]
```

### **Clean up user tags** 📍

@keywords: tags, clean, input, user-generated, normalize

Ensure a tag list contains no repeated entries after user input.
Perfect for form handling, content tagging, or search filters.

```typescript
const userTags = ["react", "typescript", "react", "nodejs", "typescript"];

const cleanTags = uniq(userTags);
// => ["react", "typescript", "nodejs"]
```

### **Collect unique categories** from a dataset

@keywords: categories, extract, distinct, values, mapping

Extract all distinct values after mapping a property from objects.
Useful for building filter menus or faceted navigation.

```typescript
const products = [
  { name: "Laptop", category: "electronics" },
  { name: "Shirt", category: "clothing" },
  { name: "Phone", category: "electronics" },
  { name: "Pants", category: "clothing" },
  { name: "Tablet", category: "electronics" },
];

const categories = uniq(products.map((p) => p.category));
// => ["electronics", "clothing"]
```

### **Deduplicate merged search results** from multiple sources

@keywords: deduplicate, search, merge, sources, aggregation, Algolia, database

Remove duplicates when combining results from multiple search providers.
Common when aggregating results from Algolia, Elasticsearch, and local DB.

```typescript
const algoliaResults = ["doc-1", "doc-3", "doc-5", "doc-7"];
const dbResults = ["doc-2", "doc-3", "doc-4", "doc-5"];

const allResults = uniq([...algoliaResults, ...dbResults]);
// => ["doc-1", "doc-3", "doc-5", "doc-7", "doc-2", "doc-4"]
```

### **Ensure idempotent event processing**

@keywords: idempotent, events, processing, queue, dedup, message, webhook

Collect unique event IDs to avoid processing the same event twice.
Critical for webhook handlers, message queues, and event-driven architectures.

```typescript
const processedEventIds: string[] = [];

function handleEvent(eventId: string, payload: unknown) {
  const seen = uniq([...processedEventIds, eventId]);
  if (seen.length === processedEventIds.length) {
    return; // Already processed, skip
  }
  processedEventIds.push(eventId);
  processPayload(payload);
}
```
