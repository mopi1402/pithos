## `xor`

### **Find items unique** to each array 📍

@keywords: XOR, symmetric difference, unique, compare, discrepancies

Get elements that exist in one array but not both (symmetric difference).
Perfect for comparing lists and finding discrepancies.

```typescript
const listA = ["apple", "banana", "cherry"];
const listB = ["banana", "cherry", "date"];

const uniqueToEach = xor([listA, listB]);
// => ["apple", "date"]
```

### **Detect changes** between snapshots

@keywords: changes, snapshots, diff, added, removed, observability, ci/cd

Find what was added or removed between two states.
Useful for tracking modifications or generating changelogs.

```typescript
const before = ["user1", "user2", "user3"];
const after = ["user2", "user3", "user4"];

const changes = xor([before, after]);
// => ["user1", "user4"] (user1 removed, user4 added)
```

### **Compare feature sets**

@keywords: features, compare, plans, versions, differences, ci/cd

Find features unique to each plan or version.
Essential for plan comparison or feature matrices.

```typescript
const basicPlan = ["storage", "email", "support"];
const proPlan = ["storage", "email", "analytics", "api"];

const differences = xor([basicPlan, proPlan]);
// => ["support", "analytics", "api"]
```

### **Highlight** config drift between environments

@keywords: config, drift, environments, staging, production, ci/cd, scripts, observability

Detect configuration differences between staging and production.
Critical for CI/CD pipelines and deployment validation.

```typescript
const stagingFlags = ["dark-mode", "new-checkout", "beta-search", "ai-chat"];
const productionFlags = ["dark-mode", "new-checkout", "legacy-nav"];

const drift = xor([stagingFlags, productionFlags]);
// => ["beta-search", "ai-chat", "legacy-nav"]

if (drift.length > 0) {
  console.warn(`Config drift detected: ${drift.join(", ")}`);
}
```

### **Invert** selection in a data table

@keywords: invert, selection, table, checkbox, toggle, design system, a11y

Invert the current selection by XOR-ing with all available items.
Essential for "Invert Selection" actions in data tables and file managers.

```typescript
const allItemIds = ["row-1", "row-2", "row-3", "row-4", "row-5"];
const currentSelection = ["row-1", "row-3"];

// Symmetric difference with the full list = items not currently selected
const inverted = xor([allItemIds, currentSelection]);
// => ["row-2", "row-4", "row-5"]

updateSelection(inverted);
```

### **Toggle** multiple selections at once

@keywords: toggle, multiple, selection, bulk, UI, design system, filters

Apply a bulk toggle operation on a selection list.
Perfect for "select all in category" or "invert selection" actions.

```typescript
const currentSelection = ["item-1", "item-3", "item-5"];
const categoryItems = ["item-3", "item-4", "item-5", "item-6"];

// XOR toggles: removes item-3 and item-5 (already selected), adds item-4 and item-6
const newSelection = xor([currentSelection, categoryItems]);
// => ["item-1", "item-4", "item-6"]
```
