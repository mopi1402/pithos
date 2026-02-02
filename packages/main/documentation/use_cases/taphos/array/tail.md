## `tail`

### **Get** all but first element 📍

@keywords: tail, rest, skip, first

Get array without the first element.

```typescript
const items = [1, 2, 3, 4, 5];
items.slice(1);
// => [2, 3, 4, 5]
```

### **Skip** header row

@keywords: skip, header, CSV, data

Process data rows, skipping the header.

```typescript
const csvRows = [["name", "age"], ["Alice", 30], ["Bob", 25]];
csvRows.slice(1);
// => [["Alice", 30], ["Bob", 25]]
```

### **Get** remaining items

@keywords: remaining, rest, queue, process

Get unprocessed items after the first.

```typescript
const queue = [current, ...pending];
queue.slice(1);
// => pending items
```
