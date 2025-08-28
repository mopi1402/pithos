import { Axis } from "./axis";

export type GestureType = "pointer" | "mouse" | "touch";

export type DragEvent = PointerEvent | MouseEvent | TouchEvent;

export interface DragCallbacks {
  onDragLeft?: (distance: number) => void;
  onDragRight?: (distance: number) => void;
  onDragUp?: (distance: number) => void;
  onDragDown?: (distance: number) => void;
  onDragStart?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
}

export interface DragOptions {
  threshold?: number;
  axis?: Axis;
  gestureType?: GestureType;
  preventDefaultOnStart?: boolean;
}
