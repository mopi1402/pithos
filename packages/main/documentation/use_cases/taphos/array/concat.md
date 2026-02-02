## `concat`

### **Merge** multiple data sources 📍

@keywords: merge, concat, combine, data sources

Combine arrays from different sources into a single collection.

```typescript
const local = [{ id: 1 }];
const remote = [{ id: 2 }, { id: 3 }];
local.concat(remote);
// => [{ id: 1 }, { id: 2 }, { id: 3 }]
```

### **Append** new items to list immutably

@keywords: append, immutable, React state

Add new items without mutation.

```typescript
const todos = [{ id: 1, text: "Buy groceries" }];
const newTodo = { id: 2, text: "Walk the dog" };
todos.concat([newTodo]);
```

### **Prepend** default options to user choices

@keywords: prepend, default, dropdown, menu

Add default options at the beginning of a list.

```typescript
const defaultOption = [{ value: "", label: "Select..." }];
const countries = [{ value: "us", label: "USA" }];
defaultOption.concat(countries);
```
