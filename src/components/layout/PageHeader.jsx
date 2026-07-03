export default function PageHeader({ title, subtitle, badge, actions }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-4 md:px-6">
      <div>
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-[19px] font-extrabold tracking-tight text-text">{title}</h1>
          {badge !== undefined && badge !== null && (
            <span className="rounded-full border border-border bg-surface-2 px-[9px] py-0.5 text-[12.5px] tabular-nums text-text-3">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-px text-[12.5px] text-text-3">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </header>
  )
}
