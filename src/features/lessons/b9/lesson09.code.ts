export const KB_AGENT_CODE = `t = 0
KB = initial_knowledge_base()

def kb_agent(percept):
    global t
    tell(KB, make_percept_sentence(percept, t))
    action = ask(KB, make_action_query(t))
    tell(KB, make_action_sentence(action, t))
    t += 1
    return action`;

export const TT_ENTAILS_CODE = `def tt_entails(kb, alpha):
    symbols = proposition_symbols(kb, alpha)
    return tt_check_all(kb, alpha, symbols, {})

def tt_check_all(kb, alpha, symbols, model):
    if not symbols:
        if pl_true(kb, model):
            return pl_true(alpha, model)
        return True  # KB is false here, so this world cannot refute alpha
    p, rest = symbols[0], symbols[1:]
    return (tt_check_all(kb, alpha, rest, {**model, p: True}) and
            tt_check_all(kb, alpha, rest, {**model, p: False}))`;

export const FC_CODE = `from collections import deque

def pl_fc_entails(clauses, q):
    count = {c: len(c.premise) for c in clauses}
    inferred = set()
    agenda = deque(c.conclusion for c in clauses if not c.premise)
    while agenda:
        p = agenda.popleft()
        if p == q:
            return True
        if p not in inferred:
            inferred.add(p)
            for c in clauses:
                if p in c.premise:
                    count[c] -= 1
                    if count[c] == 0:
                        agenda.append(c.conclusion)
    return False`;

export const DPLL_CODE = `def dpll(clauses, symbols, model):
    if all(is_true(c, model) for c in clauses):
        return True                      # 1. early termination
    if any(is_false(c, model) for c in clauses):
        return False
    p, value = find_pure_symbol(symbols, clauses, model)
    if p is not None:                    # 2. pure symbol
        return dpll(clauses, [s for s in symbols if s != p], {**model, p: value})
    p, value = find_unit_clause(clauses, model)
    if p is not None:                    # 3. unit clause
        return dpll(clauses, [s for s in symbols if s != p], {**model, p: value})
    p, rest = symbols[0], symbols[1:]
    return (dpll(clauses, rest, {**model, p: True}) or
            dpll(clauses, rest, {**model, p: False}))`;
