## `indexOf`

### **Find** element position 📍

@keywords: find, position, index, search

Get the index of a specific element.

```typescript
const colors = ["red", "green", "blue"];
colors.indexOf("green");
// => 1
```

### **Check** element existence

@keywords: check, exists, presence, validation

Determine if an element exists in an array.

```typescript
const allowed = ["admin", "moderator", "user"];
allowed.indexOf(role) !== -1;
// => true if role is in allowed
```

### **Find** starting position

@keywords: find, start, position, search

Search for an element starting from a specific index.

```typescript
const items = ["a", "b", "a", "c", "a"];
items.indexOf("a", 2);
// => 2 (first "a" at or after index 2)
```
