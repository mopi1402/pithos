## `uniqueId`

### **React list keys** for dynamic content 📍

@keywords: React, keys, list, dynamic, rendering, design system

Generate stable unique keys for dynamically created list items.
Essential when items lack natural unique identifiers.

```typescript
// Generate IDs once when items are created, not during render
const itemsWithKeys = rawItems.map(item => ({
  ...item,
  key: uniqueId('card_'),
}));

// Then use the stable key in render
itemsWithKeys.map(item => <Card key={item.key} {...item} />);
// Keys: 'card_1', 'card_2', 'card_3' (stable across re-renders)
```

### **Accessible form elements** with unique IDs 📍

@keywords: accessible, form, ID, label, a11y, WCAG, design system

Create unique IDs for form elements to associate labels.
Critical for accessibility compliance.

```typescript
const id = uniqueId('field_');
<label htmlFor={id}>Email</label>
<input id={id} type="email" />
```

### **Temporary entity IDs** before server persistence

@keywords: temporary, entity, ID, optimistic, update, scripts

Create temporary IDs for optimistic updates before server assigns real IDs.

```typescript
const tempId = uniqueId('temp_');
todos.push({ id: tempId, text, pending: true });
// Replace with real ID after API response
```

### **Generate** unique overlay container IDs

@keywords: overlay, container, ID, portal, dialog, design system

Create unique IDs for dynamically created overlay containers (portals).
Essential for overlay/portal systems that need to manage multiple concurrent overlays.

```typescript
const createOverlayContainer = () => {
  const id = uniqueId("cdk-overlay-");
  const container = document.createElement("div");
  container.id = id;
  container.className = "overlay-container";
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-modal", "true");
  document.body.appendChild(container);
  return { id, container };
};

// Each overlay gets its own unique container
const dialog1 = createOverlayContainer(); // cdk-overlay-1
const dialog2 = createOverlayContainer(); // cdk-overlay-2
```

### **Generate** unique ARIA IDs for connected components

@keywords: aria, ID, connected, describedby, labelledby, a11y, design system

Create unique IDs to connect ARIA attributes between related elements.
Critical for accessible components like tooltips, dialogs, and comboboxes.

```typescript
const createTooltip = (trigger: HTMLElement, content: string) => {
  const tooltipId = uniqueId("tooltip-");
  
  const tooltip = document.createElement("div");
  tooltip.id = tooltipId;
  tooltip.role = "tooltip";
  tooltip.textContent = content;
  
  trigger.setAttribute("aria-describedby", tooltipId);
  
  return { tooltipId, tooltip, trigger };
};
```

### **Generate** notification IDs for deduplication

@keywords: notification, ID, dedup, toast, queue, design system, observability

Create unique IDs for toast notifications to prevent duplicates.
Essential for notification systems that need to track and dismiss individual toasts.

```typescript
const showToast = (message: string, type: "success" | "error") => {
  const id = uniqueId("toast-");
  toastQueue.push({ id, message, type, createdAt: Date.now() });
  renderToasts(toastQueue);

  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    renderToasts(toastQueue);
  }, 5000);
};
```

### **Create** unique canvas element IDs for charts

@keywords: canvas, chart, ID, multiple, dashboard, charts, design system

Generate unique IDs for multiple chart canvas elements on the same page.
Essential for dashboards rendering several charts simultaneously.

```typescript
const createChart = (data: ChartData, container: HTMLElement) => {
  const canvasId = uniqueId("chart-canvas-");
  const canvas = document.createElement("canvas");
  canvas.id = canvasId;
  container.appendChild(canvas);

  return new Chart(canvas, { data });
};
```
