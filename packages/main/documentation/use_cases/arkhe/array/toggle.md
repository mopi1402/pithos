## `toggle` ⭐

### **Manage selected items** in a multi-select UI 📍

@keywords: toggle, multi-select, checkbox, selection, filter

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

@keywords: favorites, bookmarks, wishlist, saved, toggle

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

@keywords: permissions, access control, grant, revoke, roles

Grant or revoke access rights with a single action.
Useful for admin panels, role management, or feature flags.

```typescript
let permissions = ["read", "write"];

permissions = toggle(permissions, "delete");
// => ["read", "write", "delete"]  (granted)

permissions = toggle(permissions, "write");
// => ["read", "delete"]  (revoked)
```
