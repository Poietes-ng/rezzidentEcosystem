import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type {FullStatusReport, DailyUptimeEntry, IncidentsResponse} from '#/features/status/api';
import {
  fetchFullStatus,
  fetchDailySummary,
  fetchIncidents
  
  
  
} from '#/features/status/api'

export const Route = createFileRoute('/_authenticated/status')({
  component: StatusPage,
})

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string; icon: string }> = {
  operational: { bg: 'rgba(47,106,74,0.12)', text: 'var(--palm)', dot: 'var(--palm)', icon: '✓' },
  degraded: { bg: 'rgba(196,126,42,0.12)', text: '#a06820', dot: '#c47e2a', icon: '⚠' },
  partial_outage: { bg: 'rgba(196,71,71,0.1)', text: '#9f3030', dot: '#c44747', icon: '⚠' },
  major_outage: { bg: 'rgba(196,71,71,0.15)', text: '#9f3030', dot: '#c44747', icon: '✖' },
  not_configured: {
    bg: 'rgba(23,58,64,0.08)',
    text: 'var(--sea-ink-soft)',
    dot: 'var(--sea-ink-soft)',
    icon: '?',
  },
}

function getStatusStyle(status: string) {
  return STATUS_COLORS[status] ?? STATUS_COLORS.not_configured
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── Service Card ───────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: FullStatusReport['services'][0] }) {
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

// ── Uptime Chart ───────────────────────────────────────────────────────────

function UptimeChart({ data }: { data: DailyUptimeEntry[] }) {
  if (data.length === 0) return null

  // Last 90 days layout
  return (
    <div className="demo-panel" style={{ marginBottom: '2rem' }}>
      <div className="demo-section-title" style={{ marginBottom: '1.25rem' }}>
        90-Day Uptime History
      </div>
      <div style={{ display: 'flex', gap: '2px', height: '40px', alignItems: 'flex-end' }}>
        {data.map((day, i) => {
          let bgColor = 'var(--line)' // no_data
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

// ── Page ───────────────────────────────────────────────────────────────────

function StatusPage() {
  const TOKEN = localStorage.getItem('access_token') ?? ''

  const [statusReport, setStatusReport] = useState<FullStatusReport | null>(null)
  const [dailyData, setDailyData] = useState<DailyUptimeEntry[]>([])
  const [incidents, setIncidents] = useState<IncidentsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      setLoading(true)
      try {
        const [reportRes, dailyRes, incidentsRes] = await Promise.all([
          fetchFullStatus(TOKEN),
          fetchDailySummary(TOKEN, 90),
          fetchIncidents(TOKEN, 10, 30), // Last 10 incidents in 30 days
        ])
        if (isMounted) {
          setStatusReport(reportRes)
          setDailyData(dailyRes)
          setIncidents(incidentsRes)
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load status')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    // Refresh status every 60s
    const interval = setInterval(() => {
      fetchFullStatus(TOKEN)
        .then((res) => {
          if (isMounted) setStatusReport(res)
        })
        .catch(() => {})
    }, 60000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [TOKEN])

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
        <UptimeChart data={dailyData} />

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
                        style={{ fontSize: '0.75rem', color: 'var(--sea-ink-soft)', marginTop: 4 }}
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
