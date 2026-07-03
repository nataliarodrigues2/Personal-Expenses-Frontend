export default function Skeleton({ className = '' }) {
  return (
    <div
      className={[
        'animate-shimmer rounded-lg bg-gradient-to-r from-surface-2 via-surface-3 to-surface-2 bg-[length:200%_100%]',
        className,
      ].join(' ')}
      aria-hidden="true"
    />
  )
}
