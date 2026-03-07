## `union`

### **Combine arrays** without duplicates 📍

@keywords: union, combine, unique, merge, deduplication

Merge multiple arrays into one with unique values.
Perfect for merging lists, combining selections, or deduplicating data.

```typescript
const team1 = ["Alice", "Bob", "Charlie"];
const team2 = ["Bob", "Diana", "Eve"];
const team3 = ["Alice", "Frank"];

const allMembers = union(team1, team2, team3);
// => ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"]
```

### **Merge tag lists**

@keywords: tags, merge, unique, content, indexing, seo

Combine tags from multiple sources into a unique set.
Useful for content aggregation or search indexing.

```typescript
const userTags = ["javascript", "react"];
const articleTags = ["react", "typescript", "nodejs"];
const projectTags = ["typescript", "testing"];

const allTags = union(userTags, articleTags, projectTags);
// => ["javascript", "react", "typescript", "nodejs", "testing"]
```

### **Aggregate permissions**

@keywords: permissions, aggregate, roles, access control, combine

Combine permissions from multiple roles.
Essential for access control systems.

```typescript
const adminPerms = ["read", "write", "delete"];
const editorPerms = ["read", "write", "publish"];

const combinedPerms = union(adminPerms, editorPerms);
// => ["read", "write", "delete", "publish"]
```

### **Implement** "Select All" in a selection model

@keywords: select all, selection, model, checkbox, table, design system, a11y

Merge all items from a category into the current selection without duplicates.
Essential for "Select All" checkboxes in data tables and list components.

```typescript
const currentSelection = ["item-1", "item-3"];
const categoryItems = ["item-1", "item-2", "item-3", "item-4", "item-5"];

// Select All: merge category into selection
const allSelected = union(currentSelection, categoryItems);
// => ["item-1", "item-3", "item-2", "item-4", "item-5"]

renderCheckboxes(categoryItems, allSelected);
```

### **Combine** overlay scroll strategies

@keywords: overlay, scroll, strategy, events, design system

Merge scroll event sources from multiple scrollable ancestors for an overlay.
Perfect for overlay positioning that needs to track all scrollable containers.

```typescript
const getScrollParents = (element: HTMLElement): string[] => {
  // Walk up the DOM to find scrollable ancestors
  const parents: string[] = [];
  let current = element.parentElement;
  while (current) {
    if (current.scrollHeight > current.clientHeight) {
      parents.push(current.id || current.tagName);
    }
    current = current.parentElement;
  }
  return parents;
};

const triggerScrollParents = getScrollParents(triggerElement);
const overlayScrollParents = getScrollParents(overlayElement);

// Track all unique scrollable ancestors
const allScrollSources = union(triggerScrollParents, overlayScrollParents);
allScrollSources.forEach((id) => {
  document.getElementById(id)?.addEventListener("scroll", repositionOverlay);
});
```

### **Merge** visible columns from multiple saved views

@keywords: columns, views, merge, table, dashboard, design system, presets

Combine column selections from different saved table views.
Perfect for data tables with customizable column visibility.

```typescript
const defaultColumns = ["name", "email", "status"];
const userColumns = ["name", "phone", "lastLogin"];
const adminColumns = ["name", "email", "role", "createdAt"];

const allVisibleColumns = union(defaultColumns, userColumns, adminColumns);
// => ["name", "email", "status", "phone", "lastLogin", "role", "createdAt"]
```
