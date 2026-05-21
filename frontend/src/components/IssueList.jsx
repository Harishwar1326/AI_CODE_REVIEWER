import SeverityBadge from './SeverityBadge.jsx';

const severityOrder = {
  Critical: 0,
  Warning: 1,
  Info: 2,
};

export default function IssueList({ issues }) {
  const sortedIssues = [...(issues || [])].sort((left, right) => {
    return (severityOrder[left.severity] ?? 3) - (severityOrder[right.severity] ?? 3);
  });

  return (
    <section className="review-card issue-list-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Issues</p>
          <h2>Actionable findings</h2>
        </div>
        <span className="score-pill">{sortedIssues.length} item{sortedIssues.length === 1 ? '' : 's'}</span>
      </div>

      {sortedIssues.length === 0 ? (
        <p className="muted-copy">No issues were reported for this submission.</p>
      ) : (
        <div className="issue-stack">
          {sortedIssues.map((issue, index) => (
            <details className="issue-card" key={`${issue.title}-${index}`}>
              <summary>
                <div className="issue-summary-copy">
                  <SeverityBadge severity={issue.severity} />
                  <strong>{issue.title}</strong>
                </div>
                <span className="issue-line">{issue.lineNumber ? `Line ${issue.lineNumber}` : 'Line not specified'}</span>
              </summary>
              <p>{issue.description}</p>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}