## `when` 💎

> A functional alternative to ternary operators. Applies a transformation only if the predicate is true.

### **Truncate text** only if too long 📍

@keywords: truncate, text, conditional, ellipsis, length, display, design system, panels

Add ellipsis only when text exceeds maximum length.
Essential for UI text display and responsive design.

```typescript
const truncate = (text, max) =>
  when(text, (t) => t.length > max, (t) => t.slice(0, max) + "...");

truncate("Hello World", 5); // "Hello..."
truncate("Hi", 5); // "Hi"
```

### **Apply discount** only for members 📍

@keywords: discount, conditional, members, pricing, ecommerce, calculation, design system

Calculate discounted price only when user has membership.
Critical for e-commerce and pricing logic.

```typescript
const getPrice = (price, user) =>
  when(price, () => user.isMember, (p) => p * 0.9);
```


### **Flip** layout properties for RTL mode

@keywords: RTL, LTR, bidirectional, flip, layout, i18n, design system

Swap left/right properties when the document direction is RTL.
Essential for design systems supporting bidirectional text layouts.

```typescript
const getPosition = (baseLeft: number, isRTL: boolean) =>
  when({ left: baseLeft, right: "auto" }, () => isRTL, (pos) => ({
    left: "auto",
    right: pos.left,
  }));

getPosition(100, false); // => { left: 100, right: "auto" }
getPosition(100, true);  // => { left: "auto", right: 100 }
```

### **Apply** reduced motion styles conditionally

@keywords: reduced motion, animation, a11y, accessibility, prefers, design system

Disable or simplify animations when the user prefers reduced motion.
Critical for accessible design systems respecting user preferences.

```typescript
const animationConfig = (duration: number, easing: string) =>
  when(
    { duration, easing, enabled: true },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    (config) => ({ ...config, duration: 0, enabled: false })
  );

animationConfig(300, "ease-out");
// Reduced motion ON:  { duration: 0, easing: "ease-out", enabled: false }
// Reduced motion OFF: { duration: 300, easing: "ease-out", enabled: true }
```

### **Collapse** panel content when screen is small

@keywords: collapse, panel, responsive, mobile, breakpoint, panels, design system

Automatically collapse sidebar or panel content on small screens.
Perfect for responsive dashboards and adaptive layouts.

```typescript
const panelState = (width: number) =>
  when({ expanded: true, width }, (s) => s.width < 768, (s) => ({ ...s, expanded: false }));

panelState(1024); // => { expanded: true, width: 1024 }
panelState(640);  // => { expanded: false, width: 640 }
```

### **Add** accessibility label only when icon-only

@keywords: a11y, accessibility, label, icon, button, aria, design system

Add an aria-label only when a button has no visible text.
Essential for accessible icon buttons in design systems.

```typescript
const buttonProps = (label: string, hasText: boolean) =>
  when({ label }, () => !hasText, (props) => ({ ...props, "aria-label": props.label }));

buttonProps("Close", false); // => { label: "Close", "aria-label": "Close" }
buttonProps("Close", true);  // => { label: "Close" }
```
