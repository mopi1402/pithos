## `sleep`

### **Delay** async execution 📍

@keywords: delay, async, pause, sleep, throttle, polling, performance

Pause async execution for a specific duration.
Essential for throttling, polling intervals, or simulating latency in tests.
```typescript
await sleep(1000); // Wait 1 second
await fetchData();
```

### **Respect** API rate limits

@keywords: respect, rate-limits, throttle, batch, delays, API, scripts, ci/cd

Introduce delays between batch operations to avoid hitting rate limits.
```typescript
for (const item of batch) {
  await sendRequest(item);
  await sleep(100); // 100ms between requests
}
```

### **Simulate** network latency

@keywords: simulate, latency, network, testing, development, delays

Add artificial delays in development/testing environments.
```typescript
if (isDev) {
  await sleep(500); // Simulate slow network
}
return mockData;
```

### **Animate** sequential UI elements

@keywords: animate, sequential, stagger, UI, entrance, design system, loading

Stagger entrance animations for list items or cards.
Perfect for loading sequences and reveal animations.

```typescript
const staggerReveal = async (elements: HTMLElement[]) => {
  for (const el of elements) {
    el.classList.add("visible");
    await sleep(80); // 80ms stagger between each item
  }
};

staggerReveal([...document.querySelectorAll<HTMLElement>(".card")]);
```

### **Implement** a countdown timer

@keywords: countdown, timer, seconds, display, gaming, loading

Display a countdown before starting an action or game round.
Essential for game lobbies, quiz timers, and timed events.

```typescript
const countdown = async (seconds: number, onTick: (remaining: number) => void) => {
  for (let i = seconds; i > 0; i--) {
    onTick(i);
    await sleep(1000);
  }
  onTick(0);
};

await countdown(3, (n) => {
  display.textContent = n === 0 ? "Go!" : String(n);
});
startGame();
```

### **Wait** for CSS transition to complete

@keywords: CSS, transition, wait, animation, duration, design system

Pause execution until a CSS transition finishes before proceeding.
Essential for sequencing JS logic after CSS animations.

```typescript
const collapsePanel = async (panel: HTMLElement) => {
  panel.classList.add("collapsing");
  await sleep(300); // Match CSS transition-duration
  panel.classList.remove("collapsing");
  panel.classList.add("collapsed");
  panel.style.display = "none";
};
```

### **Delay** tooltip appearance

@keywords: tooltip, delay, hover, show, UX, design system, a11y

Show a tooltip only after the user hovers for a minimum duration.
Prevents tooltips from flashing during quick mouse movements.

```typescript
let isStillHovering = false;

element.addEventListener("mouseenter", async () => {
  isStillHovering = true;
  await sleep(400); // 400ms hover delay
  if (isStillHovering) {
    showTooltip(element);
  }
});

element.addEventListener("mouseleave", () => {
  isStillHovering = false;
  hideTooltip();
});
```
