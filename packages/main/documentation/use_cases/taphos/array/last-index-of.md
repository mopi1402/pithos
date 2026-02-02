## `lastIndexOf`

### **Find** last occurrence 📍

@keywords: find, last, occurrence, index

Get the index of the last matching element.

```typescript
const items = ["a", "b", "a", "c", "a"];
items.lastIndexOf("a");
// => 4
```

### **Find** last match before position

@keywords: find, last, before, position

Search backwards from a specific index.

```typescript
const chars = ["a", "b", "a", "c", "a"];
chars.lastIndexOf("a", 3);
// => 2
```

### **Check** duplicate position

@keywords: check, duplicate, position, validate

Find if element appears multiple times.

```typescript
const values = [1, 2, 3, 2, 4];
values.indexOf(2) !== values.lastIndexOf(2);
// => true (duplicates exist)
```
