## `defer`

### **Yield to the browser** between heavy operations

@keywords: yield, browser, repaint, responsive, performance, UI

Allow the browser to repaint and handle user input between CPU-intensive tasks.
Essential for keeping UI responsive during long computations.
```typescript
const processInChunks = async (items: Item[]) => {
  const results: Result[] = [];
  
  for (const chunk of chunks(items, 100)) {
    // Process chunk
    results.push(...chunk.map(heavyTransform));
    
    // Yield to browser - allows repaint & input handling
    await defer();
  }
  
  return results;
};

// UI stays responsive even with 10,000 items
await processInChunks(largeDataset);
```

### **Ensure state updates propagate** before next operation

@keywords: state, updates, propagate, React, Vue, DOM, synchronization

Wait for React/Vue state updates to flush before reading DOM.
Critical for accurate measurements after state changes.
```typescript
const measureAfterUpdate = async () => {
  setItems([...items, newItem]); // React state update
  
  // Wait for React to flush and browser to repaint
  await defer();
  
  // Now DOM reflects the new state
  const height = containerRef.current.scrollHeight;
  containerRef.current.scrollTop = height;
};
```

### **Debounce rapid sequential calls** naturally

@keywords: debounce, batching, sequential, updates, throttle, optimization

Create a simple "next tick" debounce without timers.
Useful for batching multiple synchronous updates.
```typescript
let pendingUpdate: Promise<void> | null = null;

const batchedSave = async (data: Data) => {
  latestData = data;
  
  if (!pendingUpdate) {
    pendingUpdate = defer(async () => {
      await saveToServer(latestData);
      pendingUpdate = null;
    });
  }
  
  return pendingUpdate;
};

// Multiple rapid calls = single save with latest data
batchedSave({ a: 1 });
batchedSave({ a: 2 });
batchedSave({ a: 3 }); // Only this one is saved
```
