import { FrameScheduler } from "../timing/frame-scheduler";
import { AnimationOptions } from "../types/animations/animation-options";
import { AnimationState } from "../types/animations/animation-state";
import { Optional } from "../types/common";
import { linear } from "./ease-functions";

/**
 * Controller for managing smooth animations of pure numerical values using requestAnimationFrame.
 *
 * The AnimationController provides a high-level API for creating smooth, performant animations
 * of numerical values for business logic, calculations, and non-DOM operations. It uses the
 * FrameScheduler internally to optimize performance and ensure smooth frame-based animations.
 *
 * Use this controller for animating values that drive business logic, calculations, or non-visual
 * operations.
 *
 * ⚠️ **Performance Note**: For DOM animations, CSS transitions/animations are more performant.
 *
 * @see {@link ../dom/css/animation-utils} For CSS animations and transitions using the browser's native CSS engine
 *
 * @example
 * ```typescript
 * const controller = new AnimationController();
 *
 * // Animate a progress value for business logic
 * await controller.animate(0, 100, {
 *   duration: 1000,
 *   easing: easeOutBounce,
 *   onUpdate: (value) => {
 *     // Update business logic, not DOM
 *     updateProgressCalculation(value);
 *     updateAnalytics(value);
 *   },
 *   onComplete: () => console.log('Calculation complete!')
 * });
 *
 * // Check if animation is running
 * if (controller.isAnimating()) {
 *   console.log('Value animation in progress...');
 * }
 * ```
 */
export class AnimationController {
  /** Internal frame scheduler for managing animation frames */
  private readonly frameScheduler = new FrameScheduler();

  /** Current active animation state, if any */
  private currentAnimation?: AnimationState;

  /**
   * Animates a numerical value from start to target over a specified duration.
   *
   * This method creates a smooth animation of pure numerical values using requestAnimationFrame.
   * Perfect for animating business logic values, calculation parameters, or any non-DOM
   * numerical progression. The animation can be customized with easing functions, duration,
   * and various callbacks.
   *
   * @param startValue - The initial numerical value to animate from
   * @param targetValue - The final numerical value to animate to
   * @param options - Animation configuration options
   * @returns Promise that resolves when the animation completes
   *
   * @example
   * ```typescript
   * // Animate a calculation parameter
   * await controller.animate(0, 1, {
   *   duration: 500,
   *   easing: easeInOut,
   *   onUpdate: (value) => {
   *     // Update calculation, not DOM
   *     const result = complexCalculation(value);
   *     updateBusinessMetrics(result);
   *   }
   * });
   *
   * // Animate a game parameter
   * await controller.animate(0, 360, {
   *   duration: 1000,
   *   onUpdate: (value) => {
   *     // Update game logic
   *     rotateGameObject(value);
   *     updatePhysics(value);
   *   }
   * });
   * ```
   */
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

  /**
   * Completes the current animation and calls appropriate callbacks.
   *
   * This private method handles the finalization of animations, ensuring
   * the final value is set and completion callbacks are triggered.
   *
   * @param targetValue - The final value to set
   * @param options - Animation options containing callbacks
   * @param resolve - Promise resolve function
   *
   * @internal
   */
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

  /**
   * Cancels the currently running animation.
   *
   * Stops the animation immediately and calls the onCancel callback if provided.
   * The animation state is reset and the frame scheduler is stopped.
   *
   * @example
   * ```typescript
   * // Start an animation of a business value
   * const animation = controller.animate(0, 100, { duration: 2000 });
   *
   * // Cancel it after 500ms if needed
   * setTimeout(() => {
   *   controller.cancel();
   * }, 500);
   * ```
   */
  public cancel(): void {
    this.frameScheduler.stop();

    if (this.currentAnimation) {
      this.currentAnimation.isActive = false;
      this.currentAnimation = undefined;
    }
  }

  /**
   * Checks if an animation is currently running.
   *
   * @returns True if an animation is active, false otherwise
   *
   * @example
   * ```typescript
   * if (controller.isAnimating()) {
   *   console.log('Value animation in progress...');
   *   // Wait for completion
   *   await new Promise(resolve => setTimeout(resolve, 100));
   * }
   * ```
   */
  public isAnimating(): boolean {
    return this.currentAnimation?.isActive ?? false;
  }

  /**
   * Gets the current value of the running animation.
   *
   * Returns the current interpolated value during animation, or undefined
   * if no animation is running.
   *
   * @returns Current animation value or undefined if no animation is active
   *
   * @example
   * ```typescript
   * // Get current animation progress for business logic
   * const currentValue = controller.getCurrentValue();
   * if (currentValue !== undefined) {
   *   console.log(`Calculation progress: ${currentValue}%`);
   *   updateBusinessProgress(currentValue);
   * }
   * ```
   */
  public getCurrentValue(): Optional<number> {
    return this.currentAnimation?.currentValue;
  }

  /**
   * Sets the target frames per second for the animation.
   *
   * Controls the frame rate of animations. Lower values reduce CPU usage
   * but may result in less smooth animations. Higher values provide
   * smoother animations but use more CPU.
   *
   * @param fps - Target frames per second (default: 60)
   *
   * @example
   * ```typescript
   * // Set to 30fps for lower CPU usage in background calculations
   * controller.setTargetFPS(30);
   *
   * // Set to 120fps for ultra-smooth real-time calculations
   * controller.setTargetFPS(120);
   * ```
   */
  public setTargetFPS(fps: number): void {
    this.frameScheduler.setTargetFPS(fps);
  }

  /**
   * Gets the current target frames per second setting.
   *
   * @returns Current target FPS setting
   *
   * @example
   * ```typescript
   * const currentFPS = controller.getTargetFPS();
   * console.log(`Value animation running at ${currentFPS}fps`);
   * ```
   */
  public getTargetFPS(): number {
    return this.frameScheduler.getTargetFPS();
  }

  /**
   * Destroys the animation controller and cleans up resources.
   *
   * Cancels any running animation and stops the frame scheduler.
   * This method should be called when the controller is no longer needed
   * to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // Clean up when business logic is no longer needed
   * useEffect(() => {
   *   const controller = new AnimationController();
   *
   *   return () => {
   *     controller.destroy();
   *   };
   * }, []);
   * ```
   */
  public destroy(): void {
    this.cancel();
  }
}
