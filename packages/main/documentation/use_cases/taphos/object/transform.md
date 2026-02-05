## `transform`

### **Accumulate** from object 📍

@keywords: transform, accumulate, reduce, object

Iterate and accumulate result.

```typescript
Object.entries(obj).reduce((acc, [key, value]) => {
  // transform logic
  return acc;
}, initialValue);
```

### **Group** by value

@keywords: group, invert, collect, values

Group keys by their values.

```typescript
const grouped = Object.entries({ a: 1, b: 2, c: 1 }).reduce(
  (acc, [k, v]) => {
    (acc[v] ||= []).push(k);
    return acc;
  },
  {} as Record<number, string[]>
);
// { 1: ['a', 'c'], 2: ['b'] }
```

### **Build** an inverted lookup map

@keywords: invert, lookup, reverse, map, index, search

Create a reverse mapping from values to keys for fast lookups.
Useful for enum reverse lookups, code-to-label mappings, and search indexes.

```typescript
const statusCodes = { ok: 200, notFound: 404, serverError: 500 };

const codeToName = transform(statusCodes, (result, value, key) => {
  result[value] = key;
}, {} as Record<number, string>);
// => { 200: "ok", 404: "notFound", 500: "serverError" }

console.log(codeToName[404]); // => "notFound"
```

### **Filter** and transform an object in one pass

@keywords: filter, transform, single, pass, efficient, object, cleanup

Select and reshape object properties in a single iteration.
More efficient than chaining filter + map on entries.

```typescript
const rawConfig = { host: "localhost", port: 3000, debug: "", verbose: null, timeout: 5000 };

const cleanConfig = transform(rawConfig, (result, value, key) => {
  if (value != null && value !== "") {
    result[key] = value;
  }
}, {} as Record<string, unknown>);
// => { host: "localhost", port: 3000, timeout: 5000 }
```
