const VARIANT_CLASSES = {
  primary: 'bg-primary text-white shadow-sh-sm hover:bg-primary-hover',
  secondary: 'bg-surface text-text border border-border-strong hover:bg-surface-2 hover:border-text-3',
  ghost: 'bg-transparent text-primary hover:bg-primary-soft',
  danger: 'bg-danger-soft text-danger border border-danger-border hover:bg-danger hover:text-white',
}

const SIZE_CLASSES = {
  sm: 'px-[13px] py-[7px] text-xs',
  md: 'px-[18px] py-[11px] text-[13.5px]',
  lg: 'px-[22px] py-[14px] text-[15px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  icon,
  children,
  className = '',
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-ctl font-semibold transition-colors cursor-pointer',
    'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface-3 disabled:text-text-3 disabled:shadow-none',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} type={type} disabled={disabled || loading} {...props}>
      {loading ? (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current"
          aria-hidden="true"
        />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
