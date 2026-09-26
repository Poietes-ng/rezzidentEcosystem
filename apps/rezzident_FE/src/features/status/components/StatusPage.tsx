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
      <div className="demo-page rise-in pt-8 text-center">
        <div className="mx-auto mt-16 mb-4 h-9 w-9 animate-[spin_700ms_linear_infinite] rounded-full border-[3px] border-[var(--line)] border-t-[var(--lagoon)]" />
        <p className="demo-muted text-[0.9rem]">Checking system health…</p>
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
      <div className="demo-page rise-in pt-8">
        {/* ── Header ── */}
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="island-kicker">Admin</span>
            <h1 className="demo-title mt-1.5">System Status</h1>
            <p className="demo-muted mt-2 text-[0.95rem]">
              Real-time health of APIs, databases, and third-party services.
            </p>
          </div>

          {statusReport && (
            <div
              className="island-shell flex items-center gap-4 rounded-2xl px-6 py-4"
              style={{
                border: `1px solid ${overallStyle.bg}`,
                background: `linear-gradient(165deg, color-mix(in oklab, ${overallStyle.bg} 40%, var(--surface-strong)), var(--surface))`,
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-[1.6rem]"
                style={{
                  background: overallStyle.bg,
                  color: overallStyle.text,
                }}
              >
                {overallStyle.icon}
              </div>
              <div>
                <div className="text-[1.15rem] leading-[1.2] font-extrabold text-[var(--sea-ink)]">
                  {statusReport.overall_label}
                </div>
                <div className="mt-1 text-[0.8rem] font-semibold text-[var(--sea-ink-soft)]">
                  Uptime: {statusReport.uptime_formatted}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="demo-alert demo-alert-danger mb-8">⚠️ {error}</div>}

        {/* ── Uptime Chart ── */}
        <UptimeChart data={dailyData ?? []} />

        {/* ── Services Grid ── */}
        {statusReport && (
          <div className="mb-12">
            <div className="demo-section-title mb-5">System Components</div>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
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
            <div className="demo-section-title mb-5">Recent Incidents (Last 30 Days)</div>
            <div className="flex flex-col gap-3">
              {incidents.incidents.map((inc) => {
                const style = getStatusStyle(inc.overall_status)
                return (
                  <div
                    key={inc.id}
                    className="flex items-start gap-4 rounded-xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--surface-strong)_80%,transparent)] p-4"
                  >
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-[0.7rem] font-bold whitespace-nowrap"
                      style={{
                        background: style.bg,
                        color: style.text,
                      }}
                    >
                      {formatStatus(inc.overall_status)}
                    </span>
                    <div className="flex-1">
                      <div className="text-[0.88rem] font-bold text-[var(--sea-ink)]">
                        {inc.incident_services
                          ? `Issues with: ${inc.incident_services}`
                          : inc.overall_label}
                      </div>
                      <div className="mt-1 text-[0.75rem] text-[var(--sea-ink-soft)]">
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
