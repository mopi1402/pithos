import { Nullable } from "../types/common";
import {
  DragCallbacks,
  DragOptions,
  GestureType,
  DragEvent,
} from "../types/gestures/drag";

interface EventMap {
  start: string;
  move: string;
  end: string;
  cancel?: string;
}

export class DragDetector {
  private callbacks: Nullable<DragCallbacks>;
  private options: Nullable<Required<DragOptions>>;
  private readonly eventMap: EventMap;
  private readonly eventDataCache: {
    screenX: number;
    screenY: number;
    id?: number;
  } = {
    screenX: 0,
    screenY: 0,
    id: undefined,
  };
  private isDragging = false;
  private lastX = 0;
  private lastY = 0;
  private activeId: Nullable<number> = null;
  private activeElement: Nullable<HTMLElement> = null;
  private readonly attachedElements = new WeakMap<HTMLElement, boolean>();

  private rafId: Nullable<number> = null;
  private pendingMoveEvent: Nullable<Event> = null;

  private static readonly eventMapCache = new Map<GestureType, EventMap>();

  constructor(callbacks: DragCallbacks, options: DragOptions = {}) {
    this.callbacks = callbacks;
    this.options = {
      threshold: 2,
      axis: "both",
      gestureType: "mouse",
      preventDefaultOnStart: true,
      ...options,
    };

    this.eventMap = this.getEventMap(this.options.gestureType);

    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.processMoveEvent = this.processMoveEvent.bind(this);
  }

  private getEventMap(type: GestureType): EventMap {
    const cached = DragDetector.eventMapCache.get(type);
    if (cached) {
      return cached;
    }

    const maps: Record<GestureType, EventMap> = {
      pointer: {
        start: "pointerdown",
        move: "pointermove",
        end: "pointerup",
        cancel: "pointercancel",
      },
      mouse: {
        start: "mousedown",
        move: "mousemove",
        end: "mouseup",
      },
      touch: {
        start: "touchstart",
        move: "touchmove",
        end: "touchend",
        cancel: "touchcancel",
      },
    };

    const map = maps[type];
    DragDetector.eventMapCache.set(type, map);
    return map;
  }

  private extractEventData(event: Event): boolean {
    if (event instanceof PointerEvent || event instanceof MouseEvent) {
      this.eventDataCache.screenX = event.screenX;
      this.eventDataCache.screenY = event.screenY;
      this.eventDataCache.id =
        event instanceof PointerEvent ? event.pointerId : 0;
      return true;
    }

    if (event instanceof TouchEvent) {
      const touch = event.touches[0] ?? event.changedTouches[0];
      if (!touch) return false;

      this.eventDataCache.screenX = touch.screenX;
      this.eventDataCache.screenY = touch.screenY;
      this.eventDataCache.id = touch.identifier;
      return true;
    }

    return false;
  }

  private isActiveEvent(event: Event): boolean {
    if (!this.extractEventData(event)) return false;

    const id = this.eventDataCache.id;
    return id === undefined || id === this.activeId;
  }

  public attachTo(element: HTMLElement): void {
    if (this.attachedElements.has(element)) return;

    this.attachedElements.set(element, true);

    const passive = !this.options?.preventDefaultOnStart;

    element.addEventListener(this.eventMap.start, this.handleStart, {
      passive,
      capture: false,
    });

    if (this.options?.gestureType !== "mouse") {
      element.style.touchAction = "none";
    }
  }

  public detach(element: HTMLElement): void {
    if (!this.attachedElements.has(element)) return;

    element.removeEventListener(this.eventMap.start, this.handleStart);
    this.attachedElements.delete(element);

    if (this.options?.gestureType !== "mouse") {
      element.style.touchAction = "";
    }
  }

  private handleStart(event: Event): void {
    if (this.isDragging) return;

    if (!this.extractEventData(event)) return;

    if (
      this.options?.preventDefaultOnStart &&
      (this.options.gestureType === "touch" ||
        this.options.gestureType === "pointer")
    ) {
      event.preventDefault();
    }

    this.isDragging = true;
    this.lastX = this.eventDataCache.screenX;
    this.lastY = this.eventDataCache.screenY;
    this.activeId = this.eventDataCache.id ?? null;

    if (event instanceof PointerEvent) {
      this.activeElement = event.target as HTMLElement;
      this.activeElement.setPointerCapture(event.pointerId);
    }

    this.callbacks?.onDragStart?.(event as DragEvent);

    const moveOptions =
      this.options?.gestureType === "touch"
        ? { passive: false, capture: false }
        : { passive: true, capture: false };

    document.addEventListener(this.eventMap.move, this.handleMove, moveOptions);
    document.addEventListener(this.eventMap.end, this.handleEnd, {
      passive: true,
    });

    if (this.eventMap.cancel) {
      document.addEventListener(this.eventMap.cancel, this.handleEnd, {
        passive: true,
      });
    }
  }

  private handleMove(event: Event): void {
    if (!this.isActiveEvent(event)) return;

    this.pendingMoveEvent = event;

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        if (this.pendingMoveEvent) {
          this.processMoveEvent(this.pendingMoveEvent);
        }
        this.rafId = null;
        this.pendingMoveEvent = null;
      });
    }
  }

  private processMoveEvent(event: Event): void {
    if (!this.extractEventData(event)) return;

    if (event instanceof TouchEvent) {
      event.preventDefault();
    }

    const currentX = this.eventDataCache.screenX;
    const currentY = this.eventDataCache.screenY;
    const threshold = this.options?.threshold ?? 2;
    const axis = this.options?.axis ?? "both";

    if (axis === "x" || axis === "both") {
      const diffX = currentX - this.lastX;
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          this.callbacks?.onDragRight?.(diffX);
        } else {
          this.callbacks?.onDragLeft?.(Math.abs(diffX));
        }
        this.lastX = currentX;
      }
    }

    if (axis === "y" || axis === "both") {
      const diffY = currentY - this.lastY;
      if (Math.abs(diffY) > threshold) {
        if (diffY > 0) {
          this.callbacks?.onDragDown?.(diffY);
        } else {
          this.callbacks?.onDragUp?.(Math.abs(diffY));
        }
        this.lastY = currentY;
      }
    }
  }

  private handleEnd(event: Event): void {
    if (!this.isActiveEvent(event)) return;

    if (event instanceof PointerEvent && this.activeElement) {
      if (this.activeElement.hasPointerCapture?.(event.pointerId)) {
        try {
          this.activeElement.releasePointerCapture(event.pointerId);
        } catch {}
      }
    }

    this.cleanup();
    this.callbacks?.onDragEnd?.(event as DragEvent);
  }

  private cleanup(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingMoveEvent = null;

    document.removeEventListener(this.eventMap.move, this.handleMove);
    document.removeEventListener(this.eventMap.end, this.handleEnd);

    if (this.eventMap.cancel) {
      document.removeEventListener(this.eventMap.cancel, this.handleEnd);
    }

    this.isDragging = false;
    this.activeId = null;
    this.activeElement = null;
  }

  public destroy(): void {
    this.cleanup();

    this.callbacks = null;
    this.options = null;
    this.activeElement = null;

    if (DragDetector.eventMapCache.size > 10) {
      DragDetector.eventMapCache.clear();
    }
  }
}
