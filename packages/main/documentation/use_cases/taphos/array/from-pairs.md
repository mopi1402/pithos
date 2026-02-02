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
