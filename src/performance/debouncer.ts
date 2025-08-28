import { Nullable } from "../types";

export class Debouncer {
  private timeout: Nullable<number> = null;

  constructor(private delay: number, private callback: () => void) {}

  private schedule(): void {
    this.cancel();
    this.timeout = window.setTimeout(() => {
      this.callback();
      this.timeout = null;
    }, this.delay);
  }

  public trigger(): void {
    this.schedule();
  }

  private cancel(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  public destroy(): void {
    this.cancel();
  }
}
