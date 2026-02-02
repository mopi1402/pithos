/**
 * Pithos constraint validation functions
 *
 * @since 1.1.0
 */

// Number comparison functions

/**
 * Less than constraint.
 *
 * @since 1.1.0
 */
export const lt = (value: number) => (data: number) => data < value;

/**
 * Less than or equal constraint.
 *
 * @since 1.1.0
 */
export const lte = (value: number) => (data: number) => data <= value;

/**
 * Greater than constraint.
 *
 * @since 1.1.0
 */
export const gt = (value: number) => (data: number) => data > value;

/**
 * Greater than or equal constraint.
 *
 * @since 1.1.0
 */
export const gte = (value: number) => (data: number) => data >= value;

/**
 * Minimum value constraint.
 *
 * @since 1.1.0
 */
export const minimum = (value: number) => (data: number) => data >= value;

/**
 * Maximum value constraint.
 *
 * @since 1.1.0
 */
export const maximum = (value: number) => (data: number) => data <= value;

// Array constraint functions

/**
 * Minimum length constraint.
 *
 * @since 1.1.0
 */
export const minLength = (value: number) => (data: unknown[]) =>
  data.length >= value;

/**
 * Maximum length constraint.
 *
 * @since 1.1.0
 */
export const maxLength = (value: number) => (data: unknown[]) =>
  data.length <= value;

/**
 * Exact length constraint.
 *
 * @since 1.1.0
 */
export const length = (value: number) => (data: unknown[]) =>
  data.length === value;

// String constraint functions

/**
 * Regex pattern constraint.
 *
 * @since 1.1.0
 */
export const regex = (pattern: RegExp) => (data: string) => pattern.test(data);

/**
 * Includes substring constraint.
 *
 * @since 1.1.0
 */
export const includes = (value: string) => (data: string) =>
  data.includes(value);

/**
 * Starts with prefix constraint.
 *
 * @since 1.1.0
 */
export const startsWith = (value: string) => (data: string) =>
  data.startsWith(value);

/**
 * Ends with suffix constraint.
 *
 * @since 1.1.0
 */
export const endsWith = (value: string) => (data: string) =>
  data.endsWith(value);

/**
 * Lowercase constraint.
 *
 * @since 1.1.0
 */
export const lowercase = () => (data: string) => data === data.toLowerCase();

/**
 * Uppercase constraint.
 *
 * @since 1.1.0
 */
export const uppercase = () => (data: string) => data === data.toUpperCase();

// Transformation function

/**
 * Overwrite transformation.
 *
 * @since 1.1.0
 */
export const overwrite =
  <T>(transform: (data: T) => T) =>
  (data: T) =>
    transform(data);

// Refinement function

/**
 * Refine constraint.
 *
 * @since 1.1.0
 */
export const refine =
  <T>(check: (data: T) => boolean, options?: { abort?: boolean }) =>
  (data: T) => {
    // Create a function that captures the options
    const checkFn = (data: T) => {
      const result = check(data);
      // Attach options to the function for detection
      (checkFn as any).__abort = options?.abort;
      return result;
    };
    return checkFn;
  };
