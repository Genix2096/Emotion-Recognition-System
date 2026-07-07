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

      {/* ── Ambient background orbs ───────────────────────────────────────── */}
      <div aria-hidden="true">
        <div className="amb-orb" style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          top: -160, left: -140,
          '--dur': '14s', '--delay': '0s',
        }} />
        <div className="amb-orb" style={{
          width: 380, height: 380,
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
          top: '30%', right: -100,
          '--dur': '18s', '--delay': '-6s',
        }} />
        <div className="amb-orb" style={{
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
          bottom: '10%', left: '20%',
          '--dur': '22s', '--delay': '-11s',
        }} />
      </div>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '42rem', margin: '0 auto', padding: '0 1rem 5rem' }}>

        {/* Hero */}
        <HeroSection />

        {/* Upload card */}
        <div className="glass" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            Upload Audio File
          </div>

          <FileUploader file={file} onFileSelect={handleFileSelect} />

          {/* Audio player — conditional */}
          {file && (
            <div style={{ marginTop: '1rem' }}>
              <AudioPlayer file={file} />
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '1.25rem 0' }} />

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
