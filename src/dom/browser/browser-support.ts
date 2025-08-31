// -- 2020+ -----------------------------------------------------------------------------

/**
 * Checks if the browser supports Web Codecs API for video encoding/decoding.
 *
 * Web Codecs provides low-level access to video and audio codecs,
 * enabling custom video processing and streaming applications.
 *
 * @returns True if Web Codecs API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasWebCodecs()) {
 *   // Use VideoEncoder/VideoDecoder for custom video processing
 *   const encoder = new VideoEncoder({...});
 * } else {
 *   // Fallback to traditional video methods
 *   console.log('Web Codecs not supported');
 * }
 * ```
 */
export function hasWebCodecs(): boolean {
  return "VideoEncoder" in window && "VideoDecoder" in window;
}

/**
 * Checks if the browser supports WebGPU API for GPU-accelerated computing.
 *
 * WebGPU provides low-level access to GPU capabilities for compute shaders,
 * graphics rendering, and machine learning applications.
 *
 * @returns True if WebGPU API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasWebGPU()) {
 *   // Use GPU for compute-intensive tasks
 *   const adapter = await navigator.gpu.requestAdapter();
 * } else {
 *   // Fallback to CPU-based computation
 *   console.log('WebGPU not supported');
 * }
 * ```
 */
export function hasWebGPU(): boolean {
  return "gpu" in navigator;
}

/**
 * Checks if the browser supports WebTransport API for bidirectional communication.
 *
 * WebTransport provides low-latency, bidirectional, client-server messaging
 * with support for multiple streams and reliable/unreliable delivery.
 *
 * @returns True if WebTransport API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasWebTransport()) {
 *   // Use WebTransport for real-time communication
 *   const transport = new WebTransport('https://example.com');
 * } else {
 *   // Fallback to WebSockets
 *   const socket = new WebSocket('wss://example.com');
 * }
 * ```
 */
export function hasWebTransport(): boolean {
  return "WebTransport" in window;
}

/**
 * Checks if the browser supports Web Streams API for data streaming.
 *
 * Web Streams provide a standard way to represent, read, and write
 * streams of data with backpressure support.
 *
 * @returns True if Web Streams API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasWebStreams()) {
 *   // Use streams for efficient data processing
 *   const stream = new ReadableStream({...});
 * } else {
 *   // Fallback to traditional data handling
 *   console.log('Web Streams not supported');
 * }
 * ```
 */
export function hasWebStreams(): boolean {
  return "ReadableStream" in window && "WritableStream" in window;
}

/**
 * Checks if the browser supports Web Locks API for resource coordination.
 *
 * Web Locks allow coordination of access to shared resources across
 * multiple tabs, workers, or other agents.
 *
 * @returns True if Web Locks API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasWebLocks()) {
 *   // Coordinate access to shared resources
 *   await navigator.locks.request('shared-resource', async (lock) => {
 *     // Exclusive access to resource
 *   });
 * } else {
 *   // Fallback to localStorage-based coordination
 *   console.log('Web Locks not supported');
 * }
 * ```
 */
export function hasWebLocks(): boolean {
  return "locks" in navigator;
}

// --- Style deploying ------------------------------------------------------------------

/**
 * Checks if the browser supports View Transitions API for smooth page transitions.
 *
 * View Transitions provide a way to create smooth transitions between
 * different states of a page or between different pages.
 *
 * @returns True if View Transitions API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasViewTransitions()) {
 *   // Use smooth view transitions
 *   document.startViewTransition(() => {
 *     // Update DOM state
 *   });
 * } else {
 *   // Fallback to CSS transitions
 *   console.log('View Transitions not supported');
 * }
 * ```
 */
export function hasViewTransitions(): boolean {
  return "startViewTransition" in document;
}

/**
 * Checks if the browser supports Popover API for popover elements.
 *
 * Popover API provides a standardized way to create popover elements
 * that can be positioned relative to other elements.
 *
 * @returns True if Popover API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasPopoverAPI()) {
 *   // Use native popover elements
 *   element.popover = 'auto';
 *   element.showPopover();
 * } else {
 *   // Fallback to custom popover implementation
 *   console.log('Popover API not supported');
 * }
 * ```
 */
export function hasPopoverAPI(): boolean {
  return Object.prototype.hasOwnProperty.call(HTMLElement.prototype, "popover");
}

/**
 * Checks if the browser supports File System Access API for file operations.
 *
 * File System Access API provides secure access to files and directories
 * on the user's device.
 *
 * @returns True if File System Access API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasFileSystemAccess()) {
 *   // Use modern file picker
 *   const files = await window.showOpenFilePicker();
 * } else {
 *   // Fallback to traditional file input
 *   console.log('File System Access not supported');
 * }
 * ```
 */
