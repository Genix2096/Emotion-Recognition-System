export default function HeroSection() {
  return (
    <header
      style={{
        paddingTop: '1rem',
        paddingBottom: '3rem',
        paddingInline: '0.5rem',
      }}
    >

      {/* ── Main headline ───────────────────────────────────────────────── */}
      <h1
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: 400,
          lineHeight: 1.03,
          letterSpacing: '-0.02em',
          color: '#111111',
          marginBottom: '1.35rem',
        }}
      >
        Emotion Recognition
        <em style={{ fontStyle: 'italic', color: '#78A4CB' }}>System</em>
      </h1>

      {/* ── Divider line with accent block ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.35rem' }}>
        <div style={{ height: 3, flex: 1, background: '#111111', borderRadius: 1 }} />
        <div style={{
          width: 28, height: 12,
          background: '#F9E8A2',
          border: '1px solid #111111',
          borderRadius: 2,
        }} />
        <div style={{ height: 3, width: 40, background: '#B4E1EB', borderRadius: 1 }} />
      </div>

      {/* ── Sub-copy ────────────────────────────────────────────────────── */}
      <p
        style={{
          maxWidth: '32rem',
          fontSize: '0.9375rem',
          lineHeight: 1,
          color: '#334155',
          
        }}
      >
        Upload a{' '}
        <code
          style={{
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            padding: '0.1rem 0.45rem',
            borderRadius: '3px',
            background: '#F9E8A2',
            border: '1px solid #111111',
            color: '#111111',
            fontWeight: 700,
          }}
        >
          .wav
        </code>
        {' '}file and our SVM model decodes the hidden emotion from MFCCs,
        chroma vectors, mel-spectrograms, and spectral contrast.
      </p>
    </header>
  );
}
