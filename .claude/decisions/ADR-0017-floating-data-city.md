# ADR-0017 — Floating data city with a shared explanatory timeline

Date: 2026-09-15. Status: accepted for the requested DEF Week 7 revision; final visual verification pending.

## Context and decision

The user asked to turn the interactive data island into a floating city and make the
data route visually explainable, then explicitly requested the skill at
https://3dviz.dev/. This supersedes ADR-0016's landscape direction, while retaining
its Three.js integration, accessible HTML controls and fallback behavior.

Author a custom city in the existing renderer: six floating urban platforms, roads,
glass towers, elevated bridges and distinct framework landmarks. Preserve genuine
framework logos, camera rotation/zoom, station inspection and the CDC, Streams and
scheduled-batch tabs. Architectural detail establishes a city at overview and close-up
distances; building dimensions are decorative and do not represent capacity or a real
deployment topology. No new rendering framework or external runtime models are required.

## Authoritative state and visual meaning

`data-world-timeline.ts` owns the presentation stages, their durations, active edge and
packet kind. The renderer and HTML route reader consume that state together. The
current bridge is bright, past segments recede, and arrows make direction visible.
The stage title, numbered steps and themed JSON explain the transfer currently shown.
Stable HTML also supplies the full trace for readers using reduced motion or without
WebGL. Result dwell and cycle reset are explicitly illustrative, not a data deletion.

Use one identifiable example, order 42. CDC starts with a committed row/WAL change,
then represents the Debezium event sent through Kafka to the sink. Streams converts
the illustrative amount 12 into 1200 cents in the processing district, returns that
purple result to a Kafka output topic, then reaches the warehouse. Batch uses three
records and a solid data path; gold dashed Airflow commands schedule extraction and
loading without implying that record data passes through the scheduler. Color,
direction, packet form and text work together so color is not the sole explanation.

## 3Dviz guidance used

Read the [3Dviz Pro Max skill](https://github.com/viettranx/3dviz-pro-max/blob/d077e0e68915c25be8e71d74684d3144fd1c2aca/skills/3dviz-pro-max/SKILL.md)
from a temporary source checkout at revision
`d077e0e68915c25be8e71d74684d3144fd1c2aca`; this is guidance use, not a global plugin installation.
The implementation workflow consulted object construction, subject clarity, lighting,
technical grounding and visual/frame inspection guidance. Retrieved catalog records
`knowledge.theme-cyberpunk-city` and `knowledge.reasoning-visual-channel-legend`
informed layered urban infrastructure, restrained light/material contrast and explicit
stable visual encodings. The city geometry and lesson timeline are custom work;
no finished city kit, glider/wind simulation or catalog capture result is claimed.

The relevant guidance is to keep motion and readouts tied to authoritative state,
preserve the user's stack, and inspect actual output at overview and meaningful
close-ups. The route is a teaching illustration whose technical claims need their own
evidence; using a visual skill does not validate Kafka, Debezium or Airflow semantics.

## Tradeoffs and verification

The existing lazy Three.js chunk still incurs WebGL and bundle costs. Reuse geometry
and materials where useful, keep detail that establishes the city, park inactive work,
and preserve offscreen/document-hidden/reduced-motion lifecycle handling. Avoid
measuring all HTML labels on every moving-packet frame when the camera is unchanged.

Verify timeline boundaries and reset behavior, all route phases and payloads, camera
clearance and readable labels at actual overview/close-up/mobile sizes, fallback and
reduced motion. Current-city browser evidence and final check results belong in its
review report; earlier island screenshots and passing checks are historical evidence
only. This ADR does not claim those current checks have passed.
