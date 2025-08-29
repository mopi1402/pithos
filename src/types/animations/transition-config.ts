/**
 * Configuration options for CSS transitions.
 * Used to customize duration, easing, and target properties for smooth animations.
 */
export interface TransitionConfig {
  /**
   * Duration of the transition in milliseconds.
   * @default 300
   * @example
   * ```typescript
   * { duration: 500 } // 500ms transition
   * ```
   */
  duration?: number;

  /**
   * CSS timing function for the transition animation.
   * Can be a predefined keyword or a custom cubic-bezier function.
   * @default 'ease-in-out'
   * @example
   * ```typescript
   * { easing: 'ease-out' }
   * { easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
   * ```
   */
  easing?: string;

  /**
   * CSS property to transition. Use 'all' to transition all animatable properties.
   * For custom properties, include the full name with dashes.
   * @default 'all'
   * @example
   * ```typescript
   * { property: 'opacity' }
   * { property: 'transform' }
   * { property: '--zoom' } // CSS custom property
   * ```
   */
  property?: string;
}

export type TransitionableStyles = {
  [K in keyof CSSStyleDeclaration]?: string | null;
} & {
  [customProperty: `--${string}`]: string | null;
} & {
  length?: never;
};

export type StylesInput = TransitionableStyles | string;
