## `pullAll`

### **Remove** multiple values 📍

@keywords: remove, filter, exclude, values, array

Remove all occurrences of specified values from array.

```typescript
const items = [1, 2, 3, 2, 4, 2];
const toRemove = [2, 3];
const result = items.filter(x => !toRemove.includes(x));
// [1, 4]
```

### **Clean** array data

@keywords: clean, filter, exclude, unwanted

Filter out unwanted values from dataset.

```typescript
const tags = ['js', 'deprecated', 'ts', 'legacy'];
const blacklist = ['deprecated', 'legacy'];
const clean = tags.filter(t => !blacklist.includes(t));
// ['js', 'ts']
```
