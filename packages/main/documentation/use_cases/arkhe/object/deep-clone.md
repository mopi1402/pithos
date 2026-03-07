## `deepClone`

### **Duplicate** simple state 📍

@keywords: duplicate, clone, state, immutable, mutation, Redux, performance, gaming

Create a deep copy of an object to avoid mutation bugs.
Essential for Redux-style state updates or immutable patterns.

```typescript
const newState = deepClone(currentState);
newState.user.isActive = true; // Safe mutation
```

### **Snapshot** state history

@keywords: snapshot, history, undo, redo, state, time-travel, gaming

Store copies of state at specific points in time for undo/redo functionality.

```typescript
const history = [];
function pushState(state) {
  history.push(deepClone(state));
}
```

### **Break** references

@keywords: break, references, decoupling, isolation, mutation, safety

Ensure that nested objects are fully decoupled from the original.
Useful when passing data to components that might mutate it.

```typescript
const original = { config: { retries: 3 } };
const copy = deepClone(original);
copy.config.retries = 5;
console.log(original.config.retries); // 3
```

### **Clone** form state for reset and dirty-checking

@keywords: form, reset, dirty, checking, clone, original, comparison, state, design system, PWA

Store the initial form state to enable "Reset" and detect unsaved changes.
Universal pattern for form-heavy applications with save/discard workflows.

```typescript
const initialValues = deepClone(formData);

// User edits the form...
formData.name = "Updated Name";
formData.address.city = "New City";

// Dirty check: compare current state with original
const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialValues);
// => true

// Reset: restore original values
function resetForm() {
  Object.assign(formData, deepClone(initialValues));
}
```

### **Save** game state checkpoints

@keywords: save, game, state, checkpoint, snapshot, gaming, undo

Store deep copies of game state at key moments for save/load functionality.
Essential for games with save points, level transitions, or undo mechanics.

```typescript
const saveCheckpoint = (gameState: GameState) => {
  const checkpoint = deepClone(gameState);
  checkpoints.push({
    state: checkpoint,
    timestamp: Date.now(),
    level: gameState.currentLevel,
  });
};

// Player reaches a save point
saveCheckpoint(currentGameState);

// Load last checkpoint after game over
const lastSave = checkpoints[checkpoints.length - 1];
currentGameState = deepClone(lastSave.state);
```

### **Clone** overlay configuration before opening

@keywords: overlay, config, dialog, modal, clone, mutation, design system

Deep clone overlay options before passing to the overlay service to prevent shared state.
Essential for overlay/dialog systems where multiple instances share a base config.

```typescript
const baseDialogConfig = {
  width: "400px",
  hasBackdrop: true,
  position: { top: "100px" },
  panelClass: "default-dialog",
  data: { title: "", content: "" },
};

const openDialog = (overrides: Partial<typeof baseDialogConfig>) => {
  const config = deepClone(baseDialogConfig);
  Object.assign(config, overrides);
  Object.assign(config.data, overrides.data);
  return overlayService.open(config);
};

// Each dialog gets its own config, no shared mutation
openDialog({ data: { title: "Confirm", content: "Are you sure?" } });
openDialog({ data: { title: "Delete", content: "This is permanent." } });
```

### **Snapshot** tree expand/collapse state for undo

@keywords: tree, expand, collapse, state, undo, snapshot, design system

Clone the tree expansion state before a bulk operation to enable undo.
Essential for tree components with "Expand All" / "Collapse All" actions.

```typescript
const treeState = {
  "root": { expanded: true },
  "root/src": { expanded: true },
  "root/src/components": { expanded: false },
  "root/tests": { expanded: false },
};

let previousState = deepClone(treeState);

const expandAll = () => {
  previousState = deepClone(treeState);
  Object.values(treeState).forEach((node) => { node.expanded = true; });
  renderTree(treeState);
};

const undoExpand = () => {
  Object.assign(treeState, deepClone(previousState));
  renderTree(treeState);
};
```

### **Clone** cached API response before mutation

@keywords: cache, API, response, clone, mutation, safety, PWA, performance

Deep clone cached data before modifying it to keep the cache intact.
Critical for apps with client-side caching where components may mutate data.

```typescript
const getCachedUsers = () => {
  const cached = cache.get("users");
  if (!cached) return null;

  // Clone so mutations don't corrupt the cache
  return deepClone(cached);
};

const users = getCachedUsers();
users[0].name = "Modified"; // Safe: cache is untouched
```
