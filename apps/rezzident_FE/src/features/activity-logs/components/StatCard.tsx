export function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="demo-panel flex flex-col gap-2 rounded-2xl px-6 py-5">
      <span className="text-2xl">{icon}</span>
      <div className="text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-extrabold text-[var(--sea-ink)]">
        {value.toLocaleString()}
      </div>
      <div className="text-[0.78rem] font-semibold tracking-wider text-[var(--sea-ink-soft)]">
        {label}
      </div>
    </div>
  )
}
