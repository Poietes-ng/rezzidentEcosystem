import { getStatusStyle, formatStatus } from '../utils'
import type { FullStatusReport } from '#/features/status/api'

export function ServiceCard({ service }: { service: FullStatusReport['services'][0] }) {
  const style = getStatusStyle(service.status)
  return (
    <div
      className="demo-card"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--sea-ink)' }}>
            {service.name}
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--sea-ink-soft)' }}>
            {service.description}
          </p>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 999,
            fontSize: '0.72rem',
            fontWeight: 700,
            background: style.bg,
            color: style.text,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot }} />
          {formatStatus(service.status)}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 'auto',
          paddingTop: '0.5rem',
        }}
      >
        {service.error ? (
          <div style={{ fontSize: '0.75rem', color: '#9f3030', fontWeight: 600 }}>
            {service.error}
          </div>
        ) : service.response_time_ms !== null ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--sea-ink-soft)', fontWeight: 600 }}>
            {service.response_time_ms} ms
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--sea-ink-soft)' }}>—</div>
        )}
      </div>
    </div>
  )
}
