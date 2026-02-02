## `differenceBy`

### **Filter out duplicate objects** by a specific property 📍

@keywords: filter, duplicate, objects, property, deduplicate, unique

Remove objects from an array based on a shared property value, not reference equality.
Perfect for deduplicating user lists, filtering products, or managing unique entries.

```typescript
const allUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
];
const bannedUsers = [
  { id: 2, name: "Bob" },
  { id: 4, name: "David" },
];

const activeUsers = differenceBy(allUsers, bannedUsers, "id");
// => [{ id: 1, name: "Alice" }, { id: 3, name: "Charlie" }]
```

### **Exclude items by computed value** using a custom function

@keywords: exclude, computed, transformation, calculation, case-insensitive, normalized

Filter out elements based on a transformation or calculation result.
Perfect for case-insensitive comparisons, date filtering, or normalized matching.

```typescript
const allEmails = [
  "Alice@company.com",
  "BOB@company.com",
  "charlie@company.com",
];
const unsubscribed = ["alice@company.com", "bob@company.com"];

const activeEmails = differenceBy(allEmails, unsubscribed, (email) =>
  email.toLowerCase()
);
// => ["charlie@company.com"]
```

### **Filter items by derived date value** using a custom function

@keywords: filter, date, temporal, year, month, quarter, archive

Exclude elements based on a computed temporal value like year, month, or quarter.
Perfect for archiving old content, filtering reports by period, or managing time-based data.

```typescript
const articles = [
  { title: "News 1", date: new Date("2024-03-15") },
  { title: "News 2", date: new Date("2025-01-10") },
  { title: "News 3", date: new Date("2024-07-22") },
];
const excludedYears = [{ date: new Date("2024-01-01") }];

const currentYearArticles = differenceBy(articles, excludedYears, (a) =>
  a.date.getFullYear()
);
// => [{ title: "News 2", date: 2025-01-10 }]
```
