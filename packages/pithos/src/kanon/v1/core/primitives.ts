/**
 * Pithos primitive validation functions
 *
 * @since 1.1.0
 */

import { addCheckMethod } from "@kanon/v1/utils/add-check-method";

// Import primitive schemas
import { PithosString } from "@kanon/v1/schemas/primitives/string";
import { PithosNumber } from "@kanon/v1/schemas/primitives/number";
import { PithosInt } from "@kanon/v1/schemas/primitives/number";
import { PithosBoolean } from "@kanon/v1/schemas//primitives/boolean";
import { PithosNull } from "@kanon/v1/schemas/primitives/null";
import { PithosUndefined } from "@kanon/v1/schemas/primitives/undefined";
import { PithosBigInt } from "@kanon/v1/schemas/primitives/bigint";
import { PithosDate } from "@kanon/v1/schemas/primitives/date";
import { PithosAny } from "@kanon/v1/schemas/primitives/any";
import { PithosSymbol } from "@kanon/v1/schemas/primitives/symbol";
import { PithosUnknown } from "@kanon/v1/schemas/primitives/unknown";
import { PithosNever } from "@kanon/v1/schemas/primitives/never";
import { PithosVoid } from "@kanon/v1/schemas/primitives/void";

// Primitive functions

/**
 * Creates a string schema.
 *
 * @since 1.1.0
 */
export const string = () => addCheckMethod(new PithosString());

/**
 * Creates a number schema.
 *
 * @since 1.1.0
 */
export const number = () => addCheckMethod(new PithosNumber());

/**
 * Creates an integer schema.
 *
 * @since 1.1.0
 */
export const int = () => addCheckMethod(new PithosInt());

/**
 * Creates a boolean schema.
 *
 * @since 1.1.0
 */
export const boolean = () => addCheckMethod(new PithosBoolean());

/**
 * Creates a null schema.
 *
 * @since 1.1.0
 */
export const null_ = () => addCheckMethod(new PithosNull());

/**
 * Creates an undefined schema.
 *
 * @since 1.1.0
 */
export const undefined_ = () => addCheckMethod(new PithosUndefined());

/**
 * Creates a bigint schema.
 *
 * @since 1.1.0
 */
export const bigint = () => addCheckMethod(new PithosBigInt());

/**
 * Creates a date schema.
 *
 * @since 1.1.0
 */
export const date = () => addCheckMethod(new PithosDate());

/**
 * Creates an any schema.
 *
 * @since 1.1.0
 */
export const any = () => addCheckMethod(new PithosAny());

/**
 * Creates a symbol schema.
 *
 * @since 1.1.0
 */
export const symbol = () => addCheckMethod(new PithosSymbol());

/**
 * Creates an unknown schema.
 *
 * @since 1.1.0
 */
export const unknown = () => addCheckMethod(new PithosUnknown());

/**
 * Creates a never schema.
 *
 * @since 1.1.0
 */
export const never = () => addCheckMethod(new PithosNever());

/**
 * Creates a void schema.
 *
 * @since 1.1.0
 */
export const void_ = () => addCheckMethod(new PithosVoid());
