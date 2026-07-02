import type { HoleShape } from "../data/mountIsaHoleShapes";

export function holeShapeBadge(shape?: HoleShape): string {
  if (!shape) return "Draft visual map — not course accurate";
  switch (shape.status) {
    case "gps": return "GPS calibrated map";
    case "traced": return "Overhead traced map";
    default: return "Draft visual map — not course accurate";
  }
}
export function holeShapeIsCourseAccurate(shape?: HoleShape): boolean { return Boolean(shape && (shape.status === "traced" || shape.status === "gps")); }
export function holeShapeCanCalculateGpsDistance(shape?: HoleShape): boolean { return Boolean(shape && shape.status === "gps" && shape.tee && shape.green); }
