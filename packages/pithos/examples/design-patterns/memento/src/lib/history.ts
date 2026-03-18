/**
 * Memento pattern: photo history using createHistory.
 */

import { createHistory } from "@pithos/core/eidos/memento/memento";
import type { PhotoState } from "./types";

export function createPhotoHistory(initial: PhotoState) {
  return createHistory<PhotoState>(initial);
}
