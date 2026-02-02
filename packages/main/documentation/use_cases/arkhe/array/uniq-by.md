## `uniqBy` 💎

> Removes duplicates based on a computed key or property. Unlike simple `uniq`, this handles objects by letting you specify what makes them "equal". Essential for deduplicating API responses, removing duplicate records by ID, or filtering unique items by any property.

### **Remove duplicate objects** by ID 📍

@keywords: deduplicate, unique, ID, objects, API response

Deduplicate an array of objects based on a unique identifier.
Essential for cleaning API responses or normalizing data.

```typescript
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 1, name: "Alice Smith", email: "alice.smith@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

const uniqueUsers = uniqBy(users, (u) => u.id);
// => [
//   { id: 1, name: "Alice", email: "alice@example.com" },
//   { id: 2, name: "Bob", email: "bob@example.com" },
//   { id: 3, name: "Charlie", email: "charlie@example.com" }
// ]
```

### **Filter unique products** by SKU

@keywords: unique, SKU, products, inventory, catalog

Ensure each product appears only once in a catalog.
Perfect for inventory management or e-commerce listings.

```typescript
const products = [
  { sku: "LAPTOP-001", name: "Pro Laptop", price: 1299 },
  { sku: "MOUSE-001", name: "Wireless Mouse", price: 49 },
  { sku: "LAPTOP-001", name: "Pro Laptop v2", price: 1399 },
];

const uniqueProducts = uniqBy(products, "sku");
// => [LAPTOP-001, MOUSE-001] (first occurrence kept)
```

### **Get unique entries** by computed value

@keywords: unique, computed, case-insensitive, derived value, transform

Deduplicate based on a derived or transformed value.
Useful for case-insensitive deduplication or domain extraction.

```typescript
const emails = [
  "alice@gmail.com",
  "ALICE@GMAIL.COM",
  "bob@yahoo.com",
  "Alice@Gmail.Com",
];

const uniqueEmails = uniqBy(emails, (e) => e.toLowerCase());
// => ["alice@gmail.com", "bob@yahoo.com"]
```
