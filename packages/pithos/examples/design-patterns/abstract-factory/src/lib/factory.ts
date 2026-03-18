/**
 * Abstract Factory for cross-platform UI kits.
 *
 * One factory.create() call returns a full UIKit (button, input, modal, nav, theme)
 * styled for the selected platform. Consumer code never changes.
 */

import { createAbstractFactory } from "@pithos/core/eidos/abstract-factory/abstract-factory";
import { PLATFORM_FAMILIES } from "@/data/platforms";
import type { Platform, UIKit } from "./types";

export const uiFactory = createAbstractFactory<Platform, UIKit>(PLATFORM_FAMILIES);
