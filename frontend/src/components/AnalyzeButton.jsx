export default function AnalyzeButton({ loading, disabled, onClick }) {
  return (
    <button className="analyze-button" type="button" onClick={onClick} disabled={disabled || loading}>
      {loading ? <span className="button-spinner" aria-hidden="true" /> : null}
      <span>{loading ? 'Analyzing...' : 'Analyze Code'}</span>
    </button>
  );
}