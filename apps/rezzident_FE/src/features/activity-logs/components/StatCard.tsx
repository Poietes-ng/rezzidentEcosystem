export function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div
      className="demo-panel"
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      <div
        style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: 800,
          color: 'var(--sea-ink)',
          lineHeight: 1,
        }}
      >
        {value.toLocaleString()}
      </div>
      <div
        style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--sea-ink-soft)',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </div>
    </div>
  )
}
