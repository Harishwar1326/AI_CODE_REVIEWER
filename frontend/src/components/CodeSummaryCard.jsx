export default function CodeSummaryCard({ summary, score }) {
  return (
    <section className="review-card summary-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Code summary</p>
          <h2>What the code does</h2>
        </div>
        <span className="score-pill">Score {typeof score === 'number' ? score : '--'}/100</span>
      </div>
      <p className="summary-text">{summary || 'No summary available yet.'}</p>
    </section>
  );
}