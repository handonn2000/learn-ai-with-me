# ADR-0015 — Repeating explanatory lesson scenes

Date: 2026-09-09. Status: accepted for the user-requested DEF Week 7 revision and lesson guidance.

## Context

The user asked to remove explanatory playback controls, repeat animations like GIFs,
compare use cases through tabs, diversify visuals, retain authentic framework icons,
and improve code readability and emphasis. The previous paused players required actions
to reveal an explanation.

## Decision

Use independent visibility-aware scene clocks and semantic keyboard-accessible scenario
tabs. Start automatically, hold meaningful final states, then repeat the illustration.
Reset captions distinguish a fresh example from actual Kafka deletion or recovery.
Pause clocks and CSS motion outside the viewport or while the document is hidden;
clean up on unmount. Reduced motion supplies static outcomes plus persistent explanations.
Do not announce changing frames through live regions.

Choose the representation for the concept: SVG branches, CSS transit/conveyor paths,
storage tiles, event postcards, receipt filmstrips, archive pruning and modest CSS 3D
broker racks. Existing component libraries do not constrain future choices. This revision
needs no new dependency. Keep simulations deterministic and preserve the original engine,
source tables, quiz, anchors and course progress keys.

Use authentic local framework artwork with recorded provenance and license, including
official assets or maintained registries. Render JSON as escaped React token spans,
keeping copyable data intact. Use semantic theme colors and selective bilingual emphasis.

## Consequences

Explanations are visible without playback actions. Tabs remain meaningful choices;
quiz and assessment controls retain their learning purpose. Browser verification must
cover transitions and loop boundaries, scenario switching, keyboard tabs, hidden/deck
lifecycle, reduced motion, mobile layout and both themes. The lesson/new-lesson and
quality-judge guidance records these preferences without imposing a universal visual quota.
