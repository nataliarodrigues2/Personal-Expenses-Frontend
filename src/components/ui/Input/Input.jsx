export default function Input({ label, icon, rightSlot, error, labelAction, id, className = '', ...props }) {
  const inputId = id || props.name

  return (
    <div className="flex flex-col gap-[7px]">
      {(label || labelAction) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-[12.5px] font-semibold text-text-2" htmlFor={inputId}>
              {label}
            </label>
          )}
          {labelAction}
        </div>
      )}

      <div
        className={[
          'flex items-center gap-2.5 rounded-ctl border bg-surface px-[13px] py-3 transition',
          error
            ? 'border-danger bg-danger-soft focus-within:shadow-[0_0_0_4px_var(--color-danger-border)]'
            : 'border-border-strong focus-within:border-primary focus-within:shadow-[0_0_0_4px_var(--color-ring)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {icon && <span className="flex flex-none text-text-3">{icon}</span>}
        <input
          id={inputId}
          className="w-full border-none bg-transparent font-sans text-sm text-text outline-none placeholder:text-text-3"
          {...props}
        />
        {rightSlot}
      </div>

      {error && (
        <p className="mt-0.5 flex items-center gap-1 text-xs text-danger">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
