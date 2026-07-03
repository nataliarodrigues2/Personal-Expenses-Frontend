export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-2 text-text-3">
        {icon}
      </span>
      <h4 className="text-[15px] font-bold text-text">{title}</h4>
      {description && <p className="max-w-[240px] text-[12.5px] leading-relaxed text-text-3">{description}</p>}
      {action}
    </div>
  )
}
