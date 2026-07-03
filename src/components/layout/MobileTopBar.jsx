import { useAuth } from '../../hooks/useAuth'
import { LogoutIcon } from './navLinks'

export default function MobileTopBar() {
  const { logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-primary to-primary-hover">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
              stroke="#fff"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3.1" stroke="#fff" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="0.9" fill="#fff" />
          </svg>
        </div>
        <span className="text-[15px] font-extrabold text-text">Íris</span>
      </div>
      <button
        type="button"
        onClick={logout}
        title="Sair"
        aria-label="Sair"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-3 transition-colors hover:bg-danger-soft hover:text-danger"
      >
        {LogoutIcon}
      </button>
    </header>
  )
}
