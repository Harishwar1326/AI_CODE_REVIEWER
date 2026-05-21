function riskClassName(risk) {
  const normalized = String(risk || '').toLowerCase();

  if (normalized === 'critical') {
    return 'risk-pill risk-pill--critical';
  }

  if (normalized === 'high') {
    return 'risk-pill risk-pill--high';
  }

  if (normalized === 'moderate') {
    return 'risk-pill risk-pill--moderate';
  }

  return 'risk-pill risk-pill--low';
}

export default function PredictiveWorkspaceStrip({ futureAnalysis }) {
  if (!futureAnalysis) {
    return null;
  }

  const timeline = futureAnalysis.technicalDebtTimeline || [];
  const heatmap = futureAnalysis.scalabilityHeatmap || [];

  return (
    <section className="review-card workspace-strip-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Workspace signals</p>
          <h2>Scalability heatmap and debt timeline</h2>
        </div>
        <span className="muted-chip">Under input area</span>
      </div>

      <div className="workspace-strip-grid">
        <article className="workspace-strip-block">
          <div className="predictive-subcard__head">
            <h3>Scalability Heatmap</h3>
            <span className="muted-chip">Growth pressure</span>
          </div>
          <div className="heatmap-grid">
            {heatmap.map((item) => (
              <div className="heatmap-tile" key={item.area}>
                <div className="heatmap-tile__head">
                  <strong>{item.area}</strong>
                  <span className={riskClassName(item.risk)}>{item.risk}</span>
                </div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="workspace-strip-block">
          <div className="predictive-subcard__head">
            <h3>Technical Debt Timeline</h3>
            <span className="muted-chip">Forecasted failure points</span>
          </div>
          <div className="timeline-list timeline-list--compact">
            {timeline.map((entry) => (
              <div className="timeline-item timeline-item--compact" key={`${entry.horizon}-${entry.title}`}>
                <div className="timeline-item__badge">
                  <span>{entry.horizon}</span>
                  <span className={riskClassName(entry.risk)}>{entry.risk}</span>
                </div>
                <div>
                  <strong>{entry.title}</strong>
                  <p>{entry.description}</p>
                  <span className="timeline-item__action">Action: {entry.action}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}