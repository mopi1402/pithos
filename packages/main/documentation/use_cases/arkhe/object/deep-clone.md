## `deepClone`

### **Duplicate** simple state 📍

@keywords: duplicate, clone, state, immutable, mutation, Redux

Create a deep copy of an object to avoid mutation bugs.
Essential for Redux-style state updates or immutable patterns.

```typescript
const newState = deepClone(currentState);
newState.user.isActive = true; // Safe mutation
```

### **Snapshot** state history

@keywords: snapshot, history, undo, redo, state, time-travel

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
