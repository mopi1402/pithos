## `clamp` ⭐

### **Restrict** value range 📍

@keywords: restrict, clamp, range, bounds, limits, constrain, design system, panels, 3D

Constrain a number between a minimum and maximum value.
Essential for UI sliders, physical limits, or color values.

```typescript
const opacity = clamp(inputOpacity, 0, 1);
element.style.opacity = String(opacity);
console.log(`Applied opacity: ${opacity}`);
```

### **Normalize** geometric bounds

@keywords: normalize, geometric, bounds, coordinates, screen, canvas, performance, 3D, gaming

Ensure coordinates stay within the screen or map boundaries.
Perfect for game development or canvas rendering.

```typescript
const x = clamp(player.x, 0, screenWidth);
const y = clamp(player.y, 0, screenHeight);
```

### **Limit** volume or brightness levels

@keywords: limit, volume, brightness, settings, accessibility, safety, panels

Constrain user-adjustable settings to safe ranges.
Essential for accessibility and hardware protection.
```typescript
const volume = clamp(userVolume, 0, 100);
audioPlayer.setVolume(volume);
```

### **Constrain** design tokens in a design system

@keywords: design, system, tokens, font-size, spacing, z-index, CSS, constrain, design system, gaming

Ensure computed design token values stay within safe bounds.
Prevents layout breakage from extreme user preferences or dynamic calculations.

```typescript
const fontSize = clamp(baseFontSize * userScale, 12, 32);
const spacing = clamp(baseSpacing * density, 4, 48);
const zIndex = clamp(computedZ, 0, 9999);
```

### **Enforce premium bounds** for insurance calculations

@keywords: insurance, premium, bounds, assurance, tarification, regulatory, pricing, payment

Constrain calculated premiums within regulatory and business limits.
Critical for insurance pricing engines ensuring compliance and profitability.

```typescript
const MIN_PREMIUM = 150;    // Minimum viable premium
const MAX_PREMIUM = 25000;  // Regulatory cap

const calculateAutoInsurance = (driver) => {
  // Base premium calculation
  let premium = 500;
  premium *= driver.age < 25 ? 1.8 : 1.0;      // Young driver surcharge
  premium *= driver.accidents > 0 ? 1.5 : 1.0; // Accident history
  premium *= driver.vehicleValue / 20000;      // Vehicle value factor

  // Clamp to regulatory and business bounds
  return clamp(premium, MIN_PREMIUM, MAX_PREMIUM);
};

// Examples:
calculateAutoInsurance({ age: 22, accidents: 2, vehicleValue: 45000 });
// Calculated: 500 * 1.8 * 1.5 * 2.25 = 3037.5 => within bounds

calculateAutoInsurance({ age: 65, accidents: 0, vehicleValue: 8000 });
// Calculated: 500 * 1.0 * 1.0 * 0.4 = 200 => clamped to 150 (minimum premium)
```


### **Constrain** camera position in a 3D scene

@keywords: camera, 3D, scene, bounds, orbit, WebGL, gaming, canvas

Keep the camera within valid orbit bounds in a 3D viewer.
Essential for product configurators, map viewers, and 3D editors.

```typescript
const updateCamera = (input: { zoom: number; pitch: number; yaw: number }) => {
  const zoom = clamp(input.zoom, 0.5, 10);
  const pitch = clamp(input.pitch, -89, 89);
  const yaw = clamp(input.yaw, -180, 180);

  camera.setPosition({ zoom, pitch, yaw });
};

viewer.addEventListener("wheel", (e) => {
  updateCamera({ ...camera, zoom: camera.zoom - e.deltaY * 0.01 });
});
```

### **Limit** scroll-driven animation progress

@keywords: scroll, animation, progress, parallax, design system, performance

Clamp scroll progress between 0 and 1 for scroll-driven animations.
Perfect for parallax effects, sticky headers, and scroll-triggered reveals.

```typescript
const onScroll = () => {
  const raw = (window.scrollY - sectionTop) / sectionHeight;
  const progress = clamp(raw, 0, 1);

  element.style.opacity = String(progress);
  element.style.transform = `translateY(${(1 - progress) * 50}px)`;
};

window.addEventListener("scroll", onScroll);
```

### **Constrain** drag position within a container

@keywords: drag, position, container, bounds, sortable, design system, panels

Keep a dragged element within its parent container bounds.
Essential for drag-and-drop interfaces, sliders, and resizable panels.

```typescript
const onDrag = (e: PointerEvent) => {
  const rect = container.getBoundingClientRect();
  const x = clamp(e.clientX - rect.left, 0, rect.width);
  const y = clamp(e.clientY - rect.top, 0, rect.height);

  draggable.style.transform = `translate(${x}px, ${y}px)`;
};
```

### **Constrain** stepper step index within bounds

@keywords: stepper, step, index, bounds, wizard, navigation, design system

Keep the step index within valid bounds during keyboard or programmatic navigation.
Essential for stepper/wizard components preventing out-of-bounds navigation.

```typescript
const TOTAL_STEPS = 5;

const navigateStep = (current: number, delta: number) => {
  const next = clamp(current + delta, 0, TOTAL_STEPS - 1);
  setActiveStep(next);
  announceStep(`Step ${next + 1} of ${TOTAL_STEPS}`);
  return next;
};

stepper.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "ArrowRight") step = navigateStep(step, 1);
  if (e.key === "ArrowLeft") step = navigateStep(step, -1);
});
```

### **Constrain** auto-resize textarea height

@keywords: textarea, auto-resize, height, min, max, text field, design system

Limit auto-resizing textarea between minimum and maximum heights.
Essential for auto-growing text inputs that shouldn't exceed a max height.

```typescript
const MIN_HEIGHT = 40;
const MAX_HEIGHT = 300;

const autoResize = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = "auto";
  const newHeight = clamp(textarea.scrollHeight, MIN_HEIGHT, MAX_HEIGHT);
  textarea.style.height = `${newHeight}px`;
  textarea.style.overflowY = newHeight >= MAX_HEIGHT ? "auto" : "hidden";
};

textarea.addEventListener("input", () => autoResize(textarea));
```

### **Limit** resizable panel dimensions

@keywords: resize, panel, min, max, width, height, design system, panels

Constrain panel width or height during resize operations.
Perfect for resizable sidebars, split panes, and editor layouts.

```typescript
const onResize = (e: PointerEvent) => {
  const newWidth = clamp(e.clientX - panelLeft, MIN_PANEL_WIDTH, MAX_PANEL_WIDTH);
  panel.style.width = `${newWidth}px`;
  content.style.marginLeft = `${newWidth}px`;
};

resizeHandle.addEventListener("pointermove", onResize);
```
