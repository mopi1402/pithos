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

@keywords: tags, merge, unique, content, indexing

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
