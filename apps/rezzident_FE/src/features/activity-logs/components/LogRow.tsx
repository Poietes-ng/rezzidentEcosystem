import type { ActivityLogItem } from '#/features/activity-logs/api'
import { TYPE_LABELS, typeStyle, timeAgo, formatDate } from '#/features/activity-logs/utils'

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
