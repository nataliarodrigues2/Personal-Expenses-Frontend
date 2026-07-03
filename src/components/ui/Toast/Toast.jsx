import { useEffect } from 'react'

const VARIANT_CLASSES = {
  success: { border: 'border-l-success', iconBg: 'bg-success-soft', iconColor: 'text-success' },
  warning: { border: 'border-l-warning', iconBg: 'bg-warning-soft', iconColor: 'text-warning' },
  danger: { border: 'border-l-danger', iconBg: 'bg-danger-soft', iconColor: 'text-danger' },
  info: { border: 'border-l-info', iconBg: 'bg-info-soft', iconColor: 'text-info' },
}

const DEFAULT_ICONS = {
  success: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  danger: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
}

export default function Toast({ variant = 'success', title, description, icon, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration || !onClose) return
    const id = setTimeout(onClose, duration)
    return () => clearTimeout(id)
  }, [duration, onClose])

  const styles = VARIANT_CLASSES[variant]

  return (
    <div
      className={[
        'flex items-center gap-3 rounded-xl border border-border border-l-[3px] bg-surface px-4 py-[13px] shadow-sh',
        styles.border,
      ].join(' ')}
      role="status"
    >
      <span className={['flex h-8 w-8 flex-none items-center justify-center rounded-[9px]', styles.iconBg, styles.iconColor].join(' ')}>
        {icon ?? DEFAULT_ICONS[variant]}
      </span>
      <div>
        <div className="text-[13.5px] font-semibold text-text">{title}</div>
        {description && <div className="text-xs text-text-3">{description}</div>}
      </div>
    </div>
  )
}
