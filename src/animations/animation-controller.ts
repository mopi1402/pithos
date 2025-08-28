import { FrameScheduler } from "../performance/frame-scheduler";
import { AnimationOptions } from "../types/animations/animation-options";
import { AnimationState } from "../types/animations/animation-state";
import { Optional } from "../types/common";
import { linear } from "./ease-functions";

/**
 * Controller for managing smooth animations using requestAnimationFrame
 */
export class AnimationController {
  private frameScheduler = new FrameScheduler();
  private currentAnimation?: AnimationState;

  public animate(
    startValue: number,
    targetValue: number,
    options: AnimationOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cancel();

      const duration = options.duration ?? 300;
      const easingFunction = options.easing ?? linear;
      const valueDelta = targetValue - startValue;

      if (Math.abs(valueDelta) < 0.001) {
        options.onComplete?.();
        resolve();
        return;
      }

      const startTime = performance.now();

      this.currentAnimation = {
        isActive: true,
        startValue,
        targetValue,
        currentValue: startValue,
        duration,
      };

      const animate = (currentTime: number): void => {
        if (!this.currentAnimation?.isActive) {
          options.onCancel?.();
          reject(new Error("Animation cancelled"));
          return;
        }

        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = easingFunction(progress);
        const currentValue = startValue + valueDelta * easedProgress;

        this.currentAnimation.currentValue = currentValue;
        options.onUpdate?.(currentValue);

        if (progress >= 1) {
          this.frameScheduler.stop();
          this.completeAnimation(targetValue, options, resolve);
        }
      };

      this.frameScheduler.start(animate);
    });
  }

  private completeAnimation(
    targetValue: number,
    options: AnimationOptions,
    resolve: VoidFunction
  ): void {
    this.currentAnimation = undefined;

    options.onUpdate?.(targetValue);
    options.onComplete?.();
    resolve();
  }

  public cancel(): void {
    this.frameScheduler.stop();

    if (this.currentAnimation) {
      this.currentAnimation.isActive = false;
      this.currentAnimation = undefined;
    }
  }

  public isAnimating(): boolean {
    return this.currentAnimation?.isActive ?? false;
  }

  public getCurrentValue(): Optional<number> {
    return this.currentAnimation?.currentValue;
  }

  public setTargetFPS(fps: number): void {
    this.frameScheduler.setTargetFPS(fps);
  }

  public getTargetFPS(): number {
    return this.frameScheduler.getTargetFPS();
  }

  public destroy(): void {
    this.cancel();
  }
}
