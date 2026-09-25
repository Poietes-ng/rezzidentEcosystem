import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import type {ActivityLogFilters, ActivityLogItem, ActivitySummaryStats, PaginatedActivityLogs} from '#/features/activity-logs/api';
import {
  fetchActivityLogs,
  fetchActivitySummary
  
  
  
  
} from '#/features/activity-logs/api'

export const Route = createFileRoute('/_authenticated/activity-logs')({
  component: ActivityLogsPage,
})

// ── Helpers ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  user_login: 'Login',
  pin_locked: 'PIN Locked',
  bill_created: 'Bill',
  payment_received: 'Payment',
  invoice_created: 'Invoice',
  visitor_code: 'Visitor Code',
  visitor_arrival: 'Arrival',
  visitor_departure: 'Departure',
  staff_created: 'Staff',
  expense_created: 'Expense',
  expense_approved: 'Expense Approved',
  verification_submitted: 'Verification',
  verification_approved: 'Verified',
  role_changed: 'Role Change',
  estate_created: 'Estate',
  subaccount_created: 'Subaccount',
}

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  user_login: { bg: 'rgba(79,184,178,0.12)', text: 'var(--lagoon-deep)', dot: 'var(--lagoon)' },
  pin_locked: { bg: 'rgba(196,126,42,0.12)', text: '#a06820', dot: '#c47e2a' },
  bill_created: { bg: 'rgba(47,106,74,0.12)', text: 'var(--palm)', dot: 'var(--palm)' },
  payment_received: { bg: 'rgba(47,106,74,0.18)', text: 'var(--palm)', dot: 'var(--palm)' },
  visitor_arrival: {
    bg: 'rgba(79,184,178,0.12)',
    text: 'var(--lagoon-deep)',
    dot: 'var(--lagoon)',
  },
  visitor_departure: {
    bg: 'rgba(23,58,64,0.08)',
    text: 'var(--sea-ink-soft)',
    dot: 'var(--sea-ink-soft)',
  },
  role_changed: { bg: 'rgba(196,71,71,0.1)', text: '#9f3030', dot: '#c44747' },
  estate_created: { bg: 'rgba(196,71,71,0.08)', text: '#9f3030', dot: '#c44747' },
  default: { bg: 'rgba(65,97,102,0.1)', text: 'var(--sea-ink-soft)', dot: 'var(--sea-ink-soft)' },
}

function typeStyle(type: string) {
  return TYPE_COLORS[type] ?? TYPE_COLORS.default
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
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

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
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

function LogRow({ log, onClick }: { log: ActivityLogItem; onClick: () => void }) {
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

function DetailDrawer({ log, onClose }: { log: ActivityLogItem | null; onClose: () => void }) {
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
          ].map(({ label, value }) => (
            <div
              key={label}
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
                {label}
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

// ── Page ───────────────────────────────────────────────────────────────────

function ActivityLogsPage() {
  // In a real app these would come from a global auth context / store
  const TOKEN = localStorage.getItem('access_token') ?? ''

  const [summary, setSummary] = useState<ActivitySummaryStats | null>(null)
  const [page, setPage] = useState<PaginatedActivityLogs | null>(null)
  const [filters, setFilters] = useState<ActivityLogFilters>({ limit: 20, skip: 0 })
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>()

  // Load summary once
  useEffect(() => {
    fetchActivitySummary(TOKEN)
      .then(setSummary)
      .catch(() => {})
  }, [TOKEN])

  // Load logs when filters change
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchActivityLogs(filters, TOKEN)
      .then(setPage)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [filters, TOKEN])

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

        {/* ── Summary stats ── */}
        {summary && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <StatCard label="Total events" value={summary.total_activities} icon="📋" />
            <StatCard label="Today" value={summary.activities_today} icon="☀️" />
            <StatCard label="This week" value={summary.activities_this_week} icon="📅" />
            <StatCard label="This month" value={summary.activities_this_month} icon="📆" />
          </div>
        )}

        {/* ── Top types + active users ── */}
        {summary && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div className="demo-panel">
              <div className="demo-section-title" style={{ marginBottom: '1rem' }}>
                Top Activity Types
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {summary.top_activity_types.map((t) => {
                  const pct = Math.round((t.count / (summary.total_activities || 1)) * 100)
                  const style = typeStyle(t.type)
                  return (
                    <div
                      key={t.type}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                    >
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
              <div className="demo-section-title" style={{ marginBottom: '1rem' }}>
                Most Active Users
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {summary.most_active_users.length === 0 ? (
                  <p className="demo-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                    No data yet.
                  </p>
                ) : (
                  summary.most_active_users.map((u, i) => (
                    <div
                      key={u.user_name}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                    >
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
        )}

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
