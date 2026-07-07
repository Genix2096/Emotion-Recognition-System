import { useEffect, useRef, useState } from 'react';

/* Waveform bar specs */
const BARS = [
  { dur: '0.7s',  delay: '0s',    h: 14 },
  { dur: '0.9s',  delay: '0.1s',  h: 24 },
  { dur: '0.65s', delay: '0.2s',  h: 18 },
  { dur: '1.0s',  delay: '0.05s', h: 30 },
  { dur: '0.8s',  delay: '0.15s', h: 20 },
  { dur: '0.75s', delay: '0.28s', h: 14 },
  { dur: '0.95s', delay: '0.08s', h: 26 },
  { dur: '0.65s', delay: '0.22s', h: 10 },
  { dur: '0.85s', delay: '0.32s', h: 18 },
  { dur: '0.55s', delay: '0.12s', h: 8  },
];

/* ── Duration hook ──────────────────────────────────────────────────────── */
function useDuration(file) {
  const [dur, setDur] = useState(null);
  useEffect(() => {
    if (!file) { setDur(null); return; }
    const url = URL.createObjectURL(file);
    const a   = new Audio(url);
    a.onloadedmetadata = () => {
      const s = Math.round(a.duration);
      setDur(isFinite(s) ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : null);
      URL.revokeObjectURL(url);
    };
    return () => { a.src = ''; URL.revokeObjectURL(url); };
  }, [file]);
  return dur;
}

export default function AudioPlayer({ file }) {
  const audioRef = useRef(null);
  const duration = useDuration(file);

  if (!file) return null;

  const objectUrl = URL.createObjectURL(file);
  const ext       = file.name.split('.').pop().toUpperCase();
  const shortName = file.name.length > 32 ? `${file.name.slice(0, 29)}…` : file.name;

  return (
    <div
      id="audio-player-section"
      style={{
        background: '#F5F1E8',
        border: '1px solid #111111',
        borderRadius: 6,
        padding: '1rem 1.25rem',
      }}
    >
      {/* ── Waveform bars + track info ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.9rem' }}>

        {/* Animated equalizer bars */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '3px', height: '36px', flexShrink: 0,
          background: '#B4E1EB', border: '1px solid #111111', borderRadius: 4,
          padding: '4px 8px',
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
            fontSize: '0.82rem', fontWeight: 700, color: '#111111',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {shortName}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
            <span style={{
              fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.07em',
              color: '#111111', background: '#F9E8A2',
              border: '1px solid #111111', borderRadius: 3,
              padding: '0.1rem 0.45rem',
            }}>
              {ext}
            </span>
            {duration && (
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>{duration}</span>
            )}
            <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>·</span>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Preview</span>
          </div>
        </div>
      </div>

      {/* ── Native audio control ───────────────────────────────────────── */}
      <audio
        id="audio-player"
        ref={audioRef}
        controls
        src={objectUrl}
        style={{ width: '100%', height: '34px' }}
      />
    </div>
  );
}
