## `fromPairs`

### **Convert** entries to object 📍

@keywords: convert, entries, object, pairs, transform

Create an object from key-value pairs.

```typescript
const pairs = [["a", 1], ["b", 2], ["c", 3]];
Object.fromEntries(pairs);
// => { a: 1, b: 2, c: 3 }
```

### **Build** config from array

@keywords: build, config, array, settings

Transform configuration arrays into objects.

```typescript
const config = [["host", "localhost"], ["port", 3000]];
Object.fromEntries(config);
// => { host: "localhost", port: 3000 }
```

### **Convert** Map to object

@keywords: convert, Map, object, entries

Transform a Map into a plain object.

```typescript
const map = new Map([["key1", "value1"], ["key2", "value2"]]);
Object.fromEntries(map);
// => { key1: "value1", key2: "value2" }
```

### **Build** query params from active filters

@keywords: query, params, filters, URL, search, active, API

Construct a query parameter object from a list of active filter selections.
Common in search UIs where filters are toggled on/off dynamically.

```typescript
const activeFilters = [
  { key: "category", value: "electronics" },
  { key: "minPrice", value: "50" },
  { key: "inStock", value: "true" },
];

const queryParams = fromPairs(activeFilters.map((f) => [f.key, f.value]));
// => { category: "electronics", minPrice: "50", inStock: "true" }

const url = `/api/products?${new URLSearchParams(queryParams)}`;
// => "/api/products?category=electronics&minPrice=50&inStock=true"
```
