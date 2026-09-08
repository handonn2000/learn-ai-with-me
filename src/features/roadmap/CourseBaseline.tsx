import type { Course } from '@/content/types';
import { UI } from '@/content/ui';

export function CourseBaseline({ baseline }: { baseline: NonNullable<Course['baseline']> }) {
  return (
    <section className="course-baseline" aria-labelledby="course-baseline-heading">
      <h2 id="course-baseline-heading">{UI.plan.baseline}</h2>
      <div className="course-baseline-grid">
        <div className="card">
          <h3>{UI.plan.audience}</h3>
          <p>{baseline.audience}</p>
          <h3>{UI.plan.prerequisites}</h3>
          <ul>{baseline.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="card">
          <h3>{UI.plan.outcomes}</h3>
          <ul>{baseline.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>{UI.plan.pace}</h3>
          <p>{baseline.pace}</p>
        </div>
      </div>
      <details className="card course-plan-details">
        <summary>{UI.plan.scope} · {UI.plan.tools} · {UI.plan.completion}</summary>
        <h3>{UI.plan.scope}</h3><p>{baseline.scope}</p>
        <h3>{UI.plan.tools}</h3><p>{baseline.tools}</p>
        <h3>{UI.plan.completion}</h3><p>{baseline.completion}</p>
      </details>
    </section>
  );
}
