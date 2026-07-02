export type GeoPoint = {
  lat: number;
  lng: number;
};

export type Hazard = {
  type: "bunker" | "water" | "trees" | "creek" | "out";
  label?: string;
  positionPercent: number;
  side?: "left" | "right" | "centre";
};

export type PlannedShot = {
  club: string;
  carryM: number;
  totalM: number;
  note?: string;
  landing?: GeoPoint;
};

export type CourseHole = {
  hole: number;
  par: number;
  distanceM: number;
  distanceYd: number;
  si?: number;
  tee?: GeoPoint;
  green?: GeoPoint;
  hazards?: Hazard[];
  plan: PlannedShot[];
  mindset: string;
};

export const mountIsaCourse: CourseHole[] = [
  {
    hole: 1,
    par: 5,
    distanceM: 429,
    distanceYd: 469,
    si: 14,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '7 Iron', carryM: 130, totalM: 140 }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 2,
    par: 5,
    distanceM: 450,
    distanceYd: 492,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '3 Hybrid', carryM: 165, totalM: 175 },
      { club: 'SW', carryM: 75, totalM: 75, note: 'layup distance' }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 3,
    par: 4,
    distanceM: 340,
    distanceYd: 372,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '7 Iron', carryM: 130, totalM: 140 }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 4,
    par: 4,
    distanceM: 363,
    distanceYd: 397,
    si: 4,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '3 Hybrid', carryM: 165, totalM: 175 },
      { club: 'SW', carryM: 95, totalM: 95, note: 'to centre' }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 5,
    par: 3,
    distanceM: 136,
    distanceYd: 149,
    si: 10,
    plan: [
      { club: '7 Iron', carryM: 135, totalM: 145, note: 'higher flight' }
    ],
    mindset: 'Up-and-down mindset, play for leave'
  },
  {
    hole: 6,
    par: 4,
    distanceM: 310,
    distanceYd: 339,
    si: 16,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '3 Hybrid', carryM: 155, totalM: 165, note: 'soft 4H' }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 7,
    par: 5,
    distanceM: 458,
    distanceYd: 501,
    si: 12,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '3 Hybrid', carryM: 165, totalM: 175 },
      { club: 'SW', carryM: 105, totalM: 105, note: 'full' }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 8,
    par: 3,
    distanceM: 145,
    distanceYd: 159,
    hazards: [
      { type: 'creek', positionPercent: 85, side: 'centre', label: 'creek' }
    ],
    plan: [
      { club: '7 Iron', carryM: 135, totalM: 145, note: 'clear creek' }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 9,
    par: 4,
    distanceM: 329,
    distanceYd: 360,
    si: 6,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '7 Iron', carryM: 130, totalM: 140 }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 10,
    par: 3,
    distanceM: 133,
    distanceYd: 145,
    si: 11,
    plan: [
      { club: '7 Iron', carryM: 130, totalM: 140, note: 'smooth' }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 11,
    par: 4,
    distanceM: 327,
    distanceYd: 358,
    si: 7,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '7 Iron', carryM: 130, totalM: 140 }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 12,
    par: 4,
    distanceM: 328,
    distanceYd: 359,
    si: 5,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '7 Iron', carryM: 130, totalM: 140 }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 13,
    par: 5,
    distanceM: 431,
    distanceYd: 471,
    si: 9,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '3 Hybrid', carryM: 150, totalM: 160, note: 'soft 4H' }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 14,
    par: 3,
    distanceM: 190,
    distanceYd: 208,
    hazards: [
      { type: 'bunker', positionPercent: 90, side: 'centre', label: 'front edge' }
    ],
    plan: [
      { club: '3 Hybrid', carryM: 165, totalM: 175, note: 'front edge ok' }
    ],
    mindset: 'Up-and-down mindset, play for leave'
  },
  {
    hole: 15,
    par: 4,
    distanceM: 395,
    distanceYd: 432,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '3 Hybrid', carryM: 165, totalM: 175 },
      { club: 'SW', carryM: 20, totalM: 20, note: 'third shot' }
    ],
    mindset: 'Up-and-down mindset, play for leave'
  },
  {
    hole: 16,
    par: 5,
    distanceM: 488,
    distanceYd: 534,
    si: 15,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '3 Hybrid', carryM: 165, totalM: 175 },
      { club: 'SW', carryM: 90, totalM: 90, note: 'to pin' }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 17,
    par: 4,
    distanceM: 293,
    distanceYd: 320,
    si: 17,
    plan: [
      { club: '3 Hybrid', carryM: 165, totalM: 175 },
      { club: '7 Iron', carryM: 130, totalM: 140 }
    ],
    mindset: 'Green in Regulation'
  },
  {
    hole: 18,
    par: 4,
    distanceM: 304,
    distanceYd: 332,
    si: 13,
    plan: [
      { club: '3 Wood', carryM: 190, totalM: 200 },
      { club: '7 Iron', carryM: 130, totalM: 140 }
    ],
    mindset: 'Green in Regulation'
  }
];
