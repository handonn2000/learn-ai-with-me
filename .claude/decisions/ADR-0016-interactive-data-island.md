# ADR-0016 — Interactive 3D data island

Date: 2026-09-09. Status: accepted for the requested DEF Week 7 visual upgrade.

## Context and decision

The user requested an explorable 3D data world inspired by a low-poly island reference.
Replace the chapter 1 journey figure with a real WebGL island, retaining the surrounding
lesson content and its other visual styles. Six architectural landmarks show PostgreSQL,
Debezium, Kafka, Kafka Streams, Snowflake and Airflow. Three use-case tabs select CDC,
stream processing or scheduled batches. Camera rotation/zoom and station inspection are
functional exploration controls; animations keep running without a playback toolbar.

Use Three.js 0.186.0 (MIT) and its TypeScript declarations. A dynamic import delays the
renderer and library until the scene enters the viewport; no React renderer framework
or external model/texture downloads are needed. Procedural low-poly meshes support actual
orbiting, depth, picking and projected original-logo labels. CSS 3D alone was suitable for
the previous rack illustration, but would not provide comparable terrain, picking or
camera behavior for this request. Browser graphics resources and bundle size are the
tradeoff; measure the built lazy chunk and cap pixel ratio, stop hidden animation loops,
and release resources on unmount.

The WebGL view keeps its navy twilight palette in both page themes. Labels and controls
are HTML. A keyboard-accessible station list and full textual routes remain available
without WebGL. Reduced motion renders a static world and allows explicit camera changes.
Gold Airflow paths represent control signals, separate from data transport; Streams
results return to Kafka before the sink. The landscape is a teaching metaphor, not an
actual deployment topology or replica simulation.

Reference: https://threejs.org/docs/pages/WebGLRenderer.html (WebGL2 lifecycle and disposal).

## Measured build impact

The lazy renderer/library chunk is approximately 561 kB minified / 143 kB gzip in the
production build. Vite emits its default >500 kB chunk warning; retain that warning
rather than weakening the threshold. The chunk is fetched only when the island first
enters the viewport, and does not enter the shared application startup bundle.
