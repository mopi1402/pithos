## `once` ⭐

### **Initialize resources** only once 📍

@keywords: initialize, once, singleton, setup, resources, idempotent, performance, browser permissions

Ensure initialization code runs only once to prevent duplicate setup.
Essential for resource management and preventing initialization errors.

```typescript
const initApp = once(() => {
  console.log("App initialized");
  // ... setup code
});

initApp(); // "App initialized"
initApp(); // (ignored)
```

### **Create singletons** safely

@keywords: singleton, pattern, instance, state, management, unique, PWA

Ensure singleton instances are created only once.
Essential for state management and ensuring single instance patterns.

```typescript
const getDb = once(() => new DatabaseConnection());
const db1 = getDb();
const db2 = getDb(); 

console.log(db1 === db2); // true
```

### **Lazy-initialize** an SDK or API client

@keywords: lazy, initialize, SDK, client, Stripe, Firebase, Analytics, singleton, setup, performance, payment

Initialize a third-party SDK on first use instead of at app startup.
The standard pattern for Stripe, Firebase, Analytics, or any heavy client library.

```typescript
const getStripe = once(() => {
  return loadStripe(process.env.STRIPE_PUBLIC_KEY);
});

const getAnalytics = once(() => {
  return initializeAnalytics({ trackingId: "UA-XXXXX" });
});

// Called from multiple components — SDK loads only on first call
async function handleCheckout() {
  const stripe = await getStripe();
  stripe.redirectToCheckout({ sessionId });
}
```

### **Request** browser permission only once

@keywords: permission, browser, notification, geolocation, camera, browser permissions, PWA

Ensure a permission prompt is shown only once per session.
Critical for notifications, geolocation, and camera access in PWAs.

```typescript
const requestNotificationPermission = once(async () => {
  const result = await Notification.requestPermission();
  return result === "granted";
});

// Multiple components can call this safely
async function enableNotifications() {
  const granted = await requestNotificationPermission();
  if (granted) {
    subscribeToUpdates();
  }
}
```

### **Initialize** focus trap on a dialog element

@keywords: focus, trap, dialog, modal, a11y, accessibility, design system

Set up focus trapping once when a modal opens to keep keyboard navigation inside.
Critical for accessible dialogs and overlays in design systems.

```typescript
// Use once PER dialog instance, not globally
const createFocusTrap = (dialog: HTMLElement) => {
  const init = once(() => {
    const focusableEls = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0] as HTMLElement;
    const lastEl = focusableEls[focusableEls.length - 1] as HTMLElement;

    dialog.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    });

    firstEl.focus();
    return { firstEl, lastEl };
  });

  return init;
};

// Each dialog gets its own once-guarded init
const trap = createFocusTrap(dialogElement);
trap(); // Initializes
trap(); // Ignored (already initialized)
```

### **Create** a live announcer singleton for screen readers

@keywords: live, announcer, screen reader, aria-live, a11y, accessibility, design system

Initialize an ARIA live region once for dynamic announcements.
Essential for SPAs where route changes and async updates need to be announced.

```typescript
const getLiveAnnouncer = once(() => {
  const el = document.createElement("div");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-atomic", "true");
  el.className = "sr-only";
  document.body.appendChild(el);
  return el;
});

const announce = (message: string) => {
  const announcer = getLiveAnnouncer();
  announcer.textContent = "";
  requestAnimationFrame(() => {
    announcer.textContent = message;
  });
};

// Route change
announce("Dashboard page loaded");
// Async operation
announce("3 new notifications");
```

### **Detect** platform capabilities once at startup

@keywords: platform, detect, browser, OS, capabilities, feature detection, browser permissions

Run platform detection once and cache the result for the app lifetime.
Essential for cross-browser components that adapt to the environment.

```typescript
const detectPlatform = once(() => ({
  isTouchDevice: "ontouchstart" in window || navigator.maxTouchPoints > 0,
  supportsPassive: (() => {
    let passive = false;
    try {
      const opts = Object.defineProperty({}, "passive", { get: () => (passive = true) });
      window.addEventListener("test", null as never, opts);
    } catch {}
    return passive;
  })(),
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  isHighContrast: window.matchMedia("(forced-colors: active)").matches,
}));

// Used across the entire design system
const platform = detectPlatform();
if (platform.prefersReducedMotion) {
  disableAnimations();
}
```

### **Initialize** clipboard listener once

@keywords: clipboard, copy, paste, listener, initialization, design system

Set up clipboard event handling once for a rich text editor.
Perfect for editors and code blocks with custom copy/paste behavior.

```typescript
const initClipboard = once((editor: HTMLElement) => {
  editor.addEventListener("copy", (e: ClipboardEvent) => {
    const selection = window.getSelection()?.toString() ?? "";
    e.clipboardData?.setData("text/plain", selection);
    e.clipboardData?.setData("text/html", editor.innerHTML);
    e.preventDefault();
  });

  editor.addEventListener("paste", (e: ClipboardEvent) => {
    const html = e.clipboardData?.getData("text/html");
    const text = e.clipboardData?.getData("text/plain") ?? "";
    insertContent(html ?? text);
    e.preventDefault();
  });
});

// Safe to call on every editor mount
initClipboard(editorElement);
```

### **Register** a service worker once at startup

@keywords: service worker, PWA, register, offline, cache, performance

Register the service worker only on first call, even if multiple modules trigger it.
Essential for PWA initialization without duplicate registrations.

```typescript
const registerSW = once(async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("SW registered:", registration.scope);
    return registration;
  }
  return null;
});

// Safe to call from multiple entry points
await registerSW();
```
