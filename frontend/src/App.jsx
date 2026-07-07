import { useState } from 'react';
import HeroSection      from './components/HeroSection';
import FileUploader     from './components/FileUploader';
import AudioPlayer      from './components/AudioPlayer';
import AnalyzeButton    from './components/AnalyzeButton';
import ResultsDashboard from './components/ResultsDashboard';
import { analyzeAudio } from './services/api';
import './index.css';

export default function App() {
  const [file,      setFile]      = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState(null);

  const handleFileSelect = (f) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzeAudio(file);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-bg" style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>

      {/* ── Thin top accent bar ───────────────────────────────────────────── */}
      <div style={{
        height: 6,
        background: 'linear-gradient(90deg, #F9E8A2, #B4E1EB, #95BDD7, #78A4CB)',
        borderBottom: '1px solid #111111',
      }} />

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '46rem',
        margin: '0 auto',
        padding: '0 1.25rem 6rem',
      }}>

        {/* Hero */}
        <HeroSection />

        {/* Upload card */}
        <div
          className="glass card-hover"
          style={{ padding: '1.75rem', marginBottom: '1.25rem' }}
        >
          <div className="section-label" style={{ marginBottom: '1.25rem' }}>
            Audio Source
          </div>

          <FileUploader file={file} onFileSelect={handleFileSelect} />

          {/* Audio player — conditional */}
          {file && (
            <div style={{ marginTop: '1rem' }}>
              <AudioPlayer file={file} />
            </div>
          )}

          {/* Divider */}
          <hr className="divider" style={{ margin: '1.5rem 0' }} />

          <AnalyzeButton
            onClick={handleAnalyze}
            isLoading={isLoading}
            disabled={!file}
          />
        </div>

        {/* Results */}
        {(result || error) && (
          <div style={{ marginTop: '0' }}>
            <ResultsDashboard result={result} error={error} />
          </div>
        )}
      </div>
    </div>
  );
}
