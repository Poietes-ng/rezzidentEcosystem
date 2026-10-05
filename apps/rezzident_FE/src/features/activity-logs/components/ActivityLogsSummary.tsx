import { StatCard } from './StatCard'
import type { ActivitySummaryStats } from '#/features/activity-logs/api'
import { TYPE_LABELS, typeStyle } from '#/features/activity-logs/utils'

interface ActivityLogsSummaryProps {
  summary?: ActivitySummaryStats | null
}

export function ActivityLogsSummary({ summary }: ActivityLogsSummaryProps) {
  if (!summary) return null

  return (
    <>
      {/* ── Summary stats ── */}
      <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
        <StatCard label="Total events" value={summary.total_activities} icon="📋" />
        <StatCard label="Today" value={summary.activities_today} icon="☀️" />
        <StatCard label="This week" value={summary.activities_this_week} icon="📅" />
        <StatCard label="This month" value={summary.activities_this_month} icon="📆" />
      </div>

      {/* ── Top types + active users ── */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="demo-panel">
          <div className="demo-section-title mb-4">Top Activity Types</div>
          <div className="flex flex-col gap-2">
            {summary.top_activity_types.map((t) => {
              const pct = Math.round((t.count / (summary.total_activities || 1)) * 100)
              const style = typeStyle(t.type)
              return (
                <div key={t.type} className="flex items-center gap-[0.6rem]">
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      minWidth: 90,
                      color: style.text,
                    }}
                  >
                    {TYPE_LABELS[t.type] ?? t.type}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 999,
                      background: 'var(--line)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 999,
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${style.dot}, color-mix(in oklab, ${style.dot} 60%, var(--lagoon)))`,
                        transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--sea-ink-soft)',
                      minWidth: 28,
                      textAlign: 'right',
                    }}
                  >
                    {t.count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="demo-panel">
          <div className="demo-section-title mb-4">Most Active Users</div>
          <div className="flex flex-col gap-[0.6rem]">
            {summary.most_active_users.length === 0 ? (
              <p className="demo-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                No data yet.
              </p>
            ) : (
              summary.most_active_users.map((u, i) => (
                <div key={u.user_name} className="flex items-center gap-3">
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, var(--lagoon), var(--palm))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--sea-ink)',
                    }}
                  >
                    {u.user_name}
                  </span>
                  <span className="demo-pill">{u.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
