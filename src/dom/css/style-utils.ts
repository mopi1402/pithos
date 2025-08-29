import { StylesInput } from "../../types/animations/transition-config";
import { isString } from "../../types/guards/type-guards";

/**
 * Extract class names from a space-separated string
 * @param classNames - Space-separated class names
 * @returns Array of individual class names
 * @example
 * ```typescript
 * extractClassNames('btn primary active') // ['btn', 'primary', 'active']
 * extractClassNames('  single  ') // ['single']
 * ```
 */
export const extractClassNames = (classNames: string): string[] =>
  classNames.split(" ").filter(Boolean);

import { TransitionableStyles } from "../../types/animations/transition-config";

/**
 * Remove CSS properties from an element's style
 * @param element - Target element
 * @param styles - CSS properties to remove
 * @example
 * ```typescript
 * removeCSSProperties(element, { opacity: '1', transform: 'scale(1)' });
 * ```
 */
export const removeCSSProperties = (
  element: HTMLElement,
  styles: TransitionableStyles
): void => {
  Object.keys(styles).forEach((key) => {
    element.style.removeProperty(key);
  });
};

/**
 * Apply styles to element (classes or inline).
 * Handles both CSS class names and inline style objects.
 */
export const applyStyles = (
  element: HTMLElement,
  styles: StylesInput
): void => {
  if (isString(styles)) {
    const classes = extractClassNames(styles);
    if (classes.length) element.classList.add(...classes);
  } else {
    Object.assign(element.style, styles);
  }
};

/**
 * Remove styles from element (classes or inline).
 * Handles both CSS class names and inline style objects.
 */
export const removeStyles = (
  element: HTMLElement,
  styles: StylesInput
): void => {
  if (isString(styles)) {
    const classes = extractClassNames(styles);
    if (classes.length) element.classList.remove(...classes);
  } else {
    removeCSSProperties(element, styles);
  }
};

/**
 * Get property value from computed or inline styles
 */
export const getStyleValue = (
  element: HTMLElement,
  computed: CSSStyleDeclaration,
  prop: string
): string => {
  if (prop.startsWith("--")) {
    return (
      computed.getPropertyValue(prop) || element.style.getPropertyValue(prop)
    );
  }
  return (
    computed.getPropertyValue(prop) || element.style.getPropertyValue(prop)
  );
};
