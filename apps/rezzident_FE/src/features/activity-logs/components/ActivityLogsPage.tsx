import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LogRow } from './LogRow'
import { DetailDrawer } from './DetailDrawer'
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

      <div className="demo-page rise-in pt-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <span className="island-kicker">Admin</span>
          <h1 className="demo-title mt-1.5">Activity Logs</h1>
          <p className="demo-muted mt-2 text-[0.95rem]">
            Full audit trail — every action across the estate.
          </p>
        </div>

        {/* ── Summary stats & Top types ── */}
        <ActivityLogsSummary summary={summary} />

        {/* ── Filters ── */}
        <div className="demo-panel mb-5 flex flex-wrap items-center gap-3">
          <input
            className="demo-input demo-input-fit min-w-[240px] flex-1"
            placeholder="🔍  Search description or action…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select
            className="demo-select demo-input-fit min-w-[160px]"
            value={selectedType}
            onChange={(e) => handleTypeFilter(e.target.value)}
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
        <div className="demo-table-shell mb-6">
          {error && <div className="demo-alert demo-alert-danger m-4 rounded-xl">⚠️ {error}</div>}
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-[spin_700ms_linear_infinite] rounded-full border-[3px] border-[var(--line)] border-t-[var(--lagoon)]" />
              <p className="demo-muted m-0 text-[0.9rem]">Loading logs…</p>
            </div>
          ) : (
            <table className="demo-table">
              <thead>
                <tr>
                  <th className="w-[140px]">Type</th>
                  <th>Event</th>
                  <th className="w-[180px]">User</th>
                  <th className="w-[110px]">When</th>
                </tr>
              </thead>
              <tbody>
                {page?.items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-[var(--sea-ink-soft)]">
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="demo-muted text-[0.85rem]">
              Page {currentPage} of {totalPages} — {page.total.toLocaleString()} total
            </span>
            <div className="flex gap-2">
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
