import type { ActivityLogItem } from '#/features/activity-logs/api'
import { TYPE_LABELS, typeStyle, timeAgo, formatDate } from '#/features/activity-logs/utils'

// ── Stat card ──────────────────────────────────────────────────────────────

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

// ── Log row ────────────────────────────────────────────────────────────────

export function LogRow({ log, onClick }: { log: ActivityLogItem; onClick: () => void }) {
  const style = typeStyle(log.activity_type)
  const label = TYPE_LABELS[log.activity_type] ?? log.activity_type
  return (
    <tr onClick={onClick} style={{ cursor: 'pointer' }} className="activity-log-row">
      <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: style.dot,
              flexShrink: 0,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.2rem 0.6rem',
              borderRadius: 999,
              fontSize: '0.72rem',
              fontWeight: 700,
              background: style.bg,
              color: style.text,
            }}
          >
            {label}
          </span>
        </div>
      </td>
      <td
        style={{
          padding: '0.8rem 1rem',
          color: 'var(--sea-ink)',
          fontSize: '0.88rem',
          verticalAlign: 'middle',
        }}
      >
        <div style={{ fontWeight: 600 }}>{log.action}</div>
        <div style={{ color: 'var(--sea-ink-soft)', fontSize: '0.8rem', marginTop: 2 }}>
          {log.description}
        </div>
      </td>
      <td
        style={{
          padding: '0.8rem 1rem',
          color: 'var(--sea-ink-soft)',
          fontSize: '0.82rem',
          verticalAlign: 'middle',
        }}
      >
        {log.user_name}
        {log.user_role && (
          <span
            style={{
              marginLeft: 6,
              fontSize: '0.7rem',
              padding: '0.1rem 0.45rem',
              borderRadius: 999,
              background: 'var(--chip-bg)',
              border: '1px solid var(--chip-line)',
              color: 'var(--sea-ink-soft)',
            }}
          >
            {log.user_role}
          </span>
        )}
      </td>
      <td
        style={{
          padding: '0.8rem 1rem',
          color: 'var(--sea-ink-soft)',
          fontSize: '0.8rem',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
        }}
      >
        <span title={formatDate(log.timestamp)}>{timeAgo(log.timestamp)}</span>
      </td>
    </tr>
  )
}

// ── Detail drawer ──────────────────────────────────────────────────────────

export function DetailDrawer({
  log,
  onClose,
}: {
  log: ActivityLogItem | null
  onClose: () => void
}) {
  if (!log) return null
  const style = typeStyle(log.activity_type)
  const label = TYPE_LABELS[log.activity_type] ?? log.activity_type

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,20,24,0.35)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
          animation: 'fade-in 160ms ease both',
        }}
      />
      {/* Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 100vw)',
          background: 'linear-gradient(165deg, var(--surface-strong), var(--surface))',
          borderLeft: '1px solid var(--line)',
          boxShadow: '-18px 0 44px rgba(23,58,64,0.14)',
          backdropFilter: 'blur(16px)',
          zIndex: 41,
          overflowY: 'auto',
          padding: '2rem 1.75rem',
          animation: 'slide-in-right 220ms cubic-bezier(0.16,1,0.3,1) both',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="island-kicker">Activity Detail</span>
          <button
            onClick={onClose}
            style={{
              border: '1px solid var(--line)',
              borderRadius: '0.6rem',
              background: 'var(--chip-bg)',
              color: 'var(--sea-ink)',
              padding: '0.35rem 0.7rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            ✕
          </button>
        </div>

        <div>
          <span
            style={{
              display: 'inline-flex',
              padding: '0.28rem 0.75rem',
              borderRadius: 999,
              fontSize: '0.8rem',
              fontWeight: 700,
              background: style.bg,
              color: style.text,
            }}
          >
            {label}
          </span>
          <h2
            style={{
              margin: '0.6rem 0 0',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--sea-ink)',
            }}
          >
            {log.action}
          </h2>
          <p
            style={{
              margin: '0.4rem 0 0',
              color: 'var(--sea-ink-soft)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            {log.description}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'User', value: log.user_name },
            { label: 'Role', value: log.user_role ?? '—' },
            { label: 'Target type', value: log.target_type ?? '—' },
            { label: 'When', value: formatDate(log.timestamp) },
          ].map(({ label: itemLabel, value }) => (
            <div
              key={itemLabel}
              className="demo-card"
              style={{ padding: '0.75rem', borderRadius: '0.75rem' }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--sea-ink-soft)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 4,
                }}
              >
                {itemLabel}
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--sea-ink)',
                  wordBreak: 'break-all',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {log.target_id && (
          <div className="demo-code-block" style={{ fontSize: '0.8rem' }}>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--sea-ink-soft)',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Target ID
            </div>
            <code
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '0.82rem',
                wordBreak: 'break-all',
              }}
            >
              {log.target_id}
            </code>
          </div>
        )}

        <div className="demo-code-block" style={{ fontSize: '0.8rem' }}>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--sea-ink-soft)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Log ID
          </div>
          <code
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '0.78rem',
              wordBreak: 'break-all',
            }}
          >
            {log.id}
          </code>
        </div>
      </aside>
    </>
  )
}
