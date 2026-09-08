import type { Course } from '../../types';
import { dataEngineeringFoundation as VI } from './index';
import { curriculum } from './curriculum';

export const dataEngineeringFoundationEn: Course = {
  ...VI,
  topicLabels: {"def7.sources": "Data sources", "def7.cdc": "CDC", "def7.kafka": "Kafka and consumer groups", "def7.delivery": "Durability and delivery", "def7.retention": "Retention and Debezium"},
  org: 'Self-study notebook · DEF',
  subtitle: 'A proposed 12-week roadmap · 12 sessions · 4 parts · foundations to data pipelines',
  description: 'Getting a data file to work on your laptop is the starting point. I organized the 12 AIDE-01 / EDAI–FSDS slide decks into a path from Linux, Python, and SQL through ingestion, storage, batch/stream processing, consumption, and orchestration. Week 7 includes a bilingual Ingestion lesson, simulation labs, and a quiz; the other weeks remain course outlines.',
  baseline: {
    audience: 'You’re entering data engineering, or you already write Python/SQL and want to understand how the pieces form a pipeline. No previous AI course is required.',
    prerequisites: [
      'Be comfortable with folders, installing applications, and a text editor; have seen variables, conditions, and loops.',
      'Review arithmetic, sets, Boolean logic, and time intervals; no calculus or advanced statistics is required.',
      'Optional preparation before week 1: a terminal, a project folder, and basic Git. Tool versions will be chosen during lab authoring.',
    ],
    outcomes: [
      'Package a Python task with parameters, isolated dependencies, and explicit error handling.',
      'Model records, query them with SQL, and explain API, testing, and container boundaries.',
      'Trace data through ingestion, storage, batch/stream processing, and analytical serving models.',
      'Design a workflow with quality checks, repeatable reruns, and recovery after a task fails.',
    ],
    pace: '12 proposed weeks, approximately 72–96 hours total. One session per week; weeks 3, 9, 10, and 12 need more time. You can spread each week across 2 calendar weeks. These are self-study estimates, not durations specified by the slides.',
    scope: 'This version defines outcomes, prerequisites, learning order, and proposed practice milestones. Week 7 has a lesson, simulation labs, and a quiz. Other detailed lessons and course tests are not created yet. Advanced Kubernetes, cloud operations, and ML training are outside the required scope.',
    tools: 'Tool progression: Linux/Bash → Python/SQL → APIs/pytest/Docker → Kafka/Debezium → Spark/Flink → Airflow and data quality. Alternative tools are comparison topics; you don’t need to deploy everything at once.',
    completion: 'End-of-course target: design a synthetic orders/customers pipeline with reconciled output, a history policy, quality gates, and a recovery plan. Start with batch; add a small streaming example as an extension. This is a proposed brief, not an implemented assignment.',
  },
  ...curriculum('en'),
};
