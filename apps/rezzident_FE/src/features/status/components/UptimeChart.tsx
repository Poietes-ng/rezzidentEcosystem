import type { DailyUptimeEntry } from '#/features/status/api'

export function UptimeChart({ data }: { data: DailyUptimeEntry[] }) {
  if (data.length === 0) return null

  return (
    <div className="demo-panel" style={{ marginBottom: '2rem' }}>
      <div className="demo-section-title" style={{ marginBottom: '1.25rem' }}>
        90-Day Uptime History
      </div>
      <div style={{ display: 'flex', gap: '2px', height: '40px', alignItems: 'flex-end' }}>
        {data.map((day, i) => {
          let bgColor = 'var(--line)'
          if (day.status === 'operational') bgColor = 'var(--palm)'
          else if (day.status === 'incident') bgColor = '#c44747'

          return (
            <div
              key={i}
              title={`${day.date}: ${day.uptime_pct !== null ? day.uptime_pct + '%' : 'No data'}`}
              style={{
                flex: 1,
                background: bgColor,
                height: day.status === 'no_data' ? '20%' : '100%',
                borderRadius: '2px',
                opacity: day.status === 'no_data' ? 0.5 : day.uptime_pct === 100 ? 0.85 : 1,
                transition: 'opacity 150ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity =
                  day.status === 'no_data' ? '0.5' : day.uptime_pct === 100 ? '0.85' : '1')
              }
            />
          )
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--sea-ink-soft)',
          fontWeight: 600,
        }}
      >
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}
