# ADR-0014 — Course-specific lessons and shared quiz rendering

Date: 2026-09-08. Status: accepted for the authorized DEF Week 7 implementation.

## Context

Week 7 of DEF uses the same b7 identifier that another course can use. The previous
SessionQuiz always selected CSC14003 questions and progress; reusing it directly
would silently mix course content and saved scores.

## Decision

Keep SessionQuiz's AI defaults, and allow explicit questions, courseSlug and topic-label
resolver. Missing questions for a non-AI course produce no quiz, never an AI fallback.
Course.topicLabels supplies localized labels to roadmap reports. DEF's checklist key
includes the course slug. No ProgressDB shape/key migration and no new dependency.

Keep DEF feature files under features/lessons/def/b7 with flat VI/EN bundles and a typed
selector. The new deterministic teaching engine uses pure TypeScript without React or
browser imports, retaining the existing separation between computation and playback.
This is a deliberate extension of the older JS-engine reference pattern: existing JS
engines remain untouched, and new typed snapshots are checked by tsc and isolated tests.
It does not execute Kafka, Debezium or a real sink.

## Consequences and verification

One rendered quiz component still owns scoring, and callers explicitly own content.
Shared course checks exercise storage isolation; Week 7's focused checks exercise all
crash outcomes, group offsets, CDC/retention and locale/quiz parity. An isolated browser
verified the DEF score survives reload/locale switch without changing an AI sentinel.
The original single-course lesson checker is not used to certify a DEF lesson ID;
scripts/check-def-b7.mjs supplies the course-specific checks, alongside i18n gates and
independent content/fidelity reviews.
