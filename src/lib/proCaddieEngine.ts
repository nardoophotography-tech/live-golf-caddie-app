import { caddieStrategyRules } from '../data/caddieStrategyRules';

export type Club = {
  club: string;
  carry: number;
  total: number;
  miss?: "left" | "right" | "short" | "long" | string;
};

export type CourseHole = {
  hole: number;
  par: number;
  distanceM: number;
  distanceYd: number;
  handicap: number;
  mindset: string;
  notes: string[];
  hazards: string[];
  plan: any[];
};

export type CaddieInput = {
  hole: CourseHole;
  shotNumber: number | string;
  distanceM: number;
  windSpeedKmh?: number;
  windDirection: "none" | "into" | "helping" | "cross" | "leftToRight" | "rightToLeft" | string;
  slope: "flat" | "uphill" | "downhill" | "sidehill" | string;
  lie: "tee" | "fairway" | "rough" | "sand" | "bad" | string;
  danger: "short" | "long" | "left" | "right" | "water" | "bunker" | "creek" | "trees" | "none" | string;
  targetType?: "green" | "fairway" | "layup" | "recovery" | string;
  playerClubs: Club[];
  usualMiss?: string;
};

export type CaddieDecision = {
  recommendedClub: string;
  backupClub?: string;
  shotType: string;
  swingFeel: string;
  aimPoint: string;
  adjustedDistanceM: number;
  carryNeededM: number;
  safeMiss: string;
  avoid: string;
  riskLevel: "low" | "medium" | "high";
  reason: string;
  nextShotGoal: string;
  inputsUsed: string[];
  rulesUsed: string[];
};

export function mToYd(m: number): number {
  return Math.round(m * 1.09361);
}

