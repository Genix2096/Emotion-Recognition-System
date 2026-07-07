import { useEffect, useRef, useState } from 'react';

/* Cycling status messages shown while loading */
const LOADING_TEXTS = [
  'Reading audio stream…',
  'Framing signal windows…',
  'Extracting MFCC features…',
  'Computing chroma vectors…',
  'Analyzing mel spectrogram…',
  'Running SVM classifier…',
  'Aggregating probabilities…',
];

function MicIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="8"  y1="22" x2="16" y2="22"/>
    </svg>
  );
}

export default function AnalyzeButton({ onClick, isLoading, disabled }) {
  const [textIdx, setTextIdx] = useState(0);
  const timerRef = useRef(null);

  /* Cycle status messages during loading */
  useEffect(() => {
    if (isLoading) {
      setTextIdx(0);
      timerRef.current = setInterval(() => {
        setTextIdx((i) => (i + 1) % LOADING_TEXTS.length);
      }, 1600);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isLoading]);

  const isReady    = !disabled && !isLoading;
  const btnClass   = ['analyze-btn', isReady ? 'ready' : ''].join(' ');

  return (
    <button
      id="analyze-button"
      className={btnClass}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-label={isLoading ? LOADING_TEXTS[textIdx] : 'Analyze Emotion'}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
        {isLoading ? (
          <>
            <span className="spinner" />
            <span
              key={textIdx}
              style={{
                animation: 'fadeSlideUp 0.35s ease both',
                fontSize: '0.875rem',
              }}
            >
              {LOADING_TEXTS[textIdx]}
            </span>
          </>
        ) : (
          <>
            <MicIcon />
            <span>Analyze Emotion</span>
          </>
        )}
      </span>
    </button>
  );
}
