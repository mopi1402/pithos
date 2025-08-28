// -- 2020+ -----------------------------------------------------------------------------

export function hasWebCodecs(): boolean {
  return "VideoEncoder" in window && "VideoDecoder" in window;
}

export function hasWebGPU(): boolean {
  return "gpu" in navigator;
}

export function hasWebTransport(): boolean {
  return "WebTransport" in window;
}

export function hasWebStreams(): boolean {
  return "ReadableStream" in window && "WritableStream" in window;
}

export function hasWebLocks(): boolean {
  return "locks" in navigator;
}

// --- Style deploying ------------------------------------------------------------------

export function hasViewTransitions(): boolean {
  return "startViewTransition" in document;
}

export function hasPopoverAPI(): boolean {
  return HTMLElement.prototype.hasOwnProperty("popover");
}

export function hasFileSystemAccess(): boolean {
  return "showOpenFilePicker" in window;
}

export function hasWebAuthn(): boolean {
  return "credentials" in navigator && "create" in navigator.credentials;
}

export function hasSharedArrayBuffer(): boolean {
  return typeof SharedArrayBuffer !== "undefined";
}

// -- CSS -------------------------------------------------------------------------------

export function hasBackdropFilter(): boolean {
  return CSS.supports("backdrop-filter", "blur(10px)");
}

export function hasScrollSnapType(): boolean {
  return CSS.supports("scroll-snap-type", "x mandatory");
}

export function hasOverscrollBehavior(): boolean {
  return CSS.supports("overscroll-behavior", "contain");
}

export function hasContainerQueries(): boolean {
  return CSS.supports("container-type", "inline-size");
}

export function hasCSSNesting(): boolean {
  return CSS.supports("selector(&)", "& .test");
}

export function hasViewportUnits(): boolean {
  return CSS.supports("height", "100dvh");
}

export function hasCSSZoom(): boolean {
  return typeof CSS !== "undefined" && CSS.supports("zoom", "1");
}

// -- Javascript common failures API  ---------------------------------------------------

export function hasClipboardAPI(): boolean {
  return "clipboard" in navigator && "writeText" in navigator.clipboard;
}

export function hasNotifications(): boolean {
  return "Notification" in window && Notification.permission !== "denied";
}

export function hasScreenWakeLock(): boolean {
  return "wakeLock" in navigator;
}

export function hasWebShare(): boolean {
  return "share" in navigator;
}

// -- Permission / Security -------------------------------------------------------------

export function canUseLocalFonts(): boolean {
  return "queryLocalFonts" in window;
}

export function hasWebUSB(): boolean {
  return "usb" in navigator;
}
