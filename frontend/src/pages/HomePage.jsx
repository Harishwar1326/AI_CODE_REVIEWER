import { useState } from 'react';
import AnalyzeButton from '../components/AnalyzeButton.jsx';
import CodeIdentityBadge from '../components/CodeIdentityBadge.jsx';
import CodeInputPanel from '../components/CodeInputPanel.jsx';
import CodeSummaryCard from '../components/CodeSummaryCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FileUploadZone from '../components/FileUploadZone.jsx';
import IssueList from '../components/IssueList.jsx';
import PerspectivePanel from '../components/PerspectivePanel.jsx';
import PredictiveIntelligencePanel from '../components/PredictiveIntelligencePanel.jsx';
import PredictiveWorkspaceStrip from '../components/PredictiveWorkspaceStrip.jsx';
import SuggestionPanel from '../components/SuggestionPanel.jsx';
import useReview from '../hooks/useReview.js';

export default function HomePage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [fileName, setFileName] = useState('');
  const [localMessage, setLocalMessage] = useState('');
  const { review, loading, error, analyze, clearReview } = useReview();

  async function handleAnalyze() {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setLocalMessage('Add code before starting a review.');
      return;
    }

    setLocalMessage('');
    await analyze({ code: trimmedCode, language, fileName });
  }

  function handleFileLoaded(result) {
    clearReview();

    if (result.error) {
      setLocalMessage(result.error);
      return;
    }

    setLocalMessage('');
    setCode(result.code || '');
    setLanguage(result.language || 'python');
    setFileName(result.fileName || '');
  }

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    clearReview();
  }

  function handleCodeChange(nextCode) {
    setCode(nextCode);
    clearReview();
  }

  const inlineMessage = localMessage || error;
  const hasReview = Boolean(review);

  return (
    <div className="app-shell">
      <div className="background-orb background-orb--one" aria-hidden="true" />
      <div className="background-orb background-orb--two" aria-hidden="true" />

      <header className="hero">
        <div>
          <p className="hero-kicker">AI-powered code quality review</p>
          <h1>Find bugs, security risks, and logic flaws before they ship.</h1>
          <p className="hero-copy">
            A production-focused reviewer that detects the coding pattern, explains the code in plain English, and returns actionable findings with structured severity.
          </p>
        </div>
        <div className="hero-meta">
          <span className="meta-chip">Python</span>
          <span className="meta-chip">C</span>
          <span className="meta-chip">Java</span>
          <span className="meta-chip">C++</span>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="input-column">
          <CodeInputPanel
            code={code}
            language={language}
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            fileName={fileName}
          />

          <div className="action-stack">
            <AnalyzeButton loading={loading} disabled={!code.trim()} onClick={handleAnalyze} />
            <FileUploadZone onFileLoaded={handleFileLoaded} />
          </div>

          {hasReview ? <PredictiveWorkspaceStrip futureAnalysis={review.futureAnalysis} /> : null}

          {inlineMessage ? <div className="inline-message">{inlineMessage}</div> : null}
        </section>

        <section className="results-column">
          {hasReview ? (
            <div className="results-stack">
              <div className="review-card results-header">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">Review result</p>
                    <h2>{review.language || language}</h2>
                  </div>
                  <CodeIdentityBadge detectedProblem={review.detectedProblem} />
                </div>
              </div>

              <CodeSummaryCard summary={review.codeSummary} score={review.overallScore} />
              <PredictiveIntelligencePanel futureAnalysis={review.futureAnalysis} />
              <PerspectivePanel perspectives={review.perspectives} />
              <IssueList issues={review.issues} />
              <SuggestionPanel sourceCode={code} suggestions={review.suggestions} />
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </main>
    </div>
  );
}