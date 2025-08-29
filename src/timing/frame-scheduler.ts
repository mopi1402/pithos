/**
 * Manages frame scheduling with configurable FPS using requestAnimationFrame
 */
export class FrameScheduler {
  private targetFPS = 60;
  private frameInterval = 1000 / 60;
  private animationFrameId?: number;
  private lastFrameTime = 0;
  private isRunning = false;

  public start(callback: (timestamp: number) => void): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastFrameTime = performance.now();

    const loop = (timestamp: number) => {
      if (!this.isRunning) return;

      const elapsed = timestamp - this.lastFrameTime;

      if (elapsed >= this.frameInterval) {
        this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
        callback(timestamp);
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public setTargetFPS(fps: number): void {
    this.targetFPS = Math.max(30, Math.min(120, fps));
    this.frameInterval = 1000 / this.targetFPS;
  }

  public getTargetFPS(): number {
    return this.targetFPS;
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public destroy(): void {
    this.stop();
  }
}
