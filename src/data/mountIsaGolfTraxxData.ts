// src/data/mountIsaGolfTraxxData.ts
//
// Source: GolfTraxx.com hole-layout pages for Mount Isa Golf Course (zipcode 4825).
// URL pattern: https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=N&static=true
//
// What's real vs. estimated in this file:
// - par, handicap (men/women), and mens/womens yardage: read directly from GolfTraxx's page
//   header text for each hole (e.g. "Hole# 2 Par: 3/3 Hcp: 2/11 Mens 219 Womens 165"). High confidence.
// - green.front / green.centre / green.back: real GPS coordinates extracted from GolfTraxx's own
//   page variables (gflatitude/gflongitude, gclatitude/gclongitude, gblatitude/gblongitude). High confidence.
// - tee: NOT available. GolfTraxx's static page does not expose a distinct teeing-ground coordinate.
//   Left as null with a TODO -- do not fake this.
// - fairwayTarget: GolfTraxx's own "tt" (ttlatitude/ttlongitude) marker, labeled "TeeTarget" in their UI.
//   Verified (via the officialToComputedRatio field) that this is NOT the tee box -- it is a
//   representative target/landing point whose distance to the green scales with par (roughly full
//   hole distance on par 3s, ~half on par 5s, ~quarter on par 4s). Included as a real sourced point,
//   clearly labeled, not presented as the tee.
// - hazards: only sampled visually for a few holes (1 general note carried from hole 3's sample, plus
//   holes 3, 7, 16 sampled directly) via Google Maps satellite tiles rendered on GolfTraxx's page.
//   Google's Maps embed intermittently failed to render ("This page can't load Google Maps correctly")
//   during this pass, so most holes are marked TODO rather than guessed.
// - satelliteImage: reflects what's actually in /public/course-maps/mount-isa/ in this app today
//   (real cropped Hole19 photos for holes 1,4,5,6,7,9,10,11,12,13,16,17,18; placeholder for 2,3,8,14,15).
//
// This file is a reference/checklist dataset. It is not yet wired into the running app
// (see src/data/mountIsaCourse.ts for the data actually powering the live UI).
// See GOLFTRAXX-DATA-CHECKLIST.md for the full comparison against mountIsaCourse.ts,
// including a discrepancy found on holes 2 and 3 (see checklist for details).

export type GeoPoint = { lat: number; lng: number };

export type GolfTraxxHole = {
  hole: number;
  par: number;
  handicap: { men: number; women: number };
  distance: { mensYards: number; womensYards: number; mensMeters: number; womensMeters: number };
  green: { front: GeoPoint; centre: GeoPoint; back: GeoPoint };
  tee: GeoPoint | null;
  fairwayTarget: {
    point: GeoPoint;
    distanceToGreenFrontM: number;
    distanceToGreenCentreM: number;
    distanceToGreenBackM: number;
    officialToComputedRatio: number;
  };
  bearingFairwayTargetToGreenDeg: number;
  hazards: string;
  satelliteImage: { hasRealImage: boolean; path: string };
  sourceUrl: string;
  status: string;
};

