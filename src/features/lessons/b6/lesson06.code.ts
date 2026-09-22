const HELPERS = `import math
import random


def h(q):
    return sum(q[i] == q[j] or abs(q[i] - q[j]) == j - i
               for i in range(len(q)) for j in range(i + 1, len(q)))


def neighbors(q):
    for col in range(len(q)):
        for row in range(1, len(q) + 1):
            if row != q[col]:
                yield q[:col] + [row] + q[col + 1:]

`;
export const PYTHON = [
  HELPERS + `
def hill_climbing(initial):
    current = initial[:]
    while h(current) != 0:
        best = min(neighbors(current), key=h, default=current)
        if h(best) >= h(current):
            break
        current = best
    return current


if __name__ == "__main__":
    result = hill_climbing([8, 3, 7, 4, 2, 5, 1, 6])
    print(result, h(result))
`,
  HELPERS + `
def anneal(initial, seed=42, trials=2000, temperature=10.0):
    rng = random.Random(seed)
    current = initial[:]
    best = current[:]
    n = len(current)
    if n < 2:
        return best, current
    for t in range(trials):
        T = temperature * (0.995 ** t)
        if T <= 0 or h(best) == 0:
            break
        col = rng.randrange(n)
        row = rng.choice([r for r in range(1, n + 1)
                          if r != current[col]])
        candidate = current[:]
        candidate[col] = row
        delta = h(candidate) - h(current)
        if delta <= 0 or rng.random() < math.exp(-delta / T):
            current = candidate
        if h(current) < h(best):
            best = current[:]
    return best, current


if __name__ == "__main__":
    best, current = anneal([8, 3, 7, 4, 2, 5, 1, 6])
    print("best:", best, h(best))
    print("current:", current, h(current))
`,
  HELPERS + `
def genetic(n=8, size=20, generations=200, mutation=0.05, seed=42):
    if n < 2 or size < 2 or not 0 <= mutation <= 1:
        raise ValueError("n >= 2, size >= 2, 0 <= mutation <= 1")
    rng = random.Random(seed)
    population = [[rng.randint(1, n) for _ in range(n)]
                  for _ in range(size)]
    best = min(population, key=h)[:]
    max_pairs = n * (n - 1) // 2
    for _ in range(generations):
        if h(best) == 0:
            break
        weights = [max_pairs - h(q) for q in population]
        if sum(weights) == 0:
            weights = [1] * size
        new_population = []
        for _ in range(size):
            a, b = rng.choices(population, weights=weights, k=2)
            cut = rng.randrange(1, n)
            child = a[:cut] + b[cut:]
            for col in range(n):
                if rng.random() < mutation:
                    child[col] = rng.choice([r for r in range(1, n + 1)
                                             if r != child[col]])
            new_population.append(child)
        population = new_population
        candidate = min(population, key=h)
        if h(candidate) < h(best):
            best = candidate[:]
    return best


if __name__ == "__main__":
    result = genetic()
    print(result, h(result))
`,
];
