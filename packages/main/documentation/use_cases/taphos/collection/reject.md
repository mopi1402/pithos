## `reject`

### **Exclude** items matching criteria 📍

@keywords: reject, exclude, filter, remove

Filter out elements that match a condition.

```typescript
const items = [{ active: true }, { active: false }, { active: true }];
items.filter(item => !item.active);
// => [{ active: false }]
```

### **Remove** invalid entries

@keywords: remove, invalid, clean, filter

Exclude items that fail validation.

```typescript
const users = [{ email: "" }, { email: "a@b.com" }, { email: null }];
users.filter(u => u.email);
// => [{ email: "a@b.com" }]
```

### **Filter out** completed tasks

@keywords: filter, completed, tasks, pending

Get only pending tasks by excluding completed ones.

```typescript
const tasks = [{ done: true }, { done: false }, { done: false }];
tasks.filter(t => !t.done);
// => [{ done: false }, { done: false }]
```
