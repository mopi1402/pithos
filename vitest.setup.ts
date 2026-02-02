/**
 * @fileoverview Automatic cleanup setup for mock globals.
 * This file is automatically loaded by Vitest before running tests.
 */

import { afterEach } from "vitest";
import { __autoRestoreAll } from "@arkhe/test/globals";

afterEach(() => {
  __autoRestoreAll();
});

