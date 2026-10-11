# b9 i18n fidelity review — CSC14003 Buổi 9

Reviewer: independent `i18n-fidelity-judge` subagent, 2026-10-10, after `check_i18n.py b9` was clean. Pairs: `lesson09.text.vi.ts` ↔ `lesson09.text.en.ts` (whole bundle), `math-primers.js` ↔ `math-primers.en.js` (key `b9`), `session-quizzes.js` ↔ `session-quizzes.en.js` (key `b9`, 11 questions).

## Round 1 — ĐẠT

No meaning errors (SAI NGHĨA): formulas, counts (128/3/125, 32/1, 64/155 = 2+16+16+1+120, 16×4 = 64, 2⁴ = 16), definitions (entailment, sound/complete, valid/satisfiable, definite/Horn/goal clause, fact with empty body, unit clause, pure symbol), DPLL order, Quiz 06 (a)/(b) including the DP route, homework answers and all 11 quiz keys match. The analogy swaps (“tô phở” promise → “I’ll buy you dinner”, digits 9 and 7 kept; stamp card → coffee loyalty card) keep their mechanism. No authorial “we”, no banned openers.

Findings below the CẦN SỬA threshold, all applied by the author:
- DỊCH CỨNG `resolution.cnf`: the VI note exists because Vietnamese uses “mệnh đề” for both proposition and clause; EN rewritten as “From here on, *clause* always means a disjunction of literals — a narrower thing than the general “proposition” from the math primer.”
- DỊCH CỨNG `lab.lead`: “where each one pays” read as profit; now “what each one costs you”.
- Spelling `neighbour(s)` → `neighbor(s)` (3 keys); straight `'` → `’` in “session N’s” (3 keys).
- Optional: removed the unverified “mainframes and minicomputers” detail from `wumpus.lead`; “without building a single truth table”; `dpNote` opens “Read this table with a skeptical eye”.
- Reported against VI too: in `chaining.fc` the loyalty card “losing a stamp” ran backwards to `count` = stamps still missing; both locales now say each confirmed symbol adds a stamp (one fewer missing) and 0 missing = full card.

Also changed after round 1 in both locales (from the quality review): `wumpus.after` (Buổi 11 pointer) and `hw.cards[0].hint` (Lab may hit the 500-clause limit for queries A and C).

## Round 2 — narrow re-check, ĐẠT

Keys re-read: `chaining.fc`, `wumpus.after`, `hw.cards[0].hint` (both locales); `resolution.cnf`, `lab.lead`, `wumpus.steps[0..1]`, `syntax.kbNotes[1]`, `wumpus.envTitle`, `dpll.paras[0]`, `hw.lab2Note`, `wumpus.lead`, `chaining.quizAnswer`, `dpll.dpNote` (EN). No new findings. Verdict recorded in `.claude/i18n/judged/b9.json` with `pairs_hash` `44055001c0ac6095`; `i18n_loop.py b9` exits 0.