export const mountIsaGolfTraxxData: GolfTraxxHole[] = [
  {
    hole: 1,
    par: 5,
    handicap: { men: 14, women: 8 },
    distance: { mensYards: 444, womensYards: 444, mensMeters: 406.0, womensMeters: 406.0 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.76833, lng: 139.477069 },
      centre: { lat: -20.768382, lng: 139.477018 },
      back: { lat: -20.768433, lng: 139.47696 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.76696, lng: 139.478249 },
      distanceToGreenFrontM: 195.6,
      distanceToGreenCentreM: 203.4,
      distanceToGreenBackM: 211.6,
      officialToComputedRatio: 2.0
    },
    bearingFairwayTargetToGreenDeg: 219.0, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation. Sampled Google-Maps satellite view (hole 3) shows arid outback terrain: red dirt, scattered native trees/scrub, sand-based greens (no grass). No water hazards typical for this course. Not hole-specific confirmed.",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-1-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=1&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 2,
    par: 3,
    handicap: { men: 2, women: 11 },
    distance: { mensYards: 219, womensYards: 165, mensMeters: 200.3, womensMeters: 150.9 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.769013, lng: 139.475936 },
      centre: { lat: -20.769042, lng: 139.47571 },
      back: { lat: -20.769068, lng: 139.475555 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.768756, lng: 139.477614 },
      distanceToGreenFrontM: 176.8,
      distanceToGreenCentreM: 200.5,
      distanceToGreenBackM: 216.9,
      officialToComputedRatio: 1.0
    },
    bearingFairwayTargetToGreenDeg: 260.9, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: false,
      path: "/course-maps/mount-isa/placeholder-satellite.png"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=2&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; satellite image still placeholder, tee + hazards need confirmation"
  },
  {
    hole: 3,
    par: 5,
    handicap: { men: 18, women: 3 },
    distance: { mensYards: 465, womensYards: 462, mensMeters: 425.2, womensMeters: 422.5 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.766339, lng: 139.478106 },
      centre: { lat: -20.766245, lng: 139.478179 },
      back: { lat: -20.766176, lng: 139.478255 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.767715, lng: 139.476879 },
      distanceToGreenFrontM: 199.2,
      distanceToGreenCentreM: 212.1,
      distanceToGreenBackM: 223.1,
      officialToComputedRatio: 2.0
    },
    bearingFairwayTargetToGreenDeg: 39.6, // approximate playing direction, not tee-anchored
    hazards: "Visually sampled from GolfTraxx satellite view: scattered native trees/scrub bordering fairway on both sides, red dirt rough, sand-scrape style green (no grass green). No water visible. Bunkers not clearly distinguishable from natural sandy terrain.",
    satelliteImage: {
      hasRealImage: false,
      path: "/course-maps/mount-isa/placeholder-satellite.png"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=3&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; satellite image still placeholder, tee + hazards need confirmation"
  },
  {
    hole: 4,
    par: 4,
    handicap: { men: 4, women: 1 },
    distance: { mensYards: 367, womensYards: 362, mensMeters: 335.6, womensMeters: 331.0 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.768514, lng: 139.47546 },
      centre: { lat: -20.76858, lng: 139.475374 },
      back: { lat: -20.768654, lng: 139.47526 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.767906, lng: 139.476103 },
      distanceToGreenFrontM: 95.1,
      distanceToGreenCentreM: 106.6,
      distanceToGreenBackM: 120.8,
      officialToComputedRatio: 3.15
    },
    bearingFairwayTargetToGreenDeg: 225.3, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-4-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=4&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 5,
    par: 3,
    handicap: { men: 10, women: 16 },
    distance: { mensYards: 137, womensYards: 106, mensMeters: 125.3, womensMeters: 96.9 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.76785, lng: 139.475049 },
      centre: { lat: -20.767774, lng: 139.47511 },
      back: { lat: -20.76769, lng: 139.475175 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.768639, lng: 139.47434 },
      distanceToGreenFrontM: 114.6,
      distanceToGreenCentreM: 125.1,
      distanceToGreenBackM: 136.6,
      officialToComputedRatio: 1.0
    },
    bearingFairwayTargetToGreenDeg: 39.8, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-5-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=5&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 6,
    par: 4,
    handicap: { men: 16, women: 14 },
    distance: { mensYards: 313, womensYards: 313, mensMeters: 286.2, womensMeters: 286.2 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.768865, lng: 139.472325 },
      centre: { lat: -20.768862, lng: 139.472209 },
      back: { lat: -20.768872, lng: 139.472097 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.768824, lng: 139.472867 },
      distanceToGreenFrontM: 56.5,
      distanceToGreenCentreM: 68.5,
      distanceToGreenBackM: 80.2,
      officialToComputedRatio: 4.18
    },
    bearingFairwayTargetToGreenDeg: 266.5, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-6-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=6&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 7,
    par: 5,
    handicap: { men: 12, women: 9 },
    distance: { mensYards: 465, womensYards: 313, mensMeters: 425.2, womensMeters: 286.2 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.767093, lng: 139.475434 },
      centre: { lat: -20.767041, lng: 139.47552 },
      back: { lat: -20.766999, lng: 139.475593 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.768009, lng: 139.47376 },
      distanceToGreenFrontM: 201.7,
      distanceToGreenCentreM: 212.3,
      distanceToGreenBackM: 221.2,
      officialToComputedRatio: 2.0
    },
    bearingFairwayTargetToGreenDeg: 59.5, // approximate playing direction, not tee-anchored
    hazards: "Visually sampled from GolfTraxx satellite view: Google Maps tiles partially loaded (fairway line visible, imagery below fold). Consistent arid/scrub terrain expected. TODO / needs full visual confirmation.",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-7-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=7&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 8,
    par: 3,
    handicap: { men: 8, women: 13 },
    distance: { mensYards: 152, womensYards: 126, mensMeters: 139.0, womensMeters: 115.2 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.766086, lng: 139.476475 },
      centre: { lat: -20.766011, lng: 139.476551 },
      back: { lat: -20.765926, lng: 139.47662 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.766919, lng: 139.47562 },
      distanceToGreenFrontM: 128.4,
      distanceToGreenCentreM: 139.9,
      distanceToGreenBackM: 151.7,
      officialToComputedRatio: 0.99
    },
    bearingFairwayTargetToGreenDeg: 43.8, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: false,
      path: "/course-maps/mount-isa/placeholder-satellite.png"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=8&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; satellite image still placeholder, tee + hazards need confirmation"
  },
  {
    hole: 9,
    par: 4,
    handicap: { men: 6, women: 6 },
    distance: { mensYards: 334, womensYards: 334, mensMeters: 305.4, womensMeters: 305.4 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.764672, lng: 139.478977 },
      centre: { lat: -20.764585, lng: 139.47904 },
      back: { lat: -20.764491, lng: 139.479106 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.765132, lng: 139.478591 },
      distanceToGreenFrontM: 65.0,
      distanceToGreenCentreM: 76.7,
      distanceToGreenBackM: 89.1,
      officialToComputedRatio: 3.98
    },
    bearingFairwayTargetToGreenDeg: 37.5, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-9-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=9&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 10,
    par: 3,
    handicap: { men: 11, women: 10 },
    distance: { mensYards: 134, womensYards: 114, mensMeters: 122.5, womensMeters: 104.2 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.764569, lng: 139.478026 },
      centre: { lat: -20.764583, lng: 139.477934 },
      back: { lat: -20.764605, lng: 139.477839 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.764329, lng: 139.479088 },
      distanceToGreenFrontM: 113.6,
      distanceToGreenCentreM: 123.3,
      distanceToGreenBackM: 133.4,
      officialToComputedRatio: 0.99
    },
    bearingFairwayTargetToGreenDeg: 256.8, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-10-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=10&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 11,
    par: 4,
    handicap: { men: 7, women: 18 },
    distance: { mensYards: 328, womensYards: 241, mensMeters: 299.9, womensMeters: 220.4 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.762399, lng: 139.478644 },
      centre: { lat: -20.7623, lng: 139.47869 },
      back: { lat: -20.762186, lng: 139.478743 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.762874, lng: 139.47839 },
      distanceToGreenFrontM: 59.1,
      distanceToGreenCentreM: 71.0,
      distanceToGreenBackM: 84.9,
      officialToComputedRatio: 4.22
    },
    bearingFairwayTargetToGreenDeg: 26.0, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-11-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=11&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 12,
    par: 4,
    handicap: { men: 5, women: 12 },
    distance: { mensYards: 335, womensYards: 265, mensMeters: 306.3, womensMeters: 242.3 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.759821, lng: 139.480699 },
      centre: { lat: -20.759712, lng: 139.480775 },
      back: { lat: -20.759639, lng: 139.480856 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.760269, lng: 139.480331 },
      distanceToGreenFrontM: 62.8,
      distanceToGreenCentreM: 77.2,
      distanceToGreenBackM: 88.8,
      officialToComputedRatio: 3.97
    },
    bearingFairwayTargetToGreenDeg: 36.7, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-12-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=12&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 13,
    par: 5,
    handicap: { men: 9, women: 2 },
    distance: { mensYards: 439, womensYards: 439, mensMeters: 401.4, womensMeters: 401.4 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.757621, lng: 139.482915 },
      centre: { lat: -20.757494, lng: 139.482977 },
      back: { lat: -20.75741, lng: 139.483039 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.759107, lng: 139.482124 },
      distanceToGreenFrontM: 184.6,
      distanceToGreenCentreM: 200.1,
      distanceToGreenBackM: 211.3,
      officialToComputedRatio: 2.01
    },
    bearingFairwayTargetToGreenDeg: 26.3, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-13-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=13&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 14,
    par: 3,
    handicap: { men: 3, women: 4 },
    distance: { mensYards: 193, womensYards: 184, mensMeters: 176.5, womensMeters: 168.2 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.758914, lng: 139.4827 },
      centre: { lat: -20.759032, lng: 139.482653 },
      back: { lat: -20.759133, lng: 139.482614 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.75754, lng: 139.483221 },
      distanceToGreenFrontM: 162.1,
      distanceToGreenCentreM: 176.1,
      distanceToGreenBackM: 188.0,
      officialToComputedRatio: 1.0
    },
    bearingFairwayTargetToGreenDeg: 199.6, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: false,
      path: "/course-maps/mount-isa/placeholder-satellite.png"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=14&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; satellite image still placeholder, tee + hazards need confirmation"
  },
  {
    hole: 15,
    par: 4,
    handicap: { men: 1, women: 15 },
    distance: { mensYards: 395, womensYards: 387, mensMeters: 361.2, womensMeters: 353.9 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.757475, lng: 139.485701 },
      centre: { lat: -20.757402, lng: 139.485784 },
      back: { lat: -20.757322, lng: 139.485881 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.758187, lng: 139.484828 },
      distanceToGreenFrontM: 120.4,
      distanceToGreenCentreM: 132.3,
      distanceToGreenBackM: 145.7,
      officialToComputedRatio: 2.73
    },
    bearingFairwayTargetToGreenDeg: 48.7, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: false,
      path: "/course-maps/mount-isa/placeholder-satellite.png"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=15&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; satellite image still placeholder, tee + hazards need confirmation"
  },
  {
    hole: 16,
    par: 5,
    handicap: { men: 15, women: 17 },
    distance: { mensYards: 493, womensYards: 383, mensMeters: 450.8, womensMeters: 350.2 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.760572, lng: 139.481206 },
      centre: { lat: -20.760618, lng: 139.481119 },
      back: { lat: -20.760691, lng: 139.481019 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.759482, lng: 139.482912 },
      distanceToGreenFrontM: 214.8,
      distanceToGreenCentreM: 225.2,
      distanceToGreenBackM: 238.4,
      officialToComputedRatio: 2.0
    },
    bearingFairwayTargetToGreenDeg: 235.9, // approximate playing direction, not tee-anchored
    hazards: "Visually sampled from GolfTraxx satellite view: Google Maps tiles failed to render for automated review (Google's own \"This page can't load Google Maps correctly\" error). TODO / needs visual confirmation.",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-16-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=16&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 17,
    par: 4,
    handicap: { men: 17, women: 5 },
    distance: { mensYards: 308, womensYards: 287, mensMeters: 281.6, womensMeters: 262.4 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.761945, lng: 139.480047 },
      centre: { lat: -20.762066, lng: 139.479986 },
      back: { lat: -20.762174, lng: 139.47994 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.761499, lng: 139.480243 },
      distanceToGreenFrontM: 53.6,
      distanceToGreenCentreM: 68.5,
      distanceToGreenBackM: 81.4,
      officialToComputedRatio: 4.11
    },
    bearingFairwayTargetToGreenDeg: 203.0, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-17-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=17&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  },
  {
    hole: 18,
    par: 4,
    handicap: { men: 13, women: 7 },
    distance: { mensYards: 306, womensYards: 306, mensMeters: 279.8, womensMeters: 279.8 },
    green: {
      // Real GPS points from GolfTraxx (green marker positions). High confidence.
      front: { lat: -20.764506, lng: 139.479408 },
      centre: { lat: -20.764614, lng: 139.479327 },
      back: { lat: -20.764716, lng: 139.479245 }
    },
    tee: null, // TODO: GolfTraxx's static page does not expose a reliable teeing-ground coordinate.
    fairwayTarget: {
      // GolfTraxx's "tt" (TeeTarget) marker. NOT the tee box -- verified by comparing computed
      // distance to green against official yardage: par-3s ratio ~1.0 (tt sits at the tee),
      // par-5s ratio ~2.0 (tt sits ~mid-fairway), par-4s ratio ~3-4x (tt sits close to the green).
      // Included as a real, sourced reference point only -- do not treat as the tee.
      point: { lat: -20.764098, lng: 139.479685 },
      distanceToGreenFrontM: 53.7,
      distanceToGreenCentreM: 68.4,
      distanceToGreenBackM: 82.6,
      officialToComputedRatio: 4.09
    },
    bearingFairwayTargetToGreenDeg: 213.0, // approximate playing direction, not tee-anchored
    hazards: "TODO / needs visual confirmation (not yet sampled from GolfTraxx satellite view in this pass).",
    satelliteImage: {
      hasRealImage: true,
      path: "/course-maps/mount-isa/hole-18-satellite.jpg"
    },
    sourceUrl: "https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=18&static=true",
    status: "verified: par/hcp/yardage/green GPS from GolfTraxx; tee + hazards need confirmation"
  }

];
