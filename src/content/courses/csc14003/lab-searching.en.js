// Code Lab data — Session 3 (CSC14003 Lab 1: Searching)
// Each algorithm: pseudocode + Python (matching the Lab 1 main.py framework)

export const HELPER_PY = `import heapq
from collections import deque

def reconstruct(visited, destination):
    """Trace parent pointers backward to reconstruct the path."""
    path = [destination]
    while visited[path[-1]] is not None:
        path.append(visited[path[-1]])
    return path[::-1]`;

export const ALGOS = [
{
id:'BFS', name:'Breadth-first search', vn:'Level by level, shallowest first', frontier:'Queue (FIFO)', stop:'Stop when the goal is GENERATED',
pseudo:`function BFS(problem) returns solution / failure
  node ← node(INITIAL-STATE, PATH-COST = 0)
  if GOAL-TEST(node) then return SOLUTION(node)
  frontier ← FIFO QUEUE containing node
  explored ← ∅
  loop:
    if EMPTY?(frontier) then return failure
    node ← POP(frontier)          ▷ SHALLOWEST node
    add node.STATE to explored
    for each action in ACTIONS(node.STATE):
      child ← CHILD-NODE(problem, node, action)
      if child ∉ explored and ∉ frontier:
        if GOAL-TEST(child) then
          return SOLUTION(child)  ▷ stop on GENERATION
        INSERT(child, frontier)`,
py:`def bfs(arr, source, destination):
    if source == destination:
        return {source: None}, [source]
    visited = {source: None}       # node -> parent
    frontier = deque([source])     # QUEUE - FIFO
    while frontier:
        node = frontier.popleft()  # SHALLOWEST node (first in, first out)
        for child in range(len(arr)):
            if arr[node][child] > 0 and child not in visited:
                visited[child] = node
                if child == destination:   # test goal on GENERATION
                    return visited, reconstruct(visited, destination)
                frontier.append(child)
    return visited, []             # empty frontier -> no solution`,
note:'Complete; optimal with equal step costs. Time & space O(b^d) — remember, RAM gives out before the clock.'},
{
id:'DFS', name:'Depth-first search', vn:'Deepest first, dive then backtrack', frontier:'Stack (LIFO)', stop:'Stop when the goal is GENERATED',
pseudo:`function DFS(problem) returns solution / failure
  ▷ exactly like BFS, change just ONE line:
  frontier ← LIFO STACK containing node
  loop:
    node ← POP(frontier)          ▷ DEEPEST node (last in, first out)
    …the rest is identical to BFS…`,
py:`def dfs(arr, source, destination):
    if source == destination:
        return {source: None}, [source]
    visited = {source: None}
    frontier = [source]            # STACK - LIFO
    while frontier:
        node = frontier.pop()      # DEEPEST node (last in, first out)
        for child in reversed(range(len(arr))):  # reverse so smaller indices are popped first
            if arr[node][child] > 0 and child not in visited:
                visited[child] = node
                if child == destination:
                    return visited, reconstruct(visited, destination)
                frontier.append(child)
    return visited, []`,
note:'Not optimal; graph-search is complete in a finite space. O(bm) memory is what keeps it in the running.'},
{
id:'UCS', name:'Uniform-cost search', vn:'Cheapest g first (Dijkstra)', frontier:'Priority queue by g(n)', stop:'Stop when the goal is REMOVED',
pseudo:`function UCS(problem) returns solution / failure
  frontier ← PRIORITY QUEUE by g(n), containing the root node
  explored ← ∅
  loop:
    if EMPTY?(frontier) then return failure
    node ← POP(frontier)          ▷ smallest g
    if GOAL-TEST(node) then
      return SOLUTION(node)       ▷ stop on REMOVAL → optimal
    add node.STATE to explored
    for each action in ACTIONS(node.STATE):
      child ← CHILD-NODE(problem, node, action)
      if child ∉ explored and ∉ frontier:
        INSERT(child, frontier)
      else if child ∈ frontier with a higher PATH-COST:
        replace the old node with child    ▷ found a cheaper path`,
py:`def ucs(arr, source, destination):
    visited = {source: None}
    g = {source: 0}
    frontier = [(0, source)]       # PRIORITY QUEUE by g(n)
    expanded = set()
    while frontier:
        cost, node = heapq.heappop(frontier)  # smallest g
        if node == destination:    # test goal on REMOVAL -> optimal
            return visited, reconstruct(visited, destination)
        if node in expanded or cost > g[node]:
            continue               # outdated heap entry
        expanded.add(node)
        for child in range(len(arr)):
            w = arr[node][child]
            if w > 0 and child not in expanded:
                new_g = cost + w
                if new_g < g.get(child, float('inf')):
                    g[child] = new_g         # cheaper path -> update
                    visited[child] = node
                    heapq.heappush(frontier, (new_g, child))
    return visited, []`,
note:'Complete (steps ≥ ε) and OPTIMAL for any cost function. Watch the two common mistakes: stop on REMOVAL, and remember decrease-key.'},
{
id:'IDS', name:'Iterative deepening search', vn:'Iterative deepening (with DLS)', frontier:'Stack + increasing depth limit ℓ', stop:'Stop when the goal is GENERATED (inside DLS)',
pseudo:`function IDS(problem) returns solution / failure
  for depth = 0 to ∞ do
    result ← DLS(problem, depth)
    if result ≠ cutoff then return result

function DLS(problem, limit) returns solution / failure / cutoff
  return RECURSIVE-DLS(root node, problem, limit)

function RECURSIVE-DLS(node, problem, limit):
  if GOAL-TEST(node) then return SOLUTION(node)
  else if limit = 0 then return cutoff   ▷ limit reached
  else:
    cutoff? ← false
    for each action in ACTIONS(node.STATE):
      child ← CHILD-NODE(problem, node, action)
      result ← RECURSIVE-DLS(child, problem, limit − 1)
      if result = cutoff then cutoff? ← true
      else if result ≠ failure then return result
    return (cutoff? ? cutoff : failure)`,
py:`def dls(arr, source, destination, depth_limit):
    visited = {source: None}
    def recurse(node, depth):
        if node == destination:
            return True
        if depth == depth_limit:
            return False           # cutoff at the depth limit
        for child in range(len(arr)):
            if arr[node][child] > 0 and child not in visited:
                visited[child] = node
                if recurse(child, depth + 1):
                    return True
                del visited[child] # backtrack: remove node from the current path
        return False
    if recurse(source, 0):
        return visited, reconstruct(visited, destination)
    return visited, []

def ids(arr, source, destination):
    for depth_limit in range(len(arr)):  # l = 0, 1, 2, ... increasing
        visited, path = dls(arr, source, destination, depth_limit)
        if path:                   # solution at the SHALLOWEST depth
            return visited, path
    return {source: None}, []`,
note:'BFS completeness + optimality with DFS memory O(bd). Repeating the search sounds wasteful, but adds only ~11% when b=10.'},
{
id:'GBFS', name:'Greedy best-first search', vn:'Greedy by heuristic', frontier:'Priority queue by h(n)', stop:'Stop when the goal is GENERATED',
pseudo:`function GBFS(problem, h) returns solution / failure
  frontier ← PRIORITY QUEUE by h(n), containing the root node
  explored ← ∅
  loop:
    if EMPTY?(frontier) then return failure
    node ← POP(frontier)          ▷ smallest h: LOOKS closest to the goal
    add node.STATE to explored
    for each action in ACTIONS(node.STATE):
      child ← CHILD-NODE(problem, node, action)
      if child ∉ explored and ∉ frontier:
        if GOAL-TEST(child) then
          return SOLUTION(child)  ▷ stop on GENERATION
        INSERT(child, frontier)`,
py:`def gbfs(arr, source, destination, heuristic):
    if source == destination:
        return {source: None}, [source]
    visited = {source: None}
    frontier = [(heuristic[source], source)]  # PQ by h(n)
    expanded = set()
    while frontier:
        _, node = heapq.heappop(frontier)     # LOOKS closest to the goal
        if node in expanded:
            continue
        expanded.add(node)
        for child in range(len(arr)):
            if arr[node][child] > 0 and child not in visited:
                visited[child] = node
                if child == destination:      # stop on GENERATION (Lab convention)
                    return visited, reconstruct(visited, destination)
                heapq.heappush(frontier, (heuristic[child], child))
    return visited, []`,
note:'Fast but NOT optimal — it sees only the future (h), forgetting the past (g). Time & space O(b^m).'},
{
id:'ASTAR', name:'A* search (graph-search)', vn:'Balance g + h', frontier:'Priority queue by f = g + h', stop:'Stop when the goal is REMOVED',
pseudo:`function A-STAR(problem, h) returns solution / failure
  ▷ exactly like UCS, change only the sorting key:
  frontier ← PRIORITY QUEUE by f(n) = g(n) + h(n)
  loop:
    node ← POP(frontier)          ▷ smallest f
    if GOAL-TEST(node) then
      return SOLUTION(node)       ▷ stop on REMOVAL
    …expand and update as in UCS…
  ▷ h admissible  → optimal tree-search
  ▷ h consistent → optimal graph-search`,
py:`def astar(arr, source, destination, heuristic):
    visited = {source: None}
    g = {source: 0}
    frontier = [(heuristic[source], source)]  # PQ by f = g + h
    expanded = set()
    while frontier:
        f, node = heapq.heappop(frontier)     # smallest f
        if node == destination:    # stop on REMOVAL -> optimal (consistent h)
            return visited, reconstruct(visited, destination)
        if node in expanded:
            continue
        expanded.add(node)
        for child in range(len(arr)):
            w = arr[node][child]
            if w > 0 and child not in expanded:
                new_g = g[node] + w
                if new_g < g.get(child, float('inf')):
                    g[child] = new_g
                    visited[child] = node
                    heapq.heappush(frontier, (new_g + heuristic[child], child))
    return visited, []`,
note:'Optimal + optimally efficient with a consistent h — no optimal algorithm can expand fewer nodes.'},
{
id:'HC', name:'Hill-climbing (first-choice)', vn:'Hill climbing — first improving neighbor', frontier:'No frontier — keep only the current node', stop:'Stuck (no better neighbor) → treat as no solution',
pseudo:`function HILL-CLIMBING-FC(problem, h) returns solution / failure
  current ← INITIAL-STATE
  loop:
    if GOAL-TEST(current) then return SOLUTION
    neighbor ← FIRST neighbor with h(neighbor) < h(current)
    if no such neighbor exists then
      return failure              ▷ stuck at a local optimum
    current ← neighbor            ▷ climb immediately, never look back`,
py:`def hc(arr, source, destination, heuristic):
    visited = {source: None}
    node = source
    while node != destination:
        better = None
        for child in range(len(arr)):   # check neighbors in increasing index order
            if arr[node][child] > 0 and heuristic[child] < heuristic[node]:
                better = child          # first-choice: climb IMMEDIATELY on finding a better neighbor
                break
        if better is None:
            return visited, []          # stuck -> Lab convention: no path (-1)
        visited[better] = node
        node = better
    return visited, reconstruct(visited, destination)`,
note:'No frontier, no backtracking: O(1) memory, but it gets stuck easily. Session 4 (Local Search) tackles that.'}
];

