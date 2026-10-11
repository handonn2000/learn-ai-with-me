export const MINIMAX_CODE = `def value(state):
    if terminal(state):
        return utility(state)  # MAX perspective
    child_values = [value(result(state, a))
                    for a in actions(state)]
    if player(state) == "MAX":
        return max(child_values)
    return min(child_values)

def choose_move(state):
    score = lambda a: value(result(state, a))
    if player(state) == "MAX":
        return max(actions(state), key=score)
    return min(actions(state), key=score)`;
