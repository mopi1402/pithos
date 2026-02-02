## `intersection`

### **Find common permissions** across user roles 📍

@keywords: find, common, permissions, roles, access, authorization

Identify shared access rights between multiple roles or user groups.
Perfect for permission systems, access control, or role-based authorization.

```typescript
const adminPermissions = ["read", "write", "delete", "admin", "audit"];
const editorPermissions = ["read", "write", "publish", "audit"];
const viewerPermissions = ["read", "comment", "audit"];

const commonPermissions = intersection(
  adminPermissions,
  editorPermissions,
  viewerPermissions
);
// => ["read", "audit"]
```

### **Filter available time slots** for scheduling

@keywords: filter, timeslots, scheduling, availability, calendar, meetings

Find overlapping availability across multiple participants for meetings.
Ideal for calendar apps, booking systems, or team scheduling tools.

```typescript
const aliceSlots = ["09:00", "10:00", "11:00", "14:00", "15:00"];
const bobSlots = ["10:00", "11:00", "13:00", "14:00", "16:00"];
const charlieSlots = ["08:00", "10:00", "14:00", "15:00", "17:00"];

const availableForAll = intersection(aliceSlots, bobSlots, charlieSlots);
// => ["10:00", "14:00"]
```

### **Identify common tags** across items

@keywords: identify, tags, common, attributes, recommendation, filtering

Find shared attributes between products, articles, or any tagged entities.
Useful for recommendation engines, filtering systems, or content analysis.

```typescript
const article1Tags = ["javascript", "typescript", "react", "frontend"];
const article2Tags = ["typescript", "nodejs", "backend", "react"];
const article3Tags = ["react", "typescript", "testing", "jest"];

const commonTags = intersection(article1Tags, article2Tags, article3Tags);
// => ["typescript", "react"]
```
