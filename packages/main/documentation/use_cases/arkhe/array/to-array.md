## `toArray`

### **Normalize** single values to arrays 📍

@keywords: normalize, convert, single value, array, flexible input

Convert single values to arrays to ensure consistent data structure for processing.
Perfect for handling flexible inputs like `string | string[]`.

```typescript
const tags = "javascript";
const tagList = toArray(tags);
// => ["javascript"]

const multipleTags = ["react", "typescript"];
const tagList2 = toArray(multipleTags);
// => ["react", "typescript"] (unchanged)
```

### **Convert iterable collections** to arrays

@keywords: iterable, Set, Map, NodeList, DOM, conversion

Transform Sets, Maps, or NodeLists into standard arrays for array methods.
Essential for working with DOM APIs or unique collections.

```typescript
const uniqueIds = new Set([1, 2, 3, 2, 1]);
const idArray = toArray(uniqueIds);
// => [1, 2, 3]

const buttons = document.querySelectorAll("button");
const buttonArray = toArray(buttons);
buttonArray.forEach((btn) => (btn.disabled = true));
```

### **Handle optional or nullable values** safely

@keywords: optional, nullable, undefined, safe handling, config

Wrap potentially undefined values into empty or single-item arrays.
Useful for optional API fields or config values.

```typescript
interface Config {
  admins?: string | string[];
}

function getAdminList(config: Config): string[] {
  return toArray(config.admins ?? []);
}

getAdminList({ admins: "alice@co.com" });
// => ["alice@co.com"]

getAdminList({ admins: undefined });
// => []

getAdminList({ admins: ["alice@co.com", "bob@co.com"] });
// => ["alice@co.com", "bob@co.com"]
```
