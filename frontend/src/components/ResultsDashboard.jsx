import { useEffect, useState } from 'react';

/* ── Emotion → deep visual theme ─────────────────────────────────────────── */
const THEMES = {
  HAPPY:     {
    color: '#f59e0b', glow: 'rgba(245,158,11,0.55)', bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.3)', shadow: '0 0 60px rgba(245,158,11,0.18)',
    barGrad: 'linear-gradient(90deg,#d97706,#f59e0b)', barGlow: 'rgba(245,158,11,0.55)',
    emoji: '😊', label: 'Happy',
  },
  SAD:       {
    color: '#60a5fa', glow: 'rgba(96,165,250,0.55)', bg: 'rgba(59,130,246,0.07)',
    border: 'rgba(59,130,246,0.3)', shadow: '0 0 60px rgba(59,130,246,0.18)',
    barGrad: 'linear-gradient(90deg,#2563eb,#60a5fa)', barGlow: 'rgba(96,165,250,0.55)',
    emoji: '😢', label: 'Sad',
  },
  ANGRY:     {
    color: '#f87171', glow: 'rgba(248,113,113,0.55)', bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.3)', shadow: '0 0 60px rgba(239,68,68,0.18)',
    barGrad: 'linear-gradient(90deg,#dc2626,#f87171)', barGlow: 'rgba(248,113,113,0.55)',
    emoji: '😠', label: 'Angry',
  },
  CALM:      {
    color: '#818cf8', glow: 'rgba(129,140,248,0.55)', bg: 'rgba(99,102,241,0.07)',
    border: 'rgba(99,102,241,0.3)', shadow: '0 0 60px rgba(99,102,241,0.18)',
    barGrad: 'linear-gradient(90deg,#4f46e5,#818cf8)', barGlow: 'rgba(129,140,248,0.55)',
    emoji: '😌', label: 'Calm',
  },
  NEUTRAL:   {
    color: '#818cf8', glow: 'rgba(129,140,248,0.55)', bg: 'rgba(99,102,241,0.07)',
    border: 'rgba(99,102,241,0.3)', shadow: '0 0 60px rgba(99,102,241,0.18)',
    barGrad: 'linear-gradient(90deg,#4f46e5,#818cf8)', barGlow: 'rgba(129,140,248,0.55)',
    emoji: '😐', label: 'Neutral',
  },
  FEARFUL:   {
    color: '#c084fc', glow: 'rgba(192,132,252,0.55)', bg: 'rgba(139,92,246,0.07)',
    border: 'rgba(139,92,246,0.3)', shadow: '0 0 60px rgba(139,92,246,0.22)',
    barGrad: 'linear-gradient(90deg,#7c3aed,#c084fc)', barGlow: 'rgba(192,132,252,0.55)',
    emoji: '😨', label: 'Fearful',
  },
  FEAR:      {
    color: '#c084fc', glow: 'rgba(192,132,252,0.55)', bg: 'rgba(139,92,246,0.07)',
    border: 'rgba(139,92,246,0.3)', shadow: '0 0 60px rgba(139,92,246,0.22)',
    barGrad: 'linear-gradient(90deg,#7c3aed,#c084fc)', barGlow: 'rgba(192,132,252,0.55)',
    emoji: '😨', label: 'Fear',
  },
  DISGUST:   {
    color: '#34d399', glow: 'rgba(52,211,153,0.55)', bg: 'rgba(16,185,129,0.07)',
    border: 'rgba(16,185,129,0.3)', shadow: '0 0 60px rgba(16,185,129,0.18)',
    barGrad: 'linear-gradient(90deg,#059669,#34d399)', barGlow: 'rgba(52,211,153,0.55)',
    emoji: '🤢', label: 'Disgust',
  },
  SURPRISED: {
    color: '#fb923c', glow: 'rgba(251,146,60,0.55)', bg: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.3)', shadow: '0 0 60px rgba(249,115,22,0.18)',
    barGrad: 'linear-gradient(90deg,#ea580c,#fb923c)', barGlow: 'rgba(251,146,60,0.55)',
    emoji: '😲', label: 'Surprised',
  },
  SURPRISE:  {
    color: '#fb923c', glow: 'rgba(251,146,60,0.55)', bg: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.3)', shadow: '0 0 60px rgba(249,115,22,0.18)',
    barGrad: 'linear-gradient(90deg,#ea580c,#fb923c)', barGlow: 'rgba(251,146,60,0.55)',
    emoji: '😲', label: 'Surprise',
  },
};
const DEFAULT_THEME = THEMES.NEUTRAL;

