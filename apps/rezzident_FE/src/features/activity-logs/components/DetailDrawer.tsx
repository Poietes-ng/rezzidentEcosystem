import type { ActivityLogItem } from '#/features/activity-logs/api'
import { TYPE_LABELS, typeStyle, formatDate } from '#/features/activity-logs/utils'

export function DetailDrawer({
  log,
  onClose,
}: {
  log: ActivityLogItem | null
  onClose: () => void
}) {
  if (!log) return null
  const style = typeStyle(log.activity_type)
  const label = TYPE_LABELS[log.activity_type] ?? log.activity_type

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 animate-[fade-in_160ms_ease_both] bg-[#0a1418]/35 backdrop-blur-sm"
      />
      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 flex w-[min(420px,100vw)] animate-[slide-in-right_220ms_cubic-bezier(0.16,1,0.3,1)_both] flex-col gap-5 overflow-y-auto border-l border-[var(--line)] bg-[linear-gradient(165deg,var(--surface-strong),var(--surface))] px-7 py-8 shadow-[-18px_0_44px_rgba(23,58,64,0.14)] backdrop-blur-md"
        style={{ zIndex: 41 }}
      >
        <div className="flex items-center justify-between">
          <span className="island-kicker">Activity Detail</span>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)]"
          >
            ✕
          </button>
        </div>

        <div>
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: style.bg, color: style.text }}
          >
            {label}
          </span>
          <h2 className="mt-2.5 text-xl font-extrabold text-[var(--sea-ink)]">{log.action}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
            {log.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'User', value: log.user_name },
            { label: 'Role', value: log.user_role ?? '—' },
            { label: 'Target type', value: log.target_type ?? '—' },
            { label: 'When', value: formatDate(log.timestamp) },
          ].map(({ label: itemLabel, value }) => (
            <div key={itemLabel} className="demo-card rounded-xl p-3">
              <div className="mb-1 text-[0.7rem] font-bold tracking-widest text-[var(--sea-ink-soft)] uppercase">
                {itemLabel}
              </div>
              <div className="text-sm font-semibold break-all text-[var(--sea-ink)]">{value}</div>
            </div>
          ))}
        </div>

        {log.target_id && (
          <div className="demo-code-block text-xs">
            <div className="mb-1.5 text-[0.7rem] font-bold tracking-widest text-[var(--sea-ink-soft)] uppercase">
              Target ID
            </div>
            <code className="border-none bg-transparent p-0 text-[0.82rem] break-all">
              {log.target_id}
            </code>
          </div>
        )}

        <div className="demo-code-block text-xs">
          <div className="mb-1.5 text-[0.7rem] font-bold tracking-widest text-[var(--sea-ink-soft)] uppercase">
            Log ID
          </div>
          <code className="border-none bg-transparent p-0 text-[0.78rem] break-all">{log.id}</code>
        </div>
      </aside>
    </>
  )
}
