export default function HeroSection() {
  return (
    <header className="text-center pt-16 pb-10 px-4 select-none">

      {/* ── Main headline ──────────────────────────────────────────────────── */}
      <h1
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(2.6rem, 6.5vw, 4.75rem)',
          fontWeight: 800,
          lineHeight: 1.06,
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem',
        }}
      >
        <span className="text-gradient">Vocal Emotion</span>
        <br />
        <span style={{ color: '#fafafa' }}>Classifier</span>
      </h1>

      {/* ── Sub-copy ───────────────────────────────────────────────────────── */}
      <p
        style={{
          maxWidth: '29rem',
          margin: '0 auto 2rem',
          fontSize: '0.9375rem',
          lineHeight: 1.65,
          color: '#71717a',
        }}
      >
        Upload a&nbsp;
        <code
          style={{
            fontFamily: 'monospace',
            fontSize: '0.825rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '0.35rem',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#a5b4fc',
          }}
        >
          .wav
        </code>
        &nbsp;file and our SVM model decodes the hidden emotion from MFCCs,
        chroma vectors, mel-spectrograms, and spectral contrast.
      </p>
    </header>
  );
}
