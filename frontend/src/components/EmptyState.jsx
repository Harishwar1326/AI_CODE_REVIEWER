export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {'</>'}
      </div>
      <h3>Submit code to generate a structured review</h3>
      <p>Paste code, upload a .py, .c, .java, or .cpp file, then run analysis to see bugs, future risk, team perspectives, and improvements.</p>
    </div>
  );
}