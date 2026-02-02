// /schemas/primitives/string.ts - Version avec fonction string()
import { createStringSchema, DEFAULT_STRING_SCHEMA } from "./string.js";
import { addStringConstraints } from "../constraints/string.js";

export function string(message?: string) {
  const baseSchema = message
    ? createStringSchema(message)
    : DEFAULT_STRING_SCHEMA;
  return addStringConstraints(baseSchema);
}




