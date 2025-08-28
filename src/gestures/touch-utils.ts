const PINCH_TOUCH_COUNT = 2;

export function distance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getCenter(
  touch1: Touch,
  touch2: Touch
): { x: number; y: number } {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

export function isPinchGesture(touches: TouchList): boolean {
  return touches.length === PINCH_TOUCH_COUNT;
}
