// Test avec JIT: Schema utilisateur simple + compilation JIT
import { string, number, boolean, object, parse } from "@pithos/kanon/v3";
import { compile } from "@kanon/v3/jit/compiler";

const userSchema = object({
  name: string(),
  age: number(),
  employed: boolean(),
});

// Compile le schéma en validateur JIT
const validateUserJIT = compile(userSchema);

export const validateUser = (data: unknown) => {
  return validateUserJIT(data);
};

export const validateUserV3 = (data: unknown) => {
  return parse(userSchema, data);
};
