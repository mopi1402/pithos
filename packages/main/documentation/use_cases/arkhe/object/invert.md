## `invert`

### **Build** reverse enum lookups 📍

@keywords: build, reverse, enum, lookup, bidirectional, mapping, i18n

Create a reverse mapping from enum-like objects for bidirectional access.
Essential for converting between display names and internal codes.
```typescript
const StatusCode = { PENDING: 'P', APPROVED: 'A', REJECTED: 'R' };
const StatusLabel = invert(StatusCode);
// { 'P': 'PENDING', 'A': 'APPROVED', 'R': 'REJECTED' }

const label = StatusLabel[record.status]; // 'P' → 'PENDING'
```

### **Swap** keys and values

@keywords: swap, keys, values, reverse, mapping, bidirectional

Create a reverse lookup map from an object.
Useful for bidirectional mapping (e.g., ID to Name and Name to ID).
```typescript
const idMap = { admin: 1, user: 2 };
const roleMap = invert(idMap); // { '1': 'admin', '2': 'user' }
```

### **Index** by value

@keywords: index, value, lookup, search, find, key

Quickly find the key associated with a specific value.
```typescript
const colors = { red: '#ff0000', blue: '#0000ff' };
const colorName = invert(colors)['#ff0000']; // 'red'
```

### **Map** keyboard shortcuts to actions

@keywords: keyboard, shortcuts, hotkeys, actions, mapping, design system, a11y

Create a reverse lookup from key combinations to action names.
Essential for keyboard shortcut systems and accessibility features.

```typescript
const actionToKey = {
  save: "Ctrl+S",
  undo: "Ctrl+Z",
  redo: "Ctrl+Shift+Z",
  search: "Ctrl+K",
  close: "Escape",
};

const keyToAction = invert(actionToKey);
// => { "Ctrl+S": "save", "Ctrl+Z": "undo", ... }

document.addEventListener("keydown", (e) => {
  const combo = formatKeyCombo(e);
  const action = keyToAction[combo];
  if (action) executeAction(action);
});
```
