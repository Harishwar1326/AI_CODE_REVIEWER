import { useEffect, useRef } from 'react';
import { languageOptions, getPrismLanguage } from '../utils/language.js';

export default function CodeInputPanel({ code, language, onCodeChange, onLanguageChange, fileName }) {
  const textareaRef = useRef(null);
  const selectedLanguage = getPrismLanguage(language);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(480, textareaRef.current.scrollHeight)}px`;
    }
  }, [code]);

  return (
    <section className="review-card code-input-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Code input</p>
          <h2>Paste code or upload a file</h2>
        </div>
        {fileName ? <span className="file-chip">{fileName}</span> : null}
      </div>

      <div className="code-input-toolbar">
        <label className="field-label" htmlFor="language-select">
          Language
        </label>
        <select id="language-select" className="language-select" value={language} onChange={(event) => onLanguageChange(event.target.value)}>
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="code-editor-shell">
        <textarea
          ref={textareaRef}
          className="code-editor-textarea"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          aria-label={`Code input for ${selectedLanguage}`}
          placeholder="Paste source code here..."
        />
      </div>
    </section>
  );
}