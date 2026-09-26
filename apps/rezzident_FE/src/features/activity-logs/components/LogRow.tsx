import type { ActivityLogItem } from '#/features/activity-logs/api'
import { TYPE_LABELS, typeStyle, timeAgo, formatDate } from '#/features/activity-logs/utils'

export function LogRow({ log, onClick }: { log: ActivityLogItem; onClick: () => void }) {
  const style = typeStyle(log.activity_type)
  const label = TYPE_LABELS[log.activity_type] ?? log.activity_type
  return (
    <tr onClick={onClick} className="activity-log-row cursor-pointer">
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ background: style.dot }}
          />
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ background: style.bg, color: style.text }}
          >
            {label}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 align-middle text-sm text-[var(--sea-ink)]">
        <div className="font-semibold">{log.action}</div>
        <div className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">{log.description}</div>
      </td>
      <td className="px-4 py-3 align-middle text-[0.82rem] text-[var(--sea-ink-soft)]">
        {log.user_name}
        {log.user_role && (
          <span className="ml-1.5 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-1.5 py-0.5 text-[0.7rem] text-[var(--sea-ink-soft)]">
            {log.user_role}
          </span>
        )}
      </td>
      <td className="px-4 py-3 align-middle text-sm whitespace-nowrap text-[var(--sea-ink-soft)]">
        <span title={formatDate(log.timestamp)}>{timeAgo(log.timestamp)}</span>
      </td>
    </tr>
  )
}
