import Button from '../Button/Button'

const RetryIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 12a8 8 0 018-8c2.5 0 4.7 1.1 6.2 2.9M20 4v4h-4M20 12a8 8 0 01-8 8c-2.5 0-4.7-1.1-6.2-2.9M4 20v-4h4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function ErrorState({ title = 'Falha ao carregar', description, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-danger-border bg-danger-soft text-danger">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3l9 16H3L12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <h4 className="text-[15px] font-bold text-text">{title}</h4>
      {description && <p className="max-w-[260px] text-[12.5px] leading-relaxed text-text-3">{description}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RetryIcon} onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
