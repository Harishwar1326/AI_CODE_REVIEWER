import { buildLineDiff } from '../utils/diff.js';

export default function SuggestionPanel({ sourceCode, suggestions }) {
  const needed = Boolean(suggestions?.needed);
  const explanation = suggestions?.explanation || (needed ? 'An improved version is available.' : 'No code changes are needed.');
  const improvedCode = suggestions?.improvedCode || '';
  const diffLines = needed && improvedCode ? buildLineDiff(sourceCode || '', improvedCode) : [];

  return (
    <section className="review-card suggestion-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Suggestions</p>
          <h2>Improvement guidance</h2>
        </div>
        <span className={`score-pill ${needed ? 'score-pill--warning' : 'score-pill--success'}`}>{needed ? 'Refactor recommended' : 'No change needed'}</span>
      </div>

      <p className="summary-text">{explanation}</p>

      {needed && improvedCode ? (
        <div className="diff-view">
          {diffLines.map((line, index) => (
            <div className={`diff-line diff-line--${line.type}`} key={`${line.type}-${index}`}>
              <span className="diff-marker">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
              <pre>{line.text || ' '}</pre>
            </div>
          ))}
        </div>
      ) : (
        <div className="diff-view diff-view--empty">
          <p className="muted-copy">The reviewer did not find a better implementation worth replacing the current code with.</p>
        </div>
      )}
    </section>
  );
}