/* ── Thick animated confidence bar ──────────────────────────────────────── */
function ConfidenceGauge({ confidence, theme }) {
  const [width, setWidth] = useState(0);
  const pct = Math.round(confidence * 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525b' }}>
          Confidence
        </span>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.color, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          {pct}<span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.7 }}>%</span>
        </span>
      </div>

      {/* Track */}
      <div className="conf-track">
        <div
          id="confidence-bar"
          className="conf-fill"
          style={{
            width: `${width}%`,
            '--bar-gradient': theme.barGrad,
            '--bar-glow':     theme.barGlow,
          }}
        />
        {/* Glow layer */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '99px',
          background: `linear-gradient(90deg, transparent ${width - 8}%, ${theme.color}22 ${width}%)`,
          transition: 'background 1s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Tick marks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
        {['0', '25', '50', '75', '100'].map((v) => (
          <span key={v} style={{ fontSize: '0.65rem', color: '#3f3f46' }}>{v}%</span>
        ))}
      </div>
    </div>
  );
}

/* ── Metric pill ─────────────────────────────────────────────────────────── */
function Pill({ label, value, accent }) {
  return (
    <div className="metric-pill">
      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: accent || '#e4e4e7' }}>
        {value}
      </span>
      <span style={{ fontSize: '0.65rem', color: '#71717a', letterSpacing: '0.04em' }}>
        {label}
      </span>
    </div>
  );
}

/* ── Error state ──────────────────────────────────────────────────────────── */
function ErrorCard({ message }) {
  return (
    <div
      id="results-dashboard"
      className="glass results-enter"
      style={{
        padding: '1.25rem 1.5rem',
        border: '1px solid rgba(239,68,68,0.3)',
        background: 'rgba(239,68,68,0.05)',
        display: 'flex', alignItems: 'flex-start', gap: '0.9rem',
      }}
    >
      <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>⚠</span>
      <div>
        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fca5a5', marginBottom: '0.25rem' }}>
          Analysis Failed
        </p>
        <p style={{ fontSize: '0.8rem', color: '#71717a', lineHeight: 1.5 }}>{message}</p>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function ResultsDashboard({ result, error }) {
  if (error)   return <ErrorCard message={error} />;
  if (!result) return null;

  const emotion = (result.prediction || '').toUpperCase();
  const theme   = THEMES[emotion] || DEFAULT_THEME;
  const pct     = Math.round(result.confidence * 100);

  const interpretation =
    pct >= 80 ? 'Very high confidence — the model decision is robust across all sampled windows.'
    : pct >= 60 ? 'Good confidence — predicted emotion is dominant with minor cross-class activity.'
    : pct >= 40 ? 'Moderate confidence — emotion is likely correct but overlaps with adjacent states.'
    :             'Low confidence — the sample may contain mixed cues or high ambient noise.';

  return (
    <div id="results-dashboard" className="results-enter" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

      {/* ── Hero emotion card ──────────────────────────────────────────────── */}
      <div
        className="emotion-card"
        style={{
          '--emotion-border': theme.border,
          '--emotion-bg':     theme.bg,
          '--emotion-shadow': theme.shadow,
          '--emotion-glow':   theme.glow,
          padding: '1.5rem',
        }}
      >
        {/* Header label */}
        <p style={{
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#3f3f46', marginBottom: '1.1rem',
        }}>
          Detected Emotion
        </p>

        {/* Orb + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            className="emotion-orb"
            style={{
              '--emotion-glow': theme.glow,
              width: 72, height: 72, borderRadius: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', flexShrink: 0,
              background: theme.bg,
              border: `1.5px solid ${theme.border}`,
            }}
          >
            {theme.emoji}
          </div>

          <div>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: theme.color,
              textShadow: `0 0 40px ${theme.glow}`,
              marginBottom: '0.35rem',
            }}>
              {theme.label || emotion}
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#52525b' }}>
              Predicted from acoustic window analysis
            </p>
          </div>
        </div>
      </div>

      {/* ── Confidence gauge card ──────────────────────────────────────────── */}
      <div
        className="glass"
        style={{
          padding: '1.25rem 1.5rem',
          border: `1px solid ${theme.border}`,
        }}
      >
        <ConfidenceGauge confidence={result.confidence} theme={theme} />
      </div>

      {/* ── Metric pills ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        <Pill label="Confidence"   value={`${pct}%`}      accent={theme.color} />
        <Pill label="Sample Rate"  value="22 kHz"         accent="#818cf8" />
        <Pill label="Window"       value="3.5s"           accent="#818cf8" />
        <Pill label="Model"        value="SVM"            accent="#818cf8" />
      </div>

      {/* ── Interpretation strip ───────────────────────────────────────────── */}
      <div style={{
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        fontSize: '0.8rem', lineHeight: 1.55, color: '#a1a1aa',
      }}>
        <span style={{ color: theme.color, fontWeight: 600 }}>Interpretation: </span>
        {interpretation}
      </div>
    </div>
  );
}
