import { useEffect, useMemo, useState } from 'react';

const roleOrder = [
  'Senior Engineer',
  'Security Engineer',
  'Performance Engineer',
  'Beginner Developer',
  'Production Reliability Engineer',
];

function sortPerspectives(perspectives = []) {
  return [...perspectives].sort((left, right) => {
    return roleOrder.indexOf(left.role) - roleOrder.indexOf(right.role);
  });
}

export default function PerspectivePanel({ perspectives }) {
  const sortedPerspectives = useMemo(() => sortPerspectives(perspectives), [perspectives]);
  const [activeRole, setActiveRole] = useState(sortedPerspectives[0]?.role || roleOrder[0]);

  useEffect(() => {
    if (sortedPerspectives.length) {
      const firstRole = sortedPerspectives[0].role;
      setActiveRole((currentRole) =>
        sortedPerspectives.some((perspective) => perspective.role === currentRole)
          ? currentRole
          : firstRole,
      );
    }
  }, [sortedPerspectives]);

  if (!sortedPerspectives.length) {
    return null;
  }

  const activePerspective = sortedPerspectives.find((perspective) => perspective.role === activeRole) || sortedPerspectives[0];

  return (
    <section className="review-card perspective-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Parallel developer minds</p>
          <h2>How different engineers would review this code</h2>
        </div>
        <span className="muted-chip">5 simulated viewpoints</span>
      </div>

      <div className="perspective-tabs" role="tablist" aria-label="Developer perspectives">
        {sortedPerspectives.map((perspective) => (
          <button
            key={perspective.role}
            type="button"
            className={`perspective-tab ${activeRole === perspective.role ? 'perspective-tab--active' : ''}`}
            onClick={() => setActiveRole(perspective.role)}
          >
            {perspective.role}
          </button>
        ))}
      </div>

      <article className="perspective-detail">
        <div className="perspective-detail__head">
          <div>
            <p className="section-kicker">{activePerspective.focus}</p>
            <h3>{activePerspective.role}</h3>
          </div>
        </div>
        <p className="summary-text">{activePerspective.summary}</p>
        <div className="chip-row">
          {activePerspective.findings.map((finding) => (
            <span className="mini-chip" key={finding}>{finding}</span>
          ))}
        </div>
        <p className="perspective-detail__recommendation">{activePerspective.recommendation}</p>
      </article>
    </section>
  );
}