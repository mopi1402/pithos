## `throttle` ⭐

### **Limit function** execution frequency 📍

@keywords: limit, throttle, frequency, rate-limiting, performance, control

Control the rate of function execution to prevent performance issues.
Essential for performance optimization and preventing excessive resource usage.

```typescript
const logScroll = throttle(() => {
  console.log("Scrolled!");
}, 100);

window.on("scroll", logScroll);
```

### **Optimize scroll** and resize events

@keywords: optimize, scroll, resize, events, performance, responsive

Limit the frequency of scroll and resize event handlers.
Critical for responsive design and scroll-based UI.

```typescript
const updateLayout = throttle(() => {
  recalculateLayout(); 
}, 16); // ~60fps

window.on("resize", updateLayout);
```

### Control animation frame rates

@keywords: animation, frames, rate, performance, canvas, smooth

Limit animation updates to maintain smooth performance.
Essential for smooth animations and visual effects.

```typescript
const updateCanvas = throttle((mouseX: number, mouseY: number) => {
  ctx.clearRect(0, 0, width, height);
  drawParticles(mouseX, mouseY);
}, 33); // Cap at ~30fps

canvas.on("mousemove", (e) => updateCanvas(e.offsetX, e.offsetY));
```

### **Rate-limit ticket purchases** during high-demand sales

@keywords: tickets, events, concerts, rate-limit, sales, queue, fairness

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

buyButton.on("click", () => {
  attemptPurchase(selectedTicketId, currentUserId);
});

// Throttle seat selection updates to reduce server load
const updateSeatSelection = throttle((seats) => {
  api.reserveSeats(seats);
  updateSeatMap(seats);
}, 500);

seatPicker.on("selection_change", updateSeatSelection);
```

