# Mount Isa Golf Caddie — Status & Next Steps

_Last updated by Claude: check the file's modified date for freshness._

## What's working

- `SatelliteHoleMap.jsx` is the single component driving all 18 hole cards in `main.jsx` (`App` → `HoleCard`). It renders a dark, premium GPS-style overlay on top of a background photo: header (hole/par/distance), live "To Green" / "To Centre" / "To Layup" distance boxes, club-distance labels pulled from each hole's `plan` in `mountIsaCourse.ts`, a wind widget, right-side icon toolbar, bottom nav with hole/par/S.I., and 20 m distance arcs.
- Course data (`src/data/mountIsaCourse.ts`) has been corrected against your real Hole19 app screenshots for 13 holes — notably **Hole 1 is Par 5 / 429 m** (previously listed as Par 4 / 330 m) and **Hole 13 is Par 5** (previously Par 4). A `si` (stroke index) field was added and is now shown in the bottom nav instead of a hardcoded placeholder.
- Build verified clean: `vite build` compiles `main.jsx` and its full import graph with no errors. `SatelliteHoleOneMap.jsx` and `OriginalTwoDRenderedHoleMap.jsx` are no longer imported anywhere (superseded by `SatelliteHoleMap.jsx`) but were independently syntax-checked and are valid — left in place, untouched, in case you want to reference them.

## Which holes have real satellite imagery

Cropped from your own Hole19 app screenshots (chrome removed — status bar, distance readouts, right toolbar, bottom sheet all stripped out; only Hole19's own thin flag/line/circle markers remain baked into the photo, since those can't be cropped out without cutting into the hole itself):

**Holes with real imagery:** 1, 4, 5, 6, 7, 9, 10, 11, 12, 13, 16, 17, 18
Files live in `public/course-maps/mount-isa/hole-{N}-satellite.jpg` and are wired into `main.jsx` via the `holeSatelliteImages` map near the top of the file.

**Holes still missing real imagery:** 2, 3, 8, 14, 15
These show a clean dark placeholder ("Satellite imagery coming soon") instead of a photo — no imagery was faked or substituted for them. Reasons:
- **Holes 2 and 3:** source screenshots (`Screenshot_20260701_174818_Hole19.jpg` and `Screenshot_20260701_174831_Hole19.jpg`) are 0 bytes — likely a OneDrive sync gap when they were first saved.
- **Holes 8, 14, 15:** source screenshots (`Screenshot_20260701_174933_Hole19.jpg`, `_175021_`, `_175028_`) are truncated/corrupted JPEGs — only the very top sliver of each image (roughly the flag marker) is intact before the file cuts off into gray padding. Not enough usable photo to crop a background from.

## Exact files needed from you

Please re-capture and re-share these 5 screenshots from the Hole19 app (same style as your originals — full-screen, standing at the tee, before scrolling/zooming):

- A clean screenshot of **Hole 2**
- A clean screenshot of **Hole 3**
- A clean screenshot of **Hole 8**
- A clean screenshot of **Hole 14**
- A clean screenshot of **Hole 15**

To avoid the ordering/matching ambiguity from last time, please name them directly by hole number when you save them, e.g.:
`hole-2.jpg`, `hole-3.jpg`, `hole-8.jpg`, `hole-14.jpg`, `hole-15.jpg`

Drop them in the `hole maps` folder (same place as the originals). Once they're there, the remaining wiring is a quick follow-up: crop + add 5 lines to the `holeSatelliteImages` map in `main.jsx`.

## How to test the app locally

From the `live-golf-caddie-app` folder:

```
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`) in a browser. Go to the **Course** tab to see all 18 hole cards with the new satellite/placeholder backgrounds.

To build a production bundle:

```
npm run build
```

Output goes to `dist/`.

## Technical note (for context, no action needed)

While verifying the build this session, the sandbox's shell had a stale cached view of `main.jsx` that didn't match the real file on your machine (the real file was always correct — this was purely a sandbox-side read-cache issue, not corruption of your actual project). It was resolved by forcing a fresh write-through and re-verified with a clean build. Nothing on your end was affected.
