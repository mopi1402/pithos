import { Point } from "../types/math/geometry";

export function distance(pos1: Point, pos2: Point): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