export const MAIN_PY = `import time, tracemalloc
# ... paste functions reconstruct, bfs, dfs, ucs, dls, ids, gbfs, astar, hc here ...

def read_input(filename):
    with open(filename) as f:
        n = int(f.readline())
        source, destination = map(int, f.readline().split())
        arr = [list(map(int, f.readline().split())) for _ in range(n)]
        heuristic = list(map(int, f.readline().split()))
    return n, source, destination, arr, heuristic

def measure(fn, *args):
    tracemalloc.start()
    t0 = time.perf_counter()
    visited, path = fn(*args)
    elapsed = time.perf_counter() - t0
    _, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return path, elapsed, peak / 1024          # KB

if __name__ == "__main__":
    n, s, d, arr, h = read_input("input.txt")
    algos = [
        ("BFS", bfs, (arr, s, d)),
        ("DFS", dfs, (arr, s, d)),
        ("UCS", ucs, (arr, s, d)),
        ("IDS", ids, (arr, s, d)),
        ("GBFS", gbfs, (arr, s, d, h)),
        ("A*", astar, (arr, s, d, h)),
        ("Hill-climbing", hc, (arr, s, d, h)),
    ]
    with open("output.txt", "w") as out:
        for name, fn, args in algos:
            path, elapsed, peak_kb = measure(fn, *args)
            out.write(name + ":\\n")
            out.write("Path: " + (" -> ".join(map(str, path)) if path else "-1") + "\\n")
            out.write("Time: " + f"{elapsed:.7f}" + " seconds\\n")
            out.write("Memory: " + f"{peak_kb:.1f}" + " KB\\n\\n")`;

export const INPUT_EX = `6
0 5
0 2 3 0 0 0
2 0 0 3 4 0
3 0 0 0 2 0
0 3 0 0 0 4
0 4 2 0 0 3
0 0 0 4 3 0
6 4 4 3 2 0`;

export const OUTPUT_EX = `BFS:
Path: 0 -> 1 -> 3 -> 5
Time: 0.0000121 seconds
Memory: 1.2 KB

UCS:
Path: 0 -> 2 -> 4 -> 5
Time: 0.0000284 seconds
Memory: 1.4 KB
...`;
