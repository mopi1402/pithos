## `filter` ⭐

### **Extract** matching items 📍

@keywords: extract, filter, matching, criteria, search

Filter elements that match specific criteria.

```typescript
const products = [{ category: "electronics" }, { category: "clothing" }];
products.filter(p => p.category === "electronics");
```

### **Filter** active flags from object

@keywords: filter, features, flags, enabled

Extract enabled flags from a configuration object.

```typescript
const flags = { darkMode: true, beta: false, analytics: true };
Object.fromEntries(
  Object.entries(flags).filter(([, enabled]) => enabled)
);
// => { darkMode: true, analytics: true }
```

### **Select** high-priority items

@keywords: select, priority, filtering, urgent

Filter items by priority level.

```typescript
const notifications = [{ priority: "high" }, { priority: "low" }];
notifications.filter(n => n.priority === "high");
```
