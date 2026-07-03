export default function Card({ children, padding = true, className = '', ...props }) {
  return (
    <div
      className={[
        'rounded-card border border-border bg-surface shadow-sh-sm',
        padding ? 'p-[26px]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
