## `debounce` ⭐

### **Optimize search** input performance 📍

@keywords: optimize, search, input, typing, autocomplete, performance

Delay search execution until user stops typing to reduce API calls and improve performance.
Essential for search interfaces and autocomplete functionality.

```typescript
const search = debounce((query) => {
  api.search(query);
}, 300);

// User types "hello"... only one API call after 300ms
input.addEventListener("input", (e) => search((e.target as HTMLInputElement).value));
```

### **Delay API** calls until idle 📍

@keywords: delay, API, idle, optimization, network, throttle

Delay API requests until user stops interacting to prevent server overload.
Critical for API optimization and reducing unnecessary network traffic.

```typescript
const saveData = debounce((data) => {
  api.save(data);
}, 1000);

// Save only after user stops editing for 1 second
editor.on("change", (data) => saveData(data));
```

### **Prevent rapid** button clicks

@keywords: prevent, rapid, clicks, submission, forms, duplicate

Debounce button clicks to prevent accidental multiple submissions.
Useful for form submissions and user interface interactions.

```typescript
const submitForm = debounce(() => {
  form.submit();
}, 500, true); // Immediate = true

// Only first click triggers action
button.addEventListener("click", submitForm);
```

### **Rate-limit WebSocket** messages in real-time apps

@keywords: websocket, realtime, messages, rate-limit, trading, chat, streaming, performance

Debounce high-frequency WebSocket messages to prevent UI overload.
Critical for trading platforms, live dashboards, and real-time collaboration tools.

```typescript
// Debounce price updates from trading WebSocket
const handlePriceUpdate = debounce((priceData) => {
  updateTradingChart(priceData);
  recalculatePortfolioValue(priceData);
}, 100);

websocket.on("price_update", (data) => {
  handlePriceUpdate(data);
});

// For live chat typing indicators
const sendTypingIndicator = debounce(() => {
  socket.emit("user_typing", { roomId, userId });
}, 500);

messageInput.addEventListener("input", sendTypingIndicator);
```


### **Auto-save** documents while editing

@keywords: auto-save, document, editor, draft, Google Docs, persistence, form

Save document or form content automatically after the user stops typing.
Essential for rich text editors, note-taking apps, and any "Google Docs-like" experience.

```typescript
const autoSave = debounce(async (content: string) => {
  await api.saveDraft({ content, updatedAt: Date.now() });
  showSaveIndicator("Saved");
}, 2000);

editor.on("change", (content) => {
  showSaveIndicator("Saving...");
  autoSave(content);
});
```

### **Debounce** filter panel changes

@keywords: filter, panel, debounce, search, catalog, ecommerce, filters, design system

Wait for the user to finish adjusting filters before fetching results.
Essential for faceted search with multiple filter controls (sliders, checkboxes).

```typescript
const applyFilters = debounce(async (filters: FilterState) => {
  const results = await api.searchProducts(filters);
  renderProductGrid(results);
  updateFilterCounts(results.facets);
}, 400);

priceSlider.addEventListener("input", (e) => {
  applyFilters({ ...currentFilters, priceRange: parseRange(e) });
});

categoryCheckbox.addEventListener("change", () => {
  applyFilters({ ...currentFilters, categories: getCheckedCategories() });
});
```

### **Delay** window resize recalculations

@keywords: resize, recalculate, layout, responsive, chart, performance, charts

Recalculate chart dimensions or complex layouts only after resizing stops.
Critical for chart libraries and responsive canvas elements.

```typescript
const recalcLayout = debounce(() => {
  const { width, height } = container.getBoundingClientRect();
  chart.resize(width, height);
  chart.redraw();
}, 250);

window.addEventListener("resize", recalcLayout);
```

### **Trigger** infinite scroll loading

@keywords: infinite, scroll, load more, pagination, feed, design system, loading, huge dataset

Load the next page of content when the user stops scrolling near the bottom.
Essential for social feeds, product listings, and content-heavy pages.

```typescript
const checkInfiniteScroll = debounce(() => {
  const { scrollTop, scrollHeight, clientHeight } = container;
  const nearBottom = scrollTop + clientHeight >= scrollHeight - 200;

  if (nearBottom && !isLoading) {
    loadNextPage();
  }
}, 150);

container.addEventListener("scroll", checkInfiniteScroll);
```

### **Debounce** drag-end to finalize drop position

@keywords: drag, drop, finalize, position, sortable, design system

Wait for the user to settle on a drop position before committing the reorder.
Perfect for sortable lists and kanban boards where rapid dragging occurs.

```typescript
const finalizeDrop = debounce((targetIndex: number) => {
  commitReorder(draggedItem, targetIndex);
  clearDropIndicators();
  saveOrder();
}, 200);

sortableList.addEventListener("dragover", (e) => {
  const targetIndex = getInsertIndex(e.clientY);
  showDropIndicator(targetIndex);
  finalizeDrop(targetIndex);
});
```

### **Debounce** content observer mutations

@keywords: content, observer, mutation, DOM, resize, design system, performance

Debounce MutationObserver callbacks to batch rapid DOM changes.
Essential for CDK-style ContentObserver that watches for content changes in components.

```typescript
const observeContent = (element: HTMLElement, callback: () => void) => {
  const debouncedCallback = debounce(callback, 50);

  const observer = new MutationObserver(debouncedCallback);
  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => observer.disconnect();
};

// Watch for content changes to recalculate overlay position
const disconnect = observeContent(triggerElement, () => {
  repositionOverlay();
});
```

### **Debounce** container resize for responsive components

@keywords: container, resize, responsive, observer, breakpoint, design system, performance

Debounce ResizeObserver callbacks to avoid layout thrashing during resize.
Critical for CDK-style responsive components that adapt to container size.

```typescript
const observeResize = (element: HTMLElement, callback: (rect: DOMRectReadOnly) => void) => {
  const debouncedCallback = debounce((entries: ResizeObserverEntry[]) => {
    const entry = entries[entries.length - 1];
    callback(entry.contentRect);
  }, 100);

  const observer = new ResizeObserver(debouncedCallback);
  observer.observe(element);

  return () => observer.disconnect();
};

// Adapt component layout based on container width
observeResize(container, (rect) => {
  const layout = rect.width < 400 ? "compact" : "full";
  component.setLayout(layout);
});
```

### **Detect** element overflow after content changes

@keywords: overflow, detect, content, resize, ellipsis, tooltip, design system

Check if text overflows its container after dynamic content updates.
Essential for showing "..." tooltips or "Show more" buttons only when needed.

```typescript
const checkOverflow = debounce(() => {
  textElements.forEach((el) => {
    const isOverflowing = el.scrollWidth > el.clientWidth;
    el.classList.toggle("has-tooltip", isOverflowing);
    el.title = isOverflowing ? el.textContent ?? "" : "";
  });
}, 200);

// Re-check after content changes or window resize
window.addEventListener("resize", checkOverflow);
```
