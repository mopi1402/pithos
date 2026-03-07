## `inRange`

### **Check** numeric boundaries 📍

@keywords: check, range, boundaries, validation, inclusive, exclusive, design system, canvas, 3D, gaming

Verify if a number falls within a specific range (min inclusive, max exclusive).
Essential for hit detection, categorization, or validation.

```typescript
if (inRange(age, 18, 65)) {
  grantAccess();
}
```

### **Validate** indices

@keywords: validate, indices, array, bounds, safety, access, canvas, gaming

Ensure an array index is valid before accessing.
Useful for safe array operations.

```typescript
if (inRange(index, 0, items.length)) {
  processItem(items[index]);
}
```

### **Categorize** values into tiers

@keywords: tier, band, category, pricing, grade, classification, design system, payment, panels

Map a numeric value to a named tier or grade.
Useful for pricing plans, performance ratings, or gamification levels.

```typescript
const getPricingTier = (monthlySpend: number) => {
  if (inRange(monthlySpend, 0, 100)) return 'free';
  if (inRange(monthlySpend, 100, 500)) return 'starter';
  if (inRange(monthlySpend, 500, 2000)) return 'pro';
  return 'enterprise';
};

getPricingTier(250);  // => 'starter'
getPricingTier(1500); // => 'pro'
```

### **Detect heart rate zones** for fitness training

@keywords: sports, fitness, heart rate, zones, training, athletes, cardio, wearable

Determine training intensity zones based on heart rate during workouts.
Essential for fitness apps, sports wearables, and athletic training programs.

```typescript
const getHeartRateZone = (bpm: number, maxHR: number) => {
  const percentage = (bpm / maxHR) * 100;

  if (inRange(percentage, 50, 60)) return { zone: 1, name: "Recovery", color: "gray" };
  if (inRange(percentage, 60, 70)) return { zone: 2, name: "Fat Burn", color: "blue" };
  if (inRange(percentage, 70, 80)) return { zone: 3, name: "Cardio", color: "green" };
  if (inRange(percentage, 80, 90)) return { zone: 4, name: "Threshold", color: "orange" };
  if (inRange(percentage, 90, 100)) return { zone: 5, name: "VO2 Max", color: "red" };

  return { zone: 0, name: "Rest", color: "white" };
};

// For a 30-year-old athlete (max HR = 220 - 30 = 190)
const maxHR = 190;
getHeartRateZone(145, maxHR); // => { zone: 3, name: "Cardio", color: "green" }
getHeartRateZone(175, maxHR); // => { zone: 5, name: "VO2 Max", color: "red" }

// Live monitoring during workout
wearable.on("heartbeat", (bpm) => {
  const zone = getHeartRateZone(bpm, maxHR);
  updateZoneDisplay(zone);
});
```


### **Detect** click zones on a canvas

@keywords: click, zone, hitbox, canvas, interactive, gaming, 3D

Check if a click position falls within a specific interactive region.
Essential for canvas-based UIs, image maps, and game hit detection.

```typescript
const buttons = [
  { id: "play", x: 100, y: 200, w: 120, h: 40 },
  { id: "settings", x: 100, y: 260, w: 120, h: 40 },
];

canvas.addEventListener("click", (e) => {
  const clicked = buttons.find(
    (btn) =>
      inRange(e.offsetX, btn.x, btn.x + btn.w) &&
      inRange(e.offsetY, btn.y, btn.y + btn.h)
  );

  if (clicked) handleButtonClick(clicked.id);
});
```

### **Validate** responsive breakpoints

@keywords: responsive, breakpoint, media, screen, design system, CSS

Determine which breakpoint tier the current viewport falls into.
Perfect for JS-driven responsive layouts and adaptive component rendering.

```typescript
const getBreakpoint = (width: number) => {
  if (inRange(width, 0, 640)) return "mobile";
  if (inRange(width, 640, 1024)) return "tablet";
  if (inRange(width, 1024, 1440)) return "desktop";
  return "wide";
};

const breakpoint = getBreakpoint(window.innerWidth);
// => "tablet" for a 768px viewport
```

### **Determine** if an element is in the viewport

@keywords: viewport, visible, intersection, lazy loading, design system, performance, seo

Check if an element's position falls within the visible viewport range.
Essential for custom intersection observers and lazy loading triggers.

```typescript
const isInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return (
    inRange(rect.top, -rect.height, window.innerHeight) &&
    inRange(rect.left, -rect.width, window.innerWidth)
  );
};

// Lazy-load images when they enter viewport
images.forEach((img) => {
  if (isInViewport(img)) {
    img.src = img.dataset.src;
  }
});
```

### **Dismiss** overlay when click is outside bounds

@keywords: overlay, dismiss, click outside, backdrop, modal, dialog, design system

Check if a click event falls outside the overlay bounds to trigger dismissal.
Essential for modal dialogs, dropdowns, and tooltip overlays.

```typescript
const overlayRect = overlay.getBoundingClientRect();

document.addEventListener("pointerdown", (e: PointerEvent) => {
  const insideX = inRange(e.clientX, overlayRect.left, overlayRect.right);
  const insideY = inRange(e.clientY, overlayRect.top, overlayRect.bottom);

  if (!insideX || !insideY) {
    closeOverlay();
  }
});
```

### **Constrain** tooltip position within viewport

@keywords: tooltip, position, viewport, constrain, overflow, design system, a11y

Verify that a tooltip's computed position stays within the visible viewport.
Critical for overlay positioning strategies that prevent off-screen content.

```typescript
const positionTooltip = (anchor: DOMRect, tooltip: DOMRect) => {
  let top = anchor.bottom + 8;
  let left = anchor.left + anchor.width / 2 - tooltip.width / 2;

  // Flip if tooltip would overflow bottom
  if (!inRange(top + tooltip.height, 0, window.innerHeight)) {
    top = anchor.top - tooltip.height - 8;
  }

  // Shift if tooltip would overflow sides
  if (!inRange(left, 0, window.innerWidth - tooltip.width)) {
    left = clamp(left, 8, window.innerWidth - tooltip.width - 8);
  }

  return { top, left };
};
```

### **Validate** stepper step index

@keywords: stepper, step, wizard, multi-step, form, validation, design system

Ensure the current step index is within valid bounds in a multi-step wizard.
Essential for stepper components preventing navigation to invalid steps.

```typescript
const TOTAL_STEPS = 5;

const goToStep = (currentStep: number, targetStep: number) => {
  if (!inRange(targetStep, 0, TOTAL_STEPS)) {
    console.warn(`Step ${targetStep} is out of bounds`);
    return currentStep;
  }

  // Only allow forward navigation if current step is valid
  if (targetStep > currentStep && !isStepValid(currentStep)) {
    showValidationErrors(currentStep);
    return currentStep;
  }

  return targetStep;
};

nextButton.addEventListener("click", () => {
  step = goToStep(step, step + 1);
  renderStep(step);
});
```

### **Check** if scroll position is in a sticky zone

@keywords: sticky, zone, scroll, position, header, navigation, design system

Determine if the current scroll position falls within a sticky activation range.
Perfect for sticky headers, floating action buttons, and scroll-aware navigation.

```typescript
const stickyStart = sectionTop;
const stickyEnd = sectionTop + sectionHeight - headerHeight;

const updateStickyState = () => {
  const scrollY = window.scrollY;

  if (inRange(scrollY, stickyStart, stickyEnd)) {
    header.classList.add("sticky");
    header.style.top = "0";
  } else {
    header.classList.remove("sticky");
  }
};

window.addEventListener("scroll", updateStickyState);
```