export function hasFileSystemAccess(): boolean {
  return "showOpenFilePicker" in window;
}

/**
 * Checks if the browser supports Web Authentication API for strong authentication.
 *
 * WebAuthn enables strong authentication using public-key cryptography,
 * supporting biometrics, security keys, and other authenticators.
 *
 * @returns True if Web Authentication API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasWebAuthn()) {
 *   // Use biometric or security key authentication
 *   const credential = await navigator.credentials.create({
 *     publicKey: {...}
 *   });
 * } else {
 *   // Fallback to password-based authentication
 *   console.log('WebAuthn not supported');
 * }
 * ```
 */
export function hasWebAuthn(): boolean {
  return "credentials" in navigator && "create" in navigator.credentials;
}

/**
 * Checks if the browser supports SharedArrayBuffer for shared memory.
 *
 * SharedArrayBuffer allows sharing memory between the main thread and
 * web workers, enabling high-performance concurrent applications.
 *
 * @returns True if SharedArrayBuffer is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasSharedArrayBuffer()) {
 *   // Use shared memory for worker communication
 *   const sharedBuffer = new SharedArrayBuffer(1024);
 * } else {
 *   // Fallback to postMessage for worker communication
 *   console.log('SharedArrayBuffer not supported');
 * }
 * ```
 */
export function hasSharedArrayBuffer(): boolean {
  return typeof SharedArrayBuffer !== "undefined";
}

// -- CSS -------------------------------------------------------------------------------

/**
 * Checks if the browser supports CSS backdrop-filter property.
 *
 * Backdrop-filter applies visual effects to the area behind an element,
 * commonly used for blur effects and visual overlays.
 *
 * @returns True if backdrop-filter is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasBackdropFilter()) {
 *   // Apply backdrop blur effects
 *   element.style.backdropFilter = 'blur(10px)';
 * } else {
 *   // Fallback to alternative styling
 *   console.log('Backdrop filter not supported');
 * }
 * ```
 */
export function hasBackdropFilter(): boolean {
  return CSS.supports("backdrop-filter", "blur(10px)");
}

/**
 * Checks if the browser supports CSS scroll-snap-type property.
 *
 * Scroll-snap provides controlled scrolling behavior, snapping to
 * specific positions when scrolling ends.
 *
 * @returns True if scroll-snap-type is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasScrollSnapType()) {
 *   // Enable scroll snapping
 *   element.style.scrollSnapType = 'x mandatory';
 * } else {
 *   // Fallback to JavaScript-based scrolling
 *   console.log('Scroll snap not supported');
 * }
 * ```
 */
export function hasScrollSnapType(): boolean {
  return CSS.supports("scroll-snap-type", "x mandatory");
}

/**
 * Checks if the browser supports CSS overscroll-behavior property.
 *
 * Overscroll-behavior controls what happens when scrolling reaches
 * the boundary of a scrolling area.
 *
 * @returns True if overscroll-behavior is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasOverscrollBehavior()) {
 *   // Prevent scroll chaining
 *   element.style.overscrollBehavior = 'contain';
 * } else {
 *   // Fallback to JavaScript-based scroll handling
 *   console.log('Overscroll behavior not supported');
 * }
 * ```
 */
export function hasOverscrollBehavior(): boolean {
  return CSS.supports("overscroll-behavior", "contain");
}

/**
 * Checks if the browser supports CSS Container Queries.
 *
 * Container Queries allow styling elements based on the size of their
 * container rather than the viewport size.
 *
 * @returns True if Container Queries are supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasContainerQueries()) {
 *   // Use container queries for responsive design
 *   element.style.containerType = 'inline-size';
 * } else {
 *   // Fallback to media queries
 *   console.log('Container queries not supported');
 * }
 * ```
 */
export function hasContainerQueries(): boolean {
  return CSS.supports("container-type", "inline-size");
}

/**
 * Checks if the browser supports CSS Nesting.
 *
 * CSS Nesting allows nesting selectors within other selectors,
 * providing more intuitive and maintainable CSS.
 *
 * @returns True if CSS Nesting is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasCSSNesting()) {
 *   // Use nested CSS selectors
 *   const style = document.createElement('style');
 *   style.textContent = '.parent { & .child { color: red; } }';
 * } else {
 *   // Fallback to flat CSS selectors
 *   console.log('CSS nesting not supported');
 * }
 * ```
 */
export function hasCSSNesting(): boolean {
  return CSS.supports("selector(&)", "& .test");
}

