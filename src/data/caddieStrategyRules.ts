export type StrategyRule = {
  id: string;
  title: string;
  principle: string;
  appUse: string;
};

export const caddieStrategyRules: StrategyRule[] = [
  {
    id: "average-carry",
    title: "Use average carry, not best shot",
    principle: "Club choice should be based on repeatable average carry distance.",
    appUse: "Use saved club carry first. Do not choose a club that only reaches on a perfect strike."
  },
  {
    id: "carry-vs-total",
    title: "Carry and total are different",
    principle: "Carry is for clearing hazards. Total is for run-out and stopping distance.",
    appUse: "Use carry for water, creek, bunker, and front-edge decisions. Use total for long danger and tee run-out."
  },
  {
    id: "driver-default",
    title: "Driver is the default tee club",
    principle: "Default to Driver for scoring unless risk dictates otherwise.",
    appUse: "Recommend Driver on par 4s and 5s. Only suggest safer clubs if danger, wind, or usual miss makes Driver high risk."
  },
  {
    id: "three-wood-safe-option",
    title: "3 Wood is a position club, not automatic",
    principle: "3 Wood is useful when driver brings trouble into play or position matters.",
    appUse: "Recommend 3 Wood when it leaves a comfortable next shot and avoids driver danger."
  },
  {
    id: "centre-green",
    title: "Centre green is often the smart target",
    principle: "Most amateurs score better avoiding short-sided misses and aiming away from trouble.",
    appUse: "Default approach target should be middle/safe side of green, not always the pin."
  },
  {
    id: "short-danger",
    title: "When short is dangerous, take enough club",
    principle: "Do not under-club when short miss brings bunker, water, creek, or hard up-and-down.",
    appUse: "Club up or aim middle/back when danger is short."
  },
  {
    id: "long-danger",
    title: "When long is dangerous, control distance",
    principle: "If long is dead, avoid extra club and avoid flyer risk.",
    appUse: "Choose controlled club or front/middle target when danger is long."
  },
  {
    id: "wind-head",
    title: "Headwind increases playing distance",
    principle: "A useful rule is roughly 1% added distance per 1 mph of headwind.",
    appUse: "Add playing distance for headwind and suggest lower flight or extra club."
  },
  {
    id: "wind-tail",
    title: "Tailwind reduces playing distance",
    principle: "A useful rule is roughly 0.5% reduced distance per 1 mph of tailwind.",
    appUse: "Reduce playing distance and warn about long miss."
  },
  {
    id: "par5-advance",
    title: "On par 5s, closer is usually better if safe",
    principle: "Laying back to a favourite number is not always best. Advance when risk is acceptable.",
    appUse: "Recommend advancing unless lie/hazard makes it high risk."
  }
];
