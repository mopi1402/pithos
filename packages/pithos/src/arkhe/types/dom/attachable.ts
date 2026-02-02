/**
 * Interface for objects that can be attached to and detached from DOM elements.
 * @since 1.0.0
 */
export interface Attachable {
  /** Whether the object is currently attached to an element. */
  readonly isAttached: boolean;
  /** Attaches the object to the specified element. */
  attachTo(element: EventTarget): void;
  /** Detaches the object from its current element. */
  detach(): void;
  /** Destroys the object and releases all resources. */
  destroy(): void;
}
