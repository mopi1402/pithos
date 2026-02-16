## `toPath` 💎

> Parse dot-notation strings like `'a.b[0].c'` into clean path arrays.

### **Parse** property path 📍

@keywords: path, parse, property, access

Parse string path into segments.

```typescript
"a.b.c".split(".");        // => ["a", "b", "c"]
"a[0].b".match(/[^.[\]]+/g); // => ["a", "0", "b"]
```

### **Build** path accessor

@keywords: build, accessor, nested, get

Access nested properties by path.

```typescript
const get = (obj, path) => 
  path.split(".").reduce((o, k) => o?.[k], obj);

get(data, "user.address.city");
```

### **Handle** array notation

@keywords: handle, array, notation, brackets

Support both dot and bracket notation.

```typescript
const segments = "a[0].b[1].c"
  .replace(/\[(\d+)\]/g, ".$1")
  .split(".");
// => ["a", "0", "b", "1", "c"]
```
