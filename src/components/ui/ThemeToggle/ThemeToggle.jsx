import { useTheme } from '../../../hooks/useTheme'

const SunIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
)

const MoonIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
)

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={label}
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-surface text-primary shadow-sh-sm transition hover:border-primary hover:shadow-sh"
      >
        {isDark ? MoonIcon : SunIcon}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-border-strong bg-surface py-[7px] pl-[14px] pr-[7px] text-text shadow-sh-sm transition hover:border-primary hover:shadow-sh"
      aria-label={label}
    >
      <span className="whitespace-nowrap text-[13px] font-semibold">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary-soft text-primary">
        {isDark ? MoonIcon : SunIcon}
      </span>
    </button>
  )
}
