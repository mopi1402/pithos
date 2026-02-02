/**
 * Represents the type of gesture input device.
 * @since 1.0.0
 */
export type GestureType = "pointer" | "mouse" | "touch";

/**
 * Union type for all drag-related events.
 * @since 1.0.0
 */
export type DragEvent = PointerEvent | MouseEvent | TouchEvent;
