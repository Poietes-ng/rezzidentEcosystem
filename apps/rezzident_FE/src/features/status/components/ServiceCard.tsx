import { getStatusStyle, formatStatus } from '../utils'
import type { FullStatusReport } from '#/features/status/api'

export function ServiceCard({ service }: { service: FullStatusReport['services'][0] }) {
  const style = getStatusStyle(service.status)
  return (
    <div className="demo-card relative flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="m-0 text-[1.05rem] font-extrabold text-[var(--sea-ink)]">
            {service.name}
          </h3>
          <p className="mx-0 mt-[0.2rem] mb-0 text-[0.82rem] text-[var(--sea-ink-soft)]">
            {service.description}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-[0.35rem] rounded-full px-2.5 py-1 text-[0.72rem] font-bold"
          style={{ background: style.bg, color: style.text }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.dot }} />
          {formatStatus(service.status)}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between pt-2">
        {service.error ? (
          <div className="text-[0.75rem] font-semibold text-[#9f3030]">{service.error}</div>
        ) : service.response_time_ms !== null ? (
          <div className="text-[0.8rem] font-semibold text-[var(--sea-ink-soft)]">
            {service.response_time_ms} ms
          </div>
        ) : (
          <div className="text-[0.8rem] text-[var(--sea-ink-soft)]">—</div>
        )}
      </div>
    </div>
  )
}
