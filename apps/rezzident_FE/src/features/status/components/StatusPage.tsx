import { useQuery } from '@tanstack/react-query'
import { getStatusStyle, formatStatus, formatDate } from '../utils'
import { ServiceCard } from './ServiceCard'
import { UptimeChart } from './UptimeChart'
import type React from 'react'
import { fetchFullStatus, fetchDailySummary, fetchIncidents } from '#/features/status/api'

// ── Page ───────────────────────────────────────────────────────────────────

export function StatusPage(): React.JSX.Element {
  const TOKEN = localStorage.getItem('access_token') ?? ''

  const {
    data: statusReport,
    isLoading: isReportLoading,
    error: reportError,
  } = useQuery({
    queryKey: ['statusReport', TOKEN],
    queryFn: () => fetchFullStatus(TOKEN),
    refetchInterval: 60000,
  })

  const {
    data: dailyData,
    isLoading: isDailyLoading,
    error: dailyError,
  } = useQuery({
    queryKey: ['dailyStatus', TOKEN],
    queryFn: () => fetchDailySummary(TOKEN, 90),
  })

  const {
    data: incidents,
    isLoading: isIncidentsLoading,
    error: incidentsError,
  } = useQuery({
    queryKey: ['statusIncidents', TOKEN],
    queryFn: () => fetchIncidents(TOKEN, 10, 30),
  })

  const loading = isReportLoading || isDailyLoading || isIncidentsLoading
  const error = reportError?.message || dailyError?.message || incidentsError?.message || null

  if (loading && !statusReport) {
    return (
      <div className="demo-page rise-in" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            margin: '4rem auto 1rem',
            border: '3px solid var(--line)',
            borderTopColor: 'var(--lagoon)',
            animation: 'spin 700ms linear infinite',
          }}
        />
        <p className="demo-muted" style={{ fontSize: '0.9rem' }}>
          Checking system health…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  const overallStyle = statusReport
    ? getStatusStyle(statusReport.status)
    : getStatusStyle('not_configured')

  return (
    <>
      <style>{`
        @keyframes fade-in { from { opacity:0 } to { opacity:1 } }
      `}</style>
      <div className="demo-page rise-in" style={{ paddingTop: '2rem' }}>
        {/* ── Header ── */}
        <div
          style={{
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <span className="island-kicker">Admin</span>
            <h1 className="demo-title" style={{ marginTop: '0.4rem' }}>
              System Status
            </h1>
            <p className="demo-muted" style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
              Real-time health of APIs, databases, and third-party services.
            </p>
          </div>

          {statusReport && (
            <div
              className="island-shell"
              style={{
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: `1px solid ${overallStyle.bg}`,
                background: `linear-gradient(165deg, color-mix(in oklab, ${overallStyle.bg} 40%, var(--surface-strong)), var(--surface))`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: overallStyle.bg,
                  color: overallStyle.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                }}
              >
                {overallStyle.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--sea-ink)',
                    lineHeight: 1.2,
                  }}
                >
                  {statusReport.overall_label}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--sea-ink-soft)',
                    marginTop: '0.25rem',
                    fontWeight: 600,
                  }}
                >
                  Uptime: {statusReport.uptime_formatted}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="demo-alert demo-alert-danger" style={{ marginBottom: '2rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Uptime Chart ── */}
        <UptimeChart data={dailyData ?? []} />

        {/* ── Services Grid ── */}
        {statusReport && (
          <div style={{ marginBottom: '3rem' }}>
            <div className="demo-section-title" style={{ marginBottom: '1.25rem' }}>
              System Components
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {statusReport.services.map((service) => (
                <ServiceCard key={service.name} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Incidents ── */}
        {incidents && incidents.incidents.length > 0 && (
          <div className="demo-panel">
            <div className="demo-section-title" style={{ marginBottom: '1.25rem' }}>
              Recent Incidents (Last 30 Days)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {incidents.incidents.map((inc) => {
                const style = getStatusStyle(inc.overall_status)
                return (
                  <div
                    key={inc.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--line)',
                      borderRadius: '0.75rem',
                      background: 'color-mix(in oklab, var(--surface-strong) 80%, transparent)',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        background: style.bg,
                        color: style.text,
                      }}
                    >
                      {formatStatus(inc.overall_status)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--sea-ink)' }}
                      >
                        {inc.incident_services
                          ? `Issues with: ${inc.incident_services}`
                          : inc.overall_label}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--sea-ink-soft)',
                          marginTop: 4,
                        }}
                      >
                        {formatDate(inc.occurred_at)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
