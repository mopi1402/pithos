## `findIndex`

### **Locate** position for update 📍

@keywords: find, index, position, update, modify

Find the index of an item to update it in place.

```typescript
const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
users.findIndex(u => u.id === 2);
// => 1
```

### **Check** if item exists

@keywords: check, exists, validation, presence

Determine if an item exists by checking if index is >= 0.

```typescript
const items = ["apple", "banana", "cherry"];
items.findIndex(i => i === "banana") >= 0;
// => true
```

### **Get** insertion point

@keywords: insertion, point, sorted, position

Find where to insert a new item in a sorted array.

```typescript
const sorted = [10, 20, 30, 40];
sorted.findIndex(n => n > 25);
// => 2 (insert before 30)
```
