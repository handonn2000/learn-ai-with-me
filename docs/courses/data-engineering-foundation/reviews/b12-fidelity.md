# DEF b12 — independent translation fidelity review

Date: 2026-09-16. Reviewer: independent `lesson12_fidelity` subagent using `.claude/agents/i18n-fidelity-judge.md` and the repository lesson-voice instructions. Scope: full `lesson12.text.vi.ts` / `lesson12.text.en.ts` pair, after machine i18n validation passed (191 keys, 433 strings).

## Verdict: ĐẠT

Reviewed all paragraphs, tables, lab instructions, code explanations, practice and ten quiz questions/explanations. No meaning errors, stiff translations requiring correction, or loss of voice found. No source files modified by reviewer.

Evidence returned by the reviewer:

- `chapters[5].body[2]`: both locales qualify parallelism=64 with one scheduler; neither treats it as an absolute ceiling for all deployments.
- `chapters[8].body[2]`: both distinguish a successful branch decision from passing data.
- `chapters[9].body[4]` and `quiz[8]`: strict >99% and failure of 99/100 preserved.
- `practiceGuide`: 5 running, 95 awaiting resources, 100 awaiting run admission mapped to the same categories.
- `intro`: the clocks-keep-their-promise narration retains the same causal setup and conclusion.

EN consistently retains I/you, contractions, cautions, and actionable lab instructions. No required fixes.
