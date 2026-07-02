# GolfTraxx Data Checklist — Mount Isa Golf Course (All 18 Holes)

Source: [GolfTraxx.com](https://golftraxx.com/) hole-layout pages, pattern:
`https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=N&static=true` (N = 1–18)

Collected: 2026-07-02. Data extracted from GolfTraxx's own page content (header text + embedded
Google Maps marker coordinates), not guessed. See `src/data/mountIsaGolfTraxxData.ts` for the full
structured dataset backing this table.

## Summary table

| Hole | Par | Men Distance | Women Distance | HCP (M/W) | Satellite Image Status | Source URL | Missing Items | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | 5 | 444 yd | 444 yd | 14/8 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=1&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 2 | 3 | 219 yd | 165 yd | 2/11 | Placeholder (needs real screenshot) | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=2&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed; Real satellite image | PAR MISMATCH: live app shows Par 5, GolfTraxx shows Par 3 -- Needs review |
| 3 | 5 | 465 yd | 462 yd | 18/3 | Placeholder (needs real screenshot) | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=3&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards partially sampled, general terrain only; Real satellite image | PAR MISMATCH: live app shows Par 4, GolfTraxx shows Par 5 -- Needs review |
| 4 | 4 | 367 yd | 362 yd | 4/1 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=4&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 5 | 3 | 137 yd | 106 yd | 10/16 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=5&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 6 | 4 | 313 yd | 313 yd | 16/14 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=6&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 7 | 5 | 465 yd | 313 yd | 12/9 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=7&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards partially sampled, general terrain only | Data collected, cross-checked OK |
| 8 | 3 | 152 yd | 126 yd | 8/13 | Placeholder (needs real screenshot) | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=8&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed; Real satellite image | Data collected, cross-checked OK |
| 9 | 4 | 334 yd | 334 yd | 6/6 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=9&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 10 | 3 | 134 yd | 114 yd | 11/10 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=10&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 11 | 4 | 328 yd | 241 yd | 7/18 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=11&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 12 | 4 | 335 yd | 265 yd | 5/12 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=12&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 13 | 5 | 439 yd | 439 yd | 9/2 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=13&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 14 | 3 | 193 yd | 184 yd | 3/4 | Placeholder (needs real screenshot) | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=14&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed; Real satellite image | Data collected, cross-checked OK |
| 15 | 4 | 395 yd | 387 yd | 1/15 | Placeholder (needs real screenshot) | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=15&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed; Real satellite image | Data collected, cross-checked OK |
| 16 | 5 | 493 yd | 383 yd | 15/17 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=16&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards partially sampled, general terrain only | Data collected, cross-checked OK |
| 17 | 4 | 308 yd | 287 yd | 17/5 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=17&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
| 18 | 4 | 306 yd | 306 yd | 13/7 | Real image | [Link](https://golftraxx.com/hole-layout?coursename=Mount+Isa+Golf+Course&zipcode=4825&hole=18&static=true) | Tee GPS coordinate not exposed by GolfTraxx; Hazards TODO not visually confirmed | Data collected, cross-checked OK |
## ⚠️ Critical finding: Holes 2 and 3 are wrong in the live app

The par/distance data currently powering the live app (`src/data/mountIsaCourse.ts`) does not match
GolfTraxx for holes 2 and 3:

| Hole | Live app (mountIsaCourse.ts) | GolfTraxx (official) |
|---|---|---|
| 2 | Par 5, 492 yd | **Par 3, 219 yd (Men) / 165 yd (Women)** |
| 3 | Par 4, 372 yd | **Par 5, 465 yd (Men) / 462 yd (Women)** |

This isn't a small rounding difference — hole 2 is currently shown as a par 5 when GolfTraxx says
it's a par 3. Every other hole (1, 4–18) is consistent between the two sources (within a ~25–40 yard
offset, likely a different tee marker — not a data error).

I have **not** changed `mountIsaCourse.ts` in this pass — the task was scoped to collecting and
recording GolfTraxx data into the two new files. Let me know if you want me to apply this correction
to the live app data next.

## What's solid vs. what's still open

**Reliable (sourced directly from GolfTraxx, high confidence):**
- Par, handicap (men/women), and men's/women's yardage for all 18 holes — read directly from each
  hole's page header.
- Green front/centre/back GPS coordinates for all 18 holes — read directly from GolfTraxx's own
  Google Maps marker variables.

**Not available / needs follow-up:**
- **Tee GPS coordinates** — GolfTraxx's static page does not expose the actual teeing-ground
  location. It does expose a "TeeTarget" marker, but cross-checking it against the official yardage
  shows it's a fairway landing-zone reference (not the tee) — see the "fairwayTarget" field and
  `officialToComputedRatio` note in `mountIsaGolfTraxxData.ts` for the full explanation. Marked `null`
  with a TODO rather than faked.
- **Hazards (bunkers, water, trees, doglegs, OOB)** — only spot-checked on holes 1 (via hole 3's
  sample), 3, 7, and 16 via GolfTraxx's embedded Google Maps satellite view. The rest are marked TODO.
  Two notes from what was visible: the course is arid/outback terrain (red dirt, scattered native
  trees/scrub, no water hazards seen) with sand-based greens rather than grass — consistent with
  Mount Isa's known sand-green layout. Google's Maps embed also failed to render on some holes during
  this pass ("This page can't load Google Maps correctly"), which limited how many holes could be
  visually reviewed reliably.
- **Target line / playing direction** — approximated as the bearing from the fairway-target marker to
  the green centre (included in the data file as `bearingFairwayTargetToGreenDeg`). This is a real,
  computed value, but since it isn't anchored to the true tee, treat it as directionally useful rather
  than precise.

## Satellite image status (in this app's `public/course-maps/mount-isa/`)

Real cropped images exist for holes: **1, 4, 5, 6, 7, 9, 10, 11, 12, 13, 16, 17, 18**.
Still using the shared placeholder image: **2, 3, 8, 14, 15** — same 5 holes flagged in the earlier
`GOLF_CADDY_NEXT_STEPS.md` handoff as needing real screenshots.

## Files produced in this pass

- `src/data/mountIsaGolfTraxxData.ts` — structured TypeScript data for all 18 holes (not yet wired
  into the running app; `mountIsaCourse.ts` still powers the live UI).
- `GOLFTRAXX-DATA-CHECKLIST.md` — this file.
