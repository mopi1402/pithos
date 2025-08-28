import { distance, isPinchGesture } from "./touch-utils";

export class TouchGestureHandler {
  private element: HTMLElement;
  private initialDistance = 0;
  private centerX = 0;
  private centerY = 0;
  private isPinching = false;
  private isZoomAllowed = false;
  private onPinchChange?: (
    scale: number,
    centerX: number,
    centerY: number
  ) => void;
  private onPinchStart?: VoidFunction;
  private onPinchEnd?: VoidFunction;
  private shouldAllowZoom?: (source: "pinch", target?: EventTarget) => boolean;

  constructor(
    element: HTMLElement = document.body,
    callbacks?: {
      onPinchChange?: (scale: number, centerX: number, centerY: number) => void;
      onPinchStart?: VoidFunction;
      shouldAllowZoom?: (source: "pinch", target?: EventTarget) => boolean;
    }
  ) {
    this.element = element;
    this.onPinchChange = callbacks?.onPinchChange;
    this.onPinchStart = callbacks?.onPinchStart;
    this.shouldAllowZoom = callbacks?.shouldAllowZoom;

    this.element.addEventListener("touchstart", this.handleTouchStart, {
      passive: false,
    });
    this.element.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
    this.element.addEventListener("touchend", this.handleTouchEnd, {
      passive: false,
    });
  }

  private handleTouchStart = (e: TouchEvent): void => {
    if (isPinchGesture(e.touches)) {
      if (this.shouldAllowZoom) {
        this.isZoomAllowed = this.shouldAllowZoom(
          "pinch",
          e.target || undefined
        );
        if (!this.isZoomAllowed) {
          return;
        }
      } else {
        this.isZoomAllowed = true;
      }

      this.isPinching = true;
      this.initialDistance = distance(e.touches[0], e.touches[1]);

      this.centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      this.centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      this.onPinchStart?.();
    }
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (isPinchGesture(e.touches) && this.isPinching && this.isZoomAllowed) {
      e.preventDefault();

      const currentDistance = distance(e.touches[0], e.touches[1]);
      const scaleChange = currentDistance / this.initialDistance;

      this.onPinchChange?.(scaleChange, this.centerX, this.centerY);
    }
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    if (!isPinchGesture(e.touches) && this.isPinching) {
      this.isPinching = false;
      this.isZoomAllowed = false;
      this.onPinchEnd?.();
    }
  };

  public destroy(): void {
    this.element.removeEventListener("touchstart", this.handleTouchStart);
    this.element.removeEventListener("touchmove", this.handleTouchMove);
    this.element.removeEventListener("touchend", this.handleTouchEnd);
  }
}
