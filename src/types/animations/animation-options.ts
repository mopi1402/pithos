import { EasingFunction } from "./easing";

export interface AnimationOptions {
  duration?: number;
  easing?: EasingFunction;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}
