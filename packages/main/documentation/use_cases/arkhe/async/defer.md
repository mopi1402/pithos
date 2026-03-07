## `defer`

### **Yield to the browser** between heavy operations

@keywords: yield, browser, repaint, responsive, performance, UI, design system, loading

Allow the browser to repaint and handle user input between CPU-intensive tasks.
Essential for keeping UI responsive during long computations.
```typescript
const processInChunks = async (items: Item[]) => {
  const results: Result[] = [];
  
  for (const chunk of chunks(items, 100)) {
    // Process chunk
    results.push(...chunk.map(heavyTransform));
    
    // Yield to browser - allows repaint & input handling
    await defer(() => {});
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
  await defer(() => {});
  
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

### **Defer** analytics tracking after page render

@keywords: analytics, tracking, defer, render, performance, seo, observability

Send analytics events after the page has finished rendering.
Essential for not blocking the critical rendering path with tracking calls.

```typescript
const trackPageView = async (page: string) => {
  // Let the page render first
  await defer(() => {});

  analytics.track("page_view", {
    page,
    timestamp: Date.now(),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  });
};

// Called on route change - doesn't block rendering
trackPageView("/dashboard");
```

### **Defer** portal content rendering after container mount

@keywords: portal, render, mount, container, overlay, design system

Wait for the portal container to be mounted in the DOM before rendering content.
Essential for CDK-style Portal implementations where content is projected into a remote container.

```typescript
const renderInPortal = async (content: HTMLElement, portalOutlet: HTMLElement) => {
  document.body.appendChild(portalOutlet);

  // Wait for portal container to be in the DOM
  await defer(() => {});

  portalOutlet.appendChild(content);

  // Wait for content to render before measuring
  await defer(() => {});

  const rect = content.getBoundingClientRect();
  positionOverlay(rect);
};
```

### **Yield** between heavy DOM updates for skeleton transitions

@keywords: skeleton, DOM, yield, transition, loading, design system, performance

Allow the browser to paint skeleton placeholders before replacing with real content.
Critical for smooth skeleton-to-content transitions.

```typescript
const loadSection = async (sectionId: string) => {
  showSkeleton(sectionId);

  // Let skeleton render
  await defer(() => {});

  const data = await fetchSectionData(sectionId);

  // Let browser breathe before heavy DOM swap
  await defer(() => {});

  replaceSkeleton(sectionId, renderContent(data));
};
```

### **Animate** element entrance after DOM insertion

@keywords: animate, entrance, appear, transition, DOM, design system, loading

Defer adding the animation class so the browser registers the initial state first.
Essential for CSS transition-based entrance animations.

```typescript
const animateIn = async (element: HTMLElement) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(20px)";
  container.appendChild(element);

  // Wait for browser to register initial state
  await defer(() => {});

  element.style.transition = "opacity 0.3s, transform 0.3s";
  element.style.opacity = "1";
  element.style.transform = "translateY(0)";
};
```

### **Sequence** exit then entrance animations

@keywords: exit, entrance, sequence, animation, transition, design system, panels

Wait for an exit animation to complete before starting the entrance of new content.
Perfect for page transitions, tab switches, and panel swaps.

```typescript
const swapContent = async (oldEl: HTMLElement, newEl: HTMLElement) => {
  // Exit animation
  oldEl.classList.add("fade-out");

  // Wait for exit to paint
  await defer(() => {});
  await sleep(300); // Match CSS transition duration

  oldEl.remove();
  container.appendChild(newEl);

  // Wait for DOM insertion
  await defer(() => {});

  // Entrance animation
  newEl.classList.add("fade-in");
};
```