/**
 * Checks if the browser supports modern viewport units (dvh, lvh, svh).
 *
 * Dynamic viewport units provide more accurate sizing that accounts
 * for dynamic UI elements like address bars and toolbars.
 *
 * @returns True if modern viewport units are supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasViewportUnits()) {
 *   // Use dynamic viewport units
 *   element.style.height = '100dvh';
 * } else {
 *   // Fallback to traditional viewport units
 *   element.style.height = '100vh';
 * }
 * ```
 */
export function hasViewportUnits(): boolean {
  return CSS.supports("height", "100dvh");
}

/**
 * Checks if the browser supports CSS zoom property.
 *
 * CSS zoom allows scaling elements and their contents,
 * though it's not a standard CSS property.
 *
 * @returns True if CSS zoom is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasCSSZoom()) {
 *   // Use CSS zoom for scaling
 *   element.style.zoom = '1.5';
 * } else {
 *   // Fallback to transform scale
 *   element.style.transform = 'scale(1.5)';
 * }
 * ```
 */
export function hasCSSZoom(): boolean {
  return typeof CSS !== "undefined" && CSS.supports("zoom", "1");
}

// -- Javascript common failures API  ---------------------------------------------------

/**
 * Checks if the browser supports Clipboard API for programmatic clipboard access.
 *
 * Clipboard API provides secure access to read from and write to
 * the system clipboard.
 *
 * @returns True if Clipboard API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasClipboardAPI()) {
 *   // Copy text to clipboard
 *   await navigator.clipboard.writeText('Hello World');
 * } else {
 *   // Fallback to document.execCommand
 *   console.log('Clipboard API not supported');
 * }
 * ```
 */
export function hasClipboardAPI(): boolean {
  return "clipboard" in navigator && "writeText" in navigator.clipboard;
}

/**
 * Checks if the browser supports Notifications API for system notifications.
 *
 * Notifications API allows web applications to send notifications
 * to the user's system.
 *
 * @returns True if Notifications API is supported and not denied, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasNotifications()) {
 *   // Request permission and show notification
 *   const permission = await Notification.requestPermission();
 *   if (permission === 'granted') {
 *     new Notification('Hello!');
 *   }
 * } else {
 *   // Fallback to alternative notification methods
 *   console.log('Notifications not supported');
 * }
 * ```
 */
export function hasNotifications(): boolean {
  return "Notification" in window && Notification.permission !== "denied";
}

/**
 * Checks if the browser supports Screen Wake Lock API for preventing sleep.
 *
 * Screen Wake Lock API allows applications to prevent the screen from
 * turning off, useful for media players and presentations.
 *
 * @returns True if Screen Wake Lock API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasScreenWakeLock()) {
 *   // Prevent screen from sleeping
 *   const wakeLock = await navigator.wakeLock.request('screen');
 * } else {
 *   // Fallback to user activity monitoring
 *   console.log('Screen wake lock not supported');
 * }
 * ```
 */
export function hasScreenWakeLock(): boolean {
  return "wakeLock" in navigator;
}

/**
 * Checks if the browser supports Web Share API for native sharing.
 *
 * Web Share API allows web applications to invoke the native sharing
 * mechanism of the device.
 *
 * @returns True if Web Share API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasWebShare()) {
 *   // Use native sharing
 *   await navigator.share({
 *     title: 'Check this out!',
 *     url: 'https://example.com'
 *   });
 * } else {
 *   // Fallback to custom share UI
 *   console.log('Web Share not supported');
 * }
 * ```
 */
export function hasWebShare(): boolean {
  return "share" in navigator;
}

// -- Permission / Security -------------------------------------------------------------

/**
 * Checks if the browser supports querying local fonts.
 *
 * Local Fonts API allows applications to enumerate and access
 * fonts installed on the user's system.
 *
 * @returns True if Local Fonts API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (canUseLocalFonts()) {
 *   // Query available local fonts
 *   const fonts = await window.queryLocalFonts();
 * } else {
 *   // Fallback to web fonts only
 *   console.log('Local fonts query not supported');
 * }
 * ```
 */
export function canUseLocalFonts(): boolean {
  return "queryLocalFonts" in window;
}

/**
 * Checks if the browser supports WebUSB API for USB device communication.
 *
 * WebUSB API provides access to USB devices, enabling communication
 * with hardware peripherals.
 *
 * @returns True if WebUSB API is supported, false otherwise
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * if (hasWebUSB()) {
 *   // Request USB device access
 *   const device = await navigator.usb.requestDevice({
 *     filters: [{ vendorId: 0x1234 }]
 *   });
 * } else {
 *   // Fallback to alternative communication methods
 *   console.log('WebUSB not supported');
 * }
 * ```
 */
export function hasWebUSB(): boolean {
  return "usb" in navigator;
}
