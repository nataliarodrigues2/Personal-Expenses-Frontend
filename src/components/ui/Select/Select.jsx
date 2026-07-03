export default function Select({ label, error, placeholder, options = [], id, className = '', ...props }) {
  const selectId = id || props.name

  return (
    <div className="flex flex-col gap-[7px]">
      {label && (
        <label className="text-[12.5px] font-semibold text-text-2" htmlFor={selectId}>
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={[
            'w-full appearance-none rounded-ctl border bg-surface py-[11px] pl-[13px] pr-9 text-[13.5px] font-medium text-text outline-none transition',
            error
              ? 'border-danger bg-danger-soft focus:shadow-[0_0_0_4px_var(--color-danger-border)]'
              : 'border-border-strong focus:border-primary focus:shadow-[0_0_0_4px_var(--color-ring)]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-3"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {error && <p className="mt-0.5 text-xs text-danger">{error}</p>}
    </div>
  )
}
