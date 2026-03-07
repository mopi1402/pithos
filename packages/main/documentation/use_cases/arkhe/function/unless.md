## `unless` 💎

> The logical inverse of `when`. Applies a transformation only if the predicate is false.

### **Add defaults** only when missing 📍

@keywords: defaults, conditional, missing, normalization, URL, prefix

Add 'https://' prefix only when URL doesn't already have it.
Essential for URL normalization and ensuring valid links.

```typescript
const ensureProto = (url) => 
  unless(url, (u) => u.startsWith("http"), (u) => `https://${u}`);

ensureProto("google.com"); // "https://google.com"
ensureProto("https://site.com"); // "https://site.com"
```

### **Skip validation** for admin users

@keywords: skip, validation, conditional, admin, permissions, roles

Apply validation rules only for non-admin users.
Critical for permission systems and role-based logic.

```typescript
const validate = (user) => 
  unless(user, (u) => u.isAdmin, (u) => {
    if (!u.email) throw new Error("Email required");
    return u;
  });
```

### **Lazy-load** images unless already in viewport

@keywords: lazy, load, images, viewport, performance, intersection, seo

Skip lazy-loading for images already visible on initial render.
Essential for above-the-fold optimization and Core Web Vitals.

```typescript
const maybeLazyLoad = (img: HTMLImageElement) =>
  unless(img, (el) => el.getBoundingClientRect().top < window.innerHeight, (el) => {
    el.loading = "lazy";
    return el;
  });

document.querySelectorAll("img").forEach(maybeLazyLoad);
```

### **Skip** overlay backdrop on mobile

@keywords: overlay, backdrop, mobile, responsive, design system, performance

Skip rendering the backdrop overlay on mobile where it causes scroll issues.
Perfect for responsive overlay components that behave differently on mobile.

```typescript
const overlayConfig = (config: OverlayConfig) =>
  unless(config, () => window.innerWidth >= 768, (c) => ({
    ...c,
    hasBackdrop: false,
    fullScreen: true,
  }));

// Desktop: keeps backdrop, normal overlay
// Mobile: no backdrop, full screen sheet
```

### **Show** tooltip unless touch device

@keywords: tooltip, touch, device, hover, mobile, design system, a11y

Disable hover tooltips on touch devices where they cause UX issues.
Perfect for design systems supporting both desktop and mobile.

```typescript
const maybeTooltip = (content: string) =>
  unless(content, () => "ontouchstart" in window, (text) => ({
    tooltip: text,
    showOnHover: true,
  }));

maybeTooltip("Click to edit"); // Desktop: { tooltip: "Click to edit", showOnHover: true }
// Touch device: "Click to edit" (no tooltip wrapper)
```
