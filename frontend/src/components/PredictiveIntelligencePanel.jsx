import SeverityBadge from './SeverityBadge.jsx';

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

export default function PredictiveIntelligencePanel({ futureAnalysis }) {
  if (!futureAnalysis) {
    return null;
  }

  const riskScore = Math.max(0, Math.min(100, futureAnalysis.riskMeter?.score ?? 0));
  const meterLabel = futureAnalysis.riskMeter?.label || 'Low';
  const meterSummary = futureAnalysis.riskMeter?.summary || 'No predictive assessment available.';
  const drivers = futureAnalysis.riskMeter?.drivers || [];
  const maintainability = futureAnalysis.maintainabilityForecast || {};
  const vulnerabilityForecast = futureAnalysis.vulnerabilityForecast || [];

  return (
    <section className="review-card predictive-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Predictive intelligence</p>
          <h2>Future bug evolution engine</h2>
        </div>
        <span className={riskClassName(meterLabel)}>{meterLabel} risk</span>
      </div>

      <div className="risk-meter">
        <div className="risk-meter__topline">
          <strong>Future Risk Meter</strong>
          <span>{riskScore}/100</span>
        </div>
        <div className="risk-meter__bar" aria-hidden="true">
          <span className="risk-meter__fill" style={{ width: `${riskScore}%` }} />
        </div>
        <p className="summary-text">{meterSummary}</p>
        {drivers.length ? (
          <div className="chip-row">
            {drivers.map((driver) => (
              <span className="mini-chip" key={driver}>{driver}</span>
            ))}
          </div>
        ) : null}
      </div>

      <article className="predictive-subcard">
        <div className="predictive-subcard__head">
          <h3>Maintainability Forecast</h3>
          <span className={riskClassName(maintainability.onboardingRisk || 'Low')}>{maintainability.onboardingRisk || 'Low'}</span>
        </div>
        <p>{maintainability.summary || 'No maintainability forecast available.'}</p>
        <p className="predictive-subcard__note">{maintainability.refactorTimeline || 'No refactor timeline suggested.'}</p>
      </article>

      {vulnerabilityForecast.length ? (
        <div className="vulnerability-forecast">
          <div className="predictive-subcard__head">
            <h3>Future Vulnerability Forecast</h3>
            <span className="muted-chip">Expansion risks</span>
          </div>
          <div className="issue-stack">
            {vulnerabilityForecast.map((item, index) => (
              <article className="forecast-card" key={`${item.title}-${index}`}>
                <div className="forecast-card__head">
                  <SeverityBadge severity={item.severity} />
                  <strong>{item.title}</strong>
                  <span className="issue-line">{item.horizon}</span>
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}