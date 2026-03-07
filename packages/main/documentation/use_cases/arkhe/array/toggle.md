## `toggle` ⭐

### **Manage selected items** in a multi-select UI 📍

@keywords: toggle, multi-select, checkbox, selection, filter, design system, filters, panels

Toggle selection state for checkboxes, tags, or list items.
Perfect for filter panels, shopping carts, or bulk action selectors.

```typescript
let selectedFilters = ["electronics", "in-stock"];

selectedFilters = toggle(selectedFilters, "on-sale");
// => ["electronics", "in-stock", "on-sale"]  (added)

selectedFilters = toggle(selectedFilters, "electronics");
// => ["in-stock", "on-sale"]  (removed)
```

### **Handle favorites or bookmarks** 📍

@keywords: favorites, bookmarks, wishlist, saved, toggle, design system, panels

Add or remove items from saved lists with a single action.
Ideal for wishlists, reading lists, or starred content.

```typescript
let bookmarkedIds = [101, 205, 342];

bookmarkedIds = toggle(bookmarkedIds, 205);
// => [101, 342]  (removed)

bookmarkedIds = toggle(bookmarkedIds, 789);
// => [101, 342, 789]  (added)
```

### **Manage user permissions** dynamically

@keywords: permissions, access control, grant, revoke, roles, browser permissions

Grant or revoke access rights with a single action.
Useful for admin panels, role management, or feature flags.

```typescript
let permissions = ["read", "write"];

permissions = toggle(permissions, "delete");
// => ["read", "write", "delete"]  (granted)

permissions = toggle(permissions, "write");
// => ["read", "delete"]  (revoked)
```

### **Toggle** sidebar panels in a dashboard

@keywords: sidebar, panel, dashboard, expand, collapse, UI, panels, design system

Open or close dashboard panels with a single action.
Perfect for multi-panel layouts where users customize their workspace.

```typescript
let openPanels = ["overview", "metrics"];

openPanels = toggle(openPanels, "logs");
// => ["overview", "metrics", "logs"]  (opened)

openPanels = toggle(openPanels, "overview");
// => ["metrics", "logs"]  (closed)

// Render panels
panels.forEach((panel) => {
  panel.visible = openPanels.includes(panel.id);
});
```

### **Manage** active filters in a product catalog

@keywords: active, filter, catalog, ecommerce, faceted, search, filters

Toggle filter chips on and off in a faceted search interface.
Essential for e-commerce product filtering and search refinement.

```typescript
let activeFilters = ["in-stock", "free-shipping"];

// User clicks "On Sale" chip
activeFilters = toggle(activeFilters, "on-sale");
// => ["in-stock", "free-shipping", "on-sale"]

// User clicks "Free Shipping" again to remove it
activeFilters = toggle(activeFilters, "free-shipping");
// => ["in-stock", "on-sale"]

const filteredProducts = products.filter((p) =>
  activeFilters.every((f) => p.tags.includes(f))
);
```

### **Toggle** checkbox state in a form group

@keywords: checkbox, form, group, checked, unchecked, design system, a11y

Manage checked items in a checkbox group with a single toggle call.
Essential for form components with multi-select checkboxes.

```typescript
let checkedOptions = ["email", "sms"];

// User clicks "push" checkbox
checkedOptions = toggle(checkedOptions, "push");
// => ["email", "sms", "push"]

// User unchecks "email"
checkedOptions = toggle(checkedOptions, "email");
// => ["sms", "push"]

// Render checkboxes
options.forEach((opt) => {
  const isChecked = checkedOptions.includes(opt.value);
  renderCheckbox(opt, isChecked);
});
```

### **Toggle** expanded rows in a data table

@keywords: expand, collapse, row, table, accordion, design system, panels

Expand or collapse detail rows in a data table.
Perfect for master-detail tables and accordion-style data displays.

```typescript
let expandedRowIds = ["row-3"];

const toggleRow = (rowId: string) => {
  expandedRowIds = toggle(expandedRowIds, rowId);
  renderTable(data, expandedRowIds);
};

// User clicks expand icon on row-5
toggleRow("row-5");
// expandedRowIds => ["row-3", "row-5"]

// User clicks again on row-3
toggleRow("row-3");
// expandedRowIds => ["row-5"]
```
