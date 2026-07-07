import { useEffect, useRef, useState } from 'react';

/* Waveform bar configs */
const BARS = [
  { dur: '0.7s',  delay: '0s',     h: 16 },
  { dur: '0.9s',  delay: '0.12s',  h: 28 },
  { dur: '0.65s', delay: '0.24s',  h: 20 },
  { dur: '1.0s',  delay: '0.06s',  h: 34 },
  { dur: '0.8s',  delay: '0.18s',  h: 24 },
  { dur: '0.75s', delay: '0.3s',   h: 18 },
  { dur: '0.95s', delay: '0.09s',  h: 30 },
  { dur: '0.7s',  delay: '0.21s',  h: 14 },
  { dur: '0.85s', delay: '0.33s',  h: 22 },
  { dur: '0.6s',  delay: '0.15s',  h: 12 },
];

/* ── Duration reader ──────────────────────────────────────────────────────── */
function useDuration(file) {
  const [dur, setDur] = useState(null);
  useEffect(() => {
    if (!file) { setDur(null); return; }
    const url = URL.createObjectURL(file);
    const a   = new Audio(url);
    a.onloadedmetadata = () => {
      const s = Math.round(a.duration);
      setDur(isFinite(s) ? `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}` : null);
      URL.revokeObjectURL(url);
    };
    return () => { a.src = ''; URL.revokeObjectURL(url); };
  }, [file]);
  return dur;
}

/* ── Component ─────────────────────────────────────────────────────────────── */
export default function AudioPlayer({ file }) {
  const audioRef = useRef(null);
  const duration = useDuration(file);

  if (!file) return null;

  const objectUrl = URL.createObjectURL(file);
  const ext       = file.name.split('.').pop().toUpperCase();
  const shortName = file.name.length > 28 ? `${file.name.slice(0, 25)}…` : file.name;

  return (
    <div
      id="audio-player-section"
      className="glass"
      style={{
        padding: '1rem 1.25rem',
        border: '1px solid rgba(99,102,241,0.2)',
      }}
    >
      {/* ── Top: waveform bars + metadata ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.9rem' }}>

        {/* Animated waveform bars */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '3px', height: '38px', flexShrink: 0,
        }}>
          {BARS.map((b, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{ '--dur': b.dur, '--delay': b.delay, height: `${b.h}px` }}
            />
          ))}
        </div>

        {/* Track info */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontSize: '0.82rem', fontWeight: 600, color: '#e4e4e7',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {shortName}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
              color: '#818cf8', background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '99px', padding: '0.1rem 0.45rem',
            }}>{ext}</span>
            {duration && (
              <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{duration}</span>
            )}
            <span style={{ fontSize: '0.72rem', color: '#3f3f46' }}>·</span>
            <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Preview</span>
          </div>
        </div>
      </div>

      {/* ── Native audio control ──────────────────────────────────────────── */}
      <audio
        id="audio-player"
        ref={audioRef}
        controls
        src={objectUrl}
        style={{ width: '100%' }}
      />
    </div>
  );
}
