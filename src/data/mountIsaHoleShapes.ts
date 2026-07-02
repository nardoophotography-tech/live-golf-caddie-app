// Mount Isa Golf Club hole mapping data
// Generated mapping scaffold. Do NOT treat draft holes as accurate.
// Only set status: "traced" after the hole has been manually traced from an overhead reference.
// Only set status: "gps" after real tee/green/target GPS coordinates are entered and verified.

export type Point = { x: number; y: number; };
export type HazardShape = { type: "bunker" | "water" | "creek" | "trees" | "out" | "rough"; label?: string; shape: Point[]; };
export type HoleShapeStatus = "draft" | "traced" | "gps";
export type HoleShapeSource = "generated" | "google_maps_overhead" | "user_screenshot" | "gps_calibrated";
export type HoleShape = { hole: number; status: HoleShapeStatus; source: HoleShapeSource; note: string; tee?: Point; green?: Point; fairwayPath?: Point[]; fairwayWidth?: number; greenShape?: Point[]; hazards?: HazardShape[]; };

export const mountIsaHoleShapes: Record<number, HoleShape> = {
  1: { 
    hole: 1, 
    status: "traced", 
    source: "user_screenshot", 
    note: "Traced from pristine mockup image", 
    tee: { x: 50, y: 88 }, 
    green: { x: 53, y: 14 }, 
    fairwayPath: [
      { x: 50, y: 88 },
      { x: 51, y: 65 },
      { x: 52, y: 40 },
      { x: 53, y: 14 }
    ], 
    fairwayWidth: 18, 
    greenShape: [], 
    hazards: [
      { type: "bunker", label: "", shape: [{x: 58, y: 20}] },
      { type: "trees", label: "", shape: [{x: 70, y: 90}, {x: 72, y: 60}, {x: 75, y: 30}, {x: 75, y: 10}, {x: 95, y: 10}, {x: 95, y: 90}] },
      { type: "trees", label: "", shape: [{x: 30, y: 90}, {x: 28, y: 60}, {x: 25, y: 30}, {x: 25, y: 10}, {x: 5, y: 10}, {x: 5, y: 90}] }
    ] 
  },
  2: { hole: 2, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  3: { hole: 3, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  4: { hole: 4, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  5: { hole: 5, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  6: { hole: 6, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  7: { hole: 7, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  8: { hole: 8, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  9: { hole: 9, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  10: { hole: 10, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  11: { hole: 11, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  12: { hole: 12, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  13: { hole: 13, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  14: { hole: 14, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  15: { hole: 15, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  16: { hole: 16, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  17: { hole: 17, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
  18: { hole: 18, status: "draft", source: "generated", note: "Needs overhead trace. Do not show as traced.", tee: undefined, green: undefined, fairwayPath: undefined, fairwayWidth: undefined, greenShape: undefined, hazards: [] },
};

export function getHoleShapeBadge(shape?: HoleShape): string {
  if (!shape) return "Draft visual map — not course accurate";
  if (shape.status === "gps") return "GPS calibrated map";
  if (shape.status === "traced") return "Overhead traced map";
  return "Draft visual map — not course accurate";
}

export function canUseAccurateDistances(shape?: HoleShape): boolean {
  return Boolean(shape && shape.status === "gps" && shape.tee && shape.green);
}
