# Prashant's Office - 3D walk-through portfolio

An isometric, low-poly 3D office you can walk around in, doubling as Prashant Katheriya's portfolio.
Tap/click the floor to walk; step into a room (Reception, About cabin, Project desks, Skills wall,
Creator studio, Contact desk) and its card opens. Includes an office-tour checklist, dark/light theme,
and a no-WebGL "Simple view" fallback.

## Run
Static site - no build step. Serve the folder (or open via GitHub Pages):
- `index.html`
- `main.js` (scene + interactions)
- `three.min.js` (Three.js r149, MIT)

## Stack
Plain Three.js, procedural low-poly geometry only - no paid assets, no external requests.
Mobile-first: capped pixel ratio, shadows off on touch devices, automatic quality drop if FPS is low.
