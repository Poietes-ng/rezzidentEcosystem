import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LogRow, DetailDrawer } from './ActivityLogSubComponents'
import { ActivityLogsSummary } from './ActivityLogsSummary'
import type { ActivityLogFilters, ActivityLogItem } from '#/features/activity-logs/api'
import { fetchActivityLogs, fetchActivitySummary } from '#/features/activity-logs/api'
import { TYPE_LABELS } from '#/features/activity-logs/utils'

export function ActivityLogsPage() {
  // In a real app these would come from a global auth context / store
  const TOKEN = localStorage.getItem('access_token') ?? ''

  const [filters, setFilters] = useState<ActivityLogFilters>({ limit: 20, skip: 0 })
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { data: summary } = useQuery({
    queryKey: ['activitySummary', TOKEN],
    queryFn: () => fetchActivitySummary(TOKEN),
  })

  const {
    data: page,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['activityLogs', filters, TOKEN],
    queryFn: () => fetchActivityLogs(filters, TOKEN),
  })

  const error = queryError?.message || null

  function handleSearch(val: string) {
    setSearch(val)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: val || undefined, skip: 0 }))
    }, 380)
  }

  function handleTypeFilter(type: string) {
    setSelectedType(type)
    setFilters((f) => ({ ...f, activity_type: type || undefined, skip: 0 }))
  }

  function goPage(direction: 1 | -1) {
    setFilters((f) => ({
      ...f,
      skip: Math.max(0, (f.skip ?? 0) + direction * (f.limit ?? 20)),
    }))
  }

  const currentPage = page ? Math.floor((filters.skip ?? 0) / (filters.limit ?? 20)) + 1 : 1
  const totalPages = page?.pages ?? 0

  return (
    <>
      <style>{`
        .activity-log-row { transition: background 140ms ease; }
        .activity-log-row:hover td { background: color-mix(in oklab, var(--lagoon) 7%, transparent); }
        @keyframes fade-in { from { opacity:0 } to { opacity:1 } }
        @keyframes slide-in-right { from { transform:translateX(100%) } to { transform:translateX(0) } }
      `}</style>

      <div className="demo-page rise-in" style={{ paddingTop: '2rem' }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="island-kicker">Admin</span>
          <h1 className="demo-title" style={{ marginTop: '0.4rem' }}>
            Activity Logs
          </h1>
          <p className="demo-muted" style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Full audit trail — every action across the estate.
          </p>
        </div>

        {/* ── Summary stats & Top types ── */}
        <ActivityLogsSummary summary={summary} />

        {/* ── Filters ── */}
        <div
          className="demo-panel"
          style={{
            marginBottom: '1.25rem',
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <input
            className="demo-input demo-input-fit"
            placeholder="🔍  Search description or action…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ minWidth: 240, flex: 1 }}
          />
          <select
            className="demo-select demo-input-fit"
            value={selectedType}
            onChange={(e) => handleTypeFilter(e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="">All types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          {(search || selectedType) && (
            <button
              className="demo-button demo-button-secondary"
              onClick={() => {
                setSearch('')
                handleTypeFilter('')
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="demo-table-shell" style={{ marginBottom: '1.5rem' }}>
          {error && (
            <div
              className="demo-alert demo-alert-danger"
              style={{ margin: '1rem', borderRadius: '0.75rem' }}
            >
              ⚠️ {error}
            </div>
          )}
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  border: '3px solid var(--line)',
                  borderTopColor: 'var(--lagoon)',
                  animation: 'spin 700ms linear infinite',
                }}
              />
              <p className="demo-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                Loading logs…
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : (
            <table className="demo-table">
              <thead>
                <tr>
                  <th style={{ width: 140 }}>Type</th>
                  <th>Event</th>
                  <th style={{ width: 180 }}>User</th>
                  <th style={{ width: 110 }}>When</th>
                </tr>
              </thead>
              <tbody>
                {page?.items.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: 'center',
                        padding: '2.5rem',
                        color: 'var(--sea-ink-soft)',
                      }}
                    >
                      No activity logs found.
                    </td>
                  </tr>
                )}
                {page?.items.map((log) => (
                  <LogRow key={log.id} log={log} onClick={() => setSelectedLog(log)} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {page && totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <span className="demo-muted" style={{ fontSize: '0.85rem' }}>
              Page {currentPage} of {totalPages} — {page.total.toLocaleString()} total
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="demo-button demo-button-secondary"
                disabled={currentPage <= 1}
                onClick={() => goPage(-1)}
              >
                ← Prev
              </button>
              <button
                className="demo-button demo-button-secondary"
                disabled={currentPage >= totalPages}
                onClick={() => goPage(1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail drawer ── */}
      <DetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
    </>
  )
}
