/**
 * Pithos parsing validation functions
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "@kanon/v1/types/base";

// Global parsing functions

/**
 * Parses data with a schema.
 *
 * @since 1.1.0
 */
export const parse = <T>(schema: PithosType<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

/**
 * Safely parses data with a schema.
 *
 * @since 1.1.0
 */
export const safeParse = <T>(
  schema: PithosType<T>,
  data: unknown
): PithosSafeParseResult<T> => {
  return schema.safeParse(data);
};

/**
 * Asynchronously parses data with a schema.
 *
 * @since 1.1.0
 */
export const parseAsync = async <T>(
  schema: PithosType<T>,
  data: unknown
): Promise<T> => {
  const result = await schema.safeParseAsync(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

/**
 * Asynchronously safely parses data with a schema.
 *
 * @since 1.1.0
 */
export const safeParseAsync = async <T>(
  schema: PithosType<T>,
  data: unknown
): Promise<PithosSafeParseResult<T>> => {
  return schema.safeParseAsync(data);
};
