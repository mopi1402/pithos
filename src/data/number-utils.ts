import { Nullish, Nullable } from "../types/common";

export function parseFloatDef(
  value: Nullish<string>,
  defaultValue: Nullish<number> = null
): Nullable<number> {
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function parseIntDef(
  value: Nullish<string>,
  defaultValue: Nullish<number> = null,
  radix?: number
): Nullable<number> {
  if (!value) return defaultValue;
  const parsed = parseInt(value, radix);
  return isNaN(parsed) ? defaultValue : parsed;
}
