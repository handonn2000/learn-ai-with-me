// Dữ liệu Code Lab — Buổi 3 (CSC14003 Lab 1: Searching)
// Mỗi thuật toán: pseudo-code + Python (đúng khung main.py của Lab 1)

export const HELPER_PY = `import heapq
from collections import deque

def reconstruct(visited, destination):
    """Lần ngược con trỏ cha (parent) để dựng lại đường đi."""
    path = [destination]
    while visited[path[-1]] is not None:
        path.append(visited[path[-1]])
    return path[::-1]`;

export const ALGOS = [
{
id:'BFS', name:'Breadth-first search', vn:'Tìm theo chiều rộng', frontier:'Queue (FIFO)', stop:'Dừng khi đích được SINH RA',
pseudo:`function BFS(problem) returns solution / failure
  node ← nút(INITIAL-STATE, PATH-COST = 0)
  if GOAL-TEST(node) then return SOLUTION(node)
  frontier ← FIFO QUEUE chứa node
  explored ← ∅
  loop:
    if EMPTY?(frontier) then return failure
    node ← POP(frontier)          ▷ node NÔNG nhất
    thêm node.STATE vào explored
    for each action in ACTIONS(node.STATE):
      child ← CHILD-NODE(problem, node, action)
      if child ∉ explored và ∉ frontier:
        if GOAL-TEST(child) then
          return SOLUTION(child)  ▷ dừng khi SINH RA
        INSERT(child, frontier)`,
py:`def bfs(arr, source, destination):
    if source == destination:
        return {source: None}, [source]
    visited = {source: None}       # node -> cha (parent)
    frontier = deque([source])     # QUEUE - FIFO
    while frontier:
        node = frontier.popleft()  # node NÔNG nhất (vào trước ra trước)
        for child in range(len(arr)):
            if arr[node][child] > 0 and child not in visited:
                visited[child] = node
                if child == destination:   # kiểm tra đích khi SINH RA
                    return visited, reconstruct(visited, destination)
                frontier.append(child)
    return visited, []             # hết frontier -> vô nghiệm`,
note:'Đầy đủ; tối ưu khi mọi bước cùng giá. Time & space O(b^d) — nhớ là RAM chết trước đồng hồ.'},
{
id:'DFS', name:'Depth-first search', vn:'Tìm theo chiều sâu', frontier:'Stack (LIFO)', stop:'Dừng khi đích được SINH RA',
pseudo:`function DFS(problem) returns solution / failure
  ▷ giống hệt BFS, chỉ đổi MỘT dòng:
  frontier ← LIFO STACK chứa node
  loop:
    node ← POP(frontier)          ▷ node SÂU nhất (vào sau ra trước)
    …phần còn lại y hệt BFS…`,
py:`def dfs(arr, source, destination):
    if source == destination:
        return {source: None}, [source]
    visited = {source: None}
    frontier = [source]            # STACK - LIFO
    while frontier:
        node = frontier.pop()      # node SÂU nhất (vào sau ra trước)
        for child in reversed(range(len(arr))):  # đảo chiều để pop ra chỉ số nhỏ trước
            if arr[node][child] > 0 and child not in visited:
                visited[child] = node
                if child == destination:
                    return visited, reconstruct(visited, destination)
                frontier.append(child)
    return visited, []`,
note:'Không tối ưu; bản graph-search thì đầy đủ trên không gian hữu hạn. Nó sống được là nhờ bộ nhớ O(bm).'},
{
id:'UCS', name:'Uniform-cost search', vn:'Chi phí đồng nhất (Dijkstra)', frontier:'Priority queue theo g(n)', stop:'Dừng khi đích được LẤY RA',
pseudo:`function UCS(problem) returns solution / failure
  frontier ← PRIORITY QUEUE theo g(n), chứa nút gốc
  explored ← ∅
  loop:
    if EMPTY?(frontier) then return failure
    node ← POP(frontier)          ▷ g NHỎ nhất
    if GOAL-TEST(node) then
      return SOLUTION(node)       ▷ dừng khi LẤY RA → tối ưu
    thêm node.STATE vào explored
    for each action in ACTIONS(node.STATE):
      child ← CHILD-NODE(problem, node, action)
      if child ∉ explored và ∉ frontier:
        INSERT(child, frontier)
      else if child ∈ frontier với PATH-COST cao hơn:
        thay nút cũ bằng child    ▷ tìm được đường rẻ hơn`,
py:`def ucs(arr, source, destination):
    visited = {source: None}
    g = {source: 0}
    frontier = [(0, source)]       # PRIORITY QUEUE theo g(n)
    expanded = set()
    while frontier:
        cost, node = heapq.heappop(frontier)  # g nhỏ nhất
        if node == destination:    # kiểm tra đích khi LẤY RA -> tối ưu
            return visited, reconstruct(visited, destination)
        if node in expanded or cost > g[node]:
            continue               # bản ghi cũ trong heap đã lỗi thời
        expanded.add(node)
        for child in range(len(arr)):
            w = arr[node][child]
            if w > 0 and child not in expanded:
                new_g = cost + w
                if new_g < g.get(child, float('inf')):
                    g[child] = new_g         # đường rẻ hơn -> cập nhật
                    visited[child] = node
                    heapq.heappush(frontier, (new_g, child))
    return visited, []`,
note:'Đầy đủ (bước ≥ ε) và TỐI ƯU với mọi hàm chi phí. Để ý hai chỗ dễ sai: dừng khi LẤY RA, và nhớ decrease-key.'},
{
id:'IDS', name:'Iterative deepening search', vn:'Sâu dần từng nấc (kèm DLS)', frontier:'Stack + giới hạn ℓ tăng dần', stop:'Dừng khi đích được SINH RA (trong DLS)',
pseudo:`function IDS(problem) returns solution / failure
  for depth = 0 to ∞ do
    result ← DLS(problem, depth)
    if result ≠ cutoff then return result

function DLS(problem, limit) returns solution / failure / cutoff
  return RECURSIVE-DLS(nút gốc, problem, limit)

function RECURSIVE-DLS(node, problem, limit):
  if GOAL-TEST(node) then return SOLUTION(node)
  else if limit = 0 then return cutoff   ▷ chạm giới hạn
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
            return False           # cắt (cutoff) tại giới hạn
        for child in range(len(arr)):
            if arr[node][child] > 0 and child not in visited:
                visited[child] = node
                if recurse(child, depth + 1):
                    return True
                del visited[child] # quay lui: nhả node khỏi nhánh hiện tại
        return False
    if recurse(source, 0):
        return visited, reconstruct(visited, destination)
    return visited, []

def ids(arr, source, destination):
    for depth_limit in range(len(arr)):  # l = 0, 1, 2, ... tăng dần
        visited, path = dls(arr, source, destination, depth_limit)
        if path:                   # nghiệm ở độ sâu NÔNG nhất
            return visited, path
    return {source: None}, []`,
note:'Lấy tính đầy đủ + tối ưu của BFS, lấy bộ nhớ O(bd) của DFS. Duyệt lại nghe phí mà chỉ đội ~11% khi b=10.'},
{
id:'GBFS', name:'Greedy best-first search', vn:'Tham lam theo heuristic', frontier:'Priority queue theo h(n)', stop:'Dừng khi đích được SINH RA',
pseudo:`function GBFS(problem, h) returns solution / failure
  frontier ← PRIORITY QUEUE theo h(n), chứa nút gốc
  explored ← ∅
  loop:
    if EMPTY?(frontier) then return failure
    node ← POP(frontier)          ▷ h NHỎ nhất: TRÔNG gần đích nhất
    thêm node.STATE vào explored
    for each action in ACTIONS(node.STATE):
      child ← CHILD-NODE(problem, node, action)
      if child ∉ explored và ∉ frontier:
        if GOAL-TEST(child) then
          return SOLUTION(child)  ▷ dừng khi SINH RA
        INSERT(child, frontier)`,
py:`def gbfs(arr, source, destination, heuristic):
    if source == destination:
        return {source: None}, [source]
    visited = {source: None}
    frontier = [(heuristic[source], source)]  # PQ theo h(n)
    expanded = set()
    while frontier:
        _, node = heapq.heappop(frontier)     # TRÔNG gần đích nhất
        if node in expanded:
            continue
        expanded.add(node)
        for child in range(len(arr)):
            if arr[node][child] > 0 and child not in visited:
                visited[child] = node
                if child == destination:      # dừng khi SINH RA (quy ước Lab)
                    return visited, reconstruct(visited, destination)
                heapq.heappush(frontier, (heuristic[child], child))
    return visited, []`,
note:'Nhanh nhưng KHÔNG tối ưu — nó chỉ nhìn tương lai (h) và quên sạch quá khứ (g). Time & space O(b^m).'},
{
id:'ASTAR', name:'A* search (graph-search)', vn:'Cân bằng g + h', frontier:'Priority queue theo f = g + h', stop:'Dừng khi đích được LẤY RA',
pseudo:`function A-STAR(problem, h) returns solution / failure
  ▷ giống hệt UCS, chỉ đổi khóa sắp xếp:
  frontier ← PRIORITY QUEUE theo f(n) = g(n) + h(n)
  loop:
    node ← POP(frontier)          ▷ f NHỎ nhất
    if GOAL-TEST(node) then
      return SOLUTION(node)       ▷ dừng khi LẤY RA
    …mở rộng và cập nhật như UCS…
  ▷ h admissible  → tree-search tối ưu
  ▷ h consistent → graph-search tối ưu`,
py:`def astar(arr, source, destination, heuristic):
    visited = {source: None}
    g = {source: 0}
    frontier = [(heuristic[source], source)]  # PQ theo f = g + h
    expanded = set()
    while frontier:
        f, node = heapq.heappop(frontier)     # f nhỏ nhất
        if node == destination:    # dừng khi LẤY RA -> tối ưu (h consistent)
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
note:'Tối ưu + optimally efficient khi h consistent — không thuật toán tối ưu nào mở ít node hơn nó được.'},
{
id:'HC', name:'Hill-climbing (first-choice)', vn:'Leo đồi — chọn kề tốt hơn đầu tiên', frontier:'Không có frontier — chỉ giữ node hiện tại', stop:'Kẹt (không kề nào tốt hơn) → coi như vô nghiệm',
pseudo:`function HILL-CLIMBING-FC(problem, h) returns solution / failure
  current ← INITIAL-STATE
  loop:
    if GOAL-TEST(current) then return SOLUTION
    neighbor ← kề ĐẦU TIÊN có h(neighbor) < h(current)
    if không tồn tại neighbor như vậy then
      return failure              ▷ kẹt cực trị địa phương
    current ← neighbor            ▷ leo ngay, không ngoái lại`,
py:`def hc(arr, source, destination, heuristic):
    visited = {source: None}
    node = source
    while node != destination:
        better = None
        for child in range(len(arr)):   # xét kề theo chỉ số tăng dần
            if arr[node][child] > 0 and heuristic[child] < heuristic[node]:
                better = child          # first-choice: gặp kề tốt hơn là leo NGAY
                break
        if better is None:
            return visited, []          # kẹt -> Lab quy ước: không có đường (-1)
        visited[better] = node
        node = better
    return visited, reconstruct(visited, destination)`,
note:'Không frontier, không quay lui: bộ nhớ O(1) mà kẹt như chơi. Buổi 4 (Local Search) sẽ chữa cho nó.'}
];

export const MAIN_PY = `import time, tracemalloc
# ... dán các hàm reconstruct, bfs, dfs, ucs, dls, ids, gbfs, astar, hc vào đây ...

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
