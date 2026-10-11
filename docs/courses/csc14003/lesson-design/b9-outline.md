# Buổi 9 — learning sequence

Source: `public/materials/Lecture/buoi9/Lecture07-LogicalAgents.pdf` (97 pages), `public/materials/Lecture/buoi8/Homework6.pdf` (propositional logic homework; `buoi9/Homework7.pdf` is FOL and belongs to Buổi 10), Lab 2 part 1 (three PL formalisations). Scope: every knowledge point in the deck, VI first then EN, beginner reading at night, one Wumpus KB carried through.

Math primer → 01 knowledge-based agent → 02 Wumpus world → 03 models & entailment → 04 PL syntax/semantics → 05 model checking, equivalence, validity, satisfiability → 06 inference rules & proofs → 07 CNF & resolution → 08 Horn clauses, forward/backward chaining → 09 DPLL, DP, WalkSAT, PL limits → 10 Logic Lab → 11 summary → 12 quiz → 13 practice + homework PDF + Lab 2.

| # | Anchor | Unblocks | Form |
|---|---|---|---|
| 01 | `#kb` | "Search agents already work; why logic?" — 8-puzzle parity, TELL/ASK, declarative vs procedural | cards, colored KB-AGENT code, A⇒(B∨C) example |
| 02 | `#wumpus` | "How can an agent act without seeing pits?" | PEAS cards, 6-dim table, auto-loop exploration (slides 14–17) |
| 03 | `#entail` | "KB doesn't say ¬α, so α must be true?" (misconception check) | auto-loop of 8 models with α₁/α₂ tabs, soundness/completeness cards |
| 04 | `#syntax` | "Rain ⇒ wet on a sunny day: true or false?" (misconception check) | grammar, precedence, connective truth table, R1–R5 |
| 05 | `#modelcheck` | "Enumerating 128 worlds is the honest answer — when does it break?" | TT-ENTAILS Python, 3-of-128 table, equivalence table, validity/satisfiability, Quiz 02 solved |
| 06 | `#rules` | "Proofs skip irrelevant symbols" | MP/MT/And rules, two numbered proofs, proof-as-search, monotonicity |
| 07 | `#resolution` | "One rule is enough — if every sentence is a clause" | CNF steps, Quiz 03, PL-RESOLUTION, auto-loop Joe refutation, R11–R17 |
| 08 | `#chaining` | "Horn KBs make entailment linear" | Horn/definite/goal, AND-OR graph auto-loop with FC/BC tabs, FC vs BC |
| 09 | `#dpll` | "WalkSAT says no model ≠ unsatisfiable" (misconception check) | DPLL heuristics, DP vs DPLL table, WalkSAT, 64 symbols/155 sentences, limits → FOL |
| 10 | `#lab` | "Same KB, five engines: what does each one cost?" | functional lab: presets + custom KB; truth table / CNF / resolution / FC / BC / DPLL traces |

Slide corrections carried in the lesson: slide 36 lists `P ⇒ ¬P` as valid (it is only satisfiable; the AIMA example is `P ⇒ P`); slide 27 evaluates `P₂,₂ ∨ P₃,₁` as `true ∨ false` but under m₁ it is `false ∨ true` (same final value).
