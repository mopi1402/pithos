## `slice`

### **Get** portion of array 📍

@keywords: slice, portion, subset, extract

Extract a subset of elements.

```typescript
const items = [1, 2, 3, 4, 5];
items.slice(1, 4);
// => [2, 3, 4]
```

### **Paginate** results

@keywords: paginate, page, offset, limit

Get a page of results from an array.

```typescript
const all = [...allItems];
const page = all.slice(offset, offset + limit);
```

### **Clone** array immutably

@keywords: clone, copy, immutable, duplicate

Create a shallow copy of an array.

```typescript
const original = [1, 2, 3];
const copy = original.slice();
```
