## `throttle` ⭐

### **Limit function** execution frequency 📍

@keywords: limit, throttle, frequency, rate-limiting, performance, control

Control the rate of function execution to prevent performance issues.
Essential for performance optimization and preventing excessive resource usage.

```typescript
const logScroll = throttle(() => {
  console.log("Scrolled!");
}, 100);

window.addEventListener("scroll", logScroll);
```

### **Optimize scroll** and resize events

@keywords: optimize, scroll, resize, events, performance, responsive, design system

Limit the frequency of scroll and resize event handlers.
Critical for responsive design and scroll-based UI.

```typescript
const updateLayout = throttle(() => {
  recalculateLayout(); 
}, 16); // ~60fps

window.addEventListener("resize", updateLayout);
```

### Control animation frame rates

@keywords: animation, frames, rate, performance, canvas, smooth, design system, 3D, gaming

Limit animation updates to maintain smooth performance.
Essential for smooth animations and visual effects.

```typescript
const updateCanvas = throttle((mouseX: number, mouseY: number) => {
  ctx.clearRect(0, 0, width, height);
  drawParticles(mouseX, mouseY);
}, 33); // Cap at ~30fps

canvas.addEventListener("mousemove", (e) => updateCanvas(e.offsetX, e.offsetY));
```

### **Rate-limit ticket purchases** during high-demand sales

@keywords: tickets, events, concerts, rate-limit, sales, queue, fairness, payment

Throttle ticket purchase requests to ensure fair access during flash sales.
Essential for concert ticketing, sports events, and limited availability sales.

```typescript
// Throttle purchase attempts to 1 per second per user
const attemptPurchase = throttle(async (ticketId, userId) => {
  const result = await ticketingAPI.purchase({ ticketId, userId });
  if (result.success) {
    showConfirmation(result.ticket);
  } else {
    showWaitlistOption();
  }
}, 1000);

buyButton.addEventListener("click", () => {
  attemptPurchase(selectedTicketId, currentUserId);
});

// Throttle seat selection updates to reduce server load
const updateSeatSelection = throttle((seats) => {
  api.reserveSeats(seats);
  updateSeatMap(seats);
}, 500);

seatPicker.on("selection_change", updateSeatSelection);
```


### **Smooth** canvas drawing with pointer tracking

@keywords: canvas, drawing, pointer, paint, brush, design system, performance

Throttle pointer move events to control brush stroke density on a canvas.
Essential for drawing apps, signature pads, and annotation tools.

```typescript
const drawStroke = throttle((x: number, y: number) => {
  ctx.lineTo(x, y);
  ctx.stroke();
}, 16); // ~60fps

canvas.addEventListener("pointermove", (e) => {
  if (isDrawing) {
    drawStroke(e.offsetX, e.offsetY);
  }
});
```

### **Limit** gesture recognition updates on mobile

@keywords: gesture, touch, mobile, swipe, pinch, responsive, performance

Throttle touch events during pinch-to-zoom or swipe gestures.
Critical for mobile web apps handling complex multi-touch interactions.

```typescript
const handlePinch = throttle((scale: number, centerX: number, centerY: number) => {
  applyZoom(scale, centerX, centerY);
  updateMinimap();
}, 50);

element.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    const scale = getDistance(e.touches[0], e.touches[1]) / initialDistance;
    const center = getMidpoint(e.touches[0], e.touches[1]);
    handlePinch(scale, center.x, center.y);
  }
});
```

### **Track** drag-and-drop position updates

@keywords: drag, drop, position, move, sortable, design system, performance

Throttle drag events to update drop zone indicators without overwhelming the renderer.
Essential for sortable lists, kanban boards, and drag-and-drop builders.

```typescript
const onDrag = throttle((e: DragEvent) => {
  const dropTarget = getDropTarget(e.clientX, e.clientY);
  highlightDropZone(dropTarget);
  updateDragPreview(e.clientX, e.clientY);
}, 32); // ~30fps is enough for visual feedback

draggable.addEventListener("drag", onDrag);
```

### **Update** sticky header shadow on scroll

@keywords: sticky, header, shadow, scroll, elevation, design system, performance

Add or remove a shadow on a sticky header based on scroll position.
Perfect for app shells and dashboard layouts with fixed navigation.

```typescript
const updateHeaderShadow = throttle(() => {
  const scrolled = window.scrollY > 0;
  header.classList.toggle("elevated", scrolled);
}, 100);

window.addEventListener("scroll", updateHeaderShadow);
```

### **Throttle** pull-to-refresh gesture detection

@keywords: pull, refresh, gesture, mobile, touch, design system, PWA

Limit pull-to-refresh progress updates during touch drag.
Critical for mobile web apps implementing native-like pull-to-refresh.

```typescript
const onPullProgress = throttle((distance: number) => {
  const progress = clamp(distance / PULL_THRESHOLD, 0, 1);
  refreshIndicator.style.transform = `translateY(${distance}px) rotate(${progress * 360}deg)`;
  refreshIndicator.style.opacity = String(progress);
}, 16);

container.addEventListener("touchmove", (e) => {
  if (isPulling) {
    const distance = e.touches[0].clientY - pullStartY;
    onPullProgress(distance);
  }
});
```

### **Dispatch** scroll events to multiple overlay subscribers

@keywords: scroll, dispatch, overlay, subscriber, reposition, design system, performance

Throttle a centralized scroll dispatcher that notifies all active overlays.
Essential for CDK-style ScrollDispatcher that manages overlay repositioning.

```typescript
const activeOverlays: Array<{ reposition: () => void }> = [];

const scrollDispatcher = throttle(() => {
  activeOverlays.forEach((overlay) => overlay.reposition());
}, 16);

// Single scroll listener for all overlays
window.addEventListener("scroll", scrollDispatcher, { passive: true });

// Overlays register/unregister
const registerOverlay = (overlay: { reposition: () => void }) => {
  activeOverlays.push(overlay);
  return () => {
    const idx = activeOverlays.indexOf(overlay);
    if (idx >= 0) activeOverlays.splice(idx, 1);
  };
};
```

### **Limit** virtual scroll position recalculations

@keywords: virtual, scroll, recalculate, position, viewport, performance, huge dataset, design system

Throttle scroll handler in a virtual scroll implementation to reduce layout thrashing.
Essential for rendering large lists (10k+ items) without performance degradation.

```typescript
const onVirtualScroll = throttle(() => {
  const scrollTop = container.scrollTop;
  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const endIndex = startIndex + Math.ceil(container.clientHeight / ROW_HEIGHT);

  renderVisibleRows(startIndex, endIndex);
  updateScrollbar(scrollTop);
}, 16); // 60fps

container.addEventListener("scroll", onVirtualScroll);
```
