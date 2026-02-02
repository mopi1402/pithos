## `split`

### **Split** into array 📍

@keywords: split, array, tokenize, parse

Split string by delimiter.

```typescript
"a,b,c".split(",");  // => ["a", "b", "c"]
"hello".split("");   // => ["h", "e", "l", "l", "o"]
```

### **Parse** CSV

@keywords: parse, CSV, values, row

Split CSV row into values.

```typescript
const values = row.split(",").map(s => s.trim());
```

### **Split** path

@keywords: split, path, segments, URL

Parse path into segments.

```typescript
"/home/user/docs".split("/").filter(Boolean);
// => ["home", "user", "docs"]
```
