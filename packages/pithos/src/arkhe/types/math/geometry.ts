/**
 * Represents a 2D point with x and y coordinates.
 * @since 1.0.0
 */
export interface Point {
  /** X coordinate. */
  x: number;
  /** Y coordinate. */
  y: number;
}

/**
 * Represents a 2D vector with x and y components.
 * @since 1.0.0
 */
export interface Vector {
  /** X component. */
  x: number;
  /** Y component. */
  y: number;
}

/**
 * Represents a rectangle with position and dimensions.
 * @since 1.0.0
 */
export interface Rectangle {
  /** X position of the top-left corner. */
  x: number;
  /** Y position of the top-left corner. */
  y: number;
  /** Width of the rectangle. */
  width: number;
  /** Height of the rectangle. */
  height: number;
}

/**
 * Represents a circle with center position and radius.
 * @since 1.0.0
 */
export interface Circle {
  /** X position of the center. */
  x: number;
  /** Y position of the center. */
  y: number;
  /** Radius of the circle. */
  radius: number;
}

/**
 * Represents a line segment between two points.
 * @since 1.0.0
 */
export interface Line {
  /** Starting point of the line. */
  start: Point;
  /** Ending point of the line. */
  end: Point;
}

/**
 * Represents dimensions with width and height.
 * @since 1.0.0
 */
export interface Size {
  /** Width dimension. */
  width: number;
  /** Height dimension. */
  height: number;
}

/**
 * Represents axis-aligned bounding box with min and max points.
 * @since 1.0.0
 */
export interface Bounds {
  /** Minimum corner point. */
  min: Point;
  /** Maximum corner point. */
  max: Point;
}
