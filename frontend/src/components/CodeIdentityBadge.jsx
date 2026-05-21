export default function CodeIdentityBadge({ detectedProblem }) {
  return (
    <div className="identity-badge">
      <span className="identity-badge__label">Detected pattern</span>
      <span className="identity-badge__value">{detectedProblem || 'Awaiting analysis'}</span>
    </div>
  );
}