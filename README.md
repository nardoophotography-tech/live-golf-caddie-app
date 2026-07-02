# Live Golf Caddie App

A simple phone-friendly golf caddie starter app.

## What it does

- Stores your personal club carry distances.
- Uses phone GPS to get your location.
- Pulls live weather from Open-Meteo.
- Uses wind, slope, lie, danger, and your club distances to suggest a club.
- Does not use or connect to the Garmin Approach R10. You can use the R10 only to measure your club distances first.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite link on your phone/computer.

## Build

```bash
npm run build
```

## Next upgrades

1. Add real golf course maps.
2. Add GPS distance to front/middle/back of green.
3. Save rounds and scores.
4. Add voice mode.
5. Add admin/course setup.


## Mount Isa 18-hole data added

The app now includes `src/courseData.js` with the full Mount Isa Golf front 9 and back 9 phone-card shot plan. Open the Course tab, tap a hole or planned shot, then the Caddie tab will use that distance for the recommendation.
