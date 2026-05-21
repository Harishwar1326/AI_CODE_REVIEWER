const severityClassNames = {
  Critical: 'severity-critical',
  Warning: 'severity-warning',
  Info: 'severity-info',
};

export default function SeverityBadge({ severity }) {
  return <span className={`severity-badge ${severityClassNames[severity] || 'severity-info'}`}>{severity}</span>;
}