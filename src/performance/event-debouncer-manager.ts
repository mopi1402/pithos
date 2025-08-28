import { Debouncer } from "./debouncer";

export interface EventConfig {
  element: EventTarget;
  event: string;
  preventTimeout?: boolean;
}

export class EventDebouncerManager {
  private readonly debouncer: Debouncer;
  private listeners: Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
  }> = [];

  constructor(callback: () => void, delay: number = 3000) {
    this.debouncer = new Debouncer(delay, callback);
  }

  addTriggerEvent(element: EventTarget, event: string): void {
    this.addEvent({ element, event, preventTimeout: false });
  }

  addPreventEvent(element: EventTarget, event: string): void {
    this.addEvent({ element, event, preventTimeout: true });
  }

  addEvent(config: EventConfig): void {
    const handler = () => {
      if (!config.preventTimeout) {
        this.debouncer.trigger();
      }
    };

    config.element.addEventListener(config.event, handler);
    this.listeners.push({
      element: config.element,
      event: config.event,
      handler,
    });
  }

  trigger(): void {
    this.debouncer.trigger();
  }

  destroy(): void {
    this.debouncer.destroy();

    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    this.listeners = [];
  }
}
