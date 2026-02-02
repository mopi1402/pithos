## `initial`

### **Get** all but last element 📍

@keywords: initial, exclude, last, slice

Get array without the last element.

```typescript
const items = [1, 2, 3, 4, 5];
items.slice(0, -1);
// => [1, 2, 3, 4]
```

### **Process** all but current

@keywords: process, exclude, current, history

Get previous items excluding the current one.

```typescript
const history = ["page1", "page2", "page3"];
history.slice(0, -1);
// => ["page1", "page2"]
```

### **Remove** trailing element

@keywords: remove, trailing, exclude, immutable

Create new array without the last item.

```typescript
const path = ["home", "docs", "file.txt"];
path.slice(0, -1);
// => ["home", "docs"]
```