export function generateCaddieDecision(input: CaddieInput): CaddieDecision {
  const { hole, distanceM, windSpeedKmh = 0, windDirection, slope, lie, danger, playerClubs, usualMiss = "none" } = input;
  
  const shotNumber = Number(input.shotNumber) || 1;
  const isTeeShot = shotNumber === 1;
  const isPar3 = hole.par === 3;
  const isPar4 = hole.par === 4;
  const isPar5 = hole.par === 5;
  const targetType = input.targetType || (isPar3 || (isPar4 && !isTeeShot) || (isPar5 && shotNumber >= 3) ? 'green' : 'fairway');

  let inputsUsed = ["Hole distance", "par", "shot number", "danger", "lie", "user clubs"];
  let rulesUsedSet = new Set<string>();

  let adjustedM = distanceM;
  let windMph = windSpeedKmh * 0.621371;

  // Wind Adjustment
  if (windMph > 0 && windDirection !== "none") inputsUsed.push("wind");
  if (windDirection === "into" && windMph > 0) {
    let addPct = (windMph * 1.0) / 100;
    adjustedM += distanceM * addPct;
    rulesUsedSet.add("Headwind increases playing distance");
  } else if (windDirection === "helping" && windMph > 0) {
    let subPct = (windMph * 0.5) / 100;
    adjustedM -= distanceM * subPct;
    rulesUsedSet.add("Tailwind reduces playing distance");
  }

  // Slope Adjustment
  if (slope !== "flat") inputsUsed.push("slope");
  if (slope === "uphill") {
    adjustedM += distanceM * 0.07;
  } else if (slope === "downhill") {
    adjustedM -= distanceM * 0.05;
  }

  // Lie Adjustment
  let isLayupForced = false;
  let riskLevel: "low" | "medium" | "high" = "low";
  
  if (lie === "rough") {
    adjustedM += distanceM * 0.07;
    riskLevel = "medium";
    if (distanceM > 180 && (danger === "water" || danger === "creek")) isLayupForced = true;
  } else if (lie === "sand") {
    adjustedM += distanceM * 0.12;
    riskLevel = "medium";
    if (distanceM > 160) isLayupForced = true;
  } else if (lie === "bad") {
    adjustedM += distanceM * 0.15;
    riskLevel = "high";
    isLayupForced = true;
  }

  let carryNeededM = distanceM;
  if (danger === "water" || danger === "creek" || danger === "short" || danger === "bunker") {
    carryNeededM = distanceM; // Must carry the whole way
    rulesUsedSet.add("Carry and total are different");
    rulesUsedSet.add("When short is dangerous, take enough club");
  } else if (targetType === "green") {
    carryNeededM = distanceM * 0.9;
  } else {
    carryNeededM = distanceM * 0.8;
  }

  // Club Selection
  const sortedClubs = [...playerClubs].sort((a, b) => Number(a.total) - Number(b.total));
  let recommendedClub = sortedClubs[0] || { club: 'No club', carry: 0, total: 0 };
  let backupClub: Club | undefined;

  let targetClubM = adjustedM;
  let isLayup = targetType === "layup" || isLayupForced;
  let isRecovery = targetType === "recovery" || lie === "bad";

  // Par 5 / Layup Logic
  if (isPar5 && shotNumber === 2 && lie !== "tee") {
    if (distanceM > 240 || (distanceM > 200 && (danger === "water" || danger === "creek" || danger === "trees" || lie !== "fairway"))) {
      isLayup = true;
    } else {
      rulesUsedSet.add("On par 5s, closer is usually better if safe");
    }
  }
  
  if (isRecovery) {
    targetClubM = Math.min(130, adjustedM);
    riskLevel = "low";
  } else if (isLayup) {
    targetClubM = Math.max(0, adjustedM - 100); 
    if (targetClubM < 100) targetClubM = 120;
    riskLevel = "low";
  }

  // Find optimal club
  let selectedIdx = 0;
  for (let i = 0; i < sortedClubs.length; i++) {
    const c = sortedClubs[i];
    if (danger === "long") {
      if (Number(c.total) >= targetClubM) {
        selectedIdx = Math.max(0, i - 1);
        rulesUsedSet.add("When long is dangerous, control distance");
        break;
      }
    } else if (danger === "short" || danger === "water" || danger === "creek") {
      if (Number(c.carry) >= carryNeededM) {
        selectedIdx = i;
        break;
      }
    } else {
      if (Number(c.total) >= targetClubM) {
        selectedIdx = i;
        break;
      }
    }
  }

  if (selectedIdx >= sortedClubs.length) selectedIdx = sortedClubs.length - 1;
  recommendedClub = sortedClubs[selectedIdx];
  rulesUsedSet.add("Use average carry, not best shot");

  // Tee Shot Logic (Par 4/5)
  let rejectedAlternative = "";
  if (isTeeShot && !isPar3) {
    const driver = sortedClubs.find(c => c.club.toLowerCase().includes('driver'));
    const wood3 = sortedClubs.find(c => c.club.toLowerCase() === '3 wood' || c.club.toLowerCase().includes('wood'));
    const hybrid = sortedClubs.find(c => c.club.toLowerCase().includes('hybrid') || c.club.toLowerCase().includes('iron'));
    
    if (driver && wood3) {
      const isNarrowTarget = (danger === "left" || danger === "right" || danger === "trees" || danger === "water" || danger === "creek");
      const missMatchesDanger = (danger !== "none" && usualMiss === danger);
      const isLongRunout = danger === "long";
      const isTooShort = hole.distanceM < 320; // Short par 4
      
      if ((isNarrowTarget && (windMph > 20 || missMatchesDanger)) || isLongRunout) {
        recommendedClub = isLongRunout || isTooShort ? (hybrid || wood3) : wood3;
        if (missMatchesDanger) {
          rejectedAlternative = `Driver brings your usual miss right into the ${danger} danger. A safer club keeps the ball in play.`;
        } else if (isLongRunout) {
          rejectedAlternative = `Driver risks running out into the long danger.`;
        } else {
          rejectedAlternative = `Driver is too risky given the ${danger} danger and strong wind.`;
        }
        rulesUsedSet.add("3 Wood is a position club, not automatic");
      } else {
        recommendedClub = driver;
        rejectedAlternative = `There is no selected penalty danger, so the scoring benefit of Driver is worth it.`;
        rulesUsedSet.add("Driver is the default tee club");
      }
    }
  }

  if (danger === "short") {
    backupClub = sortedClubs[Math.min(sortedClubs.length - 1, selectedIdx + 1)];
  } else {
    backupClub = sortedClubs[Math.max(0, selectedIdx - 1)];
  }

  // Aim point & Shot Type
  let aimPoint = "Centre green";
  if (targetType === "fairway") aimPoint = "Widest part of fairway";
  let safeMiss = "Middle of green";
  let avoid = danger !== "none" ? danger : "big miss";
  let shotType = "Smooth stock shot";
  let swingFeel = "Normal tempo";
  let nextShotGoal = "Two putts for par";

  // Aim adjustments
  if (usualMiss && usualMiss !== "none") inputsUsed.push("usual miss");
  if (usualMiss === "right" && danger !== "left") {
    aimPoint = targetType === "fairway" ? "Widest part of fairway, away from usual miss" : "Middle-left green";
  } else if (usualMiss === "left" && danger !== "right") {
    aimPoint = targetType === "fairway" ? "Widest part of fairway, away from usual miss" : "Middle-right green";
  }
  
  if (windDirection === "cross" || windDirection === "leftToRight" || windDirection === "rightToLeft") {
    aimPoint = `Aim into the wind, away from the ${usualMiss || danger}`;
  }
  
  if (danger === "bunker") {
    aimPoint = "Away from bunker side";
    avoid = "Short-sided bunker";
  }
  if (targetType === "green") rulesUsedSet.add("Centre green is often the smart target");

  // Shot Types
  if (isTeeShot && !isPar3) {
    shotType = recommendedClub.club.includes('Wood') || recommendedClub.club.includes('Hybrid') ? "Controlled fairway finder" : "Standard tee shot";
    nextShotGoal = `Get inside a comfortable approach distance.`;
    safeMiss = "Light rough with a clear angle";
    if (recommendedClub.club.includes('Driver')) {
       avoid = "Penalty side, trees, or blocked approach.";
    }
  } else if (isLayup) {
    shotType = "Safe layup";
    safeMiss = "Fattest part of the fairway";
    nextShotGoal = "Leave a preferred wedge distance for the next shot.";
  } else if (isRecovery) {
    shotType = "Recovery punch out";
    safeMiss = "Anywhere safe and in play";
    nextShotGoal = "Get back into position to save bogey or make par.";
  } else if (targetType === "green") {
    shotType = "Controlled centre-green approach";
    safeMiss = "Middle/back portion of green";
    if (danger === "long") {
      safeMiss = "Front edge of green";
      avoid = "Flying the target";
    }
    nextShotGoal = "Be putting or leave a simple chip, not a short-sided recovery.";
  }

  if (windDirection === "into" && windMph > 10) {
    shotType = "Knockdown into wind";
    swingFeel = "Abbreviated follow-through";
  }

  // Danger specific reason
  let reason = ``;
  if (isTeeShot && !isPar3) {
    reason = ``;
    if (recommendedClub.club === "Driver") {
      reason += `Driver is the default tee club because extra distance improves the next shot. ${rejectedAlternative}`;
    } else {
      reason += `${rejectedAlternative}`;
    }
  } else {
    reason = `The base distance is ${distanceM} m / ${mToYd(distanceM)} yd. `;
    if (windDirection === "into" && windMph > 0 && danger === "short") {
      reason += `Into wind and short danger both mean you should take enough club. Your ${backupClub?.club || "next club"} carry is around ${Number(backupClub?.carry || 0)} m / ${mToYd(Number(backupClub?.carry || 0))} yd, so forcing it risks finishing short. `;
    } else if (danger === "long") {
      reason += `With long being dangerous, it's better to play a controlled ${recommendedClub.club} rather than risking a flyer over the back. `;
    } else if (isLayup) {
      reason += `With ${danger} in play and a ${lie} lie, the smartest play is to lay up to your favorite wedge distance. `;
    } else {
      reason += `Your ${recommendedClub.club} carry is ${Number(recommendedClub.carry)} m / ${mToYd(Number(recommendedClub.carry))} yd, making it the right club to safely cover the distance. `;
    }
  }

  let backupText = backupClub?.club;
  if (isTeeShot && recommendedClub.club !== "Driver") {
    backupText = "Driver only if fairway is open and driver is controlled today.";
  } else if (isTeeShot && recommendedClub.club === "Driver") {
    backupText = "3 Wood if driver is missing both ways today.";
  } else if (windDirection === "into") {
    backupText = `Smooth ${backupClub?.club || 'longer club'} if the headwind is strong.`;
  }

  return {
    recommendedClub: recommendedClub.club,
    backupClub: backupText,
    shotType,
    swingFeel,
    aimPoint,
    adjustedDistanceM: Math.round(adjustedM),
    carryNeededM: Math.round(carryNeededM),
    safeMiss,
    avoid,
    riskLevel,
    reason: reason.trim(),
    nextShotGoal,
    inputsUsed,
    rulesUsed: Array.from(rulesUsedSet)
  };
}
