import { useRef, useState } from 'react';
import { inferLanguageFromFileName } from '../utils/language.js';

const acceptedExtensions = '.py,.c,.java,.cpp';

export default function FileUploadZone({ onFileLoaded }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file) {
    if (!file) {
      return;
    }

    const fileName = file.name || '';
    const lowerName = fileName.toLowerCase();
    const validFile = lowerName.endsWith('.py') || lowerName.endsWith('.c') || lowerName.endsWith('.java') || lowerName.endsWith('.cpp');

    if (!validFile) {
      onFileLoaded({ error: 'Unsupported file type. Use .py, .c, .java, or .cpp.' });
      return;
    }

    const code = await file.text();
    onFileLoaded({
      code,
      language: inferLanguageFromFileName(fileName),
      fileName,
    });
  }

  return (
    <div
      className={`upload-zone ${isDragging ? 'upload-zone--active' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          inputRef.current?.click();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={async (event) => {
        event.preventDefault();
        setIsDragging(false);
        await handleFile(event.dataTransfer.files?.[0]);
      }}
    >
      <input
        ref={inputRef}
        className="upload-zone__input"
        type="file"
        accept={acceptedExtensions}
        onChange={async (event) => {
          await handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      <p className="upload-zone__title">Drag and drop a file here or click to upload</p>
      <p className="upload-zone__subtitle">Supports .py, .c, .java, and .cpp files.</p>
    </div>
  );
}