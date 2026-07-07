import { useEffect, useState } from 'react';

/* ── Emotion themes — pastel palette ──────────────────────────────────── */
const THEMES = {
  HAPPY: {
    bg: '#FEF9C3', border: '#111111', barColor: '#78A4CB',
    labelColor: '#92400E', emoji: '😊', label: 'Happy',
  },
  SAD: {
    bg: '#E0F2FE', border: '#111111', barColor: '#78A4CB',
    labelColor: '#1E40AF', emoji: '😢', label: 'Sad',
  },
  ANGRY: {
    bg: '#FFE4E6', border: '#111111', barColor: '#95BDD7',
    labelColor: '#9F1239', emoji: '😠', label: 'Angry',
  },
  CALM: {
    bg: '#B4E1EB', border: '#111111', barColor: '#78A4CB',
    labelColor: '#0E4F6A', emoji: '😌', label: 'Calm',
  },
  NEUTRAL: {
    bg: '#F5F1E8', border: '#111111', barColor: '#95BDD7',
    labelColor: '#334155', emoji: '😐', label: 'Neutral',
  },
  FEARFUL: {
    bg: '#EDE9FE', border: '#111111', barColor: '#78A4CB',
    labelColor: '#5B21B6', emoji: '😨', label: 'Fearful',
  },
  FEAR: {
    bg: '#EDE9FE', border: '#111111', barColor: '#78A4CB',
    labelColor: '#5B21B6', emoji: '😨', label: 'Fear',
  },
  DISGUST: {
    bg: '#DCFCE7', border: '#111111', barColor: '#95BDD7',
    labelColor: '#14532D', emoji: '🤢', label: 'Disgust',
  },
  SURPRISED: {
    bg: '#FEF3C7', border: '#111111', barColor: '#78A4CB',
    labelColor: '#92400E', emoji: '😲', label: 'Surprised',
  },
  SURPRISE: {
    bg: '#FEF3C7', border: '#111111', barColor: '#78A4CB',
    labelColor: '#92400E', emoji: '😲', label: 'Surprise',
  },
};
const DEFAULT_THEME = THEMES.NEUTRAL;

/* ── Animated confidence bar ─────────────────────────────────────────── */
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.7rem' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B' }}>
          Confidence Score
        </span>
        <span style={{
          fontSize: '1.75rem', fontWeight: 900, color: '#111111',
          letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
        }}>
          {pct}<span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748B' }}>%</span>
        </span>
      </div>

      {/* Track */}
      <div className="conf-track">
        <div
          id="confidence-bar"
          className="conf-fill"
          style={{
            width: `${width}%`,
            '--bar-gradient': theme.barColor,
          }}
        />
      </div>

      {/* Ticks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
        {['0', '25', '50', '75', '100'].map((v) => (
          <span key={v} style={{ fontSize: '0.62rem', color: '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>{v}%</span>
        ))}
      </div>
    </div>
  );
}

/* ── Telemetry metric card ───────────────────────────────────────────── */
function MetricCard({ label, value, bgColor }) {
  return (
    <div className="metric-pill" style={{ background: bgColor || '#F5F1E8' }}>
      <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#111111', letterSpacing: '-0.02em' }}>
        {value}
      </span>
      <span style={{ fontSize: '0.6rem', color: '#64748B', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700 }}>
        {label}
      </span>
    </div>
  );
}

/* ── Probability bar row ─────────────────────────────────────────────── */
function ProbRow({ label, pct, barColor, isTop }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="prob-row">
      <span className="prob-label" style={{ fontWeight: isTop ? 800 : 600, color: isTop ? '#111111' : '#64748B' }}>
        {label}
      </span>
      <div className="prob-track">
        <div
          className="prob-fill"
          style={{
            width: `${width}%`,
            background: isTop ? barColor : '#B4E1EB',
          }}
        />
      </div>
      <span className="prob-pct" style={{ color: isTop ? '#111111' : '#94A3B8', fontWeight: isTop ? 800 : 600 }}>
        {pct}%
      </span>
    </div>
  );
}

/* ── Error card ──────────────────────────────────────────────────────── */
function ErrorCard({ message }) {
  return (
    <div
      id="results-dashboard"
      className="results-enter"
      style={{
        padding: '1.25rem 1.5rem',
        background: '#FFE4E6',
        border: '2px solid #111111',
        borderRadius: 8,
        display: 'flex', alignItems: 'flex-start', gap: '1rem',
        boxShadow: '4px 4px 0px #111111',
      }}
    >
      <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>⚠</span>
      <div>
        <p style={{ fontWeight: 800, fontSize: '0.875rem', color: '#9F1239', marginBottom: '0.3rem' }}>
          Analysis Failed
        </p>
        <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
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

  /* Synthetic probability distribution if the backend doesn't provide one */
  const probData = result.probabilities
    ? Object.entries(result.probabilities)
        .map(([k, v]) => ({ label: k, pct: Math.round(v * 100) }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 6)
    : null;

  return (
    <div id="results-dashboard" className="results-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* ── Hero emotion card ─────────────────────────────────────────── */}
      <div
        className="emotion-card"
        style={{
          '--emotion-bg': theme.bg,
          padding: '1.75rem',
        }}
      >
        {/* Header label */}
        <p style={{
          fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#64748B', marginBottom: '1.25rem',
        }}>
          ▸ Detected Emotion
        </p>

        {/* Orb + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Emoji box */}
          <div
            className="emotion-orb"
            style={{
              width: 80, height: 80, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', flexShrink: 0,
              background: '#FDFBF7', border: '2px solid #111111',
              boxShadow: '4px 4px 0px #111111',
            }}
          >
            {theme.emoji}
          </div>

          <div>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2.5rem, 6vw, 3.25rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#111111',
              marginBottom: '0.4rem',
            }}>
              {theme.label || emotion}
            </h2>
            <p style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 500 }}>
              Predicted from acoustic window analysis
            </p>
          </div>
        </div>
      </div>

      {/* ── Confidence gauge ─────────────────────────────────────────── */}
      <div
        className="glass card-hover"
        style={{ padding: '1.4rem 1.6rem' }}
      >
        <ConfidenceGauge confidence={result.confidence} theme={theme} />
      </div>

      {/* ── Telemetry metrics grid ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
        <MetricCard label="Confidence"  value={`${pct}%`}   bgColor='#F9E8A2' />
        <MetricCard label="Sample Rate" value="22 kHz"       bgColor='#B4E1EB' />
        <MetricCard label="Window"      value="3.5s"         bgColor='#95BDD7' />
        <MetricCard label="Model"       value="SVM"          bgColor='#78A4CB' />
      </div>

      {/* ── Probability breakdown ────────────────────────────────────── */}
      {probData && probData.length > 0 && (
        <div
          className="glass card-hover"
          style={{ padding: '1.35rem 1.6rem' }}
        >
          <p style={{
            fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#64748B', marginBottom: '1rem',
          }}>
            ▸ Emotion Probability
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {probData.map(({ label, pct: p }) => (
              <ProbRow
                key={label}
                label={label}
                pct={p}
                barColor={theme.barColor}
                isTop={label.toUpperCase() === emotion}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Interpretation strip ─────────────────────────────────────── */}
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: 6,
        background: '#F5F1E8',
        border: '1px solid #111111',
        fontSize: '0.8rem', lineHeight: 1.65, color: '#334155',
      }}>
        <span style={{ fontWeight: 800, color: '#111111' }}>Interpretation: </span>
        {interpretation}
      </div>
    </div>
  );
}
