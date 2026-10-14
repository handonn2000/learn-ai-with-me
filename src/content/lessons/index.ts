import type { Lesson } from '@/learning/types'
import { lesson as formulate } from './formulate'
import { lesson as stateGraph } from './state-graph'
import { lesson as frontier } from './frontier'
import { lesson as graphSearch } from './graph-search'
import { lesson as priorityQueue } from './priority-queue'
import { lesson as ucs } from './ucs'
import { lesson as heuristic } from './heuristic'
import { lesson as astar } from './astar'
import { lesson as admissible } from './admissible'
import { lesson as agent } from './agent'
import { lesson as rationality } from './rationality'
import { lesson as peas } from './peas'
import { lesson as envDims } from './env-dims'
import { lesson as envClassify } from './env-classify'

export const lessons: Record<string, Lesson> = Object.fromEntries(
  [formulate, stateGraph, frontier, graphSearch, priorityQueue, ucs, heuristic, astar, admissible, agent, rationality, peas, envDims, envClassify].map((l) => [l.id, l]),
)
