# b9 quality review — CSC14003 Buổi 9 · Tác tử logic · Logic mệnh đề

Reviewer: independent `lesson-quality-judge` subagent, 2026-10-10. Caller saves the report; reviewer only read files.

## Round 1 — verdict NEEDS CHANGES

Scope: full lesson (every substantive point, Quiz 01–06, Homework 6, Lab 2 part 1), VI only. Sources inspected: all 97 pages of `Lecture07-LogicalAgents.pdf` (rendered to images), `buoi8/Homework6.pdf`, `Lab2.ipynb` (1a–1c target models disassembled with `pickletools`). Static code/data/visual-state review; no browser tool in the reviewer's run. Snapshot: git HEAD `ce0f3a8`, b9 folder untracked; `lesson09.text.vi.ts` sha256 `394ce96eaa4c4887`, `logic-engine.js` `29f2b76b759821d8`, `Lesson09Logic.tsx` `08c895a91da5f639`.

Reviewer runs: `node scripts/check-ai-b9.mjs` PASS; `check_lesson.py b9` pass (storage-key warning); scratch traces of FC (16 frames) / BC (26 frames) vs pp. 61–80, resolution proofs (Wumpus, umbrella, murder), Quiz 06 DPLL, WalkSAT seeds 7–11, murder KB without `D ⇒ ¬T` (no longer entails B), a BC failure-memo counterexample.

### Must fix (all medium)

| ID | Where | Finding |
|---|---|---|
| C1 | `dpll.cards[2]` | Unit clause defined as “only one unassigned literal left” — must also require every other literal to be false (a clause with a true literal forces nothing). |
| C2 | `chaining.bc` | “Reuse failed subgoals” unqualified; a failure caused by a loop cut must not be cached (counterexample KB `A ∧ B ⇒ G, B ⇒ A, A ⇒ B, C ⇒ A, C`). Engine already correct. |
| C3 | `chaining.rule` | “One positive literal = fact” reads like the definite-clause definition; a fact has an empty body. |
| C4 | `kb.lead` | 8-puzzle is taught in Buổi 5, not 3. |
| C5 | `dpll.scalePunch` | The 120 pairwise clauses say *at most one* Wumpus; “exactly one” is 121. |
| C6 | `math-primers.js` b9 | “Every algorithm starts by rewriting ⇒/⇔” is false (TT-ENTAILS, FC/BC don't). |
| C7 | `dpll.dp` | DP deletes clauses containing φ **or ¬φ**. |
| V1 | #modelcheck | Quiz 01 (p.32) never presented; Quiz 05 points back to it. |
| V2 | #dpll | Quiz 06 (p.96) thin: no statement, no answer for B ⇒ ¬C, no DP route. |
| A1 | `ChainLoop` | Reduced motion shows only the last frame; no static FC order / BC summary around the figure. |
| A2 | CSS | At 375px the graph (min-width 520) and the 3-column proof table (min-width 480) scroll, hiding nodes/parents while looping. |

Unresolved U1: p.91's column is “Tautology”, not “truth table”; units and `*` are unlabeled in the source — lesson should not state its inference as fact.

Source corrections confirmed: p.36 (`P ⇒ ¬P` not valid), p.27 (operand order), p.45 (R7 misprint; lesson uses p.41's correct R7), p.95 (time index on L justified). History verified: Davis–Putnam 1960; Davis–Logemann–Loveland 1962 (CACM 5(7):394–397, splitting rule replaced Rule III for storage reasons); Hunt the Wumpus 1973.

Coverage ledger: 75 in-scope units — 69 covered, 4 covered-with-correction, 2 thin (Quiz 01, Quiz 06), 0 missing. Lab 2 parts 2–3 out of scope (FOL, Buổi 10).

Optional suggestions (13): two meanings of “mệnh đề”; chaining loop pace and final-frame hold; homework Q1 should show how to find the culprit (query A, B, C); Lab 2 1c is exclusive or; resolution is refutation-complete; `KWS` lacks `global`/`is` (shared tokenizer); `role="tab"` without tabpanel; α marked by colour only; DP decimals; table header padding; FC code representation; double colon in FC init caption; forward pointer that the agent sometimes has to gamble (Buổi 11).

### Author response to round 1

- **Disagreement:** the reviewer says p.54 prints no umbrella proof. `pdftotext -f 54 -l 54` shows the numbered table 1 `¬R ∨ U` … 7 `⚫ 4 and 6`; the engine comment and `UMBRELLA_PROOF` stay.
- Lab 2 1c checked independently: `models/1c.pklz` holds two single-atom models, {Day} and {Night}.
- Fixes applied are listed in round 2.

## Round 2 — verdict PASS (changed scope, VI, static review)

Snapshot: `lesson09.text.vi.ts` `8ab1539d1f806df3`, `Lesson09Logic.tsx` `f328152cd9838532`, `LogicVisuals.tsx` `a347944123bd5732`, `lesson09.css` `aa6fde5a5eb7fbfb`, `math-primers.js` `8eb7edea34ab11df`, `scripts/check-ai-b9.mjs` `759253ba39240f6d`, `LogicLab.tsx` `e2e2ebb4e286f0ec`.

Fixes verified: C1 (unit clause requires every other literal false + contrast example), C2 (failure reuse excludes loop-cut failures; counterexample KB in test), C3 (fact = empty body), C4 (buổi 5), C5 (“nhiều nhất một Wumpus” = 120), C6 (only resolution/DPLL/WalkSAT start from CNF), C7 (φ or ¬φ), U1 (header “Tautology”, hedged note), V1 (Quiz 01 card, 32/1/⊨ R; Quiz 05 points back), V2 (Quiz 06 card, (a) ⊭ C via DPLL trace, (b) ⊨ B ⇒ ¬C via DPLL and DP sketch — both asserted in the test script), A1 (`fcOrder`, `bcOrder`, `ChainTrace` details, no live region), A2 (portrait 360×560 layout under 640px, separate marker ids; proof table exempt from min-width). Optional items taken were checked correct. The p.54 disagreement is withdrawn: the proof table is in the PDF text layer but covered by white reveal shapes when rendered.

Remaining optional items and what the author did:
1. Quiz 06 card preceded the DP explanation → moved below `dpNote`.
2. Homework Q1 tip led to Lab resolution stopping at the 500-clause cap for queries A and C → tip now says so and points to Truth table / DPLL (verified: both say KB ⊭ A, KB ⊭ C).
3. Buổi 11 pointer overpromised → now “xác suất ở buổi 11 là công cụ để đo xem liều ở ô nào ít rủi ro hơn”.
4. α badge contrast → measured 2.80:1 in light theme with `--yellow`; switched to `--text-hi`: 12.71:1 light, 7.25:1 dark.
5. `KWS` tokenizer (`global`, `is`) and DP decimal style left unchanged (shared file / verbatim data).

Browser evidence by the author (built-in browser): desktop 1280 and 612px, 375px (no page overflow, narrow graph 297px, proof table 297/297), EN and VI, light and dark, all four loops advance, both toggle states, lab methods + custom input + syntax errors, presentation mode 15 slides, quiz 11 questions, checklist 7 items; only the visible loop runs while scrolled elsewhere; with the pane hidden (`document.hidden = true`) a loop inside the viewport reports `suspended`. Reduced motion verified by code only (hook returns the final frame; static order text and trace lists are always in the DOM).
